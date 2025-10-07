-- ============================================
-- FIX: Agregar columnas faltantes para movimientos tipo ENTRADA
-- Tabla: combustibles_movements
-- Forestech Combustibles - 7 Oct 2025
-- ============================================

USE DBforestech;
GO

PRINT '============================================';
PRINT '=== AGREGANDO COLUMNAS PARA ENTRADAS ===';
PRINT '============================================';
PRINT '';

-- Verificar si las columnas ya existen antes de agregarlas
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'combustibles_movements' 
    AND COLUMN_NAME = 'supplierName'
)
BEGIN
    PRINT '✅ Agregando columna: supplierName';
    ALTER TABLE combustibles_movements
    ADD supplierName NVARCHAR(255) NULL;
    PRINT '   ✅ Columna supplierName agregada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️  Columna supplierName ya existe';
END

PRINT '';

IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'combustibles_movements' 
    AND COLUMN_NAME = 'invoiceNumber'
)
BEGIN
    PRINT '✅ Agregando columna: invoiceNumber';
    ALTER TABLE combustibles_movements
    ADD invoiceNumber NVARCHAR(100) NULL;
    PRINT '   ✅ Columna invoiceNumber agregada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️  Columna invoiceNumber ya existe';
END

PRINT '';

IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'combustibles_movements' 
    AND COLUMN_NAME = 'purchaseOrderNumber'
)
BEGIN
    PRINT '✅ Agregando columna: purchaseOrderNumber';
    ALTER TABLE combustibles_movements
    ADD purchaseOrderNumber NVARCHAR(100) NULL;
    PRINT '   ✅ Columna purchaseOrderNumber agregada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️  Columna purchaseOrderNumber ya existe';
END

PRINT '';
PRINT '============================================';
PRINT '=== VERIFICACIÓN FINAL ===';
PRINT '============================================';
PRINT '';

-- Mostrar estructura actualizada de la tabla
PRINT 'Columnas de combustibles_movements (actualizado):';
SELECT 
    COLUMN_NAME as Columna,
    DATA_TYPE as TipoDato,
    CHARACTER_MAXIMUM_LENGTH as LongitudMaxima,
    IS_NULLABLE as Nullable
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'combustibles_movements'
ORDER BY ORDINAL_POSITION;

PRINT '';
PRINT '============================================';
PRINT '=== MIGRACIÓN COMPLETADA ===';
PRINT '============================================';
PRINT '';
PRINT '✅ La tabla combustibles_movements ahora tiene las columnas:';
PRINT '   - supplierName (NVARCHAR(255))';
PRINT '   - invoiceNumber (NVARCHAR(100))';
PRINT '   - purchaseOrderNumber (NVARCHAR(100))';
PRINT '';
PRINT '🎯 Ahora puedes crear movimientos tipo ENTRADA sin problemas.';
PRINT '';

GO
