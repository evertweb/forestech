# 📘 GUÍA DE TYPESCRIPT - Combustibles Forestech

**Fecha de Creación:** 1 de octubre de 2025  
**Sprint:** Sprint 2 - TypeScript Migration  
**Estado:** ✅ Fase 1 completada - Configuración y Tipos Base

---

## 📋 RESUMEN

Esta guía documenta la migración a TypeScript del proyecto Combustibles, incluyendo configuración, convenciones de tipos, y mejores prácticas.

### Estado Actual de Migración

| Categoría | Archivos Migrados | Total | Progreso |
|-----------|-------------------|-------|----------|
| **Configuración** | 3/3 | 3 | 100% ✅ |
| **Tipos Base** | 5/5 | 5 | 100% ✅ |
| **Stores** | 1/5 | 5 | 20% 🟡 |
| **Hooks** | 0/7 | 7 | 0% ⏸️ |
| **Servicios** | 0/5+ | 5+ | 0% ⏸️ |

---

## 🎯 OBJETIVOS COMPLETADOS

### ✅ Fase 1: Configuración y Tipos Base (COMPLETADO)

1. **✅ TypeScript Instalado**
   - TypeScript 5.9.3
   - @types/react 18.2.15
   - @types/react-dom 18.3.7

2. **✅ Configuración**
   - `tsconfig.json` - Configuración strict mode
   - `tsconfig.node.json` - Config para Vite
   - `src/vite-env.d.ts` - Tipos de environment
   - Script `npm run type-check` configurado

3. **✅ Estructura de Tipos**
   ```
   src/types/
   ├── models.ts      ✅ (30+ interfaces)
   ├── api.ts         ✅ (Result types, validations)
   ├── store.ts       ✅ (Store interfaces)
   ├── hooks.ts       ✅ (Hook return types)
   └── index.ts       ✅ (Re-exports centralizados)
   ```

4. **✅ Migración Inicial**
   - `auth.store.ts` - ✅ Migrado y funcionando
   - Linting: 0 errores ✅
   - TypeCheck: 0 errores ✅

---

## 📐 CONFIGURACIÓN TYPESCRIPT

### tsconfig.json

El proyecto usa TypeScript en **strict mode** con las siguientes configuraciones clave:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "jsx": "react-jsx",
    
    /* Strict Mode - TODAS activadas */
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    /* Linting adicional */
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Notas importantes:**
- ❌ **NO usar `any`** sin comentario justificado
- ✅ **Todos los parámetros** deben tener tipos explícitos
- ✅ **Todas las funciones** deben declarar su return type
- ✅ **Null/undefined** deben manejarse explícitamente

---

## 🏗️ TIPOS PRINCIPALES

### 1. Modelos de Datos (`models.ts`)

#### Movement - Movimiento de Combustible
```typescript
export interface Movement {
  id: string;
  type: 'entrada' | 'salida';  // Union type (no enum)
  fuelType: string;
  quantity: number;
  unitPrice: number;
  location: string;
  vehicleId?: string;           // Optional
  supplierName?: string;
  description?: string;
  reference?: string;
  status: 'pendiente' | 'completado' | 'cancelado';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Data type (sin campos auto-generados)
export type MovementData = Omit<Movement, 'id' | 'createdAt' | 'updatedAt'>;

// Type aliases para valores específicos
export type MovementType = Movement['type'];
export type MovementStatus = Movement['status'];
```

#### Vehicle - Vehículo/Maquinaria
```typescript
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
```

#### Otros modelos disponibles:
- `InventoryLocation` - Ubicaciones de inventario
- `Product` - Tipos de combustible
- `Supplier` - Proveedores
- `VehicleCategory` - Categorías de vehículos
- `HourMeterReading` - Lecturas de horómetro
- `UserProfile` - Perfil de usuario
- `FirebaseUser` - Usuario de Firebase Auth

### 2. Tipos de API (`api.ts`)

#### Result Type - Patrón para operaciones que pueden fallar
```typescript
export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Uso:
async function createMovement(data: MovementData): Promise<Result<Movement>> {
  try {
    const movement = await api.create(data);
    return { success: true, data: movement };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Consumir:
const result = await createMovement(data);
if (result.success) {
  console.log('Creado:', result.data.id);
} else {
  console.error('Error:', result.error);
}
```

#### ValidationResult - Para validaciones
```typescript
export interface ValidationResult {
  valid: boolean;
  message?: string;
  errors?: Record<string, string>;
}

// Uso:
const validation = await validateStock('DIESEL', 'Bodega 1', 100);
if (!validation.valid) {
  alert(validation.message);
}
```

#### ErrorCode - Enum para códigos de error
```typescript
export enum ErrorCode {
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  INVALID_DATA = 'INVALID_DATA',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  NOT_FOUND = 'NOT_FOUND',
  DATABASE_ERROR = 'DATABASE_ERROR',
  // ... más códigos
}
```

### 3. Tipos de Stores (`store.ts`)

Interfaces para los 5 stores de Zustand:

