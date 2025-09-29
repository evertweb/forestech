/**
 * Performance Monitoring para SSR - Fase 1
 * Sistema básico de monitoreo y alertas para el roadmap SSR expansion
 */

const SSR_METRICS = {
  targetTTFB: 800,      // ms - Time To First Byte
  targetFCP: 1200,      // ms - First Contentful Paint  
  targetLCP: 2000,      // ms - Largest Contentful Paint
  maxSSRTime: 1500,     // ms - Máximo tiempo SSR
  errorThreshold: 0.05, // 5% error rate threshold
  slowThreshold: 2000   // ms - Request lento
};

// Métricas en memoria para análisis
const performanceMetrics = new Map();
const METRICS_TTL = 60 * 60 * 1000; // 1 hora

/**
 * Monitor SSR Performance - Registro principal
 * @param {Object} req - Request object  
 * @param {number} startTime - Timestamp inicio request
 * @param {boolean} success - Si el SSR fue exitoso
 * @param {Object} timing - Información de timing detallada
 */
export async function monitorSSRPerformance(req, startTime, success = true, timing = {}) {
  const duration = Date.now() - startTime;
  const route = req.path;
  
  // Structured logging para análisis
  const logData = {
    type: 'ssr_performance',
    route,
    duration,
    success,
    user: req.user?.uid || 'anonymous',
    timestamp: new Date().toISOString(),
    withinTarget: duration < SSR_METRICS.maxSSRTime,
    userAgent: req.get('User-Agent')?.substring(0, 100),
    // Timing breakdown
    timing: {
      total: duration,
      dataFetch: timing.dataFetch || 0,
      render: timing.render || 0,
      auth: timing.auth || 0
    }
  };
  
  // Log estructurado para CloudWatch/monitoring
  console.info('SSR_PERF:', JSON.stringify(logData));
  
  // Almacenar métricas en memoria para dashboard
  storeMetric(route, logData);
  
  // Verificar si excede thresholds para alertas
  await checkPerformanceThresholds(logData);
  
  return logData;
}

/**
 * Almacenar métrica en memoria con TTL
 */
function storeMetric(route, metric) {
  const key = `${route}_${Date.now()}`;
  performanceMetrics.set(key, {
    ...metric,
    expires: Date.now() + METRICS_TTL
  });
  
  // Cleanup métricas expiradas
  if (performanceMetrics.size > 1000) {
    cleanupExpiredMetrics();
  }
}

/**
 * Limpiar métricas expiradas
 */
function cleanupExpiredMetrics() {
  const now = Date.now();
  for (const [key, metric] of performanceMetrics.entries()) {
    if (metric.expires < now) {
      performanceMetrics.delete(key);
    }
  }
}

/**
 * Verificar thresholds y enviar alertas si es necesario
 */
async function checkPerformanceThresholds(metric) {
  const { route, duration } = metric;
  
  // Alerta por request lento
  if (duration > SSR_METRICS.maxSSRTime * 1.5) {
    const alertData = {
      type: 'ssr_slow_request',
      severity: 'warning',
      route,
      duration,
      threshold: SSR_METRICS.maxSSRTime,
      timestamp: new Date().toISOString()
    };
    
    console.warn('SSR_SLOW:', JSON.stringify(alertData));
    await sendAlert('slow_request', alertData);
  }
  
  // Alerta por request extremadamente lento
  if (duration > SSR_METRICS.slowThreshold) {
    const alertData = {
      type: 'ssr_very_slow',
      severity: 'error', 
      route,
      duration,
      threshold: SSR_METRICS.slowThreshold,
      timestamp: new Date().toISOString()
    };
    
    console.error('SSR_VERY_SLOW:', JSON.stringify(alertData));
    await sendAlert('very_slow_request', alertData);
  }
  
  // Verificar error rate por ruta
  await checkRouteErrorRate(route);
}

/**
 * Verificar error rate por ruta
 */
async function checkRouteErrorRate(route) {
  const recentMetrics = getRecentMetricsByRoute(route, 5 * 60 * 1000); // 5 minutos
  
  if (recentMetrics.length < 10) return; // Mínimo 10 requests para calcular rate
  
  const errorCount = recentMetrics.filter(m => !m.success).length;
  const errorRate = errorCount / recentMetrics.length;
  
  if (errorRate > SSR_METRICS.errorThreshold) {
    const alertData = {
      type: 'ssr_high_error_rate',
      severity: 'error',
      route,
      errorRate: Math.round(errorRate * 100),
      errorCount,
      totalRequests: recentMetrics.length,
      threshold: Math.round(SSR_METRICS.errorThreshold * 100),
      timestamp: new Date().toISOString()
    };
    
    console.error('SSR_HIGH_ERROR_RATE:', JSON.stringify(alertData));
    await sendAlert('high_error_rate', alertData);
  }
}

/**
 * Obtener métricas recientes por ruta
 */
