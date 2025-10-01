# 🛢️ MÓDULO DE PRODUCTOS - GUÍA DE USO

**Fecha:** 30 de septiembre de 2025  
**Estado:** ✅ Implementado y funcionando  
**Referencia:** [REFACTORIZACION_SEGUIMIENTO.md](./REFACTORIZACION_SEGUIMIENTO.md)

---

## 📋 RESUMEN

En la refactorización de Combustibles, **"Productos" = "Tipos de Combustibles"**.

El módulo de Productos permite a los usuarios crear y gestionar tipos de combustibles de forma **dinámica** (no hardcodeados en código), con toda la información necesaria como:
- Nombre y nombre de visualización
- Icono/emoji
- Color
- Unidad de medida (gal, L, etc.)
- Precio por defecto
- Densidad
- Descripción

---

## 🎯 DECISIÓN CORE

### Antes (❌ Problemático)
```javascript
// Hardcoded en combustibleTypes.js
export const FUEL_TYPES = {
  ACPM: 'ACPM',
  GASOLINA_CORRIENTE: 'GASOLINA_CORRIENTE',
  GASOLINA_EXTRA: 'GASOLINA_EXTRA',
  JET_A1: 'JET_A1',
};
```

**Problemas:**
- Cada nuevo combustible requería editar código
- No flexible para diferentes clientes/proyectos
- Mantenimiento difícil

### Ahora (✅ Solución)
```javascript
// Dinámico desde Firebase usando hooks
import { useFuelTypes } from '../hooks/useFuelTypes';

const MyComponent = () => {
  const { fuelTypes, fuelInfo, loading } = useFuelTypes();
  
  // fuelTypes = array de tipos desde Firebase
  // fuelInfo = objeto con detalles de cada tipo
  // loading = estado de carga
};
```

**Beneficios:**
- ✅ Sin modificar código para agregar combustibles
- ✅ Usuario final gestiona sus propios tipos
- ✅ Flexible para cualquier cliente
- ✅ Datos en Firebase (persistentes)

---

## 🔧 ARQUITECTURA

### Servicios Firebase
```
FirebaseProductsService (src/services/FirebaseProductsService.js)
├── getAll() - Obtener todos los productos
├── getById() - Obtener producto por ID
├── create() - Crear nuevo producto/combustible
├── update() - Actualizar producto existente
└── delete() - Eliminar producto
```

### Custom Hooks Disponibles

#### 1. `useProducts` (General)
Hook completo para gestión de productos (CRUD completo).

```javascript
import { useProducts } from '../hooks/useProducts';

const MyComponent = () => {
  const {
    products,          // Array de productos
    fuelTypes,         // Alias para productos (semántico)
    loading,           // Estado de carga
    error,             // Errores
    saving,            // Estado de guardado
    
    // Métodos
    fetchProducts,     // Obtener productos
    fetchFuelTypes,    // Alias semántico
    getProduct,        // Obtener por ID
    createProduct,     // Crear producto
    createFuelType,    // Crear combustible (alias)
    updateProduct,     // Actualizar
    deleteProduct,     // Eliminar
    getFuelTypesOnly,  // Solo combustibles (filtro)
    validateProductCode, // Validar código único
  } = useProducts();
  
  return (
    // Tu UI...
  );
};
```

#### 2. `useFuelTypes` (Especializado)
Hook optimizado solo para lectura de tipos de combustibles.

```javascript
import { useFuelTypes } from '../hooks/useFuelTypes';

const MyComponent = () => {
  const {
    products,         // Productos raw de Firebase
    fuelTypes,        // Array formateado para UI
    fuelInfo,         // Objeto con info de cada tipo
    fuelTypeNames,    // Array simple de nombres
    loading,          // Estado de carga
    error,            // Errores
    getFuelInfo,      // Helper para obtener info de un tipo
  } = useFuelTypes();
  
  // Ejemplo de uso en select
  return (
    <select>
      {fuelTypes.map(fuel => (
        <option key={fuel.id} value={fuel.value}>
          {fuel.icon} {fuel.label}
        </option>
      ))}
    </select>
  );
};
```

