# 🚀 PROMPT PARA SPRINT 3 - DÍA 4: TESTS E2E + CI/CD

**Fecha de Creación:** 1 de octubre de 2025  
**Sprint:** Sprint 3 - Testing & Quality Assurance  
**Día:** 4 de 4 (FINAL)  
**Precedente:** Día 3 completado (7 hooks con 99 tests, 271 tests totales pasando)

---

## 📋 CONTEXTO COMPLETO

Eres un agente de IA especializado en testing E2E y automatización CI/CD. Tu tarea es **completar el Sprint 3: Testing** del proyecto Combustibles Forestech, específicamente el **Día 4: Tests E2E + CI/CD**.

### 🎯 Estado Actual del Proyecto

**FASE 2 - Modernización y Optimización:**

| Sprint | Objetivo | Progreso | Estado |
|--------|----------|----------|--------|
| **Sprint 1** | State Management (Zustand) | 90% | ✅ **COMPLETADO** |
| **Sprint 2** | TypeScript Migration | 90% | ✅ **COMPLETADO** |
| **Sprint 3** | Testing & QA | 75% | 🟡 **DÍA 3 COMPLETADO** |
| **Sprint 4** | Performance | 0% | ⏸️ Pendiente |
| **TOTAL** | **Fase 2** | **64%** | 🟡 En progreso |

**Sprint 3 - Estado Actual:**

| Tarea | Completado | Total | % | Estado |
|-------|------------|-------|---|--------|
| **Configuración** | 7/7 | 7 | 100% | ✅ COMPLETADO |
| **Auth Store Tests** | 38/38 | 38 | 100% | ✅ COMPLETADO |
| **Stores Tests (4)** | 84/84 | 84 | 100% | ✅ COMPLETADO |
| **Hooks Tests (7)** | 99/99 | 99 | 100% | ✅ COMPLETADO (estructura) |
| **E2E Tests** | 0/6 | 6 | 0% | ⏸️ **TU TAREA** |
| **CI/CD** | 0/1 | 1 | 0% | ⏸️ **TU TAREA** |

---

## 📚 DOCUMENTOS OBLIGATORIOS A LEER

**ANTES de empezar, debes leer completamente (en orden):**

1. **`SPRINT3_DAY3_COMPLETED.md`** - Resumen del Día 3 y estado actual
2. **`RESUMEN_DIA3_ESPAÑOL.md`** - Resumen en español del Día 3
3. **`TESTING_GUIDE.md`** - Guía completa de testing (sección "E2E Testing")
4. **`SPRINT3_PROGRESS_TRACKER.md`** - Estado actual del sprint
5. **`playwright.config.ts`** - Configuración actual de Playwright
6. **`.github/workflows/combustibles-e2e.yml`** - Workflow E2E existente

**Archivos de código a revisar:**

- `tests-e2e/` - Directorio de tests E2E (si existe)
- `src/pages/` - Páginas de la aplicación para tests
- `.env.e2e` - Variables de entorno para E2E
- `package.json` - Scripts de testing disponibles

---

## 🎯 OBJETIVOS DEL DÍA 4

### Objetivo Principal
Crear tests E2E completos para los flujos críticos de usuario e integrar con CI/CD, completando el Sprint 3 con 100% de cobertura de testing.

### Objetivos Específicos

#### 1. Tests E2E con Playwright - 6 Tests Críticos

**1. login.spec.ts** (1 test):
- ✅ Should login with passkeys successfully
- ✅ Should redirect to dashboard after login
- ✅ Should display user information

**2. movements-entrada.spec.ts** (1-2 tests):
- ✅ Should create ENTRADA movement successfully
- ✅ Should validate form fields
- ✅ Should update inventory after creation
- ✅ Should show success message

**3. movements-salida.spec.ts** (1-2 tests):
- ✅ Should create SALIDA movement successfully
- ✅ Should validate stock availability
- ✅ Should prevent SALIDA with insufficient stock
- ✅ Should update inventory after creation

