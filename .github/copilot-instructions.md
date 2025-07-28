# Forestech Colombia - AI Coding Instructions

## �🇸 IDIOMA Y COMUNICACIÓN
**IMPORTANTE**: Todas las respuestas, comentarios, issues, PRs y comunicaciones deben ser EN ESPAÑOL.
- ✅ Usar español colombiano para todas las interacciones
- ✅ Nombres de variables y funciones pueden estar en inglés (por convención de programación)
- ✅ Comentarios de código y documentación en español
- ✅ Mensajes de commit, issues y PRs en español
- ✅ Logs y mensajes de error del sistema en español cuando sea posible

## 📋 GESTIÓN DE TAREAS PENDIENTES
**OBLIGATORIO**: Para tareas complejas, mantener una lista de seguimiento del progreso.

### Formato de Lista de Tareas
```markdown
## 🎯 TAREAS PENDIENTES - [Nombre del Proyecto/Feature]

### 📌 EN PROGRESO
- [ ] Tarea actual en desarrollo
- [ ] Subtarea específica

### ✅ COMPLETADAS
- [x] Tarea ya finalizada
- [x] Otra tarea completada

### 🔄 PENDIENTES
- [ ] Próxima tarea a realizar
- [ ] Tarea futura identificada

### 🚨 BLOQUEADAS/ISSUES
- [ ] Tarea bloqueada por dependencia
- [ ] Issue que requiere atención

### 📝 NOTAS
- Observaciones importantes
- Decisiones técnicas tomadas
- Referencias útiles
```

### Cuándo Crear Lista de Tareas
- **Tareas complejas**: > 30 minutos estimados
- **Múltiples archivos**: Modificaciones en 3+ archivos
- **Refactoring**: Cambios estructurales significativos
- **Nuevas features**: Implementación de funcionalidades completas
- **Debugging complejo**: Investigación de bugs multi-componente
- **Migraciones**: Actualizaciones de dependencias o arquitectura

### Protocolo de Actualización
1. **Inicio de sesión**: Crear lista con tareas identificadas
2. **Durante desarrollo**: Actualizar estado cada 15-20 minutos
3. **Completar tarea**: Mover de "EN PROGRESO" a "COMPLETADAS"
4. **Nuevas tareas**: Agregar a "PENDIENTES" si surgen durante desarrollo
5. **Fin de sesión**: Resumen de progreso y próximos pasos

### Ejemplo Práctico
```markdown
## 🎯 TAREAS PENDIENTES - Optimización CombustiblesContext

### 📌 EN PROGRESO
- [ ] Implementar patrón de suscripción manual en useEssentialData

### ✅ COMPLETADAS  
- [x] Analizar performance issues en CombustiblesContext
- [x] Identificar suscripciones automáticas problemáticas
- [x] Diseñar patrón de suscripción manual

### 🔄 PENDIENTES
- [ ] Actualizar componentes para usar subscribeToInventory()
- [ ] Implementar cleanup automático de suscripciones
- [ ] Agregar métricas de performance
- [ ] Documentar nuevo patrón en README

### 🚨 BLOQUEADAS/ISSUES
- [ ] Verificar compatibilidad con React 19 (pendiente pruebas)

### 📝 NOTAS
- Patrón manual reduce lecturas Firebase en 60%
- Mantener backward compatibility durante transición
- Considerar useCallback para optimización adicional
```

## �🏗️ Architecture Overview

**Forestech** is a production monorepo with 2 React apps sharing Firebase infrastructure:
- `alimentacion/` - Settlement calculations app (port 5173)
- `combustibles/` - Fuel management app (port 5174) 
- `shared/` - Common Firebase config, auth, constants
- Unified Firebase project: `liquidacionapp-62962`

