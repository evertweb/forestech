// combustibles/src/firebase/performanceMonitoring.js
// Sprint 4 Day 4: Firebase Performance Monitoring integration
// Integrates Web Vitals metrics with Firebase Performance Monitoring for real-time performance tracking

import { getPerformance } from 'firebase/performance';
import { getApp } from 'firebase/app';
// Web vitals imported dynamically in initWebVitalsMonitoring() to avoid SSR issues

/**
 * @typedef {Object} WebVitalsMetric
 * @property {string} name - Metric name (LCP, FID, CLS, FCP, TTFB)
 * @property {number} value - Metric value
 * @property {string} rating - Performance rating (good, needs-improvement, poor)
 * @property {number} delta - Change from previous value
 */

// Inicializar Firebase Performance
let performance = null;
let performanceInitAttempted = false;

/**
 * Inicializar Firebase Performance de manera lazy
 * @returns {Object|null} - Instancia de Performance o null
 */
const initializePerformance = () => {
  if (performanceInitAttempted) {
    return performance;
  }

  performanceInitAttempted = true;
  
  try {
    const app = getApp(); // Get Firebase app instance (singleton from config.js)
    performance = getPerformance(app);
    console.log('🔥 Firebase Performance Monitoring initialized');
  } catch (error) {
    // En desarrollo o si Firebase no está inicializado, no mostrar error
    if (import.meta.env.DEV) {
      console.debug('⚠️ Firebase Performance not available (desarrollo):', error.message);
    } else {
      console.warn('⚠️ Firebase Performance not available:', error.message);
    }
  }
  
  return performance;
};

/**
 * Thresholds para Web Vitals según performance-budget.json
 */
const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  INP: { good: 200, needsImprovement: 500 }, // INP replaced FID in web-vitals v3+
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

/**
 * Determinar rating de métrica basado en thresholds
 * @param {string} metricName - Nombre de la métrica
 * @param {number} value - Valor de la métrica
 * @returns {string} - 'good', 'needs-improvement', o 'poor'
 */
function getRating(metricName, value) {
  const thresholds = WEB_VITALS_THRESHOLDS[metricName];
  if (!thresholds) return 'unknown';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Log métrica de Web Vitals a Firebase Performance
 * @param {WebVitalsMetric} metric - Métrica a registrar
 */
function logWebVitalToFirebase(metric) {
  const perf = initializePerformance();
  if (!perf) return;

  try {
    const { name, value, rating } = metric;
    
    // Firebase Performance no soporta custom traces desde web-vitals directamente
    // En su lugar, usamos custom attributes en el performance monitoring automático
    // Solo loguear en consola para desarrollo
    if (import.meta.env.DEV) {
      console.log(`📊 Web Vital: ${name} = ${value}ms (${rating})`);
    }
    
    // Las métricas automáticas de Firebase Performance capturan estas ya
    // No necesitamos crear traces manuales para web vitals
  } catch (error) {
    // Silenciar errores en producción
    if (import.meta.env.DEV) {
      console.warn('⚠️ Error logging Web Vital:', error.message);
    }
  }
}

/**
 * Inicializar monitoreo de Web Vitals usando web-vitals library
 * Debe llamarse en el cliente después del montaje inicial
 */
export async function initWebVitalsMonitoring() {
  if (typeof window === 'undefined') return;

  try {
    // Importar web-vitals dinámicamente para evitar bundle en SSR
    const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals');

    // Configurar handlers para cada métrica
    const handleMetric = (metric) => {
      const rating = getRating(metric.name, metric.value);
      
      const enrichedMetric = {
        ...metric,
        rating,
      };

      // Log a consola en desarrollo
      if (import.meta.env.DEV) {
        const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
        console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)} (${rating})`);
      }

      // Enviar a Firebase Performance
      logWebVitalToFirebase(enrichedMetric);

      // También podríamos enviar a otro servicio de analytics
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.value),
          metric_rating: rating,
          event_category: 'Web Vitals',
        });
      }
    };

    // Registrar listeners para cada métrica (INP replaced FID in web-vitals v3+)
    onCLS(handleMetric);
    onINP(handleMetric);
    onFCP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);

    console.log('📊 Web Vitals monitoring initialized');
  } catch (error) {
    console.warn('⚠️ Web Vitals library not available:', error.message);
  }
}

/**
 * Crear custom trace para operaciones específicas
 * @param {string} traceName - Nombre del trace
 * @returns {Object} - Objeto con métodos start/stop
 */
export function createCustomTrace(traceName) {
  if (!performance) {
    return {
      start: () => {},
      stop: () => {},
      putAttribute: () => {},
      putMetric: () => {},
    };
  }

  const trace = performance.trace(traceName);
  return trace;
}

/**
 * Medir tiempo de carga de componente específico
 * @param {string} componentName - Nombre del componente
 * @param {Function} callback - Función a ejecutar
 */
export async function measureComponentLoad(componentName, callback) {
  const trace = createCustomTrace(`component_load_${componentName}`);
  
  try {
    trace.start();
    const result = await callback();
    trace.stop();
    return result;
  } catch (error) {
    trace.putAttribute('error', 'true');
    trace.stop();
    throw error;
  }
}

/**
 * Reportar error de performance a Firebase
 * @param {string} errorType - Tipo de error
 * @param {Object} details - Detalles del error
 */
export function reportPerformanceError(errorType, details) {
  if (!performance) return;

  const trace = createCustomTrace(`perf_error_${errorType}`);
  trace.start();
  
  Object.entries(details).forEach(([key, value]) => {
    trace.putAttribute(key, String(value));
  });
  
  trace.stop();
}

export default {
  initWebVitalsMonitoring,
  createCustomTrace,
  measureComponentLoad,
  reportPerformanceError,
};
