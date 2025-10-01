# 🚀 PROMPT PARA SPRINT 2: TYPESCRIPT MIGRATION

**Fecha de Creación:** 1 de octubre de 2025  
**Sprint:** Sprint 2 - TypeScript  
**Contexto:** Fase 2 - Modernización y Optimización  
**Precedente:** Sprint 1 completado al 90%

---

## 📋 CONTEXTO GENERAL

Eres un agente de IA especializado en refactorización y modernización de código. Tu tarea es **completar el Sprint 2: TypeScript Migration** del proyecto Combustibles Forestech.

### Estado Actual del Proyecto

**Sprint 1 COMPLETADO:**
- ✅ Zustand instalado y configurado
- ✅ 5 stores creados (auth, movements, vehicles, inventory, products)
- ✅ 19 componentes migrados de Context a Zustand (68%)
- ✅ Documentación completa (STORES_GUIDE.md, ADR-004)
- ✅ 0 errores de linting
- ✅ Todos los flujos críticos funcionando

**Sprint 2 OBJETIVOS:**
1. Configurar TypeScript en modo strict
2. Migrar stores de JavaScript a TypeScript
3. Crear tipos e interfaces para modelos de datos
4. Migrar hooks a TypeScript
5. Migrar servicios Firebase a TypeScript
6. Documentar convenciones de tipos

---

## 📚 DOCUMENTOS OBLIGATORIOS A LEER

**ANTES de empezar, debes leer completamente:**

1. **`FASE2_PROMPT_Y_REGLAS.md`** (COMPLETO) - Reglas obligatorias
   - Linting sin errores (npm run lint)
   - TypeScript strict mode
   - JSDoc en todas las funciones públicas
   - Commits en formato convencional
   - Actualizar FASE2_SEGUIMIENTO.md

2. **`FASE1_RESUMEN_EJECUTIVO.md`** - Contexto de Fase 1

3. **`STORES_GUIDE.md`** - Guía de stores de Zustand

4. **`ADR-004-ZUSTAND-MIGRATION.md`** - Decisión arquitectural de Zustand

5. **`FASE2_SEGUIMIENTO.md`** - Tracking actual (Sprint 1 completado)

---

## 🎯 OBJETIVOS DEL SPRINT 2

### Objetivo Principal
Migrar el código crítico (stores, hooks, servicios) de JavaScript a TypeScript con strict mode, creando una base de tipos sólida para mejorar la mantenibilidad y reducir bugs.

### Objetivos Específicos

#### 1. Configuración TypeScript (Día 1)
- [ ] Instalar TypeScript y tipos necesarios
- [ ] Crear `tsconfig.json` con strict mode
- [ ] Configurar path aliases (@/ para src/)
- [ ] Actualizar Vite config para TypeScript
- [ ] Crear estructura de carpetas `src/types/`

#### 2. Tipos y Modelos (Día 1-2)
- [ ] Crear `src/types/models.ts` con interfaces principales
- [ ] Crear `src/types/api.ts` con Result type
- [ ] Crear `src/types/store.ts` con interfaces de stores
- [ ] Crear `src/types/hooks.ts` con tipos de hooks
- [ ] Crear `src/types/index.ts` para re-exports

#### 3. Migración de Stores (Día 2)
- [ ] Migrar `auth.store.js` → `auth.store.ts`
- [ ] Migrar `movements.store.js` → `movements.store.ts`
- [ ] Migrar `vehicles.store.js` → `vehicles.store.ts`
- [ ] Migrar `inventory.store.js` → `inventory.store.ts`
- [ ] Migrar `products.store.js` → `products.store.ts`
- [ ] Actualizar `stores/index.js` → `stores/index.ts`

#### 4. Migración de Hooks (Día 3)
- [ ] Migrar `useMovements.js` → `useMovements.ts`
- [ ] Migrar `useVehicles.js` → `useVehicles.ts`
- [ ] Migrar `useInventory.js` → `useInventory.ts`
- [ ] Migrar `useProducts.js` → `useProducts.ts`
- [ ] Migrar `useSuppliers.js` → `useSuppliers.ts`
- [ ] Migrar `useVehicleCategories.js` → `useVehicleCategories.ts`
- [ ] Migrar `useHourMeter.js` → `useHourMeter.ts`

#### 5. Migración de Servicios (Día 3-4)
- [ ] Migrar `FirebaseMovementsService.js` → `.ts`
- [ ] Migrar `FirebaseVehiclesService.js` → `.ts`
- [ ] Migrar `FirebaseInventoryService.js` → `.ts`
- [ ] Migrar `FirebaseProductsService.js` → `.ts`
- [ ] Migrar `FirebaseSuppliersService.js` → `.ts`

