# 🚀 PLAYBOOK PERFORMANCE & TESTING AVANZADO

## 📋 **ÍNDICE RÁPIDO**

- [🎯 Core Web Vitals](#-core-web-vitals)
- [⚡ Performance Optimization](#-performance-optimization)
- [🧪 Testing Strategy](#-testing-strategy)
- [🔧 Tools & Scripts](#-tools--scripts)
- [📊 Monitoring](#-monitoring)
- [🚨 Troubleshooting](#-troubleshooting)

---

## 🎯 **CORE WEB VITALS**

### **🎯 TARGETS ESTABLECIDOS**

| Métrica | Target  | Estado Actual | Técnicas Implementadas              |
| ------- | ------- | ------------- | ----------------------------------- |
| **LCP** | < 2.5s  | ✅ Optimizado | Preload crítico + bundle splitting  |
| **CLS** | < 0.1   | ✅ Estable    | CSS inline + dimensiones explícitas |
| **FCP** | < 3.4s  | ✅ Rápido     | Firebase lazy + tree-shaking        |
| **INP** | < 200ms | ✅ Responsive | Event delegation + debouncing       |

### **🔧 IMPLEMENTACIÓN TÉCNICA**

#### **LCP Optimization**

```javascript
// 1. Preload imagen crítica
<link rel="preload" href="critical-bg.jpg" as="image">

// 2. Resource hints
<link rel="dns-prefetch" href="//firebasestorage.googleapis.com">
<link rel="preconnect" href="https://fonts.googleapis.com">

// 3. Code splitting crítico
const InventoryMain = lazy(() => import('./Inventory/InventoryMain'));
const MovementWizard = lazy(() => import('./Movements/MovementWizard'));
```

#### **CLS Prevention**

```css
/* CSS crítico inline */
.stats-card {
  min-height: 120px; /* Previene layout shift */
  aspect-ratio: 16/9; /* Dimensiones estables */
}

.modal-overlay {
  position: fixed; /* Evita reflow */
  inset: 0;
}
```

#### **Bundle Analysis Commands**

```bash
# Generar análisis de bundle
npm run build
npx vite-bundle-analyzer dist

# Verificar chunks
ls -la public/combustibles/assets/

# Lighthouse local
npx lighthouse http://localhost:5174 --output html --output-path ./logs/
```

---

## ⚡ **PERFORMANCE OPTIMIZATION**

### **📦 BUNDLE SPLITTING STRATEGY**

```javascript
// vite.config.js - Configuración optimizada
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase-core': ['firebase/app'],
          'firebase-auth': ['firebase/auth'],
          'firebase-db': ['firebase/firestore'],
          'ui-components': ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },
});
```

### **🧠 MEMOIZATION PATTERNS**

#### **Component Memoization**

```javascript
// ✅ CORRECTO - Memo con dependencias estables
const InventoryTable = React.memo(({ data, onUpdate }) => {
  const memoizedRows = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        totalValue: item.quantity * item.unitPrice,
      })),
    [data]
  );

  const handleUpdate = useCallback(
    (id, updates) => {
      onUpdate(id, updates);
    },
    [onUpdate]
  );

  return <Table rows={memoizedRows} onRowUpdate={handleUpdate} />;
});

// ❌ EVITAR - Memo sin beneficio
const SimpleButton = React.memo(({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
));
```

#### **Hook Optimization**

```javascript
// ✅ CORRECTO - useCallback para handlers estables
const useVehicleActions = () => {
  const updateVehicle = useCallback(async (id, data) => {
    return await vehiclesService.update(id, data);
  }, []);

  const deleteVehicle = useCallback(async (id) => {
    return await vehiclesService.delete(id);
  }, []);

  return { updateVehicle, deleteVehicle };
};
```

### **🔄 LAZY LOADING IMPLEMENTATION**

```javascript
// Lazy contexts - Diferir inicialización
const AuthContextLazy = lazy(() =>
  import('./contexts/AuthContext').then((module) => ({
    default: module.AuthProvider,
  }))
);

// Lazy services - Carga bajo demanda
const loadFirebaseServices = async () => {
  const [auth, db] = await Promise.all([import('firebase/auth'), import('firebase/firestore')]);
  return { auth, db };
};
```

### **📊 PERFORMANCE MONITORING**

```javascript
// webVitals.js - Monitoring integrado
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric) => {
  console.log(`📊 ${metric.name}: ${metric.value}ms`);

  // Solo en producción
  if (process.env.NODE_ENV === 'production') {
    // Enviar a servicio de analytics
    analytics.track('web_vital', metric);
  }
};

// Registrar todas las métricas
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

## 🧪 **TESTING STRATEGY**

### **📊 COVERAGE TARGETS**

| Tipo           | Target | Actual    | Archivos Críticos   |
| -------------- | ------ | --------- | ------------------- |
| **Global**     | ≥80%   | 10.59%    | Necesita mejora     |
| **Services**   | ≥90%   | Variables | BaseService: 81% ✅ |
| **Components** | ≥70%   | Variables | Modals: 100% ✅     |
| **Utils**      | ≥85%   | 81.35%    | validators.js ✅    |

### **🏗️ TESTING ARCHITECTURE**

```javascript
// TestProviders.jsx - Setup unificado
export const TestProviders = ({ children }) => (
  <BrowserRouter>
    <CombustiblesProvider>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </CombustiblesProvider>
  </BrowserRouter>
);

// Hook de testing para servicios
export const renderWithProviders = (component, options = {}) => {
  return render(component, {
    wrapper: TestProviders,
    ...options,
  });
};
```

### **⚡ E2E TESTING PATTERNS**

#### **Page Object Model**

```javascript
// pages/InventoryPage.js
class InventoryPage {
  constructor(page) {
    this.page = page;
    this.addButton = page.locator('button:has-text("Nuevo")');
    this.table = page.locator('[data-testid="inventory-table"]');
    this.modal = page.locator('[data-testid="inventory-modal"]');
  }

  async addNewItem(itemData) {
    await this.addButton.click();
    await this.fillForm(itemData);
    await this.saveItem();
  }

  async fillForm(data) {
    await this.page.fill('[name="fuelType"]', data.fuelType);
    await this.page.fill('[name="quantity"]', data.quantity.toString());
    await this.page.fill('[name="unitPrice"]', data.unitPrice.toString());
  }
}

// En tests
test('debe crear item de inventario', async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addNewItem({
    fuelType: 'gasolina-corriente',
    quantity: 1000,
    unitPrice: 15000,
  });

  await expect(inventoryPage.table).toContainText('gasolina-corriente');
});
```

### **🎯 TESTING COMMANDS**

```bash
# Testing local completo
npm run test:coverage      # Cobertura detallada
npm run test:watch         # Modo desarrollo
npm run test:ui           # UI interactiva

# E2E Testing
npm run e2e               # Tests completos
npm run e2e:headed        # Con navegador visible
npm run e2e:smoke         # Solo smoke tests
npm run e2e:movement-flow # Test específico

# CI Testing
npm run test:ci           # Formato CI
npm run e2e:ci            # E2E para CI
```

### **🔧 MOCKING STRATEGIES**

```javascript
// Firebase mocking
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ _type: 'collection' })),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  // Agregar getFirestore para evitar errores
  getFirestore: vi.fn(() => ({ _type: 'firestore' })),
}));

