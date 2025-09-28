-- =====================================================================
-- MIGRACIÓN URGENTE: Agregar columnas faltantes a combustibles_vehicle_categories
-- EJECUTAR ESTE SCRIPT DIRECTAMENTE EN SQL SERVER MANAGEMENT STUDIO
-- =====================================================================
-- 
-- PROBLEMA: 
-- - Error "Invalid column name 'sortOrder'"
-- - Error "Invalid column name 'vehicleCount'" 
-- - Las categorías no se pueden crear
--
-- SOLUCIÓN: Agregar las columnas que faltan en la tabla
-- =====================================================================

USE forestechCombus;
GO

PRINT '🚀 INICIANDO MIGRACIÓN DE COMBUSTIBLES_VEHICLE_CATEGORIES';
PRINT '========================================================';
PRINT '';

-- Verificar si la tabla existe
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'combustibles_vehicle_categories')
BEGIN
    PRINT '❌ ERROR: La tabla combustibles_vehicle_categories no existe!';
    PRINT 'Debe crear primero la tabla antes de ejecutar esta migración.';
    RETURN;
END
ELSE
BEGIN
    PRINT '✅ Tabla combustibles_vehicle_categories encontrada';
END

PRINT '';
PRINT '📊 COLUMNAS ACTUALES:';
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'combustibles_vehicle_categories'
ORDER BY ORDINAL_POSITION;

PRINT '';
PRINT '🔧 AGREGANDO COLUMNAS FALTANTES...';
PRINT '';

-- 1. SORTORDER (CRÍTICA)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'sortOrder')
BEGIN
    PRINT 'Agregando sortOrder...';
    ALTER TABLE combustibles_vehicle_categories ADD sortOrder INT DEFAULT 0;
    PRINT '✅ sortOrder agregada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ sortOrder ya existe - OK';
END

-- 2. VEHICLECOUNT (CRÍTICA)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'vehicleCount')
BEGIN
    PRINT 'Agregando vehicleCount...';
    ALTER TABLE combustibles_vehicle_categories ADD vehicleCount INT DEFAULT 0;
    PRINT '✅ vehicleCount agregada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ vehicleCount ya existe - OK';
END

-- 3. ICON (para UI)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'icon')
BEGIN
    PRINT 'Agregando icon...';
    ALTER TABLE combustibles_vehicle_categories ADD icon NVARCHAR(100);
    PRINT '✅ icon agregada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ icon ya existe - OK';
END

-- 4. COLOR (para UI)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'color')
BEGIN
    PRINT 'Agregando color...';
    ALTER TABLE combustibles_vehicle_categories ADD color NVARCHAR(50);
    PRINT '✅ color agregada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ color ya existe - OK';
END

-- 5. CUSTOMFIELDS (para configuraciones adicionales)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'customFields')
BEGIN
    PRINT 'Agregando customFields...';
    ALTER TABLE combustibles_vehicle_categories ADD customFields NVARCHAR(MAX);
    PRINT '✅ customFields agregada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ customFields ya existe - OK';
END

-- 6. DEFAULTFUELTYPE (para tipo de combustible por defecto)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'defaultFuelType')
BEGIN
    PRINT 'Agregando defaultFuelType...';
    ALTER TABLE combustibles_vehicle_categories ADD defaultFuelType NVARCHAR(50);
    PRINT '✅ defaultFuelType agregada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ defaultFuelType ya existe - OK';
END

-- 7. ESTIMATEDCONSUMPTION (para consumo estimado)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'estimatedConsumption')
BEGIN
    PRINT 'Agregando estimatedConsumption...';
    ALTER TABLE combustibles_vehicle_categories ADD estimatedConsumption DECIMAL(8,3);
    PRINT '✅ estimatedConsumption agregada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ estimatedConsumption ya existe - OK';
END

-- 8. UPDATEDAT (para auditoría)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'updatedAt')
BEGIN
    PRINT 'Agregando updatedAt...';
    ALTER TABLE combustibles_vehicle_categories ADD updatedAt DATETIME2 DEFAULT GETUTCDATE();
    PRINT '✅ updatedAt agregada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ updatedAt ya existe - OK';
END

-- 9. UPDATEDBY (para auditoría)
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'updatedBy')
BEGIN
    PRINT 'Agregando updatedBy...';
    ALTER TABLE combustibles_vehicle_categories ADD updatedBy NVARCHAR(100);
    PRINT '✅ updatedBy agregada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ updatedBy ya existe - OK';
END

PRINT '';
PRINT '🔍 CREANDO ÍNDICES PARA PERFORMANCE...';

-- Índice para sortOrder (importante para ordenamiento)
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_sort_order' AND object_id = OBJECT_ID('combustibles_vehicle_categories'))
BEGIN
    PRINT 'Creando índice idx_sort_order...';
    CREATE INDEX idx_sort_order ON combustibles_vehicle_categories(sortOrder);
    PRINT '✅ Índice idx_sort_order creado exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ Índice idx_sort_order ya existe - OK';
END

PRINT '';
PRINT '📋 ESTRUCTURA FINAL DE LA TABLA:';
PRINT '================================';
SELECT 
    COLUMN_NAME as 'Columna',
    DATA_TYPE as 'Tipo', 
    CASE WHEN IS_NULLABLE = 'YES' THEN 'SÍ' ELSE 'NO' END as 'Permite NULL',
    ISNULL(COLUMN_DEFAULT, 'Sin defecto') as 'Valor por defecto'
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'combustibles_vehicle_categories'
ORDER BY ORDINAL_POSITION;

-- Verificar que las columnas críticas existan
DECLARE @sortOrder_exists BIT = 0;
DECLARE @vehicleCount_exists BIT = 0;

SELECT @sortOrder_exists = 1 WHERE EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'sortOrder'
);

SELECT @vehicleCount_exists = 1 WHERE EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'combustibles_vehicle_categories' AND COLUMN_NAME = 'vehicleCount'
);

PRINT '';
PRINT '🧪 VERIFICACIÓN FINAL:';
PRINT '=====================';

IF @sortOrder_exists = 1 AND @vehicleCount_exists = 1
BEGIN
    PRINT '✅ ¡MIGRACIÓN COMPLETADA EXITOSAMENTE!';
    PRINT '✅ sortOrder existe - Problema de ordenamiento solucionado';
    PRINT '✅ vehicleCount existe - Problema de creación de categorías solucionado';
    PRINT '';
    PRINT '🎉 AHORA PUEDES:';
    PRINT '   - Crear nuevas categorías de vehículos';
    PRINT '   - Ver estadísticas de categorías';
    PRINT '   - Ordenar categorías correctamente';
    PRINT '';
    PRINT '📝 PRÓXIMO PASO: Prueba crear una categoría desde la aplicación';
END
ELSE
BEGIN
    PRINT '❌ ERROR: Algunas columnas críticas siguen faltando';
    IF @sortOrder_exists = 0
        PRINT '   - Falta: sortOrder';
    IF @vehicleCount_exists = 0
        PRINT '   - Falta: vehicleCount';
    PRINT '';
    PRINT '🔄 Ejecuta este script nuevamente o revisa los permisos de la base de datos';
END

PRINT '';
PRINT '========================================================';
PRINT '🏁 MIGRACIÓN FINALIZADA';
PRINT '========================================================';

GO