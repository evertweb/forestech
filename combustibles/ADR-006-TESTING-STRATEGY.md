# ADR-006: Testing Strategy & Implementation

**Status:** ✅ Accepted  
**Date:** 2025-10-01  
**Deciders:** Development Team  
**Sprint:** Sprint 3 - Testing & Quality Assurance

---

## Context

Después de completar Sprint 1 (State Management con Zustand) y Sprint 2 (TypeScript Migration), el proyecto necesita una estrategia integral de testing para garantizar la calidad y estabilidad del código modernizado.

### Estado Pre-Testing

- ❌ **Cobertura de tests:** < 5%
- ❌ **Tests unitarios:** Mínimos o inexistentes
- ❌ **Tests E2E:** No implementados
- ❌ **Framework de testing:** No configurado
- ⚠️ **Confianza en cambios:** Baja (tests manuales)

### Necesidades Identificadas

1. **Tests unitarios** para stores de Zustand (5 stores)
2. **Tests unitarios** para custom hooks (7 hooks)
3. **Tests E2E** para flujos críticos de usuario
4. **Coverage reports** automáticos
5. **CI/CD integration** para tests automáticos

---

## Decision

Implementar una estrategia de testing completa con tres niveles:

### 1. Unit Tests - Vitest + React Testing Library

**Framework seleccionado:** Vitest

**Justificación:**
- ✅ Integración nativa con Vite (ya usado en el proyecto)
- ✅ Compatibilidad con Jest API (familiar para el equipo)
- ✅ Excelente performance (más rápido que Jest)
- ✅ Built-in support para ESM
- ✅ UI mode para debugging interactivo
- ✅ Coverage reports con V8

