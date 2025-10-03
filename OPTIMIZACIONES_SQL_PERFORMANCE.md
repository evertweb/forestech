# 🚀 Optimizaciones SQL para Mejorar Performance

## 🔴 Problemas Identificados

### 1. **Error de Performance Monitoring**
```
❌ TypeError: perf.trace is not a function
```
**Causa**: Uso incorrecto de Firebase Performance API  
**Estado**: ✅ **SOLUCIONADO**

### 2. **Lentitud en Carga de Datos** 
```
⏱️ Demoras de 3-10+ segundos al cargar movimientos, vehículos, proveedores
```
**Causa**: Múltiples problemas de optimización SQL  
**Estado**: 🔧 **EN PROCESO**

---

## 📊 Análisis de Problemas SQL

### **Problema 1: SELECT * sin LIMIT**
```sql
-- ❌ ACTUAL (MALO)
SELECT * FROM combustibles_movements
ORDER BY createdAt DESC

-- Trae TODOS los registros (puede ser 1000+ movimientos)
-- Sin paginación, sin límite
-- Tiempo: 5-15 segundos con 1000+ registros
```

```sql
-- ✅ SOLUCIÓN
SELECT * FROM combustibles_movements
ORDER BY createdAt DESC
LIMIT 50 OFFSET 0

-- Solo trae 50 registros más recientes
-- Implementar paginación en frontend
-- Tiempo estimado: 0.5-2 segundos
```

### **Problema 2: Sin Índices en Columnas Clave**
```sql
-- ❌ ACTUAL
-- No hay índices en:
-- - createdAt (usado en ORDER BY)
-- - status (usado en WHERE)
-- - fuelType (usado en WHERE)
-- - type (usado en WHERE)

-- Resultado: Full table scan en cada query
-- Tiempo: O(n) donde n = total de registros
```

```sql
-- ✅ SOLUCIÓN: Crear índices
CREATE INDEX idx_movements_created ON combustibles_movements(createdAt DESC);
CREATE INDEX idx_movements_status ON combustibles_movements(status);
CREATE INDEX idx_movements_fueltype ON combustibles_movements(fuelType);
CREATE INDEX idx_movements_type ON combustibles_movements(type);
CREATE INDEX idx_movements_composite ON combustibles_movements(status, createdAt DESC);

-- Resultado: Index scan en vez de full table scan
-- Tiempo: O(log n) + fetch time
```

### **Problema 3: Queries Complejas sin Optimización**
```sql
-- ❌ ACTUAL (movementsService.js línea 739)
SELECT 
  COUNT(*) as totalMovements,
  SUM(quantity * unitPrice) as totalValue,
  -- ... 14 agregaciones más
FROM combustibles_movements
WHERE ...

-- Calcula TODO cada vez que se pide stats
-- No usa caché, no usa vistas materializadas
-- Tiempo: 3-8 segundos
```

```sql
-- ✅ SOLUCIÓN: Vista materializada o caché
CREATE VIEW v_movements_stats AS
SELECT 
  DATE(createdAt) as date,
  COUNT(*) as totalMovements,
  SUM(quantity * unitPrice) as totalValue,
  ...
FROM combustibles_movements
GROUP BY DATE(createdAt);

-- Actualizar cada hora o cuando hay cambios
-- Consultar la vista en vez de calcular
-- Tiempo: 0.3-1 segundo
```

### **Problema 4: Cold Start de Firebase Functions**
```
⏱️ Primera llamada: 8-15 segundos
⏱️ Llamadas siguientes: 2-5 segundos
```

**Causa**: Functions se "duermen" después de inactividad  
**Solución**: Implementar keep-alive o mínimo instance count

### **Problema 5: No Hay Caché en Frontend**
```javascript
// ❌ ACTUAL
// Cada vez que cambias de pestaña, vuelve a cargar TODO
movementsPage.jsx → Load all movements from SQL
vehiclesPage.jsx → Load all movements from SQL (otra vez)
```

```javascript
// ✅ SOLUCIÓN
// Implementar caché con React Query o SWR
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['movements', filters],
  queryFn: () => getMovements(filters),
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
});

// Primera carga: 2-5 segundos
// Cambios de pestaña: 0ms (caché)
// Refetch automático: Solo cuando datos cambian
```

---

## 🎯 Plan de Optimización (Priorizado)

### **Fase 1: Quick Wins (1-2 horas)** ⚡

#### 1.1 Agregar LIMIT a queries principales
**Archivos a modificar**:
- `functions/src/sql/movementsService.js`
- `functions/src/sql/vehiclesService.js`
- `functions/src/sql/suppliersService.js`

