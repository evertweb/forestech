#!/bin/bash

# ============================================================================
# CONFIGURACIÓN CLOUD SQL SQL SERVER
# Forestech Combustibles - Migración Azure SQL → Cloud SQL SQL Server
# ============================================================================

set -e

PROJECT_ID="liquidacionapp-62962"
REGION="us-central1"
INSTANCE_NAME="forestech-combustibles-sql"
DATABASE_NAME="forestechCombus"
ADMIN_USER="forestech_admin"

echo "🚀 Configurando Cloud SQL SQL Server para Forestech..."
echo "===================================================="
echo "📍 Proyecto: $PROJECT_ID"
echo "🌎 Región: $REGION"  
echo "🗄️ Instancia: $INSTANCE_NAME"
echo "💾 Base de datos: $DATABASE_NAME"
echo ""

# ============================================================================
# PASO 1: Verificar proyecto y APIs
# ============================================================================

echo "🔍 Configurando proyecto..."
gcloud config set project $PROJECT_ID

echo "🔌 Habilitando APIs..."
gcloud services enable sqladmin.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable storage.googleapis.com

# ============================================================================
# PASO 2: Crear instancia Cloud SQL SQL Server
# ============================================================================

echo "🏗️ Creando Cloud SQL SQL Server..."

if gcloud sql instances describe $INSTANCE_NAME --project=$PROJECT_ID &>/dev/null; then
    echo "⚠️ Instancia $INSTANCE_NAME ya existe"
else
    echo "📦 Creando instancia SQL Server 2019..."
    
    # Crear instancia SQL Server (más potente que f1-micro para SQL Server)
    gcloud sql instances create $INSTANCE_NAME \
        --database-version=SQLSERVER_2019_STANDARD \
        --tier=db-custom-2-4096 \
        --region=$REGION \
        --storage-size=50GB \
        --storage-type=SSD \
        --storage-auto-increase \
        --backup-start-time=03:00 \
        --maintenance-window-day=SUN \
        --maintenance-window-hour=02 \
        --deletion-protection \
        --project=$PROJECT_ID
    
    echo "✅ Instancia SQL Server creada"
fi

# ============================================================================
# PASO 3: Configurar usuarios y seguridad
# ============================================================================

echo "🔐 Configurando seguridad..."

# Generar password segura para SQL Server
if ! gcloud secrets describe cloud-sql-sqlserver-password --project=$PROJECT_ID &>/dev/null; then
    echo "🔑 Generando password para SQL Server..."
    # SQL Server requiere passwords más complejas
    SECURE_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-20)AdMin123!
    
    echo "$SECURE_PASSWORD" | gcloud secrets create cloud-sql-sqlserver-password \
        --replication-policy="automatic" \
        --data-file=- \
        --project=$PROJECT_ID
    
    echo "🔑 Password guardada en Secret Manager"
else
    SECURE_PASSWORD=$(gcloud secrets versions access latest --secret="cloud-sql-sqlserver-password" --project=$PROJECT_ID)
fi

# El usuario 'sqlserver' es el admin por defecto en Cloud SQL SQL Server
echo "👤 Configurando password del usuario sqlserver..."
gcloud sql users set-password sqlserver \
    --instance=$INSTANCE_NAME \
    --password="$SECURE_PASSWORD" \
    --project=$PROJECT_ID

# ============================================================================
# PASO 4: Crear base de datos
# ============================================================================

echo "🗃️ Creando base de datos..."

if gcloud sql databases describe $DATABASE_NAME --instance=$INSTANCE_NAME --project=$PROJECT_ID &>/dev/null; then
    echo "⚠️ Base de datos $DATABASE_NAME ya existe"
else
    gcloud sql databases create $DATABASE_NAME \
        --instance=$INSTANCE_NAME \
        --project=$PROJECT_ID
    echo "✅ Base de datos $DATABASE_NAME creada"
fi

# ============================================================================
# PASO 5: Configurar Storage Bucket para backups
# ============================================================================

BUCKET_NAME="${PROJECT_ID}-sql-backups"
echo "🪣 Configurando Storage Bucket para backups..."

if gsutil ls gs://$BUCKET_NAME &>/dev/null; then
    echo "⚠️ Bucket gs://$BUCKET_NAME ya existe"