**Configuración:**
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/stores/**/*.ts', 'src/hooks/**/*.ts'],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
});
```

### 2. E2E Tests - Playwright

**Framework seleccionado:** Playwright

**Justificación:**
- ✅ Multi-browser support (Chromium, Firefox, WebKit)
- ✅ Auto-wait capabilities (menos flakiness)
- ✅ Powerful selectors (text, role, test-id)
- ✅ Screenshots y video recording
- ✅ Network interception
- ✅ Parallelization nativa

**Tests E2E prioritarios:**
1. Login con Passkeys
2. Crear movimiento ENTRADA
3. Crear movimiento SALIDA
4. Crear tipo de combustible
5. Ver dashboard con datos
6. Generar reporte básico

### 3. Coverage Goals

**Objetivos de cobertura:**
- **Stores:** 100% (crítico - estado global)
- **Hooks:** 100% (crítico - lógica de negocio)
- **Utils:** > 70% (importante)
- **Components:** > 60% (recomendado)

---

## Implementation Details

### Patrón de Testing para Stores

```typescript
describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store antes de cada test
    useAuthStore.getState().reset();
    // Mock console
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('Initial State', () => {
    it('should initialize with correct defaults', () => {
      const { user } = useAuthStore.getState();
      expect(user).toBeNull();
    });
  });

  describe('Actions', () => {
    it('should update state correctly', () => {
      useAuthStore.getState().setUser(mockUser);
      expect(useAuthStore.getState().user).toEqual(mockUser);
    });
  });
});
```

### Patrón de Testing para Hooks

```typescript
describe('useMovements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return movements from store', () => {
    const { result } = renderHook(() => useMovements());
    expect(result.current.movements).toEqual([]);
  });

  it('should expose fetchMovements function', () => {
    const { result } = renderHook(() => useMovements());
    expect(typeof result.current.fetchMovements).toBe('function');
  });
});
```

### Patrón de Testing E2E

```typescript
test('should create ENTRADA movement', async ({ page }) => {
  await page.goto('/combustibles/movements');
  await page.getByRole('button', { name: /crear/i }).click();
  await page.getByLabel(/tipo/i).selectOption('entrada');
  await page.getByLabel(/cantidad/i).fill('100');
  await page.getByRole('button', { name: /guardar/i }).click();
  await expect(page.getByText(/creado/i)).toBeVisible();
});
```

---

## Consequences

### Positive

✅ **Confianza en cambios:** Tests automáticos reducen regresiones  
✅ **Documentación viva:** Tests documentan comportamiento esperado  
✅ **Refactoring seguro:** Tests permiten refactorizar con confianza  
✅ **CI/CD:** Tests automáticos en cada PR  
✅ **Developer Experience:** Vitest UI facilita debugging  
✅ **Performance:** Vitest es significativamente más rápido que Jest

### Negative

⚠️ **Tiempo inicial:** Implementar 60+ tests requiere tiempo  
⚠️ **Mantenimiento:** Tests requieren actualización con cambios  
⚠️ **Curva de aprendizaje:** Equipo debe aprender Vitest/Playwright  
⚠️ **Flakiness potencial:** E2E tests pueden ser flaky si no se cuidan

### Mitigations

- ✅ **Documentación completa:** TESTING_GUIDE.md con ejemplos
- ✅ **Patrones establecidos:** Templates reutilizables
- ✅ **Helper functions:** Mocks y utilities compartidas
- ✅ **Best practices:** Guía de mejores prácticas documentada

---

## Metrics & Success Criteria

### Sprint 3 Goals

| Métrica | Objetivo | Actual | Estado |
|---------|----------|--------|--------|
| **Vitest configurado** | ✅ | ✅ | ✅ Completado |
| **Playwright configurado** | ✅ | ✅ | ✅ Completado |
| **Tests de stores** | 50+ | 38 | 🟡 76% (en progreso) |
| **Tests de hooks** | 42+ | 0 | ⏸️ Pendiente |
| **Tests E2E** | 6 | 0 | ⏸️ Pendiente |
| **Cobertura stores** | 100% | 100% (1/5) | 🟡 20% |
| **Cobertura hooks** | 100% | 0% | ⏸️ 0% |

### Long-term Goals

- **Q4 2025:** > 80% cobertura en código crítico
- **Q1 2026:** 100% cobertura en stores y hooks
- **Q1 2026:** Suite completa de E2E tests (20+ scenarios)
- **Continuous:** < 5 minutos tiempo total de tests

---

## Implementation Progress

### Phase 1: Configuration (✅ COMPLETED - Day 1)

**Completed:**
- ✅ Vitest 3.2.4 installed
- ✅ @vitest/ui, @vitest/coverage-v8 configured
- ✅ React Testing Library + jsdom
- ✅ Playwright installed
- ✅ vitest.config.ts created
- ✅ src/test/setup.ts configured
- ✅ 9 npm scripts added

### Phase 2: Store Tests (🟡 IN PROGRESS - Day 1-2)

**Completed:**
- ✅ auth.store.test.ts (38 tests, 100% coverage)

**In Progress:**
- ⏸️ movements.store.test.ts (0/10 tests)
- ⏸️ vehicles.store.test.ts (0/10 tests)
- ⏸️ inventory.store.test.ts (0/10 tests)
- ⏸️ products.store.test.ts (0/8 tests)

### Phase 3: Hook Tests (⏸️ PENDING - Day 2-3)

**Pending:**
- ⏸️ useMovements.test.ts (0/8 tests)
- ⏸️ useVehicles.test.ts (0/8 tests)
- ⏸️ useInventory.test.ts (0/8 tests)
- ⏸️ useProducts.test.ts (0/8 tests)
- ⏸️ useSuppliers.test.ts (0/8 tests)
- ⏸️ useVehicleCategories.test.ts (0/8 tests)
- ⏸️ useHourMeter.test.ts (0/6 tests)

### Phase 4: E2E Tests (⏸️ PENDING - Day 3-4)

**Pending:**
- ⏸️ Login flow
- ⏸️ Create ENTRADA movement
- ⏸️ Create SALIDA movement
- ⏸️ Create fuel type
- ⏸️ View dashboard
- ⏸️ Generate report

---

## Documentation

**Created:**
- ✅ TESTING_GUIDE.md (13.4KB) - Comprehensive testing guide
- ✅ ADR-006-TESTING-STRATEGY.md (this document)
- ✅ FASE2_SEGUIMIENTO.md updated

**Scripts:**
```bash
npm run test              # Run tests in watch mode
npm run test:ui           # Run tests with UI
npm run test:coverage     # Run with coverage
npm run test:e2e          # Run E2E tests
npm run test:all          # Run all tests
```

---

## Alternatives Considered

### Jest + React Testing Library

**Pros:**
- More mature ecosystem
- Larger community
- More plugins available

**Cons:**
- ❌ Slower than Vitest
- ❌ Poor ESM support
- ❌ No native Vite integration
- ❌ More configuration needed

**Decision:** Rejected in favor of Vitest

### Cypress (for E2E)

**Pros:**
- Popular in React community
- Time-travel debugging
- Good DX

**Cons:**
- ❌ Only Chromium browsers
- ❌ Slower than Playwright
- ❌ No auto-wait (more flakiness)
- ❌ No native parallelization

**Decision:** Rejected in favor of Playwright

---

## References

### Internal
- [SPRINT3_PROMPT.md](./SPRINT3_PROMPT.md)
- [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- [STORES_GUIDE.md](./STORES_GUIDE.md)
- [TYPESCRIPT_GUIDE.md](./TYPESCRIPT_GUIDE.md)

### External
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)
- [Zustand Testing](https://github.com/pmndrs/zustand#testing)

---

**Approved by:** Development Team  
**Review Date:** 2025-10-01  
**Next Review:** 2025-11-01  
**Status:** ✅ Active Implementation