```typescript
export interface AuthState {
  // Estado
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  authReady: boolean;
  
  // Acciones
  setUser: (user: FirebaseUser | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  reset: () => void;
}

// Similar para:
// - MovementsState
// - VehiclesState
// - InventoryState
// - ProductsState
```

### 4. Tipos de Hooks (`hooks.ts`)

Return types para custom hooks:

```typescript
export interface UseMovementsReturn {
  movements: Movement[];
  loading: boolean;
  creating: boolean;
  error: string | null;
  
  fetchMovements: () => Promise<void>;
  createMovement: (data: Partial<Movement>) => Promise<Result<Movement>>;
  deleteMovement: (id: string) => Promise<Result<void>>;
  // ... más métodos
}

// Uso:
function useMovements(): UseMovementsReturn {
  // Implementation
}
```

---

## 📝 CONVENCIONES DE CÓDIGO

### 1. Imports

```typescript
// 1. Externos (React, librerías)
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// 2. Types (siempre con 'type' keyword)
import type { AuthState } from '../types/store';
import type { FirebaseUser, UserProfile } from '../types/models';

// 3. Servicios/Utils internos
import FirebaseService from '../services/FirebaseService';
```

### 2. Funciones con JSDoc/TSDoc

```typescript
/**
 * Create a new fuel movement
 * 
 * @param data - Movement data without auto-generated fields
 * @param userId - ID of the user creating the movement
 * @returns Promise resolving to Result with created Movement or error
 * @throws Never throws - errors are returned in Result type
 * 
 * @example
 * ```ts
 * const result = await createMovement({
 *   type: 'entrada',
 *   fuelType: 'DIESEL',
 *   quantity: 100,
 *   location: 'Bodega 1',
 *   unitPrice: 12.50,
 *   status: 'completado',
 *   createdBy: userId
 * }, userId);
 * 
 * if (result.success) {
 *   console.log('Movement created:', result.data.id);
 * }
 * ```
 */
async function createMovement(
  data: MovementData,
  userId: string
): Promise<Result<Movement>> {
  // Implementation
}
```

### 3. Union Types vs Enums

**✅ PREFERIR: Union Types** (más flexible)
```typescript
export type MovementType = 'entrada' | 'salida';
export type FuelUnit = 'gal' | 'L' | 'barrel';
export type UserRole = 'admin' | 'supervisor' | 'contador' | 'operador';
```

**⚠️ USAR CON CUIDADO: Enums** (solo si necesario)
```typescript
// Solo usar para códigos que necesitan ser exportados y usados en múltiples lugares
export enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  INVALID_DATA = 'INVALID_DATA',
}
```

### 4. Optional vs Undefined vs Null

```typescript
// ✅ BIEN: Optional properties con ?
interface Movement {
  id: string;
  vehicleId?: string;  // Puede no existir en el objeto
  description?: string;
}

// ✅ BIEN: Null para valores que se inicializan más tarde
interface AuthState {
  user: FirebaseUser | null;  // Explícitamente null hasta que se autentica
  error: string | null;        // null cuando no hay error
}

// ❌ MAL: Mezclar undefined implícito y null
interface BadExample {
  user: FirebaseUser | null | undefined;  // Redundante
}
```

### 5. Tipos Utilitarios de TypeScript

```typescript
// Omit - Remover propiedades
export type MovementData = Omit<Movement, 'id' | 'createdAt' | 'updatedAt'>;

// Partial - Todas las propiedades opcionales (útil para updates)
function updateVehicle(id: string, data: Partial<Vehicle>) {
  // Solo se pasan las propiedades que se quieren actualizar
}

// Pick - Seleccionar solo algunas propiedades
type MovementSummary = Pick<Movement, 'id' | 'type' | 'quantity'>;

// Record - Objeto con keys y values específicos
type PermissionsMap = Record<string, boolean>;
```

---

## 🎯 PATRONES DE MIGRACIÓN

### Patrón 1: Migrar Store de JS a TS

**Antes (JavaScript):**
```javascript
// auth.store.js
import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  user: null,
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
import type { FirebaseUser, UserProfile } from '../types/models';

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  authReady: false,
  
  setUser: (user: FirebaseUser | null) => {
    set({ user });
  },
  
  hasPermission: (permission: string): boolean => {
    const { userProfile } = get();
    return Boolean(userProfile?.combustiblesPermissions?.[permission]);
  },
  
  // ... resto de métodos
}));
```

### Patrón 2: Migrar Hook de JS a TS

**Antes (JavaScript):**
```javascript
// useMovements.js
export function useMovements() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const fetchMovements = async () => {
    setLoading(true);
    const result = await service.getAll();
    setMovements(result);
    setLoading(false);
  };
  
  return { movements, loading, fetchMovements };
}
```

**Después (TypeScript):**
```typescript
// useMovements.ts
import type { UseMovementsReturn } from '../types/hooks';
import type { Movement } from '../types/models';

export function useMovements(): UseMovementsReturn {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const fetchMovements = async (): Promise<void> => {
    setLoading(true);
    const result = await service.getAll();
    setMovements(result);
    setLoading(false);
  };
  
  return { movements, loading, fetchMovements };
}
```

