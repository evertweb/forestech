# 🏗️ DIAGRAMA DE ARQUITECTURA - COMBUSTIBLES APP

## 📊 **ARQUITECTURA GENERAL**

```mermaid
graph TB
    subgraph "🌐 FRONTEND - REACT 18"
        subgraph "📱 UI LAYER"
            A[main.jsx<br/>App Entry Point] --> B[App.jsx<br/>Router Setup]
            B --> C[AuthVisualEnhanced<br/>Login Component]
            B --> D[DashboardLayout<br/>Main Layout]
        end

        subgraph "🎯 CONTEXTS LAZY"
            E[AuthContextLazy<br/>Minimal Auth] --> F[CombustiblesContext<br/>Data Management]
            F --> G[LazyDataContext<br/>On-Demand Data]
        end

        subgraph "🔧 HOOKS & UTILS"
            H[useFormData<br/>Form Management]
            I[useCombustiblesCRUD<br/>CRUD Operations]
            J[useStatusColors<br/>UI Consistency]
            K[validators.js<br/>Centralized Validation]
        end
    end

    subgraph "🔥 FIREBASE MODULAR"
        subgraph "🏗️ CORE SERVICES"
            L[firebase/config.js<br/>App Initialization]
            M[lazyFirebase.js<br/>Lazy Loading]
        end

        subgraph "🔐 AUTHENTICATION"
            N[firebase/auth<br/>52kB Core]
            O[authService.js<br/>Auth Operations]
        end

        subgraph "📊 FIRESTORE"
            P[firebase/firestore<br/>499kB DB]
            Q[BaseService.js<br/>CRUD Base]
            R[Service Layer<br/>15 Services]
        end

        subgraph "💾 STORAGE"
            S[firebase/storage<br/>Background Images]
        end
    end

    subgraph "🏢 BUSINESS LOGIC"
        subgraph "📋 MAIN MODULES"
            T[📦 Inventory<br/>Stock Management]
            U[🚚 Movements<br/>Fuel Transactions]
            V[🚗 Vehicles<br/>Fleet Management]
            W[🔧 Maintenance<br/>Service Records]
            X[📊 Reports<br/>Analytics]
        end

        subgraph "🎛️ SHARED COMPONENTS"
            Y[BaseModal<br/>Modal System]
            Z[PageLayout<br/>Layout System]
            AA[FormWizard<br/>Step-by-Step Forms]
        end
    end

    subgraph "⚡ PERFORMANCE LAYER"
        subgraph "🚀 CODE SPLITTING"
            BB[React.lazy()<br/>Route-based]
            CC[Dynamic Imports<br/>Component-based]
        end

        subgraph "💾 CACHING"
            DD[React.memo<br/>Component Memoization]
            EE[useMemo/useCallback<br/>Computation Cache]
        end

        subgraph "🎯 CORE WEB VITALS"
            FF[LCP: <2.5s<br/>Preload Critical]
            GG[CLS: <0.1<br/>Layout Stability]
            HH[FCP: <3.4s<br/>Fast Paint]
        end
    end

    %% Connections
    A --> E
    E --> L
    F --> Q
    G --> R
    H --> K
    I --> R
    T --> Q
    U --> Q
    V --> Q
    W --> Q
    T --> Y
    U --> AA
    V --> Y
    BB --> T
    CC --> Y
    DD --> Y
    EE --> I

    %% Styling
    classDef frontend fill:#e1f5fe
    classDef firebase fill:#fff3e0
    classDef business fill:#f3e5f5
    classDef performance fill:#e8f5e8

    class A,B,C,D,E,F,G,H,I,J,K frontend
    class L,M,N,O,P,Q,R,S firebase
    class T,U,V,W,X,Y,Z,AA business
    class BB,CC,DD,EE,FF,GG,HH performance
```

## 🎯 **CONTEXTOS LAZY - ARQUITECTURA**

```mermaid
sequenceDiagram
    participant App as 🚀 App.jsx
    participant Auth as 🔐 AuthContextLazy
    participant Comb as 📊 CombustiblesContext
    participant Lazy as ⚡ LazyDataContext
    participant FB as 🔥 Firebase Services

    App->>Auth: 1. Initialize minimal auth
    Auth->>FB: 2. Check auth state
    FB-->>Auth: 3. User state

    Note over Auth,Comb: Only on authenticated access
    Auth->>Comb: 4. Provide auth context
    Comb->>Lazy: 5. Initialize data context

    Note over Lazy,FB: On-demand data loading
    Lazy->>FB: 6. Load inventory (when needed)
    Lazy->>FB: 7. Load vehicles (when needed)
    Lazy->>FB: 8. Load movements (when needed)

    FB-->>Lazy: 9. Return data streams
    Lazy-->>Comb: 10. Provide data to context
    Comb-->>App: 11. Context ready for components
```

