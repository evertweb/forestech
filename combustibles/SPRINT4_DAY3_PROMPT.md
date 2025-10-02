# 🚀 SPRINT 4 - DÍA 3: Runtime Optimizations & Code Cleanup

**Fecha de Creación:** 2 de octubre de 2025  
**Sprint:** Sprint 4 - Performance Optimization  
**Fase:** Fase 2 - Modernización y Optimización  
**Duración Estimada:** 6 horas  
**Precedente:** Día 2 completado (Bundle inicial: -31%, App.jsx: -68%, MovementWizard: -84%)

---

## 📋 CONTEXTO COMPLETO

Eres un agente de IA especializado en optimización de performance web y React. Tu tarea es completar el **Día 3: Runtime Optimizations & Code Cleanup** del Sprint 4.

### Estado Actual (Post-Día 2)

**Progreso del Sprint 4:** 50% completado

```
✅ DÍA 1: Análisis y Baseline (100%)
  - Bundle analysis: 1.9 MB JS, 504 KB CSS
  - Problemas identificados
  - Plan de acción creado

✅ DÍA 2: Build Optimizations (100%)
  - App.jsx: 115 KB → 37 KB (-68%)
  - MovementWizard: 93 KB → 15 KB shell (-84%)
  - Bundle inicial: 800 KB → 550 KB (-31%)
  - Firebase optimizado: -92 KB total

📋 DÍA 3: Runtime Optimizations (TU TAREA)
  - Limpieza de código legacy
  - React.memo implementation
  - useMemo/useCallback
  - Zustand optimizations
  - Lighthouse audit intermedio

📋 DÍA 4: CI/CD & Monitoring (SIGUIENTE)
  - Lighthouse CI
  - Web Vitals
  - Performance budget
```

### Métricas Actuales

| Métrica | Baseline | Post-Día 2 | Target Final | Gap |
|---------|----------|------------|--------------|-----|
| **Performance Score** | 65-70 | 75-80* | 90+ | +10-15 |
| **LCP** | 3.5-4.0s | 2.8-3.2s* | <2.5s | -0.3-0.7s |
| **Bundle Inicial** | 800 KB | 550 KB | <500 KB | -50 KB |
| **Re-renders** | Baseline | Sin optimizar | -40% | -40% |

*Estimado - Requiere Lighthouse audit

---

## 🗑️ TAREA 1: LIMPIEZA DE CÓDIGO LEGACY (1h - Alta Prioridad)

### Objetivo

Eliminar código legacy/duplicado identificado para:
- Reducir bundle size adicional (~50 KB)
- Mejorar mantenibilidad
- Eliminar confusión en el codebase

### Archivos a Eliminar

#### 1.1 Componentes Auth Duplicados (6 archivos, ~50 KB)

**Comando de Verificación (ejecutar ANTES de eliminar):**
```bash
cd /home/hp/Documents/forestech/combustibles

# Verificar qué Auth components están en uso
echo "=== VERIFICANDO USO DE AUTH COMPONENTS ==="
grep -r "import.*Auth" src/ --include="*.jsx" --include="*.js" | grep -v "node_modules"

# Debe mostrar solo:
# - AuthProvider (contexts)
# - AuthVisualEnhanced (App.jsx)
# Los demás NO deben estar importados
```

**Archivos a Eliminar:**
```bash
# ⚠️ IMPORTANTE: Verificar que solo AuthVisualEnhanced.jsx esté en uso

# 1. Auth components legacy
rm src/components/Auth/AuthVisualEnhancedNew.jsx
rm src/components/Auth/AuthVisualEnhancedFixed.jsx
rm src/components/Auth/AuthVisualEnhancedClean.jsx
rm src/components/Auth/Auth-backup.jsx
rm src/components/Auth/Auth.jsx

# 2. CSS legacy
rm src/components/Auth/AuthVisualEnhancedNew.css
rm src/components/Auth/Auth.css

# 3. Test setup deprecated
rm src/test/setupTests.js  # (setupTests.jsx es el correcto)

echo "✅ Limpieza completada - Ejecutar build para verificar"
```

**Validación Post-Limpieza:**
```bash
# Build debe funcionar sin errores
npm run build

# Si hay errores, significa que algo se estaba usando
# En ese caso, DESHACER con git:
git checkout HEAD -- src/components/Auth/*.jsx src/components/Auth/*.css src/test/setupTests.js
```

