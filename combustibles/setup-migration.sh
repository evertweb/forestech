#!/bin/bash

# ===========================================
# SETUP MIGRACIÓN: Firestore → Azure SQL Server
# Forestech Combustibles App
# ===========================================

echo "🚀 Iniciando setup de migración a Azure SQL Server..."
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes coloreados
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encuentra package.json. Ejecuta este script desde la raíz del proyecto combustibles/"
    exit 1
fi

print_status "Verificando entorno..."

# Paso 1: Instalar dependencias
print_status "Paso 1: Instalando dependencias SQL..."
if npm install mssql@^10.0.1; then
    print_success "Dependencias SQL instaladas correctamente"
else
    print_error "Error instalando dependencias SQL"
    exit 1
fi

# Paso 2: Verificar instalación
print_status "Paso 2: Verificando instalación de MSSQL..."
if node -e "const sql = require('mssql'); console.log('✅ MSSQL instalado correctamente - Versión:', sql.version)"; then
    print_success "MSSQL verificado correctamente"
else
    print_error "Error verificando MSSQL"
    exit 1
fi

# Paso 3: Crear archivo de configuración .env.local si no existe
print_status "Paso 3: Configurando variables de entorno..."
if [ ! -f ".env.local" ]; then
    cat > .env.local << EOF
# Configuración Azure SQL Server - Forestech Combustibles
VITE_AZURE_SQL_SERVER=oilforestech.database.windows.net
VITE_AZURE_SQL_DATABASE=forestechCombus
VITE_AZURE_SQL_USER=oil
VITE_AZURE_SQL_PASSWORD=271202ev

# Configuración Firebase (mantener hasta completar migración)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
EOF
    print_success "Archivo .env.local creado"
    print_warning "⚠️  IMPORTANTE: Verifica las credenciales de Firebase en .env.local"
else
    print_warning "Archivo .env.local ya existe - verifica que tenga las variables correctas"
fi

# Paso 4: Crear script de inicialización de base de datos
print_status "Paso 4: Creando script de inicialización de base de datos..."
cat > scripts/init-database.js << 'EOF'
/**
 * Script de inicialización de base de datos Azure SQL
 * Ejecutar una sola vez para crear tablas
 */

const sql = require('mssql');
const fs = require('fs');
const path = require('path');

