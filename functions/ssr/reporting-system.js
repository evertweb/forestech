/**
 * Sistema de Reportes SSR - Fase 4
 * Sistema avanzado de reportes y métricas para monitoreo SSR
 */

import { getErrorStatistics } from './error-handler-advanced.js';
import { getAdvancedMetricsDashboard } from './monitoring-advanced.js';
import { getCacheStats } from './cache-strategy.js';
import { getPhase4Config } from './ab-testing-phase4.js';

// Configuración de reportes
const REPORTS_CONFIG = {
  // Frecuencias de generación automática
  frequencies: {
    realTime: 5 * 60 * 1000,      // 5 minutos
    hourly: 60 * 60 * 1000,       // 1 hora
    daily: 24 * 60 * 60 * 1000,   // 1 día
    weekly: 7 * 24 * 60 * 60 * 1000 // 1 semana
  },
  
  // Umbrales para alertas automáticas
  alertThresholds: {
    errorRate: 5,           // % máximo de errores
    slowResponseRate: 20,   // % máximo de respuestas lentas
    cacheHitRate: 70,       // % mínimo de cache hits
    memoryUsage: 85,        // % máximo de memoria
    p95ResponseTime: 2000,  // ms máximo para p95
    averageResponseTime: 800 // ms máximo para promedio
  },
  
  // Configuración de retención de datos
  retention: {
    rawMetrics: 7 * 24 * 60 * 60 * 1000,    // 7 días
    hourlyReports: 30 * 24 * 60 * 60 * 1000, // 30 días
    dailyReports: 90 * 24 * 60 * 60 * 1000,  // 90 días
    weeklyReports: 365 * 24 * 60 * 60 * 1000 // 1 año
  }
};

// Storage para reportes generados
const reportStorage = new Map();
const alertHistory = new Map();

/**
 * Generar reporte completo de SSR
 */
export async function generateSSRReport(timeWindow = '1h', options = {}) {
  const reportId = generateReportId();
  const startTime = Date.now();
  
  try {
    console.info('GENERATING_SSR_REPORT:', JSON.stringify({
      reportId,
      timeWindow,
      options,
      timestamp: new Date().toISOString()
    }));
    
    // Calcular ventana de tiempo
    const windowMs = parseTimeWindow(timeWindow);
    
    // Recopilar datos de múltiples fuentes
    const [
      errorStats,
      performanceData,
      cacheData,
      abTestingData
    ] = await Promise.all([
      getErrorStatistics(windowMs),
      getAdvancedMetricsDashboard(windowMs),
      getCacheStats(),
      getPhase4Config()
    ]);
    
    // Generar análisis consolidado
    const analysis = await generateAnalysis(errorStats, performanceData, cacheData, abTestingData, windowMs);
    
    // Crear reporte estructurado
    const report = {
      id: reportId,
      metadata: {
        generatedAt: new Date().toISOString(),
        timeWindow,
        windowMs,
        generationTime: Date.now() - startTime,
        version: '4.0.0',
        requestedBy: options.requestedBy || 'system'
      },
      
      // Resumen ejecutivo
      summary: generateExecutiveSummary(analysis),
      
      // Secciones detalladas
      sections: {
        performance: generatePerformanceSection(performanceData, analysis),
        errors: generateErrorSection(errorStats, analysis),
        cache: generateCacheSection(cacheData, analysis),
        abTesting: generateABTestingSection(abTestingData, analysis),
        alerts: generateAlertsSection(analysis),
        recommendations: generateRecommendationsSection(analysis)
      },
      
      // Datos raw para debugging
      rawData: options.includeRawData ? {
        errorStats,
        performanceData,
        cacheData,
        abTestingData
      } : null,
      
      // Estado del sistema
      systemHealth: calculateSystemHealth(analysis)
    };

/**
 * Calcula el estado de salud del sistema SSR
 */
function calculateSystemHealth(analysis) {
  const { performanceSummary, errorSummary, cacheSummary } = analysis;
  
  let score = 100;
  let issues = [];
  let status = 'healthy';
  
  // Penalizar por errores
  if (errorSummary.errorRate > 0.05) { // >5% error rate
    score -= 30;
    issues.push('High error rate detected');
    status = 'critical';
  } else if (errorSummary.errorRate > 0.02) { // >2% error rate
    score -= 15;
    issues.push('Elevated error rate');
    status = 'warning';
  }
  
  // Penalizar por performance pobre
  if (performanceSummary.avgResponseTime > 2000) { // >2s response time
    score -= 25;
    issues.push('Slow response times');
    status = status === 'critical' ? 'critical' : 'warning';
  } else if (performanceSummary.avgResponseTime > 1000) { // >1s response time
    score -= 10;
    issues.push('Moderate response times');
  }
  
  // Penalizar por cache hit rate bajo
  if (cacheSummary.hitRate < 0.5) { // <50% cache hit rate
    score -= 15;
    issues.push('Low cache hit rate');
  }
  
  // Determinar status final
  if (score >= 90) status = 'healthy';
  else if (score >= 70) status = 'warning';
  else status = 'critical';
  
  return {
    score: Math.max(0, score),
    status,
    issues,
    lastCheck: new Date().toISOString()
  };
}
    
    // Almacenar reporte
    storeReport(report);
    
    // Verificar si se necesitan alertas
    await checkAndTriggerAlerts(report);
    
    console.info('SSR_REPORT_GENERATED:', JSON.stringify({
      reportId,
      summary: report.summary,
      systemHealth: report.systemHealth,
      generationTime: report.metadata.generationTime
    }));
    
    return report;
    
  } catch (error) {
    console.error('ERROR_GENERATING_REPORT:', JSON.stringify({
      reportId,
      error: error.message,
      timeWindow,
      timestamp: new Date().toISOString()
    }));
    
    throw new Error(`Failed to generate SSR report: ${error.message}`);
  }
}

