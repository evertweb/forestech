-- Migración para agregar columnas faltantes a combustibles_vehicle_categories
-- Solución para errores: "Invalid column name 'sortOrder'" y "Invalid column name 'vehicleCount'"

USE forestechCombus;
GO

PRINT 'Iniciando migración de combustibles_vehicle_categories...';

-- Verificar si las columnas ya existen
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'sortOrder')
BEGIN
    PRINT 'Agregando columna sortOrder...';
    ALTER TABLE combustibles_vehicle_categories ADD sortOrder INT DEFAULT 0;
    PRINT '✅ sortOrder agregada';
END
ELSE
BEGIN
    PRINT '⚠️ sortOrder ya existe';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'vehicleCount')
BEGIN
    PRINT 'Agregando columna vehicleCount...';
    ALTER TABLE combustibles_vehicle_categories ADD vehicleCount INT DEFAULT 0;
    PRINT '✅ vehicleCount agregada';
END
ELSE
BEGIN
    PRINT '⚠️ vehicleCount ya existe';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'icon')
BEGIN
    PRINT 'Agregando columna icon...';
    ALTER TABLE combustibles_vehicle_categories ADD icon NVARCHAR(100);
    PRINT '✅ icon agregada';
END
ELSE
BEGIN
    PRINT '⚠️ icon ya existe';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'color')
BEGIN
    PRINT 'Agregando columna color...';
    ALTER TABLE combustibles_vehicle_categories ADD color NVARCHAR(50);
    PRINT '✅ color agregada';
END
ELSE
BEGIN
    PRINT '⚠️ color ya existe';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'customFields')
BEGIN
    PRINT 'Agregando columna customFields...';
    ALTER TABLE combustibles_vehicle_categories ADD customFields NVARCHAR(MAX);
    PRINT '✅ customFields agregada';
END
ELSE
BEGIN
    PRINT '⚠️ customFields ya existe';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'defaultFuelType')
BEGIN
    PRINT 'Agregando columna defaultFuelType...';
    ALTER TABLE combustibles_vehicle_categories ADD defaultFuelType NVARCHAR(50);
    PRINT '✅ defaultFuelType agregada';
END
ELSE
BEGIN
    PRINT '⚠️ defaultFuelType ya existe';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'estimatedConsumption')
BEGIN
    PRINT 'Agregando columna estimatedConsumption...';
    ALTER TABLE combustibles_vehicle_categories ADD estimatedConsumption DECIMAL(8,3);
    PRINT '✅ estimatedConsumption agregada';
END
ELSE
BEGIN
    PRINT '⚠️ estimatedConsumption ya existe';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'updatedAt')
BEGIN
    PRINT 'Agregando columna updatedAt...';
    ALTER TABLE combustibles_vehicle_categories ADD updatedAt DATETIME2 DEFAULT GETUTCDATE();
    PRINT '✅ updatedAt agregada';
END
ELSE
BEGIN
    PRINT '⚠️ updatedAt ya existe';
END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'updatedBy')
BEGIN
    PRINT 'Agregando columna updatedBy...';
    ALTER TABLE combustibles_vehicle_categories ADD updatedBy NVARCHAR(100);
    PRINT '✅ updatedBy agregada';
END
ELSE
BEGIN
    PRINT '⚠️ updatedBy ya existe';
END

-- Crear índices si no existen
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_sort_order' AND object_id = OBJECT_ID('combustibles_vehicle_categories'))
BEGIN
    PRINT 'Creando índice idx_sort_order...';
    CREATE INDEX idx_sort_order ON combustibles_vehicle_categories(sortOrder);
    PRINT '✅ Índice idx_sort_order creado';
END
ELSE
BEGIN
    PRINT '⚠️ Índice idx_sort_order ya existe';
END

-- Verificar columnas finales
PRINT '';
PRINT 'Verificando estructura final de combustibles_vehicle_categories:';
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'combustibles_vehicle_categories'
ORDER BY ORDINAL_POSITION;

PRINT '';
PRINT '✅ Migración completada exitosamente!';
GO