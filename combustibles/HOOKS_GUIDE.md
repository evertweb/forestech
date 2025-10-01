# 🎣 GUÍA DE CUSTOM HOOKS - COMBUSTIBLES

**Fecha:** 30 de septiembre de 2025  
**Patrón establecido en:** Refactorización Fase 1  

---

## 📋 RESUMEN

Custom hooks creados para encapsular toda la lógica de negocio y estado de la aplicación. Siguen el patrón de **composición** y **separación de responsabilidades**.

**Hooks disponibles:**
- ✅ `useHourMeter` - Horómetros
- ✅ `useMovements` - Movimientos de combustible (ENTRADA/SALIDA)
- ✅ `useVehicles` - Gestión de vehículos
- ✅ `useInventory` - Inventario y stock
- ✅ `useProducts` - Tipos de combustibles (dinámicos)
- ✅ `useSuppliers` - Gestión de proveedores
- ✅ `useVehicleCategories` - Categorías de vehículos

---

## 🎯 FILOSOFÍA

### Beneficios
- ✅ **Lógica reutilizable** - Un hook, múltiples componentes
- ✅ **Código más limpio** - Componentes enfocados en UI
- ✅ **Fácil de testear** - Hooks pueden testearse independientemente
- ✅ **Mantenimiento** - Cambios en un solo lugar
- ✅ **Separación de concernos** - UI vs lógica de negocio

### Patrón
Todos los hooks siguen el mismo patrón:

```javascript
import { useState, useCallback } from 'react';
import ServiceClass from '../services/ServiceClass';

const service = new ServiceClass();

export const useHookName = (params) => {
  // 1. Estado
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. Métodos con useCallback
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await service.getData();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Return
  return {
    data,
    loading,
    error,
    fetchData,
  };
};
```

---

## 📖 HOOKS DISPONIBLES

### 1. `useHourMeter(vehicleId)`

**Propósito:** Gestión de horómetros de vehículos

**Uso:**
```javascript
import { useHourMeter } from '../../hooks';

function MyComponent({ vehicleId }) {
  const {
    summary,           // Resumen del horómetro
    loadingSummary,    // Cargando resumen
    errorSummary,      // Error en resumen
    history,           // Historial de lecturas
    loadingHistory,    // Cargando historial
    errorHistory,      // Error en historial
    fetchSummary,      // Método para recargar
    fetchHistory,      // Método para cargar historial
    refresh,           // Refrescar todo
  } = useHourMeter(vehicleId);

  // Auto-carga el resumen al montar
  // Historial se carga bajo demanda con fetchHistory()

  return (
    <div>
      {loadingSummary && <p>Cargando...</p>}
      {summary && <p>Lectura: {summary.currentReading}h</p>}
    </div>
  );
}
```

**Características:**
- Auto-carga resumen cuando cambia `vehicleId`
- Historial bajo demanda (llamar `fetchHistory(maxEntries)`)
- Método `refresh()` para recargar todo

---

### 2. `useMovements()`

**Propósito:** Gestión de movimientos de combustible (ENTRADA y SALIDA)

**Uso:**
```javascript
import { useMovements } from '../../hooks';

function MovementsComponent() {
  const {
    movements,         // Lista de movimientos
    loading,           // Cargando
    error,             // Error
    creating,          // Creando nuevo movimiento
    fetchMovements,    // Cargar movimientos
    createMovement,    // Crear movimiento
    deleteMovement,    // Eliminar movimiento
    validateStock,     // Validar stock disponible
    getStats,          // Estadísticas
  } = useMovements();

  // Cargar movimientos al montar
  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  // Crear movimiento
  const handleCreate = async () => {
    const result = await createMovement({
      type: 'entrada',
      fuelType: 'ACPM',
      quantity: 100,
      // ... más datos
    });

    if (result.success) {
      alert('Movimiento creado');
    }
  };

  // Validar stock antes de crear SALIDA
  const handleValidate = async () => {
    const validation = await validateStock('ACPM', 'Bodega 1', 50);
    if (validation.valid) {
      // Proceder con creación
    }
  };

  return (
    <div>
      {loading && <p>Cargando...</p>}
      {movements.map(m => <div key={m.id}>{m.type}</div>)}
    </div>
  );
}
```