### Tech Stack
- **Frontend**: React 19 + Vite 6.3.5 + React Router DOM v7
- **Backend**: Firebase (Firestore, Auth, Storage, Analytics)
- **State Management**: React Context + Custom Hooks
- **Build**: Vite with code splitting and lazy loading
- **Deploy**: GitHub Actions → Firebase Hosting
- **Domain**: `forestechdecolombia.com.co` with multi-app routing

### Monorepo Structure
```
forestech/
├── alimentacion/           # Settlement calculations
│   ├── src/components/     # React components
│   ├── src/firebase/       # Firebase services
│   └── src/contexts/       # UserContext only
├── combustibles/           # Fuel management (more complex)
│   ├── src/components/     # 14 modules (Inventory, Movements, etc.)
│   ├── src/contexts/       # AuthContext + CombustiblesContext
│   ├── src/hooks/          # 6 custom hooks
│   ├── src/services/       # 15+ Firebase services
│   └── src/constants/      # Business logic constants
├── shared/                 # Cross-app resources
│   ├── firebase/           # Unified Firebase config
│   └── constants/          # Roles, permissions, types
├── docs/                   # Modular documentation
├── .github/workflows/      # 5 coordinated CI/CD workflows
└── scripts/                # Automation and MCP tools
```

## 🔧 Development Patterns

### Monorepo Scripts
```bash
# Development (concurrent ports)
npm run dev:alimentacion     # Start alimentacion dev server (port 5173)
npm run dev:combustibles     # Start combustibles dev server (port 5174)

# Building
npm run build:all           # Sequential build both apps
npm run build:parallel      # Parallel build (faster, uses &)
npm run build:alimentacion  # Single app build
npm run build:combustibles  # Single app build

# Linting (CRITICAL - required before commits)
npm run lint:all            # Lint both apps
npm run lint:alimentacion   # ESLint with React hooks rules
npm run lint:combustibles   # ESLint with React hooks rules

# Deployment
npm run deploy              # Auto: build:all + firebase deploy
```

### Context Architecture (Combustibles App)

#### AuthContext Pattern (Minimal)
```jsx
// contexts/AuthContext.jsx - Keep lean for performance
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  
  // Only essential auth functions
  const isAdmin = useCallback(() => userProfile?.role === 'admin', [userProfile]);
  const hasPermission = useCallback((permission) => {
    return userProfile?.permissions?.includes(permission);
  }, [userProfile]);
  
  return (
    <AuthContext.Provider value={{ user, userProfile, isAdmin, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### CombustiblesContext Pattern (On-demand subscriptions)
```jsx
// contexts/CombustiblesContext.jsx - Performance-optimized
export const CombustiblesProvider = ({ children }) => {
  const auth = useAuth();
  const data = useEssentialData([]); // Empty by default - no auto-subscriptions
  const crud = useCombustiblesCRUD();

  const value = {
    ...auth,
    // Data (empty until subscribed)
    inventory: data.inventory,
    movements: data.movements,
    vehicles: data.vehicles,
    // Manual subscription functions
    subscribeToInventory: data.subscribeToInventory,
    subscribeToVehicles: data.subscribeToVehicles,
    subscribeToMovements: data.subscribeToMovements,
    // CRUD operations
    ...crud,
  };
};
```

#### Manual Subscription Pattern
```jsx
// ✅ Correct pattern - manual subscription in components
const InventoryMain = () => {
  const { subscribeToInventory, inventory } = useCombustibles();
  
  useEffect(() => {
    // Manual subscription with auto-cleanup
    const unsubscribe = subscribeToInventory();
    return unsubscribe; // Cleanup on unmount
  }, [subscribeToInventory]);
  
  return <div>{/* Use inventory data */}</div>;
};