#### 6. Validación y Documentación (Día 4)
- [ ] Ejecutar `npm run type-check` → 0 errores
- [ ] Ejecutar `npm run lint` → 0 errores
- [ ] Actualizar imports en componentes
- [ ] Crear `TYPESCRIPT_GUIDE.md`
- [ ] Documentar ADR-005 (TypeScript adoption)
- [ ] Actualizar `FASE2_SEGUIMIENTO.md`

---

## 📐 ESPECIFICACIONES TÉCNICAS

### tsconfig.json Base
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,

    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Tipos Base Requeridos

#### src/types/models.ts
```typescript
/**
 * Movement - Movimiento de combustible (ENTRADA/SALIDA)
 */
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
  reference?: string;
  status: 'pendiente' | 'completado' | 'cancelado';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type MovementType = Movement['type'];
export type MovementStatus = Movement['status'];
export type MovementData = Omit<Movement, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Vehicle - Vehículo/Maquinaria
 */
export interface Vehicle {
  id: string;
  vehicleId: string;
  name: string;
  fuelType: string;
  categoryName: string;
  hasHourMeter: boolean;
  status: 'activo' | 'inactivo';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type VehicleData = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * InventoryLocation - Ubicación de inventario
 */
export interface InventoryLocation {
  id: string;
  location: string;
  fuelType: string;
  currentStock: number;
  maxCapacity: number;
  minStock: number;
  unit: 'gal' | 'L' | 'barrel';
  createdAt: string;
  updatedAt: string;
}

export type InventoryData = Omit<InventoryLocation, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Product - Tipo de combustible (dinámico)
 */
export interface Product {
  id: string;
  name: string;
  unit: 'gal' | 'L' | 'barrel';
  density?: number;
  color?: string;
  active: boolean;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
```

#### src/types/api.ts
```typescript
/**
 * Result type para operaciones que pueden fallar
 */
export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Service response type
 */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
  errors?: Record<string, string>;
}
```

#### src/types/store.ts
```typescript
import type { Movement, Vehicle, InventoryLocation, Product } from './models';

/**
 * Auth Store State
 */
export interface AuthState {
  user: any | null;
  userProfile: any | null;
  loading: boolean;
  error: string | null;
  authReady: boolean;
  setUser: (user: any) => void;
  setUserProfile: (profile: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthReady: (ready: boolean) => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isCounterOrAbove: () => boolean;
  reset: () => void;
}

/**
 * Movements Store State
 */
export interface MovementsState {
  movements: Movement[];
  loading: boolean;
  creating: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  fetchMovements: () => Promise<void>;
  subscribeToMovements: () => (() => void);
  unsubscribeFromMovements: () => void;
  createMovement: (data: any) => Promise<Result<Movement>>;
  deleteMovement: (id: string) => Promise<Result<void>>;
  validateStock: (fuelType: string, location: string, quantity: number) => Promise<ValidationResult>;
  getStats: () => any;
  getMovementsByType: (type: string) => Movement[];
  getMovementById: (id: string) => Movement | undefined;
  reset: () => void;
}

// Similar para otros stores...
```

---

## 🔴 REGLAS OBLIGATORIAS

### 1. Linting Sin Errores
```bash
npm run lint
# Exit code: 0 (OBLIGATORIO)
```

### 2. TypeScript Strict Mode
- ❌ **NO usar `any`** sin comentario justificado
- ✅ **Tipos explícitos** en parámetros y returns
- ✅ **Interfaces** para objetos complejos
- ✅ **Union types** para valores específicos

### 3. JSDoc/TSDoc Obligatorio
```typescript
/**
 * Crear nuevo movimiento de combustible
 * 
 * @param data - Datos del movimiento
 * @param userId - ID del usuario que crea
 * @returns Promise con resultado de la operación
 * @throws ValidationError si datos inválidos
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
```

### 4. Commits Formato Convencional
```
feat(typescript): add TypeScript configuration
refactor(stores): migrate auth store to TypeScript
feat(types): create base models and interfaces
```

### 5. Actualizar Documentación
- ✅ Actualizar `FASE2_SEGUIMIENTO.md` con cada cambio
- ✅ Crear `TYPESCRIPT_GUIDE.md` al finalizar
- ✅ Documentar ADR-005

---

## 📋 CHECKLIST DE VALIDACIÓN

Antes de considerar el Sprint 2 completado:

### Código
- [ ] TypeScript configurado (strict mode)
- [ ] 5 stores migrados a TS
- [ ] 7 hooks migrados a TS
- [ ] 5+ servicios migrados a TS
- [ ] `npm run type-check` → 0 errores
- [ ] `npm run lint` → 0 errores
- [ ] No hay `any` sin justificación