**Características:**
- Solo permite movimientos tipo **ENTRADA** y **SALIDA**
- Validación de tipos de movimiento incluida
- Valida stock antes de crear movimientos
- Auto-refresca lista después de crear/eliminar

---

### 3. `useVehicles()`

**Propósito:** Gestión de vehículos

**Uso:**
```javascript
import { useVehicles } from '../../hooks';

function VehiclesComponent() {
  const {
    vehicles,              // Lista de vehículos
    loading,               // Cargando
    error,                 // Error
    saving,                // Guardando cambios
    fetchVehicles,         // Cargar vehículos
    fetchActiveVehicles,   // Solo activos
    getVehicle,            // Obtener uno
    getVehiclesByFuelType, // Filtrar por combustible
    createVehicle,         // Crear
    updateVehicle,         // Actualizar
    deleteVehicle,         // Eliminar
  } = useVehicles();

  // Cargar todos los vehículos
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  // Cargar solo activos
  useEffect(() => {
    fetchActiveVehicles();
  }, [fetchActiveVehicles]);

  // Crear vehículo
  const handleCreate = async () => {
    const result = await createVehicle({
      vehicleId: 'TR-001',
      name: 'Tractor 1',
      fuelType: 'ACPM',
      hasHourMeter: true,
      // ... más datos
    });

    if (result.success) {
      alert('Vehículo creado');
    }
  };

  return (
    <div>
      {vehicles.map(v => <div key={v.id}>{v.name}</div>)}
    </div>
  );
}
```

**Características:**
- CRUD completo de vehículos
- Filtros rápidos (activos, por tipo de combustible)
- Auto-refresca después de operaciones

---

### 4. `useInventory()`

**Propósito:** Gestión de inventario y stock de combustibles

**Uso:**
```javascript
import { useInventory } from '../../hooks';

function InventoryComponent() {
  const {
    inventory,                 // Lista de inventario
    loading,                   // Cargando
    error,                     // Error
    saving,                    // Guardando
    fetchInventory,            // Cargar inventario
    getByLocation,             // Por ubicación
    getAvailableStock,         // Stock disponible
    validateStock,             // Validar stock
    createInventoryLocation,   // Crear ubicación
    updateInventoryLocation,   // Actualizar
    getLowStockAlerts,         // Alertas de stock bajo
    getStats,                  // Estadísticas
  } = useInventory();

  // Cargar inventario
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Verificar stock disponible
  const checkStock = async () => {
    const stock = await getAvailableStock('ACPM', 'Bodega 1');
    console.log(`Disponible: ${stock.available} galones`);
  };

  // Validar antes de crear movimiento
  const validate = async () => {
    const result = await validateStock('ACPM', 'Bodega 1', 50);
    if (result.valid) {
      console.log('Stock suficiente');
    } else {
      console.log(result.message);
    }
  };

  // Alertas de stock bajo
  const checkAlerts = async () => {
    const alerts = await getLowStockAlerts();
    console.log(`${alerts.length} alertas de stock bajo`);
  };

  return (
    <div>
      {inventory.map(i => (
        <div key={i.id}>
          {i.location}: {i.currentStock} gal
        </div>
      ))}
    </div>
  );
}
```

**Características:**
- Gestión completa de inventario
- Validación de stock en tiempo real
- Alertas de stock bajo
- Estadísticas de inventario

---

## 🎨 PATRONES DE USO

### Patrón 1: Hook Simple (solo lectura)
```javascript
function MyComponent() {
  const { data, loading, error, fetchData } = useMyHook();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  return <div>{data}</div>;
}
```

### Patrón 2: Hook con Acciones
```javascript
function MyComponent() {
  const {
    data,
    loading,
    error,
    fetchData,
    createItem,
    deleteItem,
  } = useMyHook();

  const handleCreate = async () => {
    const result = await createItem(newData);
    if (result.success) {
      // Éxito - la lista se refresca automáticamente
      alert('Creado exitosamente');
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div>
      <button onClick={handleCreate}>Crear</button>
      {data.map(item => <Item key={item.id} {...item} />)}
    </div>
  );
}
```