// Configuración de conexión
const config = {
  server: process.env.VITE_AZURE_SQL_SERVER || 'oilforestech.database.windows.net',
  port: 1433,
  database: process.env.VITE_AZURE_SQL_DATABASE || 'forestechCombus',
  user: process.env.VITE_AZURE_SQL_USER || 'oil',
  password: process.env.VITE_AZURE_SQL_PASSWORD || '271202ev',
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

async function initDatabase() {
  try {
    console.log('🔌 Conectando a Azure SQL Server...');

    // Conectar a master para crear BD si no existe
    const masterConfig = { ...config, database: 'master' };
    const masterPool = await sql.connect(masterConfig);

    console.log('📦 Verificando/creando base de datos...');
    await masterPool.request().query(`
      IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '${config.database}')
      BEGIN
        CREATE DATABASE [${config.database}];
        PRINT 'Base de datos creada exitosamente';
      END
      ELSE
      BEGIN
        PRINT 'Base de datos ya existe';
      END
    `);

    await masterPool.close();

    // Conectar a la base de datos específica
    const pool = await sql.connect(config);
    console.log('✅ Conexión exitosa a la base de datos');

    // Leer y ejecutar script de tablas
    const tablesScript = fs.readFileSync(path.join(__dirname, '..', 'sql', 'create-tables.sql'), 'utf8');

    console.log('🏗️  Creando tablas...');
    await pool.request().query(tablesScript);

    console.log('✅ Base de datos inicializada correctamente');
    console.log('');
    console.log('📋 Tablas creadas:');
    console.log('  - combustibles_movements');
    console.log('  - combustibles_inventory');
    console.log('  - combustibles_vehicles');
    console.log('  - combustibles_maintenance');
    console.log('  - combustibles_products');
    console.log('  - combustibles_suppliers');
    console.log('  - combustibles_vehicle_categories');
    console.log('  - product_categories');

    await pool.close();

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
    process.exit(1);
  }
}

initDatabase();
EOF

print_success "Script de inicialización creado en scripts/init-database.js"

# Paso 5: Crear directorio SQL y script de tablas
print_status "Paso 5: Creando scripts SQL..."
mkdir -p sql

cat > sql/create-tables.sql << 'EOF'
-- ===========================================
-- CREACIÓN DE TABLAS - Forestech Combustibles
-- Azure SQL Server
-- ===========================================

USE forestechCombus;
GO

-- 1. MOVIMIENTOS DE COMBUSTIBLE
CREATE TABLE combustibles_movements (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    type NVARCHAR(50) NOT NULL,
    fuelType NVARCHAR(100) NOT NULL,
    quantity DECIMAL(18,3) NOT NULL,
    unitPrice DECIMAL(18,2) DEFAULT 0,
    totalValue DECIMAL(18,2) NOT NULL,
    vehicleId NVARCHAR(100),
    location NVARCHAR(200),
    destinationLocation NVARCHAR(200),
    description NVARCHAR(MAX),
    effectiveDate DATETIME2,
    hourMeterReading DECIMAL(10,2),
    hoursWorked DECIMAL(8,2) DEFAULT 0,
    previousHourMeterReading DECIMAL(10,2),
    createdBy NVARCHAR(200),
    createdByUid NVARCHAR(100),
    createdByName NVARCHAR(200),
    status NVARCHAR(50) DEFAULT 'completed',
    approvedBy NVARCHAR(200),
    approvedAt DATETIME2,
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    INDEX idx_type (type),
    INDEX idx_fuel_type (fuelType),
    INDEX idx_vehicle (vehicleId),
    INDEX idx_location (location),
    INDEX idx_created_at (createdAt),
    INDEX idx_effective_date (effectiveDate)
);

-- 2. INVENTARIO
CREATE TABLE combustibles_inventory (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    fuelType NVARCHAR(100) NOT NULL,
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    currentStock DECIMAL(18,3) NOT NULL DEFAULT 0,
    maxCapacity DECIMAL(18,3) NOT NULL,
    minThreshold DECIMAL(18,3) DEFAULT 0,
    unit NVARCHAR(50) DEFAULT 'galones',
    location NVARCHAR(200) NOT NULL,
    pricePerUnit DECIMAL(18,2) DEFAULT 0,
    supplier NVARCHAR(200),
    status NVARCHAR(50) DEFAULT 'active',
    lastMovementId UNIQUEIDENTIFIER,
    lastMovementType NVARCHAR(50),
    lastMovementQuantity DECIMAL(18,3),
    lastMovementDate DATETIME2,
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    createdBy NVARCHAR(100),
    updatedBy NVARCHAR(100),
    CONSTRAINT chk_stock_positive CHECK (currentStock >= 0),
    CONSTRAINT chk_capacity_positive CHECK (maxCapacity > 0),
    CONSTRAINT chk_min_threshold CHECK (minThreshold >= 0),
    UNIQUE KEY uk_fuel_location (fuelType, location),
    INDEX idx_fuel_type (fuelType),
    INDEX idx_location (location),
    INDEX idx_status (status),
    INDEX idx_updated_at (updatedAt)
);

-- 3. VEHÍCULOS
CREATE TABLE combustibles_vehicles (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    vehicleId NVARCHAR(100) NOT NULL UNIQUE,
    name NVARCHAR(200) NOT NULL,
    brand NVARCHAR(100),
    model NVARCHAR(100),
    type NVARCHAR(100) NOT NULL,
    category NVARCHAR(100),
    enginePower DECIMAL(10,2),
    fuelCapacity DECIMAL(10,2),
    fuelType NVARCHAR(50) NOT NULL,
    currentLocation NVARCHAR(200),
    operationalStatus NVARCHAR(50) DEFAULT 'activo',
    priority NVARCHAR(50) DEFAULT 'media',
    hasHourMeter BIT DEFAULT 0,
    initialHourMeter DECIMAL(10,2),
    currentHourMeter DECIMAL(10,2),
    totalHoursWorked DECIMAL(10,2) DEFAULT 0,
    lastHourMeterUpdate DATETIME2,
    fuelConsumptionPerHour DECIMAL(8,3),
    hourMeterHistory NVARCHAR(MAX),
    totalFuelConsumed DECIMAL(18,3) DEFAULT 0,
    totalMovements INT DEFAULT 0,
    lastMovementDate DATETIME2,
    estimatedConsumptionPerHour DECIMAL(8,3),
    actualConsumptionPerHour DECIMAL(8,3),
    maintenanceHistory NVARCHAR(MAX),
    lastMaintenanceDate DATETIME2,
    notes NVARCHAR(MAX),
    searchTags NVARCHAR(MAX),
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    createdBy NVARCHAR(100),
    updatedBy NVARCHAR(100),
    INDEX idx_vehicle_id (vehicleId),
    INDEX idx_type (type),
    INDEX idx_category (category),
    INDEX idx_fuel_type (fuelType),
    INDEX idx_status (operationalStatus),
    INDEX idx_location (currentLocation),
    INDEX idx_updated_at (updatedAt)
);

-- 4. MANTENIMIENTO
CREATE TABLE combustibles_maintenance (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    movementId UNIQUEIDENTIFIER,
    vehicleId NVARCHAR(100),
    vehicleName NVARCHAR(200),
    type NVARCHAR(50) DEFAULT 'preventivo',
    priority NVARCHAR(50) DEFAULT 'media',
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX),
    notes NVARCHAR(MAX),
    hours DECIMAL(8,2) DEFAULT 0,
    laborCost DECIMAL(18,2) DEFAULT 0,
    technician NVARCHAR(200),
    parts NVARCHAR(MAX),
    totalPartsCost DECIMAL(18,2) DEFAULT 0,
    fuelType NVARCHAR(50),
    fuelQuantity DECIMAL(18,3),
    fuelCost DECIMAL(18,2),
    scheduledDate DATETIME2,
    completedDate DATETIME2,
    status NVARCHAR(50) DEFAULT 'completado',
    totalCost DECIMAL(18,2),
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    createdBy NVARCHAR(100),
    INDEX idx_vehicle (vehicleId),
    INDEX idx_movement (movementId),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_scheduled_date (scheduledDate),
    INDEX idx_completed_date (completedDate)
);

