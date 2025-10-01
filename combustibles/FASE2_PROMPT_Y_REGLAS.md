# 🚀 FASE 2: MODERNIZACIÓN Y OPTIMIZACIÓN - PROMPT Y REGLAS DE ENTREGABLES

**Fecha de Inicio:** TBD  
**Referencia Fase 1:** [FASE1_RESUMEN_EJECUTIVO.md](./FASE1_RESUMEN_EJECUTIVO.md)  
**Seguimiento:** [REFACTORIZACION_SEGUIMIENTO.md](./REFACTORIZACION_SEGUIMIENTO.md)

---

## 📋 CONTEXTO Y ESTADO ACTUAL

### ✅ Lo que se completó en Fase 1

La Fase 1 estableció las bases sólidas del proyecto:

- ✅ **14 archivos obsoletos** eliminados (SQL services, migration scripts)
- ✅ **16 archivos migrados** de servicios legacy a Firebase
- ✅ **7 custom hooks** creados para encapsular lógica de negocio
- ✅ **Movimientos simplificados** a solo ENTRADA y SALIDA
- ✅ **Módulo de Productos** validado como "Tipos de Combustibles dinámicos"
- ✅ **Mantenimiento pospuesto** para fase posterior
- ✅ **0 errores de linting**
- ✅ **Documentación completa** (7 documentos, ~52 páginas)

### 📊 Arquitectura Actual

```
combustibles/
├── src/
│   ├── components/          # Componentes React
│   ├── hooks/              # 7 custom hooks (useMovements, useVehicles, etc.)
│   ├── services/           # Firebase services + legacy (deprecated)
│   ├── contexts/           # Context API (⚠️ A MIGRAR en Fase 2)
│   ├── constants/          # Constantes (algunas deprecated)
│   └── utils/              # Utilidades
├── Backend: Firebase Functions + Cloud SQL Server
└── State: Context API (CombustiblesContext - monolítico)
```

### ⚠️ Problemas Identificados para Fase 2

1. **Context API monolítico:** `CombustiblesContext` tiene demasiada responsabilidad
2. **No hay TypeScript:** Todo es JavaScript, falta type safety
3. **Tests limitados:** < 5% de cobertura
4. **Re-renders innecesarios:** Falta memoization y optimización
5. **Duplicación de lógica:** Algunos componentes duplican lógica
6. **No hay CI/CD automatizado:** Deploy manual

---

## 🎯 OBJETIVOS DE FASE 2

### Objetivo Principal
**Modernizar la arquitectura de frontend** mediante la migración a state management moderno, TypeScript, y establecimiento de una suite de tests robusta.

### Objetivos Específicos

#### 1. State Management (Prioridad: 🔴 ALTA)
- [ ] Migrar de Context API a **Zustand** o **Jotai**
- [ ] Crear stores especializados por dominio
- [ ] Eliminar `CombustiblesContext` monolítico
- [ ] Implementar persist middleware para estado offline

#### 2. TypeScript (Prioridad: 🟡 MEDIA-ALTA)
- [ ] Configurar TypeScript en el proyecto
- [ ] Migrar hooks a TypeScript (7 archivos)
- [ ] Migrar servicios Firebase a TypeScript
- [ ] Crear interfaces y types para modelos de datos
- [ ] Migrar componentes críticos gradualmente

#### 3. Testing (Prioridad: 🟡 MEDIA-ALTA)
- [ ] Configurar Vitest/Jest para unit tests
- [ ] Tests para todos los custom hooks (7 hooks)
- [ ] Tests para servicios Firebase críticos
- [ ] Tests E2E con Playwright para flujos críticos
- [ ] Objetivo: > 70% de cobertura en lógica crítica

#### 4. Performance (Prioridad: 🟢 MEDIA)
- [ ] Implementar React.memo en componentes pesados
- [ ] Optimizar re-renders con useMemo/useCallback
- [ ] Code splitting por rutas
- [ ] Lazy loading de componentes no críticos
- [ ] Optimizar bundles (< 200KB initial load)