### Patrón 3: Migrar Servicio de JS a TS

**Antes (JavaScript):**
```javascript
// FirebaseMovementsService.js
class FirebaseMovementsService {
  async getAllMovements() {
    const snapshot = await getDocs(collection(db, 'movements'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
```

**Después (TypeScript):**
```typescript
// FirebaseMovementsService.ts
import type { Movement } from '../types/models';
import type { Result } from '../types/api';

class FirebaseMovementsService {
  async getAllMovements(): Promise<Result<Movement[]>> {
    try {
      const snapshot = await getDocs(collection(db, 'movements'));
      const movements = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Movement));
      
      return { success: true, data: movements };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

---

## ✅ VALIDACIONES

### Scripts Disponibles

```bash
# Type checking (NO compila, solo verifica tipos)
npm run type-check

# Linting (código JavaScript/TypeScript)
npm run lint

# Ambos a la vez
npm run type-check && npm run lint
```

### Pre-commit Checklist

Antes de cada commit:
- [ ] `npm run type-check` → 0 errores
- [ ] `npm run lint` → 0 errores
- [ ] No hay `any` sin comentario justificado
- [ ] Todos los parámetros tienen tipos
- [ ] Todas las funciones públicas tienen JSDoc/TSDoc
- [ ] Los imports de tipos usan `import type`

---

## 🚫 ERRORES COMUNES Y SOLUCIONES

### Error 1: `any` implícito

```typescript
// ❌ MAL
function processData(data) {  // Parameter 'data' implicitly has an 'any' type
  return data.value;
}

// ✅ BIEN
function processData(data: { value: number }) {
  return data.value;
}
```

### Error 2: Null/undefined no manejado

```typescript
// ❌ MAL
function getEmail(user: FirebaseUser) {
  return user.email.toLowerCase();  // Object is possibly 'null'
}

// ✅ BIEN - Option 1: Optional chaining
function getEmail(user: FirebaseUser) {
  return user.email?.toLowerCase() || 'No email';
}

// ✅ BIEN - Option 2: Type guard
function getEmail(user: FirebaseUser) {
  if (!user.email) return 'No email';
  return user.email.toLowerCase();
}
```

### Error 3: Import sin 'type' keyword

```typescript
// ⚠️ PUEDE CAUSAR PROBLEMAS
import { Movement } from '../types/models';

// ✅ MEJOR
import type { Movement } from '../types/models';
```

### Error 4: Return type no especificado

```typescript
// ❌ MAL
async function fetchData() {  // No explicit return type
  return await api.get();
}

// ✅ BIEN
async function fetchData(): Promise<Movement[]> {
  return await api.get();
}
```

---

## 📊 MÉTRICAS ACTUALES

### Estado de Migración TypeScript

**Completado:**
- ✅ Configuración TypeScript (100%)
- ✅ Tipos base (100%)
- ✅ 1 store migrado (20%)
- ⏸️ 0 hooks migrados (0%)
- ⏸️ 0 servicios migrados (0%)

**Validaciones:**
- ✅ `npm run type-check` → 0 errores
- ✅ `npm run lint` → 0 errores
- ✅ Aplicación compila exitosamente

---

## 🚀 PRÓXIMOS PASOS

### Sprint 2 - Fase 2: Migrar Stores Restantes
1. [ ] `movements.store.ts`
2. [ ] `vehicles.store.ts`
3. [ ] `inventory.store.ts`
4. [ ] `products.store.ts`

### Sprint 2 - Fase 3: Migrar Hooks
1. [ ] `useMovements.ts`
2. [ ] `useVehicles.ts`
3. [ ] `useInventory.ts`
4. [ ] `useProducts.ts`
5. [ ] `useSuppliers.ts`
6. [ ] `useVehicleCategories.ts`
7. [ ] `useHourMeter.ts`

### Sprint 2 - Fase 4: Migrar Servicios
1. [ ] `FirebaseMovementsService.ts`
2. [ ] `FirebaseVehiclesService.ts`
3. [ ] `FirebaseInventoryService.ts`
4. [ ] `FirebaseProductsService.ts`
5. [ ] `FirebaseSuppliersService.ts`

---

## 📚 RECURSOS

### Documentación Interna
- [FASE2_SEGUIMIENTO.md](./FASE2_SEGUIMIENTO.md) - Tracking de progreso
- [SPRINT2_PROMPT.md](./SPRINT2_PROMPT.md) - Prompt del Sprint 2
- [STORES_GUIDE.md](./STORES_GUIDE.md) - Guía de stores Zustand

### Documentación Externa
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Zustand + TypeScript](https://github.com/pmndrs/zustand#typescript)
- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

**Última Actualización:** 1 de octubre de 2025  
**Autor:** AI Assistant  
**Versión:** 1.0  
**Sprint:** Sprint 2 - TypeScript Migration