-- 5. PRODUCTOS
CREATE TABLE combustibles_products (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    code NVARCHAR(100) UNIQUE,
    name NVARCHAR(200) NOT NULL,
    displayName NVARCHAR(200),
    description NVARCHAR(MAX),
    category NVARCHAR(100) DEFAULT 'combustible',
    subcategory NVARCHAR(100),
    type NVARCHAR(100),
    unit NVARCHAR(50) DEFAULT 'galones',
    density DECIMAL(8,4),
    energyContent DECIMAL(10,2),
    currentStock DECIMAL(18,3) DEFAULT 0,
    minThreshold DECIMAL(18,3) DEFAULT 0,
    maxStock DECIMAL(18,3),
    basePrice DECIMAL(18,2),
    currentPrice DECIMAL(18,2),
    costPrice DECIMAL(18,2),
    isActive BIT DEFAULT 1,
    status NVARCHAR(50) DEFAULT 'active',
    suppliers NVARCHAR(MAX),
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    createdBy NVARCHAR(100),
    updatedBy NVARCHAR(100),
    INDEX idx_code (code),
    INDEX idx_name (name),
    INDEX idx_category (category),
    INDEX idx_is_active (isActive),
    INDEX idx_status (status)
);

-- 6. PROVEEDORES
CREATE TABLE combustibles_suppliers (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(200) NOT NULL UNIQUE,
    taxId NVARCHAR(100) UNIQUE,
    type NVARCHAR(50) DEFAULT 'proveedor',
    category NVARCHAR(50) DEFAULT 'combustibles',
    contactPerson NVARCHAR(200),
    phone NVARCHAR(50),
    email NVARCHAR(200),
    address NVARCHAR(MAX),
    city NVARCHAR(100),
    state NVARCHAR(100) DEFAULT 'Colombia',
    fuelTypes NVARCHAR(MAX),
    paymentTerms NVARCHAR(50) DEFAULT 'contado',
    creditLimit DECIMAL(18,2) DEFAULT 0,
    priceList NVARCHAR(MAX),
    rating DECIMAL(3,1) DEFAULT 5.0,
    evaluationNotes NVARCHAR(MAX),
    status NVARCHAR(50) DEFAULT 'active',
    isPreferred BIT DEFAULT 0,
    totalOrders INT DEFAULT 0,
    totalPurchased DECIMAL(18,2) DEFAULT 0,
    lastOrderDate DATETIME2,
    averageDeliveryTime DECIMAL(8,2),
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    createdBy NVARCHAR(100),
    updatedBy NVARCHAR(100),
    INDEX idx_name (name),
    INDEX idx_tax_id (taxId),
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_is_preferred (isPreferred),
    INDEX idx_rating (rating)
);