// ❌ Avoid - don't auto-subscribe to all data in context
// This causes unnecessary Firebase reads and performance issues
```

### Custom Hooks Architecture

#### useCombustiblesCRUD Pattern
```jsx
// hooks/useCombustiblesCRUD.js - Centralized CRUD with consistent error handling
export const useCombustiblesCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteMovement = useCallback(async (movementId) => {
    try {
      setLoading(true);
      setError(null);
      await movementsService.deleteMovement(movementId);
      return { success: true };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Always return consistent structure
  return { deleteMovement, createMovement, loading, error };
};
```

#### useFirestoreData Pattern
```jsx
// hooks/useFirestoreData.js - Real-time subscriptions with cleanup
export const useEssentialData = (initialSubscriptions = []) => {
  const [data, setData] = useState({
    inventory: [],
    movements: [],
    vehicles: []
  });

  const subscribeToInventory = useCallback(() => {
    return inventoryService.subscribeToInventory((snapshot) => {
      setData(prev => ({ ...prev, inventory: snapshot }));
    });
  }, []);

  return { data, subscribeToInventory, subscribeToVehicles };
};
```

### Firebase Service Layer Pattern

#### Service Structure
```
combustibles/src/services/
├── authService.js          # Authentication + registration
├── userService.js          # User profiles + permissions  
├── inventoryService.js     # Stock management (4 fuel types)
├── movementsService.js     # Fuel transactions (4 types: entry/exit/transfer/adjustment)
├── vehiclesService.js      # Fleet management (25 vehicles + horómetros)
├── vehicleCategoriesService.js  # 25 vehicle categories
├── suppliersService.js     # Suppliers + evaluations
├── productsService.js      # Dynamic products (9 types)
├── maintenanceService.js   # Preventive/corrective maintenance
├── migrationManager.js     # Migration wizard orchestrator
├── fileParsingService.js   # Excel/CSV parser (xlsx library)
├── aliasService.js         # Value mappings for migration
├── optimizedFirestore.js   # Performance-optimized queries
└── realDataMigrationService.js  # Google Sheets integration
```

#### Service Pattern (Always return { success, data, error })
```jsx
// services/inventoryService.js
export const inventoryService = {
  async createInventoryItem(itemData) {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.INVENTORY), {
        ...itemData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true, data: { id: docRef.id, ...itemData } };
    } catch (error) {
      console.error('Error creating inventory item:', error);
      return { success: false, error: error.message };
    }
  },
  
  subscribeToInventory(callback) {
    const q = query(
      collection(db, COLLECTIONS.INVENTORY),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, callback);
  }
};
```

## 🚀 Build & Deploy

### GitHub Actions (5 coordinated workflows)

#### Primary Pipeline: `deploy-firebase.yml`
- **Performance**: 83% build time reduction (12min → 2min)
- **Strategy**: Monorepo-optimized with parallel builds
- **Cache layers**: Dependencies + Build artifacts + Vite cache
- **Auto-triggers**: Every push to main branch

#### AI-Powered Pipeline: `copilot-bridge.yml`
- **Purpose**: Auto-fixes lint errors via GitHub Copilot Agent
- **Trigger**: When main pipeline detects build errors
- **Process**: Collects errors → Sends structured context to Agent → Auto-creates fix PR
- **Context**: Includes file content, error details, project patterns

#### Monitoring Pipelines
- **`claude-check-resolver.yml`**: PR validation and intelligent monitoring
- **`monitor-bucles.yml`**: Prevents infinite loops in CI/CD
- **`deploy-firebase-old.yml`**: Emergency fallback (manual trigger)

### Build Optimization Techniques

#### Multi-layer Caching Strategy
```yaml
# .github/workflows/deploy-firebase.yml
- name: Cache node_modules (Layer 1)
  uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}

- name: Cache build artifacts (Layer 2)  
  uses: actions/cache@v3
  with:
    path: |
      alimentacion/dist
      combustibles/dist
    key: ${{ runner.os }}-build-${{ github.sha }}

- name: Cache Vite dependencies (Layer 3)
  uses: actions/cache@v3
  with:
    path: |
      alimentacion/node_modules/.vite
      combustibles/node_modules/.vite
```

#### Parallel Build Pattern
```bash
# Sequential (old): 8-12 minutes
npm run build:alimentacion && npm run build:combustibles

