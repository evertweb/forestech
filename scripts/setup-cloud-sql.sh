#!/bin/bash

# ============================================================================
# CONFIGURACIÓN AUTOMÁTICA CLOUD SQL
# Forestech Combustibles - Migración de Azure SQL a Cloud SQL PostgreSQL
# ============================================================================

set -e  # Exit on any error

PROJECT_ID="liquidacionapp-62962"
REGION="us-central1"
INSTANCE_NAME="forestech-combustibles"
DATABASE_NAME="forestech_combustibles"
USER_NAME="forestech_user"

echo "🚀 Configurando Cloud SQL para Forestech Combustibles..."
echo "========================================================="
echo "📍 Proyecto: $PROJECT_ID"
echo "🌎 Región: $REGION"
echo "🗄️ Instancia: $INSTANCE_NAME"
echo ""

# ============================================================================
# PASO 1: Verificar y configurar proyecto
# ============================================================================

echo "🔍 Verificando configuración del proyecto..."
gcloud config set project $PROJECT_ID

echo "🔌 Habilitando APIs necesarias..."
gcloud services enable sqladmin.googleapis.com
gcloud services enable secretmanager.googleapis.com

# ============================================================================
# PASO 2: Crear instancia Cloud SQL
# ============================================================================

echo "🏗️ Creando instancia Cloud SQL PostgreSQL..."

# Verificar si la instancia ya existe
if gcloud sql instances describe $INSTANCE_NAME --project=$PROJECT_ID &>/dev/null; then
    echo "⚠️ La instancia $INSTANCE_NAME ya existe. Saltando creación..."
else
    echo "📦 Creando nueva instancia PostgreSQL..."
    gcloud sql instances create $INSTANCE_NAME \
        --database-version=POSTGRES_15 \
        --tier=db-f1-micro \
        --region=$REGION \
        --storage-size=20GB \
        --storage-type=SSD \
        --storage-auto-increase \
        --backup-start-time=03:00 \
        --maintenance-window-day=SUN \
        --maintenance-window-hour=02 \
        --maintenance-release-channel=production \
        --deletion-protection \
        --project=$PROJECT_ID
    
    echo "✅ Instancia Cloud SQL creada exitosamente"
fi

# ============================================================================
# PASO 3: Configurar base de datos y usuario
# ============================================================================

echo "🗃️ Configurando base de datos y usuario..."

# Crear base de datos
if gcloud sql databases describe $DATABASE_NAME --instance=$INSTANCE_NAME --project=$PROJECT_ID &>/dev/null; then
    echo "⚠️ Base de datos $DATABASE_NAME ya existe"
else
    echo "📋 Creando base de datos $DATABASE_NAME..."
    gcloud sql databases create $DATABASE_NAME \
        --instance=$INSTANCE_NAME \
        --project=$PROJECT_ID
    echo "✅ Base de datos creada"
fi

# Generar password segura
if ! gcloud secrets describe cloud-sql-password --project=$PROJECT_ID &>/dev/null; then
    echo "🔐 Generando password segura para usuario..."
    SECURE_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
    
    # Guardar password en Secret Manager
    echo "$SECURE_PASSWORD" | gcloud secrets create cloud-sql-password \
        --replication-policy="automatic" \
        --data-file=- \
        --project=$PROJECT_ID
    
    echo "🔑 Password guardada en Secret Manager: cloud-sql-password"
else
    echo "🔑 Password ya existe en Secret Manager"
    SECURE_PASSWORD=$(gcloud secrets versions access latest --secret="cloud-sql-password" --project=$PROJECT_ID)
fi

# Crear usuario
echo "👤 Configurando usuario $USER_NAME..."
if gcloud sql users describe $USER_NAME --instance=$INSTANCE_NAME --project=$PROJECT_ID &>/dev/null; then
    echo "⚠️ Usuario $USER_NAME ya existe. Actualizando password..."
    gcloud sql users set-password $USER_NAME \
        --instance=$INSTANCE_NAME \
        --password="$SECURE_PASSWORD" \
        --project=$PROJECT_ID
else
    echo "🆕 Creando nuevo usuario $USER_NAME..."
    gcloud sql users create $USER_NAME \
        --instance=$INSTANCE_NAME \
        --password="$SECURE_PASSWORD" \
        --project=$PROJECT_ID
fi

echo "✅ Usuario configurado exitosamente"

# ============================================================================
# PASO 4: Configurar conexiones y seguridad
# ============================================================================

echo "🔒 Configurando seguridad y conexiones..."

# Permitir conexiones de Cloud Functions
echo "🌐 Configurando conexiones desde Cloud Functions..."

# Obtener la dirección IP de la instancia para referencia
INSTANCE_IP=$(gcloud sql instances describe $INSTANCE_NAME --project=$PROJECT_ID --format="value(ipAddresses[0].ipAddress)")
CONNECTION_NAME="$PROJECT_ID:$REGION:$INSTANCE_NAME"

echo "📍 Información de conexión:"
echo "   IP Address: $INSTANCE_IP"
echo "   Connection Name: $CONNECTION_NAME"

# ============================================================================
# PASO 5: Crear archivo de configuración para Firebase Functions
# ============================================================================