#### 1.2 Documentar Limpieza

```bash
# Crear commit con limpieza
git add -A
git commit -m "🗑️ Sprint 4 Day 3: Remove legacy Auth components and deprecated test setup

- Remove 5 legacy Auth component variants (AuthVisualEnhancedNew, Fixed, Clean, backup, old Auth.jsx)
- Remove 2 legacy CSS files
- Remove deprecated setupTests.js (setupTests.jsx is correct)
- Impact: -50 KB bundle size
- All tests passing, build successful"
```

### Resultado Esperado

- ✅ 8 archivos legacy eliminados
- ✅ Build exitoso sin errores
- ✅ Bundle size: -50 KB adicional
- ✅ Codebase más limpio y mantenible

---

## ⚛️ TAREA 2: REACT.MEMO OPTIMIZATION (2h - Alta Prioridad)

### Objetivo

Reducir re-renders innecesarios en componentes pesados implementando `React.memo` con comparadores personalizados.

### 2.1 Identificar Componentes Candidatos

**Criterios para React.memo:**
- Componentes que renderizan listas grandes (>10 items)
- Componentes que reciben props complejas (arrays, objects)
- Componentes hijo que no necesitan re-render cuando parent cambia

**Buscar candidatos:**
```bash
# Buscar componentes que renderizan listas
grep -r "\.map\(" src/components/ --include="*.jsx" -A 2 -B 2 | grep "return"

# Componentes principales a optimizar (basado en análisis previo):
# 1. MovementsTable (renderiza lista de movimientos)
# 2. VehiclesList (renderiza lista de vehículos)
# 3. InventoryCards (renderiza cards de inventario)
# 4. ProductsList (renderiza lista de productos)
# 5. SuppliersList (renderiza lista de proveedores)
```

### 2.2 Implementar React.memo en Componentes Pesados

#### Ejemplo 1: MovementsTable

```javascript
// ANTES (sin optimización)
export default function MovementsTable({ movements, onEdit, onDelete }) {
  return (
    <table>
      {movements.map(movement => (
        <tr key={movement.id}>
          <td>{movement.date}</td>
          <td>{movement.type}</td>
          {/* ... */}
        </tr>
      ))}
    </table>
  );
}

// DESPUÉS (con React.memo)
import React from 'react';

const MovementsTable = React.memo(
  function MovementsTable({ movements, onEdit, onDelete }) {
    return (
      <table>
        {movements.map(movement => (
          <tr key={movement.id}>
            <td>{movement.date}</td>
            <td>{movement.type}</td>
            {/* ... */}
          </tr>
        ))}
      </table>
    );
  },
  // Comparador personalizado para evitar re-renders innecesarios
  (prevProps, nextProps) => {
    // Solo re-render si movements array cambió
    return (
      prevProps.movements === nextProps.movements &&
      prevProps.onEdit === nextProps.onEdit &&
      prevProps.onDelete === nextProps.onDelete
    );
  }
);

export default MovementsTable;
```

#### Ejemplo 2: VehiclesList

```javascript
// src/components/Vehicles/VehiclesList.jsx

import React from 'react';

const VehiclesList = React.memo(
  function VehiclesList({ vehicles, onSelect, selectedId }) {
    console.log('🚗 VehiclesList render'); // Debug log para verificar re-renders
    
    return (
      <div className="vehicles-list">
        {vehicles.map(vehicle => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            isSelected={vehicle.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.vehicles === nextProps.vehicles &&
      prevProps.selectedId === nextProps.selectedId
    );
  }
);

export default VehiclesList;
```

### 2.3 Lista de Componentes a Optimizar

Aplicar `React.memo` en estos componentes (en orden de prioridad):

1. **src/components/Movements/MovementsTable.jsx** (impacto: alto)
2. **src/components/Vehicles/VehiclesMain.jsx o VehiclesList** (impacto: alto)
3. **src/components/Inventory/InventoryCards.jsx** (impacto: medio)
4. **src/components/Products/ProductsList.jsx** (impacto: medio)
5. **src/components/Suppliers/SuppliersList.jsx** (impacto: medio)

### 2.4 Verificar Mejoras