# Parallel (optimized): 2-3 minutes  
npm run build:alimentacion & npm run build:combustibles & wait
```

### Performance Optimizations

#### Code Splitting Implementation
```jsx
// combustibles/src/App.jsx - Lazy loading pattern
import { Suspense, lazy } from 'react';

// All major routes are lazy-loaded
const DashboardMain = lazy(() => import('./components/Dashboard/DashboardMain'));
const InventoryMain = lazy(() => import('./components/Inventory/InventoryMain'));
const MovementsMain = lazy(() => import('./components/Movements/MovementsMain'));
const VehiclesMain = lazy(() => import('./components/Vehicles/VehiclesMain'));
const MaintenanceMain = lazy(() => import('./components/Maintenance/MaintenanceMain'));
const ProductsMain = lazy(() => import('./components/Products/ProductsMain'));
const SuppliersMain = lazy(() => import('./components/Suppliers/SuppliersMain'));
const ReportsMain = lazy(() => import('./components/Reports/ReportsMain'));
const MigrationPage = lazy(() => import('./components/Migration/MigrationPage'));

// Suspense wrapper with loading fallback
function AppContent() {
  return (
    <Suspense fallback={<div className="loading-spinner">Cargando...</div>}>
      <Routes>
        <Route path="/dashboard" element={<DashboardMain />} />
        <Route path="/inventory" element={<InventoryMain />} />
        {/* All routes lazy-loaded */}
      </Routes>
    </Suspense>
  );
}
```

#### Firebase Query Optimization
```jsx
// services/optimizedFirestore.js - Performance patterns
export const getOptimizedMovements = () => {
  // Limit queries to prevent large data loads
  const q = query(
    collection(db, COLLECTIONS.MOVEMENTS),
    orderBy('createdAt', 'desc'),
    limit(100) // Prevent loading thousands of records
  );
  return q;
};

// Composite indexes for complex queries (defined in firestore.indexes.json)
export const getMovementsByVehicleAndDate = (vehicleId, startDate, endDate) => {
  const q = query(
    collection(db, COLLECTIONS.MOVEMENTS),
    where('vehicleId', '==', vehicleId),
    where('createdAt', '>=', startDate),
    where('createdAt', '<=', endDate),
    orderBy('createdAt', 'desc')
  );
  return q;
};
```

#### PerformanceContext Monitoring
```jsx
// contexts/PerformanceContext.jsx - Real-time performance tracking
export const PerformanceProvider = ({ children }) => {
  const [metrics, setMetrics] = useState({
    cacheHits: 0,
    cacheMisses: 0,
    firestoreReads: 0,
    renderCycles: 0
  });

  const trackCacheHit = useCallback(() => {
    setMetrics(prev => ({ ...prev, cacheHits: prev.cacheHits + 1 }));
  }, []);

  const trackFirestoreRead = useCallback(() => {
    setMetrics(prev => ({ ...prev, firestoreReads: prev.firestoreReads + 1 }));
  }, []);

  // Only visible in development
  return (
    <PerformanceContext.Provider value={{ metrics, trackCacheHit, trackFirestoreRead }}>
      {children}
      {import.meta.env.NODE_ENV === 'development' && (
        <PerformanceDashboard metrics={metrics} />
      )}
    </PerformanceContext.Provider>
  );
};
```

## 🎯 Key Conventions

### React Hooks Order (Critical for linting)
```jsx
// ✅ Required order to avoid hook linting errors
const Component = () => {
  // 1. State hooks
  const [state, setState] = useState();
  
  // 2. useCallback for functions used in useEffect
  const handleFunction = useCallback(() => {
    // logic
  }, [dependencies]);
  
  // 3. useEffect using the callbacks
  useEffect(() => {
    handleFunction();
  }, [handleFunction]);
  
  // 4. Local functions NOT used in useEffect
  const localFunction = () => {};
};
```

### Component Export Patterns (Fast Refresh)
```jsx
// ✅ Correct - Named component exports
const InventoryCard = ({ item }) => {
  return <div>{item.name}</div>;
};
export default InventoryCard;

