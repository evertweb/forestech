-- Migración: Verificar y configurar columna isPreferred
-- Ejecutar este script en SQL Server (DigitalOcean)

USE forestechCombus;
GO

-- Verificar si la columna existe
IF EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'combustibles_suppliers' 
    AND COLUMN_NAME = 'isPreferred'
)
BEGIN
    PRINT '✅ La columna isPreferred ya existe';
    
    -- Verificar si el índice existe, si no, crearlo
    IF NOT EXISTS (
        SELECT * FROM sys.indexes 
        WHERE object_id = OBJECT_ID('combustibles_suppliers') 
        AND name = 'idx_is_preferred'
    )
    BEGIN
        CREATE INDEX idx_is_preferred ON combustibles_suppliers(isPreferred);
        PRINT '✅ Índice idx_is_preferred creado exitosamente';
    END
    ELSE
    BEGIN
        PRINT '⚠️ El índice idx_is_preferred ya existe';
    END
    
    -- Actualizar valores NULL a 0 por si acaso
    UPDATE combustibles_suppliers 
    SET isPreferred = 0 
    WHERE isPreferred IS NULL;
    
    PRINT '✅ Valores NULL actualizados a 0';
END
ELSE
BEGIN
    -- Si no existe, crearla
    ALTER TABLE combustibles_suppliers 
    ADD isPreferred BIT DEFAULT 0;
    
    PRINT '✅ Columna isPreferred creada exitosamente';
    
    -- Crear índice
    CREATE INDEX idx_is_preferred ON combustibles_suppliers(isPreferred);
    PRINT '✅ Índice idx_is_preferred creado exitosamente';
END
GO

-- Verificar estructura final
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'combustibles_suppliers' 
AND COLUMN_NAME = 'isPreferred';

PRINT '🔍 Verificación de columna isPreferred completada';
GO