# 🏪 GUÍA DE STORES - ZUSTAND

**Fecha:** 1 de octubre de 2025  
**Fase:** Sprint 1 - State Management  
**Estado:** ✅ Stores creados, pendiente migración de componentes

---

## 📋 RESUMEN

Esta guía documenta los **5 stores de Zustand** creados para reemplazar el Context API monolítico (`CombustiblesContext`).

**Stores disponibles:**
- ✅ `useAuthStore` - Autenticación y permisos
- ✅ `useMovementsStore` - Movimientos de combustible
- ✅ `useVehiclesStore` - Gestión de vehículos
- ✅ `useInventoryStore` - Inventario y stock
- ✅ `useProductsStore` - Tipos de combustibles (productos)

---

## 🎯 FILOSOFÍA Y VENTAJAS

### ¿Por qué Zustand?

1. **🚀 Más simple que Redux** - Sin boilerplate, sin providers anidados
2. **⚡ Mejor performance** - No re-renders innecesarios
3. **🔍 DevTools** - Integración con Redux DevTools
4. **📦 Pequeño** - Solo 1KB gzipped
5. **🎯 Selectores** - Re-renders solo cuando cambia lo que necesitas

### Comparación con Context API

| Feature | Context API | Zustand |
|---------|-------------|---------|
| Re-renders | ❌ Todo el árbol | ✅ Solo componentes suscritos |
| Performance | ⚠️ Puede ser lenta | ✅ Excelente |
| DevTools | ❌ No | ✅ Sí |
| Boilerplate | ⚠️ Medio | ✅ Mínimo |
| Testing | ⚠️ Difícil | ✅ Fácil |

---

## 🔐 AUTH STORE

### Propósito
Manejo de autenticación, usuario y permisos.

### Estado
```javascript
{
  user: Object | null,           // Firebase user
  userProfile: Object | null,    // User profile from Firestore
  loading: boolean,              // Loading state
  error: string | null,          // Error message
  authReady: boolean,            // Auth initialization complete
}
```

### Uso Básico
```javascript
import { useAuthStore } from '@/stores';

function MyComponent() {
  // Opción 1: Obtener todo el estado
  const { user, userProfile, loading } = useAuthStore();

  // Opción 2: Selectores (mejor performance)
  const userEmail = useAuthStore(state => state.user?.email);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  // Opción 3: Solo funciones
  const hasPermission = useAuthStore(state => state.hasPermission);
  const isAdmin = useAuthStore(state => state.isAdmin);

  if (hasPermission('movements:create')) {
    return <CreateButton />;
  }

  return null;
}
```

### Acciones Principales
```javascript
const { 
  setUser,           // Establecer usuario
  setUserProfile,    // Establecer perfil
  setLoading,        // Estado de carga
  setError,          // Establecer error
  hasPermission,     // Verificar permiso
  isAdmin,           // Verificar si es admin
  isCounterOrAbove,  // Verificar si es contador+
  reset,             // Reset store
} = useAuthStore();
```

### Selectores Útiles
```javascript
import { 
  selectUserEmail,
  selectUserRole,
  selectLoading,
  selectIsAuthenticated,
} from '@/stores';

const userEmail = useAuthStore(selectUserEmail);
const isAuth = useAuthStore(selectIsAuthenticated);
```

---

## 📦 MOVEMENTS STORE

### Propósito
Gestión de movimientos de combustible (ENTRADA y SALIDA).

### Estado
```javascript
{
  movements: Array<Object>,       // Lista de movimientos
  loading: boolean,               // Cargando datos
  creating: boolean,              // Creando movimiento
  error: string | null,           // Error
  unsubscribe: function | null,   // Función de desuscripción
}
```

### Uso Básico
```javascript
import { useMovementsStore } from '@/stores';

function MovementsComponent() {
  const { movements, loading, fetchMovements, createMovement } = useMovementsStore();

  useEffect(() => {
    fetchMovements(); // Una vez
    // O usar suscripción en tiempo real:
    // const unsubscribe = subscribeToMovements();
    // return () => unsubscribe();
  }, [fetchMovements]);

  const handleCreate = async () => {
    const result = await createMovement({
      type: 'entrada',
      fuelType: 'DIESEL',
      quantity: 100,
      location: 'Bodega 1',
      unitPrice: 12.50,
    });

    if (result.success) {
      alert('Movimiento creado');
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <button onClick={handleCreate}>Crear</button>
      {movements.map(m => (
        <div key={m.id}>{m.type} - {m.quantity} gal</div>
      ))}
    </div>
  );
}
```