## 🔥 **FIREBASE MODULAR - BUNDLE OPTIMIZATION**

```mermaid
graph LR
    subgraph "📦 BUNDLE ANALYSIS (Pre-optimization: 259kB)"
        A[🔥 Firebase Core<br/>52kB] --> B[🔐 Auth Module<br/>196kB]
        A --> C[📊 Firestore<br/>499kB]
        A --> D[💾 Storage<br/>Variable]
    end

    subgraph "⚡ LAZY LOADING STRATEGY"
        E[🚀 App Bundle<br/>211kB - 47kB Reduction]
        F[📊 Firebase-DB<br/>Lazy Import]
        G[🔐 Firebase-Auth<br/>Lazy Import]
        H[💾 Firebase-Storage<br/>On-Demand]
    end

    subgraph "🎯 PERFORMANCE TARGETS"
        I[🎯 LCP < 2.5s<br/>✅ Achieved]
        J[📐 CLS < 0.1<br/>✅ Layout Stable]
        K[⚡ FCP < 3.4s<br/>✅ Fast Paint]
    end

    A --> E
    B --> G
    C --> F
    D --> H

    E --> I
    E --> J
    E --> K

    classDef optimized fill:#c8e6c9
    classDef target fill:#fff9c4
    class E,F,G,H optimized
    class I,J,K target
```

## 🏗️ **SERVICIOS - ARQUITECTURA CRUD**

```mermaid
classDiagram
    class BaseService {
        +db: Firestore
        +collection: string
        +validateData(data)
        +handleError(error)
        +formatResponse(data)
        #logOperation(operation, data)
    }

    class CRUDService {
        +create(data)
        +getAll(options?)
        +getById(id)
        +update(id, data)
        +delete(id)
        +query(conditions)
        +subscribe(callback)
    }

    class InventoryService {
        +getAllInventory()
        +createInventoryItem(data)
        +updateInventoryItem(id, data)
        +getLowStockItems()
        +calculateTotalValue()
        +getInventoryByType(fuelType)
        +subscribeToChanges(callback)
    }

    class MovementsService {
        +createMovement(data)
        +getAllMovements()
        +getMovementsByType(type)
        +getMovementsByDateRange(start, end)
        +validateMovementData(data)
        +calculateTotalValue(quantity, price)
    }

    class VehiclesService {
        +createVehicle(data)
        +getAllVehicles()
        +getActiveVehicles()
        +getVehiclesByCategory(category)
        +searchVehicles(term)
        +updateVehicle(id, data)
    }

    BaseService <|-- CRUDService
    CRUDService <|-- InventoryService
    CRUDService <|-- MovementsService
    CRUDService <|-- VehiclesService

    note for BaseService "Manejo centralizado de errores\nValidación básica\nLogging estructurado"
    note for CRUDService "Operaciones CRUD estándar\nSuscripciones en tiempo real\nPaginación y filtrado"
```

## 🎨 **COMPONENTES - ARQUITECTURA UI**

```mermaid
graph TB
    subgraph "🎯 BASE COMPONENTS"
        A[BaseModal<br/>✅ 100% Tested] --> B[ModalHeader<br/>✅ Consistent UI]
        A --> C[ModalFooter<br/>✅ Action Buttons]

        D[PageLayout<br/>✅ 9/9 Migrated] --> E[PageHeader<br/>✅ Unified Headers]
        D --> F[StatsSection<br/>✅ Data Display]
        D --> G[FiltersSection<br/>✅ Search/Filter]
        D --> H[TableSection<br/>✅ Data Tables]
    end

    subgraph "🚗 DOMAIN COMPONENTS"
        I[VehiclesMain<br/>✅ Memoized] --> D
        I --> A

        J[InventoryMain<br/>✅ Optimized] --> D
        J --> K[InventoryModal<br/>✅ Integration Tests]

        L[MovementsMain<br/>✅ Performance] --> D
        L --> M[MovementWizard<br/>✅ Step-by-step]

        N[MaintenanceMain<br/>✅ Service Records] --> D
        N --> O[MaintenanceModal<br/>✅ Form Validation]
    end

    subgraph "🎛️ FORM SYSTEM"
        P[useFormData<br/>✅ 7/7 Modals] --> Q[validators.js<br/>✅ Centralized]
        M --> P
        K --> P
        O --> P
    end

    subgraph "🎨 VISUAL SYSTEM"
        R[useStatusColors<br/>✅ 7/7 Stats] --> S[designTokens.js<br/>✅ SAP Theme]
        T[CSS Critical<br/>✅ Inline Above-fold] --> S
    end

    classDef base fill:#e3f2fd
    classDef domain fill:#fff3e0
    classDef form fill:#e8f5e8
    classDef visual fill:#fce4ec

    class A,B,C,D,E,F,G,H base
    class I,J,K,L,M,N,O domain
    class P,Q form
    class R,S,T visual
```