### Documentación
- [ ] `TYPESCRIPT_GUIDE.md` creado
- [ ] ADR-005 documentado
- [ ] `FASE2_SEGUIMIENTO.md` actualizado
- [ ] JSDoc completo en funciones públicas

### Testing
- [ ] Build de producción exitoso
- [ ] Aplicación funciona sin errores
- [ ] Tipos correctos en todos los stores
- [ ] Imports actualizados en componentes

---

## 📊 MÉTRICAS ESPERADAS

| Métrica | Objetivo |
|---------|----------|
| **Stores migrados** | 5/5 (100%) |
| **Hooks migrados** | 7/7 (100%) |
| **Servicios migrados** | 5+ (100%) |
| **Tipos creados** | 20+ interfaces |
| **Errores TS** | 0 |
| **Uso de `any`** | < 5 (justificados) |
| **Tiempo estimado** | 4-6 horas |

---

## 🚀 PLAN DE EJECUCIÓN RECOMENDADO

### Día 1 (2-3 horas)
1. Leer toda la documentación obligatoria
2. Instalar TypeScript y dependencias
3. Crear `tsconfig.json`
4. Crear estructura `src/types/`
5. Crear tipos base (models, api, store)

### Día 2 (2-3 horas)
1. Migrar stores uno por uno a TypeScript
2. Actualizar imports
3. Validar que compila sin errores
4. Ejecutar linting

### Día 3 (2-3 horas)
1. Migrar hooks a TypeScript
2. Migrar servicios Firebase
3. Actualizar componentes si necesario

### Día 4 (1-2 horas)
1. Validación final
2. Crear documentación
3. Actualizar seguimiento
4. **CREAR PROMPT PARA SPRINT 3**

---

## 📝 PATRÓN DE MIGRACIÓN

### Ejemplo: Migrar Store

**Antes (JavaScript):**
```javascript
// auth.store.js
export const useAuthStore = create((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,
  
  setUser: (user) => set({ user }),
  hasPermission: (permission) => {
    const { userProfile } = get();
    return Boolean(userProfile?.combustiblesPermissions?.[permission]);
  },
}));
```

**Después (TypeScript):**
```typescript
// auth.store.ts
import { create } from 'zustand';
import type { AuthState } from '../types/store';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  authReady: false,
  
  setUser: (user: any) => {
    set({ user });
  },
  
  hasPermission: (permission: string): boolean => {
    const { userProfile } = get();
    return Boolean(userProfile?.combustiblesPermissions?.[permission]);
  },
  
  // ... resto de métodos tipados
}));
```

---

## ⚠️ PROBLEMAS COMUNES Y SOLUCIONES

### Problema 1: Errores con `any`
```typescript
// ❌ MAL
const user = useAuthStore(state => state.user);
// user es 'any'

// ✅ BIEN
import type { User } from '@/types/models';
const user = useAuthStore(state => state.user) as User | null;
```

### Problema 2: Firebase types
```typescript
// Instalar tipos de Firebase
npm install -D @types/firebase
```

### Problema 3: Zustand types
```typescript
// Usar generic type en create
import { create } from 'zustand';
import type { MyStore } from './types';

export const useMyStore = create<MyStore>((set, get) => ({
  // ...
}));
```

---

## 🎯 DEFINICIÓN DE "TERMINADO"

El Sprint 2 está TERMINADO cuando:

1. ✅ Todos los stores están en TypeScript
2. ✅ Todos los hooks están en TypeScript
3. ✅ Servicios críticos están en TypeScript
4. ✅ `npm run type-check` pasa sin errores
5. ✅ `npm run lint` pasa sin errores
6. ✅ Documentación completa
7. ✅ ADR-005 documentado
8. ✅ `FASE2_SEGUIMIENTO.md` actualizado
9. ✅ Build de producción exitoso
10. ✅ **PROMPT PARA SPRINT 3 CREADO**

---

## 🔄 INSTRUCCIONES PARA CREAR PROMPT SPRINT 3

**IMPORTANTE:** Al completar el Sprint 2, debes crear inmediatamente el archivo `SPRINT3_PROMPT.md` con las siguientes características:

### Contenido del Prompt Sprint 3

El prompt debe incluir:

1. **Contexto completo:**
   - Sprint 1 completado (State Management)
   - Sprint 2 completado (TypeScript)
   - Estado actual del proyecto