---

## 🖥️ COMPONENTES UI

### ProductsMain
Componente principal de gestión de productos.

**Ubicación:** `src/components/Products/ProductsMain.jsx`

**Funcionalidades:**
- ✅ Ver listado de productos/combustibles
- ✅ Crear nuevos productos (popup wizard)
- ✅ Editar productos existentes
- ✅ Eliminar productos
- ✅ Estadísticas de uso
- ✅ Filtros y búsqueda
- ✅ Gestor de categorías

**Permisos:**
```javascript
const canManageProducts = ['admin', 'supervisor', 'manager', 'operator'].includes(
  userProfile?.role
);
```

### Otros Componentes

- **ProductModal**: Modal para crear/editar productos
- **ProductWizard**: Wizard paso a paso para crear productos
- **ProductsStats**: Estadísticas de productos
- **ProductCategoriesManager**: Gestor de categorías de productos

---

## 📝 ESTRUCTURA DE UN PRODUCTO

```javascript
{
  // IDs
  id: 'auto-generated-firebase-id',
  
  // Información básica
  name: 'ACPM',                    // Nombre interno (único, uppercase)
  displayName: 'ACPM (Diesel)',    // Nombre para mostrar en UI
  description: 'Aceite Combustible Para Motor',
  
  // Categoría
  category: 'combustible',         // 'combustible', 'aceite', 'lubricante', 'fluido'
  
  // Visual
  icon: '⛽',                      // Emoji/icono
  color: '#2563EB',                // Color hex para UI
  
  // Técnico
  unit: 'gal',                     // Unidad de medida (gal, L, etc.)
  density: 0.84,                   // Densidad (kg/L)
  defaultPrice: 12500,             // Precio por defecto (COP)
  
  // Estado
  isActive: true,                  // Activo/inactivo
  
  // Metadata
  createdAt: '2025-09-30T10:00:00Z',
  updatedAt: '2025-09-30T10:00:00Z',
  createdBy: 'user-id',
}
```

---

## 🚀 GUÍA DE USO PARA USUARIO FINAL

### Cómo Crear un Nuevo Tipo de Combustible

1. **Ir al módulo de Productos**
   - En el menú principal, click en "🛢️ Productos"

2. **Click en "Crear Producto"**
   - Se abrirá un popup wizard

3. **Llenar el formulario del wizard**
   - **Paso 1:** Información básica
     - Nombre: Ej. "DIESEL"
     - Nombre visible: Ej. "Diesel Premium"
     - Descripción: Breve descripción
   - **Paso 2:** Categoría
     - Seleccionar "Combustible"
   - **Paso 3:** Propiedades
     - Icono: Seleccionar emoji
     - Color: Elegir color representativo
     - Unidad: gal, L, etc.
     - Densidad: Valor técnico
   - **Paso 4:** Precio
     - Precio por defecto (opcional)
   - **Paso 5:** Resumen y confirmación

4. **Guardar**
   - El combustible estará disponible inmediatamente en toda la app

### Cómo Usar el Combustible Creado

Una vez creado, el combustible aparecerá automáticamente en:
- ✅ Selectores de tipo de combustible en Movimientos
- ✅ Creación de inventario
- ✅ Vehículos (combustible por defecto)
- ✅ Reportes y estadísticas
- ✅ Dashboard

**No requiere modificación de código.**

---

## 🔄 MIGRACIÓN DESDE HARDCODED

### Paso 1: Identificar Código Hardcoded

Buscar imports de constantes legacy:
```bash
grep -r "FUEL_TYPES\|FUEL_INFO" src/
```

### Paso 2: Reemplazar con Hook

