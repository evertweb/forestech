# 🚀 PROMPT PARA SPRINT 3 - DÍA 2: TESTS DE STORES RESTANTES

**Fecha de Creación:** 1 de octubre de 2025  
**Sprint:** Sprint 3 - Testing & Quality Assurance  
**Día:** 2 de 4  
**Precedente:** Día 1 completado (auth.store.test.ts - 38 tests pasando)

---

## 📋 CONTEXTO COMPLETO

Eres un agente de IA especializado en testing. Tu tarea es **continuar el Sprint 3: Testing** del proyecto Combustibles Forestech, específicamente el **Día 2: Tests de Stores Restantes**.

### 🎯 Estado Actual del Proyecto

**FASE 2 - Modernización y Optimización:**

| Sprint | Objetivo | Progreso | Estado |
|--------|----------|----------|--------|
| **Sprint 1** | State Management (Zustand) | 90% | ✅ **COMPLETADO** |
| **Sprint 2** | TypeScript Migration | 90% | ✅ **COMPLETADO** |
| **Sprint 3** | Testing & QA | 25% | 🟡 **EN PROGRESO - DÍA 1 COMPLETADO** |
| **Sprint 4** | Performance | 0% | ⏸️ Pendiente |
| **TOTAL** | **Fase 2** | **52%** | 🟡 En progreso |

**Sprint 3 - Estado Actual:**

| Tarea | Completado | Total | % | Estado |
|-------|------------|-------|---|--------|
| **Configuración** | 7/7 | 7 | 100% | ✅ COMPLETADO |
| **Auth Store Tests** | 38/38 | 38 | 100% | ✅ COMPLETADO |
| **Movements Store Tests** | 0/10+ | 10+ | 0% | ⏸️ **TU TAREA** |
| **Vehicles Store Tests** | 0/10+ | 10+ | 0% | ⏸️ **TU TAREA** |
| **Inventory Store Tests** | 0/10+ | 10+ | 0% | ⏸️ **TU TAREA** |
| **Products Store Tests** | 0/8+ | 8+ | 0% | ⏸️ **TU TAREA** |
| **Hooks Tests** | 0/42+ | 42+ | 0% | ⏸️ Día 3 |
| **E2E Tests** | 0/6 | 6 | 0% | ⏸️ Día 4 |

---

## 📚 DOCUMENTOS OBLIGATORIOS A LEER

**ANTES de empezar, debes leer completamente (en orden):**

1. **`SPRINT3_DAY1_COMPLETED.md`** - Resumen del Día 1 y lo que se logró
2. **`TESTING_GUIDE.md`** - Guía completa de testing con patrones
3. **`ADR-006-TESTING-STRATEGY.md`** - Decisión arquitectural de testing
4. **`STORES_GUIDE.md`** - Guía de stores de Zustand (de Sprint 1)
5. **`TYPESCRIPT_GUIDE.md`** - Convenciones de TypeScript (de Sprint 2)
6. **`src/stores/auth.store.test.ts`** - Ejemplo de referencia COMPLETO

**Archivos de código a revisar:**
- `src/stores/movements.store.ts` - Store a testear
- `src/stores/vehicles.store.ts` - Store a testear
- `src/stores/inventory.store.ts` - Store a testear
- `src/stores/products.store.ts` - Store a testear

---

## 🎯 OBJETIVOS DEL DÍA 2

### Objetivo Principal
Crear tests completos para los 4 stores restantes de Zustand, alcanzando 100% de cobertura en todos ellos.

### Objetivos Específicos

#### 1. Movements Store Tests (`movements.store.test.ts`)

**Mínimo 10 tests esperados:**
- ✅ Initial State (3 tests)
  - movements: []
  - loading: false
  - creating: false
  - error: null
  
- ✅ fetchMovements (2 tests)
  - Should load movements successfully
  - Should handle fetch error
  
- ✅ createMovement (2 tests)
  - Should create movement with valid data
  - Should handle creation error
  
- ✅ deleteMovement (2 tests)
  - Should delete movement by id
  - Should handle delete error
  
- ✅ validateStock (2 tests)
  - Should return valid when stock sufficient
  - Should return invalid when insufficient stock
  