**Antes de aplicar React.memo:**
```bash
# Ejecutar app en modo desarrollo
npm run dev:combustibles

# Abrir React DevTools Profiler
# 1. Navegar a una ruta con lista grande (Movements, Vehicles)
# 2. Hacer una acción que cause re-render del parent
# 3. Observar cuántos componentes hijo re-renderizan

# Ejemplo: En Movements, cambiar un filtro debería re-renderizar SOLO
# el componente de filtro, NO la tabla completa
```

**Después de aplicar React.memo:**
```bash
# Repetir el mismo test
# Verificar que los componentes memoizados NO re-renderizan
# cuando sus props no cambian

# Expected: Reducción de 40-60% en re-renders
```

### Resultado Esperado

- ✅ 5+ componentes optimizados con React.memo
- ✅ -40% de re-renders innecesarios
- ✅ Mejor performance percibida en listas grandes
- ✅ Logs de debug agregados para monitoring

---

## 🧮 TAREA 3: USEMEMO Y USECALLBACK (2h - Media Prioridad)

### Objetivo

Optimizar cálculos costosos y funciones callback para evitar recreación innecesaria.

### 3.1 Identificar Candidatos para useMemo

**Buscar cálculos costosos:**
```bash
# Buscar operaciones de sort, filter, reduce en componentes
grep -r "\.sort\|\.filter\|\.reduce\|\.map" src/components/ --include="*.jsx" -B 3 -A 1

# Buscar cálculos dentro de componentes (fuera de useEffect)
```

### 3.2 Implementar useMemo

#### Ejemplo 1: Ordenamiento de Movimientos

```javascript
// ANTES (recalcula en cada render)
function MovementsMain() {
  const movements = useMovementsStore(state => state.movements);
  
  const sortedMovements = movements.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  return <MovementsTable movements={sortedMovements} />;
}

// DESPUÉS (con useMemo)
import { useMemo } from 'react';

function MovementsMain() {
  const movements = useMovementsStore(state => state.movements);
  
  const sortedMovements = useMemo(() => {
    console.log('🔄 Recalculando sorted movements');
    return movements.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  }, [movements]); // Solo recalcular si movements cambia
  
  return <MovementsTable movements={sortedMovements} />;
}
```

#### Ejemplo 2: Filtrado de Inventario

```javascript
// src/components/Inventory/InventoryMain.jsx

import { useMemo } from 'react';

function InventoryMain() {
  const inventory = useInventoryStore(state => state.inventory);
  const [filter, setFilter] = useState('all');
  
  // Memoizar filtrado costoso
  const filteredInventory = useMemo(() => {
    console.log('🔄 Filtering inventory');
    
    if (filter === 'all') return inventory;
    
    if (filter === 'low-stock') {
      return inventory.filter(item => {
        const percentage = (item.currentStock / item.maxCapacity) * 100;
        return percentage < 15;
      });
    }
    
    return inventory.filter(item => item.fuelType === filter);
  }, [inventory, filter]);
  
  return <InventoryCards items={filteredInventory} />;
}
```

### 3.3 Implementar useCallback

#### Ejemplo 1: Callbacks de Eventos

```javascript
// ANTES (función se recrea en cada render)
function MovementsMain() {
  const movements = useMovementsStore(state => state.movements);
  const deleteMovement = useMovementsStore(state => state.deleteMovement);
  
  const handleDelete = (id) => {
    if (confirm('¿Eliminar movimiento?')) {
      deleteMovement(id);
    }
  };
  
  return <MovementsTable movements={movements} onDelete={handleDelete} />;
}

// DESPUÉS (con useCallback)
import { useCallback } from 'react';

function MovementsMain() {
  const movements = useMovementsStore(state => state.movements);
  const deleteMovement = useMovementsStore(state => state.deleteMovement);
  
  const handleDelete = useCallback((id) => {
    if (confirm('¿Eliminar movimiento?')) {
      deleteMovement(id);
    }
  }, [deleteMovement]); // Solo recrear si deleteMovement cambia
  
  return <MovementsTable movements={movements} onDelete={handleDelete} />;
}
```

### 3.4 Lista de Optimizaciones a Implementar

**useMemo (5+ lugares):**
1. Ordenamiento de movements (MovementsMain.jsx)
2. Filtrado de inventory (InventoryMain.jsx)
3. Cálculo de estadísticas (Dashboard.jsx)
4. Filtrado de vehicles (VehiclesMain.jsx)
5. Cálculo de totales (ReportsMain.jsx)

