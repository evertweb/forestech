-- =====================================================
-- Script de Verificación SIMPLE de Base de Datos Azure SQL
-- =====================================================

-- 1. Verificar que existen las tablas
SELECT 'TABLAS EXISTENTES' as INFO;
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = SCHEMA_NAME()
  AND TABLE_NAME LIKE '%combustibles%';

-- 2. Ver estructura de tabla de movimientos
SELECT 'ESTRUCTURA DE MOVIMIENTOS' as INFO;
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'combustibles_movements'
ORDER BY ORDINAL_POSITION;

-- 3. Ver estructura de tabla de inventario
SELECT 'ESTRUCTURA DE INVENTARIO' as INFO;
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'combustibles_inventory'
ORDER BY ORDINAL_POSITION;

-- 4. Ver movimientos (sin nombres de columnas específicos)
SELECT 'MOVIMIENTOS REGISTRADOS' as INFO;
SELECT * FROM combustibles_movements;

-- 5. Ver inventario (sin nombres de columnas específicos)
SELECT 'INVENTARIO ACTUAL' as INFO;
SELECT * FROM combustibles_inventory;

-- 6. Contar registros
SELECT 'RESUMEN DE REGISTROS' as INFO;
SELECT
    (SELECT COUNT(*) FROM combustibles_movements) as Movimientos,
    (SELECT COUNT(*) FROM combustibles_inventory) as Items_Inventario,
    (SELECT COUNT(*) FROM combustibles_vehicles) as Vehiculos;