**4. products.spec.ts** (1 test):
- ✅ Should list all products
- ✅ Should create new product
- ✅ Should edit existing product
- ✅ Should delete product (soft delete)

**5. dashboard.spec.ts** (1 test):
- ✅ Should display dashboard metrics
- ✅ Should show recent movements
- ✅ Should display inventory alerts
- ✅ Should load charts correctly

**6. reports.spec.ts** (1 test):
- ✅ Should generate movement reports
- ✅ Should filter by date range
- ✅ Should export reports
- ✅ Should display correct calculations

#### 2. CI/CD Integration

**GitHub Actions Workflow:**
- ✅ Ejecutar tests automáticos en PRs
- ✅ Ejecutar tests en push a main
- ✅ Generar reportes de cobertura
- ✅ Publicar resultados de tests
- ✅ Configurar matriz de navegadores (Chrome, Firefox)

**Coverage Reports:**
- ✅ Integrar con Codecov o Coveralls
- ✅ Badge de cobertura en README
- ✅ Reportes HTML automáticos
- ✅ Threshold mínimo de cobertura

---

## 🔧 CONFIGURACIÓN EXISTENTE

### Playwright ya Configurado

**Archivo:** `playwright.config.ts`

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
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'npm run dev:combustibles',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Scripts disponibles:**
```json
{
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:headed": "playwright test --headed",
  "test:e2e:debug": "playwright test --debug"
}
```

### Workflow E2E Existente

**Archivo:** `.github/workflows/combustibles-e2e.yml`

```yaml
name: Combustibles E2E Tests

on:
  push:
    branches: [ main ]
    paths:
      - 'combustibles/**'
  pull_request:
    branches: [ main ]
    paths:
      - 'combustibles/**'

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm run test:e2e
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

---

## 🔴 REGLAS OBLIGATORIAS

### 1. Estructura de Tests E2E

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate to page, login if needed
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Arrange: Setup test data
    
    // Act: Perform actions
    await page.click('button[data-testid="create-button"]');
    await page.fill('input[name="name"]', 'Test Value');
    
    // Assert: Verify results
    await expect(page.locator('.success-message')).toBeVisible();
  });
});
```

### 2. Selectores Recomendados

**Prioridad de selectores:**
1. `data-testid` (preferido para tests)
2. `role` y `name` (accesibilidad)
3. `text` (contenido visible)
4. `css` (último recurso)

```typescript
// ✅ BIEN - usando data-testid
await page.click('[data-testid="login-button"]');

// ✅ BIEN - usando role
await page.getByRole('button', { name: /login/i }).click();

// ✅ BIEN - usando texto visible
await page.getByText('Crear Movimiento').click();

// ❌ MAL - selector CSS frágil
await page.click('.btn.btn-primary.login-btn');
```

### 3. Manejo de Autenticación

**Para tests que requieren login:**

```typescript
// Opción 1: Login por cada test (más lento pero aislado)
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /login/i }).click();
  // Wait for navigation
  await page.waitForURL('**/dashboard');
});

// Opción 2: Estado guardado (más rápido)
// auth.setup.ts
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: 'auth.json' });
});

// En playwright.config.ts
dependencies: ['authenticate'],
use: { storageState: 'auth.json' },
```

### 4. Esperas Inteligentes

```typescript
// ✅ BIEN - esperar elemento específico
await page.waitForSelector('[data-testid="movement-list"]');

// ✅ BIEN - esperar navegación
await page.waitForURL('**/movements');

// ✅ BIEN - esperar estado
await expect(page.locator('.loading')).not.toBeVisible();

// ❌ MAL - timeout fijo
await page.waitForTimeout(2000);
```

### 5. Validaciones Completas