**useCallback (5+ lugares):**
1. Event handlers en listas (onDelete, onEdit, onSelect)
2. Callbacks pasados a componentes memoizados
3. Funciones en custom hooks que se pasan como deps

### Resultado Esperado

- ✅ 10+ optimizaciones (5 useMemo + 5 useCallback)
- ✅ -20% de cálculos redundantes
- ✅ Mejor performance en navegación
- ✅ Callbacks estables para React.memo

---

## 🐻 TAREA 4: ZUSTAND OPTIMIZATIONS (1h - Media Prioridad)

### Objetivo

Optimizar selectores de Zustand stores para evitar re-renders innecesarios cuando partes del store que no se usan cambian.

### 4.1 Problema Actual

```javascript
// ❌ MAL - Re-render cuando CUALQUIER parte del store cambia
const store = useMovementsStore();
// Ahora el componente re-renderiza si movements, loading, error, etc. cambian

// ✅ BIEN - Solo re-render cuando movements cambia
const movements = useMovementsStore(state => state.movements);
```

### 4.2 Auditar Uso de Stores

```bash
# Buscar uso de stores sin selectores específicos
grep -r "useMovementsStore()" src/components/ --include="*.jsx"
grep -r "useVehiclesStore()" src/components/ --include="*.jsx"
grep -r "useInventoryStore()" src/components/ --include="*.jsx"

# Todos deberían tener selectores específicos:
# useMovementsStore(state => state.movements)
```

### 4.3 Implementar Selectores Optimizados

#### Ejemplo 1: Selector Simple

```javascript
// ANTES
function MovementsTable() {
  const store = useMovementsStore(); // ❌ Re-render en cualquier cambio
  
  return (
    <table>
      {store.movements.map(m => <tr key={m.id}>...</tr>)}
    </table>
  );
}

// DESPUÉS
function MovementsTable() {
  const movements = useMovementsStore(state => state.movements); // ✅ Solo movements
  
  return (
    <table>
      {movements.map(m => <tr key={m.id}>...</tr>)}
    </table>
  );
}
```

#### Ejemplo 2: Múltiples Selectores

```javascript
// ANTES
function MovementsMain() {
  const store = useMovementsStore(); // ❌ Re-render en cualquier cambio
  
  return (
    <div>
      <h1>Movimientos</h1>
      {store.loading && <Spinner />}
      {store.error && <Error message={store.error} />}
      <MovementsTable movements={store.movements} />
    </div>
  );
}

// DESPUÉS
function MovementsMain() {
  // ✅ Selectores específicos
  const movements = useMovementsStore(state => state.movements);
  const loading = useMovementsStore(state => state.loading);
  const error = useMovementsStore(state => state.error);
  
  return (
    <div>
      <h1>Movimientos</h1>
      {loading && <Spinner />}
      {error && <Error message={error} />}
      <MovementsTable movements={movements} />
    </div>
  );
}
```

#### Ejemplo 3: Selector con Shallow Compare

```javascript
import { shallow } from 'zustand/shallow';

// Para seleccionar múltiples valores
function Dashboard() {
  const { movements, vehicles, inventory } = useMovementsStore(
    state => ({
      movements: state.movements,
      vehicles: state.vehicles,
      inventory: state.inventory,
    }),
    shallow // Comparación superficial de objeto
  );
  
  return <DashboardStats data={{ movements, vehicles, inventory }} />;
}
```

### 4.4 Lista de Archivos a Revisar

1. src/components/Movements/MovementsMain.jsx
2. src/components/Vehicles/VehiclesMain.jsx
3. src/components/Inventory/InventoryMain.jsx
4. src/components/Dashboard/Dashboard.jsx
5. src/components/Reports/ReportsMain.jsx

### Resultado Esperado

- ✅ Todos los componentes usan selectores específicos
- ✅ -30% de re-renders innecesarios
- ✅ Mejor performance con stores grandes

---

## 🔍 TAREA 5: LIGHTHOUSE AUDIT INTERMEDIO (1h - Alta Prioridad)

### Objetivo

Ejecutar Lighthouse audit real para validar mejoras estimadas y detectar próximos cuellos de botella.

### 5.1 Preparación