**Cambios**:
```javascript
// Línea ~525 en movementsService.js
const query = `
  SELECT * FROM ${TABLE_NAME}
  ${whereClause}
  ORDER BY createdAt DESC
  LIMIT 100  -- ← AGREGAR
`;
```

**Impacto esperado**: ⬇️ 60-70% en tiempo de carga

#### 1.2 Fix performance monitoring
**Archivo**: `combustibles/src/firebase/performanceMonitoring.js`  
**Estado**: ✅ Ya solucionado

**Impacto esperado**: ❌ Elimina errores en consola

---

### **Fase 2: Índices SQL (30 minutos)** 🗂️

#### 2.1 Crear script de índices
**Archivo nuevo**: `functions/src/sql/create-indexes.js`

```javascript
// Script para crear todos los índices necesarios
const indexes = [
  // Movements
  'CREATE INDEX idx_movements_created ON combustibles_movements(createdAt DESC)',
  'CREATE INDEX idx_movements_status ON combustibles_movements(status)',
  'CREATE INDEX idx_movements_type ON combustibles_movements(type)',
  'CREATE INDEX idx_movements_fueltype ON combustibles_movements(fuelType)',
  'CREATE INDEX idx_movements_composite ON combustibles_movements(status, createdAt DESC)',
  
  // Vehicles
  'CREATE INDEX idx_vehicles_category ON combustibles_vehicles(categoryId)',
  'CREATE INDEX idx_vehicles_status ON combustibles_vehicles(status)',
  
  // Suppliers
  'CREATE INDEX idx_suppliers_category ON combustibles_suppliers(category)',
  'CREATE INDEX idx_suppliers_status ON combustibles_suppliers(status)',
  
  // Inventory
  'CREATE INDEX idx_inventory_fueltype ON combustibles_inventory(fuelType)',
  'CREATE INDEX idx_inventory_updated ON combustibles_inventory(updatedAt DESC)',
];

// Ejecutar todos
for (const sql of indexes) {
  await connection.query(sql);
}
```

**Impacto esperado**: ⬇️ 40-50% adicional en tiempo de queries

---

### **Fase 3: Caché Frontend (2-3 horas)** 💾

#### 3.1 Instalar React Query
```bash
npm install @tanstack/react-query --workspace=combustibles
```

#### 3.2 Configurar QueryClient
**Archivo**: `combustibles/src/main.jsx`

```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
    },
  },
});

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

#### 3.3 Migrar hooks a React Query
**Ejemplo**: `combustibles/src/hooks/useMovements.js`

```javascript
// ❌ ANTES
const [movements, setMovements] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchMovements = async () => {
    setLoading(true);
    const data = await getMovements();
    setMovements(data);
    setLoading(false);
  };
  fetchMovements();
}, []);

// ✅ DESPUÉS
import { useQuery } from '@tanstack/react-query';

const { data: movements, isLoading, refetch } = useQuery({
  queryKey: ['movements', filters],
  queryFn: () => getMovements(filters),
});
```

**Impacto esperado**: 
- Primera carga: Igual
- Navegación entre pestañas: ⚡ Instantáneo (0ms)
- Datos actualizados: Solo cuando necesario

---

### **Fase 4: Optimizar Functions (1 hora)** ☁️

#### 4.1 Configurar keep-alive
**Archivo**: `functions/index.js`

```javascript
// Agregar al inicio de cada function
export const combustiblesMovements = onCall({
  timeoutSeconds: 60,
  memory: '512MB',
  minInstances: 1, // ← AGREGAR (mantener 1 instancia activa)
}, async (request) => {
  // ... código existente
});
```

**Costo**: ~$5-10/mes por mantener 1 instancia  
**Beneficio**: Elimina cold starts (8-15s → 0.5-1s)

#### 4.2 Implementar caché en Functions
**Archivo nuevo**: `functions/src/utils/cache.js`

```javascript
// Simple in-memory cache con TTL
const cache = new Map();

export function getCached(key, ttl = 300000) { // 5 min default
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  return null;
}

