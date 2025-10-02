# 🚀 PROMPT PARA SPRINT 3 - DÍA 3: TESTS DE HOOKS

**Fecha de Creación:** 1 de octubre de 2025  
**Sprint:** Sprint 3 - Testing & Quality Assurance  
**Día:** 3 de 4  
**Precedente:** Día 2 completado (5 stores con 122 tests pasando)

---

## 📋 CONTEXTO COMPLETO

Eres un agente de IA especializado en testing de React. Tu tarea es **continuar el Sprint 3: Testing** del proyecto Combustibles Forestech, específicamente el **Día 3: Tests de Hooks**.

### 🎯 Estado Actual del Proyecto

**FASE 2 - Modernización y Optimización:**

| Sprint | Objetivo | Progreso | Estado |
|--------|----------|----------|--------|
| **Sprint 1** | State Management (Zustand) | 90% | ✅ **COMPLETADO** |
| **Sprint 2** | TypeScript Migration | 90% | ✅ **COMPLETADO** |
| **Sprint 3** | Testing & QA | 50% | 🟡 **EN PROGRESO - DÍA 2 COMPLETADO** |
| **Sprint 4** | Performance | 0% | ⏸️ Pendiente |
| **TOTAL** | **Fase 2** | **58%** | 🟡 En progreso |

**Sprint 3 - Estado Actual:**

| Tarea | Completado | Total | % | Estado |
|-------|------------|-------|---|--------|
| **Configuración** | 7/7 | 7 | 100% | ✅ COMPLETADO |
| **Auth Store Tests** | 38/38 | 38 | 100% | ✅ COMPLETADO |
| **Stores Tests (4 restantes)** | 84/84 | 84 | 100% | ✅ COMPLETADO |
| **Hooks Tests** | 0/42+ | 42+ | 0% | ⏸️ **TU TAREA** |
| **E2E Tests** | 0/6 | 6 | 0% | ⏸️ Día 4 |

---

## 📚 DOCUMENTOS OBLIGATORIOS A LEER

**ANTES de empezar, debes leer completamente (en orden):**

1. **`SPRINT3_DAY2_COMPLETED.md`** - Resumen del Día 2 y patrones establecidos
2. **`TESTING_GUIDE.md`** - Guía completa de testing (sección "Testing Hooks")
3. **`HOOKS_GUIDE.md`** - Guía de hooks personalizados
4. **`SPRINT3_PROGRESS_TRACKER.md`** - Estado actual del sprint
5. **`src/stores/auth.store.test.ts`** - Referencia de tests de stores (Día 1)
6. **`src/stores/movements.store.test.ts`** - Referencia de tests de stores (Día 2)

**Archivos de código a revisar:**

- `src/hooks/useMovements.ts` - Hook wrapper sobre store
- `src/hooks/useVehicles.ts` - Hook wrapper sobre store
- `src/hooks/useInventory.ts` - Hook wrapper sobre store
- `src/hooks/useProducts.ts` - Hook wrapper sobre store
- `src/hooks/useSuppliers.ts` - Hook con estado propio (más complejo)
- `src/hooks/useVehicleCategories.ts` - Hook con estado propio (más complejo)
- `src/hooks/useHourMeter.ts` - Hook con estado propio (más complejo)

---

## 🎯 OBJETIVOS DEL DÍA 3

### Objetivo Principal
Crear tests completos para los 7 custom hooks de React, alcanzando 100% de cobertura en todos ellos.

### Objetivos Específicos

#### 1. Hooks Wrapper (Simples) - 4 hooks

Estos hooks son wrappers sobre stores de Zustand:

**useMovements.test.ts** (Mínimo 6 tests):
- ✅ Should initialize with store values
- ✅ Should call store methods correctly
- ✅ Should update when store changes
- ✅ Should return loading state
- ✅ Should return error state
- ✅ Should handle async operations

**useVehicles.test.ts** (Mínimo 6 tests):
- Misma estructura que useMovements

**useInventory.test.ts** (Mínimo 6 tests):
- Misma estructura que useMovements

**useProducts.test.ts** (Mínimo 6 tests):
- Misma estructura que useMovements

#### 2. Hooks con Estado Propio (Complejos) - 3 hooks