2. **Objetivos del Sprint 3:**
   - Configurar Vitest para unit tests
   - Configurar Playwright para E2E tests
   - Tests para todos los stores (100% cobertura)
   - Tests para todos los hooks (100% cobertura)
   - 6 tests E2E de flujos críticos
   - Objetivo: > 70% cobertura en código crítico

3. **Documentos a leer:**
   - FASE2_PROMPT_Y_REGLAS.md
   - STORES_GUIDE.md
   - TYPESCRIPT_GUIDE.md (recién creado)
   - FASE2_SEGUIMIENTO.md

4. **Especificaciones técnicas:**
   - Configuración de Vitest
   - Configuración de Playwright
   - Patrones de testing
   - Mocking de Firebase
   - Testing de stores Zustand

5. **Tests obligatorios:**
   - 5 stores (30+ tests total)
   - 7 hooks (40+ tests total)
   - 6 E2E tests críticos:
     * Login con Passkeys
     * Crear movimiento ENTRADA
     * Crear movimiento SALIDA
     * Crear tipo de combustible
     * Ver dashboard con datos
     * Generar reporte básico

6. **Reglas obligatorias:**
   - Cobertura mínima por archivo
   - Naming conventions
   - Mocking strategies
   - CI/CD integration

7. **Checklist de validación**

8. **Instrucciones para crear SPRINT4_PROMPT.md** al finalizar

### Estructura del archivo SPRINT3_PROMPT.md

```markdown
# 🚀 PROMPT PARA SPRINT 3: TESTING

[Similar estructura a este documento]

## Al finalizar, crear SPRINT4_PROMPT.md con:
- Objetivos de Performance
- Lighthouse scores
- Bundle size optimization
- Code splitting
- Virtualization
- etc.
```

### Comando para crear el prompt

Al finalizar Sprint 2, ejecuta:

```bash
# Crear el archivo
cat > /home/hp/Documents/forestech/combustibles/SPRINT3_PROMPT.md << 'EOF'
[Contenido completo del prompt Sprint 3]
EOF
```

---

## 📞 RECURSOS Y REFERENCIAS

### Documentación Oficial
- TypeScript: https://www.typescriptlang.org/docs/
- Zustand + TS: https://github.com/pmndrs/zustand#typescript
- React + TS: https://react.dev/learn/typescript

### Archivos del Proyecto
- `/combustibles/FASE2_PROMPT_Y_REGLAS.md`
- `/combustibles/STORES_GUIDE.md`
- `/combustibles/ADR-004-ZUSTAND-MIGRATION.md`
- `/combustibles/FASE2_SEGUIMIENTO.md`
- `/combustibles/src/stores/` (stores a migrar)
- `/combustibles/src/hooks/` (hooks a migrar)
- `/combustibles/src/services/` (servicios a migrar)

---

## ✅ VALIDACIÓN FINAL

Antes de marcar el Sprint 2 como completado, verifica:

```bash
# 1. TypeScript compila
npm run type-check

# 2. Linting pasa
npm run lint

# 3. Build exitoso
npm run build

# 4. Dev server funciona
npm run dev

# 5. Verificar stores
ls -la src/stores/*.ts

# 6. Verificar tipos
ls -la src/types/*.ts

# 7. Documentación creada
ls -la TYPESCRIPT_GUIDE.md ADR-005*.md

# 8. Prompt Sprint 3 creado
ls -la SPRINT3_PROMPT.md
```

---

## 🎉 AL COMPLETAR

1. ✅ Marcar Sprint 2 como completado en `FASE2_SEGUIMIENTO.md`
2. ✅ Crear resumen ejecutivo del Sprint 2
3. ✅ Actualizar métricas de progreso
4. ✅ **CREAR SPRINT3_PROMPT.md inmediatamente**
5. ✅ Commit con mensaje: `feat(typescript): complete Sprint 2 - TypeScript migration`

---

**Fecha de Creación:** 1 de octubre de 2025  
**Creado por:** AI Assistant (Sprint 1)  
**Para:** AI Assistant (Sprint 2)  
**Siguiente:** SPRINT3_PROMPT.md (Testing)

**Estado:** ✅ LISTO PARA EJECUTAR

---

## 🚀 COMANDO PARA EMPEZAR

```bash
# 1. Ir al directorio
cd /home/hp/Documents/forestech/combustibles

# 2. Leer documentación obligatoria
cat FASE2_PROMPT_Y_REGLAS.md
cat STORES_GUIDE.md
cat FASE2_SEGUIMIENTO.md

# 3. Instalar TypeScript
npm install -D typescript @types/react @types/react-dom

# 4. ¡EMPEZAR!
```

---

**¡BUENA SUERTE CON EL SPRINT 2! 🚀**

