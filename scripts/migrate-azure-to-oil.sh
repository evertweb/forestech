#!/bin/bash

# ============================================================================
# MIGRACIÓN AZURE SQL → CLOUD SQL "OIL"
# Script personalizado para tu instancia específica
# ============================================================================

set -e

# Configuración de tu instancia Cloud SQL "oil"
PROJECT_ID="liquidacionapp-62962"
CLOUD_SQL_INSTANCE="oil"
CLOUD_SQL_CONNECTION="liquidacionapp-62962:us-central1:oil"
CLOUD_SQL_IP="34.61.242.157"
CLOUD_SQL_USER="sqlserver"
CLOUD_SQL_PASSWORD="123456789"
DATABASE_NAME="forestechCombus"

# Configuración Azure SQL (origen)
AZURE_SERVER="oilforestech.privatelink.database.windows.net"
AZURE_DATABASE="forestechCombus"
AZURE_USER="oil"

echo "🚀 MIGRACIÓN AZURE SQL → CLOUD SQL 'OIL'"
echo "=========================================="
echo "📍 Origen: $AZURE_SERVER"
echo "📍 Destino: $CLOUD_SQL_IP ($CLOUD_SQL_INSTANCE)"
echo "💾 Database: $DATABASE_NAME"
echo ""

# ============================================================================
# PASO 1: Verificar conectividad a Cloud SQL "oil"
# ============================================================================

echo "🔍 Verificando conectividad a Cloud SQL 'oil'..."

# Test de conexión básica
if ! node scripts/test-oil-connection.js &>/dev/null; then
    echo "❌ No se puede conectar a Cloud SQL 'oil'"
    echo "   Verifica:"
    echo "   - IP pública habilitada: ✅"
    echo "   - Tu IP en authorized networks (si es necesario)"
    echo "   - Usuario y contraseña correctos"
    echo ""
    echo "🧪 Ejecuta manualmente: node scripts/test-oil-connection.js"
    exit 1
fi

echo "✅ Conexión a Cloud SQL 'oil' verificada"

# ============================================================================
# PASO 2: Crear base de datos en Cloud SQL (si no existe)
# ============================================================================

echo "🗄️ Verificando/creando base de datos '$DATABASE_NAME'..."

# Script SQL para crear BD
cat > /tmp/create_database.sql << EOF
-- Crear base de datos si no existe
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '$DATABASE_NAME')
BEGIN
    CREATE DATABASE [$DATABASE_NAME];
    PRINT 'Base de datos $DATABASE_NAME creada exitosamente';
END
ELSE
BEGIN
    PRINT 'Base de datos $DATABASE_NAME ya existe';
END
EOF

echo "📋 Script de creación de BD preparado"
echo "⚠️  ACCIÓN REQUERIDA:"
echo "   1. Conecta a Cloud SQL 'oil' con:"
echo "      Server: $CLOUD_SQL_IP"
echo "      User: $CLOUD_SQL_USER"
echo "      Password: $CLOUD_SQL_PASSWORD"
echo "   2. Ejecuta el script: /tmp/create_database.sql"
echo ""

read -p "¿Has creado la base de datos '$DATABASE_NAME'? (y/N): " confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo "❌ Base de datos no confirmada. Saliendo..."
    exit 1
fi

# ============================================================================
# PASO 3: Preparar migración de datos
# ============================================================================

echo "📦 Preparando migración de datos..."

# Crear script de backup para Azure SQL
cat > /tmp/azure_backup_script.sql << EOF
-- Backup de Azure SQL para migración
-- Ejecutar en Azure SQL Server: $AZURE_SERVER

-- Opción 1: Backup a archivo local (si tienes acceso al servidor)
BACKUP DATABASE [$AZURE_DATABASE] 
TO DISK = 'C:\\Temp\\forestech_backup.bak'
WITH FORMAT, INIT, COMPRESSION;

-- Opción 2: Export a BACPAC (más fácil para transferir)
-- Usar Azure Portal > Export para crear archivo .bacpac

PRINT 'Backup completado. Transferir archivo a Cloud SQL oil.';
EOF

echo "📋 Script de backup de Azure SQL creado: /tmp/azure_backup_script.sql"

# ============================================================================
# PASO 4: Instrucciones de migración manual
# ============================================================================