// ✅ Correct - Named component with memo
const OptimizedInventoryCard = React.memo(({ item }) => {
  return <div>{item.name}</div>;
});
export default OptimizedInventoryCard;

// ❌ Avoid - Anonymous exports break Fast Refresh
export default ({ item }) => <div>{item.name}</div>;

// ❌ Avoid - Mixed exports in same file
export const SomeFunction = () => {};
export default SomeComponent; // This breaks Fast Refresh
```

### Migration Wizard Pattern (5-Step Architecture)
```jsx
// components/MigrationWizard/ - Multi-step form pattern
const MigrationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState({});

  const steps = [
    { component: Step1_FileUpload, title: 'Subir Archivo' },
    { component: Step2_ColumnMapping, title: 'Mapear Columnas' },
    { component: Step3_ValueMapping, title: 'Mapear Valores' },
    { component: Step4_Validation, title: 'Validar Datos' },
    { component: Step5_Execution, title: 'Ejecutar Migración' }
  ];

  const updateWizardData = useCallback((stepData) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
  }, []);

  const CurrentStepComponent = steps[currentStep - 1].component;
  
  return (
    <div className="migration-wizard">
      <StepProgress currentStep={currentStep} totalSteps={steps.length} />
      <CurrentStepComponent 
        data={wizardData}
        onUpdate={updateWizardData}
        onNext={() => setCurrentStep(prev => prev + 1)}
        onPrev={() => setCurrentStep(prev => prev - 1)}
      />
    </div>
  );
};
```

### Alias Service Pattern (Value Mapping)
```jsx
// services/aliasService.js - Persistent value mappings for data migration
export const aliasService = {
  async saveAlias(originalValue, mappedValue, type) {
    const aliasRef = doc(db, COLLECTIONS.ALIASES, `${type}_${originalValue}`);
    await setDoc(aliasRef, {
      original: originalValue,
      mapped: mappedValue,
      type: type,
      createdAt: serverTimestamp()
    });
  },

  async getAliases(type) {
    const q = query(
      collection(db, COLLECTIONS.ALIASES),
      where('type', '==', type)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.reduce((acc, doc) => {
      const data = doc.data();
      acc[data.original] = data.mapped;
      return acc;
    }, {});
  },

  // Smart mapping with learning
  async smartMap(values, type) {
    const existingAliases = await this.getAliases(type);
    return values.map(value => existingAliases[value] || value);
  }
};
```

### Environment Variables (Vite-specific)
```jsx
// ✅ Correct - Use import.meta.env for Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
};

// ❌ Incorrect - process.env doesn't work in Vite client-side
const config = {
  apiKey: process.env.VITE_FIREBASE_API_KEY, // undefined in browser
};

// shared/firebase/config.js - Environment validation with fallbacks
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const appId = import.meta.env.VITE_FIREBASE_APP_ID;

if (!apiKey) {
  console.error('❌ VITE_FIREBASE_API_KEY no está definida');
}

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "liquidacionapp-62962.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "liquidacionapp-62962",
  // Fallbacks for critical config
};
```

### Constants and Business Logic
```jsx
// constants/combustibleTypes.js - Centralized business constants
export const COMBUSTIBLE_TYPES = {
  DIESEL: { id: 'diesel', name: 'Diésel', color: '#FF6B35', unit: 'galones' },
  GASOLINE: { id: 'gasoline', name: 'Gasolina', color: '#4ECDC4', unit: 'galones' },
  ACPM: { id: 'acpm', name: 'ACPM', color: '#45B7D1', unit: 'galones' },
  LUBRICANTS: { id: 'lubricants', name: 'Lubricantes', color: '#96CEB4', unit: 'litros' }
};