function getRecentMetricsByRoute(route, timeWindow = 5 * 60 * 1000) {
  const cutoff = Date.now() - timeWindow;
  const metrics = [];
  
  for (const [, metric] of performanceMetrics.entries()) {
    if (metric.route === route && new Date(metric.timestamp).getTime() > cutoff) {
      metrics.push(metric);
    }
  }
  
  return metrics.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

/**
 * Enviar alerta - Implementación básica
 * En producción conectar con Slack, PagerDuty, etc.
 */
async function sendAlert(type, data) {
  // Log alerta para captura por sistemas externos
  console.error(`ALERT_${type.toUpperCase()}:`, JSON.stringify(data));
  
  // En futuro: implementar webhooks, Slack, email, etc.
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: formatSlackAlert(type, data)
        })
      });
    } catch (error) {
      console.error('Failed to send Slack alert:', error.message);
    }
  }
}

/**
 * Formatear alerta para Slack
 */
function formatSlackAlert(type, data) {
  const emojis = {
    slow_request: '🐌',
    very_slow_request: '🚨',
    high_error_rate: '💥'
  };
  
  const emoji = emojis[type] || '⚠️';
  
  switch (type) {
    case 'slow_request':
      return `${emoji} SSR Slow Request: ${data.route} took ${data.duration}ms (threshold: ${data.threshold}ms)`;
    
    case 'very_slow_request':
      return `${emoji} SSR Very Slow Request: ${data.route} took ${data.duration}ms (threshold: ${data.threshold}ms)`;
    
    case 'high_error_rate':
      return `${emoji} SSR High Error Rate: ${data.route} has ${data.errorRate}% error rate (${data.errorCount}/${data.totalRequests} requests, threshold: ${data.threshold}%)`;
    
    default:
      return `${emoji} SSR Alert: ${JSON.stringify(data)}`;
  }
}

/**
 * Obtener estadísticas de performance para dashboard
 */
export function getPerformanceStats(timeWindow = 60 * 60 * 1000) { // 1 hora por defecto
  const cutoff = Date.now() - timeWindow;
  const metrics = [];
  
  // Obtener métricas recientes
  for (const [, metric] of performanceMetrics.entries()) {
    if (new Date(metric.timestamp).getTime() > cutoff) {
      metrics.push(metric);
    }
  }
  
  if (metrics.length === 0) {
    return {
      totalRequests: 0,
      successRate: 0,
      avgDuration: 0,
      p95Duration: 0,
      slowRequests: 0,
      errorRate: 0,
      byRoute: {}
    };
  }
  
  // Calcular estadísticas agregadas
  const successful = metrics.filter(m => m.success);
  const durations = metrics.map(m => m.timing.total).sort((a, b) => a - b);
  const slowRequests = metrics.filter(m => m.timing.total > SSR_METRICS.maxSSRTime).length;
  
  // Estadísticas por ruta
  const byRoute = {};
  metrics.forEach(metric => {
    if (!byRoute[metric.route]) {
      byRoute[metric.route] = {
        requests: 0,
        successful: 0,
        avgDuration: 0,
        maxDuration: 0,
        errors: 0
      };
    }
    
    const route = byRoute[metric.route];
    route.requests++;
    if (metric.success) route.successful++;
    else route.errors++;
    
    route.avgDuration = (route.avgDuration * (route.requests - 1) + metric.timing.total) / route.requests;
    route.maxDuration = Math.max(route.maxDuration, metric.timing.total);
  });
  
  // Calcular success rate y error rate por ruta
  Object.keys(byRoute).forEach(route => {
    const routeStats = byRoute[route];
    routeStats.successRate = (routeStats.successful / routeStats.requests) * 100;
    routeStats.errorRate = (routeStats.errors / routeStats.requests) * 100;
  });
  
  return {
    totalRequests: metrics.length,
    successRate: Math.round((successful.length / metrics.length) * 100),
    errorRate: Math.round(((metrics.length - successful.length) / metrics.length) * 100),
    avgDuration: Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length),
    p95Duration: Math.round(durations[Math.floor(durations.length * 0.95)] || 0),
    slowRequests,
    timeWindow: timeWindow / (60 * 1000), // en minutos
    lastUpdated: new Date().toISOString(),
    byRoute,
    thresholds: SSR_METRICS
  };
}

/**
 * Endpoint para obtener métricas (para debugging/dashboard)
 */
export function performanceHandler(req, res) {
  try {
    const timeWindow = parseInt(req.query.window) || 60 * 60 * 1000; // 1 hora por defecto
    const stats = getPerformanceStats(timeWindow);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting performance stats:', error);
    res.status(500).json({ error: 'Failed to get performance stats' });
  }
}

/**
 * Limpiar todas las métricas (para testing)
 */
export function clearMetrics() {
  performanceMetrics.clear();
  return { cleared: true, timestamp: new Date().toISOString() };
}

/**
 * Función helper para timing de operaciones
 */
export function createTimer() {
  const start = Date.now();
  
  return {
    start,
    elapsed: () => Date.now() - start,
    mark: (name) => ({ [name]: Date.now() - start })
  };
}

// Cleanup automático cada 10 minutos
setInterval(cleanupExpiredMetrics, 10 * 60 * 1000);