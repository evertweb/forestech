-- ============================================
-- SCRIPT DE DIAGNÓSTICO - BUG MOVIMIENTOS ENTRADA
-- Forestech Combustibles
-- ============================================

PRINT '============================================';
PRINT '=== 1. VERIFICACIÓN DE TABLAS REQUERIDAS ===';
PRINT '============================================';

-- Verificar tabla combustibles_movements
IF OBJECT_ID('dbo.combustibles_movements', 'U') IS NOT NULL
BEGIN
    PRINT '✅ Tabla combustibles_movements EXISTE';
    
    -- Mostrar estructura de la tabla
    PRINT '';
    PRINT 'Columnas de combustibles_movements:';
    SELECT 
        COLUMN_NAME as Columna,
        DATA_TYPE as TipoDato,
        CHARACTER_MAXIMUM_LENGTH as LongitudMaxima,
        IS_NULLABLE as Nullable,
        COLUMN_DEFAULT as ValorPorDefecto
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'combustibles_movements'
    ORDER BY ORDINAL_POSITION;
END
ELSE
BEGIN
    PRINT '❌ Tabla combustibles_movements NO EXISTE';
END

PRINT '';
PRINT '============================================';

-- Verificar tabla combustibles_inventory
IF OBJECT_ID('dbo.combustibles_inventory', 'U') IS NOT NULL
BEGIN
    PRINT '✅ Tabla combustibles_inventory EXISTE';
    
    PRINT '';
    PRINT 'Columnas de combustibles_inventory:';
    SELECT 
        COLUMN_NAME as Columna,
        DATA_TYPE as TipoDato,
        CHARACTER_MAXIMUM_LENGTH as LongitudMaxima,
        IS_NULLABLE as Nullable,
        COLUMN_DEFAULT as ValorPorDefecto
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'combustibles_inventory'
    ORDER BY ORDINAL_POSITION;
END
ELSE
BEGIN
    PRINT '❌ Tabla combustibles_inventory NO EXISTE';
END

PRINT '';
PRINT '============================================';

-- Verificar tabla combustibles_vehicles
IF OBJECT_ID('dbo.combustibles_vehicles', 'U') IS NOT NULL
BEGIN
    PRINT '✅ Tabla combustibles_vehicles EXISTE';
    
    PRINT '';
    PRINT 'Columnas de combustibles_vehicles:';
    SELECT 
        COLUMN_NAME as Columna,
        DATA_TYPE as TipoDato,
        CHARACTER_MAXIMUM_LENGTH as LongitudMaxima,
        IS_NULLABLE as Nullable,
        COLUMN_DEFAULT as ValorPorDefecto
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'combustibles_vehicles'
    ORDER BY ORDINAL_POSITION;
END
ELSE
BEGIN
    PRINT '❌ Tabla combustibles_vehicles NO EXISTE';
END

PRINT '';
PRINT '============================================';
PRINT '=== 2. ANÁLISIS DE DATOS RECIENTES ===';
PRINT '============================================';

-- Últimos movimientos tipo ENTRADA
IF OBJECT_ID('dbo.combustibles_movements', 'U') IS NOT NULL
BEGIN
    PRINT '';
    PRINT 'Últimos 5 movimientos tipo ENTRADA:';
    SELECT TOP 5
        id,
        type,
        fuelType,
        quantity,
        unitPrice,
        totalValue,
        supplierName,
        destinationLocation,
        location,
        vehicleId,
        status,
        createdBy,
        createdAt
    FROM combustibles_movements
    WHERE type = 'entrada'
    ORDER BY createdAt DESC;
END

PRINT '';
PRINT '============================================';