Estos hooks usan useState/useCallback directamente:

**useSuppliers.test.ts** (Mínimo 10 tests):
- ✅ Should initialize with empty state
- ✅ fetchSuppliers should update state
- ✅ fetchActiveSuppliers should update state
- ✅ createSupplier should work correctly
- ✅ updateSupplier should work correctly
- ✅ deleteSupplier should work correctly
- ✅ Should handle loading states
- ✅ Should handle error states
- ✅ getSupplierById should filter correctly
- ✅ getSupplierByName should filter correctly

**useVehicleCategories.test.ts** (Mínimo 10 tests):
- Similar a useSuppliers

**useHourMeter.test.ts** (Mínimo 8 tests):
- ✅ Should initialize with empty state
- ✅ fetchReadings should update state
- ✅ createReading should work correctly
- ✅ getReadingsByVehicle should filter
- ✅ getLatestReading should return newest
- ✅ Should handle loading states
- ✅ Should handle error states
- ✅ Should calculate differences correctly

---

## 🔧 PATRÓN DE REFERENCIA

### Estructura de Test para Hooks

```typescript
/**
 * Tests for useHookName Hook
 * 
 * Testing strategy:
 * - Test initial state
 * - Test store integration (wrapper hooks)
 * - Test async operations
 * - Test state updates
 * - Test error handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useHookName } from './useHookName';

// Mock del store o servicio
vi.mock('../stores/storeName.store', () => ({
  useStoreNameStore: vi.fn(),
}));

// O mock de servicio para hooks con estado propio
vi.mock('../services/FirebaseService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getAllItems: vi.fn().mockResolvedValue({ success: true, data: [] }),
    })),
  };
});

describe('useHookName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with correct values', () => {
      // Arrange
      const mockStore = {
        items: [],
        loading: false,
        error: null,
      };
      
      // Mock store implementation
      (useStoreNameStore as any).mockReturnValue(mockStore);
      
      // Act
      const { result } = renderHook(() => useHookName());
      
      // Assert
      expect(result.current.items).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  describe('Store Integration', () => {
    it('should call store methods', () => {
      // Arrange
      const mockFetch = vi.fn();
      (useStoreNameStore as any).mockReturnValue({
        items: [],
        loading: false,
        fetchItems: mockFetch,
      });
      
      // Act
      const { result } = renderHook(() => useHookName());
      result.current.fetchItems();
      
      // Assert
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Async Operations', () => {
    it('should handle async operations', async () => {
      // Test async behavior
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully', () => {
      // Test error scenarios
    });
  });
});
```

### Diferencia entre Hooks Wrapper y Hooks con Estado

**1. Hooks Wrapper (simples):**
```typescript
// useMovements.ts - wrapper sobre store
export const useMovements = (): UseMovementsReturn => {
  const {
    movements,
    loading,
    fetchMovements,
  } = useMovementsStore(); // Solo obtiene del store

  return { movements, loading, fetchMovements };
};

// Test: Mock el store completo
vi.mock('../stores/movements.store', () => ({
  useMovementsStore: vi.fn(),
}));
```

**2. Hooks con Estado (complejos):**
```typescript
// useSuppliers.ts - estado propio con useState
export const useSuppliers = (): UseSuppliersReturn => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    const result = await suppliersService.getAllSuppliers();
    setSuppliers(result.data);
    setLoading(false);
  }, []);

  return { suppliers, loading, fetchSuppliers };
};

// Test: Mock el servicio, no el store
vi.mock('../services/FirebaseSuppliersService', () => ({
  default: vi.fn().mockImplementation(() => ({
    getAllSuppliers: vi.fn().mockResolvedValue({ success: true, data: [] }),
  })),
}));
```

---

## 🔴 REGLAS OBLIGATORIAS

### 1. Usar React Testing Library

```typescript
import { renderHook, waitFor } from '@testing-library/react';

// Para hooks síncronos
const { result } = renderHook(() => useMyHook());

// Para hooks asíncronos
const { result } = renderHook(() => useMyHook());
await waitFor(() => {
  expect(result.current.loading).toBe(false);
});
```

### 2. Mock Apropiado

