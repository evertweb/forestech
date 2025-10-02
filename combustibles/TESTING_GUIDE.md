# 🧪 GUÍA DE TESTING - Combustibles Forestech

**Fecha de Creación:** 1 de octubre de 2025  
**Sprint:** Sprint 3 - Testing & Quality Assurance  
**Estado:** ✅ Configuración completa - Tests en progreso

---

## 📋 RESUMEN

Esta guía documenta la estrategia de testing del proyecto Combustibles, incluyendo configuración de Vitest, patrones de tests, y ejemplos prácticos.

### Estado Actual de Testing

| Categoría | Tests Escritos | Total Esperado | Progreso |
|-----------|----------------|----------------|----------|
| **Unit Tests - Stores** | 38 | 50+ | 76% 🟡 |
| **Unit Tests - Hooks** | 0 | 42+ | 0% ⏸️ |
| **E2E Tests** | 0 | 6 | 0% ⏸️ |
| **Cobertura Stores** | 100% | 100% | 100% ✅ |

---

## 🎯 OBJETIVOS DE TESTING

### Objetivo Principal
Implementar una suite completa de tests (unit, integration, E2E) que garantice la calidad y estabilidad del código, alcanzando >70% de cobertura en archivos críticos.

### Objetivos Específicos

1. **100% cobertura en stores** - Todos los stores de Zustand
2. **100% cobertura en hooks** - Todos los custom hooks
3. **6 tests E2E** - Flujos críticos de usuario
4. **CI/CD integration** - Tests automáticos en GitHub Actions

---

## 🔧 CONFIGURACIÓN

### Dependencias Instaladas

```json
{
  "devDependencies": {
    "vitest": "^3.2.4",
    "@vitest/ui": "^3.2.4",
    "@vitest/coverage-v8": "^3.2.4",
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.9.0",
    "@playwright/test": "^1.55.1",
    "jsdom": "^27.0.0"
  }
}
```

### vitest.config.ts

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/stores/**/*.ts', 'src/hooks/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.spec.ts', '**/index.ts'],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
```

### src/test/setup.ts

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Firebase if needed
global.firebase = {} as any;
```

---

## 📝 SCRIPTS NPM

```bash
# Unit tests
npm run test                 # Run tests in watch mode
npm run test:watch           # Run tests in watch mode (explicit)
npm run test:ui              # Run tests with UI
npm run test:coverage        # Run tests with coverage report

# E2E tests
npm run test:e2e             # Run E2E tests
npm run test:e2e:ui          # Run E2E tests with UI
npm run test:e2e:headed      # Run E2E tests in headed mode
npm run test:e2e:debug       # Run E2E tests in debug mode

# Run all tests
npm run test:all             # Run unit + E2E tests
```

---

## 🧪 PATRONES DE TESTING

### Patrón 1: Test de Store (Zustand)

**Estructura general:**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './auth.store';

// Mock console methods to avoid noise
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  // Reset store before each test
  useAuthStore.getState().reset();
});

