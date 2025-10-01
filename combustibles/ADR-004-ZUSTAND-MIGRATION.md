# ADR-004: Migración a Zustand para State Management

**Fecha:** 1 de octubre de 2025  
**Estado:** ✅ Aceptado e Implementado  
**Contexto:** Fase 2 - Sprint 1 (State Management)  
**Relacionado con:** [FASE2_PROMPT_Y_REGLAS.md](./FASE2_PROMPT_Y_REGLAS.md), [STORES_GUIDE.md](./STORES_GUIDE.md)

---

## 📋 Contexto

### Situación Actual

La aplicación Combustibles usa **Context API de React** para manejar el estado global, específicamente a través de `CombustiblesContext.jsx`, un context monolítico que maneja:

- Autenticación y permisos de usuario
- Inventario de combustibles
- Movimientos (ENTRADA/SALIDA)
- Vehículos
- Proveedores
- Categorías de vehículos
- Servicios Firebase
- Operaciones CRUD

### Problemas Identificados

1. **Re-renders innecesarios**: Cualquier cambio en el context causa re-render de todos los componentes suscritos
2. **Performance degradada**: Con muchos componentes suscritos, la app se vuelve lenta
3. **Difícil de testear**: Context API requiere montar providers completos en tests
4. **Sin DevTools**: No hay visibilidad de cambios de estado en desarrollo
5. **Código monolítico**: Todo en un solo archivo de 300+ líneas

### Ejemplo del Problema

```javascript
// ❌ PROBLEMA: Component se re-renderiza aunque solo use user.email
function MyComponent() {
  const { user, inventory, movements, vehicles } = useCombustibles();
  // Solo usa user.email, pero se re-renderiza cuando cambia inventory, movements, etc.
  return <div>{user?.email}</div>;
}
```

---

## 🎯 Decisión

**Migrar de Context API a Zustand como solución de state management.**

### ¿Qué es Zustand?