```typescript
// Hooks wrapper → Mock el store
vi.mock('../stores/movements.store', () => ({
  useMovementsStore: vi.fn(),
}));

// Hooks con estado → Mock el servicio
vi.mock('../services/FirebaseSuppliersService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getAllSuppliers: vi.fn().mockResolvedValue({ 
        success: true, 
        data: [] 
      }),
    })),
  };
});
```

### 3. Cobertura Mínima

```
OBJETIVO: 100% cobertura en cada hook

Cada hook DEBE tener tests para:
- ✅ Inicialización correcta (1 test)
- ✅ Métodos principales (1-2 tests por método)
- ✅ Estados de loading (1 test)
- ✅ Manejo de errores (1 test)
- ✅ Getters/filtros (1 test por getter)
- ✅ Integración con store/servicio (2-3 tests)

Mínimo absoluto: 6-10 tests por hook
```

### 4. Naming Conventions

```
Archivos:       *.test.ts
Describes:      Descriptivos y anidados
Tests:          'should [acción esperada]'

Ejemplo:
describe('useMovements', () => {
  describe('Initialization', () => {
    it('should initialize with store values', () => {});
  });
  
  describe('Store Integration', () => {
    it('should call fetchMovements from store', () => {});
  });
});
```

### 5. Validación TypeScript

```bash
# DEBE pasar antes de considerar terminado
npm run type-check

# Los tests DEBEN pasar
npm run test -- --run

# Verificar cobertura
npm run test:coverage
```

---

## 📋 PLAN DE EJECUCIÓN RECOMENDADO

### Paso 1: Preparación (10 minutos)

```bash
cd /home/hp/Documents/forestech/combustibles

# Leer documentos obligatorios
cat SPRINT3_DAY2_COMPLETED.md
cat TESTING_GUIDE.md | grep -A 50 "Testing Hooks"
cat HOOKS_GUIDE.md

# Ver hooks a testear
cat src/hooks/useMovements.ts
cat src/hooks/useSuppliers.ts
```

### Paso 2: Hooks Wrapper (1.5 horas)

```bash
# Crear archivos (45 min)
touch src/hooks/useMovements.test.ts
touch src/hooks/useVehicles.test.ts
touch src/hooks/useInventory.test.ts
touch src/hooks/useProducts.test.ts

# Escribir tests siguiendo el patrón
# - Mock el store correspondiente
# - Test de inicialización
# - Test de integración con store
# - Test de métodos

# Ejecutar tests
npm run test -- --run src/hooks/useMovements.test.ts
npm run test -- --run src/hooks/useVehicles.test.ts
npm run test -- --run src/hooks/useInventory.test.ts
npm run test -- --run src/hooks/useProducts.test.ts
```

### Paso 3: useSuppliers (45 minutos)

```bash
# Crear archivo
touch src/hooks/useSuppliers.test.ts

# Escribir tests
# - Mock del servicio Firebase
# - Test de estado inicial
# - Test de fetchSuppliers
# - Test de createSupplier
# - Test de updateSupplier
# - Test de deleteSupplier
# - Test de getters

# Ejecutar tests
npm run test -- --run src/hooks/useSuppliers.test.ts
```

### Paso 4: useVehicleCategories (45 minutos)

```bash
# Crear archivo
touch src/hooks/useVehicleCategories.test.ts

# Similar a useSuppliers

# Ejecutar tests
npm run test -- --run src/hooks/useVehicleCategories.test.ts
```

### Paso 5: useHourMeter (30 minutos)

```bash
# Crear archivo
touch src/hooks/useHourMeter.test.ts

# Tests específicos de horómetro
# - fetchReadings
# - createReading
# - getReadingsByVehicle
# - getLatestReading

# Ejecutar tests
npm run test -- --run src/hooks/useHourMeter.test.ts
```

### Paso 6: Validación Final (15 minutos)

```bash
# Ejecutar TODOS los tests
npm run test -- --run

# Verificar TypeScript
npm run type-check

# Generar coverage report
npm run test:coverage

# Ver reporte HTML
open coverage/index.html
```

### Paso 7: Documentación (15 minutos)