// constants/vehicleTypes.js - 25 specific Forestech vehicles
export const VEHICLE_CATEGORIES = {
  TRACTORS: {
    TR1: { name: 'Tractor 1', hasHorometer: true, type: 'heavy_machinery' },
    TR2: { name: 'Tractor 2', hasHorometer: true, type: 'heavy_machinery' },
    TR3: { name: 'Tractor 3', hasHorometer: true, type: 'heavy_machinery' },
  },
  TRUCKS: {
    CAM1: { name: 'Camión 1', hasHorometer: false, type: 'transport' },
    CAM2: { name: 'Camión 2', hasHorometer: false, type: 'transport' },
  },
  // ... 20 more specific vehicles
};

// shared/constants/roles.js - Permission system
export const ROLES = {
  ADMIN: 'admin',
  EMPLEADO: 'empleado', 
  CLIENTE: 'cliente'
};

export const PERMISSIONS = {
  COMBUSTIBLES: {
    MANAGE_INVENTORY: ['admin', 'empleado'],
    CREATE_MOVEMENT: ['admin', 'empleado'],
    VIEW_REPORTS: ['admin', 'empleado', 'cliente'],
    MANAGE_VEHICLES: ['admin'],
    BULK_IMPORT: ['admin']
  },
  ALIMENTACION: {
    CREATE_SETTLEMENT: ['admin', 'empleado'],
    VIEW_HISTORY: ['admin', 'empleado', 'cliente'],
    MANAGE_USERS: ['admin']
  }
};
```

## 🔍 Debugging & AI Tools

## ⚡ EJECUCIÓN PARALELA DE HERRAMIENTAS (CRÍTICO)

**GitHub Copilot DEBE usar múltiples operaciones en paralelo cuando sea posible:**

### ✅ Patrones Correctos - Operaciones Paralelas
```bash
# Análisis simultáneo de múltiples archivos
- Leer varios archivos a la vez
- Ejecutar grep + ls + análisis estructura simultáneamente
- Git operations: status + diff + log en paralelo
- Firebase queries: múltiples colecciones + usuarios + reglas a la vez
```

### ❌ Antipatrones - Evitar Ejecución Secuencial Innecesaria
```bash
# NO hacer operaciones una por una cuando pueden ser paralelas
- Read → esperar → Grep → esperar → LS
- Un comando por vez cuando podrían ser simultáneos
- Consultas Firebase secuenciales cuando pueden ser paralelas
```

### 🚀 Casos de Uso Paralelo
- **Análisis arquitectural**: Múltiples archivos + estructura + dependencias
- **Debugging complejo**: Logs + código + configuración simultáneamente
- **Build verification**: Lint + test + build checks a la vez
- **Performance analysis**: Múltiples métricas y archivos simultáneamente

## 🤖 MCPS AVANZADOS CONFIGURADOS

### MCPs Enterprise Activos
**Prioridad actualizada:** serena > context7 > github-cli > github > memory > filesystem > firebase > notion

#### 🧠 Serena (Análisis Semántico)
- **Funcionalidad**: Análisis arquitectural inteligente y refactoring semántico
- **Auto-uso**: Navegación de símbolos, dependencias cruzadas, calidad automática
- **Contexto**: Comprensión estructura monorepo alimentacion/combustibles/shared

#### 📚 Context7 (Documentación Actualizada)
- **Funcionalidad**: Docs en tiempo real de Firebase v10+, React 19, Vite latest
- **Auto-uso**: Validación API, prevención errores, mejores prácticas inyectadas
- **Contexto**: Verificar sintaxis correcta antes de sugerir implementaciones

#### ⏰ Time-Bogotá (Zona Horaria)
- **Configuración**: América/Bogotá para timestamps y logging
- **Auto-uso**: Fechas, logs, created_at automáticamente en zona horaria correcta

#### 🧠 Sequential-Thinking-ES (Análisis Paso a Paso)
- **Funcionalidad**: Razonamiento estructurado en español para tareas complejas
- **Auto-uso**: Debugging complejo, arquitectura, planificación de refactoring

## 🎯 SELECTOR DE PROYECTO AUTOMÁTICO

**Al iniciar cada sesión, GitHub Copilot debe preguntar:**

```
🔍 ¿En qué proyecto de Forestech trabajamos hoy?