[Zustand](https://zustand-demo.pmnd.rs/) es una librería de state management:
- Ligera (1KB gzipped)
- Sin boilerplate
- API simple basada en hooks
- DevTools integrado
- Selectores nativos para performance

### Arquitectura Propuesta

Crear **5 stores especializados** por dominio:

1. **`auth.store.js`** - Autenticación y permisos
2. **`movements.store.js`** - Movimientos de combustible
3. **`vehicles.store.js`** - Gestión de vehículos
4. **`inventory.store.js`** - Inventario y stock
5. **`products.store.js`** - Tipos de combustibles (productos)

Cada store es **independiente** y solo causa re-renders en componentes que lo usan.

---

## 🔄 Alternativas Consideradas

### Opción 1: Mantener Context API con optimizaciones
- ✅ No requiere nueva librería
- ❌ Sigue siendo difícil evitar re-renders
- ❌ No tiene DevTools
- ❌ Tests complejos
- **Descartada:** No resuelve problemas fundamentales

### Opción 2: Redux Toolkit
- ✅ Estándar de la industria
- ✅ Excelente DevTools
- ❌ Mucho boilerplate (actions, reducers, etc.)
- ❌ Curva de aprendizaje pronunciada
- ❌ Tamaño mayor (~15KB)
- **Descartada:** Demasiado complejo para nuestro caso de uso

### Opción 3: Jotai
- ✅ Muy ligero
- ✅ API basada en átomos (similar a Recoil)
- ⚠️ Enfoque diferente (atoms vs stores)
- ⚠️ Menos maduro que Zustand
- **Considerada pero no elegida**

### Opción 4: Zustand ✅
- ✅ Extremadamente simple
- ✅ Ligero (1KB)
- ✅ DevTools incluido
- ✅ Selectores nativos
- ✅ Fácil de testear
- ✅ Documentación excelente
- **✅ SELECCIONADA**

---

## 📐 Arquitectura de Implementación

### Estructura de Carpetas

```
src/
├── stores/
│   ├── auth.store.js           # Store de autenticación
│   ├── movements.store.js      # Store de movimientos
│   ├── vehicles.store.js       # Store de vehículos
│   ├── inventory.store.js      # Store de inventario
│   ├── products.store.js       # Store de productos
│   └── index.js                # Exports centralizados
├── hooks/                      # Hooks existentes (Fase 1)
├── contexts/                   # Contexts legacy (deprecar)
└── services/                   # Servicios Firebase
```

### Patrón de Store

Todos los stores siguen el mismo patrón consistente:

```javascript
export const useMyStore = create(
  devtools(
    (set, get) => ({
      // Estado inicial
      data: [],
      loading: false,
      error: null,

      // Acciones
      fetchData: async () => {
        set({ loading: true }, false, 'myStore/fetchStart');
        // ... lógica
        set({ data, loading: false }, false, 'myStore/fetchSuccess');
      },

      // Selectores/Getters
      getById: (id) => {
        const { data } = get();
        return data.find(item => item.id === id);
      },

      // Reset
      reset: () => set(initialState, false, 'myStore/reset'),
    }),
    { name: 'my-store', enabled: import.meta.env.DEV }
  )
);
```

### Integración con Servicios Existentes

Los stores **integran** con los servicios Firebase existentes de Fase 1:

```javascript
import FirebaseMovementsService from '../services/FirebaseMovementsService';

const movementsService = new FirebaseMovementsService();

export const useMovementsStore = create((set, get) => ({
  createMovement: async (data) => {
    const result = await movementsService.createMovement(data);
    // Update store...
  },
}));
```

---

## ✅ Ventajas de la Decisión

### 1. Performance Mejorada

**Antes (Context API):**
```javascript
// Component se re-renderiza con CUALQUIER cambio en context
const { user } = useCombustibles();
```

**Después (Zustand):**
```javascript
// Solo se re-renderiza cuando cambia user.email
const userEmail = useAuthStore(state => state.user?.email);
```

### 2. Mejor Developer Experience

- **DevTools:** Ver todos los cambios de estado en tiempo real
- **Logs automáticos:** Cada acción tiene un nombre descriptivo
- **Debugging fácil:** `useMovementsStore.getState()` en consola

### 3. Fácil de Testear

**Antes:**
```javascript
// Montar provider completo
<CombustiblesProvider>
  <MyComponent />
</CombustiblesProvider>
```

**Después:**
```javascript
// Acceso directo al store
const { createMovement } = useMovementsStore.getState();
await createMovement(data);
expect(result.success).toBe(true);
```

### 4. Separación de Concerns

Cada store es **independiente** y maneja solo su dominio:
- auth.store → solo autenticación
- movements.store → solo movimientos
- No hay acoplamiento entre stores

### 5. TypeScript Ready

En Sprint 2 (TypeScript), migrar stores a TypeScript es trivial:
```typescript
interface MovementsState {
  movements: Movement[];
  loading: boolean;
  createMovement: (data: MovementData) => Promise<Result>;
}

const useMovementsStore = create<MovementsState>((set) => ({ /* ... */ }));
```

---

## ⚠️ Desventajas y Mitigaciones

### Desventaja 1: Nueva Dependencia
- **Impacto:** Agrega Zustand (1KB) a bundle
- **Mitigación:** Tamaño muy pequeño, beneficio > costo

### Desventaja 2: Curva de Aprendizaje
- **Impacto:** Equipo debe aprender Zustand
- **Mitigación:** API extremadamente simple, documentación completa en `STORES_GUIDE.md`

### Desventaja 3: Migración Gradual Requerida
- **Impacto:** No podemos migrar todo de una vez
- **Mitigación:** Plan de migración gradual (componente por componente)

---

## 🚀 Plan de Implementación

### Fase 1: Crear Stores (✅ COMPLETADO)
- [x] Instalar Zustand
- [x] Crear 5 stores especializados
- [x] Documentar en STORES_GUIDE.md
- [x] Validar linting (0 errores)

### Fase 2: Migrar Componentes (⏳ EN PROGRESO)
- [ ] Identificar componentes críticos
- [ ] Migrar Dashboard
- [ ] Migrar MovementsMain
- [ ] Migrar VehiclesMain
- [ ] Migrar InventoryMain

### Fase 3: Eliminar Context API (⏳ PENDIENTE)
- [ ] Verificar que todos los componentes migraron
- [ ] Eliminar CombustiblesContext.jsx
- [ ] Eliminar imports de useCombustibles

### Fase 4: Tests (⏳ PENDIENTE)
- [ ] Tests unitarios para cada store
- [ ] Cobertura 100% de stores

---

## 📊 Métricas de Éxito

| Métrica | Antes (Context) | Después (Zustand) | Objetivo |
|---------|-----------------|-------------------|----------|
| **Bundle size** | TBD | +1KB | < +10KB |
| **Re-renders innecesarios** | Alto | Mínimo | < 10% |
| **Tiempo de carga** | TBD | TBD | Mantener o mejorar |
| **Facilidad de testing** | Difícil | Fácil | ✅ |
| **DevTools disponible** | ❌ No | ✅ Sí | ✅ |

---

## 🔗 Referencias

### Documentación
- [STORES_GUIDE.md](./STORES_GUIDE.md) - Guía completa de uso
- [HOOKS_GUIDE.md](./HOOKS_GUIDE.md) - Hooks de Fase 1
- [FASE2_SEGUIMIENTO.md](./FASE2_SEGUIMIENTO.md) - Tracking de progreso

### Código
- `/src/stores/auth.store.js`
- `/src/stores/movements.store.js`
- `/src/stores/vehicles.store.js`
- `/src/stores/inventory.store.js`
- `/src/stores/products.store.js`
- `/src/stores/index.js`

### External
- [Zustand Official Docs](https://zustand-demo.pmnd.rs/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Performance Comparison](https://github.com/pmndrs/zustand#performance-comparison)

---

## 👥 Participantes

- **Propuesto por:** AI Assistant
- **Revisado por:** Forestech Development Team
- **Aprobado por:** hp (Product Owner)
- **Fecha de aprobación:** 1 de octubre de 2025

---

## 📝 Changelog

| Fecha | Cambio | Autor |
|-------|--------|-------|
| 2025-10-01 | Creación del ADR | AI Assistant |
| 2025-10-01 | Implementación inicial completada | AI Assistant |

---

**Estado Final:** ✅ **ACEPTADO E IMPLEMENTADO**

**Próxima Revisión:** Después de migración completa de componentes (Sprint 1 completo)