/**
 * Generar análisis consolidado
 */
async function generateAnalysis(errorStats, performanceData, cacheData, abTestingData, windowMs) {
  const windowHours = windowMs / (60 * 60 * 1000);
  
  return {
    timeFrame: {
      windowMs,
      windowHours,
      windowDescription: formatTimeWindow(windowMs)
    },
    
    // Análisis de performance
    performance: {
      totalRequests: performanceData.summary.totalRequests,
      averageResponseTime: performanceData.summary.averageResponseTime,
      errorRate: performanceData.summary.errorRate,
      memoryUsage: performanceData.summary.averageMemoryUsage,
      
      // Análisis de tendencias
      trends: analyzePerformanceTrends(performanceData),
      
      // Compliance con SLOs
      sloCompliance: calculateSLOCompliance(performanceData),
      
      // Performance por ruta
      routePerformance: performanceData.performance.byRoute
    },
    
    // Análisis de errores
    errors: {
      totalErrors: errorStats.totalErrors,
      errorsByCategory: errorStats.byCategory,
      errorsBySeverity: errorStats.bySeverity,
      errorsByRoute: errorStats.byRoute,
      
      // Patrones críticos
      criticalPatterns: identifyCriticalErrorPatterns(errorStats),
      
      // Tendencias de error
      errorTrends: analyzeErrorTrends(errorStats)
    },
    
    // Análisis de cache
    cache: {
      totalEntries: cacheData.totalEntries,
      hitRate: calculateCacheHitRate(cacheData),
      efficiency: analyzeCacheEfficiency(cacheData),
      recommendations: generateCacheRecommendations(cacheData)
    },
    
    // Análisis A/B Testing
    abTesting: {
      totalCoverage: abTestingData.totalCoverage,
      routesEnabled: abTestingData.totalRoutes,
      rolloutStatus: analyzeRolloutStatus(abTestingData),
      performanceImpact: analyzeABPerformanceImpact(performanceData, abTestingData)
    }
  };
}

/**
 * Generar resumen ejecutivo
 */