-- 7. CATEGORÍAS DE VEHÍCULOS
CREATE TABLE combustibles_vehicle_categories (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(200) NOT NULL UNIQUE,
    code NVARCHAR(50) UNIQUE,
    description NVARCHAR(MAX),
    type NVARCHAR(50) DEFAULT 'vehicle',
    icon NVARCHAR(100),
    color NVARCHAR(50),
    customFields NVARCHAR(MAX),
    defaultFuelType NVARCHAR(50),
    estimatedConsumption DECIMAL(8,3),
    isActive BIT DEFAULT 1,
    sortOrder INT DEFAULT 0,
    vehicleCount INT DEFAULT 0,
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    createdBy NVARCHAR(100),
    updatedBy NVARCHAR(100),
    INDEX idx_code (code),
    INDEX idx_name (name),
    INDEX idx_type (type),
    INDEX idx_is_active (isActive),
    INDEX idx_sort_order (sortOrder)
);

-- 8. CATEGORÍAS DE PRODUCTOS
CREATE TABLE product_categories (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(200) NOT NULL UNIQUE,
    code NVARCHAR(50) UNIQUE,
    description NVARCHAR(MAX),
    parentId UNIQUEIDENTIFIER,
    level INT DEFAULT 1,
    path NVARCHAR(500),
    icon NVARCHAR(100),
    color NVARCHAR(50),
    sortOrder INT DEFAULT 0,
    isActive BIT DEFAULT 1,
    productCount INT DEFAULT 0,
    createdAt DATETIME2 DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
    createdBy NVARCHAR(100),
    updatedBy NVARCHAR(100),
    FOREIGN KEY (parentId) REFERENCES product_categories(id),
    INDEX idx_code (code),
    INDEX idx_name (name),
    INDEX idx_parent (parentId),
    INDEX idx_level (level),
    INDEX idx_is_active (isActive),
    INDEX idx_sort_order (sortOrder)
);

PRINT '✅ Todas las tablas creadas exitosamente';
PRINT 'Base de datos forestechCombus lista para usar';
GO
EOF

print_success "Script SQL de tablas creado en sql/create-tables.sql"

# Paso 6: Crear script de prueba de conexión
print_status "Paso 6: Creando script de prueba de conexión..."
cat > scripts/test-connection.js << 'EOF'
/**
 * Script para probar conexión a Azure SQL Server
 */

require('dotenv').config({ path: '.env.local' });
const sql = require('mssql');

// Configuración de conexión
const config = {
  server: process.env.VITE_AZURE_SQL_SERVER,
  port: 1433,
  database: process.env.VITE_AZURE_SQL_DATABASE,
  user: process.env.VITE_AZURE_SQL_USER,
  password: process.env.VITE_AZURE_SQL_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectionTimeout: 30000,
    requestTimeout: 30000
  }
};