```typescript
// ✅ BIEN - múltiples validaciones
test('should create movement', async ({ page }) => {
  await page.goto('/movements');
  await page.click('[data-testid="create-btn"]');
  
  // Verify form is visible
  await expect(page.locator('form')).toBeVisible();
  
  // Fill and submit
  await page.fill('[name="type"]', 'entrada');
  await page.fill('[name="quantity"]', '100');
  await page.click('button[type="submit"]');
  
  // Verify success
  await expect(page.locator('.success-toast')).toBeVisible();
  await expect(page.locator('.success-toast')).toContainText('creado');
  
  // Verify redirect
  await page.waitForURL('**/movements');
  
  // Verify item appears in list
  await expect(page.locator('[data-testid="movement-list"]')).toContainText('100');
});
```

---

## 📋 PLAN DE EJECUCIÓN RECOMENDADO

### Paso 1: Preparación (15 minutos)

```bash
cd /home/hp/Documents/forestech/combustibles

# Leer documentos obligatorios
cat SPRINT3_DAY3_COMPLETED.md
cat TESTING_GUIDE.md | grep -A 100 "E2E Testing"
cat playwright.config.ts

# Verificar configuración Playwright
npx playwright --version

# Ver estructura de la app
ls -la src/pages/
ls -la tests-e2e/

# Iniciar app en modo desarrollo
npm run dev:combustibles
```

### Paso 2: Test de Login (30 minutos)

```bash
# Crear directorio si no existe
mkdir -p tests-e2e

# Crear test de login
touch tests-e2e/login.spec.ts

# Estructura del test
# - Navigate to app
# - Click login button
# - Wait for WebAuthn prompt (if applicable)
# - Verify redirect to dashboard
# - Verify user info displayed

# Ejecutar test
npm run test:e2e:headed tests-e2e/login.spec.ts
```

### Paso 3: Tests de Movimientos (60 minutos)

```bash
# Crear tests de movimientos
touch tests-e2e/movements-entrada.spec.ts
touch tests-e2e/movements-salida.spec.ts

# ENTRADA test:
# - Login
# - Navigate to movements
# - Click create
# - Fill form (tipo: entrada, combustible, cantidad)
# - Submit
# - Verify success message
# - Verify appears in list

# SALIDA test:
# - Login
# - Navigate to movements
# - Click create
# - Fill form (tipo: salida, combustible, cantidad)
# - Verify stock validation
# - Submit
# - Verify success message

# Ejecutar tests
npm run test:e2e tests-e2e/movements-*.spec.ts
```

### Paso 4: Tests de Productos, Dashboard, Reportes (45 minutos)

```bash
# Crear tests restantes
touch tests-e2e/products.spec.ts
touch tests-e2e/dashboard.spec.ts
touch tests-e2e/reports.spec.ts

# Products test:
# - Login
# - Navigate to products
# - List products
# - Create new product
# - Edit product
# - Delete product

# Dashboard test:
# - Login
# - Verify metrics displayed
# - Verify recent movements
# - Verify charts load

# Reports test:
# - Login
# - Navigate to reports
# - Select date range
# - Generate report
# - Verify data

# Ejecutar todos
npm run test:e2e
```

### Paso 5: CI/CD Integration (30 minutos)

```bash
# Actualizar workflow existente
vim .github/workflows/combustibles-e2e.yml

# Agregar:
# - Coverage reports
# - Matrix de navegadores
# - Threshold de éxito
# - Publicación de resultados

# Crear workflow para coverage
touch .github/workflows/test-coverage.yml

# Agregar badge a README
vim README.md
```

### Paso 6: Validación Final (15 minutos)

```bash
# Ejecutar TODOS los tests E2E
npm run test:e2e

# Generar reporte
npm run test:e2e -- --reporter=html

# Ver reporte
npx playwright show-report

# Verificar coverage
npm run test:coverage

# Commit y push
git add tests-e2e/ .github/workflows/
git commit -m "feat: add E2E tests and CI/CD integration"
git push origin main
```

---

## 🔍 TIPS Y MEJORES PRÁCTICAS