### Acciones Principales
```javascript
const {
  fetchMovements,           // Cargar una vez
  subscribeToMovements,     // Suscripción en tiempo real
  unsubscribeFromMovements, // Cancelar suscripción
  createMovement,           // Crear movimiento
  deleteMovement,           // Eliminar movimiento
  validateStock,            // Validar stock disponible
  getStats,                 // Estadísticas
  getMovementsByType,       // Filtrar por tipo
  getMovementById,          // Obtener por ID
  reset,                    // Reset store
} = useMovementsStore();
```

### Selectores
```javascript
import { selectMovementsCount, selectMovementsByType } from '@/stores';

const count = useMovementsStore(selectMovementsCount);
const entradas = useMovementsStore(selectMovementsByType('entrada'));
```

---

## 🚗 VEHICLES STORE

### Propósito
Gestión de vehículos y sus operaciones CRUD.

### Estado
```javascript
{
  vehicles: Array<Object>,        // Lista de vehículos
  loading: boolean,               // Cargando
  saving: boolean,                // Guardando
  error: string | null,           // Error
  unsubscribe: function | null,   // Desuscripción
}
```

### Uso Básico
```javascript
import { useVehiclesStore } from '@/stores';

function VehiclesComponent() {
  const { vehicles, loading, fetchVehicles, createVehicle } = useVehiclesStore();

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleCreate = async () => {
    const result = await createVehicle({
      vehicleId: 'TR-001',
      name: 'Tractor 1',
      fuelType: 'DIESEL',
      hasHourMeter: true,
      categoryName: 'Tractor',
    });

    if (result.success) {
      alert('Vehículo creado');
    }
  };

  return (
    <div>
      {vehicles.map(v => (
        <div key={v.id}>{v.name} - {v.fuelType}</div>
      ))}
    </div>
  );
}
```

### Acciones Principales
```javascript
const {
  fetchVehicles,            // Cargar todos
  fetchActiveVehicles,      // Solo activos
  subscribeToVehicles,      // Suscripción tiempo real
  unsubscribeFromVehicles,  // Cancelar suscripción
  createVehicle,            // Crear
  updateVehicle,            // Actualizar
  deleteVehicle,            // Eliminar
  getVehicle,               // Obtener uno
  getVehiclesByFuelType,    // Filtrar por combustible
  getVehiclesByCategory,    // Filtrar por categoría
  reset,                    // Reset
} = useVehiclesStore();
```

### Selectores
```javascript
import { 
  selectVehiclesCount, 
  selectActiveVehicles, 
  selectVehiclesWithHourMeter 
} from '@/stores';

const count = useVehiclesStore(selectVehiclesCount);
const activeOnly = useVehiclesStore(selectActiveVehicles);
const withHourMeter = useVehiclesStore(selectVehiclesWithHourMeter);
```

---

## 📊 INVENTORY STORE

### Propósito
Gestión de inventario y stock de combustibles por ubicación.

### Estado
```javascript
{
  inventory: Array<Object>,       // Ubicaciones de inventario
  loading: boolean,               // Cargando
  saving: boolean,                // Guardando
  error: string | null,           // Error
  unsubscribe: function | null,   // Desuscripción
}
```

### Uso Básico
```javascript
import { useInventoryStore } from '@/stores';

function InventoryComponent() {
  const { 
    inventory, 
    loading, 
    fetchInventory, 
    validateStock,
    getLowStockAlerts 
  } = useInventoryStore();

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const checkStock = async () => {
    const validation = await validateStock('DIESEL', 'Bodega 1', 50);
    
    if (validation.valid) {
      console.log('Stock suficiente');
    } else {
      alert(validation.message);
    }
  };

  const checkAlerts = async () => {
    const alerts = await getLowStockAlerts();
    console.log(`${alerts.length} alertas de stock bajo`);
  };

  return (
    <div>
      {inventory.map(item => (
        <div key={item.id}>
          {item.location}: {item.currentStock} / {item.maxCapacity} gal
        </div>
      ))}
    </div>
  );
}
```

### Acciones Principales
```javascript
const {
  fetchInventory,              // Cargar inventario
  subscribeToInventory,        // Suscripción tiempo real
  unsubscribeFromInventory,    // Cancelar suscripción
  createInventoryLocation,     // Crear ubicación
  updateInventoryLocation,     // Actualizar ubicación
  getByLocation,               // Filtrar por ubicación
  getAvailableStock,           // Stock disponible
  validateStock,               // Validar stock
  getLowStockAlerts,           // Alertas de stock bajo
  getStats,                    // Estadísticas
  reset,                       // Reset
} = useInventoryStore();
```

### Selectores
```javascript
import { 
  selectInventoryCount, 
  selectLowStockItems,
  selectInventoryByFuelType
} from '@/stores';

const count = useInventoryStore(selectInventoryCount);
const lowStock = useInventoryStore(selectLowStockItems);
const diesel = useInventoryStore(selectInventoryByFuelType('DIESEL'));
```