export function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}
```

**Uso**:
```javascript
// En movementsService.js
async getAllMovements(filters) {
  const cacheKey = `movements:${JSON.stringify(filters)}`;
  const cached = getCached(cacheKey);
  if (cached) return { success: true, data: cached };
  
  // ... query normal
  const result = await sqlConnection.query(...);
  
  setCache(cacheKey, result);
  return { success: true, data: result };
}
```

**Impacto esperado**: ⬇️ 80-90% en llamadas repetidas

---

## 📈 Resultados Esperados

### **Antes de Optimizaciones**
| Acción | Tiempo |
|--------|--------|
| Cargar Movimientos (primera vez) | 8-15s |
| Cargar Movimientos (subsecuentes) | 3-5s |
| Cambiar de pestaña | 3-5s |
| Cargar Stats | 5-8s |
| Cold start function | 8-12s |

### **Después de Fase 1 (LIMIT)**
| Acción | Tiempo |
|--------|--------|
| Cargar Movimientos (primera vez) | 3-6s ⬇️50% |
| Cargar Movimientos (subsecuentes) | 1-2s ⬇️50% |
| Cambiar de pestaña | 1-2s ⬇️50% |
| Cargar Stats | 3-4s ⬇️40% |
| Cold start function | 8-12s = |

### **Después de Fase 2 (Índices)**
| Acción | Tiempo |
|--------|--------|
| Cargar Movimientos (primera vez) | 1-3s ⬇️70% |
| Cargar Movimientos (subsecuentes) | 0.5-1s ⬇️80% |
| Cambiar de pestaña | 0.5-1s ⬇️80% |
| Cargar Stats | 1-2s ⬇️70% |
| Cold start function | 8-12s = |

### **Después de Fase 3 (Caché Frontend)**
| Acción | Tiempo |
|--------|--------|
| Cargar Movimientos (primera vez) | 1-3s = |
| Cargar Movimientos (subsecuentes) | 0ms ⬇️100% |
| Cambiar de pestaña | 0ms ⬇️100% |
| Cargar Stats | 0ms ⬇️100% |
| Cold start function | 8-12s = |

### **Después de Fase 4 (Optimizar Functions)**
| Acción | Tiempo |
|--------|--------|
| Cargar Movimientos (primera vez) | 0.5-1s ⬇️95% |
| Cargar Movimientos (subsecuentes) | 0ms = |
| Cambiar de pestaña | 0ms = |
| Cargar Stats | 0ms = |
| Cold start function | 0.5-1s ⬇️93% |

---

## 🚀 Implementación Inmediata (Ahora)

### **Quick Fix #1: Agregar LIMIT a getAllMovements**

```javascript
// functions/src/sql/movementsService.js - Línea ~520
async getAllMovements(filters = {}) {
  try {
    // ... código existente ...
    
    const query = `
      SELECT * FROM ${TABLE_NAME}
      ${whereClause}
      ORDER BY createdAt DESC
      LIMIT ${filters.limit || 100}  -- ← AGREGAR ESTA LÍNEA
      ${filters.offset ? `OFFSET ${filters.offset}` : ''}  -- ← Y ESTA
    `;
    
    // ... resto del código ...
  }
}
```

### **Quick Fix #2: Agregar paginación en frontend**

```javascript
// combustibles/src/hooks/useMovements.js
const [page, setPage] = useState(0);
const pageSize = 50;

const { data, isLoading } = useMovements({
  limit: pageSize,
  offset: page * pageSize,
});
```

---

## ✅ Checklist de Implementación

### **Fase 1: Quick Wins**
- [ ] Agregar LIMIT a movementsService.js
- [ ] Agregar LIMIT a vehiclesService.js
- [ ] Agregar LIMIT a suppliersService.js
- [ ] Fix performance monitoring (✅ ya hecho)
- [ ] Probar en dev
- [ ] Deploy a producción
- [ ] Medir mejoras

### **Fase 2: Índices**
- [ ] Crear script create-indexes.js
- [ ] Ejecutar en base de datos dev
- [ ] Verificar performance
- [ ] Ejecutar en producción
- [ ] Medir mejoras

### **Fase 3: Caché Frontend**
- [ ] Instalar React Query
- [ ] Configurar QueryClient
- [ ] Migrar useMovements
- [ ] Migrar useVehicles
- [ ] Migrar useSuppliers
- [ ] Probar navegación
- [ ] Medir mejoras

### **Fase 4: Optimizar Functions**
- [ ] Configurar minInstances
- [ ] Implementar cache.js
- [ ] Agregar caché a services
- [ ] Probar cold starts
- [ ] Medir mejoras
- [ ] Monitorear costos

---

**Preparado por**: GitHub Copilot CLI  
**Fecha**: Enero 2025  
**Prioridad**: 🔴 **ALTA** - Performance crítico  
**Tiempo estimado total**: 4-6 horas  
**Impacto esperado**: ⬇️ 85-95% en tiempos de carga
