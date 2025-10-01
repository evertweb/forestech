# 🚀 PROMPT PARA SPRINT 3: TESTING & QUALITY ASSURANCE

**Fecha de Creación:** 1 de octubre de 2025  
**Sprint:** Sprint 3 - Testing  
**Contexto:** Fase 2 - Modernización y Optimización  
**Precedente:** Sprint 1 (90%) + Sprint 2 (90%) completados

---

## 📋 CONTEXTO GENERAL

Eres un agente de IA especializado en testing y quality assurance. Tu tarea es **completar el Sprint 3: Testing** del proyecto Combustibles Forestech.

### Estado Actual del Proyecto

**Sprint 1 COMPLETADO (90%):**
- ✅ Zustand instalado y configurado
- ✅ 5 stores creados (auth, movements, vehicles, inventory, products)
- ✅ 19 componentes migrados de Context a Zustand (68%)
- ✅ Documentación completa (STORES_GUIDE.md, ADR-004)

**Sprint 2 COMPLETADO (90%):**
- ✅ TypeScript 5.9.3 con strict mode
- ✅ Sistema completo de tipos (30+ interfaces)
- ✅ 5 stores migrados a TypeScript
- ✅ 7 hooks migrados a TypeScript
- ✅ Documentación completa (TYPESCRIPT_GUIDE.md, ADR-005)

**Sprint 3 OBJETIVOS:**
1. Configurar Vitest para unit/integration tests
2. Configurar Playwright para E2E tests
3. Tests para los 5 stores de Zustand (100% cobertura)
4. Tests para los 7 hooks personalizados (100% cobertura)
5. 6 tests E2E de flujos críticos
6. Alcanzar > 70% de cobertura en código crítico

---

## 📚 DOCUMENTOS OBLIGATORIOS A LEER

**ANTES de empezar, debes leer completamente:**

1. **`FASE2_PROMPT_Y_REGLAS.md`** (COMPLETO) - Reglas obligatorias
2. **`STORES_GUIDE.md`** - Guía de stores de Zustand
3. **`TYPESCRIPT_GUIDE.md`** - Convenciones de TypeScript
4. **`ADR-004-ZUSTAND-MIGRATION.md`** - Decisión de Zustand
5. **`ADR-005-TYPESCRIPT-ADOPTION.md`** - Decisión de TypeScript
6. **`FASE2_SEGUIMIENTO.md`** - Tracking actual

---

## 🎯 OBJETIVOS DEL SPRINT 3

### Objetivo Principal
Implementar una suite completa de tests (unit, integration, E2E) que garantice la calidad y estabilidad del código, alcanzando > 70% de cobertura en archivos críticos.

### Objetivos Específicos

#### 1. Configuración de Testing (Día 1)
- [ ] Instalar Vitest y dependencias
- [ ] Crear `vitest.config.ts`
- [ ] Instalar React Testing Library
- [ ] Configurar mocks de Firebase
- [ ] Instalar Playwright
- [ ] Crear `playwright.config.ts`
- [ ] Configurar scripts de npm

#### 2. Unit Tests - Stores (Día 2)
- [ ] Tests para `auth.store.ts` (8+ tests)
- [ ] Tests para `movements.store.ts` (10+ tests)
- [ ] Tests para `vehicles.store.ts` (10+ tests)
- [ ] Tests para `inventory.store.ts` (10+ tests)
- [ ] Tests para `products.store.ts` (10+ tests)
- [ ] Objetivo: 100% cobertura en stores

#### 3. Unit Tests - Hooks (Día 2-3)
- [ ] Tests para `useMovements.ts` (8+ tests)
- [ ] Tests para `useVehicles.ts` (8+ tests)
- [ ] Tests para `useInventory.ts` (8+ tests)
- [ ] Tests para `useProducts.ts` (8+ tests)
- [ ] Tests para `useSuppliers.ts` (8+ tests)
- [ ] Tests para `useVehicleCategories.ts` (8+ tests)
- [ ] Tests para `useHourMeter.ts` (6+ tests)
- [ ] Objetivo: 100% cobertura en hooks

#### 4. E2E Tests - Playwright (Día 3-4)
- [ ] E2E: Login con Passkeys
- [ ] E2E: Crear movimiento ENTRADA
- [ ] E2E: Crear movimiento SALIDA
- [ ] E2E: Crear tipo de combustible
- [ ] E2E: Ver dashboard con datos
- [ ] E2E: Generar reporte básico

#### 5. Integration Tests (Día 4)
- [ ] Tests de integración Store + Hook
- [ ] Tests de integración Store + Service
- [ ] Tests de flujos completos