function generateExecutiveSummary(analysis) {
  const issues = [];
  const highlights = [];
  
  // Identificar issues críticos
  if (analysis.performance.errorRate > REPORTS_CONFIG.alertThresholds.errorRate) {
    issues.push(`Error rate alto: ${analysis.performance.errorRate}%`);
  }
  
  if (analysis.performance.averageResponseTime > REPORTS_CONFIG.alertThresholds.averageResponseTime) {
    issues.push(`Tiempo de respuesta alto: ${analysis.performance.averageResponseTime}ms`);
  }
  
  if (analysis.cache.hitRate < REPORTS_CONFIG.alertThresholds.cacheHitRate) {
    issues.push(`Cache hit rate bajo: ${analysis.cache.hitRate}%`);
  }
  
  if (analysis.performance.memoryUsage > REPORTS_CONFIG.alertThresholds.memoryUsage) {
    issues.push(`Uso de memoria alto: ${analysis.performance.memoryUsage}%`);
  }
  
  // Identificar highlights positivos
  if (analysis.performance.errorRate < 1) {
    highlights.push('Excelente tasa de errores');
  }
  
  if (analysis.performance.averageResponseTime < 500) {
    highlights.push('Tiempos de respuesta óptimos');
  }
  
  if (analysis.cache.hitRate > 90) {
    highlights.push('Cache funcionando eficientemente');
  }
  
  // Calcular health score general
  const healthScore = calculateOverallHealthScore(analysis);
  
  return {
    healthScore,
    status: healthScore >= 80 ? 'excellent' : healthScore >= 60 ? 'good' : healthScore >= 40 ? 'warning' : 'critical',
    totalRequests: analysis.performance.totalRequests,
    totalErrors: analysis.errors.totalErrors,
    averageResponseTime: analysis.performance.averageResponseTime,
    cacheHitRate: analysis.cache.hitRate,
    issues,
    highlights,
    timeFrame: analysis.timeFrame.windowDescription
  };
}

/**
 * Generar sección de performance
 */
function generatePerformanceSection(performanceData, analysis) {
  return {
    overview: {
      totalRequests: analysis.performance.totalRequests,
      averageResponseTime: analysis.performance.averageResponseTime,
      errorRate: analysis.performance.errorRate,
      memoryUsage: analysis.performance.memoryUsage
    },
    
    webVitals: performanceData.webVitals || {},
    
    routePerformance: Object.entries(analysis.performance.routePerformance).map(([route, stats]) => ({
      route,
      ...stats,
      status: getRouteHealthStatus(stats)
    })),
    
    trends: analysis.performance.trends,
    
    sloCompliance: analysis.performance.sloCompliance,
    
    recommendations: generatePerformanceRecommendations(analysis.performance)
  };
}

/**
 * Generar sección de errores
 */
function generateErrorSection(errorStats, analysis) {
  return {
    overview: {
      totalErrors: analysis.errors.totalErrors,
      errorRate: (analysis.errors.totalErrors / analysis.performance.totalRequests) * 100,
      criticalErrors: Object.values(analysis.errors.errorsByCategory).reduce((sum, count) => sum + count, 0)
    },
    
    breakdown: {
      byCategory: analysis.errors.errorsByCategory,
      bySeverity: analysis.errors.errorsBySeverity,
      byRoute: analysis.errors.errorsByRoute
    },
    
    criticalPatterns: analysis.errors.criticalPatterns,
    
    trends: analysis.errors.errorTrends,
    
    recentErrors: errorStats.patterns.slice(0, 10),
    
    recommendations: generateErrorRecommendations(analysis.errors)
  };
}

/**
 * Generar sección de cache
 */
function generateCacheSection(cacheData, analysis) {
  return {
    overview: {
      totalEntries: analysis.cache.totalEntries,
      hitRate: analysis.cache.hitRate,
      efficiency: analysis.cache.efficiency
    },
    
    byRoute: cacheData.byRoute || {},
    
    performance: {
      avgHitTime: calculateAverageHitTime(cacheData),
      avgMissTime: calculateAverageMissTime(cacheData),
      evictionRate: calculateEvictionRate(cacheData)
    },
    
    recommendations: analysis.cache.recommendations
  };
}

/**
 * Generar sección de A/B Testing
 */
function generateABTestingSection(abTestingData, analysis) {
  return {
    overview: {
      totalCoverage: analysis.abTesting.totalCoverage,
      routesEnabled: analysis.abTesting.routesEnabled,
      rolloutStatus: analysis.abTesting.rolloutStatus
    },
    
    routeBreakdown: Object.entries(abTestingData.routes || {}).map(([route, config]) => ({
      route,
      enabled: config.enabled,
      percentage: config.percentage,
      status: config.enabled ? 'active' : 'disabled'
    })),
    
    performanceImpact: analysis.abTesting.performanceImpact,
    
    recommendations: generateABTestingRecommendations(analysis.abTesting)
  };
}

