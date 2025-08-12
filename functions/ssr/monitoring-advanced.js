/**
 * Advanced Monitoring System - Phase 4
 * Sistema avanzado de monitoreo con métricas detalladas y análisis predictivo
 */

import { getPerformanceStats, createTimer } from './performance-monitor.js';
import { getCacheStats } from './cache-strategy.js';

// Configuración avanzada de métricas
const ADVANCED_METRICS_CONFIG = {
  // Métricas Core Web Vitals
  webVitals: {
    targetLCP: 2500,      // Largest Contentful Paint
    targetFID: 100,       // First Input Delay
    targetCLS: 0.1,       // Cumulative Layout Shift
    targetFCP: 1800,      // First Contentful Paint
    targetTTFB: 600       // Time To First Byte
  },
  
  // Métricas específicas SSR
  ssrMetrics: {
    maxRenderTime: 1000,  // Tiempo máximo de render SSR
    maxDataFetchTime: 500, // Tiempo máximo fetch de datos
    maxHydrationTime: 200, // Tiempo máximo de hidratación
    targetCacheHitRate: 80 // % de cache hits esperado
  },
  
  // Umbrales para alertas
  alertThresholds: {
    errorRate: 3,         // % máximo de errores
    slowResponseRate: 15, // % máximo de responses lentos
    memoryUsage: 80,      // % máximo de memoria
    cpuUsage: 70          // % máximo de CPU
  },
  
  // Ventanas de tiempo para análisis
  timeWindows: {
    realTime: 5 * 60 * 1000,      // 5 minutos
    shortTerm: 60 * 60 * 1000,    // 1 hora
    mediumTerm: 24 * 60 * 60 * 1000, // 1 día
    longTerm: 7 * 24 * 60 * 60 * 1000 // 1 semana
  }
};

// Storage avanzado de métricas
const advancedMetrics = {
  performance: new Map(),
  webVitals: new Map(),
  errors: new Map(),
  cache: new Map(),
  users: new Map(),
  system: new Map()
};

/**
 * Monitorear performance avanzada con métricas detalladas
 */
export async function monitorAdvancedPerformance(req, startTime, result) {
  const timer = createTimer();
  const route = req.path;
  const userId = req.user?.uid || 'anonymous';
  
  try {
    // Calcular métricas detalladas
    const metrics = await calculateDetailedMetrics(req, startTime, result, timer);
    
    // Almacenar métricas
    storeAdvancedMetrics(route, userId, metrics);
    
    // Verificar alertas
    await checkAdvancedAlerts(route, metrics);
    
    // Análisis predictivo
    await runPredictiveAnalysis(route, metrics);
    
    // Log estructurado
    logAdvancedMetrics(route, userId, metrics);
    
    return metrics;
    
  } catch (error) {
    console.error('Error in advanced monitoring:', error);
    return null;
  }
}

/**
 * Calcular métricas detalladas
 */
async function calculateDetailedMetrics(req, startTime, result, timer) {
  const now = Date.now();
  const totalDuration = now - startTime;
  
  const metrics = {
    // Timing básico
    timing: {
      total: totalDuration,
      dataFetch: result.timing?.dataFetch || 0,
      render: result.timing?.render || 0,
      auth: result.timing?.auth || 0,
      cache: result.timing?.cache || 0
    },
    
    // Performance flags
    performance: {
      isWithinTarget: totalDuration < ADVANCED_METRICS_CONFIG.ssrMetrics.maxRenderTime,
      isSlow: totalDuration > ADVANCED_METRICS_CONFIG.ssrMetrics.maxRenderTime * 1.5,
      isVeryLow: totalDuration > ADVANCED_METRICS_CONFIG.ssrMetrics.maxRenderTime * 2,
      grade: calculatePerformanceGrade(totalDuration)
    },
    
    // Request context
    request: {
      route: req.path,
      method: req.method,
      userAgent: req.get('User-Agent')?.substring(0, 100),
      ip: anonymizeIP(req.ip),
      referrer: req.get('Referrer')?.substring(0, 100),
      acceptLanguage: req.get('Accept-Language')?.substring(0, 50),
      connection: analyzeConnection(req)
    },
    
    // User context
    user: {
      id: req.user?.uid ? req.user.uid.substring(0, 8) + '...' : 'anonymous',
      isAuthenticated: !!req.user?.uid,
      segment: await getUserSegment(req.user, req)
    },
    
    // Result details
    result: {
      success: !!result.success,
      type: result.type || 'unknown',
      cacheHit: !!result.cacheHit,
      fallback: !!result.fallback,
      errorCode: result.errorCode,
      dataSize: JSON.stringify(result.data || {}).length
    },
    
    // System metrics
    system: await getSystemMetrics(),
    
    // Timestamps
    timestamp: new Date().toISOString(),
    timestampMs: now
  };
  
  // Web Vitals simulation (en producción vendría del client)
  metrics.webVitals = await simulateWebVitals(metrics);
  
  return metrics;
}

