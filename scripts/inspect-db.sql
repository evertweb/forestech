USE DBforestech;
GO

SELECT 
    t.name AS Tabla,
    p.rows AS Registros,
    CAST(ROUND((SUM(a.total_pages) * 8) / 1024.00, 2) AS NUMERIC(36, 2)) AS TamanoMB
FROM 
    sys.tables t
INNER JOIN      
    sys.indexes i ON t.OBJECT_ID = i.object_id
INNER JOIN 
    sys.partitions p ON i.object_id = p.OBJECT_ID AND i.index_id = p.index_id
INNER JOIN 
    sys.allocation_units a ON p.partition_id = a.container_id
WHERE 
    t.is_ms_shipped = 0
    AND i.OBJECT_ID > 255
    AND t.name LIKE 'combustibles_%'
GROUP BY 
    t.Name, p.Rows
ORDER BY 
    p.Rows DESC;

SELECT * FROM combustibles_products;
SELECT * FROM combustibles_vehicles;
SELECT * FROM combustibles_vehicle_categories;
SELECT * FROM combustibles_movements;
SELECT * FROM combustibles_inventory;
SELECT * FROM combustibles_suppliers;
SELECT * FROM combustibles_maintenance;
SELECT * FROM combustibles_hour_meter;