/**
 * Generar sección de alertas
 */
function generateAlertsSection(analysis) {
  const alerts = [];
  
  // Verificar cada umbral
  Object.entries(REPORTS_CONFIG.alertThresholds).forEach(([metric, threshold]) => {
    const currentValue = getCurrentMetricValue(analysis, metric);
    if (currentValue !== null && shouldAlert(metric, currentValue, threshold)) {
      alerts.push({
        type: 'threshold_exceeded',
        metric,
        currentValue,
        threshold,
        severity: getAlertSeverity(metric, currentValue, threshold),
        timestamp: new Date().toISOString()
      });
    }
  });
  
  return {
    activeAlerts: alerts,
    alertHistory: getRecentAlertHistory(),
    recommendations: generateAlertRecommendations(alerts)
  };
}

/**
 * Generar sección de recomendaciones
 */
function generateRecommendationsSection(analysis) {
  const recommendations = [];
  
  // Recomendaciones de performance
  recommendations.push(...generatePerformanceRecommendations(analysis.performance));
  
  // Recomendaciones de errores
  recommendations.push(...generateErrorRecommendations(analysis.errors));
  
  // Recomendaciones de cache
  recommendations.push(...analysis.cache.recommendations);
  
  // Recomendaciones de A/B testing
  recommendations.push(...generateABTestingRecommendations(analysis.abTesting));
  
  // Priorizar recomendaciones
  return recommendations
    .sort((a, b) => getPriority(b.priority) - getPriority(a.priority))
    .slice(0, 10); // Top 10 recomendaciones
}

/**
 * Verificar y disparar alertas
 */
async function checkAndTriggerAlerts(report) {
  const alerts = report.sections.alerts.activeAlerts;
  
  for (const alert of alerts) {
    if (alert.severity === 'critical' || alert.severity === 'high') {
      await sendAlert(alert, report);
    }
  }
}

/**
 * Enviar alerta
 */