/**
 * Calcular grade de performance
 */
function calculatePerformanceGrade(duration) {
  if (duration < 500) return 'A+';
  if (duration < 800) return 'A';
  if (duration < 1200) return 'B';
  if (duration < 1800) return 'C';
  if (duration < 2500) return 'D';
  return 'F';
}

/**
 * Analizar tipo de conexión
 */
function analyzeConnection(req) {
  const saveData = req.get('Save-Data') === 'on';
  const via = req.get('Via');
  const forwarded = req.get('X-Forwarded-For');
  
  return {
    saveData,
    proxy: !!via,
    forwarded: !!forwarded,
    type: saveData ? 'slow' : 'normal'
  };
}

/**
 * Obtener segmento de usuario
 */
async function getUserSegment(user, req) {
  if (!user) return 'anonymous';
  
  // Análisis básico - en producción sería más sofisticado
  const accountAge = Date.now() - new Date(user.createdAt || 0).getTime();
  const isNewUser = accountAge < 7 * 24 * 60 * 60 * 1000;
  const isPowerUser = (user.totalSessions || 0) > 50;
  const isMobile = /Mobile|Android|iPhone|iPad/.test(req.get('User-Agent') || '');
  
  if (isNewUser) return 'new_user';
  if (isPowerUser) return 'power_user';
  if (isMobile) return 'mobile_user';
  return 'regular_user';
}

/**
 * Obtener métricas del sistema
 */
async function getSystemMetrics() {
  try {
    const memUsage = process.memoryUsage();
    
    return {
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        usage: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100) // %
      },
      uptime: Math.round(process.uptime()),
      nodeVersion: process.version
    };
  } catch (error) {
    return { error: 'Unable to get system metrics' };
  }
}

/**
 * Simular Web Vitals (en producción vendría del client)
 */
async function simulateWebVitals(metrics) {
  const baseTime = metrics.timing.total;
  
  return {
    // First Contentful Paint (simulado)
    fcp: Math.round(baseTime * 0.6 + Math.random() * 200),
    
    // Largest Contentful Paint (simulado)
    lcp: Math.round(baseTime * 0.8 + Math.random() * 400),
    
    // First Input Delay (simulado - mejor en SSR)
    fid: Math.round(20 + Math.random() * 50),
    
    // Cumulative Layout Shift (simulado - mejor en SSR)
    cls: Math.round((0.02 + Math.random() * 0.05) * 100) / 100,
    
    // Time to First Byte
    ttfb: Math.round(baseTime * 0.3 + Math.random() * 100)
  };
}

/**
 * Almacenar métricas avanzadas
 */
function storeAdvancedMetrics(route, userId, metrics) {
  const key = `${route}_${metrics.timestampMs}`;
  
  // Performance metrics
  advancedMetrics.performance.set(key, metrics);
  
  // Web Vitals
  advancedMetrics.webVitals.set(key, {
    route,
    userId,
    ...metrics.webVitals,
    timestamp: metrics.timestamp
  });
  
  // Error tracking
  if (!metrics.result.success) {
    advancedMetrics.errors.set(key, {
      route,
      userId,
      error: metrics.result.errorCode,
      timing: metrics.timing,
      timestamp: metrics.timestamp
    });
  }
  
  // User patterns
  const userKey = `${userId}_${Date.now()}`;
  advancedMetrics.users.set(userKey, {
    userId,
    route,
    segment: metrics.user.segment,
    performance: metrics.performance.grade,
    timestamp: metrics.timestamp
  });
  
  // System monitoring
  advancedMetrics.system.set(key, {
    ...metrics.system,
    timestamp: metrics.timestamp
  });
  
  // Cleanup old metrics (keep last 1000 per type)
  cleanupMetrics();
}

/**
 * Limpiar métricas antiguas
 */