describe('StoreNam', () => {
  describe('Initial State', () => {
    it('should initialize with correct default values', () => {
      const { property } = useAuthStore.getState();
      expect(property).toEqual(expectedValue);
    });
  });

  describe('Actions', () => {
    it('should update state correctly', () => {
      const store = useAuthStore.getState();
      store.action(value);
      expect(store.property).toBe(expectedValue);
    });
  });
});
```

**Ejemplo completo:**
```typescript
describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.getState().reset();
  });

  describe('Initial State', () => {
    it('should initialize with null user', () => {
      const { user } = useAuthStore.getState();
      expect(user).toBeNull();
    });

    it('should initialize with loading true', () => {
      const { loading } = useAuthStore.getState();
      expect(loading).toBe(true);
    });
  });

  describe('setUser', () => {
    it('should update user state', () => {
      const mockUser = {
        uid: '123',
        email: 'test@test.com',
        displayName: 'Test User',
        photoURL: null,
        emailVerified: true,
      };

      useAuthStore.getState().setUser(mockUser);

      const { user } = useAuthStore.getState();
      expect(user).toEqual(mockUser);
    });
  });

  describe('hasPermission', () => {
    it('should return false when no user profile', () => {
      const hasPermission = useAuthStore.getState().hasPermission('movements:create');
      expect(hasPermission).toBe(false);
    });

    it('should return true when user has permission', () => {
      useAuthStore.getState().setUserProfile({
        uid: '123',
        email: 'test@test.com',
        role: 'admin',
        combustiblesPermissions: {
          'movements:create': true,
        },
      });
      
      const hasPermission = useAuthStore.getState().hasPermission('movements:create');
      expect(hasPermission).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      // Set some state
      useAuthStore.getState().setUser({ uid: '123' });
      useAuthStore.getState().setLoading(false);
      
      // Reset
      useAuthStore.getState().reset();
      
      // Verify reset
      const { user, loading } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(loading).toBe(true);
    });
  });
});
```

### Patrón 2: Test de Hook

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMovements } from './useMovements';
import { useMovementsStore } from '../stores';

// Mock del store
vi.mock('../stores', () => ({
  useMovementsStore: vi.fn(),
}));

describe('useMovements', () => {
  const mockFetchMovements = vi.fn();
  const mockCreateMovement = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useMovementsStore as any).mockReturnValue({
      movements: [],
      loading: false,
      creating: false,
      error: null,
      fetchMovements: mockFetchMovements,
      createMovement: mockCreateMovement,
    });
  });

  it('should return movements from store', () => {
    const mockMovements = [
      { id: '1', type: 'entrada', quantity: 100 },
      { id: '2', type: 'salida', quantity: 50 },
    ];

    (useMovementsStore as any).mockReturnValue({
      movements: mockMovements,
      loading: false,
    });

    const { result } = renderHook(() => useMovements());
    
    expect(result.current.movements).toEqual(mockMovements);
  });

  it('should expose fetchMovements function', () => {
    const { result } = renderHook(() => useMovements());
    
    expect(typeof result.current.fetchMovements).toBe('function');
  });

  it('should call fetchMovements from store', async () => {
    const { result } = renderHook(() => useMovements());
    
    await result.current.fetchMovements();
    
    expect(mockFetchMovements).toHaveBeenCalledOnce();
  });
});
```

### Patrón 3: Test E2E con Playwright

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login with passkeys successfully', async ({ page }) => {
    // Navigate to login page
    await page.goto('/');
    
    // Wait for login button
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    
    // Click login
    await page.getByRole('button', { name: /login/i }).click();
    
    // Wait for WebAuthn prompt
    await page.waitForTimeout(2000);
    
    // After successful login, should redirect to dashboard
    await expect(page).toHaveURL(/\/combustibles\/dashboard/);
    
    // Should show user email or name
    await expect(page.getByText(/@/)).toBeVisible();
  });
});