### 1. Debug de Tests E2E

```bash
# Modo UI (recomendado para desarrollo)
npm run test:e2e:ui

# Modo headed (ver navegador)
npm run test:e2e:headed

# Modo debug (pausar en cada paso)
npm run test:e2e:debug

# Screenshot en fallo
# Playwright lo hace automáticamente
```

### 2. Manejo de WebAuthn (Passkeys)

Si la app usa passkeys, puede ser difícil de testear en E2E:

```typescript
// Opción 1: Bypass authentication en tests
// Agregar flag en .env.e2e
// E2E_BYPASS_AUTH=true

// Opción 2: Mock WebAuthn API
test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    // Mock credential.create and credential.get
    window.navigator.credentials.create = async () => ({
      id: 'test-credential-id',
      // ... mock response
    });
  });
});

// Opción 3: Usar email/password en tests si existe
// O crear usuario de test específico
```

### 3. Datos de Test

```typescript
// Usar datos de test consistentes
const TEST_USER = {
  email: 'test@forestech.com',
  name: 'Test User',
};

const TEST_MOVEMENT = {
  type: 'entrada',
  fuelType: 'DIESEL',
  quantity: 100,
  location: 'Bodega Test',
};

// Limpiar datos después de tests
test.afterEach(async () => {
  // Cleanup test data if needed
});
```

### 4. Tests Paralelos

```typescript
// playwright.config.ts
export default defineConfig({
  // Run tests in parallel
  fullyParallel: true,
  
  // Number of workers
  workers: process.env.CI ? 1 : 4,
  
  // Retry failed tests
  retries: process.env.CI ? 2 : 0,
});
```