function cleanupMetrics() {
  Object.values(advancedMetrics).forEach(metricMap => {
    if (metricMap.size > 1000) {
      const entries = Array.from(metricMap.entries());
      const toDelete = entries.slice(0, metricMap.size - 1000);
      toDelete.forEach(([key]) => metricMap.delete(key));
    }
  });
}

/**
 * Verificar alertas avanzadas
 */
async function checkAdvancedAlerts(route, metrics) {
  const alerts = [];
  
  // Performance alerts
  if (metrics.performance.isVeryLow) {
    alerts.push({
      type: 'performance_critical',
      severity: 'critical',
      route,
      message: `Very slow response: ${metrics.timing.total}ms`,
      threshold: ADVANCED_METRICS_CONFIG.ssrMetrics.maxRenderTime * 2
    });
  }
  
  // Web Vitals alerts
  if (metrics.webVitals.lcp > ADVANCED_METRICS_CONFIG.webVitals.targetLCP) {
    alerts.push({
      type: 'web_vitals_lcp',
      severity: 'warning',
      route,
      message: `LCP too high: ${metrics.webVitals.lcp}ms`,
      threshold: ADVANCED_METRICS_CONFIG.webVitals.targetLCP
    });
  }
  
  // Memory alerts
  if (metrics.system.memory?.usage > ADVANCED_METRICS_CONFIG.alertThresholds.memoryUsage) {
    alerts.push({
      type: 'system_memory',
      severity: 'warning',
      route,
      message: `High memory usage: ${metrics.system.memory.usage}%`,
      threshold: ADVANCED_METRICS_CONFIG.alertThresholds.memoryUsage
    });
  }
  
  // Error pattern alerts
  const recentErrors = await detectErrorPatterns(route);
  if (recentErrors.rate > ADVANCED_METRICS_CONFIG.alertThresholds.errorRate) {
    alerts.push({
      type: 'error_pattern',
      severity: 'error',
      route,
      message: `High error rate: ${recentErrors.rate}%`,
      threshold: ADVANCED_METRICS_CONFIG.alertThresholds.errorRate
    });
  }
  
  // Enviar alertas
  for (const alert of alerts) {
    await sendAdvancedAlert(alert);
  }
}

/**
 * Detectar patrones de error
 */
async function detectErrorPatterns(route) {
  const timeWindow = ADVANCED_METRICS_CONFIG.timeWindows.realTime;
  const cutoff = Date.now() - timeWindow;
  
  const recentErrors = Array.from(advancedMetrics.errors.values())
    .filter(error => error.route === route && new Date(error.timestamp).getTime() > cutoff);
  
  const recentTotal = Array.from(advancedMetrics.performance.values())
    .filter(metric => metric.request.route === route && metric.timestampMs > cutoff).length;
  
  const errorRate = recentTotal > 0 ? (recentErrors.length / recentTotal) * 100 : 0;
  
  return {
    rate: Math.round(errorRate),
    count: recentErrors.length,
    total: recentTotal
  };
}

/**
 * Enviar alerta avanzada
 */
async function sendAdvancedAlert(alert) {
  console.error(`ADVANCED_ALERT_${alert.type.toUpperCase()}:`, JSON.stringify(alert));
  
  // En producción: webhook, Slack, PagerDuty, etc.
  if (process.env.MONITORING_WEBHOOK_URL) {
    try {
      await fetch(process.env.MONITORING_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...alert,
          timestamp: new Date().toISOString(),
          source: 'ssr_advanced_monitoring'
        })
      });
    } catch (error) {
      console.error('Failed to send advanced alert:', error.message);
    }
  }
}

/**
 * Análisis predictivo
 */
async function runPredictiveAnalysis(route, currentMetrics) {
  try {
    const predictions = {
      performanceTrend: await predictPerformanceTrend(route),
      errorTrend: await predictErrorTrend(route),
      scalingRecommendations: await generateScalingRecommendations(route, currentMetrics),
      optimizationSuggestions: await generateOptimizationSuggestions(route, currentMetrics)
    };
    
    // Log predictions
    console.info('PREDICTIVE_ANALYSIS:', JSON.stringify({
      route,
      predictions,
      timestamp: new Date().toISOString()
    }));
    
    return predictions;
  } catch (error) {
    console.error('Error in predictive analysis:', error);
    return null;
  }
}

/**
 * Predecir tendencia de performance
 */