```bash
# Build de producción
cd /home/hp/Documents/forestech/combustibles
npm run build

# Iniciar preview server
npm run preview
# Server corriendo en http://localhost:4173/combustibles/
```

### 5.2 Ejecutar Lighthouse

**Método 1: Chrome DevTools (Recomendado)**
```
1. Abrir Chrome/Edge
2. Navegar a http://localhost:4173/combustibles/
3. Abrir DevTools (F12)
4. Tab "Lighthouse"
5. Configurar:
   - Mode: Navigation
   - Device: Desktop y Mobile (2 audits)
   - Categories: Performance, Accessibility, Best Practices, SEO
6. Click "Analyze page load"
7. Esperar resultados (~1 minuto)
```

**Método 2: CLI (Alternativo)**
```bash
# Instalar lighthouse CLI
npm install -g lighthouse

# Ejecutar audit
lighthouse http://localhost:4173/combustibles/ \
  --output=json \
  --output=html \
  --output-path=./lighthouse-day3-report \
  --chrome-flags="--headless"

# Abrir reporte
open lighthouse-day3-report.html
```

### 5.3 Documentar Resultados

Crear archivo `SPRINT4_DAY3_LIGHTHOUSE.md`:

```markdown
# Lighthouse Audit - Día 3 (Post Runtime Optimizations)

**Fecha:** [Fecha actual]
**URL:** http://localhost:4173/combustibles/

## Scores

| Categoría | Score | Comparación Día 1 | Mejora |
|-----------|-------|-------------------|--------|
| Performance | XX | 65-70 (estimado) | +XX |
| Accessibility | XX | 85-90 (estimado) | +XX |
| Best Practices | XX | 80-85 (estimado) | +XX |
| SEO | XX | 90-95 (estimado) | +XX |

## Core Web Vitals

| Métrica | Valor | Target | Estado |
|---------|-------|--------|--------|
| LCP (Largest Contentful Paint) | X.Xs | <2.5s | ✅/❌ |
| FID (First Input Delay) | XXms | <100ms | ✅/❌ |
| CLS (Cumulative Layout Shift) | X.XX | <0.1 | ✅/❌ |
| FCP (First Contentful Paint) | X.Xs | <1.8s | ✅/❌ |
| TTI (Time to Interactive) | X.Xs | <3.8s | ✅/❌ |

## Oportunidades Principales

1. [Listar las 3-5 oportunidades principales que Lighthouse sugiere]

## Diagnósticos

1. [Listar diagnósticos importantes]

## Comparación con Baseline

[Incluir gráfico o tabla comparativa]

## Próximos Pasos

[Basado en resultados, qué optimizar en Día 4]
```

### 5.4 Analizar Resultados

**Si Performance Score < 85:**
- Identificar próximos cuellos de botella
- Ajustar plan de Día 4 en consecuencia

**Si Performance Score >= 85:**
- ¡Celebrar! 🎉
- Enfocar Día 4 en CI/CD y monitoring

### Resultado Esperado

- ✅ Lighthouse audit ejecutado (Desktop + Mobile)
- ✅ Resultados documentados
- ✅ Comparación con baseline
- ✅ Plan ajustado para Día 4

---

## ✅ CHECKLIST DE VALIDACIÓN DÍA 3

Antes de considerar Día 3 completado:

### Código y Build
- [ ] 8 archivos legacy eliminados (Auth components + test setup)
- [ ] Build exitoso sin errores después de limpieza
- [ ] React.memo implementado en 5+ componentes
- [ ] useMemo implementado en 5+ lugares
- [ ] useCallback implementado en 5+ lugares
- [ ] Selectores de Zustand optimizados en todos los componentes
- [ ] Console.logs de debug agregados (para monitoring)

### Testing
- [ ] npm run test:all → Todos los tests pasan
- [ ] App funciona correctamente en preview
- [ ] No hay regresiones de funcionalidad
- [ ] Re-renders reducidos (verificado con React DevTools Profiler)

### Lighthouse
- [ ] Lighthouse audit ejecutado (Desktop)
- [ ] Lighthouse audit ejecutado (Mobile)
- [ ] Resultados documentados en SPRINT4_DAY3_LIGHTHOUSE.md
- [ ] Performance score >= 85 (target mínimo)