else
    gsutil mb -l $REGION gs://$BUCKET_NAME
    echo "✅ Bucket de backups creado: gs://$BUCKET_NAME"
fi

# Dar permisos a Cloud SQL para acceder al bucket
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$(gcloud sql instances describe $INSTANCE_NAME --format='value(serviceAccountEmailAddress)')" \
    --role="roles/storage.objectAdmin" \
    --condition=None

# ============================================================================
# PASO 6: Obtener información de conexión
# ============================================================================

echo "📍 Obteniendo información de conexión..."

INSTANCE_IP=$(gcloud sql instances describe $INSTANCE_NAME --project=$PROJECT_ID --format="value(ipAddresses[0].ipAddress)")
CONNECTION_NAME="$PROJECT_ID:$REGION:$INSTANCE_NAME"

echo "📋 Información de la instancia:"
echo "   IP Address: $INSTANCE_IP"
echo "   Connection Name: $CONNECTION_NAME"

# ============================================================================
# PASO 7: Crear configuración para Firebase Functions
# ============================================================================

echo "📝 Creando configuración para Functions..."

mkdir -p functions/config

cat > functions/config/cloud-sql-sqlserver-config.json << EOF
{
  "projectId": "$PROJECT_ID",
  "region": "$REGION",
  "instanceName": "$INSTANCE_NAME",
  "databaseName": "$DATABASE_NAME", 
  "adminUser": "sqlserver",
  "connectionName": "$CONNECTION_NAME",
  "instanceIp": "$INSTANCE_IP",
  "secretName": "cloud-sql-sqlserver-password",
  "backupBucket": "$BUCKET_NAME",
  "environment": {
    "production": {
      "server": "/cloudsql/$CONNECTION_NAME",
      "options": {
        "encrypt": false,
        "trustServerCertificate": true,
        "enableArithAbort": true,
        "instanceName": "$INSTANCE_NAME"
      }
    },
    "development": {
      "server": "$INSTANCE_IP", 
      "port": 1433,
      "options": {
        "encrypt": true,
        "trustServerCertificate": true,
        "enableArithAbort": true
      }
    }
  }
}
EOF

# ============================================================================
# PASO 8: Crear archivo de conexión para SQL Server
# ============================================================================

echo "🔗 Creando módulo de conexión SQL Server..."

cat > functions/src/cloudsql/sqlserver-connection.js << 'EOF'
/**
 * Cloud SQL SQL Server Connection
 * Conexión optimizada para SQL Server en Cloud Functions
 */

import sql from 'mssql';
import admin from 'firebase-admin';

class CloudSQLServerConnection {
  constructor() {
    this.pool = null;
    this.isConnected = false;
    this.config = null;
  }

  async getConfig() {
    if (this.config) return this.config;

    // Obtener password desde Secret Manager
    const password = await this.getSecretPassword();
    
    this.config = {
      server: process.env.NODE_ENV === 'production'
        ? '/cloudsql/liquidacionapp-62962:us-central1:forestech-combustibles-sql'
        : process.env.CLOUD_SQL_SERVER_IP,
      database: 'forestechCombus',
      user: 'sqlserver',
      password: password,
      port: process.env.NODE_ENV === 'production' ? undefined : 1433,
      options: {
        encrypt: process.env.NODE_ENV !== 'production',
        trustServerCertificate: true,
        enableArithAbort: true,
        connectionTimeout: 30000,
        requestTimeout: 30000,
      },
      pool: {
        max: 5,
        min: 0,
        idleTimeoutMillis: 30000,
        acquireTimeoutMillis: 30000
      }
    };

    return this.config;
  }

  async getSecretPassword() {
    try {
      const secretName = 'projects/liquidacionapp-62962/secrets/cloud-sql-sqlserver-password/versions/latest';
      const [version] = await admin.secretmanager().accessSecretVersion({name: secretName});
      return version.payload.data.toString();
    } catch (error) {
      console.error('Error obteniendo password:', error);
      throw new Error('No se pudo obtener la contraseña de Secret Manager');
    }
  }

  async connect() {
    if (this.pool && this.isConnected) {
      return this.pool;
    }

    try {
      console.log('🔌 Conectando a Cloud SQL SQL Server...');
      const config = await this.getConfig();
      
      this.pool = await sql.connect(config);
      this.isConnected = true;
      
      console.log('✅ Conectado a Cloud SQL SQL Server');
      return this.pool;
    } catch (error) {
      console.error('❌ Error conectando a SQL Server:', error);
      throw new Error(`SQL Server connection failed: ${error.message}`);
    }
  }