async function predictPerformanceTrend(route) {
  const metrics = getRecentMetricsByRoute(route, ADVANCED_METRICS_CONFIG.timeWindows.mediumTerm);
  
  if (metrics.length < 10) {
    return { trend: 'insufficient_data', confidence: 0 };
  }
  
  // Análisis simple de tendencia (en producción sería ML)
  const recent = metrics.slice(-10);
  const older = metrics.slice(-20, -10);
  
  const recentAvg = recent.reduce((sum, m) => sum + m.timing.total, 0) / recent.length;
  const olderAvg = older.reduce((sum, m) => sum + m.timing.total, 0) / older.length;
  
  const change = ((recentAvg - olderAvg) / olderAvg) * 100;
  
  return {
    trend: change > 10 ? 'worsening' : change < -10 ? 'improving' : 'stable',
    change: Math.round(change),
    confidence: Math.min(metrics.length / 100, 0.9), // More data = higher confidence
    recentAvg: Math.round(recentAvg),
    olderAvg: Math.round(olderAvg)
  };
}

/**
 * Predecir tendencia de errores
 */
async function predictErrorTrend(route) {
  const window1h = ADVANCED_METRICS_CONFIG.timeWindows.shortTerm;
  const window6h = window1h * 6;
  
  const recent1h = Array.from(advancedMetrics.errors.values())
    .filter(e => e.route === route && Date.now() - new Date(e.timestamp).getTime() < window1h);
  
  const recent6h = Array.from(advancedMetrics.errors.values())
    .filter(e => e.route === route && Date.now() - new Date(e.timestamp).getTime() < window6h);
  
  const errorRate1h = recent1h.length;
  const errorRate6h = recent6h.length / 6; // Average per hour
  
  return {
    trend: errorRate1h > errorRate6h * 1.5 ? 'increasing' : 'stable',
    current1h: errorRate1h,
    average6h: Math.round(errorRate6h),
    projectedNextHour: Math.round(errorRate1h * 1.2) // Simple projection
  };
}

/**
 * Generar recomendaciones de scaling
 */
async function generateScalingRecommendations(route, currentMetrics) {
  const recommendations = [];
  
  // Performance-based recommendations
  if (currentMetrics.performance.grade === 'F') {
    recommendations.push({
      type: 'scale_down',
      reason: 'Poor performance - reduce SSR percentage',
      action: 'Reduce SSR rollout by 20%',
      priority: 'high'
    });
  } else if (currentMetrics.performance.grade === 'A+' && currentMetrics.result.success) {
    recommendations.push({
      type: 'scale_up',
      reason: 'Excellent performance - increase SSR percentage',
      action: 'Increase SSR rollout by 15%',
      priority: 'medium'
    });
  }
  
  // Cache-based recommendations
  const cacheStats = getCacheStats();
  const routeCacheStats = cacheStats.byRoute[route];
  
  if (routeCacheStats && routeCacheStats.fresh / routeCacheStats.count < 0.5) {
    recommendations.push({
      type: 'optimize_cache',
      reason: 'Low cache hit rate',
      action: 'Increase cache TTL or improve invalidation strategy',
      priority: 'medium'
    });
  }
  
  return recommendations;
}

/**
 * Generar sugerencias de optimización
 */
async function generateOptimizationSuggestions(route, currentMetrics) {
  const suggestions = [];
  
  // Data fetch optimization
  if (currentMetrics.timing.dataFetch > 300) {
    suggestions.push({
      area: 'data_fetching',
      issue: 'Slow data fetch',
      suggestion: 'Implement parallel data fetching or add database indexes',
      impact: 'high'
    });
  }
  
  // Render optimization
  if (currentMetrics.timing.render > 500) {
    suggestions.push({
      area: 'rendering',
      issue: 'Slow server-side rendering',
      suggestion: 'Optimize component complexity or implement component caching',
      impact: 'medium'
    });
  }
  
  // Bundle size optimization
  if (currentMetrics.result.dataSize > 100000) {
    suggestions.push({
      area: 'payload',
      issue: 'Large data payload',
      suggestion: 'Implement data pagination or reduce initial data load',
      impact: 'medium'
    });
  }
  
  return suggestions;
}

/**
 * Obtener métricas recientes por ruta
 */