### Patrón 3: Hook con Parámetros
```javascript
function MyComponent({ vehicleId }) {
  const { summary, loading } = useHourMeter(vehicleId);
  
  // Se recarga automáticamente cuando vehicleId cambia
  
  return <div>{summary?.currentReading}</div>;
}
```

### Patrón 4: Combinar Múltiples Hooks
```javascript
function MovementWizard() {
  const { vehicles, fetchActiveVehicles } = useVehicles();
  const { validateStock } = useInventory();
  const { createMovement, creating } = useMovements();

  const handleSubmit = async (data) => {
    // 1. Validar stock
    const validation = await validateStock(
      data.fuelType,
      data.location,
      data.quantity
    );

    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    // 2. Crear movimiento
    const result = await createMovement(data);
    
    if (result.success) {
      alert('Movimiento creado');
    }
  };

  return <Form onSubmit={handleSubmit} />;
}
```

---

## 🚀 MEJORES PRÁCTICAS

### 1. Cargar Datos al Montar
```javascript
useEffect(() => {
  fetchData();
}, [fetchData]);
```

### 2. Manejar Estados de Carga
```javascript
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data || data.length === 0) return <EmptyState />;
```

### 3. Validar Antes de Acciones
```javascript
const handleDelete = async (id) => {
  if (!confirm('¿Estás seguro?')) return;
  
  const result = await deleteItem(id);
  if (result.success) {
    toast.success('Eliminado');
  } else {
    toast.error(result.error);
  }
};
```

### 4. No Duplicar Lógica
```javascript
// ❌ MAL - duplicar lógica en componente
const [vehicles, setVehicles] = useState([]);
const loadVehicles = async () => {
  const result = await vehiclesService.getAll();
  setVehicles(result.data);
};

// ✅ BIEN - usar el hook
const { vehicles, fetchVehicles } = useVehicles();
```

---

## 📝 NOTAS IMPORTANTES

### Auto-Refresco
Los hooks **automáticamente refrescan** la lista después de operaciones CUD (Create, Update, Delete):

```javascript
const { createMovement } = useMovements();

// Después de createMovement(), la lista movements se refresca automáticamente
await createMovement(data);
// No necesitas llamar fetchMovements() manualmente
```

### Gestión de Errores
Todos los hooks exponen un estado `error` que contiene el mensaje de error:

```javascript
const { error } = useMovements();

{error && <div className="error">{error}</div>}
```

### Loading States
Diferentes estados de loading para diferentes operaciones:

- `loading` - Operación de lectura (fetch)
- `creating` / `saving` - Operación de escritura

```javascript
const { loading, creating } = useMovements();

{loading && <Spinner text="Cargando..." />}
{creating && <Spinner text="Creando..." />}
```

---

## 🔄 ROADMAP DE HOOKS

### Completados ✅
- [x] `useHourMeter`
- [x] `useMovements`
- [x] `useVehicles`
- [x] `useInventory`
- [x] `useProducts` - Tipos de combustibles (dinámicos)
- [x] `useSuppliers` - Gestión de proveedores
- [x] `useVehicleCategories` - Categorías de vehículos

### Por Crear (Opcional) 🔜
- [ ] `useAuth` - Estado de autenticación centralizado
- [ ] `useDashboard` - Métricas del dashboard

---

## 📚 RECURSOS

**Archivos:**
- `/src/hooks/useHourMeter.js`
- `/src/hooks/useMovements.js`
- `/src/hooks/useVehicles.js`
- `/src/hooks/useInventory.js`
- `/src/hooks/useProducts.js`
- `/src/hooks/useSuppliers.js`
- `/src/hooks/useVehicleCategories.js`
- `/src/hooks/index.js` (exports centralizados)

**Servicios relacionados:**
- `/src/services/FirebaseHourMeterService.js`
- `/src/services/FirebaseMovementsService.js`
- `/src/services/FirebaseVehiclesService.js`
- `/src/services/FirebaseInventoryService.js`
- `/src/services/FirebaseProductsService.js`
- `/src/services/FirebaseSuppliersService.js`
- `/src/services/FirebaseVehicleCategoriesService.js`

---

**Última actualización:** 30 de septiembre de 2025  
**Versión:** 1.0  
**Autor:** Forestech Development Team