-- Verificar columnas con valores NULL en movimientos tipo ENTRADA
IF OBJECT_ID('dbo.combustibles_movements', 'U') IS NOT NULL
BEGIN
    PRINT '';
    PRINT 'ANÁLISIS DE CAMPOS NULL en movimientos tipo ENTRADA:';
    
    -- Contar NULLs por columna
    SELECT 
        'supplierName' as Campo,
        COUNT(*) as TotalRegistros,
        SUM(CASE WHEN supplierName IS NULL THEN 1 ELSE 0 END) as ValoresNULL,
        SUM(CASE WHEN supplierName IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*) as PorcentajeNULL
    FROM combustibles_movements
    WHERE type = 'entrada'
    UNION ALL
    SELECT 
        'destinationLocation',
        COUNT(*),
        SUM(CASE WHEN destinationLocation IS NULL THEN 1 ELSE 0 END),
        SUM(CASE WHEN destinationLocation IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*)
    FROM combustibles_movements
    WHERE type = 'entrada'
    UNION ALL
    SELECT 
        'location',
        COUNT(*),
        SUM(CASE WHEN location IS NULL THEN 1 ELSE 0 END),
        SUM(CASE WHEN location IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*)
    FROM combustibles_movements
    WHERE type = 'entrada'
    UNION ALL
    SELECT 
        'vehicleId',
        COUNT(*),
        SUM(CASE WHEN vehicleId IS NULL THEN 1 ELSE 0 END),
        SUM(CASE WHEN vehicleId IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*)
    FROM combustibles_movements
    WHERE type = 'entrada'
    UNION ALL
    SELECT 
        'unitPrice',
        COUNT(*),
        SUM(CASE WHEN unitPrice IS NULL OR unitPrice = 0 THEN 1 ELSE 0 END),
        SUM(CASE WHEN unitPrice IS NULL OR unitPrice = 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)
    FROM combustibles_movements
    WHERE type = 'entrada'
    UNION ALL
    SELECT 
        'totalValue',
        COUNT(*),
        SUM(CASE WHEN totalValue IS NULL OR totalValue = 0 THEN 1 ELSE 0 END),
        SUM(CASE WHEN totalValue IS NULL OR totalValue = 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)
    FROM combustibles_movements
    WHERE type = 'entrada';
END

PRINT '';
PRINT '============================================';
PRINT '=== 3. VERIFICACIÓN DE INVENTARIO ===';
PRINT '============================================';

-- Estado actual del inventario
IF OBJECT_ID('dbo.combustibles_inventory', 'U') IS NOT NULL
BEGIN
    PRINT '';
    PRINT 'Inventario actual por combustible y ubicación:';
    SELECT 
        fuelType,
        location,
        name,
        currentStock,
        maxCapacity,
        minThreshold,
        pricePerUnit,
        status,
        lastMovementId,
        lastMovementType,
        lastMovementDate
    FROM combustibles_inventory
    ORDER BY fuelType, location;
END

PRINT '';
PRINT '============================================';
PRINT '=== 4. CAMPOS REQUERIDOS PARA ENTRADA ===';
PRINT '============================================';

PRINT '';
PRINT 'Según el código del servicio (movementsService.js), los campos REQUERIDOS para un movimiento tipo ENTRADA son:';
PRINT '';
PRINT '  ✅ type = ''entrada''';
PRINT '  ✅ fuelType (ej: DIESEL, GASOLINA)';
PRINT '  ✅ quantity (> 0)';
PRINT '  ✅ unitPrice (>= 0)';
PRINT '  ✅ supplierName (obligatorio para entradas)';
PRINT '  ✅ destinationLocation (obligatorio para entradas)';
PRINT '';
PRINT 'Campos OPCIONALES para entradas:';
PRINT '  - invoiceNumber';
PRINT '  - purchaseOrderNumber';
PRINT '  - description';
PRINT '  - effectiveDate';
PRINT '  - location (por defecto: ''principal'')';
PRINT '';
PRINT 'Campos que NO se deben enviar en entradas:';
PRINT '  ❌ vehicleId (solo para salidas/mantenimiento)';
PRINT '';

PRINT '============================================';
PRINT '=== 5. EJEMPLO DE OBJETO ENTRADA CORRECTO ===';
PRINT '============================================';

PRINT '';
PRINT '{';
PRINT '  "type": "entrada",';
PRINT '  "fuelType": "DIESEL",';
PRINT '  "quantity": 1000,';
PRINT '  "unitPrice": 12500,';
PRINT '  "supplierName": "Terpel S.A.",';
PRINT '  "destinationLocation": "principal",';
PRINT '  "invoiceNumber": "FAC-2025-001",';
PRINT '  "description": "Compra mensual de combustible"';
PRINT '}';
PRINT '';

PRINT '============================================';
PRINT '=== FIN DEL DIAGNÓSTICO ===';
PRINT '============================================';
