-- =====================================================
-- Script de Verificación de Base de Datos Azure SQL
-- =====================================================

-- 1. Verificar que existen las tablas requeridas
SELECT 'VERIFICANDO TABLAS' as INFO;
SELECT TABLE_NAME as TABLAS_EXISTENTES
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = SCHEMA_NAME()
  AND (TABLE_NAME LIKE 'combustibles_%' OR TABLE_NAME IN ('combustibles_movements', 'combustibles_inventory', 'combustibles_vehicles'));

-- 2. Verificar si hay movimientos registrados
SELECT 'VERIFICANDO MOVIMIENTOS' as INFO;
SELECT
    COUNT(*) as TOTAL_MOVIMIENTOS,
    MIN(createdAt) as PRIMER_MOVIMIENTO,
    MAX(createdAt) as ULTIMO_MOVIMIENTO
FROM combustibles_movements;

-- 3. Ver todos los movimientos (últimos 10)
SELECT 'MOVIMIENTOS REGISTRADOS' as INFO;
SELECT TOP 10
    id,
    type as TIPO,
    fuelType as COMBUSTIBLE,
    quantity as CANTIDAD,
    unitPrice as PRECIO_UNITARIO,
    totalValue as VALOR_TOTAL,
    location as UBICACION,
    destinationLocation as DESTINO,
    createdAt as FECHA_CREACION,
    status as ESTADO
FROM combustibles_movements
ORDER BY createdAt DESC;

-- 4. Verificar inventario actual
SELECT 'VERIFICANDO INVENTARIO' as INFO;
SELECT
    COUNT(*) as TOTAL_ITEMS_INVENTARIO,
    MIN(currentStock) as STOCK_MINIMO,
    MAX(currentStock) as STOCK_MAXIMO,
    SUM(currentStock) as STOCK_TOTAL
FROM combustibles_inventory
WHERE status = 'active';

-- 5. Ver todos los items de inventario
SELECT 'INVENTARIO ACTUAL' as INFO;
SELECT
    id,
    fuelType as COMBUSTIBLE,
    location as UBICACION,
    currentStock as STOCK_ACTUAL,
    maxCapacity as CAPACIDAD_MAXIMA,
    minThreshold as UMBRAL_MINIMO,
    pricePerUnit as PRECIO_UNITARIO,
    (currentStock * pricePerUnit) as VALOR_TOTAL,
    status as ESTADO,
    lastMovementType as ULTIMO_MOVIMIENTO,
    lastMovementQuantity as CANTIDAD_ULTIMO_MOVIMIENTO,
    lastMovementDate as FECHA_ULTIMO_MOVIMIENTO
FROM combustibles_inventory
ORDER BY fuelType, location;

-- 6. Verificar vehículos
SELECT 'VERIFICANDO VEHICULOS' as INFO;
SELECT
    COUNT(*) as TOTAL_VEHICULOS,
    COUNT(CASE WHEN status = 'activo' THEN 1 END) as VEHICULOS_ACTIVOS
FROM combustibles_vehicles;

-- 7. Si hay movimientos, verificar que el último movimiento de entrada creó inventario
SELECT 'VERIFICACION CRUZADA MOVIMIENTOS-INVENTARIO' as INFO;
WITH ultimo_movimiento_entrada AS (
    SELECT TOP 1
        id,
        fuelType,
        destinationLocation,
        quantity,
        createdAt
    FROM combustibles_movements
    WHERE type = 'entrada'
    ORDER BY createdAt DESC
)
SELECT
    me.id as MOVIMIENTO_ID,
    me.fuelType as COMBUSTIBLE,
    me.destinationLocation as UBICACION,
    me.quantity as CANTIDAD,
    me.createdAt as FECHA_MOVIMIENTO,
    inv.currentStock as STOCK_ACTUAL_INVENTARIO,
    CASE
        WHEN inv.id IS NOT NULL THEN '✅ INVENTARIO CREADO/ACTUALIZADO'
        ELSE '❌ INVENTARIO NO ACTUALIZADO'
    END as STATUS_INVENTARIO
FROM ultimo_movimiento_entrada me
LEFT JOIN combustibles_inventory inv ON
    inv.fuelType = me.fuelType AND
    inv.location = me.destinationLocation;

-- 8. Resumen final
SELECT 'RESUMEN FINAL' as INFO;
SELECT
    (SELECT COUNT(*) FROM combustibles_movements) as Movimientos,
    (SELECT COUNT(*) FROM combustibles_inventory WHERE status = 'active') as Items_Activos_Inventario,
    (SELECT COUNT(*) FROM combustibles_vehicles WHERE status = 'activo') as Vehiculos_Activos,
    (SELECT SUM(currentStock) FROM combustibles_inventory WHERE status = 'active') as Stock_Total_Combustible;