- ✅ Selectors/Getters (2 tests)
  - getMovementsByType
  - getStats
  
- ✅ reset (1 test)

#### 2. Vehicles Store Tests (`vehicles.store.test.ts`)

**Mínimo 10 tests esperados:**
- ✅ Initial State (3 tests)
- ✅ fetchVehicles / fetchActiveVehicles (2 tests)
- ✅ createVehicle (2 tests)
- ✅ updateVehicle (2 tests)
- ✅ deleteVehicle (2 tests)
- ✅ Getters (getVehiclesByFuelType, getVehiclesByCategory) (2 tests)
- ✅ reset (1 test)

#### 3. Inventory Store Tests (`inventory.store.test.ts`)

**Mínimo 10 tests esperados:**
- ✅ Initial State (3 tests)
- ✅ fetchInventory (2 tests)
- ✅ validateStock (2 tests)
- ✅ getLowStockAlerts (2 tests)
- ✅ createInventoryLocation (2 tests)
- ✅ Getters (getByLocation, getAvailableStock) (2 tests)
- ✅ reset (1 test)

#### 4. Products Store Tests (`products.store.test.ts`)

**Mínimo 8 tests esperados:**
- ✅ Initial State (2 tests)
- ✅ fetchProducts / fetchActiveProducts (2 tests)
- ✅ createProduct (2 tests)
- ✅ getFuelTypesForSelect (2 tests)
- ✅ Getters (getProductById, getProductByName) (2 tests)
- ✅ reset (1 test)

---

## 🔧 PATRÓN DE REFERENCIA

### Estructura de Test (basada en auth.store.test.ts)

```typescript
/**
 * Tests for [StoreName] Store (Zustand)
 * 
 * Testing strategy:
 * - Test initial state
 * - Test each action/method
 * - Test selectors/getters
 * - Test error handling
 * - Test reset functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useStoreNameStore } from './storename.store';
import type { ModelType } from '../types/models';

// Mock console methods to avoid noise in tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// Helper function to create mock data with all required fields
const createMockModel = (overrides: Partial<ModelType> = {}): ModelType => ({
  id: '123',
  // ... all required fields with defaults
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('StoreNameStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useStoreNameStore.getState().reset();
  });

  describe('Initial State', () => {
    it('should initialize with empty array', () => {
      const { items } = useStoreNameStore.getState();
      expect(items).toEqual([]);
    });

    it('should initialize with loading false', () => {
      const { loading } = useStoreNameStore.getState();
      expect(loading).toBe(false);
    });
  });

  describe('Actions', () => {
    it('should perform action correctly', async () => {
      // Arrange
      const mockData = createMockModel();
      
      // Act
      const result = await useStoreNameStore.getState().action(mockData);
      
      // Assert
      expect(result.success).toBe(true);
      // Additional assertions
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      // Set some state first
      // ... modify state
      
      // Reset
      useStoreNameStore.getState().reset();
      
      // Verify reset
      const state = useStoreNameStore.getState();
      expect(state.items).toEqual([]);
      expect(state.loading).toBe(false);
    });
  });
});
```

### Ejemplo Completo del Día 1 (Referencia)

Ver: `src/stores/auth.store.test.ts` (38 tests, 400+ líneas)

---

## 🔴 REGLAS OBLIGATORIAS

### 1. Cobertura Mínima

```
OBJETIVO: 100% cobertura en cada store

Cada store DEBE tener tests para:
- ✅ Estado inicial (2-3 tests)
- ✅ Cada acción/método (1-2 tests por acción)
- ✅ Casos de error (1 test por acción)
- ✅ Getters/Selectores (1 test por getter)
- ✅ Reset functionality (1 test)

Mínimo absoluto: 8-10 tests por store
```

### 2. Helpers para Mocks

```typescript
// SIEMPRE crear helpers para objetos mock
const createMockMovement = (overrides: Partial<Movement> = {}): Movement => ({
  id: '123',
  type: 'entrada',
  fuelType: 'DIESEL',
  quantity: 100,
  unitPrice: 12.50,
  location: 'Bodega 1',
  status: 'completado',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'user123',
  ...overrides,
});
```

