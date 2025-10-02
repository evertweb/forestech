# Firebase Performance Monitoring & Web Vitals

## 📊 Descripción

Este documento describe la integración de Firebase Performance Monitoring y Web Vitals en la aplicación Combustibles para recolección continua de métricas de rendimiento en producción.

## 🎯 Objetivos

1. **Monitoreo automático**: Recolectar Core Web Vitals en tiempo real
2. **Visibilidad**: Dashboard centralizado en Firebase Console
3. **Alertas**: Detectar degradaciones de rendimiento automáticamente
4. **Trazabilidad**: Correlacionar métricas con versiones y cambios

## 📈 Métricas Recolectadas

### Core Web Vitals

| Métrica | Descripción | Good | Needs Improvement | Poor |
|---------|-------------|------|-------------------|------|
| **LCP** | Largest Contentful Paint | ≤2.5s | 2.5s-4.0s | >4.0s |
| **FID** | First Input Delay | ≤100ms | 100ms-300ms | >300ms |
| **CLS** | Cumulative Layout Shift | ≤0.1 | 0.1-0.25 | >0.25 |
| **FCP** | First Contentful Paint | ≤1.8s | 1.8s-3.0s | >3.0s |
| **TTFB** | Time to First Byte | ≤800ms | 800ms-1800ms | >1800ms |

### Custom Traces

- `component_load_*`: Tiempo de carga de componentes críticos
- `webvital_*`: Métricas individuales de Web Vitals
- `perf_error_*`: Errores relacionados con rendimiento

## 🔧 Implementación

### Archivo Principal

**`combustibles/src/firebase/performanceMonitoring.js`**

```javascript
import { initWebVitalsMonitoring } from './firebase/performanceMonitoring';

// En main.jsx o App.jsx
initWebVitalsMonitoring();
```

### Funciones Disponibles

#### `initWebVitalsMonitoring()`
Inicializa el monitoreo automático de Web Vitals. Debe llamarse una vez al cargar la aplicación.

```javascript
initWebVitalsMonitoring();
```

#### `createCustomTrace(traceName)`
Crea un trace personalizado para medir operaciones específicas.

```javascript
const trace = createCustomTrace('firebase_query_vehicles');
trace.start();
// ... operación a medir
trace.putAttribute('count', vehicleCount);
trace.stop();
```

#### `measureComponentLoad(componentName, callback)`
Mide el tiempo de carga de un componente específico.

```javascript
const data = await measureComponentLoad('VehiclesList', async () => {
  return await fetchVehicles();
});
```

#### `reportPerformanceError(errorType, details)`
Reporta errores relacionados con rendimiento.

```javascript
reportPerformanceError('slow_query', {
  query: 'vehicles',
  duration: 5000,
  threshold: 2000
});
```

## 📊 Acceso al Dashboard

### Firebase Console

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Seleccionar proyecto: `liquidacionapp-62962`
3. En el menú lateral: **Performance**
4. Dashboard disponible: https://console.firebase.google.com/project/liquidacionapp-62962/performance

### Vistas Disponibles

#### 1. **Performance Overview**
- Resumen de métricas agregadas
- Comparación temporal (día, semana, mes)
- Distribución de usuarios por rating (good/needs improvement/poor)

#### 2. **Web Vitals**
- Gráficos de LCP, FID, CLS, FCP, TTFB
- Percentiles (p50, p75, p90, p95, p99)
- Distribución geográfica
- Desglose por dispositivo (mobile/desktop)
- Filtros por versión de app

#### 3. **Custom Traces**
- Traces personalizados (`component_load_*`, etc.)
- Métricas de tiempo de ejecución
- Atributos personalizados
- Correlación con Web Vitals

#### 4. **Network Requests** (automático)
- Latencia de llamadas HTTP/HTTPS
- Success rate
- Tamaño de respuestas

## 🎨 Interpretación de Datos

### Rating por Color

- 🟢 **Green (Good)**: Experiencia óptima
- 🟡 **Yellow (Needs Improvement)**: Experiencia aceptable
- 🔴 **Red (Poor)**: Experiencia deficiente

### Alertas Recomendadas

Configurar alertas en Firebase Console cuando:

1. **LCP > 4s** en >10% de sesiones
2. **CLS > 0.25** en >5% de sesiones
3. **FID > 300ms** en >5% de sesiones
4. Degradación >20% en cualquier métrica semana a semana

## 🔍 Debugging de Problemas

### LCP Alto

**Causas comunes:**
- Imágenes sin optimizar
- Bloqueo por CSS/JS crítico
- Servidor lento (TTFB alto)
- Fuentes web no optimizadas

**Soluciones:**
- Preload recursos críticos
- Lazy load imágenes below-the-fold
- Optimizar CSS crítico
- Usar CDN para assets

### CLS Alto

**Causas comunes:**
- Imágenes sin dimensiones definidas
- Anuncios/iframes sin espacio reservado
- Fuentes web sin font-display
- Contenido dinámico insertado

**Soluciones:**
- Definir `width` y `height` en imágenes
- Reservar espacio para contenido dinámico
- Usar `font-display: swap`
- Evitar `transform` en animaciones

### FID Alto

**Causas comunes:**
- JavaScript bloqueante en main thread
- Tareas largas (>50ms)
- Event listeners pesados

**Soluciones:**
- Code splitting más agresivo
- Web Workers para tareas pesadas
- Throttle/debounce en event handlers
- React.memo en componentes costosos

## 📅 Revisión de Métricas

### Frecuencia Recomendada

- **Diaria**: Checks rápidos de anomalías
- **Semanal**: Análisis de tendencias y comparaciones
- **Mensual**: Revisión profunda y ajuste de budgets
- **Post-deploy**: Validación inmediata después de cada release

### KPIs Objetivo (Q4 2025)

| Métrica | Objetivo | Actual (Baseline) |
|---------|----------|-------------------|
| LCP (p75) | <2.5s | TBD |
| FID (p75) | <100ms | TBD |
| CLS (p75) | <0.1 | TBD |
| FCP (p75) | <1.8s | TBD |
| TTFB (p75) | <800ms | TBD |

## 🔗 Recursos Adicionales

- [Firebase Performance Docs](https://firebase.google.com/docs/perf-mon)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## 🚨 Troubleshooting

### Performance no muestra datos

1. Verificar que Firebase está inicializado correctamente
2. Comprobar que la app está en producción (no localhost)
3. Esperar 24-48h para agregación inicial de datos
4. Verificar permisos en Firebase Console

### Métricas inconsistentes

- Firebase agrega datos en ventanas de tiempo
- Comparar con Chrome DevTools / Lighthouse para validación
- Considerar variabilidad de dispositivos y redes de usuarios reales

### Errores en consola

```javascript
// Verificar inicialización
console.log('Performance:', performance);

// Debug de métricas
import.meta.env.DEV = true; // Ver logs detallados
```

## 📝 Notas de Implementación

- Monitoreo activo desde Sprint 4, Día 4
- Integración con `web-vitals` v4.x
- Compatible con SSR (checks de `window`)
- No impacta bundle size crítico (lazy load)
- Thresholds alineados con `performance-budget.json`