## 📊 **FLUJO DE DATOS - TIEMPO REAL**

```mermaid
sequenceDiagram
    participant UI as 🖥️ UI Component
    participant Hook as 🎣 useCombustiblesCRUD
    participant Service as 🔧 BaseService
    participant FB as 🔥 Firestore
    participant Context as 📊 Context

    Note over UI,FB: CREATE OPERATION
    UI->>Hook: 1. createItem(data)
    Hook->>Service: 2. create(validatedData)
    Service->>FB: 3. addDoc(collection, data)
    FB-->>Service: 4. document reference
    Service-->>Hook: 5. success response
    Hook-->>UI: 6. optimistic update

    Note over FB,Context: REAL-TIME SYNC
    FB--)Context: 7. onSnapshot trigger
    Context--)UI: 8. context update
    UI->>UI: 9. re-render with fresh data

    Note over UI,FB: ERROR HANDLING
    FB--xService: 10. permission denied
    Service->>Service: 11. handleError(error)
    Service-->>Hook: 12. formatted error
    Hook-->>UI: 13. error state + rollback
```

## 🧪 **TESTING STRATEGY - COBERTURA ACTUAL**

```mermaid
pie title Testing Coverage Distribution
    "BaseService: 81%" : 81
    "Validators: 81%" : 81
    "FormData Hook: 86%" : 86
    "Modal Components: 100%" : 100
    "Integration Tests: 75%" : 75
    "E2E Coverage: 95%" : 95
    "Untested Services: 4%" : 4
```

## 🚀 **DEPLOYMENT & CI/CD**

```mermaid
graph LR
    subgraph "🔄 DEVELOPMENT"
        A[📝 Code Changes] --> B[🧪 Unit Tests]
        B --> C[🔧 Lint & TypeCheck]
        C --> D[🏗️ Build Process]
    end

    subgraph "✅ CI/CD PIPELINE"
        D --> E[🚀 Playwright E2E]
        E --> F[🔍 Smoke Tests]
        F --> G[📊 Coverage Report]
    end

    subgraph "🌐 DEPLOYMENT"
        G --> H[🏗️ Vite Build]
        H --> I[📦 Bundle Analysis]
        I --> J[🔥 Firebase Deploy]
    end

    subgraph "📈 MONITORING"
        J --> K[⚡ Core Web Vitals]
        K --> L[🐛 Error Tracking]
        L --> M[📊 Performance Metrics]
    end

    classDef dev fill:#e3f2fd
    classDef ci fill:#e8f5e8
    classDef deploy fill:#fff3e0
    classDef monitor fill:#fce4ec

    class A,B,C,D dev
    class E,F,G ci
    class H,I,J deploy
    class K,L,M monitor
```

## 📋 **ROADMAP DE ARQUITECTURA**

### ✅ **COMPLETADO**

- **Fase 1**: Base Components (BaseModal, PageLayout)
- **Fase 2**: CRUD Services & Validation System
- **Fase 3**: Performance Optimization (Core Web Vitals)
- **Testing**: E2E Playwright + Integration Tests

### 🔄 **EN PROGRESO**

- **Fase 4**: Testing Coverage (objetivo ≥80% global)
- **Monitoreo**: Performance tracking en producción

### 🎯 **PRÓXIMOS PASOS**

- **Fase 5**: PWA Features (Service Workers, Offline)
- **Fase 6**: Advanced Analytics & Reporting
- **Fase 7**: Mobile Responsive Optimization

---

**📌 Última actualización**: 2025-08-09
**📌 Versión**: Fase 3 - Performance & Testing Completada
**📌 Responsable**: Equipo Combustibles