function getRecentMetricsByRoute(route, timeWindow) {
  const cutoff = Date.now() - timeWindow;
  
  return Array.from(advancedMetrics.performance.values())
    .filter(metric => metric.request.route === route && metric.timestampMs > cutoff)
    .sort((a, b) => a.timestampMs - b.timestampMs);
}

/**
 * Log métricas avanzadas
 */
function logAdvancedMetrics(route, userId, metrics) {
  console.info('ADVANCED_METRICS:', JSON.stringify({
    route,
    userId,
    timing: metrics.timing,
    performance: metrics.performance,
    webVitals: metrics.webVitals,
    result: metrics.result,
    system: metrics.system.memory,
    timestamp: metrics.timestamp
  }));
}

/**
 * Anonymizar IP
 */
function anonymizeIP(ip) {
  if (!ip) return 'unknown';
  return ip.replace(/\d+$/, 'xxx');
}

/**
 * Obtener dashboard de métricas avanzadas
 */
export function getAdvancedMetricsDashboard(timeWindow = ADVANCED_METRICS_CONFIG.timeWindows.shortTerm) {
  const cutoff = Date.now() - timeWindow;
  
  // Performance overview
  const performanceMetrics = Array.from(advancedMetrics.performance.values())
    .filter(m => m.timestampMs > cutoff);
  
  // Web Vitals overview
  const webVitalsMetrics = Array.from(advancedMetrics.webVitals.values())
    .filter(m => new Date(m.timestamp).getTime() > cutoff);
  
  // Error overview
  const errorMetrics = Array.from(advancedMetrics.errors.values())
    .filter(m => new Date(m.timestamp).getTime() > cutoff);
  
  // System overview
  const systemMetrics = Array.from(advancedMetrics.system.values())
    .filter(m => new Date(m.timestamp).getTime() > cutoff);
  
  return {
    timeWindow: timeWindow / (60 * 1000), // minutes
    summary: {
      totalRequests: performanceMetrics.length,
      averageResponseTime: Math.round(
        performanceMetrics.reduce((sum, m) => sum + m.timing.total, 0) / performanceMetrics.length
      ) || 0,
      errorRate: Math.round((errorMetrics.length / performanceMetrics.length) * 100) || 0,
      averageMemoryUsage: Math.round(
        systemMetrics.reduce((sum, m) => sum + (m.memory?.usage || 0), 0) / systemMetrics.length
      ) || 0
    },
    performance: {
      byGrade: calculateGradeDistribution(performanceMetrics),
      byRoute: calculateRoutePerformance(performanceMetrics),
      trends: {
        // Simplified trend calculation
        last15min: getMetricsForWindow(performanceMetrics, 15 * 60 * 1000),
        last60min: getMetricsForWindow(performanceMetrics, 60 * 60 * 1000)
      }
    },
    webVitals: {
      averages: calculateWebVitalsAverages(webVitalsMetrics),
      compliance: calculateWebVitalsCompliance(webVitalsMetrics)
    },
    errors: {
      byRoute: groupErrorsByRoute(errorMetrics),
      byType: groupErrorsByType(errorMetrics),
      recentErrors: errorMetrics.slice(-10)
    },
    system: {
      current: systemMetrics[systemMetrics.length - 1] || {},
      trends: calculateSystemTrends(systemMetrics)
    },
    cache: getCacheStats(),
    timestamp: new Date().toISOString()
  };
}

/**
 * Calcular distribución de grades
 */
function calculateGradeDistribution(metrics) {
  const distribution = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };
  
  metrics.forEach(m => {
    distribution[m.performance.grade]++;
  });
  
  return distribution;
}

/**
 * Calcular performance por ruta
 */
function calculateRoutePerformance(metrics) {
  const byRoute = {};
  
  metrics.forEach(m => {
    const route = m.request.route;
    if (!byRoute[route]) {
      byRoute[route] = {
        requests: 0,
        totalTime: 0,
        errors: 0,
        grades: { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 }
      };
    }
    
    byRoute[route].requests++;
    byRoute[route].totalTime += m.timing.total;
    if (!m.result.success) byRoute[route].errors++;
    byRoute[route].grades[m.performance.grade]++;
  });
  
  // Calculate averages
  Object.keys(byRoute).forEach(route => {
    const stats = byRoute[route];
    stats.avgResponseTime = Math.round(stats.totalTime / stats.requests);
    stats.errorRate = Math.round((stats.errors / stats.requests) * 100);
    stats.successRate = 100 - stats.errorRate;
  });
  
  return byRoute;
}