#### 5. Developer Experience (Prioridad: 🟢 BAJA)
- [ ] Pre-commit hooks con Husky + lint-staged
- [ ] Prettier configurado
- [ ] ESLint rules más estrictas
- [ ] VSCode workspace settings
- [ ] Scripts de desarrollo mejorados

---

## 📜 REGLAS DE ENTREGABLES

### 🔴 REGLAS OBLIGATORIAS (No negociables)

#### 1. Calidad de Código

**REGLA 1.1 - Linting Sin Errores**
```bash
# DEBE pasar antes de cada commit
npm run lint
# Exit code: 0 (sin errores)
```
- ❌ **NO se acepta** código con errores de linting
- ⚠️ **Warnings:** Máximo 5 warnings permitidos en TODO el proyecto
- ✅ **Validación:** Ejecutar `npm run lint` antes de cada entrega

**REGLA 1.2 - TypeScript Strict Mode**
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```
- ❌ **NO se acepta** `any` sin justificación (comentario)
- ✅ **Usar:** Types explícitos o inference clara
- 📝 **Documentar:** Por qué se usa `any` si es necesario

**REGLA 1.3 - Tests Obligatorios**
```bash
# Archivos que DEBEN tener tests:
- hooks/*.ts        → 100% cobertura
- services/*.ts     → > 80% cobertura
- utils/*.ts        → > 70% cobertura
```
- ❌ **NO se acepta** nuevo hook sin tests
- ❌ **NO se acepta** nuevo servicio sin tests
- ✅ **Ejecutar:** `npm run test` debe pasar al 100%

#### 2. Documentación

**REGLA 2.1 - JSDoc/TSDoc Obligatorio**
```typescript
/**
 * Crear nuevo movimiento de combustible
 * 
 * @param {MovementData} data - Datos del movimiento
 * @param {string} userId - ID del usuario que crea el movimiento
 * @returns {Promise<Result<Movement>>} - Movimiento creado o error
 * @throws {ValidationError} Si los datos son inválidos
 * 
 * @example
 * ```ts
 * const result = await createMovement({
 *   type: 'entrada',
 *   quantity: 100,
 *   fuelType: 'DIESEL'
 * }, userId);
 * ```
 */
export const createMovement = async (data: MovementData, userId: string): Promise<Result<Movement>> => {
  // ...
}
```
- ✅ **Todas las funciones públicas** deben tener JSDoc/TSDoc
- ✅ **Incluir:** Descripción, @param, @returns, @throws, @example
- ❌ **NO se acepta:** Funciones sin documentación

**REGLA 2.2 - README por Módulo**
```markdown
# Cada módulo complejo debe tener su README
src/hooks/README.md          ✅ Ya existe (HOOKS_GUIDE.md)
src/stores/README.md         ⚠️ CREAR en Fase 2
src/services/README.md       ⚠️ CREAR en Fase 2
```
- ✅ **Incluir:** Propósito, uso, ejemplos, troubleshooting
- ✅ **Formato:** Markdown consistente con docs existentes

**REGLA 2.3 - Changelog de Cambios**
```markdown
# Cada entrega debe actualizar:
REFACTORIZACION_SEGUIMIENTO.md    → Cambios realizados
FASE2_SEGUIMIENTO.md              → Progreso de fase 2 (CREAR)
```
- ✅ **Fecha, descripción, archivos modificados**
- ✅ **Decisiones arquitecturales (ADR) si aplica**

#### 3. Git y Commits

**REGLA 3.1 - Formato de Commits**
```
Formato: <tipo>(<scope>): <descripción>