#### 6. Documentación y CI/CD (Día 4)
- [ ] Crear `TESTING_GUIDE.md`
- [ ] Documentar ADR-006 (Testing strategy)
- [ ] Configurar GitHub Actions para tests
- [ ] Coverage reports automáticos
- [ ] Actualizar `FASE2_SEGUIMIENTO.md`

---

## 📐 ESPECIFICACIONES TÉCNICAS

### vitest.config.ts Base
```typescript
import { defineConfig } from 'vitest/config';
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

### playwright.config.ts Base
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests-e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 🧪 PATRONES DE TESTING

### Patrón 1: Test de Store (Zustand)

```typescript
// auth.store.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './auth.store';

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store antes de cada test
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
      const mockUser = { uid: '123', email: 'test@test.com' };
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

  describe('isAdmin', () => {
    it('should return true for admin role', () => {
      useAuthStore.getState().setUserProfile({
        uid: '123',
        email: 'admin@test.com',
        role: 'admin',
      });
      
      const isAdmin = useAuthStore.getState().isAdmin();
      expect(isAdmin).toBe(true);
    });

    it('should return false for non-admin role', () => {
      useAuthStore.getState().setUserProfile({
        uid: '123',
        email: 'user@test.com',
        role: 'operador',
      });
      
      const isAdmin = useAuthStore.getState().isAdmin();
      expect(isAdmin).toBe(false);
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
// useMovements.test.ts
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
      deleteMovement: vi.fn(),
      validateStock: vi.fn(),
      getMovementsByType: vi.fn(),
      getMovementById: vi.fn(),
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
      // ... otros campos
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

  it('should expose createMovement function', () => {
    const { result } = renderHook(() => useMovements());
    
    expect(typeof result.current.createMovement).toBe('function');
  });
});
```

### Patrón 3: Test E2E con Playwright

```typescript
// login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login with passkeys successfully', async ({ page }) => {
    // Navigate to login page
    await page.goto('/');
    
    // Wait for login button
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    
    // Click login
    await page.getByRole('button', { name: /login/i }).click();
    
    // Wait for WebAuthn prompt (this depends on your implementation)
    await page.waitForTimeout(2000);
    
    // After successful login, should redirect to dashboard
    await expect(page).toHaveURL(/\/combustibles\/dashboard/);
    
    // Should show user email or name
    await expect(page.getByText(/@/)).toBeVisible();
  });

  test('should show permission-based content', async ({ page }) => {
    // Login first (assuming login helper)
    await loginAsAdmin(page);
    
    // Navigate to movements
    await page.goto('/combustibles/movements');
    
    // Admin should see create button
    await expect(page.getByRole('button', { name: /crear movimiento/i })).toBeVisible();
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
    await page.getByLabel(/ubicación/i).selectOption('Bodega 1');
    
    // Submit
    await page.getByRole('button', { name: /guardar/i }).click();
    
    // Should show success message
    await expect(page.getByText(/movimiento creado/i)).toBeVisible();
    
    // Should appear in list
    await expect(page.getByText(/100.*gal/i)).toBeVisible();
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

### 4. E2E Tests Obligatorios

**Los 6 tests críticos:**
1. ✅ Login con Passkeys
2. ✅ Crear movimiento ENTRADA
3. ✅ Crear movimiento SALIDA
4. ✅ Crear tipo de combustible
5. ✅ Ver dashboard con datos
6. ✅ Generar reporte básico

### 5. Naming Conventions

```
Unit tests:     *.test.ts
E2E tests:      *.spec.ts
Test folders:   tests-e2e/, src/test/
Setup:          src/test/setup.ts
Mocks:          src/test/mocks/
```

---

## 📋 CHECKLIST DE VALIDACIÓN

Antes de considerar el Sprint 3 completado:

### Código
- [ ] Vitest configurado
- [ ] Playwright configurado
- [ ] 5 stores con tests (100% cobertura)
- [ ] 7 hooks con tests (100% cobertura)
- [ ] 6 E2E tests pasando
- [ ] `npm run test` → todos verdes
- [ ] `npm run test:coverage` → > 70% en críticos
- [ ] `npm run test:e2e` → todos verdes

### Documentación
- [ ] `TESTING_GUIDE.md` creado
- [ ] ADR-006 documentado
- [ ] `FASE2_SEGUIMIENTO.md` actualizado
- [ ] README con comandos de testing

### CI/CD
- [ ] GitHub Actions ejecuta tests
- [ ] Coverage reports generados
- [ ] E2E tests en CI
- [ ] Badge de cobertura

---

## 📊 MÉTRICAS ESPERADAS

| Métrica | Objetivo |
|---------|----------|
| **Unit tests** | 60+ tests |
| **E2E tests** | 6 tests |
| **Cobertura stores** | 100% |
| **Cobertura hooks** | 100% |
| **Cobertura global** | > 70% |
| **Tests pasando** | 100% |
| **Tiempo tests** | < 30s unit, < 2min E2E |

---

## 🚀 PLAN DE EJECUCIÓN RECOMENDADO

### Día 1 (2-3 horas)
1. Leer documentación obligatoria
2. Instalar Vitest + React Testing Library
3. Crear vitest.config.ts
4. Crear src/test/setup.ts
5. Instalar Playwright
6. Crear playwright.config.ts
7. Crear primer test de store (auth.store.test.ts)

### Día 2 (3-4 horas)
1. Tests para los 5 stores (8-10 tests cada uno)
2. Tests para hooks que usan stores (4 hooks)
3. Alcanzar 100% cobertura en stores

### Día 3 (3-4 horas)
1. Tests para hooks restantes (3 hooks)
2. Empezar E2E tests (3 tests)
3. Alcanzar 100% cobertura en hooks

### Día 4 (2-3 horas)
1. Completar E2E tests (3 tests restantes)
2. Tests de integración
3. Crear documentación
4. Configurar CI/CD
5. **CREAR PROMPT PARA SPRINT 4**

---

## 📝 SCRIPTS DE NPM

Agregar a package.json:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test && npm run test:e2e"
  }
}
```

---

## ✅ DEFINICIÓN DE "TERMINADO"

El Sprint 3 está TERMINADO cuando:

1. ✅ Vitest configurado y funcionando
2. ✅ Playwright configurado y funcionando
3. ✅ 60+ unit tests implementados
4. ✅ 100% cobertura en stores
5. ✅ 100% cobertura en hooks
6. ✅ 6 E2E tests pasando
7. ✅ `npm run test` → todos verdes
8. ✅ `npm run test:e2e` → todos verdes
9. ✅ Documentación completa
10. ✅ **PROMPT PARA SPRINT 4 CREADO**

---

## 🔄 INSTRUCCIONES PARA CREAR PROMPT SPRINT 4

**IMPORTANTE:** Al completar el Sprint 3, debes crear inmediatamente el archivo `SPRINT4_PROMPT.md`.

### Contenido del Prompt Sprint 4

El prompt debe incluir:

1. **Contexto completo:**
   - Sprint 1 completado (State Management)
   - Sprint 2 completado (TypeScript)
   - Sprint 3 completado (Testing)
   - Estado actual del proyecto

2. **Objetivos del Sprint 4: Performance Optimization**
   - Lighthouse score > 90 en todas las métricas
   - Bundle size < 200KB (initial)
   - Code splitting implementado
   - React.memo en componentes pesados
   - Virtualization en tablas > 100 items
   - Lazy loading de rutas
   - Image optimization

3. **Especificaciones técnicas:**
   - Lighthouse audit
   - Bundle analyzer
   - React DevTools Profiler
   - Performance budgets
   - Optimization strategies

4. **Métricas objetivo:**
   - Performance: > 90
   - Accessibility: > 95
   - Best Practices: > 90
   - SEO: > 90
   - Initial bundle: < 200KB
   - Time to Interactive: < 3s

---

## 📞 RECURSOS Y REFERENCIAS

### Documentación Oficial
- Vitest: https://vitest.dev/
- Playwright: https://playwright.dev/
- React Testing Library: https://testing-library.com/react
- Testing with Zustand: https://github.com/pmndrs/zustand#testing

### Archivos del Proyecto
- `/combustibles/STORES_GUIDE.md`
- `/combustibles/TYPESCRIPT_GUIDE.md`
- `/combustibles/ADR-004-ZUSTAND-MIGRATION.md`
- `/combustibles/ADR-005-TYPESCRIPT-ADOPTION.md`
- `/combustibles/src/stores/` (stores a testear)
- `/combustibles/src/hooks/` (hooks a testear)

---

**Fecha de Creación:** 1 de octubre de 2025  
**Creado por:** AI Assistant (Sprint 2)  
**Para:** AI Assistant (Sprint 3)  
**Siguiente:** SPRINT4_PROMPT.md (Performance)

**Estado:** ✅ LISTO PARA EJECUTAR

---

## 🚀 COMANDO PARA EMPEZAR

```bash
# 1. Ir al directorio
cd /home/hp/Documents/forestech/combustibles

# 2. Leer documentación obligatoria
cat FASE2_PROMPT_Y_REGLAS.md
cat STORES_GUIDE.md
cat TYPESCRIPT_GUIDE.md
cat FASE2_SEGUIMIENTO.md

# 3. Instalar dependencias de testing
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test

# 4. Crear primer test
mkdir -p src/test
touch src/test/setup.ts
touch src/stores/auth.store.test.ts

# 5. Ejecutar tests
npm run test
```
