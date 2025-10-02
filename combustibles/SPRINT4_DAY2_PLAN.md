# 🚀 Sprint 4 - Día 2: Build Optimizations - Plan de Acción

**Fecha:** 2 de octubre de 2025  
**Sprint:** Sprint 4 - Performance Optimization  
**Objetivo del Día:** Reducir bundle size de 2.3 MB → 1.75 MB (-24%)

---

## 📋 RESUMEN DEL BASELINE (Día 1)

- **JS Total:** 1.9 MB
- **CSS Total:** 504 KB
- **Total Assets:** 2.3 MB
- **Performance Score Estimado:** 65-70
- **Problemas Críticos Identificados:**
  1. Firebase Firestore: 495 KB
  2. Firebase Auth: 193 KB
  3. App.jsx bundle: 115 KB
  4. Router + Framer Motion: 149 KB
  5. MovementWizard: 95 KB

---

## 🎯 OBJETIVOS DÍA 2

### Targets de Reducción
| Optimización | Reducción Esperada | Prioridad |
|--------------|-------------------|-----------|
| Firebase Imports | -300 KB | 🔴 P0 |
| Framer Motion Separation | -50 KB | 🔴 P0 |
| MovementWizard Splitting | -50 KB | 🔴 P0 |
| Manual Chunks Optimization | -100 KB | 🟡 P1 |
| Assets Compression | -50 KB | 🟡 P1 |
| **TOTAL** | **-550 KB (-24%)** | |

---

## 📝 PLAN DE EJECUCIÓN - DÍA 2

### ✅ Tarea 1: Auditar uso de lazyFirebase.js (30 min)

**Problema Identificado:**
- Existe `lazyFirebase.js` con lazy loading implementado
- Pero muchos componentes importan directamente desde `firebase/auth`, `firebase/firestore`
- Esto causa que Firebase se cargue inmediatamente en vez de lazy

**Acción:**
```bash
# Buscar todos los imports directos de Firebase
grep -r "from 'firebase/" combustibles/src/ --include="*.jsx" --include="*.js"

# Identificar componentes críticos que deberían usar lazyFirebase
# - AuthContext.jsx
# - CombustiblesContext.jsx
# - Services (inventoryService, maintenanceService, etc.)
```

**Resultado Esperado:**
- Lista de archivos que necesitan migración
- Priorización por impacto en LCP

---

### 🔴 Tarea 2: Optimizar imports de Firebase en componentes críticos (2h)

**Problema:**
Componentes cargan Firebase síncronamente en el critical path:

```javascript
// ❌ ACTUAL - carga síncrona
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
```

**Solución:**
```javascript
// ✅ OPTIMIZADO - lazy loading
import { loadFirebase } from '../firebase/lazyFirebase';

// En useEffect o función async
const firebase = await loadFirebase();
const { auth, db, onAuthStateChanged, doc, getDoc } = firebase;
```

**Archivos a Modificar (orden de prioridad):**

1. **src/contexts/AuthContext.jsx** (impacto en LCP)
   - Migrar onAuthStateChanged a lazy
   - Target: -50 KB en bundle inicial

2. **src/contexts/CombustiblesContext.jsx** (impacto en LCP)
   - Lazy load de Firestore queries
   - Target: -100 KB en bundle inicial

3. **src/services/inventoryService.js** (impacto medio)
   - Lazy load de operaciones CRUD
   - Target: -50 KB

4. **src/services/maintenanceService.js** (impacto medio)
   - Lazy load de operaciones CRUD
   - Target: -30 KB

5. **src/services/productsService.js** (impacto medio)
   - Lazy load de operaciones CRUD
   - Target: -30 KB

**Comando de Verificación:**
```bash
# Después de cada cambio, verificar bundle size
npm run build
ls -lh ../public/combustibles/assets/firebase-*.js
```

**Resultado Esperado:**
- `firebase-db-*.js`: 495 KB → 300 KB (-39%)
- `firebase-auth-*.js`: 193 KB → 150 KB (-22%)
- **Total reducción: -238 KB**

---

### 🔴 Tarea 3: Separar Framer Motion de Router chunk (1h)

**Problema:**
```javascript
// vite.config.js - ACTUAL
manualChunks: {
  router: ['react-router-dom', 'framer-motion'], // 149 KB juntos
}
```

**Solución:**
```javascript
// vite.config.js - OPTIMIZADO
manualChunks: {
  'vendor-react': ['react', 'react-dom'],
  'vendor-router': ['react-router-dom'], // ~80 KB
  'vendor-motion': ['framer-motion'],     // ~65 KB (lazy load)
  'vendor-firebase-core': ['firebase/app'],
  'vendor-firebase-auth': ['firebase/auth'],
  'vendor-firebase-db': ['firebase/firestore', 'firebase/storage'],
  'vendor-zustand': ['zustand'],
}
```