// Service mocking con datos realistas
const mockInventoryData = [
  {
    id: '1',
    fuelType: 'gasolina-corriente',
    quantity: 1000,
    unitPrice: 15000,
    location: 'tanque-principal',
    status: 'disponible',
  },
];
```

---

## 🔧 **TOOLS & SCRIPTS**

### **📊 PERFORMANCE SCRIPTS**

```json
// package.json - Scripts de performance
{
  "scripts": {
    "perf:build": "npm run build && npm run bundle-analyzer",
    "perf:lighthouse": "lighthouse http://localhost:5174 --output html",
    "perf:audit": "npm run perf:build && npm run perf:lighthouse",
    "bundle-analyzer": "npx vite-bundle-analyzer dist",
    "webvitals": "node scripts/measure-vitals.js"
  }
}
```

```javascript
// scripts/measure-vitals.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function measureVitals() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  const runnerResult = await lighthouse('http://localhost:5174', options);

  const { lcp, cls, fcp } = runnerResult.lhr.audits;

  console.log('🎯 Core Web Vitals:');
  console.log(`LCP: ${lcp.numericValue}ms`);
  console.log(`CLS: ${cls.numericValue}`);
  console.log(`FCP: ${fcp.numericValue}ms`);

  await chrome.kill();
}

measureVitals().catch(console.error);
```

### **🧪 TESTING UTILITIES**

```javascript
// test/helpers/dataGenerators.js
export const generateVehicleData = (overrides = {}) => ({
  licensePlate: `ABC${Math.floor(Math.random() * 1000)}`,
  brand: 'Toyota',
  model: 'Hilux',
  year: 2022,
  category: 'camioneta',
  fuelType: 'gasolina-corriente',
  fuelCapacity: 80,
  status: 'activo',
  ...overrides,
});