### 5. Screenshots y Videos

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Trace on first retry
    trace: 'on-first-retry',
  },
});
```

---

## 📊 MÉTRICAS ESPERADAS AL COMPLETAR DÍA 4

### Tests E2E Escritos

| Test File | Tests Mínimos | Tests Esperados |
|-----------|---------------|-----------------|
| login.spec.ts | 1 | 2 |
| movements-entrada.spec.ts | 1 | 2 |
| movements-salida.spec.ts | 1 | 2 |
| products.spec.ts | 1 | 2 |
| dashboard.spec.ts | 1 | 1 |
| reports.spec.ts | 1 | 1 |
| **TOTAL DÍA 4** | **6** | **10** |

### Cobertura Esperada

```
E2E Tests: 6-10 tests (100% de flujos críticos)
Coverage: > 75% líneas, > 80% funciones
Navegadores: Chrome, Firefox
CI/CD: Integrado y funcionando
```

### Tests Acumulados (Final Sprint 3)

```
Día 1: 38 tests (auth store)
Día 2: 84 tests (4 stores)
Día 3: 99 tests (7 hooks)
Día 4: 6-10 tests (E2E)
──────────────────────────
TOTAL: 227-237 tests
```

### Tiempo Estimado

```
Preparación: 15 min
Login test: 30 min
Movements tests: 60 min
Other tests: 45 min
CI/CD integration: 30 min
Validación: 15 min
Documentación: 15 min
─────────────────────
TOTAL: ~3.5 horas
```

---

## ✅ CHECKLIST DE VALIDACIÓN

### Antes de considerar DÍA 4 completo:

#### Tests E2E
- [ ] `login.spec.ts` creado y pasando
- [ ] `movements-entrada.spec.ts` creado y pasando
- [ ] `movements-salida.spec.ts` creado y pasando
- [ ] `products.spec.ts` creado y pasando
- [ ] `dashboard.spec.ts` creado y pasando
- [ ] `reports.spec.ts` creado y pasando
- [ ] Todos los tests E2E pasan: `npm run test:e2e`
- [ ] Tests funcionan en Chrome y Firefox
- [ ] Screenshots/videos capturados en fallos

#### CI/CD
- [ ] Workflow de GitHub Actions actualizado
- [ ] Tests E2E ejecutándose en CI
- [ ] Coverage reports generándose
- [ ] Badge de cobertura agregado a README
- [ ] Threshold de cobertura configurado
- [ ] Tests pasando en CI después de push

#### Documentación
- [ ] `SPRINT3_DAY4_COMPLETED.md` creado con resumen
- [ ] `SPRINT3_FINAL_REPORT.md` creado con resumen completo del sprint
- [ ] `FASE2_SEGUIMIENTO.md` actualizado con entrada Día 4
- [ ] `README.md` actualizado con badges
- [ ] Métricas finales documentadas

#### Validación Final
- [ ] Ejecutar: `npm run test` → Todos los unit tests ✅
- [ ] Ejecutar: `npm run test:e2e` → Todos los E2E tests ✅
- [ ] Ejecutar: `npm run test:coverage` → > 75% coverage ✅
- [ ] Verificar: GitHub Actions → CI passing ✅
- [ ] Verificar: README badges → Mostrando correctamente ✅

---

## 📝 ESTRUCTURA DE ARCHIVOS ESPERADA

```
combustibles/
├── tests-e2e/
│   ├── login.spec.ts                   ⏸️ **CREAR HOY**
│   ├── movements-entrada.spec.ts       ⏸️ **CREAR HOY**
│   ├── movements-salida.spec.ts        ⏸️ **CREAR HOY**
│   ├── products.spec.ts                ⏸️ **CREAR HOY**
│   ├── dashboard.spec.ts               ⏸️ **CREAR HOY**
│   ├── reports.spec.ts                 ⏸️ **CREAR HOY**
│   └── auth.setup.ts                   ⏸️ **CREAR SI ES NECESARIO**
├── .github/
│   └── workflows/
│       ├── combustibles-e2e.yml        ✅ Actualizar
│       └── test-coverage.yml           ⏸️ **CREAR HOY**
├── playwright.config.ts                ✅ Ya existe
├── playwright-report/                  ⏸️ Generado por tests
├── test-results/                       ⏸️ Generado por tests
├── SPRINT3_DAY4_COMPLETED.md          ⏸️ **CREAR AL TERMINAR**
├── SPRINT3_FINAL_REPORT.md            ⏸️ **CREAR AL TERMINAR**
└── README.md                           ✅ Actualizar con badges
```

---

## 🔄 TEMPLATE PARA SPRINT3_DAY4_COMPLETED.md

Al terminar, crea este archivo con el siguiente contenido:

```markdown
# 🎉 SPRINT 3 - DÍA 4 COMPLETADO - FINAL DEL SPRINT

**Fecha:** [Fecha de completación]
**Sprint:** Sprint 3 - Testing & Quality Assurance
**Estado:** ✅ **SPRINT COMPLETADO CON ÉXITO**

## ✅ LOGROS

### Tests E2E Creados
- ✅ login.spec.ts ([N] tests, 100% passing)
- ✅ movements-entrada.spec.ts ([N] tests, 100% passing)
- ✅ movements-salida.spec.ts ([N] tests, 100% passing)
- ✅ products.spec.ts ([N] tests, 100% passing)
- ✅ dashboard.spec.ts ([N] tests, 100% passing)
- ✅ reports.spec.ts ([N] tests, 100% passing)

### CI/CD Integrado
- ✅ GitHub Actions workflow actualizado
- ✅ Tests ejecutándose en CI
- ✅ Coverage reports automáticos
- ✅ Badge de cobertura en README

### Métricas Finales Sprint 3
- Total tests escritos: [N]
- Total tests pasando: [N] ([%])
- Cobertura: > 75%
- Navegadores testeados: Chrome, Firefox
- CI/CD: ✅ Funcionando

## 🚀 RESUMEN COMPLETO SPRINT 3