**Lazy Load de Framer Motion:**

Crear wrapper para motion components:

```javascript
// src/components/MotionComponents.jsx
import { lazy } from 'react';

export const MotionDiv = lazy(() => 
  import('framer-motion').then(module => ({
    default: module.motion.div
  }))
);

export const AnimatePresence = lazy(() =>
  import('framer-motion').then(module => ({
    default: module.AnimatePresence
  }))
);
```

**Archivos a Modificar:**
1. `vite.config.js` - Actualizar manualChunks
2. Crear `src/components/MotionComponents.jsx`
3. Actualizar imports en componentes que usan motion (buscar `from 'framer-motion'`)

**Resultado Esperado:**
- `vendor-router-*.js`: 149 KB → 80 KB (-46%)
- `vendor-motion-*.js`: 65 KB (lazy loaded, no en bundle inicial)
- **Total reducción: -69 KB del bundle inicial**

---

### 🔴 Tarea 4: Code Splitting de MovementWizard (2h)

**Problema:**
```javascript
// MovementWizard es un componente masivo
// MovementWizard-0a66d1cb.js: 95 KB
```

**Análisis del Wizard:**
El wizard tiene múltiples steps:
1. Tipo de movimiento
2. Vehículo
3. Cantidad/Precios
4. Confirmación

**Solución - Lazy Loading de Steps:**

```javascript
// src/components/Movements/MovementWizard.jsx

import { lazy, Suspense } from 'react';

// Lazy load de cada step
const MovementTypeStep = lazy(() => import('./steps/MovementTypeStep'));
const VehicleSelectionStep = lazy(() => import('./steps/VehicleSelectionStep'));
const QuantityPriceStep = lazy(() => import('./steps/QuantityPriceStep'));
const ConfirmationStep = lazy(() => import('./steps/ConfirmationStep'));

export default function MovementWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { component: MovementTypeStep },
    { component: VehicleSelectionStep },
    { component: QuantityPriceStep },
    { component: ConfirmationStep },
  ];
  
  const CurrentStepComponent = steps[currentStep].component;
  
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CurrentStepComponent />
    </Suspense>
  );
}
```

**Archivos a Crear:**
1. `src/components/Movements/steps/MovementTypeStep.jsx` (extraído)
2. `src/components/Movements/steps/VehicleSelectionStep.jsx` (extraído)
3. `src/components/Movements/steps/QuantityPriceStep.jsx` (extraído)
4. `src/components/Movements/steps/ConfirmationStep.jsx` (extraído)

**Resultado Esperado:**
- `MovementWizard-*.js`: 95 KB → 15 KB (solo shell)
- Steps individuales: ~20 KB cada uno (lazy loaded)
- **Total reducción: -80 KB del bundle inicial**

---

### 🟡 Tarea 5: Optimizar manualChunks en vite.config.js (1h)

**Configuración Actual:**
```javascript
manualChunks: {
  vendor: ['react', 'react-dom'],
  router: ['react-router-dom', 'framer-motion'],
  'firebase-core': ['firebase/app'],
  'firebase-auth': ['firebase/auth'],
  'firebase-db': ['firebase/firestore', 'firebase/storage'],
}
```

**Configuración Optimizada:**
```javascript
manualChunks: (id) => {
  // React core (crítico para LCP)
  if (id.includes('node_modules/react/') || 
      id.includes('node_modules/react-dom/')) {
    return 'vendor-react';
  }
  
  // Router (crítico)
  if (id.includes('node_modules/react-router-dom/')) {
    return 'vendor-router';
  }
  
  // Framer Motion (lazy)
  if (id.includes('node_modules/framer-motion/')) {
    return 'vendor-motion';
  }
  
  // Firebase (separado por módulo)
  if (id.includes('firebase/app')) {
    return 'vendor-firebase-core';
  }
  if (id.includes('firebase/auth')) {
    return 'vendor-firebase-auth';
  }
  if (id.includes('firebase/firestore') || id.includes('firebase/storage')) {
    return 'vendor-firebase-db';
  }
  
  // Zustand stores
  if (id.includes('/src/stores/')) {
    return 'stores';
  }
  
  // Todos los demás node_modules
  if (id.includes('node_modules/')) {
    return 'vendor-other';
  }
}
```

**Resultado Esperado:**
- Mejor granularidad de chunks
- Cache más eficiente (cambios en stores no invalidan vendor)
- **Reducción indirecta: -50 KB** por mejor deduplicación

---

### 🟡 Tarea 6: Optimizar Assets (Imágenes y Fonts) (1h)

#### 6.1 Auditar Imágenes Actuales

```bash
# Buscar todas las imágenes
find public/combustibles -name "*.jpg" -o -name "*.png" -o -name "*.jpeg"

# Verificar tamaños
du -sh public/combustibles/**/*.{jpg,png,jpeg,svg}
```

