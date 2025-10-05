USE DBforestech;
GO

EXEC sp_MSforeachtable 'ALTER TABLE ? NOCHECK CONSTRAINT ALL';

DELETE FROM combustibles_hour_meter;
DELETE FROM combustibles_maintenance;
DELETE FROM combustibles_movements;
DELETE FROM combustibles_inventory;
DELETE FROM combustibles_vehicles;
DELETE FROM combustibles_products;
DELETE FROM combustibles_suppliers;
DELETE FROM combustibles_vehicle_categories;

DBCC CHECKIDENT ('combustibles_hour_meter', RESEED, 0);
DBCC CHECKIDENT ('combustibles_maintenance', RESEED, 0);
DBCC CHECKIDENT ('combustibles_movements', RESEED, 0);
DBCC CHECKIDENT ('combustibles_inventory', RESEED, 0);
DBCC CHECKIDENT ('combustibles_vehicles', RESEED, 0);
DBCC CHECKIDENT ('combustibles_products', RESEED, 0);
DBCC CHECKIDENT ('combustibles_suppliers', RESEED, 0);
DBCC CHECKIDENT ('combustibles_vehicle_categories', RESEED, 0);

EXEC sp_MSforeachtable 'ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL';

SELECT 
    t.name AS Tabla,
    p.rows AS Registros
FROM 
    sys.tables t
INNER JOIN      
    sys.partitions p ON t.object_id = p.OBJECT_ID
WHERE 
    t.is_ms_shipped = 0
    AND p.index_id IN (0,1)
    AND t.name LIKE 'combustibles_%'
ORDER BY 
    t.name;