  async query(queryText, params = {}) {
    const pool = await this.connect();
    try {
      const request = pool.request();
      
      // Agregar parámetros
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });

      const result = await request.query(queryText);
      return result.recordset || [];
    } catch (error) {
      console.error('❌ Error en query SQL Server:', error);
      throw error;
    }
  }

  async execute(command, params = {}) {
    const pool = await this.connect();
    try {
      const request = pool.request();
      
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });

      const result = await request.query(command);
      
      return {
        success: true,
        rowsAffected: result.rowsAffected?.[0] || 0,
        recordset: result.recordset
      };
    } catch (error) {
      console.error('❌ Error ejecutando comando SQL Server:', error);
      throw error;
    }
  }

  async transaction(callback) {
    const pool = await this.connect();
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async disconnect() {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
      this.isConnected = false;
      console.log('🔌 Desconectado de Cloud SQL SQL Server');
    }
  }
}

// Singleton
const cloudSqlServerConnection = new CloudSQLServerConnection();
export default cloudSqlServerConnection;
EOF

# ============================================================================
# PASO 9: Variables de entorno
# ============================================================================

echo "🔧 Configurando variables de entorno..."

cat > functions/.env.sqlserver << EOF
# Cloud SQL SQL Server Configuration
CLOUD_SQL_CONNECTION_NAME=$CONNECTION_NAME
CLOUD_SQL_DATABASE=$DATABASE_NAME
CLOUD_SQL_USER=sqlserver
CLOUD_SQL_PASSWORD_SECRET=cloud-sql-sqlserver-password
CLOUD_SQL_SERVER_IP=$INSTANCE_IP
NODE_ENV=development

# Backup bucket
BACKUP_BUCKET=$BUCKET_NAME
EOF

# ============================================================================
# PASO 10: Permisos IAM
# ============================================================================

echo "🔐 Configurando permisos IAM..."

FIREBASE_SA="github-action-1002035008@liquidacionapp-62962.iam.gserviceaccount.com"

# Permisos para Cloud SQL
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$FIREBASE_SA" \
    --role="roles/cloudsql.client" \
    --condition=None

# Permisos para Secret Manager  
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$FIREBASE_SA" \
    --role="roles/secretmanager.secretAccessor" \
    --condition=None

# Permisos para Storage (backups)
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$FIREBASE_SA" \
    --role="roles/storage.objectAdmin" \
    --condition=None

# ============================================================================
# PASO 11: Instalar dependencias
# ============================================================================

echo "📦 Verificando dependencias..."

cd functions
if [ -f "package.json" ]; then
    # mssql ya está instalado, pero verificamos versión
    npm list mssql || echo "⚠️ Verificar que mssql esté instalado"
    echo "✅ Dependencias SQL Server verificadas"
else
    echo "⚠️ Instalar manualmente: npm install mssql"
fi
cd ..

# ============================================================================
# RESUMEN FINAL
# ============================================================================

echo ""
echo "🎉 CLOUD SQL SQL SERVER CONFIGURADO"
echo "===================================="
echo ""
echo "📊 Información de conexión:"
echo "   Instancia: $INSTANCE_NAME"
echo "   Base de datos: $DATABASE_NAME"
echo "   Usuario: sqlserver"
echo "   Connection: $CONNECTION_NAME" 
echo "   IP: $INSTANCE_IP"
echo ""
echo "📁 Archivos creados:"
echo "   ✅ functions/config/cloud-sql-sqlserver-config.json"
echo "   ✅ functions/src/cloudsql/sqlserver-connection.js"
echo "   ✅ functions/.env.sqlserver"
echo ""
echo "🔐 Credenciales:"
echo "   Secret: cloud-sql-sqlserver-password"
echo "   Bucket: gs://$BUCKET_NAME"
echo ""
echo "🚀 Próximos pasos:"
echo "   1. Migrar datos: ./scripts/migrate-azure-to-cloudsql-sqlserver.sh"
echo "   2. Actualizar Functions: ./scripts/update-functions-sqlserver.sh"
echo "   3. Testing: ./scripts/test-sqlserver-connection.js"
echo ""
echo "✅ Listo para migración de Azure SQL!"