Tipos permitidos:
- feat:     Nueva funcionalidad
- fix:      Corrección de bug
- refactor: Refactorización sin cambio funcional
- test:     Agregar o modificar tests
- docs:     Solo documentación
- style:    Formato de código (no afecta lógica)
- perf:     Mejora de performance
- chore:    Tareas de mantenimiento

Ejemplos:
✅ feat(hooks): add useAuth hook with JWT support
✅ refactor(store): migrate CombustiblesContext to Zustand
✅ test(hooks): add unit tests for useMovements hook
✅ fix(movements): correct inventory update on ENTRADA type
❌ update files (muy vago)
❌ changes (no descriptivo)
```

**REGLA 3.2 - Pull Requests**
```markdown
# Template de PR (OBLIGATORIO)

## 📋 Descripción
Breve descripción de los cambios

## 🎯 Tipo de Cambio
- [ ] Nueva funcionalidad
- [ ] Bug fix
- [ ] Refactorización
- [ ] Documentación
- [ ] Tests

## ✅ Checklist Pre-Merge
- [ ] Linting pasa sin errores
- [ ] Tests pasan al 100%
- [ ] Documentación actualizada
- [ ] No hay console.log olvidados
- [ ] TypeScript compila sin errores
- [ ] Performance validada (si aplica)

## 📊 Impacto
- Archivos modificados: X
- Líneas agregadas: +X
- Líneas eliminadas: -X
- Cobertura de tests: X%

## 🔗 Referencias
- Issue: #123
- Documento: FASE2_SEGUIMIENTO.md
```

**REGLA 3.3 - Branches**
```
Estructura:
main                    → Producción estable
├── develop            → Desarrollo activo
│   ├── feature/       → Nuevas funcionalidades
│   ├── refactor/      → Refactorizaciones
│   ├── fix/           → Bug fixes
│   └── test/          → Trabajos de testing

Ejemplos:
✅ feature/zustand-migration
✅ refactor/typescript-hooks
✅ test/unit-tests-movements
✅ fix/inventory-update-race-condition
❌ my-changes
❌ updates
```

#### 4. Performance

**REGLA 4.1 - Bundle Size**
```
Límites máximos:
- Initial bundle:  < 200 KB (gzipped)
- Total bundle:    < 1 MB (gzipped)
- Lazy chunks:     < 50 KB cada uno
```
- ✅ **Validar:** `npm run build && npm run analyze`
- ⚠️ **Warning:** Si bundle crece > 10%
- ❌ **Bloqueante:** Si bundle > límites

**REGLA 4.2 - Lighthouse Score**
```
Scores mínimos:
- Performance:     > 90
- Accessibility:   > 95
- Best Practices:  > 90
- SEO:            > 90
```
- ✅ **Ejecutar Lighthouse** antes de merge a main
- 📝 **Documentar:** Scores en PR

**REGLA 4.3 - Re-renders**
```typescript
// Componentes críticos deben usar memoization
❌ MAL:
const MyComponent = ({ data }) => {
  const processed = expensiveCalculation(data);
  return <div>{processed}</div>;
}

