# 🔍 ANÁLISIS COMPLETO: Bodegas y Movimientos Tipo ENTRADA

## ✅ PROBLEMA RESUELTO #1: Columnas SQL Agregadas

Ya se agregaron las columnas faltantes:
- ✅ `supplierName` (NVARCHAR(255))
- ✅ `invoiceNumber` (NVARCHAR(100))
- ✅ `purchaseOrderNumber` (NVARCHAR(100))

---

## 🏢 ANÁLISIS: Bodegas de Destino

### ✅ TU OBSERVACIÓN ES CORRECTA

**Confirmación:**
1. ✅ **Las bodegas ESTÁN hardcodeadas** en el frontend
2. ✅ **NO existe tabla de bodegas** en SQL Server
3. ✅ Las ubicaciones están definidas en constantes de JavaScript

---

## 📍 UBICACIONES ACTUALMENTE DEFINIDAS

### En el Frontend (`combustibles/src/constants/locations.js`):

```javascript
// Ubicaciones operativas (para todo tipo de movimientos)
export const OPERATIONAL_LOCATIONS = [
  'principal',
  'bodega austria',
  'bodega ilusion',
  'campo operativo',
  'estación móvil',
];

// Ubicaciones de almacenamiento (SOLO para movimientos tipo ENTRADA)
export const STORAGE_LOCATIONS = [
  'bodega austria',
  'bodega ilusion'
];
```

### En el Wizard de Movimientos:

**Para movimientos tipo ENTRADA** (`Step6_Destination.jsx` línea 200):
```javascript
const availableDestinations = isEntryDestination
    ? STORAGE_LOCATIONS  // Solo muestra: 'bodega austria' y 'bodega ilusion'
    : OPERATIONAL_LOCATIONS.filter((loc) => loc !== formData.location);
```

---

## 🔄 FLUJO ACTUAL DE MOVIMIENTO TIPO ENTRADA

### Pasos del Wizard:

1. **Step 1**: Tipo de movimiento → Usuario selecciona "ENTRADA"
2. **Step 2**: Tipo de combustible → Ej: "DIESEL"
3. **Step 3**: Ubicación origen → Por defecto "principal"
4. **Step 3b** (🔴 **ESTE ES EL PROBLEMA**): **Bodega de destino**
   - Muestra solo 2 opciones hardcodeadas:
     - `bodega austria`
     - `bodega ilusion`
5. **Step 4**: Cantidad → Ej: 1000 galones
6. **Step 7**: Detalles (precio, fecha, descripción)
7. **Step 8**: Resumen y confirmación

### Datos que se envían al backend:

```javascript
{
  type: 'entrada',
  fuelType: 'DIESEL',
  quantity: 1000,
  unitPrice: 12500,
  location: 'principal',                    // Ubicación origen (opcional)
  destinationLocation: 'bodega austria',    // 🔴 HARDCODEADA - solo 2 opciones
  supplierName: 'Terpel S.A.',             // ✅ Ya funciona (columna agregada)
  invoiceNumber: 'FAC-001',                // ✅ Ya funciona (columna agregada)
  description: 'Compra mensual',
  effectiveDate: '2025-10-07T10:00:00'
}
```

---

## 🗄️ ESTADO DE LA BASE DE DATOS

### Tablas SQL Server Existentes:

✅ **combustibles_movements** - Movimientos (ahora con columnas de entrada)
✅ **combustibles_inventory** - Inventario por combustible y ubicación
✅ **combustibles_vehicles** - Vehículos
✅ **combustibles_vehicle_categories** - Categorías de vehículos
✅ **combustibles_products** - Productos (tipos de combustible)
✅ **combustibles_suppliers** - Proveedores

❌ **NO EXISTE: combustibles_locations** o tabla de bodegas

### Cómo se manejan las ubicaciones actualmente:

Las ubicaciones se almacenan como **strings** en las tablas:
- En `combustibles_movements.destinationLocation` → Ej: `'bodega austria'`
- En `combustibles_inventory.location` → Ej: `'bodega austria'`

**No hay validación deFK (Foreign Key)** - cualquier string se acepta.

---

## ⚠️ PROBLEMAS ACTUALES

### 1. **Bodegas Limitadas y Hardcodeadas**
- Solo 2 bodegas disponibles: `bodega austria` y `bodega ilusion`
- No puedes agregar nuevas bodegas sin modificar el código fuente
- Si necesitas otra bodega, debes:
  1. Editar `/combustibles/src/constants/locations.js`
  2. Recompilar la aplicación
  3. Redesplegar

### 2. **Sin CRUD de Bodegas**
- No hay interfaz para crear/editar/eliminar bodegas
- No hay tabla en SQL para gestionar bodegas
- Las bodegas existen solo en el código JavaScript

### 3. **Inventario Sin Validación**
- La columna `location` en `combustibles_inventory` acepta cualquier string
- No hay validación de que la ubicación exista
- Pueden haber inconsistencias (ej: `bodega Austria` vs `bodega austria`)

### 4. **Dificulta Reportes**
- No puedes hacer un query SQL para obtener lista de bodegas
- Los reportes deben hardcodear las ubicaciones

---

## ✅ SOLUCIONES PROPUESTAS

### **OPCIÓN A: Mantener Hardcodeado (Rápido - 5 minutos)**

**Si solo necesitas agregar más bodegas:**

```javascript
// combustibles/src/constants/locations.js

export const STORAGE_LOCATIONS = [
  'bodega austria',
  'bodega ilusion',
  'bodega principal',      // ← NUEVA
  'bodega norte',          // ← NUEVA
  'bodega sur',            // ← NUEVA
];
```