echo "📝 Creando configuración para Firebase Functions..."

# Crear directorio si no existe
mkdir -p functions/config

# Crear archivo de configuración
cat > functions/config/cloud-sql-config.json << EOF
{
  "projectId": "$PROJECT_ID",
  "region": "$REGION",
  "instanceName": "$INSTANCE_NAME", 
  "databaseName": "$DATABASE_NAME",
  "userName": "$USER_NAME",
  "connectionName": "$CONNECTION_NAME",
  "instanceIp": "$INSTANCE_IP",
  "secretName": "cloud-sql-password",
  "environment": {
    "production": {
      "host": "/cloudsql/$CONNECTION_NAME",
      "port": null
    },
    "development": {
      "host": "$INSTANCE_IP",
      "port": 5432
    }
  }
}
EOF

echo "✅ Configuración guardada en functions/config/cloud-sql-config.json"

# ============================================================================
# PASO 6: Configurar variables de entorno para Functions
# ============================================================================

echo "🔧 Configurando variables de entorno..."

# Crear archivo .env para desarrollo local
cat > functions/.env.cloud-sql << EOF
# Cloud SQL Configuration
CLOUD_SQL_CONNECTION_NAME=$CONNECTION_NAME
CLOUD_SQL_DATABASE=$DATABASE_NAME
CLOUD_SQL_USER=$USER_NAME
CLOUD_SQL_PASSWORD_SECRET=cloud-sql-password
NODE_ENV=development

# Para desarrollo local (usar IP pública con proxy)
CLOUD_SQL_HOST=$INSTANCE_IP
CLOUD_SQL_PORT=5432
EOF

echo "✅ Variables de entorno configuradas en functions/.env.cloud-sql"

# ============================================================================
# PASO 7: Instalar dependencias necesarias
# ============================================================================

echo "📦 Instalando dependencias PostgreSQL..."

cd functions

# Verificar si package.json existe
if [ -f "package.json" ]; then
    # Instalar dependencias de PostgreSQL
    npm install pg @google-cloud/sql-connector --save
    
    echo "✅ Dependencias PostgreSQL instaladas"
else
    echo "⚠️ package.json no encontrado en functions/. Instalar manualmente:"
    echo "   npm install pg @google-cloud/sql-connector"
fi

cd ..

# ============================================================================
# PASO 8: Configurar permisos IAM
# ============================================================================

echo "🔐 Configurando permisos IAM..."

# Obtener el service account de Firebase Functions
FIREBASE_SA="github-action-1002035008@liquidacionapp-62962.iam.gserviceaccount.com"

# Otorgar permisos de Cloud SQL
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$FIREBASE_SA" \
    --role="roles/cloudsql.client" \
    --condition=None

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$FIREBASE_SA" \
    --role="roles/secretmanager.secretAccessor" \
    --condition=None

echo "✅ Permisos IAM configurados"

# ============================================================================
# PASO 9: Generar script de testing
# ============================================================================

echo "🧪 Generando script de testing..."

cat > scripts/test-cloud-sql-connection.js << 'EOF'
#!/usr/bin/env node

/**
 * Script de testing para Cloud SQL
 * Verifica conectividad y configuración
 */

import { Client } from 'pg';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./functions/config/cloud-sql-config.json', 'utf8'));

const testConnection = async () => {
  console.log('🧪 Testing Cloud SQL connection...');
  
  const client = new Client({
    host: config.instanceIp,
    port: 5432,
    database: config.databaseName,
    user: config.userName,
    password: process.env.CLOUD_SQL_PASSWORD || 'test-password',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Conectado a Cloud SQL');
    
    const result = await client.query('SELECT version()');
    console.log('📋 Versión PostgreSQL:', result.rows[0].version);
    
    await client.end();
    console.log('🎉 Test exitoso!');
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
};

testConnection();
EOF

chmod +x scripts/test-cloud-sql-connection.js

# ============================================================================
# RESUMEN FINAL
# ============================================================================

echo ""
echo "🎉 CONFIGURACIÓN CLOUD SQL COMPLETADA"
echo "====================================="
echo ""
echo "📊 Información de la instancia:"
echo "   Nombre: $INSTANCE_NAME"
echo "   Base de datos: $DATABASE_NAME"  
echo "   Usuario: $USER_NAME"
echo "   Connection String: $CONNECTION_NAME"
echo "   IP Address: $INSTANCE_IP"
echo ""
echo "📝 Archivos creados:"
echo "   ✅ functions/config/cloud-sql-config.json"
echo "   ✅ functions/.env.cloud-sql"
echo "   ✅ scripts/test-cloud-sql-connection.js"
echo ""
echo "🔧 Próximos pasos:"
echo "   1. Ejecutar migración de datos: node scripts/migrate-to-cloud-sql.js"
echo "   2. Desarrollar Firebase Functions: functions/src/cloudsql/"
echo "   3. Testing: node scripts/test-cloud-sql-connection.js"
echo "   4. Deploy: firebase deploy --only functions"
echo ""
echo "🔐 Password guardada en Secret Manager: cloud-sql-password"
echo "   Acceso: gcloud secrets versions access latest --secret=cloud-sql-password"
echo ""
echo "✅ Cloud SQL listo para migración!"