✅ BIEN:
const MyComponent = React.memo(({ data }) => {
  const processed = useMemo(() => expensiveCalculation(data), [data]);
  return <div>{processed}</div>;
});
```
- ✅ **Usar React DevTools Profiler** para validar
- 📝 **Documentar:** Optimizaciones realizadas

#### 5. Testing

**REGLA 5.1 - Cobertura Mínima**
```
Objetivos por tipo de archivo:
- hooks/*.ts:         100% cobertura
- services/*.ts:      > 80% cobertura
- utils/*.ts:         > 70% cobertura
- components/*.tsx:   > 60% cobertura
```
- ✅ **Ejecutar:** `npm run test:coverage`
- ❌ **Bloqueante:** Si baja cobertura de archivos críticos

**REGLA 5.2 - Tests por Hook**
```typescript
// TEMPLATE de test para hooks
describe('useMovements', () => {
  // 1. Setup y estado inicial
  it('should initialize with empty state', () => { });
  
  // 2. Casos de éxito
  it('should fetch movements successfully', async () => { });
  it('should create movement with valid data', async () => { });
  
  // 3. Casos de error
  it('should handle fetch error gracefully', async () => { });
  it('should validate data before creating', async () => { });
  
  // 4. Edge cases
  it('should handle empty response', async () => { });
  it('should handle concurrent requests', async () => { });
});
```
- ✅ **Mínimo 4 tests** por hook (happy path, error, edge cases)
- ✅ **Incluir:** Tests de loading, error, success states

**REGLA 5.3 - E2E Tests Críticos**
```typescript
// Flujos que DEBEN tener E2E tests:
✅ OBLIGATORIOS:
1. Login con Passkeys
2. Crear movimiento de ENTRADA
3. Crear movimiento de SALIDA
4. Crear tipo de combustible (Productos)
5. Ver dashboard con datos
6. Generar reporte básico

⚠️ RECOMENDADOS:
7. Crear vehículo
8. Registrar lectura de horómetro
9. Agregar proveedor
10. Filtrar movimientos por fecha
```

---

### 🟡 REGLAS RECOMENDADAS (Altamente sugeridas)

#### 6. Arquitectura

**REGLA 6.1 - Stores de Zustand**
```typescript
// Estructura recomendada de stores
src/stores/
├── index.ts                    # Re-export de todos los stores
├── movements.store.ts          # Store de movimientos
├── vehicles.store.ts           # Store de vehículos
├── inventory.store.ts          # Store de inventario
├── products.store.ts           # Store de productos
├── auth.store.ts               # Store de autenticación
└── ui.store.ts                 # Store de UI (modales, loading, etc.)

// Patrón de store:
interface MovementsState {
  // Estado
  movements: Movement[];
  loading: boolean;
  error: string | null;
  
  // Acciones
  fetchMovements: () => Promise<void>;
  createMovement: (data: MovementData) => Promise<Result<Movement>>;
  updateMovement: (id: string, data: Partial<MovementData>) => Promise<void>;
  deleteMovement: (id: string) => Promise<void>;
  
  // Selectores
  getMovementById: (id: string) => Movement | undefined;
  getMovementsByType: (type: MovementType) => Movement[];
}
```

**REGLA 6.2 - Separación de Concerns**
```
Responsabilidades claras:
- Stores:        Estado global + acciones
- Hooks:         Lógica de negocio + side effects
- Services:      Comunicación con Firebase/API
- Components:    Solo UI y presentación
- Utils:         Funciones puras sin side effects
```

**REGLA 6.3 - No Duplicar Lógica**
```typescript
// ❌ MAL: Lógica duplicada en componentes
// ComponentA.tsx
const total = movements.reduce((sum, m) => sum + m.quantity, 0);

// ComponentB.tsx
const total = movements.reduce((sum, m) => sum + m.quantity, 0);

// ✅ BIEN: Lógica en selector o util
// utils/movements.ts
export const calculateTotalQuantity = (movements: Movement[]) => {
  return movements.reduce((sum, m) => sum + m.quantity, 0);
};

// Ambos componentes:
const total = calculateTotalQuantity(movements);
```

#### 7. TypeScript

**REGLA 7.1 - Modelos de Datos**
```typescript
// src/types/models.ts - Centralizar tipos
export interface Movement {
  id: string;
  type: 'entrada' | 'salida';
  fuelType: string;
  quantity: number;
  unitPrice: number;
  location: string;
  vehicleId?: string;
  supplierName?: string;
  description?: string;
  status: 'pendiente' | 'completado' | 'cancelado';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type MovementType = Movement['type'];
export type MovementStatus = Movement['status'];

export interface MovementData extends Omit<Movement, 'id' | 'createdAt' | 'updatedAt'> {}
```

**REGLA 7.2 - Result Type Pattern**
```typescript
// Patrón para operaciones que pueden fallar
export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Uso:
const createMovement = async (data: MovementData): Promise<Result<Movement>> => {
  try {
    const movement = await api.create(data);
    return { success: true, data: movement };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

**REGLA 7.3 - Enums vs Union Types**
```typescript
// ✅ PREFERIR: Union types (más flexible)
export type MovementType = 'entrada' | 'salida';
export type FuelUnit = 'gal' | 'L' | 'barrel';

// ⚠️ USAR CON CUIDADO: Enums (solo si necesario)
export enum UserRole {
  Admin = 'admin',
  Supervisor = 'supervisor',
  Operator = 'operator',
}
```

---

### 🟢 REGLAS OPCIONALES (Mejoran la calidad)

#### 8. Code Style

**REGLA 8.1 - Prettier Config**
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

**REGLA 8.2 - Ordenamiento de Imports**
```typescript
// 1. Externos (React, librerías)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Stores/Hooks internos
import { useMovements } from '@/hooks/useMovements';
import { useMovementsStore } from '@/stores/movements.store';

// 3. Components
import { Button, Input, Modal } from '@/components/shared';

// 4. Utils/Constants/Types
import { formatCurrency, formatDate } from '@/utils/formatters';
import { MOVEMENT_TYPES } from '@/constants/movements';
import type { Movement, MovementData } from '@/types/models';

// 5. Styles
import './MyComponent.css';
```

**REGLA 8.3 - Naming Conventions**
```typescript
// Componentes: PascalCase
export const MovementCard = () => { };

// Hooks: camelCase con 'use' prefix
export const useMovements = () => { };

// Types/Interfaces: PascalCase
export interface MovementData { }
export type Result<T> = { };

// Constants: SCREAMING_SNAKE_CASE
export const MAX_QUANTITY = 10000;
export const MOVEMENT_TYPES = { };

// Functions: camelCase
export const calculateTotal = () => { };

// Files:
// - Components: PascalCase.tsx
// - Hooks: camelCase.ts
// - Utils: camelCase.ts
// - Types: camelCase.types.ts
// - Tests: [filename].test.ts
```

#### 9. Performance Optimization

**REGLA 9.1 - Lazy Loading**
```typescript
// Routes con lazy loading
import { lazy, Suspense } from 'react';

const MovementsMain = lazy(() => import('./components/Movements/MovementsMain'));
const VehiclesMain = lazy(() => import('./components/Vehicles/VehiclesMain'));

// Uso:
<Suspense fallback={<ShimmerLoader />}>
  <MovementsMain />
</Suspense>
```

**REGLA 9.2 - Virtualization**
```typescript
// Listas grandes (> 100 items) deben usar virtualization
import { useVirtualizer } from '@tanstack/react-virtual';

// ✅ Para tablas con muchos movimientos
// ✅ Para listados de vehículos extensos
```

---

## 📋 CHECKLIST DE ENTREGABLES

### Por cada Tarea Completada

```markdown
## ✅ CHECKLIST OBLIGATORIO

### Código
- [ ] Linting pasa sin errores (`npm run lint`)
- [ ] TypeScript compila sin errores (`npm run type-check`)
- [ ] Tests pasan al 100% (`npm run test`)
- [ ] No hay console.log/debugger olvidados
- [ ] No hay TODOs sin issue asociado
- [ ] Código reviewed (self-review o peer review)

### Documentación
- [ ] JSDoc/TSDoc en funciones públicas
- [ ] README actualizado si aplica
- [ ] REFACTORIZACION_SEGUIMIENTO.md actualizado
- [ ] FASE2_SEGUIMIENTO.md actualizado
- [ ] Decisiones arquitecturales documentadas (ADR)

### Tests
- [ ] Unit tests para lógica de negocio
- [ ] Integration tests si aplica
- [ ] E2E tests para flujos críticos
- [ ] Cobertura cumple objetivos
- [ ] Tests documentados (describe/it descriptivos)

### Git
- [ ] Commits siguen formato convencional
- [ ] PR tiene descripción completa
- [ ] Branch con nombre descriptivo
- [ ] No hay conflictos con develop/main
- [ ] Squash commits si hay muchos WIP

### Performance
- [ ] Bundle size validado
- [ ] Lighthouse score validado (> 90)
- [ ] No hay memory leaks (React DevTools)
- [ ] Re-renders optimizados en componentes críticos

### Deploy (si aplica)
- [ ] Build de producción exitoso
- [ ] Funcionalidad probada en staging
- [ ] Plan de rollback documentado
- [ ] Stakeholders notificados
```

---

## 🎯 PLAN DE TRABAJO FASE 2

### Sprint 1: State Management (Semana 1-2)

**Objetivo:** Migrar de Context API a Zustand

**Tareas:**
1. [ ] Instalar y configurar Zustand
2. [ ] Crear store de autenticación (`auth.store.ts`)
3. [ ] Crear store de movimientos (`movements.store.ts`)
4. [ ] Crear store de vehículos (`vehicles.store.ts`)
5. [ ] Crear store de inventario (`inventory.store.ts`)
6. [ ] Migrar componentes críticos a nuevos stores
7. [ ] Eliminar `CombustiblesContext`
8. [ ] Tests para stores (100% cobertura)
9. [ ] Documentar decisión arquitectural (ADR)

**Entregables:**
- ✅ 5 stores funcionales
- ✅ Tests con 100% cobertura
- ✅ `STORES_GUIDE.md` documentación
- ✅ ADR de migración a Zustand
- ✅ 0 errores de linting

### Sprint 2: TypeScript (Semana 3-4)

**Objetivo:** Migrar hooks y servicios críticos a TypeScript

**Tareas:**
1. [ ] Configurar TypeScript (`tsconfig.json`)
2. [ ] Crear tipos de modelos (`src/types/models.ts`)
3. [ ] Migrar 7 hooks a TypeScript
4. [ ] Migrar servicios Firebase a TypeScript
5. [ ] Migrar stores a TypeScript
6. [ ] Agregar tipos a componentes críticos
7. [ ] Configurar type-checking en CI
8. [ ] Documentar convenciones de tipos

**Entregables:**
- ✅ TypeScript configurado (strict mode)
- ✅ 7 hooks migrados a TS
- ✅ Servicios Firebase en TS
- ✅ `src/types/` con modelos completos
- ✅ `npm run type-check` sin errores

### Sprint 3: Testing (Semana 5-6)

**Objetivo:** Implementar suite de tests completa

**Tareas:**
1. [ ] Configurar Vitest/Jest
2. [ ] Tests unitarios para 7 hooks (100% cobertura)
3. [ ] Tests para servicios Firebase (> 80%)
4. [ ] Tests para utils (> 70%)
5. [ ] Configurar Playwright para E2E
6. [ ] Implementar 6 tests E2E críticos
7. [ ] Configurar coverage reports
8. [ ] CI/CD con tests automáticos

**Entregables:**
- ✅ 50+ unit tests
- ✅ 6 E2E tests de flujos críticos
- ✅ Cobertura > 70% en archivos críticos
- ✅ CI ejecutando tests automáticamente
- ✅ Coverage report en PR

### Sprint 4: Performance (Semana 7)

**Objetivo:** Optimizar performance de la aplicación

**Tareas:**
1. [ ] Audit de performance (Lighthouse)
2. [ ] Implementar React.memo en componentes pesados
3. [ ] Code splitting por rutas
4. [ ] Lazy loading de módulos no críticos
5. [ ] Optimizar bundle size
6. [ ] Implementar virtualization en tablas grandes
7. [ ] Optimizar imágenes y assets
8. [ ] Validar mejoras con métricas

**Entregables:**
- ✅ Lighthouse score > 90
- ✅ Bundle size < 200KB (initial)
- ✅ Virtualization en tablas > 100 items
- ✅ Reporte de mejoras de performance

---

## 📊 DEFINICIÓN DE "TERMINADO" (Definition of Done)

### Una tarea está TERMINADA cuando:

1. ✅ **Código completo** y funcional
2. ✅ **Tests escritos** y pasando al 100%
3. ✅ **Documentación** actualizada
4. ✅ **Linting** sin errores
5. ✅ **TypeScript** compila sin errores
6. ✅ **PR aprobado** (si aplica)
7. ✅ **Merged** a develop/main
8. ✅ **Desplegado** en staging (si aplica)
9. ✅ **Validado** por stakeholder (si aplica)
10. ✅ **Seguimiento actualizado** (markdown docs)

### Una historia está TERMINADA cuando:

1. ✅ Todas las tareas completadas (Definition of Done)
2. ✅ **E2E test** del flujo completo pasando
3. ✅ **Performance** validada (no regresión)
4. ✅ **Accesibilidad** validada (a11y)
5. ✅ **Documentación de usuario** actualizada (si aplica)
6. ✅ **Demo** realizada al equipo
7. ✅ **Retrospectiva** documentada

---

## 🚨 CRITERIOS DE BLOQUEO

### ❌ NO se puede hacer merge si:

1. **Linting tiene errores** (exit code != 0)
2. **Tests fallan** (cualquier test rojo)
3. **TypeScript tiene errores** de compilación
4. **Cobertura baja** de tests en archivos críticos
5. **Bundle size** excede límites (> 200KB initial)
6. **Performance regresiona** (Lighthouse < 90)
7. **Conflictos sin resolver** en Git
8. **Documentación falta** (README, JSDoc, etc.)
9. **PR sin descripción** o checklist incompleto
10. **Breaking changes** sin plan de migración

### ⚠️ WARNING (requiere justificación):

1. **Warnings de linting** (máx 5 en total)
2. **TypeScript `any`** sin comentario explicativo
3. **Tests skip/todo** sin issue asociado
4. **Cobertura < objetivo** (pero con plan de mejora)
5. **Bundle size crece** > 10% (pero < límite)
6. **Performance baja** poco (pero > 85)

---

## 📞 COMUNICACIÓN Y REPORTES

### Reportes Requeridos

**Daily:**
- Actualizar FASE2_SEGUIMIENTO.md con progreso
- Commits descriptivos en Git

**Semanal:**
- Reporte de progreso (qué se completó, qué sigue)
- Métricas: tests, cobertura, performance
- Blockers y riesgos identificados

**Al finalizar Sprint:**
- Demo de funcionalidades completadas
- Retrospectiva (qué funcionó, qué mejorar)
- Actualizar documentación maestra

### Canales

- **Issues:** Para tracking de bugs y features
- **PRs:** Para code review y discusión técnica
- **Docs:** Para decisiones arquitecturales y guías
- **Git commits:** Para historial detallado

---

## 🎓 RECURSOS Y REFERENCIAS

### Documentación Existente

1. **[FASE1_RESUMEN_EJECUTIVO.md](./FASE1_RESUMEN_EJECUTIVO.md)** - Lo que se hizo en Fase 1
2. **[REFACTORIZACION_SEGUIMIENTO.md](./REFACTORIZACION_SEGUIMIENTO.md)** - Tracking general
3. **[HOOKS_GUIDE.md](./HOOKS_GUIDE.md)** - Guía de custom hooks
4. **[MODULO_PRODUCTOS_GUIA.md](./MODULO_PRODUCTOS_GUIA.md)** - Guía del módulo de productos
5. **[MIGRACION_SERVICIOS_LEGACY.md](./MIGRACION_SERVICIOS_LEGACY.md)** - Detalles de migración

### Recursos Técnicos

- **Zustand:** https://zustand-demo.pmnd.rs/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Vitest:** https://vitest.dev/
- **Playwright:** https://playwright.dev/
- **React Performance:** https://react.dev/learn/render-and-commit

---

## ✅ VALIDACIÓN FINAL

### Antes de considerar Fase 2 completa:

```markdown
## CHECKLIST FINAL DE FASE 2

### State Management
- [ ] CombustiblesContext eliminado
- [ ] 5+ stores de Zustand funcionales
- [ ] Persist middleware configurado
- [ ] Tests de stores al 100%

### TypeScript
- [ ] tsconfig.json configurado (strict)
- [ ] Todos los hooks en TS
- [ ] Servicios Firebase en TS
- [ ] Modelos de datos definidos
- [ ] npm run type-check sin errores

### Testing
- [ ] > 50 unit tests implementados
- [ ] Cobertura > 70% en críticos
- [ ] 6 E2E tests de flujos clave
- [ ] CI ejecutando tests automáticos

### Performance
- [ ] Lighthouse > 90 en todas las métricas
- [ ] Bundle < 200KB initial
- [ ] Code splitting implementado
- [ ] Virtualization en tablas grandes

### Documentación
- [ ] FASE2_SEGUIMIENTO.md completo
- [ ] STORES_GUIDE.md creado
- [ ] ADRs documentados
- [ ] README actualizado

### Calidad
- [ ] 0 errores de linting
- [ ] 0 errores de TypeScript
- [ ] Todos los tests verdes
- [ ] Performance validada

### Deploy
- [ ] Build de producción exitoso
- [ ] Staging validado
- [ ] Plan de rollback listo
- [ ] FASE2_RESUMEN_EJECUTIVO.md creado
```

---

**Creado:** 30 de septiembre de 2025  
**Para:** Fase 2 de Refactorización Combustibles  
**Responsable:** Development Team / AI Assistant  

**Mantra de Fase 2:**  
> "Code with confidence: Types, Tests, and Performance"

---

## 🚀 PROMPT PARA INICIAR FASE 2

```markdown
# PROMPT PARA AI ASSISTANT

Contexto:
Estoy trabajando en la Fase 2 de refactorización del proyecto Combustibles Forestech.

La Fase 1 está COMPLETADA (ver FASE1_RESUMEN_EJECUTIVO.md) con:
- 16 archivos migrados a Firebase
- 7 custom hooks creados
- Movimientos simplificados a ENTRADA/SALIDA
- 0 errores de linting

Fase 2 Objetivos:
1. Migrar de Context API a Zustand (state management)
2. Implementar TypeScript en hooks y servicios
3. Crear suite de tests (> 70% cobertura)
4. Optimizar performance (Lighthouse > 90)

Reglas OBLIGATORIAS:
- Linting debe pasar sin errores
- TypeScript strict mode
- Tests obligatorios para hooks y servicios
- JSDoc en todas las funciones públicas
- Commits en formato convencional
- Actualizar FASE2_SEGUIMIENTO.md con cambios

Documentos clave:
- FASE2_PROMPT_Y_REGLAS.md (este archivo - LEER COMPLETO)
- FASE1_RESUMEN_EJECUTIVO.md (contexto)
- HOOKS_GUIDE.md (hooks existentes)
- REFACTORIZACION_SEGUIMIENTO.md (tracking)

IMPORTANTE:
- NO eliminar código sin consultar
- SI tienes dudas, pregunta antes de hacer cambios grandes
- Ejecutar `npm run lint` después de cada cambio
- Documentar TODAS las decisiones arquitecturales

¿Listo para empezar? Por favor confirma que has leído:
1. Este archivo completo (FASE2_PROMPT_Y_REGLAS.md)
2. FASE1_RESUMEN_EJECUTIVO.md
3. Entiendes las reglas obligatorias

Luego indícame por dónde quieres empezar (recomiendo Sprint 1: State Management).
```