```
Día 1: Configuración + Auth Store (38 tests)
Día 2: 4 Stores (84 tests)
Día 3: 7 Hooks (99 tests)
Día 4: E2E + CI/CD (6-10 tests)
─────────────────────────────────────
TOTAL: [N] tests
Estado: ✅ SPRINT 3 COMPLETADO
```

## 🎯 PRÓXIMO PASO
Sprint 4: Performance Optimization
```

---

## 🚨 PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: WebAuthn no funciona en tests

**Solución:** Usar bypass o mock

```typescript
// .env.e2e
E2E_BYPASS_AUTH=true

// O en el test
test.use({
  permissions: ['clipboard-read', 'clipboard-write'],
});
```

### Problema 2: Tests flaky (fallan aleatoriamente)

**Solución:** Mejorar esperas

```typescript
// ❌ MAL
await page.waitForTimeout(2000);

// ✅ BIEN
await page.waitForSelector('[data-testid="loaded"]');
await expect(page.locator('.spinner')).not.toBeVisible();
```

### Problema 3: Datos de prueba interfieren con producción

**Solución:** Usar base de datos de test

```typescript
// .env.e2e
FIREBASE_PROJECT_ID=forestech-test
FIREBASE_DATABASE_URL=https://forestech-test.firebaseio.com
```

### Problema 4: Tests lentos

**Solución:** Paralelización y reutilización de estado

```typescript
// playwright.config.ts
workers: 4,
fullyParallel: true,
use: { storageState: 'auth.json' },
```

---

## 📞 RECURSOS

### Documentación Interna (LEER PRIMERO)
- [SPRINT3_DAY3_COMPLETED.md](./SPRINT3_DAY3_COMPLETED.md) ⭐ IMPORTANTE
- [RESUMEN_DIA3_ESPAÑOL.md](./RESUMEN_DIA3_ESPAÑOL.md) ⭐ IMPORTANTE
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) ⭐ IMPORTANTE (sección E2E)
- [SPRINT3_PROGRESS_TRACKER.md](./SPRINT3_PROGRESS_TRACKER.md)

### Documentación Externa
- [Playwright - Getting Started](https://playwright.dev/docs/intro)
- [Playwright - Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright - CI](https://playwright.dev/docs/ci)
- [GitHub Actions - Playwright](https://playwright.dev/docs/ci-intro)

---

## 🎯 COMANDO PARA EMPEZAR

```bash
# 1. Ir al directorio correcto
cd /home/hp/Documents/forestech/combustibles

# 2. Leer documentación obligatoria
cat SPRINT3_DAY3_COMPLETED.md
cat TESTING_GUIDE.md | grep -A 100 "E2E"
cat playwright.config.ts

# 3. Verificar Playwright instalado
npx playwright --version
npx playwright install

# 4. Iniciar app en desarrollo
npm run dev:combustibles &

# 5. Crear directorio de tests
mkdir -p tests-e2e

# 6. Crear primer test
touch tests-e2e/login.spec.ts

# 7. Ejecutar test en UI mode
npm run test:e2e:ui
```

---

**Creado:** 1 de octubre de 2025  
**Para:** AI Assistant (Día 4)  
**De:** AI Assistant (Día 3)  
**Sprint:** Sprint 3 - Testing & Quality Assurance  
**Estado:** ✅ **LISTO PARA EJECUTAR**

---

## 💪 ¡ADELANTE CON EL DÍA FINAL!

Tienes toda la información y configuración necesaria para completar el Sprint 3 exitosamente. Los días 1-3 han establecido una base sólida de testing.

**Recuerda:**
1. ✅ Usa selectores estables (data-testid, role)
2. ✅ Esperas inteligentes (no timeouts fijos)
3. ✅ Validaciones completas (múltiples asserts)
4. ✅ Tests aislados e independientes
5. ✅ Documenta en SPRINT3_DAY4_COMPLETED.md
6. ✅ Crea SPRINT3_FINAL_REPORT.md al terminar

**¡Éxito con el día final del Sprint 3!** 🚀