**Pros:**
- ✅ Rápido (5 minutos)
- ✅ No requiere cambios en DB
- ✅ No requiere backend

**Contras:**
- ❌ Requiere redeploy para agregar bodegas
- ❌ No escalable
- ❌ Sin gestión dinámica

---

### **OPCIÓN B: Crear Tabla de Ubicaciones (Recomendado - 1 hora)**

**1. Crear tabla SQL:**

```sql
CREATE TABLE combustibles_locations (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(100) NOT NULL UNIQUE,
    displayName NVARCHAR(255) NOT NULL,
    type NVARCHAR(50) NOT NULL,  -- 'storage', 'operational', 'mobile'
    maxCapacity DECIMAL(10, 2),   -- Capacidad total (opcional)
    address NVARCHAR(500),
    coordinates NVARCHAR(100),    -- Lat,Lng opcional
    isActive BIT DEFAULT 1,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE()
);

-- Insertar bodegas actuales
INSERT INTO combustibles_locations (name, displayName, type, maxCapacity, isActive)
VALUES 
    ('bodega austria', 'Bodega Austria', 'storage', 50000, 1),
    ('bodega ilusion', 'Bodega Ilusión', 'storage', 50000, 1),
    ('principal', 'Principal', 'operational', NULL, 1),
    ('campo operativo', 'Campo Operativo', 'operational', NULL, 1),
    ('estación móvil', 'Estación Móvil', 'mobile', NULL, 1);
```

**2. Crear servicio en Firebase Functions:**

```javascript
// functions/src/sql/locationsService.js

export async function getAllLocations(filters = {}) {
  const { type } = filters;
  
  let query = `SELECT * FROM combustibles_locations WHERE isActive = 1`;
  
  if (type) {
    query += ` AND type = @type`;
  }
  
  query += ` ORDER BY displayName`;
  
  const result = await sqlConnection.query(query, { type });
  return { success: true, data: result };
}

export async function createLocation(locationData, userInfo) {
  // Implementar creación de ubicación
}
```

**3. Actualizar Frontend:**

```javascript
// combustibles/src/services/FirebaseLocationsService.js

export const getAllLocations = async (type = null) => {
  const result = await httpsCallable(functions, 'combustiblesLocations')({
    action: 'getAll',
    data: { filters: { type } }
  });
  return result.data;
};
```

**4. Modificar Step6_Destination:**

```javascript
// En lugar de STORAGE_LOCATIONS hardcodeado:
const [storageLocations, setStorageLocations] = useState([]);

useEffect(() => {
  const fetchLocations = async () => {
    const result = await getAllLocations('storage');
    if (result.success) {
      setStorageLocations(result.data);
    }
  };
  fetchLocations();
}, []);
```

**Pros:**
- ✅ Escalable - agregar bodegas sin redeploy
- ✅ CRUD completo de ubicaciones
- ✅ Validación con FK en inventario
- ✅ Reportes dinámicos
- ✅ Metadatos (capacidad, coordenadas, etc.)

**Contras:**
- ❌ Más trabajo inicial (1-2 horas)
- ❌ Requiere cambios en DB y backend

---

### **OPCIÓN C: Sistema Híbrido (Compromiso - 30 minutos)**

**Mantener hardcodeado pero agregar validación:**

```javascript
// Validar que destinationLocation esté en la lista permitida
const ALLOWED_LOCATIONS = [
  'bodega austria',
  'bodega ilusion',
  'bodega principal',
  'bodega norte'
];

// En movementsService.js
if (movementData.type === 'entrada') {
  const normalizedLocation = movementData.destinationLocation?.toLowerCase();
  if (!ALLOWED_LOCATIONS.includes(normalizedLocation)) {
    throw new Error(`Ubicación destino inválida: ${movementData.destinationLocation}`);
  }
}
```

**Pros:**
- ✅ Rápido (30 min)
- ✅ Agrega validación
- ✅ Evita errores de tipeo

**Contras:**
- ❌ Sigue siendo hardcodeado
- ❌ Requiere redeploy para cambios

---

## 🎯 RECOMENDACIÓN FINAL

### **Para AHORA (Solución Inmediata):**

**OPCIÓN A + OPCIÓN C** → Agregar bodegas al hardcode + validación

```bash
# 1. Editar locations.js
nano combustibles/src/constants/locations.js

# 2. Agregar tus bodegas:
export const STORAGE_LOCATIONS = [
  'bodega austria',
  'bodega ilusion',
  'bodega principal',     # ← Agregar las que necesites
  'bodega norte',
  'bodega sur',
];

# 3. Rebuild y deploy
npm run build:combustibles
git add .
git commit -m "feat: Agregar nuevas bodegas de almacenamiento"
git push origin main
```

### **Para DESPUÉS (Solución Escalable):**

**OPCIÓN B** → Implementar tabla de ubicaciones con CRUD completo

Esto te permitirá:
- ✅ Agregar bodegas desde la UI
- ✅ Editar capacidades y metadatos
- ✅ Deshabilitar bodegas sin eliminarlas
- ✅ Reportes dinámicos

---

## 📝 SCRIPT PARA CREAR TABLA DE UBICACIONES (OPCIÓN B)

He creado el script SQL listo para ejecutar si decides ir por la opción B.

---

## ❓ SIGUIENTE PASO

**¿Qué prefieres hacer?**

1. **Solución rápida (5 min)**: Agregar bodegas al hardcode
2. **Solución escalable (1-2 horas)**: Crear tabla de ubicaciones con CRUD
3. **Ver el script SQL completo** para crear la tabla de ubicaciones

¿Cuál opción prefieres? 🤔
