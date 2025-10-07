-- ============================================
-- CREAR TABLA DE UBICACIONES/BODEGAS
-- Sistema escalable de gestión de ubicaciones
-- Forestech Combustibles - 7 Oct 2025
-- ============================================

USE DBforestech;
GO

PRINT '============================================';
PRINT '=== CREANDO TABLA DE UBICACIONES ===';
PRINT '============================================';
PRINT '';

-- Crear tabla combustibles_locations
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_NAME = 'combustibles_locations'
)
BEGIN
    PRINT '✅ Creando tabla: combustibles_locations';
    
    CREATE TABLE combustibles_locations (
        -- Identificación
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        name NVARCHAR(100) NOT NULL UNIQUE,              -- Nombre normalizado (lowercase)
        displayName NVARCHAR(255) NOT NULL,              -- Nombre para mostrar en UI
        
        -- Clasificación
        type NVARCHAR(50) NOT NULL,                      -- 'storage', 'operational', 'mobile'
        
        -- Capacidades y ubicación física
        maxCapacity DECIMAL(10, 2),                      -- Capacidad máxima total (opcional)
        address NVARCHAR(500),                           -- Dirección física (opcional)
        coordinates NVARCHAR(100),                       -- Lat,Lng (opcional para mapas)
        
        -- Metadatos
        description NVARCHAR(MAX),                       -- Descripción adicional
        responsible NVARCHAR(255),                       -- Responsable de la ubicación
        contactPhone NVARCHAR(50),                       -- Teléfono de contacto
        
        -- Estado
        isActive BIT DEFAULT 1,                          -- 1 = activo, 0 = inactivo
        
        -- Auditoría
        createdBy NVARCHAR(255),
        createdByUid NVARCHAR(255),
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
    );
    
    PRINT '   ✅ Tabla combustibles_locations creada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️  Tabla combustibles_locations ya existe';
END

PRINT '';
PRINT '============================================';
PRINT '=== INSERTANDO UBICACIONES INICIALES ===';
PRINT '============================================';
PRINT '';

-- Insertar bodegas de almacenamiento actuales
IF NOT EXISTS (SELECT 1 FROM combustibles_locations WHERE name = 'bodega austria')
BEGIN
    PRINT '📦 Insertando: Bodega Austria';
    INSERT INTO combustibles_locations (
        name, displayName, type, maxCapacity, 
        description, isActive, createdBy
    )
    VALUES (
        'bodega austria', 
        'Bodega Austria', 
        'storage', 
        50000,
        'Bodega principal de almacenamiento de combustibles - Sector Austria',
        1,
        'system'
    );
END

IF NOT EXISTS (SELECT 1 FROM combustibles_locations WHERE name = 'bodega ilusion')
BEGIN
    PRINT '📦 Insertando: Bodega Ilusión';
    INSERT INTO combustibles_locations (
        name, displayName, type, maxCapacity,
        description, isActive, createdBy
    )
    VALUES (
        'bodega ilusion',
        'Bodega Ilusión',
        'storage',
        50000,
        'Bodega secundaria de almacenamiento de combustibles - Sector Ilusión',
        1,
        'system'
    );
END

-- Insertar ubicaciones operativas actuales
IF NOT EXISTS (SELECT 1 FROM combustibles_locations WHERE name = 'principal')
BEGIN
    PRINT '🏢 Insertando: Principal';
    INSERT INTO combustibles_locations (
        name, displayName, type,
        description, isActive, createdBy
    )
    VALUES (
        'principal',
        'Principal',
        'operational',
        'Ubicación operativa principal',
        1,
        'system'
    );
END

IF NOT EXISTS (SELECT 1 FROM combustibles_locations WHERE name = 'campo operativo')
BEGIN
    PRINT '🏗️  Insertando: Campo Operativo';
    INSERT INTO combustibles_locations (
        name, displayName, type,
        description, isActive, createdBy
    )
    VALUES (
        'campo operativo',
        'Campo Operativo',
        'operational',
        'Ubicación operativa en campo',
        1,
        'system'
    );
END

