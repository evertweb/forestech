/*
  Migration: 20241012_trim_combustibles_suppliers.sql
  Objetivo: Reducir la tabla combustibles_suppliers a los 10 campos funcionales.
  Columnas finales esperadas (además del id autoincremental):
    name, taxId, type, category, contactPerson, phone, email, city, status, paymentTerms
*/

DECLARE @schema SYSNAME = 'dbo';
DECLARE @table SYSNAME = 'combustibles_suppliers';

IF OBJECT_ID(QUOTENAME(@schema) + '.' + QUOTENAME(@table)) IS NULL
BEGIN
  PRINT '⚠️ Tabla combustibles_suppliers no existe; no se realizan cambios.';
  RETURN;
END;

DECLARE @columnsToDrop TABLE (columnName SYSNAME);
INSERT INTO @columnsToDrop(columnName)
VALUES
  ('address'),
  ('state'),
  ('fuelTypes'),
  ('creditLimit'),
  ('priceList'),
  ('rating'),
  ('evaluationNotes'),
  ('isPreferred'),
  ('totalOrders'),
  ('totalPurchased'),
  ('lastOrderDate'),
  ('averageDeliveryTime'),
  ('createdBy'),
  ('updatedBy'),
  ('createdAt'),
  ('updatedAt');

DECLARE @column SYSNAME;

WHILE EXISTS (SELECT 1 FROM @columnsToDrop)
BEGIN
  SELECT TOP 1 @column = columnName FROM @columnsToDrop ORDER BY columnName;

  IF EXISTS (
    SELECT 1
    FROM sys.columns
    WHERE object_id = OBJECT_ID(QUOTENAME(@schema) + '.' + QUOTENAME(@table))
      AND name = @column
  )
  BEGIN
    DECLARE @constraintName NVARCHAR(128);
    DECLARE @sql NVARCHAR(MAX);

    -- Eliminar constraints por defecto asociados a la columna
    SELECT TOP 1 @constraintName = dc.name
    FROM sys.default_constraints dc
    JOIN sys.columns c ON c.default_object_id = dc.object_id
    WHERE c.object_id = OBJECT_ID(QUOTENAME(@schema) + '.' + QUOTENAME(@table))
      AND c.name = @column;

    IF @constraintName IS NOT NULL
    BEGIN
      SET @sql = 'ALTER TABLE ' + QUOTENAME(@schema) + '.' + QUOTENAME(@table) +
                 ' DROP CONSTRAINT ' + QUOTENAME(@constraintName) + ';';
      PRINT '🔧 Eliminando constraint por defecto ' + @constraintName + ' en columna ' + @column;
      EXEC (@sql);
    END

    -- Eliminar índices que incluyan la columna (excepto PKs)
    DECLARE index_cursor CURSOR FAST_FORWARD FOR
      SELECT i.name
      FROM sys.indexes i
      JOIN sys.index_columns ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id
      JOIN sys.columns c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
      WHERE i.object_id = OBJECT_ID(QUOTENAME(@schema) + '.' + QUOTENAME(@table))
        AND c.name = @column
        AND i.is_primary_key = 0
        AND i.is_unique_constraint = 0;

    DECLARE @indexName SYSNAME;
    OPEN index_cursor;
    FETCH NEXT FROM index_cursor INTO @indexName;
    WHILE @@FETCH_STATUS = 0
    BEGIN
      SET @sql = 'DROP INDEX ' + QUOTENAME(@indexName) + ' ON ' + QUOTENAME(@schema) + '.' + QUOTENAME(@table) + ';';
      PRINT '🔧 Eliminando índice ' + @indexName + ' asociado a la columna ' + @column;
      EXEC (@sql);
      FETCH NEXT FROM index_cursor INTO @indexName;
    END
    CLOSE index_cursor;
    DEALLOCATE index_cursor;

    -- Eliminar la columna
    SET @sql = 'ALTER TABLE ' + QUOTENAME(@schema) + '.' + QUOTENAME(@table) +
               ' DROP COLUMN ' + QUOTENAME(@column) + ';';
    PRINT '🗑️ Eliminando columna ' + @column + ' de combustibles_suppliers';
    EXEC (@sql);
  END
  ELSE
  BEGIN
    PRINT 'ℹ️ Columna ' + @column + ' no existe; se omite.';
  END

  DELETE FROM @columnsToDrop WHERE columnName = @column;
END

PRINT '✅ Migración completada: combustibles_suppliers contiene solo los 10 campos funcionales definidos.';