async function sendAlert(alert, report) {
  const alertData = {
    ...alert,
    reportId: report.id,
    systemHealth: report.systemHealth,
    summary: report.summary,
    timestamp: new Date().toISOString()
  };
  
  console.error('SSR_CRITICAL_ALERT:', JSON.stringify(alertData));
  
  // Registrar en historial
  alertHistory.set(`${Date.now()}_${alert.metric}`, alertData);
  
  // Enviar a webhook si está configurado
  if (process.env.SSR_ALERTS_WEBHOOK_URL) {
    try {
      await fetch(process.env.SSR_ALERTS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 SSR Alert: ${alert.metric} = ${alert.currentValue} (threshold: ${alert.threshold})`,
          ...alertData
        })
      });
    } catch (error) {
      console.error('Failed to send alert webhook:', error.message);
    }
  }
}

/**
 * Funciones de utilidad
 */

function generateReportId() {
  return `ssr_report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function parseTimeWindow(timeWindow) {
  const units = { 
    'm': 60 * 1000, 
    'h': 60 * 60 * 1000, 
    'd': 24 * 60 * 60 * 1000 
  };
  
  const match = timeWindow.match(/^(\d+)([mhd])$/);
  if (!match) return 60 * 60 * 1000; // Default 1 hour
  
  const [, value, unit] = match;
  return parseInt(value) * units[unit];
}

function formatTimeWindow(windowMs) {
  const hours = windowMs / (60 * 60 * 1000);
  if (hours < 1) return `${Math.round(windowMs / (60 * 1000))} minutos`;
  if (hours < 24) return `${Math.round(hours)} hora${hours > 1 ? 's' : ''}`;
  const days = Math.round(hours / 24);
  return `${days} día${days > 1 ? 's' : ''}`;
}

function calculateOverallHealthScore(analysis) {
  let score = 100;
  
  // Penalizar por errores
  score -= analysis.performance.errorRate * 10;
  
  // Penalizar por tiempo de respuesta
  if (analysis.performance.averageResponseTime > 500) {
    score -= Math.min(30, (analysis.performance.averageResponseTime - 500) / 50);
  }
  
  // Penalizar por bajo cache hit rate
  if (analysis.cache.hitRate < 80) {
    score -= (80 - analysis.cache.hitRate) / 2;
  }
  
  // Penalizar por alta memoria
  if (analysis.performance.memoryUsage > 70) {
    score -= (analysis.performance.memoryUsage - 70);
  }
  
  return Math.max(0, Math.round(score));
}

function storeReport(report) {
  reportStorage.set(report.id, report);
  
  // Limpiar reportes antiguos
  if (reportStorage.size > 100) {
    const oldestKey = reportStorage.keys().next().value;
    reportStorage.delete(oldestKey);
  }
}

function getRecentAlertHistory() {
  const recent = Date.now() - 24 * 60 * 60 * 1000; // Últimas 24 horas
  return Array.from(alertHistory.values())
    .filter(alert => new Date(alert.timestamp).getTime() > recent)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 20);
}

// Funciones de análisis (implementaciones básicas)
function analyzePerformanceTrends(performanceData) {
  return { trend: 'stable', change: 0 }; // Simplificado
}

function calculateSLOCompliance(performanceData) {
  return { availability: 99.9, performance: 95.5 }; // Simplificado
}

function identifyCriticalErrorPatterns(errorStats) {
  return []; // Simplificado
}

function analyzeErrorTrends(errorStats) {
  return { trend: 'stable', change: 0 }; // Simplificado
}

function calculateCacheHitRate(cacheData) {
  return cacheData.hitRate || 0;
}

function analyzeCacheEfficiency(cacheData) {
  return 'good'; // Simplificado
}

function generateCacheRecommendations(cacheData) {
  return []; // Simplificado
}

function analyzeRolloutStatus(abTestingData) {
  return 'progressive'; // Simplificado
}

function analyzeABPerformanceImpact(performanceData, abTestingData) {
  return { impact: 'positive', improvement: 5 }; // Simplificado
}

function generatePerformanceRecommendations(performance) {
  return []; // Simplificado
}

function generateErrorRecommendations(errors) {
  return []; // Simplificado
}

function generateABTestingRecommendations(abTesting) {
  return []; // Simplificado
}

function getRouteHealthStatus(stats) {
  if (stats.errorRate > 5) return 'critical';
  if (stats.avgResponseTime > 1000) return 'warning';
  return 'healthy';
}

function getCurrentMetricValue(analysis, metric) {
  const mapping = {
    errorRate: analysis.performance.errorRate,
    averageResponseTime: analysis.performance.averageResponseTime,
    cacheHitRate: analysis.cache.hitRate,
    memoryUsage: analysis.performance.memoryUsage
  };
  return mapping[metric] || null;
}

function shouldAlert(metric, currentValue, threshold) {
  const reversed = ['cacheHitRate']; // Metrics where lower is worse
  return reversed.includes(metric) ? currentValue < threshold : currentValue > threshold;
}

function getAlertSeverity(metric, currentValue, threshold) {
  const diff = Math.abs(currentValue - threshold);
  if (diff > threshold * 0.5) return 'critical';
  if (diff > threshold * 0.2) return 'high';
  return 'medium';
}

function generateAlertRecommendations(alerts) {
  return alerts.map(alert => ({
    type: 'alert_response',
    priority: 'high',
    description: `Address ${alert.metric} issue`,
    action: `Investigate and fix ${alert.metric} threshold breach`
  }));
}

function getPriority(priority) {
  const priorities = { critical: 4, high: 3, medium: 2, low: 1 };
  return priorities[priority] || 0;
}

function calculateAverageHitTime(cacheData) {
  return 5; // Simplificado - ms
}

function calculateAverageMissTime(cacheData) {
  return 150; // Simplificado - ms
}

function calculateEvictionRate(cacheData) {
  return 2; // Simplificado - %
}

/**
 * Endpoint para generar reportes bajo demanda
 */
export function reportingHandler(req, res) {
  try {
    const { timeWindow = '1h', format = 'json', includeRawData = false } = req.query;
    
    generateSSRReport(timeWindow, { 
      includeRawData: includeRawData === 'true',
      requestedBy: req.user?.uid || 'anonymous'
    })
      .then(report => {
        if (format === 'html') {
          const html = generateReportHTML(report);
          res.setHeader('Content-Type', 'text/html');
          res.status(200).send(html);
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(report);
        }
      })
      .catch(error => {
        console.error('Error generating report:', error);
        res.status(500).json({ 
          error: 'Failed to generate report',
          message: error.message 
        });
      });
      
  } catch (error) {
    console.error('Error in reporting handler:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

/**
 * Generar HTML del reporte
 */
function generateReportHTML(report) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSR Report - ${report.id}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    .header { border-bottom: 2px solid #2d5a27; padding-bottom: 20px; margin-bottom: 20px; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .card { background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #2d5a27; }
    .status-excellent { border-left-color: #30914f; }
    .status-warning { border-left-color: #df6e00; }
    .status-critical { border-left-color: #dc0d0e; }
    .section { margin-bottom: 30px; }
    .section h2 { color: #2d5a27; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f9f9f9; font-weight: bold; }
    .metric-value { font-size: 1.5em; font-weight: bold; color: #2d5a27; }
    .recommendations { background: #fff3cd; padding: 15px; border-radius: 8px; border: 1px solid #ffeaa7; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reporte SSR - Forestech</h1>
      <p><strong>ID:</strong> ${report.id}</p>
      <p><strong>Generado:</strong> ${new Date(report.metadata.generatedAt).toLocaleString('es-CO')}</p>
      <p><strong>Período:</strong> ${report.summary.timeFrame}</p>
    </div>
    
    <div class="summary">
      <div class="card status-${report.summary.status}">
        <h3>Health Score</h3>
        <div class="metric-value">${report.summary.healthScore}%</div>
      </div>
      <div class="card">
        <h3>Total Requests</h3>
        <div class="metric-value">${report.summary.totalRequests.toLocaleString()}</div>
      </div>
      <div class="card">
        <h3>Avg Response Time</h3>
        <div class="metric-value">${report.summary.averageResponseTime}ms</div>
      </div>
      <div class="card">
        <h3>Cache Hit Rate</h3>
        <div class="metric-value">${report.summary.cacheHitRate}%</div>
      </div>
    </div>
    
    <div class="section">
      <h2>🚨 Issues Detectados</h2>
      ${report.summary.issues.length > 0 ? 
        '<ul>' + report.summary.issues.map(issue => `<li>${issue}</li>`).join('') + '</ul>' :
        '<p>✅ No hay issues críticos detectados</p>'
      }
    </div>
    
    <div class="section">
      <h2>🎯 Highlights</h2>
      ${report.summary.highlights.length > 0 ? 
        '<ul>' + report.summary.highlights.map(highlight => `<li>${highlight}</li>`).join('') + '</ul>' :
        '<p>No hay highlights especiales</p>'
      }
    </div>
    
    <div class="section">
      <h2>📊 Performance por Ruta</h2>
      <table>
        <thead>
          <tr>
            <th>Ruta</th>
            <th>Requests</th>
            <th>Avg Time</th>
            <th>Error Rate</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${report.sections.performance.routePerformance.map(route => `
            <tr>
              <td>${route.route}</td>
              <td>${route.requests.toLocaleString()}</td>
              <td>${route.avgResponseTime}ms</td>
              <td>${route.errorRate}%</td>
              <td>${route.status}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="recommendations">
      <h2>💡 Recomendaciones</h2>
      ${report.sections.recommendations.length > 0 ? 
        '<ul>' + report.sections.recommendations.map(rec => `<li><strong>${rec.priority}:</strong> ${rec.description}</li>`).join('') + '</ul>' :
        '<p>No hay recomendaciones específicas en este momento</p>'
      }
    </div>
    
    <div class="section">
      <p><small>Reporte generado automáticamente por Sistema SSR Forestech v${report.metadata.version}</small></p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Obtener reporte por ID
 */
export function getReport(reportId) {
  return reportStorage.get(reportId);
}

/**
 * Listar reportes recientes
 */
export function listReports(limit = 10) {
  return Array.from(reportStorage.values())
    .sort((a, b) => new Date(b.metadata.generatedAt) - new Date(a.metadata.generatedAt))
    .slice(0, limit)
    .map(report => ({
      id: report.id,
      generatedAt: report.metadata.generatedAt,
      timeWindow: report.metadata.timeWindow,
      healthScore: report.summary.healthScore,
      status: report.summary.status,
      totalRequests: report.summary.totalRequests
    }));
}

export default {
  generateSSRReport,
  reportingHandler,
  getReport,
  listReports
};