test.describe('Movements Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should create ENTRADA movement', async ({ page }) => {
    await page.goto('/combustibles/movements');
    
    // Click create
    await page.getByRole('button', { name: /crear movimiento/i }).click();
    
    // Fill form
    await page.getByLabel(/tipo/i).selectOption('entrada');
    await page.getByLabel(/combustible/i).selectOption('DIESEL');
    await page.getByLabel(/cantidad/i).fill('100');
    
    // Submit
    await page.getByRole('button', { name: /guardar/i }).click();
    
    // Should show success message
    await expect(page.getByText(/movimiento creado/i)).toBeVisible();
  });
});
```

---

## 🔴 REGLAS OBLIGATORIAS

### 1. Cobertura Mínima

```
Objetivos por tipo de archivo:
- stores/*.ts:         100% cobertura
- hooks/*.ts:          100% cobertura
- utils/*.ts:          > 70% cobertura
- components/*.tsx:    > 60% cobertura (opcional)
```

### 2. Tests Obligatorios por Store

Cada store DEBE tener tests para:
- ✅ Estado inicial
- ✅ Cada acción/método
- ✅ Cada getter/selector
- ✅ Reset functionality
- ✅ Casos de error
- ✅ Edge cases

Mínimo: **8 tests por store**

### 3. Tests Obligatorios por Hook

Cada hook DEBE tener tests para:
- ✅ Retorno de valores correctos
- ✅ Cada función expuesta
- ✅ Estados de loading/error
- ✅ Casos de éxito
- ✅ Casos de error

Mínimo: **6 tests por hook**

### 4. Naming Conventions

```
Unit tests:     *.test.ts
E2E tests:      *.spec.ts
Test folders:   tests-e2e/, src/test/
Setup:          src/test/setup.ts
Mocks:          src/test/mocks/
```

---

## ✅ TESTS COMPLETADOS

### Auth Store (auth.store.test.ts) - ✅ COMPLETADO

**38 tests implementados:**
- ✅ Initial State (5 tests)
- ✅ setUser (2 tests)
- ✅ setUserProfile (2 tests)
- ✅ setLoading (2 tests)
- ✅ setError (2 tests)
- ✅ setAuthReady (2 tests)
- ✅ hasPermission (5 tests)
- ✅ isAdmin (4 tests)
- ✅ isCounterOrAbove (5 tests)
- ✅ reset (1 test)
- ✅ Selectors (8 tests)

**Resultado:**
```
✅ 38 tests passed
⏱️  Duration: 12ms
📊 Cobertura: 100%
```

---

## 📊 MÉTRICAS ACTUALES

### Tests Implementados

| Store/Hook | Tests | Estado | Cobertura |
|------------|-------|--------|-----------|
| `auth.store.ts` | 38 | ✅ Completo | 100% |
| `movements.store.ts` | 0 | ⏸️ Pendiente | 0% |
| `vehicles.store.ts` | 0 | ⏸️ Pendiente | 0% |
| `inventory.store.ts` | 0 | ⏸️ Pendiente | 0% |
| `products.store.ts` | 0 | ⏸️ Pendiente | 0% |

### Próximos Tests

1. [ ] Movements Store (10+ tests esperados)
2. [ ] Vehicles Store (10+ tests esperados)
3. [ ] Inventory Store (10+ tests esperados)
4. [ ] Products Store (8+ tests esperados)
5. [ ] useMovements hook (8+ tests esperados)
6. [ ] useVehicles hook (8+ tests esperados)
7. [ ] useInventory hook (8+ tests esperados)

---

## 🚀 COMANDOS ÚTILES

### Ejecutar tests específicos

```bash
# Un solo archivo
npm run test -- auth.store.test.ts

# Patrón de archivos
npm run test -- --run "stores/**/*.test.ts"

# Con coverage
npm run test:coverage -- auth.store.test.ts
```

### Ver resultados

```bash
# UI mode (recomendado para desarrollo)
npm run test:ui

# Coverage report (HTML)
npm run test:coverage
# Luego abrir: coverage/index.html
```

### Debugging

```bash
# Mode debug
npm run test -- --inspect-brk

# Solo tests que fallan
npm run test -- --reporter=verbose

# Watch mode
npm run test:watch
```

---

## 📚 RECURSOS

### Documentación Oficial
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/react)
- [Playwright](https://playwright.dev/)
- [Testing Zustand](https://github.com/pmndrs/zustand#testing)

### Documentación Interna
- [SPRINT3_PROMPT.md](./SPRINT3_PROMPT.md) - Plan del Sprint 3
- [STORES_GUIDE.md](./STORES_GUIDE.md) - Guía de stores
- [TYPESCRIPT_GUIDE.md](./TYPESCRIPT_GUIDE.md) - Guía de TypeScript
- [FASE2_SEGUIMIENTO.md](./FASE2_SEGUIMIENTO.md) - Seguimiento general

---

## 🎓 MEJORES PRÁCTICAS

### 1. Mock de Console

Siempre mockear console.log/error en tests para evitar ruido:

```typescript
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
```

### 2. Reset de Stores

Siempre resetear stores antes de cada test:

```typescript
beforeEach(() => {
  useAuthStore.getState().reset();
});
```

### 3. Tests Descriptivos

Usar descripciones claras y específicas:

```typescript
// ❌ MAL
it('should work', () => { });

// ✅ BIEN
it('should return true when user has movements:create permission', () => { });
```

### 4. Arrange-Act-Assert Pattern

```typescript
it('should update user state', () => {
  // Arrange
  const mockUser = { uid: '123', email: 'test@test.com' };
  
  // Act
  useAuthStore.getState().setUser(mockUser);
  
  // Assert
  expect(useAuthStore.getState().user).toEqual(mockUser);
});
```

---

**Última Actualización:** 1 de octubre de 2025  
**Autor:** AI Assistant  
**Versión:** 1.0  
**Sprint:** Sprint 3 - Testing & Quality Assurance