```bash
# Actualizar FASE2_SEGUIMIENTO.md
# Crear SPRINT3_DAY3_COMPLETED.md
# Actualizar SPRINT3_PROGRESS_TRACKER.md
```

---

## 🔍 TIPS Y MEJORES PRÁCTICAS

### 1. RenderHook Pattern

```typescript
// Básico
const { result } = renderHook(() => useMyHook());
expect(result.current.value).toBe(expectedValue);

// Con props
const { result, rerender } = renderHook(
  ({ id }) => useMyHook(id),
  { initialProps: { id: '123' } }
);

// Con async
const { result } = renderHook(() => useMyHook());
await waitFor(() => {
  expect(result.current.loading).toBe(false);
});
```

### 2. Mock de Stores (Hooks Wrapper)

```typescript
// Mock completo del store
vi.mock('../stores/movements.store', () => ({
  useMovementsStore: vi.fn(),
}));

// En cada test, define el retorno
beforeEach(() => {
  (useMovementsStore as any).mockReturnValue({
    movements: [],
    loading: false,
    fetchMovements: vi.fn(),
    createMovement: vi.fn(),
  });
});
```

### 3. Mock de Servicios (Hooks con Estado)

```typescript
// Mock del servicio
vi.mock('../services/FirebaseSuppliersService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getAllSuppliers: vi.fn().mockResolvedValue({ 
        success: true, 
        data: [] 
      }),
      createSupplier: vi.fn().mockResolvedValue({ 
        success: true, 
        data: {} 
      }),
    })),
  };
});
```

### 4. Testing Async Hooks

```typescript
it('should handle async fetch', async () => {
  // Arrange
  const mockData = [{ id: '1', name: 'Test' }];
  (useMovementsStore as any).mockReturnValue({
    movements: [],
    loading: true,
    fetchMovements: vi.fn(),
  });
  
  // Act
  const { result } = renderHook(() => useMovements());
  
  // Assert initial loading
  expect(result.current.loading).toBe(true);
  
  // Wait for async completion
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
});
```

### 5. Testing Error States

```typescript
it('should handle errors', async () => {
  // Mock error response
  (useMovementsStore as any).mockReturnValue({
    movements: [],
    loading: false,
    error: 'Network error',
  });
  
  const { result } = renderHook(() => useMovements());
  
  expect(result.current.error).toBe('Network error');
});
```

---

## 📊 MÉTRICAS ESPERADAS AL COMPLETAR DÍA 3

### Tests Escritos

| Hook | Tests Mínimos | Tests Esperados |
|------|---------------|-----------------|
| useMovements | 6 | 8+ |
| useVehicles | 6 | 8+ |
| useInventory | 6 | 8+ |
| useProducts | 6 | 8+ |
| useSuppliers | 10 | 12+ |
| useVehicleCategories | 10 | 12+ |
| useHourMeter | 8 | 10+ |
| **TOTAL DÍA 3** | **52** | **66+** |

### Cobertura Esperada

```
Hooks: 100% (7/7 hooks) ✅
Líneas: > 90%
Funciones: 100%
Branches: > 85%
```

### Tests Acumulados

```
Día 1: 38 tests (auth store)
Día 2: 84 tests (4 stores)
Día 3: 52+ tests (7 hooks)
──────────────────────────
TOTAL: 174+ tests
```

### Tiempo Estimado

```
Preparación: 10 min
Hooks wrapper (4): 90 min
useSuppliers: 45 min
useVehicleCategories: 45 min
useHourMeter: 30 min
Validación: 15 min
Documentación: 15 min
─────────────────────
TOTAL: ~4 horas
```

---

## ✅ CHECKLIST DE VALIDACIÓN

### Antes de considerar DÍA 3 completo:

#### Código
- [ ] `useMovements.test.ts` creado con 6+ tests
- [ ] `useVehicles.test.ts` creado con 6+ tests
- [ ] `useInventory.test.ts` creado con 6+ tests
- [ ] `useProducts.test.ts` creado con 6+ tests
- [ ] `useSuppliers.test.ts` creado con 10+ tests
- [ ] `useVehicleCategories.test.ts` creado con 10+ tests
- [ ] `useHourMeter.test.ts` creado con 8+ tests
- [ ] Todos los tests pasan: `npm run test -- --run`
- [ ] TypeScript compila: `npm run type-check`
- [ ] Coverage > 90% en hooks: `npm run test:coverage`