---

## ⛽ PRODUCTS STORE

### Propósito
Gestión de productos (tipos de combustibles dinámicos creados por usuarios).

### Estado
```javascript
{
  products: Array<Object>,        // Lista de productos
  loading: boolean,               // Cargando
  saving: boolean,                // Guardando
  error: string | null,           // Error
  unsubscribe: function | null,   // Desuscripción
}
```

### Uso Básico
```javascript
import { useProductsStore } from '@/stores';

function ProductsComponent() {
  const { 
    products, 
    loading, 
    fetchProducts, 
    createProduct,
    getFuelTypesForSelect 
  } = useProductsStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCreate = async () => {
    const result = await createProduct({
      name: 'DIESEL PREMIUM',
      unit: 'gal',
      density: 0.85,
      color: '#FFD700',
      active: true,
    });

    if (result.success) {
      alert('Producto creado');
    }
  };

  // Para usar en un select
  const fuelOptions = getFuelTypesForSelect();

  return (
    <div>
      <select>
        {fuelOptions.map(fuel => (
          <option key={fuel.value} value={fuel.value}>
            {fuel.label} ({fuel.unit})
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Acciones Principales
```javascript
const {
  fetchProducts,              // Cargar productos
  fetchActiveProducts,        // Solo activos
  subscribeToProducts,        // Suscripción tiempo real
  unsubscribeFromProducts,    // Cancelar suscripción
  createProduct,              // Crear producto
  updateProduct,              // Actualizar
  deleteProduct,              // Eliminar
  getProductById,             // Obtener por ID
  getProductByName,           // Obtener por nombre
  getProductsByCategory,      // Filtrar por categoría
  getFuelTypesForSelect,      // Para selects/dropdowns
  reset,                      // Reset
} = useProductsStore();
```

### Selectores
```javascript
import { 
  selectProductsCount, 
  selectActiveProducts,
  selectFuelTypesNames
} from '@/stores';

const count = useProductsStore(selectProductsCount);
const activeOnly = useProductsStore(selectActiveProducts);
const names = useProductsStore(selectFuelTypesNames);
```

---

## 🎨 PATRONES DE USO

### Patrón 1: Carga Inicial Simple
```javascript
function MyComponent() {
  const { data, loading, fetchData } = useMyStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loading />;
  return <div>{data.length} items</div>;
}
```

### Patrón 2: Suscripción en Tiempo Real
```javascript
function MyComponent() {
  const { data, loading, subscribeToData, unsubscribeFromData } = useMyStore();

  useEffect(() => {
    const unsubscribe = subscribeToData();
    return () => unsubscribe(); // Cleanup
  }, [subscribeToData, unsubscribeFromData]);

  if (loading) return <Loading />;
  return <div>{data.length} items</div>;
}
```

### Patrón 3: Selectores para Performance
```javascript
// ❌ MAL: Se re-renderiza cuando cualquier cosa cambia
function MyComponent() {
  const { user, userProfile, loading, error } = useAuthStore();
  return <div>{user?.email}</div>;
}

// ✅ BIEN: Solo se re-renderiza cuando cambia el email
function MyComponent() {
  const userEmail = useAuthStore(state => state.user?.email);
  return <div>{userEmail}</div>;
}

// ✅ MEJOR: Usar selector pre-definido
import { selectUserEmail } from '@/stores';

function MyComponent() {
  const userEmail = useAuthStore(selectUserEmail);
  return <div>{userEmail}</div>;
}
```

### Patrón 4: Acciones sin Estado
```javascript
// Solo necesitas las funciones, no el estado
function CreateButton() {
  const createMovement = useMovementsStore(state => state.createMovement);

  const handleClick = async () => {
    const result = await createMovement(data);
    if (result.success) alert('Creado');
  };

  return <button onClick={handleClick}>Crear</button>;
}
```

### Patrón 5: Combinar Múltiples Stores
```javascript
function MovementWizard() {
  // Usar múltiples stores
  const { validateStock } = useInventoryStore();
  const { vehicles } = useVehiclesStore();
  const { createMovement, creating } = useMovementsStore();
  const { hasPermission } = useAuthStore();

  const handleSubmit = async (data) => {
    // 1. Verificar permisos
    if (!hasPermission('movements:create')) {
      return alert('No tienes permisos');
    }

    // 2. Validar stock
    const validation = await validateStock(
      data.fuelType, 
      data.location, 
      data.quantity
    );

    if (!validation.valid) {
      return alert(validation.message);
    }

    // 3. Crear movimiento
    const result = await createMovement(data);
    if (result.success) {
      alert('Movimiento creado');
    }
  };

  return <Form onSubmit={handleSubmit} vehicles={vehicles} />;
}
```

---

## 🔧 INTEGRACIÓN CON HOOKS EXISTENTES

Los stores de Zustand están diseñados para **integrarse** con los hooks existentes de Fase 1:

```javascript
// Hook existente (Fase 1)
import { useMovements } from '../hooks/useMovements';