echo ""
echo "📋 INSTRUCCIONES DE MIGRACIÓN:"
echo "=============================="
echo ""
echo "🔄 OPCIÓN A: Backup/Restore (Recomendada)"
echo "   1. En Azure SQL ejecuta:"
echo "      BACKUP DATABASE [$AZURE_DATABASE] TO DISK = 'backup.bak'"
echo "   2. Transfiere backup.bak a Cloud SQL 'oil'"
echo "   3. En Cloud SQL 'oil' ejecuta:"
echo "      RESTORE DATABASE [$DATABASE_NAME] FROM DISK = 'backup.bak'"
echo ""
echo "🔄 OPCIÓN B: Export/Import BACPAC"
echo "   1. En Azure Portal > SQL databases > $AZURE_DATABASE > Export"
echo "   2. Descarga el archivo .bacpac"
echo "   3. En Cloud SQL 'oil' usa SQL Server Management Studio:"
echo "      Import Data-tier Application > selecciona el .bacpac"
echo ""
echo "🔄 OPCIÓN C: Migración incremental con scripts"
echo "   1. Usa el script de migración de datos que preparé"
echo "   2. Ejecuta: node scripts/migrate-data-azure-to-oil.js"
echo ""

# ============================================================================
# PASO 5: Crear script de migración de datos (Plan C)
# ============================================================================

echo "🔧 Creando script de migración de datos..."

cat > scripts/migrate-data-azure-to-oil.js << 'EOF'
#!/usr/bin/env node

/**
 * Migración de datos Azure SQL → Cloud SQL "oil"
 * Script de respaldo si no puedes hacer backup/restore directo
 */

import sql from 'mssql';