/**
 * Obtener métricas para ventana específica
 */
function getMetricsForWindow(metrics, windowMs) {
  const cutoff = Date.now() - windowMs;
  const windowMetrics = metrics.filter(m => m.timestampMs > cutoff);
  
  return {
    count: windowMetrics.length,
    avgTime: Math.round(
      windowMetrics.reduce((sum, m) => sum + m.timing.total, 0) / windowMetrics.length
    ) || 0
  };
}

/**
 * Calcular promedios de Web Vitals
 */
function calculateWebVitalsAverages(metrics) {
  if (metrics.length === 0) return {};
  
  return {
    fcp: Math.round(metrics.reduce((sum, m) => sum + m.fcp, 0) / metrics.length),
    lcp: Math.round(metrics.reduce((sum, m) => sum + m.lcp, 0) / metrics.length),
    fid: Math.round(metrics.reduce((sum, m) => sum + m.fid, 0) / metrics.length),
    cls: Math.round((metrics.reduce((sum, m) => sum + m.cls, 0) / metrics.length) * 100) / 100,
    ttfb: Math.round(metrics.reduce((sum, m) => sum + m.ttfb, 0) / metrics.length)
  };
}

/**
 * Calcular compliance de Web Vitals
 */
function calculateWebVitalsCompliance(metrics) {
  if (metrics.length === 0) return {};
  
  const targets = ADVANCED_METRICS_CONFIG.webVitals;
  
  return {
    lcp: Math.round((metrics.filter(m => m.lcp <= targets.targetLCP).length / metrics.length) * 100),
    fid: Math.round((metrics.filter(m => m.fid <= targets.targetFID).length / metrics.length) * 100),
    cls: Math.round((metrics.filter(m => m.cls <= targets.targetCLS).length / metrics.length) * 100),
    fcp: Math.round((metrics.filter(m => m.fcp <= targets.targetFCP).length / metrics.length) * 100),
    ttfb: Math.round((metrics.filter(m => m.ttfb <= targets.targetTTFB).length / metrics.length) * 100)
  };
}

/**
 * Agrupar errores por ruta
 */
function groupErrorsByRoute(errors) {
  const byRoute = {};
  
  errors.forEach(error => {
    if (!byRoute[error.route]) byRoute[error.route] = 0;
    byRoute[error.route]++;
  });
  
  return byRoute;
}

/**
 * Agrupar errores por tipo
 */
function groupErrorsByType(errors) {
  const byType = {};
  
  errors.forEach(error => {
    const type = error.error || 'unknown';
    if (!byType[type]) byType[type] = 0;
    byType[type]++;
  });
  
  return byType;
}

/**
 * Calcular tendencias del sistema
 */
function calculateSystemTrends(metrics) {
  if (metrics.length < 2) return {};
  
  const recent = metrics.slice(-5);
  const older = metrics.slice(-10, -5);
  
  if (recent.length === 0 || older.length === 0) return {};
  
  const recentMemory = recent.reduce((sum, m) => sum + (m.memory?.usage || 0), 0) / recent.length;
  const olderMemory = older.reduce((sum, m) => sum + (m.memory?.usage || 0), 0) / older.length;
  
  return {
    memory: {
      trend: recentMemory > olderMemory * 1.1 ? 'increasing' : recentMemory < olderMemory * 0.9 ? 'decreasing' : 'stable',
      change: Math.round(((recentMemory - olderMemory) / olderMemory) * 100)
    }
  };
}

/**
 * Endpoint para dashboard de métricas avanzadas
 */
export function advancedMetricsHandler(req, res) {
  try {
    const timeWindow = parseInt(req.query.window) || ADVANCED_METRICS_CONFIG.timeWindows.shortTerm;
    const dashboard = getAdvancedMetricsDashboard(timeWindow);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(dashboard);
  } catch (error) {
    console.error('Error getting advanced metrics dashboard:', error);
    res.status(500).json({ error: 'Failed to get advanced metrics dashboard' });
  }
}

/**
 * Limpiar todas las métricas avanzadas
 */
export function clearAdvancedMetrics() {
  Object.values(advancedMetrics).forEach(metricMap => metricMap.clear());
  return { cleared: true, timestamp: new Date().toISOString() };
}

export default {
  monitorAdvancedPerformance,
  getAdvancedMetricsDashboard,
  advancedMetricsHandler,
  clearAdvancedMetrics
};