#### Tests
- [ ] Cada hook tiene test de inicialización
- [ ] Tests de integración con store/servicio
- [ ] Tests de async operations
- [ ] Casos de error cubiertos
- [ ] Loading states testeados
- [ ] Getters/filtros testeados

#### Documentación
- [ ] `FASE2_SEGUIMIENTO.md` actualizado con entrada Día 3
- [ ] `SPRINT3_DAY3_COMPLETED.md` creado con resumen
- [ ] `SPRINT3_PROGRESS_TRACKER.md` actualizado
- [ ] Métricas documentadas (tests, cobertura, tiempo)

#### Validación Final
- [ ] Ejecutar: `npm run test -- --run` → Todos verdes ✅
- [ ] Ejecutar: `npm run test:coverage` → > 90% hooks ✅
- [ ] Ejecutar: `npm run type-check` → 0 errores nuevos ✅
- [ ] Revisar: coverage/index.html → Confirmar cobertura

---

## 📝 ESTRUCTURA DE ARCHIVOS ESPERADA

```
combustibles/
├── src/
│   ├── hooks/
│   │   ├── useMovements.ts
│   │   ├── useMovements.test.ts         ⏸️ **CREAR HOY**
│   │   ├── useVehicles.ts
│   │   ├── useVehicles.test.ts          ⏸️ **CREAR HOY**
│   │   ├── useInventory.ts
│   │   ├── useInventory.test.ts         ⏸️ **CREAR HOY**
│   │   ├── useProducts.ts
│   │   ├── useProducts.test.ts          ⏸️ **CREAR HOY**
│   │   ├── useSuppliers.ts
│   │   ├── useSuppliers.test.ts         ⏸️ **CREAR HOY**
│   │   ├── useVehicleCategories.ts
│   │   ├── useVehicleCategories.test.ts ⏸️ **CREAR HOY**
│   │   ├── useHourMeter.ts
│   │   └── useHourMeter.test.ts         ⏸️ **CREAR HOY**
│   └── stores/
│       ├── auth.store.test.ts           ✅ Día 1
│       ├── movements.store.test.ts      ✅ Día 2
│       ├── vehicles.store.test.ts       ✅ Día 2
│       ├── inventory.store.test.ts      ✅ Día 2
│       └── products.store.test.ts       ✅ Día 2
├── SPRINT3_DAY1_COMPLETED.md            ✅ Día 1
├── SPRINT3_DAY2_COMPLETED.md            ✅ Día 2
├── SPRINT3_DAY3_PROMPT.md               ✅ Este archivo
├── SPRINT3_DAY3_COMPLETED.md            ⏸️ **CREAR AL TERMINAR**
└── FASE2_SEGUIMIENTO.md                 ✅ Actualizar al terminar
```

---

## 🔄 TEMPLATE PARA SPRINT3_DAY3_COMPLETED.md

Al terminar, crea este archivo con el siguiente contenido:

```markdown
# 🎉 SPRINT 3 - DÍA 3 COMPLETADO

**Fecha:** [Fecha de completación]
**Sprint:** Sprint 3 - Testing & Quality Assurance
**Estado:** ✅ **COMPLETADO CON ÉXITO**

## ✅ LOGROS

### Tests Creados
- ✅ useMovements.test.ts ([N] tests, 100% passing)
- ✅ useVehicles.test.ts ([N] tests, 100% passing)
- ✅ useInventory.test.ts ([N] tests, 100% passing)
- ✅ useProducts.test.ts ([N] tests, 100% passing)
- ✅ useSuppliers.test.ts ([N] tests, 100% passing)
- ✅ useVehicleCategories.test.ts ([N] tests, 100% passing)
- ✅ useHourMeter.test.ts ([N] tests, 100% passing)

### Métricas
- Total tests: [N]/[N] (100%)
- Cobertura hooks: 100% (7/7)
- Tests acumulados: 174+
- Tiempo invertido: [N] horas
- Todos los tests: ✅ PASANDO

### Validación
```bash
npm run test -- --run
✅ [N] tests passed