// Store nuevo (Fase 2)
import { useMovementsStore } from '../stores';

// PUEDEN COEXISTIR durante la migración gradual
function MyComponent() {
  // Usar store nuevo
  const { movements, createMovement } = useMovementsStore();
  
  // O usar hook viejo (durante transición)
  // const { movements, createMovement } = useMovements();
}
```

**Migración gradual:**
1. Componentes nuevos → usar stores directamente
2. Componentes existentes → mantener hooks por ahora
3. Refactorizar componente por componente
4. Eliminar hooks cuando todos los componentes migren

---

## 🧪 TESTING

Los stores de Zustand son **muy fáciles de testear**:

```javascript
// my-component.test.js
import { useMovementsStore } from '@/stores';

describe('MyComponent', () => {
  beforeEach(() => {
    // Reset store antes de cada test
    useMovementsStore.getState().reset();
  });

  it('should create movement', async () => {
    const { createMovement } = useMovementsStore.getState();
    
    const result = await createMovement({
      type: 'entrada',
      quantity: 100,
    });

    expect(result.success).toBe(true);
  });

  it('should update movements list after creation', async () => {
    const { createMovement, movements } = useMovementsStore.getState();
    
    await createMovement({ type: 'entrada', quantity: 100 });
    
    // Verificar que la lista se actualizó
    expect(movements.length).toBeGreaterThan(0);
  });
});
```

---

## 🐛 DEBUGGING CON DEVTOOLS

Zustand tiene integración nativa con Redux DevTools:

1. **Instalar extensión:** Redux DevTools en Chrome/Firefox
2. **Abrir DevTools:** Click en extensión
3. **Ver cambios:** Cada acción se registra con su nombre

**Acciones registradas:**
- `auth/setUser`
- `movements/createStart`
- `movements/createSuccess`
- `vehicles/fetchSuccess`
- etc.

**Ver estado actual:**
```javascript
// En consola del navegador
useMovementsStore.getState();
// { movements: [...], loading: false, ... }
```

---

## 🚀 MEJORES PRÁCTICAS

### 1. Usar Selectores para Performance
```javascript
// ❌ MAL
const store = useMovementsStore();

// ✅ BIEN
const movements = useMovementsStore(state => state.movements);
const loading = useMovementsStore(state => state.loading);
```

### 2. No Mutar Estado Directamente
```javascript
// ❌ MAL
const { movements } = useMovementsStore();
movements.push(newMovement); // ¡NO!

// ✅ BIEN
const { createMovement } = useMovementsStore();
await createMovement(newMovement);
```

### 3. Cleanup de Suscripciones
```javascript
useEffect(() => {
  const unsubscribe = subscribeToMovements();
  return () => unsubscribe(); // ¡IMPORTANTE!
}, [subscribeToMovements]);
```

### 4. Reset en Logout
```javascript
import { resetAllStores } from '@/stores';

function logout() {
  resetAllStores(); // Limpiar todos los stores
  // ... resto del logout
}
```

### 5. Validar Permisos
```javascript
const { hasPermission } = useAuthStore();

if (!hasPermission('movements:create')) {
  return <NoPermission />;
}
```

---

## 📚 RECURSOS

**Documentación oficial:**
- Zustand: https://zustand-demo.pmnd.rs/
- Hooks Guide: [HOOKS_GUIDE.md](./HOOKS_GUIDE.md)

**Archivos:**
- `/src/stores/auth.store.js`
- `/src/stores/movements.store.js`
- `/src/stores/vehicles.store.js`
- `/src/stores/inventory.store.js`
- `/src/stores/products.store.js`
- `/src/stores/index.js` (exports)

**Servicios relacionados:**
- `/src/services/Firebase*Service.js`

---

## 🔜 PRÓXIMOS PASOS

1. ✅ **Stores creados** (completado)
2. ⏳ **Migrar componentes** (en progreso)
   - Empezar con componentes más simples
   - Dashboard
   - Componentes de solo lectura
3. ⏳ **Eliminar CombustiblesContext**
4. ⏳ **Crear tests** para stores
5. ⏳ **Documentar ADR-004** (decisión arquitectural)

---

**Última actualización:** 1 de octubre de 2025  
**Versión:** 1.0  
**Sprint:** Sprint 1 - State Management  
**Autor:** Forestech Development Team