IF NOT EXISTS (SELECT 1 FROM combustibles_locations WHERE name = 'estación móvil')
BEGIN
    PRINT '🚚 Insertando: Estación Móvil';
    INSERT INTO combustibles_locations (
        name, displayName, type,
        description, isActive, createdBy
    )
    VALUES (
        'estación móvil',
        'Estación Móvil',
        'mobile',
        'Estación móvil de distribución de combustibles',
        1,
        'system'
    );
END

PRINT '';
PRINT '============================================';
PRINT '=== CREAR ÍNDICES PARA OPTIMIZACIÓN ===';
PRINT '============================================';
PRINT '';

-- Índice por tipo (para filtrar bodegas de almacenamiento)
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes 
    WHERE name = 'IX_combustibles_locations_type' 
    AND object_id = OBJECT_ID('combustibles_locations')
)
BEGIN
    PRINT '📊 Creando índice: IX_combustibles_locations_type';
    CREATE INDEX IX_combustibles_locations_type 
    ON combustibles_locations(type) 
    WHERE isActive = 1;
    PRINT '   ✅ Índice creado';
END

-- Índice por nombre (para búsquedas rápidas)
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes 
    WHERE name = 'IX_combustibles_locations_name' 
    AND object_id = OBJECT_ID('combustibles_locations')
)
BEGIN
    PRINT '📊 Creando índice: IX_combustibles_locations_name';
    CREATE INDEX IX_combustibles_locations_name 
    ON combustibles_locations(name) 
    WHERE isActive = 1;
    PRINT '   ✅ Índice creado';
END

PRINT '';
PRINT '============================================';
PRINT '=== VERIFICACIÓN FINAL ===';
PRINT '============================================';
PRINT '';

-- Mostrar ubicaciones creadas
PRINT 'Ubicaciones creadas:';
SELECT 
    displayName as Nombre,
    type as Tipo,
    maxCapacity as CapacidadMaxima,
    isActive as Activo
FROM combustibles_locations
ORDER BY type, displayName;

PRINT '';
PRINT '============================================';
PRINT '=== MIGRACIÓN COMPLETADA ===';
PRINT '============================================';
PRINT '';
PRINT '✅ Tabla combustibles_locations creada';
PRINT '✅ 5 ubicaciones iniciales insertadas';
PRINT '✅ Índices de optimización creados';
PRINT '';
PRINT '📋 TIPOS DE UBICACIONES:';
PRINT '   - storage: Bodegas de almacenamiento (para ENTRADAS)';
PRINT '   - operational: Ubicaciones operativas';
PRINT '   - mobile: Estaciones móviles';
PRINT '';
PRINT '🎯 PRÓXIMOS PASOS:';
PRINT '   1. Crear servicio en Firebase Functions (locationsService.js)';
PRINT '   2. Crear endpoints para CRUD de ubicaciones';
PRINT '   3. Actualizar frontend para cargar ubicaciones dinámicamente';
PRINT '   4. Opcional: Crear UI para gestión de ubicaciones';
PRINT '';

GO

-- ============================================
-- QUERIES ÚTILES PARA GESTIÓN DE UBICACIONES
-- ============================================

PRINT '============================================';
PRINT '=== QUERIES ÚTILES ===';
PRINT '============================================';
PRINT '';

PRINT '-- Obtener solo bodegas de almacenamiento (para ENTRADAS):';
PRINT 'SELECT * FROM combustibles_locations WHERE type = ''storage'' AND isActive = 1;';
PRINT '';

PRINT '-- Obtener todas las ubicaciones activas:';
PRINT 'SELECT * FROM combustibles_locations WHERE isActive = 1 ORDER BY type, displayName;';
PRINT '';

PRINT '-- Agregar nueva bodega:';
PRINT 'INSERT INTO combustibles_locations (name, displayName, type, maxCapacity, isActive, createdBy)';
PRINT 'VALUES (''bodega norte'', ''Bodega Norte'', ''storage'', 30000, 1, ''admin'');';
PRINT '';

PRINT '-- Desactivar bodega (sin eliminar):';
PRINT 'UPDATE combustibles_locations SET isActive = 0 WHERE name = ''bodega norte'';';
PRINT '';

GO
