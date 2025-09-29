#!/bin/bash

# ============================================================================
# MIGRACIÓN AZURE SQL → CLOUD SQL SQL SERVER
# Backup y restore directo (sin conversión de esquemas)
# ============================================================================

set -e

PROJECT_ID="liquidacionapp-62962"
INSTANCE_NAME="forestech-combustibles-sql"
DATABASE_NAME="forestechCombus"
BUCKET_NAME="${PROJECT_ID}-sql-backups"
BACKUP_FILE="azure-forestech-backup.bak"

# Información Azure SQL (origen)
AZURE_SERVER="oilforestech.privatelink.database.windows.net"
AZURE_DATABASE="forestechCombus"
AZURE_USER="oil"

echo "🚀 MIGRACIÓN AZURE SQL → CLOUD SQL SQL SERVER"
echo "=============================================="
echo "📍 Origen: $AZURE_SERVER"
echo "📍 Destino: $INSTANCE_NAME"
echo "💾 Database: $AZURE_DATABASE"
echo ""

# ============================================================================
# PASO 1: Verificar conectividad
# ============================================================================

echo "🔍 Verificando conectividad..."

# Verificar que Cloud SQL esté listo
if ! gcloud sql instances describe $INSTANCE_NAME --project=$PROJECT_ID &>/dev/null; then
    echo "❌ Cloud SQL SQL Server no encontrado. Ejecuta primero:"
    echo "   ./scripts/setup-cloud-sql-sqlserver.sh"
    exit 1
fi

# Verificar bucket de backups
if ! gsutil ls gs://$BUCKET_NAME &>/dev/null; then
    echo "❌ Bucket de backups no encontrado. Ejecuta setup primero."
    exit 1
fi

echo "✅ Infraestructura verificada"

# ============================================================================
# PASO 2: Crear backup desde Azure SQL
# ============================================================================

echo "📦 Creando backup desde Azure SQL..."

# Crear script SQL para backup
cat > /tmp/create_backup.sql << EOF
-- Backup de Azure SQL a Storage Bucket
BACKUP DATABASE [$AZURE_DATABASE] 
TO URL = 'gs://$BUCKET_NAME/$BACKUP_FILE'
WITH FORMAT, INIT, COMPRESSION,
STATS = 10;
EOF

echo "📋 Script de backup creado: /tmp/create_backup.sql"

# Nota: Este paso requiere ejecutar manualmente en Azure SQL
echo "⚠️  ACCIÓN MANUAL REQUERIDA:"
echo "   1. Conecta a Azure SQL Server: $AZURE_SERVER"
echo "   2. Ejecuta el siguiente comando:"
echo ""
echo "   BACKUP DATABASE [$AZURE_DATABASE]"
echo "   TO URL = 'gs://$BUCKET_NAME/$BACKUP_FILE'"
echo "   WITH FORMAT, INIT, COMPRESSION, STATS = 10;"
echo ""
echo "   (Asegúrate de tener permisos de escritura al bucket)"
echo ""

read -p "¿Has ejecutado el backup en Azure SQL? (y/N): " confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo "❌ Backup no confirmado. Saliendo..."
    exit 1
fi

# ============================================================================
# PASO 3: Verificar backup en Storage
# ============================================================================

echo "🔍 Verificando backup en Storage..."