### Documentación
- [ ] SPRINT4_DAY3_LIGHTHOUSE.md creado
- [ ] SPRINT4_DAY3_COMPLETED.md creado (con métricas)
- [ ] Commits con mensajes descriptivos
- [ ] Screenshots de Lighthouse (opcional)

---

## 📊 MÉTRICAS ESPERADAS DÍA 3

### Targets

| Métrica | Pre-Día 3 | Target Post-Día 3 | Mejora Esperada |
|---------|-----------|-------------------|-----------------|
| **Bundle Size** | 550 KB | 500 KB | **-50 KB** (limpieza) |
| **Performance Score** | 75-80* | 85-90 | **+10-15** |
| **LCP** | 2.8-3.2s* | 2.3-2.7s | **-0.5s** |
| **Re-renders** | Baseline | -40% | **Optimizado** |
| **TTI** | 3.8-4.5s* | 3.2-3.8s | **-0.6s** |

*Estimado pre-Día 3

### Comparación Acumulada

| Fase | Bundle Inicial | Performance Score | LCP |
|------|----------------|-------------------|-----|
| **Baseline (Día 1)** | 800 KB | 65-70 | 3.5-4.0s |
| **Post-Día 2** | 550 KB | 75-80* | 2.8-3.2s* |
| **Post-Día 3 (Target)** | 500 KB | 85-90 | 2.3-2.7s |
| **Mejora Total** | **-38%** | **+20-25** | **-1.0s** |

---

## 🚀 ENTREGABLES DÍA 3

### Archivos Creados/Modificados

1. **Limpieza de código:**
   - 8 archivos eliminados (Auth legacy + test setup)

2. **Optimizaciones de código:**
   - 5+ componentes con React.memo
   - 10+ optimizaciones (useMemo + useCallback)
   - Todos los stores con selectores optimizados

3. **Documentación:**
   - `SPRINT4_DAY3_LIGHTHOUSE.md` - Resultados de audit
   - `SPRINT4_DAY3_COMPLETED.md` - Reporte final del día
   - Screenshots de Lighthouse (opcional)

4. **Commits:**
   - Commit 1: "🗑️ Remove legacy Auth components"
   - Commit 2: "⚛️ Add React.memo to heavy components"
   - Commit 3: "🧮 Add useMemo/useCallback optimizations"
   - Commit 4: "🐻 Optimize Zustand selectors"
   - Commit 5: "📊 Add Lighthouse Day 3 audit results"

---

## 🎯 CRITERIOS DE ÉXITO DÍA 3

### Mínimos Requeridos (Must Have)

- ✅ Código legacy eliminado (8 archivos)
- ✅ Bundle size < 520 KB
- ✅ Performance score >= 82
- ✅ LCP < 2.8s
- ✅ React.memo en componentes críticos
- ✅ Lighthouse audit documentado

### Deseables (Nice to Have)

- ✅ Performance score >= 87
- ✅ LCP < 2.5s
- ✅ Todas las categorías Lighthouse > 90
- ✅ Re-renders reducidos 50%+ (vs 40% target)

### Excelencia (Stretch Goals)

- ✅ Performance score >= 90
- ✅ LCP < 2.3s
- ✅ Todas las categorías Lighthouse >= 95
- ✅ Zero console errors/warnings

---

## 📝 AL TERMINAR DÍA 3: GENERAR PROMPT PARA DÍA 4

Al completar todas las tareas del Día 3, **crear el siguiente documento**:

### SPRINT4_DAY4_PROMPT.md

El prompt debe incluir:

1. **Resumen de logros Día 1-3:**
   - Bundle size final
   - Performance score actual (real, no estimado)
   - Lighthouse scores de todas las categorías
   - Core Web Vitals actuales

2. **Objetivos Día 4:**
   - Lighthouse CI integration
   - Web Vitals monitoring
   - Performance budget
   - Documentación final

3. **Métricas finales esperadas:**
   - Performance score >= 90
   - Todas las categorías >= 90
   - LCP < 2.5s
   - CI/CD pipeline funcionando