// Configuración Azure SQL (origen)
const AZURE_CONFIG = {
  server: 'oilforestech.privatelink.database.windows.net',
  database: 'forestechCombus',
  user: 'oil',
  password: process.env.AZURE_SQL_PASSWORD || '271202Ev.',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

// Configuración Cloud SQL "oil" (destino)
const OIL_CONFIG = {
  server: '34.61.242.157',
  port: 1433,
  database: 'forestechCombus',
  user: 'sqlserver',
  password: '123456789',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

const migrateData = async () => {
  console.log('🚀 Iniciando migración de datos Azure → Cloud SQL oil...\n');
  
  let azurePool, oilPool;
  
  try {
    // Conectar a ambas bases de datos
    console.log('🔌 Conectando a Azure SQL...');
    azurePool = await sql.connect(AZURE_CONFIG);
    console.log('✅ Conectado a Azure SQL');
    
    console.log('🔌 Conectando a Cloud SQL oil...');
    oilPool = new sql.ConnectionPool(OIL_CONFIG);
    await oilPool.connect();
    console.log('✅ Conectado a Cloud SQL oil');
    
    // Lista de tablas a migrar (en orden de dependencias)
    const tables = [
      'VehicleCategories',
      'Suppliers', 
      'Products',
      'Vehicles',
      'Inventory',
      'Movements',
      'Maintenance',
      'HourMeterReadings'
    ];
    
    for (const table of tables) {
      try {
        console.log(`\n📊 Migrando tabla: ${table}`);
        
        // Obtener datos de Azure
        const azureData = await azurePool.request().query(`SELECT * FROM ${table}`);
        const records = azureData.recordset;
        
        console.log(`   📋 Encontrados ${records.length} registros`);
        
        if (records.length === 0) {
          console.log(`   ⚠️ Tabla ${table} vacía, saltando...`);
          continue;
        }
        
        // Limpiar tabla destino
        await oilPool.request().query(`DELETE FROM ${table}`);
        
        // Migrar registros
        let migrated = 0;
        for (const record of records) {
          try {
            const columns = Object.keys(record).join(', ');
            const values = Object.keys(record).map(key => `@${key}`).join(', ');
            
            const insertQuery = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
            const request = oilPool.request();
            
            // Agregar parámetros
            Object.entries(record).forEach(([key, value]) => {
              request.input(key, value);
            });
            
            await request.query(insertQuery);
            migrated++;
          } catch (error) {
            console.warn(`     ⚠️ Error en registro ${migrated + 1}: ${error.message}`);
          }
        }
        
        console.log(`   ✅ ${table}: ${migrated}/${records.length} registros migrados`);
        
      } catch (error) {
        console.error(`   ❌ Error migrando ${table}: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Migración completada!');
    
  } catch (error) {
    console.error('❌ Error en migración:', error.message);
  } finally {
    if (azurePool) await azurePool.close();
    if (oilPool) await oilPool.close();
  }
};

// Ejecutar migración
migrateData();
EOF

chmod +x scripts/migrate-data-azure-to-oil.js

# ============================================================================
# PASO 6: Configurar variables de entorno
# ============================================================================

echo "🔧 Configurando variables de entorno para Cloud SQL 'oil'..."

cat > functions/.env.oil << EOF
# Cloud SQL "oil" Configuration
NODE_ENV=development
CLOUD_SQL_CONNECTION_NAME=liquidacionapp-62962:us-central1:oil
CLOUD_SQL_DATABASE=forestechCombus
CLOUD_SQL_USER=sqlserver
CLOUD_SQL_PASSWORD=123456789
CLOUD_SQL_SERVER_IP=34.61.242.157
CLOUD_SQL_PORT=1433

# Para producción (Cloud Functions)
CLOUD_SQL_SOCKET_PATH=/cloudsql/liquidacionapp-62962:us-central1:oil
EOF

# ============================================================================
# PASO 7: Crear script de verificación post-migración
# ============================================================================

echo "🧪 Creando script de verificación..."

cat > scripts/verify-oil-migration.js << 'EOF'
#!/usr/bin/env node

/**
 * Verificación de migración en Cloud SQL "oil"
 */

import sql from 'mssql';

const CONFIG = {
  server: '34.61.242.157',
  port: 1433,
  database: 'forestechCombus',
  user: 'sqlserver',
  password: '123456789',
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

const verifyMigration = async () => {
  console.log('🔍 VERIFICACIÓN DE MIGRACIÓN - CLOUD SQL "OIL"');
  console.log('================================================');
  
  try {
    const pool = await sql.connect(CONFIG);
    
    // Verificar tablas principales
    const tables = ['Vehicles', 'Movements', 'Inventory', 'Suppliers', 'Products'];
    
    console.log('📊 Conteo de registros por tabla:');
    for (const table of tables) {
      try {
        const result = await pool.request().query(`SELECT COUNT(*) as count FROM ${table}`);
        console.log(`   ${table}: ${result.recordset[0].count} registros`);
      } catch (error) {
        console.log(`   ${table}: ❌ Error - ${error.message}`);
      }
    }
    
    // Verificar últimos registros
    console.log('\n📅 Últimas fechas de creación:');
    try {
      const lastMovement = await pool.request().query('SELECT MAX(created_at) as last_date FROM Movements');
      const lastVehicle = await pool.request().query('SELECT MAX(created_at) as last_date FROM Vehicles');
      
      console.log(`   Último Movement: ${lastMovement.recordset[0].last_date}`);
      console.log(`   Último Vehicle: ${lastVehicle.recordset[0].last_date}`);
    } catch (error) {
      console.log('   ⚠️ Error obteniendo fechas (normal si las tablas están vacías)');
    }
    
    await pool.close();
    console.log('\n✅ Verificación completada');
    
  } catch (error) {
    console.error('❌ Error en verificación:', error.message);
  }
};

verifyMigration();
EOF

chmod +x scripts/verify-oil-migration.js

# ============================================================================
# RESUMEN FINAL
# ============================================================================

echo ""
echo "🎉 CONFIGURACIÓN PARA CLOUD SQL 'OIL' COMPLETADA"
echo "================================================="
echo ""
echo "📊 Tu instancia Cloud SQL:"
echo "   Nombre: oil"
echo "   IP: $CLOUD_SQL_IP"
echo "   Connection: $CLOUD_SQL_CONNECTION"
echo "   Database: $DATABASE_NAME"
echo ""
echo "📁 Archivos creados:"
echo "   ✅ functions/config/cloud-sql-config.json"
echo "   ✅ functions/src/cloudsql/oil-connection.js" 
echo "   ✅ scripts/test-oil-connection.js"
echo "   ✅ scripts/migrate-data-azure-to-oil.js"
echo "   ✅ scripts/verify-oil-migration.js"
echo "   ✅ functions/.env.oil"
echo ""
echo "🔧 Próximos pasos:"
echo "   1. Test conexión: node scripts/test-oil-connection.js"
echo "   2. Crear BD forestechCombus en Cloud SQL oil"
echo "   3. Migrar datos desde Azure SQL"
echo "   4. Verificar: node scripts/verify-oil-migration.js"
echo ""
echo "✅ Todo listo para migración a Cloud SQL 'oil'!"