export const generateInventoryData = (overrides = {}) => ({
  fuelType: 'gasolina-corriente',
  quantity: 1000,
  unitPrice: 15000,
  location: 'tanque-principal',
  status: 'disponible',
  ...overrides,
});
```

### **🔍 DEBUGGING TOOLS**

```javascript
// utils/performanceProfiler.js
class PerformanceProfiler {
  static measure(name, fn) {
    return async (...args) => {
      const start = performance.now();
      const result = await fn.apply(this, args);
      const end = performance.now();

      console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`);
      return result;
    };
  }

  static startProfiler(name) {
    performance.mark(`${name}-start`);
  }

  static endProfiler(name) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const measures = performance.getEntriesByName(name);
    console.log(`📊 ${name}: ${measures[0].duration.toFixed(2)}ms`);
  }
}

// Uso en servicios críticos
const createMovement = PerformanceProfiler.measure('createMovement', async (data) => {
  // Lógica del servicio
});
```

---

## 📊 **MONITORING**

### **🎯 MÉTRICAS CLAVE**

```javascript
// monitoring/performanceMonitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.initializeMonitoring();
  }

  initializeMonitoring() {
    // Observer para Long Tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            console.warn(`🐌 Long Task: ${entry.duration}ms`);
            this.trackMetric('longTask', entry.duration);
          }
        });
      });

      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }

    // Monitor bundle loading
    this.monitorChunkLoading();
  }

  monitorChunkLoading() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('chunk')) {
          console.log(`📦 Chunk loaded: ${entry.name} (${entry.duration}ms)`);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }

  trackMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name).push({
      value,
      timestamp: Date.now(),
    });
  }

  getReport() {
    const report = {};
    this.metrics.forEach((values, key) => {
      report[key] = {
        count: values.length,
        avg: values.reduce((a, b) => a + b.value, 0) / values.length,
        max: Math.max(...values.map((v) => v.value)),
        min: Math.min(...values.map((v) => v.value)),
      };
    });
    return report;
  }
}

// Inicializar en main.jsx
const performanceMonitor = new PerformanceMonitor();

// Exportar métricas cada 5 minutos
setInterval(
  () => {
    console.log('📊 Performance Report:', performanceMonitor.getReport());
  },
  5 * 60 * 1000
);
```

### **🔍 ERROR MONITORING**

```javascript
// monitoring/errorTracker.js
class ErrorTracker {
  constructor() {
    this.setupErrorHandlers();
  }

  setupErrorHandlers() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
      });
    });

    // React Error Boundary integration
    this.setupReactErrorBoundary();
  }

  trackError(errorData) {
    console.error('🚨 Error tracked:', errorData);

    // Solo en producción
    if (process.env.NODE_ENV === 'production') {
      // Enviar a servicio de monitoring
      this.sendToAnalytics(errorData);
    }
  }

  sendToAnalytics(data) {
    // Integración con servicio de analytics
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {
      // Silenciar errores del error tracker
    });
  }
}
```

---

## 🚨 **TROUBLESHOOTING**

### **🐛 PROBLEMAS COMUNES**

#### **Bundle Size Issues**

```bash
# Diagnosticar bundle grande
npm run build
npx vite-bundle-analyzer dist

# Soluciones:
# 1. Verificar imports dinámicos
# 2. Revisar dependencias no utilizadas
# 3. Configurar tree-shaking correctamente
```

#### **Memory Leaks**

```javascript
// Detectar memory leaks
const detectMemoryLeaks = () => {
  let baseline = performance.memory?.usedJSHeapSize;

  setInterval(() => {
    const current = performance.memory?.usedJSHeapSize;
    const diff = current - baseline;

    if (diff > 50 * 1024 * 1024) {
      // 50MB
      console.warn('🚨 Potential memory leak detected');
      console.log(`Memory usage increased by ${diff / 1024 / 1024}MB`);
    }

    baseline = current;
  }, 30000); // Check every 30 seconds
};

// Ejecutar solo en desarrollo
if (process.env.NODE_ENV === 'development') {
  detectMemoryLeaks();
}
```

#### **Performance Regression**

```bash
# Performance benchmark
npm run perf:audit

# Comparar con baseline
diff logs/lighthouse-baseline.json logs/lighthouse-current.json

# Acciones correctivas:
# 1. Verificar nuevas dependencias pesadas
# 2. Revisar componentes no memoizados
# 3. Validar lazy loading efectivo
```

### **🎯 CHECKLIST DE OPTIMIZACIÓN**

#### **Before Deploy**

- [ ] Bundle analysis ejecutado
- [ ] Core Web Vitals verificados
- [ ] E2E tests passing
- [ ] No memory leaks detectados
- [ ] Error tracking configurado

#### **Performance Audit**

- [ ] LCP < 2.5s ✅
- [ ] CLS < 0.1 ✅
- [ ] FCP < 3.4s ✅
- [ ] Bundle size optimizado
- [ ] Critical CSS inline
- [ ] Images optimizadas

#### **Testing Coverage**

- [ ] Unit tests ≥80% global
- [ ] Integration tests críticos
- [ ] E2E flows principales
- [ ] Smoke tests automatizados
- [ ] Error scenarios cubiertos

---

## 📚 **RECURSOS Y REFERENCIAS**

### **🔗 Links Útiles**

- [Web Vitals Guide](https://web.dev/vitals/)
- [React Performance](https://react.dev/reference/react/memo)
- [Playwright Documentation](https://playwright.dev/)
- [Vite Bundle Analysis](https://vitejs.dev/guide/build.html#build-optimization)

### **📊 Herramientas Recomendadas**

- **Lighthouse CI**: Automated performance monitoring
- **Bundle Analyzer**: Webpack/Vite bundle analysis
- **React DevTools Profiler**: Component performance
- **Chrome DevTools**: Core debugging

### **🎯 Métricas de Referencia**

- **Good Performance**: All Core Web Vitals in green
- **Acceptable**: 75th percentile targets met
- **Needs Improvement**: Any red metrics require attention

---

**📌 Última actualización**: 2025-08-09
**📌 Versión**: Fase 3 - Performance & Testing Guide
**📌 Responsable**: Equipo Combustibles