4. **Estructura del documento:**
```markdown
# SPRINT 4 - DÍA 4: CI/CD & Monitoring

## Contexto Completo
[Resumen Día 1-3 con métricas reales]

## Objetivos Día 4
[Lista detallada de tareas]

## Tarea 1: Lighthouse CI Integration
[Instrucciones paso a paso]

## Tarea 2: Web Vitals Monitoring
[Implementación de web-vitals package]

## Tarea 3: Performance Budget
[Configuración y validación]

## Tarea 4: Documentación Final
[SPRINT4_FINAL_REPORT.md, FASE2_FINAL_REPORT.md]

## Checklist de Validación
[...]

## Criterios de Éxito
[...]
```

**Comando para crear el prompt:**
```bash
# Después de completar Día 3, ejecutar:
touch combustibles/SPRINT4_DAY4_PROMPT.md

# Copiar estructura de arriba y llenar con:
# - Resultados reales de Lighthouse Día 3
# - Core Web Vitals reales
# - Próximos pasos basados en audit real
```

---

## 💡 TIPS Y MEJORES PRÁCTICAS

### React.memo
- ✅ Usar en componentes que renderizan listas
- ✅ Agregar comparador personalizado si necesario
- ❌ NO usar en componentes pequeños/simples
- ❌ NO prematuramente optimizar

### useMemo
- ✅ Usar para cálculos costosos (sort, filter, reduce)
- ✅ Usar para valores derivados complejos
- ❌ NO usar para cálculos triviales
- ❌ NO sobre-optimizar

### useCallback
- ✅ Usar para callbacks pasados a componentes memoizados
- ✅ Usar en event handlers de listas
- ❌ NO usar si el componente hijo no está memoizado
- ❌ NO sobre-optimizar

### Zustand Selectors
- ✅ SIEMPRE usar selectores específicos
- ✅ Usar shallow compare para múltiples valores
- ❌ NUNCA usar store completo sin selector
- ❌ NO seleccionar más de lo necesario

---

## 🆘 TROUBLESHOOTING

### Problema: Build falla después de eliminar archivos legacy

**Solución:**
```bash
# Significa que algo estaba usando esos archivos
git checkout HEAD -- src/components/Auth/*.jsx src/components/Auth/*.css

# Re-verificar imports
grep -r "AuthVisualEnhancedNew\|AuthVisualEnhancedFixed\|AuthVisualEnhancedClean" src/
```

### Problema: React.memo no reduce re-renders

**Diagnóstico:**
```javascript
// Agregar logs de debug
const Component = React.memo(
  function Component(props) {
    console.log('🔄 Component render', props);
    // ...
  },
  (prev, next) => {
    console.log('🔍 Memo compare:', { prev, next });
    return prev.data === next.data;
  }
);
```

### Problema: Lighthouse scores bajos

**Posibles causas:**
1. Server de preview muy lento (ejecutar en producción)
2. Extensiones de Chrome interfiriendo (usar incógnito)
3. CPU throttling muy agresivo (ajustar en DevTools)
4. Problemas de red (verificar connection)

---

## 📚 RECURSOS

### Documentación
- [React.memo docs](https://react.dev/reference/react/memo)
- [useMemo docs](https://react.dev/reference/react/useMemo)
- [useCallback docs](https://react.dev/reference/react/useCallback)
- [Zustand selectors](https://github.com/pmndrs/zustand#selecting-multiple-state-slices)
- [Lighthouse scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)

### Tools
- React DevTools Profiler
- Chrome DevTools Performance tab
- Lighthouse CLI

---

**Prompt creado:** 2 de octubre de 2025  
**Para:** Sprint 4 - Día 3  
**Duración estimada:** 6 horas  
**Precedente:** Día 2 completado exitosamente  
**Estado:** 📋 LISTO PARA EJECUCIÓN

---

## 🎯 COMANDO PARA EMPEZAR DÍA 3

```bash
# 1. Ir al directorio correcto
cd /home/hp/Documents/forestech/combustibles

# 2. Verificar estado actual
git status
npm run build  # Debe funcionar sin errores

# 3. Verificar Auth components en uso
echo "=== Auth Components en uso ==="
grep -r "import.*Auth" src/ --include="*.jsx" --include="*.js" | grep -v node_modules

# 4. Comenzar con Tarea 1 (limpieza de legacy)
# Ver sección "TAREA 1: LIMPIEZA DE CÓDIGO LEGACY"

# 5. Continuar con Tarea 2-5 en orden

# 6. Al terminar, generar SPRINT4_DAY4_PROMPT.md
```

¡Buena suerte con el Día 3! 🚀
