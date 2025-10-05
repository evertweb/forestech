import { sqlConfig } from './src/sql/config.js';
import sql from 'mssql';

const createTables = async () => {
    try {
    console.log('🔗 Conectando a SQL Server DigitalOcean...');
        console.log('Server:', sqlConfig.server);
        console.log('Database:', sqlConfig.database);
        
        const pool = await sql.connect(sqlConfig);
        
        // Verificar tablas existentes
        console.log('📋 Verificando tablas existentes...');
        const existingTables = await pool.request().query(`
            SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE'
        `);
        
        console.log('📊 Tablas existentes:', existingTables.recordset.map(t => t.TABLE_NAME));
        
        // Lista de tablas requeridas
        const requiredTables = [
            'combustibles_movements',
            'combustibles_vehicles', 
            'combustibles_inventory',
            'combustibles_maintenance',
            'combustibles_products',
            'combustibles_suppliers',
            'combustibles_vehicle_categories',
            'product_categories'
        ];
        
        const existingTableNames = existingTables.recordset.map(t => t.TABLE_NAME);
        const missingTables = requiredTables.filter(table => !existingTableNames.includes(table));
        
        console.log('❌ Tablas faltantes:', missingTables);
        
        if (missingTables.length === 0) {
            console.log('✅ Todas las tablas ya existen!');
            return;
        }
        
        // Crear tablas faltantes
        console.log('🔨 Creando tablas faltantes...');
        
        // 1. MOVIMIENTOS
        if (missingTables.includes('combustibles_movements')) {
            await pool.request().query(`
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
                    updatedAt DATETIME2 DEFAULT GETUTCDATE()
                )
            `);
            console.log('✅ combustibles_movements creada');
        }
        
        // 2. VEHÍCULOS
        if (missingTables.includes('combustibles_vehicles')) {
            await pool.request().query(`
                CREATE TABLE combustibles_vehicles (
                    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                    vehicleId NVARCHAR(100) NOT NULL UNIQUE,
                    name NVARCHAR(200) NOT NULL,
                    brand NVARCHAR(100),
                    model NVARCHAR(100),
                    type NVARCHAR(100) NOT NULL,
                    category NVARCHAR(100),
                    fuelType NVARCHAR(50) NOT NULL,
                    currentLocation NVARCHAR(200),
                    operationalStatus NVARCHAR(50) DEFAULT 'activo',
                    priority NVARCHAR(50) DEFAULT 'media',
                    hasHourMeter BIT DEFAULT 0,
                    currentHourMeter DECIMAL(10,2),
                    totalHoursWorked DECIMAL(10,2) DEFAULT 0,
                    totalFuelConsumed DECIMAL(18,3) DEFAULT 0,
                    totalMovements INT DEFAULT 0,
                    lastMovementDate DATETIME2,
                    notes NVARCHAR(MAX),
                    createdAt DATETIME2 DEFAULT GETUTCDATE(),
                    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
                    createdBy NVARCHAR(100)
                )
            `);
            console.log('✅ combustibles_vehicles creada');
        }
        
        // 3. INVENTARIO
        if (missingTables.includes('combustibles_inventory')) {
            await pool.request().query(`
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
                    createdAt DATETIME2 DEFAULT GETUTCDATE(),
                    updatedAt DATETIME2 DEFAULT GETUTCDATE(),
                    createdBy NVARCHAR(100)
                )
            `);
            console.log('✅ combustibles_inventory creada');
        }
        
        // 4. MANTENIMIENTO
        if (missingTables.includes('combustibles_maintenance')) {
            await pool.request().query(`
                CREATE TABLE combustibles_maintenance (
                    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                    movementId UNIQUEIDENTIFIER,
                    vehicleId NVARCHAR(100),
                    vehicleName NVARCHAR(200),
                    type NVARCHAR(50) DEFAULT 'preventivo',
                    priority NVARCHAR(50) DEFAULT 'media',
                    title NVARCHAR(200) NOT NULL,
                    description NVARCHAR(MAX),
                    status NVARCHAR(50) DEFAULT 'completado',
                    scheduledDate DATETIME2,
                    completedDate DATETIME2,
                    createdAt DATETIME2 DEFAULT GETUTCDATE(),
                    createdBy NVARCHAR(100)
                )
            `);
            console.log('✅ combustibles_maintenance creada');
        }
        
        // 5. PRODUCTOS
        if (missingTables.includes('combustibles_products')) {
            await pool.request().query(`
                CREATE TABLE combustibles_products (
                    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                    code NVARCHAR(100) UNIQUE,
                    name NVARCHAR(200) NOT NULL,
                    description NVARCHAR(MAX),
                    category NVARCHAR(100) DEFAULT 'combustible',
                    type NVARCHAR(100),
                    unit NVARCHAR(50) DEFAULT 'galones',
                    currentStock DECIMAL(18,3) DEFAULT 0,
                    basePrice DECIMAL(18,2),
                    isActive BIT DEFAULT 1,
                    status NVARCHAR(50) DEFAULT 'active',
                    createdAt DATETIME2 DEFAULT GETUTCDATE(),
                    createdBy NVARCHAR(100)
                )
            `);
            console.log('✅ combustibles_products creada');
        }
        
        // 6. PROVEEDORES
        if (missingTables.includes('combustibles_suppliers')) {
            await pool.request().query(`
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
                    status NVARCHAR(50) DEFAULT 'active',
                    createdAt DATETIME2 DEFAULT GETUTCDATE(),
                    createdBy NVARCHAR(100)
                )
            `);
            console.log('✅ combustibles_suppliers creada');
        }
        
        // 7. CATEGORÍAS VEHÍCULOS
        if (missingTables.includes('combustibles_vehicle_categories')) {
            await pool.request().query(`
                CREATE TABLE combustibles_vehicle_categories (
                    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                    name NVARCHAR(200) NOT NULL UNIQUE,
                    code NVARCHAR(50) UNIQUE,
                    description NVARCHAR(MAX),
                    type NVARCHAR(50) DEFAULT 'vehicle',
                    isActive BIT DEFAULT 1,
                    createdAt DATETIME2 DEFAULT GETUTCDATE(),
                    createdBy NVARCHAR(100)
                )
            `);
            console.log('✅ combustibles_vehicle_categories creada');
        }
        
        // 8. CATEGORÍAS PRODUCTOS
        if (missingTables.includes('product_categories')) {
            await pool.request().query(`
                CREATE TABLE product_categories (
                    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
                    name NVARCHAR(200) NOT NULL UNIQUE,
                    code NVARCHAR(50) UNIQUE,
                    description NVARCHAR(MAX),
                    parentId UNIQUEIDENTIFIER,
                    level INT DEFAULT 1,
                    isActive BIT DEFAULT 1,
                    createdAt DATETIME2 DEFAULT GETUTCDATE(),
                    createdBy NVARCHAR(100)
                )
            `);
            console.log('✅ product_categories creada');
        }
        
        // Verificación final
        console.log('📋 Verificando resultado final...');
        const finalTables = await pool.request().query(`
            SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE'
        `);
        
        console.log('🎉 Tablas finales:', finalTables.recordset.map(t => t.TABLE_NAME));
        console.log('✅ ¡Proceso completado exitosamente!');
        
        await pool.close();
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
};

createTables();