**Antes:**
```javascript
import { FUEL_TYPES, FUEL_INFO } from '../constants/combustibleTypes';

const MyComponent = () => {
  const fuelType = FUEL_TYPES.ACPM;
  const fuelName = FUEL_INFO[fuelType].name;
  
  return <div>{fuelName}</div>;
};
```

**Después:**
```javascript
import { useFuelTypes } from '../hooks/useFuelTypes';

const MyComponent = () => {
  const { fuelInfo, loading } = useFuelTypes();
  
  if (loading) return <div>Cargando...</div>;
  
  const fuelName = fuelInfo['ACPM']?.name || 'ACPM';
  
  return <div>{fuelName}</div>;
};
```

### Paso 3: Fallbacks para Compatibilidad

Los archivos de constantes (`combustibleTypes.js`) mantienen fallbacks marcados como `DEPRECATED` para:
- Tests unitarios offline
- Compatibilidad temporal mientras se migra
- Casos donde Firebase no esté disponible

**No eliminar estos archivos**, solo marcarlos como deprecated.

---

## 📊 ESTADO ACTUAL

### ✅ Completado
- [x] Hook `useProducts` implementado (CRUD completo)
- [x] Hook `useFuelTypes` implementado (lectura optimizada)
- [x] Servicio `FirebaseProductsService` funcionando
- [x] UI de gestión de productos completa
- [x] Wizard de creación paso a paso
- [x] Estadísticas y reportes
- [x] Filtros y búsqueda
- [x] Sistema de categorías
- [x] Documentación de hooks en `HOOKS_GUIDE.md`

### 📝 Pendiente (Opcional)
- [ ] Migrar todos los componentes que usan `FUEL_INFO` a hooks dinámicos
- [ ] Agregar más validaciones en el wizard
- [ ] Implementar importación masiva de productos (CSV)
- [ ] Agregar conversiones de unidades automáticas

---

## 🧪 TESTING

### Crear Producto de Test
```javascript
import { useProducts } from '../hooks/useProducts';

const testProduct = {
  name: 'DIESEL_TEST',
  displayName: 'Diesel Test',
  category: 'combustible',
  icon: '⛽',
  color: '#2563EB',
  unit: 'gal',
  density: 0.84,
  defaultPrice: 12500,
  isActive: true,
};

const { createProduct } = useProducts();
await createProduct(testProduct);
```

### Leer Productos
```javascript
import { useFuelTypes } from '../hooks/useFuelTypes';

const { fuelTypes, loading } = useFuelTypes();

if (!loading) {
  console.log('Tipos de combustible disponibles:', fuelTypes);
}
```

---

## 🔗 REFERENCIAS

- **Servicio:** `src/services/FirebaseProductsService.js`
- **Hooks:** `src/hooks/useProducts.js`, `src/hooks/useFuelTypes.js`
- **Componentes:** `src/components/Products/`
- **Constantes (deprecated):** `src/constants/combustibleTypes.js`
- **Documentación Hooks:** `HOOKS_GUIDE.md`
- **Seguimiento:** `REFACTORIZACION_SEGUIMIENTO.md`

---

## ❓ PREGUNTAS FRECUENTES

### ¿Puedo eliminar el archivo combustibleTypes.js?
No. Mantenerlo como fallback para tests y compatibilidad temporal. Está marcado como `DEPRECATED`.

### ¿Cómo agrego un nuevo combustible sin tocar código?
Ve al módulo de Productos en la UI y usa el wizard de creación.

### ¿Los cambios en productos son en tiempo real?
Sí, los hooks usan suscripciones de Firebase que actualizan automáticamente todos los componentes.

### ¿Qué pasa si Firebase está offline?
Los hooks usan los fallbacks de `combustibleTypes.js` automáticamente.

### ¿Puedo tener combustibles por cliente/proyecto?
Sí, cada proyecto Firebase tiene sus propios productos independientes.

---

**Última actualización:** 30 de septiembre de 2025  
**Responsable:** AI Assistant / Forestech Development Team