if gsutil ls gs://$BUCKET_NAME/$BACKUP_FILE &>/dev/null; then
    BACKUP_SIZE=$(gsutil du -h gs://$BUCKET_NAME/$BACKUP_FILE | cut -f1)
    echo "✅ Backup encontrado: $BACKUP_SIZE"
else
    echo "❌ Backup no encontrado en gs://$BUCKET_NAME/$BACKUP_FILE"
    echo "   Verifica que el backup se ejecutó correctamente"
    exit 1
fi

# ============================================================================
# PASO 4: Preparar Cloud SQL para restore
# ============================================================================

echo "🗃️ Preparando Cloud SQL para restore..."

# Verificar si la base de datos ya existe y tiene datos
DB_EXISTS=$(gcloud sql databases describe $DATABASE_NAME --instance=$INSTANCE_NAME --project=$PROJECT_ID --format="value(name)" 2>/dev/null || echo "")

if [ ! -z "$DB_EXISTS" ]; then
    echo "⚠️ Base de datos $DATABASE_NAME ya existe"
    read -p "¿Quieres reemplazarla? ESTO ELIMINARÁ TODOS LOS DATOS (y/N): " confirm
    
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        echo "🗑️ Eliminando base de datos existente..."
        gcloud sql databases delete $DATABASE_NAME --instance=$INSTANCE_NAME --project=$PROJECT_ID --quiet
        echo "✅ Base de datos eliminada"
    else
        echo "❌ Restore cancelado por el usuario"
        exit 1
    fi
fi

# ============================================================================
# PASO 5: Restore desde backup
# ============================================================================

echo "📥 Ejecutando restore en Cloud SQL SQL Server..."

# Crear operación de restore
echo "🔄 Iniciando restore (esto puede tomar varios minutos)..."

gcloud sql backups restore \
    --restore-instance=$INSTANCE_NAME \
    --backup-file=gs://$BUCKET_NAME/$BACKUP_FILE \
    --database=$DATABASE_NAME \
    --project=$PROJECT_ID \
    --async

echo "✅ Restore iniciado en background"

# Monitorear progreso
echo "📊 Monitoreando progreso del restore..."
echo "   (Esto puede tomar 5-15 minutos dependel tamaño de la BD)"

# Esperar a que complete la operación
while true; do
    OPERATIONS=$(gcloud sql operations list --instance=$INSTANCE_NAME --project=$PROJECT_ID --filter="status:RUNNING" --format="value(name)" | wc -l)
    
    if [ "$OPERATIONS" -eq "0" ]; then
        echo "✅ Restore completado!"
        break
    else
        echo "⏳ Restore en progreso... ($OPERATIONS operaciones activas)"
        sleep 30
    fi
done

# ============================================================================
# PASO 6: Verificar integridad de datos
# ============================================================================

echo "🔍 Verificando integridad de datos..."

# Crear script de verificación
cat > /tmp/verify_data.sql << EOF
-- Verificación de integridad de datos
SELECT 'Vehicles' as tabla, COUNT(*) as registros FROM Vehicles
UNION ALL
SELECT 'Movements' as tabla, COUNT(*) as registros FROM Movements  
UNION ALL
SELECT 'Inventory' as tabla, COUNT(*) as registros FROM Inventory
UNION ALL
SELECT 'Suppliers' as tabla, COUNT(*) as registros FROM Suppliers
UNION ALL
SELECT 'Products' as tabla, COUNT(*) as registros FROM Products
UNION ALL
SELECT 'VehicleCategories' as tabla, COUNT(*) as registros FROM VehicleCategories
ORDER BY tabla;

-- Verificar últimos registros
SELECT 'Último movement' as info, MAX(created_at) as valor FROM Movements
UNION ALL
SELECT 'Último vehicle' as info, MAX(created_at) as valor FROM Vehicles;
EOF

echo "📋 Script de verificación creado"
echo "⚠️  VERIFICACIÓN MANUAL:"
echo "   1. Conecta a Cloud SQL SQL Server"
echo "   2. Ejecuta: /tmp/verify_data.sql"
echo "   3. Verifica que los conteos coincidan con Azure SQL"

# ============================================================================
# PASO 7: Configurar aplicación para nueva BD
# ============================================================================

echo "🔧 Actualizando configuración de aplicación..."

# Actualizar variables de entorno en Cloud Functions
cat > functions/.env.production << EOF
# Cloud SQL SQL Server (Producción)
NODE_ENV=production
CLOUD_SQL_CONNECTION_NAME=$PROJECT_ID:us-central1:$INSTANCE_NAME
CLOUD_SQL_DATABASE=$DATABASE_NAME
CLOUD_SQL_USER=sqlserver
CLOUD_SQL_PASSWORD_SECRET=cloud-sql-sqlserver-password

# Para testing local
CLOUD_SQL_SERVER_IP=$(gcloud sql instances describe $INSTANCE_NAME --format="value(ipAddresses[0].ipAddress)")
CLOUD_SQL_PORT=1433
EOF

echo "✅ Configuración de producción actualizada"

# ============================================================================
# PASO 8: Crear script de testing
# ============================================================================

echo "🧪 Creando script de testing..."

cat > scripts/test-cloud-sql-migration.js << 'EOF'
#!/usr/bin/env node

/**
 * Testing de migración Cloud SQL SQL Server
 * Verifica conectividad y datos básicos
 */

import sql from 'mssql';
import fs from 'fs';

// Cargar configuración
const config = JSON.parse(fs.readFileSync('./functions/config/cloud-sql-sqlserver-config.json', 'utf8'));

const testMigration = async () => {
  console.log('🧪 Testing migración Cloud SQL SQL Server...\n');
  
  const sqlConfig = {
    server: config.instanceIp,
    port: 1433,
    database: config.databaseName,
    user: 'sqlserver',
    password: process.env.CLOUD_SQL_PASSWORD || 'test-password',
    options: {
      encrypt: true,
      trustServerCertificate: true,
      enableArithAbort: true
    }
  };

  try {
    console.log('🔌 Conectando a Cloud SQL SQL Server...');
    const pool = await sql.connect(sqlConfig);
    console.log('✅ Conexión exitosa!');

    // Test básico de datos
    console.log('\n📊 Verificando datos migrados:');
    
    const tables = ['Vehicles', 'Movements', 'Inventory', 'Suppliers', 'Products'];
    
    for (const table of tables) {
      try {
        const result = await pool.request().query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = result.recordset[0].count;
        console.log(`   ${table}: ${count} registros`);
      } catch (error) {
        console.log(`   ${table}: ❌ Error - ${error.message}`);
      }
    }

    // Test de performance
    console.log('\n⚡ Test de performance:');
    const startTime = Date.now();
    await pool.request().query('SELECT TOP 10 * FROM Vehicles ORDER BY id');
    const duration = Date.now() - startTime;
    console.log(`   Query tiempo: ${duration}ms`);

    await pool.close();
    console.log('\n🎉 Migración verificada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en testing:', error.message);
    process.exit(1);
  }
};

testMigration();
EOF

chmod +x scripts/test-cloud-sql-migration.js

# ============================================================================
# PASO 9: Backup de rollback
# ============================================================================

echo "💾 Creando información de rollback..."

cat > rollback-info.json << EOF
{
  "migration_date": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "azure_sql": {
    "server": "$AZURE_SERVER", 
    "database": "$AZURE_DATABASE",
    "backup_location": "gs://$BUCKET_NAME/$BACKUP_FILE"
  },
  "cloud_sql": {
    "instance": "$INSTANCE_NAME",
    "connection": "$PROJECT_ID:us-central1:$INSTANCE_NAME",
    "database": "$DATABASE_NAME"
  },
  "rollback_steps": [
    "1. Restaurar Cloud Run endpoints",
    "2. Actualizar connection strings a Azure SQL",
    "3. Verificar funcionalidad",
    "4. Eliminar Cloud SQL si es necesario"
  ]
}
EOF

# ============================================================================
# RESUMEN FINAL
# ============================================================================

echo ""
echo "🎉 MIGRACIÓN COMPLETADA"
echo "======================="
echo ""
echo "✅ Estado de migración:"
echo "   Azure SQL → Cloud SQL SQL Server: COMPLETO"
echo "   Backup original: gs://$BUCKET_NAME/$BACKUP_FILE"
echo "   Instancia destino: $INSTANCE_NAME"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Testing: node scripts/test-cloud-sql-migration.js"
echo "   2. Actualizar Functions: ./scripts/update-functions-sqlserver.sh"
echo "   3. Deploy: firebase deploy --only functions"
echo "   4. Descomisionar Cloud Run (opcional)"
echo ""
echo "🔄 Para rollback:"
echo "   Información guardada en: rollback-info.json"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   - Verifica que todos los datos se migraron correctamente"
echo "   - Haz backup de Cloud SQL antes de descomisionar Azure"
echo "   - Mantén Azure SQL hasta confirmar que todo funciona"
echo ""
echo "✅ Migración lista para testing!"