#### 6.2 Convertir a WebP

**Script de Optimización:**

```javascript
// scripts/optimize-images.js
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

const IMAGES_DIR = './public/combustibles/assets/images';
const QUALITY = 85;

async function optimizeImages() {
  const files = await readdir(IMAGES_DIR);
  
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const inputPath = join(IMAGES_DIR, file);
      const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(outputPath);
      
      console.log(`✅ Optimizado: ${file} → ${file.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`);
    }
  }
}

optimizeImages().catch(console.error);
```

**Instalación:**
```bash
npm install -D sharp
```

**Ejecución:**
```bash
node scripts/optimize-images.js
```

#### 6.3 Implementar <picture> con Fallback

```jsx
// Componente reutilizable
export function OptimizedImage({ src, alt, className }) {
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} className={className} loading="lazy" />
    </picture>
  );
}
```

#### 6.4 Optimizar Fonts

**Actualizar en index.html:**
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>

<!-- Font display swap -->
<style>
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter.woff2') format('woff2');
    font-display: swap; /* Evita FOIT */
  }
</style>
```

**Resultado Esperado:**
- Imágenes: -30% size con WebP
- Fonts: Mejor FCP con font-display: swap
- **Total reducción: -50 KB en assets**

---

## 🧪 TESTING Y VALIDACIÓN

### Después de Cada Tarea

```bash
# 1. Build
npm run build

# 2. Verificar bundle size
ls -lh ../public/combustibles/assets/*.js | sort -k5 -h

# 3. Calcular totales
du -ch ../public/combustibles/assets/*.js | tail -1

# 4. Tests no se rompan
npm run test:all

# 5. Verificar app funciona
npm run preview
# Abrir http://localhost:4173/combustibles/
```

### Checklist de Validación

- [ ] Build exitoso sin errores
- [ ] Todos los tests pasan (298 tests)
- [ ] Bundle JS reducido > 20%
- [ ] App carga correctamente
- [ ] No hay errores en consola
- [ ] Navegación funciona
- [ ] Wizards funcionan
- [ ] Firebase queries funcionan

---

## 📊 MÉTRICAS DE ÉXITO DÍA 2

### Targets

| Métrica | Baseline | Target Día 2 | Reducción |
|---------|----------|--------------|-----------|
| **JS Total** | 1.9 MB | 1.35 MB | **-29%** |
| **Bundle Inicial** | ~800 KB | ~500 KB | **-38%** |
| **Firebase DB** | 495 KB | 300 KB | **-39%** |
| **Firebase Auth** | 193 KB | 150 KB | **-22%** |
| **MovementWizard** | 95 KB | 15 KB | **-84%** |
| **Router Chunk** | 149 KB | 80 KB | **-46%** |

### Lighthouse Scores Esperados

| Métrica | Baseline | Target Post-Día 2 | Mejora |
|---------|----------|-------------------|--------|
| **Performance** | 65-70 | 75-80 | **+10-15** |
| **LCP** | 3.5-4.0s | 2.8-3.2s | **-0.7s** |
| **FCP** | 2.0-2.5s | 1.5-1.8s | **-0.5s** |

---

## 📝 ENTREGABLES DÍA 2

### Documentos

1. **SPRINT4_DAY2_PROGRESS.md** - Progress report con métricas
2. **BUNDLE_COMPARISON.md** - Comparación antes/después
3. Scripts en `/scripts`:
   - `optimize-images.js`
   - `analyze-bundle.js`

### Código

1. **Firebase Optimization**
   - Migración a `lazyFirebase.js` en contextos críticos
   
2. **Framer Motion Separation**
   - Nuevo `manualChunks` en vite.config.js
   - `MotionComponents.jsx` wrapper

3. **MovementWizard Splitting**
   - 4 archivos de steps separados
   - Wizard shell con lazy loading

4. **Assets Optimization**
   - Imágenes convertidas a WebP
   - Fonts optimizados con preload

---

## 🚀 COMANDO PARA EMPEZAR DÍA 2

```bash
# 1. Baseline actual
cd /home/hp/Documents/forestech/combustibles
npm run build
echo "📦 Baseline:" && du -ch ../public/combustibles/assets/*.js | tail -1

# 2. Crear branch para cambios
git checkout -b sprint4/day2-build-optimizations

# 3. Empezar con Tarea 1
grep -r "from 'firebase/" src/ --include="*.jsx" --include="*.js" | wc -l
echo "👆 Archivos con imports directos de Firebase"

# 4. Continuar con Tarea 2...
```

---

**Documento creado:** 2 de octubre de 2025  
**Duración estimada:** 7 horas  
**Próxima revisión:** Fin de Día 2 - Crear SPRINT4_DAY2_COMPLETED.md  
**Estado:** 📋 PLAN LISTO PARA EJECUCIÓN