npm run test:coverage
✅ Coverage > 90%

npm run type-check
✅ 0 errores nuevos
```

## 🚀 PRÓXIMO PASO
Día 4: E2E Tests + CI/CD (6 tests E2E con Playwright)
```

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: renderHook no actualiza

**Solución:** Usa waitFor para operaciones asíncronas

```typescript
const { result } = renderHook(() => useMyHook());
await waitFor(() => {
  expect(result.current.loading).toBe(false);
});
```

### Problema 2: Mock del store no funciona

**Solución:** Verifica que el path sea correcto y usa mockReturnValue

```typescript
vi.mock('../stores/movements.store', () => ({
  useMovementsStore: vi.fn(),
}));

beforeEach(() => {
  (useMovementsStore as any).mockReturnValue({
    movements: [],
    loading: false,
  });
});
```

### Problema 3: Tests async no esperan

**Solución:** Usa async/await con waitFor

```typescript
it('should fetch data', async () => {
  const { result } = renderHook(() => useMyHook());
  
  result.current.fetch();
  
  await waitFor(() => {
    expect(result.current.data).toBeDefined();
  });
});
```

### Problema 4: TypeScript errors en renderHook

**Solución:** Type the mock correctly

```typescript
import type { useMovementsStore } from '../stores/movements.store';

vi.mock('../stores/movements.store', () => ({
  useMovementsStore: vi.fn(),
}));

const mockStore = useMovementsStore as jest.MockedFunction<typeof useMovementsStore>;
```

---

## 📞 RECURSOS

### Documentación Interna (LEER PRIMERO)
- [SPRINT3_DAY2_COMPLETED.md](./SPRINT3_DAY2_COMPLETED.md) ⭐ IMPORTANTE
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) ⭐ IMPORTANTE (sección Hooks)
- [HOOKS_GUIDE.md](./HOOKS_GUIDE.md)
- [SPRINT3_PROGRESS_TRACKER.md](./SPRINT3_PROGRESS_TRACKER.md)

### Código de Referencia (REVISAR)
- `src/stores/auth.store.test.ts` - Patrón de tests
- `src/stores/movements.store.test.ts` - Patrón de tests
- `src/hooks/useMovements.ts` - Hook wrapper simple
- `src/hooks/useSuppliers.ts` - Hook con estado complejo

### Documentación Externa
- [React Testing Library - Hooks](https://react-hooks-testing-library.com/)
- [Vitest - Testing](https://vitest.dev/guide/)
- [React Hooks Testing](https://react-hooks-testing-library.com/usage/basic-hooks)

---

## 🎯 COMANDO PARA EMPEZAR

```bash
# 1. Ir al directorio correcto
cd /home/hp/Documents/forestech/combustibles

# 2. Leer documentación obligatoria
cat SPRINT3_DAY2_COMPLETED.md
cat TESTING_GUIDE.md | grep -A 100 "Testing Hooks"
cat src/hooks/useMovements.ts

# 3. Ver hooks a testear
ls -la src/hooks/*.ts | grep -v test

# 4. Crear primer test
touch src/hooks/useMovements.test.ts

# 5. Ejecutar tests (para verificar setup)
npm run test -- --run src/hooks/useMovements.test.ts
```

---

**Creado:** 1 de octubre de 2025  
**Para:** AI Assistant (Día 3)  
**De:** AI Assistant (Día 2)  
**Siguiente:** SPRINT3_DAY4_PROMPT.md (E2E Tests + CI/CD)

**Estado:** ✅ **LISTO PARA EJECUTAR**

---

## 💪 ¡ADELANTE!

Tienes toda la información y patrones necesarios para completar el Día 3 exitosamente. El trabajo de los Días 1 y 2 te da patrones sólidos para seguir.

**Recuerda:**
1. ✅ Hooks wrapper → Mock el store
2. ✅ Hooks con estado → Mock el servicio
3. ✅ Usa renderHook + waitFor para async
4. ✅ Tests descriptivos con Arrange-Act-Assert
5. ✅ Valida con npm run test y npm run type-check
6. ✅ Documenta al terminar

**¡Buena suerte! 🚀**