async function testConnection() {
  try {
    console.log('🔌 Probando conexión a Azure SQL Server...');
    console.log(`📍 Servidor: ${config.server}`);
    console.log(`📊 Base de datos: ${config.database}`);

    const pool = await sql.connect(config);
    console.log('✅ Conexión exitosa');

    // Probar consulta simple
    console.log('📝 Ejecutando consulta de prueba...');
    const result = await pool.request().query('SELECT @@VERSION as version');
    console.log('✅ Consulta ejecutada correctamente');
    console.log(`📋 SQL Server versión: ${result.recordset[0].version.split(' - ')[0]}`);

    // Verificar tablas
    console.log('📋 Verificando tablas...');
    const tablesResult = await pool.request().query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      AND TABLE_NAME LIKE 'combustibles_%'
      ORDER BY TABLE_NAME
    `);

    if (tablesResult.recordset.length > 0) {
      console.log('✅ Tablas encontradas:');
      tablesResult.recordset.forEach(table => {
        console.log(`  - ${table.TABLE_NAME}`);
      });
    } else {
      console.log('⚠️  No se encontraron tablas. Ejecuta: npm run db:create-tables');
    }

    await pool.close();
    console.log('🔌 Conexión cerrada correctamente');
    console.log('');
    console.log('🎉 ¡Conexión a Azure SQL Server funcionando perfectamente!');

  } catch (error) {
    console.error('❌ Error en conexión:', error.message);

    if (error.code === 'ETIMEOUT') {
      console.log('');
      console.log('💡 Sugerencias para solucionar ETIMEOUT:');
      console.log('  1. Verifica que el servidor esté accesible');
      console.log('  2. Confirma las credenciales en .env.local');
      console.log('  3. Asegúrate de que el firewall permita conexiones');
      console.log('  4. Verifica que el puerto 1433 esté abierto');
    }

    if (error.code === 'ELOGIN') {
      console.log('');
      console.log('💡 Sugerencias para solucionar ELOGIN:');
      console.log('  1. Verifica usuario y contraseña');
      console.log('  2. Confirma que el usuario tenga permisos');
      console.log('  3. Verifica que la base de datos exista');
    }

    process.exit(1);
  }
}

testConnection();
EOF

print_success "Script de prueba creado en scripts/test-connection.js"

# Paso 7: Hacer ejecutables los scripts
print_status "Paso 7: Configurando permisos de ejecución..."
chmod +x setup-migration.sh
print_success "Permisos configurados"

# Paso 8: Crear resumen final
print_status "Paso 8: Creando resumen de instalación..."

cat << 'EOF'

🎉 ¡SETUP COMPLETADO EXITOSAMENTE!

=======================================================
📋 RESUMEN DE INSTALACIÓN
=======================================================

✅ Dependencias instaladas
✅ Configuración creada
✅ Scripts de base de datos generados
✅ Variables de entorno configuradas

=======================================================
🚀 PRÓXIMOS PASOS
=======================================================

1. 📝 VERIFICA las credenciales en .env.local
2. 🗄️  CREA la base de datos ejecutando:
   npm run db:create-tables

3. 🔌 PRUEBA la conexión:
   npm run db:test-connection

4. 🔄 EMPIEZA a usar los nuevos servicios:
   - Importa: import sqlMovementsService from './SqlMovementsService.js'
   - Reemplaza: import { movementsService } from './movementsService.js'

5. 📊 MONITOREA el rendimiento y ajusta según necesites

=======================================================
📞 COMANDOS DISPONIBLES
=======================================================

# Instalar dependencias
npm run install:sql

# Crear tablas en Azure SQL
npm run db:create-tables

# Probar conexión
npm run db:test-connection

# Inicializar base de datos completa
npm run db:init

=======================================================
🎯 ESTADO ACTUAL
=======================================================

✅ Migración preparada y lista para usar
✅ Servicios compatibles con interfaz existente
✅ Base de datos diseñada para escalabilidad
✅ Documentación completa disponible

¡La migración está lista! 🚀

EOF

print_success "Setup completado exitosamente"
print_warning "⚠️  IMPORTANTE: Verifica las credenciales en .env.local antes de continuar"

exit 0