### 3. Naming Conventions

```
Archivos:       *.test.ts
Describes:      Descriptivos y anidados
Tests:          'should [acción esperada]'
Mocks:          createMock[TypeName]

Ejemplo:
describe('MovementsStore', () => {
  describe('createMovement', () => {
    it('should create movement with valid data', () => {});
    it('should handle creation error gracefully', () => {});
  });
});
```

### 4. Estructura Arrange-Act-Assert

```typescript
it('should create movement successfully', async () => {
  // Arrange
  const mockData = createMockMovement({ quantity: 100 });
  
  // Act
  const result = await useMovementsStore.getState().createMovement(mockData);
  
  // Assert
  expect(result.success).toBe(true);
  expect(result.data).toMatchObject(mockData);
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
cat SPRINT3_DAY1_COMPLETED.md
cat TESTING_GUIDE.md
cat ADR-006-TESTING-STRATEGY.md

# Ver el test de referencia
cat src/stores/auth.store.test.ts

# Ver los stores a testear
cat src/stores/movements.store.ts | head -100
cat src/stores/vehicles.store.ts | head -100
cat src/stores/inventory.store.ts | head -100
cat src/stores/products.store.ts | head -100
```

### Paso 2: Movements Store (45 minutos)

```bash
# Crear archivo
touch src/stores/movements.store.test.ts

# Escribir tests siguiendo el patrón
# - Initial state
# - fetchMovements
# - createMovement
# - deleteMovement
# - validateStock
# - Getters/Selectors
# - reset

# Ejecutar tests
npm run test -- --run movements.store.test.ts

# Verificar cobertura
npm run test:coverage
```

### Paso 3: Vehicles Store (45 minutos)

```bash
# Crear archivo
touch src/stores/vehicles.store.test.ts

# Escribir tests siguiendo el patrón
# Similar a Paso 2

# Ejecutar tests
npm run test -- --run vehicles.store.test.ts
```

### Paso 4: Inventory Store (45 minutos)

```bash
# Crear archivo
touch src/stores/inventory.store.test.ts

# Escribir tests siguiendo el patrón

# Ejecutar tests
npm run test -- --run inventory.store.test.ts
```

### Paso 5: Products Store (30 minutos)

```bash
# Crear archivo
touch src/stores/products.store.test.ts

# Escribir tests siguiendo el patrón
# Este es más simple, 8 tests mínimo

# Ejecutar tests
npm run test -- --run products.store.test.ts
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
# Actualizar FASE2_SEGUIMIENTO.md con progreso del Día 2
# Crear SPRINT3_DAY2_COMPLETED.md con resumen
```

---

## 🔍 TIPS Y MEJORES PRÁCTICAS

### 1. Copia el patrón de auth.store.test.ts

El archivo `auth.store.test.ts` es tu **plantilla perfecta**. Copia su estructura:
- beforeEach con reset y console mocks
- Helper functions para crear mocks
- Describes anidados por funcionalidad
- Tests descriptivos con Arrange-Act-Assert

### 2. Mock de servicios Firebase

Los stores usan servicios que hacen llamadas a Firebase. NO necesitas mockear Firebase completo, los stores ya manejan eso internamente.

```typescript
// ❌ NO NECESITAS ESTO
vi.mock('firebase/firestore');

// ✅ Solo testea el store directamente
const result = await useMovementsStore.getState().createMovement(mockData);
expect(result.success).toBe(true);
```

### 3. Tests de error

Siempre incluye tests de manejo de errores:

```typescript
it('should handle fetch error gracefully', async () => {
  // El store debe manejar errores internamente
  // y actualizar el estado de error
  
  // Si el servicio falla, el store debería:
  const { error } = useMovementsStore.getState();
  expect(error).not.toBeNull();
});
```

### 4. Tests de loading states

```typescript
it('should set loading true while fetching', () => {
  // Iniciar fetch (no esperar)
  useMovementsStore.getState().fetchMovements();
  
  // Verificar loading
  expect(useMovementsStore.getState().loading).toBe(true);
});
```

### 5. No te preocupes por async en stores

Los stores manejan async internamente. Tus tests pueden ser síncronos:

```typescript
it('should update state synchronously', () => {
  useMovementsStore.getState().setLoading(true);
  expect(useMovementsStore.getState().loading).toBe(true);
});
```

---

## 📊 MÉTRICAS ESPERADAS AL COMPLETAR DÍA 2

### Tests Escritos

| Store | Tests Mínimos | Tests Esperados |
|-------|---------------|-----------------|
| auth.store | 38 | 38 ✅ (Día 1) |
| movements.store | 10 | 12+ |
| vehicles.store | 10 | 12+ |
| inventory.store | 10 | 12+ |
| products.store | 8 | 10+ |
| **TOTAL** | **76** | **84+** |

### Cobertura Esperada

```
Stores: 100% (5/5 stores) ✅
Líneas: > 90%
Funciones: 100%
Branches: > 85%
```

### Tiempo Estimado

```
Preparación: 10 min
Movements: 45 min
Vehicles: 45 min
Inventory: 45 min
Products: 30 min
Validación: 15 min
Documentación: 15 min
─────────────────────
TOTAL: ~3 horas
```

---

## ✅ CHECKLIST DE VALIDACIÓN

### Antes de considerar DÍA 2 completo:

#### Código
- [ ] `movements.store.test.ts` creado con 10+ tests
- [ ] `vehicles.store.test.ts` creado con 10+ tests
- [ ] `inventory.store.test.ts` creado con 10+ tests
- [ ] `products.store.test.ts` creado con 8+ tests
- [ ] Todos los tests pasan: `npm run test -- --run`
- [ ] TypeScript compila: `npm run type-check`
- [ ] Coverage > 90% en stores: `npm run test:coverage`

#### Tests
- [ ] Cada store tiene test de initial state
- [ ] Cada acción principal tiene test
- [ ] Casos de error cubiertos
- [ ] Getters/Selectores testeados
- [ ] Reset functionality testeada
- [ ] Helpers creados para mocks

#### Documentación
- [ ] `FASE2_SEGUIMIENTO.md` actualizado con entrada Día 2
- [ ] `SPRINT3_DAY2_COMPLETED.md` creado con resumen
- [ ] Métricas documentadas (tests, cobertura, tiempo)

#### Validación Final
- [ ] Ejecutar: `npm run test -- --run` → Todos verdes ✅
- [ ] Ejecutar: `npm run test:coverage` → > 90% stores ✅
- [ ] Ejecutar: `npm run type-check` → 0 errores ✅
- [ ] Revisar: coverage/index.html → Confirmar cobertura

---

## 📝 ESTRUCTURA DE ARCHIVOS ESPERADA

```
combustibles/
├── src/
│   ├── stores/
│   │   ├── auth.store.ts
│   │   ├── auth.store.test.ts         ✅ Día 1 (38 tests)
│   │   ├── movements.store.ts
│   │   ├── movements.store.test.ts    ⏸️ **CREAR HOY**
│   │   ├── vehicles.store.ts
│   │   ├── vehicles.store.test.ts     ⏸️ **CREAR HOY**
│   │   ├── inventory.store.ts
│   │   ├── inventory.store.test.ts    ⏸️ **CREAR HOY**
│   │   ├── products.store.ts
│   │   └── products.store.test.ts     ⏸️ **CREAR HOY**
│   └── test/
│       └── setup.ts                    ✅ Día 1
├── vitest.config.ts                    ✅ Día 1
├── TESTING_GUIDE.md                    ✅ Día 1
├── ADR-006-TESTING-STRATEGY.md         ✅ Día 1
├── SPRINT3_DAY1_COMPLETED.md           ✅ Día 1
├── SPRINT3_DAY2_PROMPT.md              ✅ Este archivo
├── SPRINT3_DAY2_COMPLETED.md           ⏸️ **CREAR AL TERMINAR**
└── FASE2_SEGUIMIENTO.md                ✅ Actualizar al terminar
```

---

## 🔄 TEMPLATE PARA SPRINT3_DAY2_COMPLETED.md

Al terminar, crea este archivo con el siguiente contenido:

```markdown
# 🎉 SPRINT 3 - DÍA 2 COMPLETADO

**Fecha:** [Fecha de completación]
**Sprint:** Sprint 3 - Testing & Quality Assurance
**Estado:** ✅ **COMPLETADO CON ÉXITO**

## ✅ LOGROS

### Tests Creados
- ✅ movements.store.test.ts ([N] tests, 100% passing)
- ✅ vehicles.store.test.ts ([N] tests, 100% passing)
- ✅ inventory.store.test.ts ([N] tests, 100% passing)
- ✅ products.store.test.ts ([N] tests, 100% passing)

### Métricas
- Total tests: [N]/[N] (100%)
- Cobertura stores: 100% (5/5)
- Tiempo invertido: [N] horas
- Todos los tests: ✅ PASANDO

### Validación
```bash
npm run test -- --run
✅ [N] tests passed

npm run test:coverage
✅ Coverage > 90%

npm run type-check
✅ 0 errors
```

## 🚀 PRÓXIMO PASO
Día 3: Tests de Hooks (7 hooks, 42+ tests)
```

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: Tests fallan por tipos incompletos

**Solución:** Usa helper functions con Partial<Type>

```typescript
const createMockMovement = (overrides: Partial<Movement> = {}): Movement => ({
  // Todos los campos requeridos con defaults
  ...overrides,
});
```

### Problema 2: Console logs saturan output

**Solución:** Mock console en beforeEach

```typescript
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
```

### Problema 3: Store no se resetea entre tests

**Solución:** Llama reset en beforeEach

```typescript
beforeEach(() => {
  useMovementsStore.getState().reset();
});
```

### Problema 4: TypeScript errors en mocks

**Solución:** Define bien los tipos de los mocks

```typescript
// ❌ MAL
const mock = { id: '123' };

// ✅ BIEN
const mock: Movement = createMockMovement({ id: '123' });
```

---

## 📞 RECURSOS

### Documentación Interna (LEER PRIMERO)
- [SPRINT3_DAY1_COMPLETED.md](./SPRINT3_DAY1_COMPLETED.md) ⭐ IMPORTANTE
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) ⭐ IMPORTANTE
- [ADR-006-TESTING-STRATEGY.md](./ADR-006-TESTING-STRATEGY.md)
- [STORES_GUIDE.md](./STORES_GUIDE.md)
- [TYPESCRIPT_GUIDE.md](./TYPESCRIPT_GUIDE.md)

### Código de Referencia (REVISAR)
- `src/stores/auth.store.test.ts` ⭐ PLANTILLA PERFECTA
- `src/stores/movements.store.ts`
- `src/stores/vehicles.store.ts`
- `src/stores/inventory.store.ts`
- `src/stores/products.store.ts`

### Documentación Externa
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Zustand Testing](https://github.com/pmndrs/zustand#testing)

---

## 🎯 COMANDO PARA EMPEZAR

```bash
# 1. Ir al directorio correcto
cd /home/hp/Documents/forestech/combustibles

# 2. Leer documentación obligatoria
cat SPRINT3_DAY1_COMPLETED.md
cat TESTING_GUIDE.md
cat src/stores/auth.store.test.ts

# 3. Ver stores a testear
ls -la src/stores/*.ts | grep -v test

# 4. Crear primer test
touch src/stores/movements.store.test.ts

# 5. Ejecutar tests (para verificar setup)
npm run test -- --run auth.store.test.ts
```

---

**Creado:** 1 de octubre de 2025  
**Para:** AI Assistant (Día 2)  
**De:** AI Assistant (Día 1)  
**Siguiente:** SPRINT3_DAY3_PROMPT.md (Tests de Hooks)

**Estado:** ✅ **LISTO PARA EJECUTAR**

---

## 💪 ¡ADELANTE!

Tienes toda la información y patrones necesarios para completar el Día 2 exitosamente. El trabajo del Día 1 te da una plantilla perfecta en `auth.store.test.ts`.

**Recuerda:**
1. ✅ Sigue el patrón de auth.store.test.ts
2. ✅ Usa helpers para mocks
3. ✅ Tests descriptivos con Arrange-Act-Assert
4. ✅ Valida con npm run test y npm run type-check
5. ✅ Documenta al terminar

**¡Buena suerte! 🚀**