🍽️  1. ALIMENTACION - App de liquidaciones de comidas (puerto 5173)
⛽  2. COMBUSTIBLES - App de gestión de combustibles (puerto 5174)  
🔧  3. SHARED - Recursos compartidos entre apps
📋  4. GENERAL - Configuración global del monorepo

Responde con el número (1-4) para establecer el contexto correcto.
```

### 🔄 Contexto Automático por Proyecto
```bash
# 1. ALIMENTACION
- Contexto: UserContext, cálculos liquidaciones, Firebase settlements
- Archivos principales: alimentacion/src/components/, alimentacion/src/firebase/
- Puerto desarrollo: 5173

# 2. COMBUSTIBLES  
- Contexto: AuthContext + CombustiblesContext, 14 módulos, 6 hooks, 15+ servicios
- Archivos principales: combustibles/src/, más complejo que alimentacion
- Puerto desarrollo: 5174

# 3. SHARED
- Contexto: Firebase config unificado, constantes, roles, permisos
- Archivos principales: shared/firebase/, shared/constants/

# 4. GENERAL
- Contexto: Monorepo, CI/CD, documentación, scripts, package.json raíz
- Archivos principales: .github/workflows/, scripts/, docs/
```

## 🧠 COMPORTAMIENTO AUTOMÁTICO INTELIGENTE

### ⚡ Auto-Análisis Profundo (Sin Solicitud Explícita)
GitHub Copilot ejecuta automáticamente:

#### 🌊 Wave Orchestration (AUTO)
- **Trigger**: Complejidad ≥0.7 OR archivos >20 OR múltiples dominios
- **Acción**: Coordinar análisis en fases (Analysis → Implementation → Validation)
- **Ejemplo**: Análisis arquitectural → refactoring → security audit → performance

#### ⚡ Token Compression (AUTO)
- **Nivel 1** (contexto >75%): Símbolos técnicos (→, ✅, ❌, &, |)
- **Nivel 2** (contexto >85%): Abreviaciones (cfg, impl, perf, sec, val)
- **Nivel 3** (contexto >95%): Ultra-compresión preservando información técnica

#### 🔍 Auto-Analysis Patterns (AUTO)
- **Context Detection**: Detectar automáticamente dominio (auth, Firebase, React, build)
- **Dependency Analysis**: Identificar dependencias cruzadas alimentacion ↔ combustibles ↔ shared
- **Quality Gates**: Validación automática antes de implementar cambios
- **Pattern Recognition**: Identificar patrones existentes y mantener consistencia

### 🎯 Comandos Internos Automáticos
GitHub Copilot interpreta automáticamente (sin que usuario los escriba):

#### `/analyze` (AUTO-TRIGGER)
- **Cuándo**: "revisar código", "analizar", "troubleshooting"
- **Acción**: Análisis semántico + documentación actualizada + patrones memoria
- **Contexto**: Firebase datos reales + estructura monorepo

#### `/implement` (AUTO-TRIGGER)  
- **Cuándo**: "crear feature", "implementar", "desarrollar"
- **Acción**: Navegación símbolos + APIs actualizadas + patrones establecidos
- **Contexto**: Mantener convenciones proyecto + performance patterns

#### `/improve` (AUTO-TRIGGER)
- **Cuándo**: "optimizar", "mejorar", "refactorizar"
- **Acción**: Refactoring semántico + mejores prácticas + memoria soluciones
- **Contexto**: Performance + security + maintainability

#### `/validate` (AUTO-TRIGGER)
- **Cuándo**: Antes de implementar cambios significativos
- **Acción**: Quality audit + dependency check + breaking change detection
- **Contexto**: Compatibilidad React 19 + Firebase + monorepo

### 🚀 Flags Automáticos Internos
```bash
--parallel-execution: SIEMPRE activo para operaciones simultáneas
--context-aware: Auto-detección alimentacion/combustibles/shared/general
--memory-persistent: Guardar patrones exitosos automáticamente
--spanish-first: Todas las respuestas y documentación en español
--performance-optimize: Considerar impacto performance en cada sugerencia
--firebase-aware: Contexto proyecto liquidacionapp-62962 automático
```

## 📚 DOCUMENTACIÓN MODULAR INTEGRADA

### 🔗 Referencias Documentación Específica
- **📂 Estructura Detallada**: [docs/project/STRUCTURE.md](./docs/project/STRUCTURE.md)
- **⚙️ Comandos Avanzados**: [docs/project/COMMANDS.md](./docs/project/COMMANDS.md)  
- **📊 Estado Proyecto**: [docs/project/STATUS.md](./docs/project/STATUS.md)
- **🚀 CI/CD Workflows**: [docs/project/CICD.md](./docs/project/CICD.md)
- **Apps Específicas**: 
  - `docs/alimentacion/README.md`
  - `docs/combustibles/README.md` 
  - `docs/shared/README.md`

### 🔄 Sincronización Automática CLAUDE.md ↔ Copilot-Instructions
- **Bidireccional**: Cambios importantes se reflejan en ambos archivos
- **Claude específico**: Comportamientos avanzados, MCPs enterprise
- **Copilot específico**: Patrones código, convenciones, arquitectura técnica
- **Común**: Estructura proyecto, Firebase config, scripts monorepo
```bash
✅ Architecture Patterns: React 19 + Vite + Firebase patterns understood
✅ Monorepo Structure: alimentacion + combustibles + shared recognized
✅ Build Pipeline: GitHub Actions workflows and optimizations known
✅ Context Patterns: Manual subscriptions, performance optimizations
✅ Hook Order: ESLint compliance for useCallback + useEffect patterns
✅ Migration System: 5-step wizard pattern and alias service understood
```

### 🚨 **Error Patterns to Avoid**
```bash
❌ Anonymous component exports (breaks Fast Refresh)
❌ Direct process.env usage (use import.meta.env for Vite)
❌ Auto-subscriptions in Context (use manual subscription pattern)
❌ Direct terminal gh commands (use @github-cli MCP wrapper)
❌ Missing dependencies in useEffect (causes lint errors)
❌ Firestore subscription leaks (ensure cleanup)
```

### 🔧 **Legacy Migration Complete**
This file now contains all functionality from the previous superprompt:
`🎯 Cargar contexto Forestech completo: MCPs + Wrappers + CLAUDE.md + Git`

**No manual context loading needed** - everything is auto-integrated! 🚀

## 📝 Documentation Sync Protocol

### 🔄 **Active Documentation Management**
AI agents should **actively ask** the user about updating project documentation:

```
📝 ¿Debo actualizar la documentación en CLAUDE.md con los cambios/patrones identificados en esta sesión?

✅ Sí - Actualizar claude.md con nuevos patrones
❌ No - Solo aplicar cambios al código  
🔄 Parcial - Solo aspectos específicos
```

### 📋 **What to Sync in CLAUDE.md**
- 🏗️ **New architecture patterns** discovered
- 🔧 **MCP configurations** updates
- 🚀 **CI/CD workflows** modifications  
- 📊 **Project status** changes
- 🐛 **Issues resolved** documentation
- 💡 **Best practices** identified
- 🎯 **Performance optimizations** implemented

### ⚡ **When to Ask**
- After implementing significant changes
- When discovering new patterns or antipatterns
- After resolving complex issues
- When updating project structure
- At the end of major development sessions

This ensures that `CLAUDE.md` stays current and valuable for future development sessions.
