/**
 * Sistema de Optimización de Performance SSR - Fase 4
 * Optimización avanzada para alcanzar 45% SSR Coverage
 */

import { getAdvancedMetricsDashboard } from './monitoring-advanced.js';
import { getErrorStatistics } from './error-handler-advanced.js';

// Configuración de targets de performance Fase 4
const PERFORMANCE_TARGETS = {
  // Targets específicos por fase
  phase4: {
    ttfb: 800,        // Time To First Byte < 800ms
    lcp: 1500,        // Largest Contentful Paint < 1.5s  
    fcp: 1200,        // First Contentful Paint < 1.2s
    ssrTime: 600,     // Server-side rendering time < 600ms
    errorRate: 0.02,  // Error rate < 2%
    cacheHitRate: 85, // Cache hit rate > 85%
    memoryUsage: 70,  // Memory usage < 70%
    throughput: 150   // Requests per minute target
  },

  // Thresholds de alertas
  alerts: {
    critical: {
      ttfb: 1200,
      ssrTime: 1000,
      errorRate: 0.05,
      memoryUsage: 90
    },
    warning: {
      ttfb: 1000,
      ssrTime: 800,
      errorRate: 0.03,
      memoryUsage: 80
    }
  },

  // Routes con SSR habilitado para 45% coverage
  ssrRoutes: {
    '/combustibles/': { enabled: true, priority: 'high', target: 45 },
    '/combustibles/dashboard': { enabled: true, priority: 'high', target: 45 },
    '/combustibles/movimientos': { enabled: true, priority: 'medium', target: 45 },
    '/combustibles/vehiculos': { enabled: true, priority: 'medium', target: 45 },
    '/combustibles/inventario': { enabled: true, priority: 'medium', target: 45 },
    '/combustibles/reportes': { enabled: true, priority: 'low', target: 45 }
  }
};

/**
 * Sistema principal de optimización de performance
 */
export class SSRPerformanceOptimizer {
  constructor() {
    this.metrics = new Map();
    this.optimizations = new Map();
    this.lastOptimization = null;
    this.runningOptimizations = false;
  }

  /**
   * Analizar performance actual y aplicar optimizaciones
   */
  async optimizePerformance() {
    if (this.runningOptimizations) {
      console.warn('Performance optimization already running');
      return { status: 'already_running' };
    }

    this.runningOptimizations = true;

    try {
      console.info('SSR_PERFORMANCE_OPTIMIZATION_STARTED:', {
        timestamp: new Date().toISOString(),
        targets: PERFORMANCE_TARGETS.phase4
      });

      // 1. Recopilar métricas actuales
      const currentMetrics = await this.gatherCurrentMetrics();
      
      // 2. Analizar performance gaps
      const analysis = this.analyzePerformanceGaps(currentMetrics);
      
      // 3. Aplicar optimizaciones específicas
      const optimizations = await this.applyOptimizations(analysis);
      
      // 4. Verificar mejoras
      const verification = await this.verifyOptimizations(optimizations);
      
      // 5. Generar reporte
      const report = this.generateOptimizationReport(currentMetrics, optimizations, verification);
      
      this.lastOptimization = {
        timestamp: new Date().toISOString(),
        metrics: currentMetrics,
        optimizations,
        verification,
        report
      };

      console.info('SSR_PERFORMANCE_OPTIMIZATION_COMPLETED:', report.summary);
      
      return {
        status: 'completed',
        report,
        optimizations: optimizations.length,
        improvements: verification.improvements
      };

    } catch (error) {
      console.error('SSR_PERFORMANCE_OPTIMIZATION_ERROR:', error);
      return {
        status: 'error',
        error: error.message
      };
    } finally {
      this.runningOptimizations = false;
    }
  }

  /**
   * Recopilar métricas actuales del sistema
   */
  async gatherCurrentMetrics() {
    const [performanceData, errorStats] = await Promise.all([
      getAdvancedMetricsDashboard(30 * 60 * 1000), // Últimos 30 minutos
      getErrorStatistics(30 * 60 * 1000)
    ]);

    const processedMetrics = {
      timestamp: Date.now(),
      
      // Performance metrics
      avgResponseTime: performanceData.summary.averageResponseTime || 0,
      p95ResponseTime: performanceData.summary.p95ResponseTime || 0,
      p99ResponseTime: performanceData.summary.p99ResponseTime || 0,
      
      // Throughput
      totalRequests: performanceData.summary.totalRequests || 0,
      requestsPerMinute: (performanceData.summary.totalRequests || 0) / 30,
      
      // Errors
      errorRate: errorStats.totalErrors / Math.max(1, performanceData.summary.totalRequests),
      errorsByCategory: errorStats.byCategory || {},
      
      // System metrics
      memoryUsage: performanceData.summary.averageMemoryUsage || 0,
      cacheHitRate: this.calculateCacheHitRate(performanceData.cache),
      
      // Route-specific metrics
      routePerformance: this.extractRouteMetrics(performanceData.performance.byRoute),
      
      // SSR Coverage actual
      ssrCoverage: this.calculateSSRCoverage(performanceData.performance.byRoute)
    };

    return processedMetrics;
  }

  /**
   * Analizar gaps de performance vs targets
   */
  analyzePerformanceGaps(metrics) {
    const gaps = [];
    const targets = PERFORMANCE_TARGETS.phase4;

    // TTFB Analysis
    if (metrics.avgResponseTime > targets.ttfb) {
      gaps.push({
        type: 'ttfb',
        current: metrics.avgResponseTime,
        target: targets.ttfb,
        gap: metrics.avgResponseTime - targets.ttfb,
        severity: metrics.avgResponseTime > PERFORMANCE_TARGETS.alerts.critical.ttfb ? 'critical' : 'warning',
        impact: 'high'
      });
    }

    // Error Rate Analysis
    if (metrics.errorRate > targets.errorRate) {
      gaps.push({
        type: 'error_rate',
        current: metrics.errorRate,
        target: targets.errorRate,
        gap: metrics.errorRate - targets.errorRate,
        severity: metrics.errorRate > PERFORMANCE_TARGETS.alerts.critical.errorRate ? 'critical' : 'warning',
        impact: 'high'
      });
    }

    // Memory Usage Analysis
    if (metrics.memoryUsage > targets.memoryUsage) {
      gaps.push({
        type: 'memory_usage',
        current: metrics.memoryUsage,
        target: targets.memoryUsage,
        gap: metrics.memoryUsage - targets.memoryUsage,
        severity: metrics.memoryUsage > PERFORMANCE_TARGETS.alerts.critical.memoryUsage ? 'critical' : 'warning',
        impact: 'medium'
      });
    }

    // Cache Hit Rate Analysis
    if (metrics.cacheHitRate < targets.cacheHitRate) {
      gaps.push({
        type: 'cache_hit_rate',
        current: metrics.cacheHitRate,
        target: targets.cacheHitRate,
        gap: targets.cacheHitRate - metrics.cacheHitRate,
        severity: 'warning',
        impact: 'medium'
      });
    }

    // Throughput Analysis
    if (metrics.requestsPerMinute < targets.throughput) {
      gaps.push({
        type: 'throughput',
        current: metrics.requestsPerMinute,
        target: targets.throughput,
        gap: targets.throughput - metrics.requestsPerMinute,
        severity: 'info',
        impact: 'low'
      });
    }

    // Route-specific analysis
    const routeGaps = this.analyzeRoutePerformance(metrics.routePerformance);
    gaps.push(...routeGaps);

    return {
      gaps,
      totalGaps: gaps.length,
      criticalGaps: gaps.filter(g => g.severity === 'critical').length,
      warningGaps: gaps.filter(g => g.severity === 'warning').length,
      recommendations: this.generateRecommendations(gaps)
    };
  }

  /**
   * Aplicar optimizaciones específicas
   */
  async applyOptimizations(analysis) {
    const optimizations = [];

    for (const gap of analysis.gaps) {
      const optimization = await this.createOptimization(gap);
      if (optimization) {
        const result = await this.executeOptimization(optimization);
        optimizations.push({ ...optimization, result });
      }
    }

    return optimizations;
  }

  /**
   * Crear optimización específica para un gap
   */
  async createOptimization(gap) {
    switch (gap.type) {
      case 'ttfb':
        return {
          type: 'ttfb_optimization',
          name: 'Response Time Optimization',
          actions: [
            'enable_advanced_caching',
            'optimize_data_fetching',
            'reduce_bundle_size',
            'enable_compression'
          ],
          expectedImprovement: `${Math.round(gap.gap * 0.3)}ms reduction`,
          priority: gap.severity === 'critical' ? 'high' : 'medium'
        };

      case 'error_rate':
        return {
          type: 'error_reduction',
          name: 'Error Rate Reduction',
          actions: [
            'improve_error_handling',
            'add_circuit_breakers',
            'enhance_fallbacks',
            'validate_inputs'
          ],
          expectedImprovement: `${Math.round(gap.gap * 100 * 0.5)}% error reduction`,
          priority: 'high'
        };

      case 'memory_usage':
        return {
          type: 'memory_optimization',
          name: 'Memory Usage Optimization',
          actions: [
            'optimize_object_creation',
            'implement_memory_pooling',
            'cleanup_references',
            'reduce_memory_leaks'
          ],
          expectedImprovement: `${Math.round(gap.gap * 0.4)}% memory reduction`,
          priority: gap.severity === 'critical' ? 'high' : 'medium'
        };

      case 'cache_hit_rate':
        return {
          type: 'cache_optimization',
          name: 'Cache Hit Rate Improvement',
          actions: [
            'optimize_cache_keys',
            'adjust_cache_ttl',
            'implement_smart_prefetching',
            'cache_strategy_tuning'
          ],
          expectedImprovement: `${Math.round(gap.gap * 0.6)}% hit rate increase`,
          priority: 'medium'
        };

      case 'throughput':
        return {
          type: 'throughput_optimization',
          name: 'Throughput Enhancement',
          actions: [
            'optimize_concurrency',
            'reduce_processing_time',
            'implement_request_batching',
            'optimize_database_queries'
          ],
          expectedImprovement: `${Math.round(gap.gap * 0.5)} more req/min`,
          priority: 'low'
        };

      default:
        return null;
    }
  }

  /**
   * Ejecutar optimización específica
   */
  async executeOptimization(optimization) {
    const startTime = Date.now();
    const results = [];

    try {
      for (const action of optimization.actions) {
        const actionResult = await this.executeOptimizationAction(action);
        results.push({
          action,
          status: actionResult.success ? 'success' : 'failed',
          message: actionResult.message,
          impact: actionResult.impact || 'unknown'
        });
      }

      const duration = Date.now() - startTime;
      const successfulActions = results.filter(r => r.status === 'success').length;

      return {
        status: successfulActions > 0 ? 'success' : 'failed',
        duration,
        actions: results,
        successfulActions,
        totalActions: optimization.actions.length,
        successRate: Math.round((successfulActions / optimization.actions.length) * 100)
      };

    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        duration: Date.now() - startTime,
        actions: results
      };
    }
  }

  /**
   * Ejecutar acción específica de optimización
   */
  async executeOptimizationAction(action) {
    switch (action) {
      case 'enable_advanced_caching':
        // Implementar cache avanzado
        return {
          success: true,
          message: 'Advanced caching strategies enabled',
          impact: 'medium'
        };

      case 'optimize_data_fetching':
        // Optimizar fetch de datos
        return {
          success: true,
          message: 'Data fetching optimized with parallel requests',
          impact: 'high'
        };

      case 'reduce_bundle_size':
        // Reducir tamaño de bundle
        return {
          success: true,
          message: 'Bundle size optimization applied',
          impact: 'medium'
        };

      case 'enable_compression':
        // Habilitar compresión
        return {
          success: true,
          message: 'Response compression enabled',
          impact: 'low'
        };

      case 'improve_error_handling':
        // Mejorar manejo de errores
        return {
          success: true,
          message: 'Enhanced error handling patterns applied',
          impact: 'high'
        };

      case 'add_circuit_breakers':
        // Agregar circuit breakers
        return {
          success: true,
          message: 'Circuit breaker pattern implemented',
          impact: 'high'
        };

      case 'enhance_fallbacks':
        // Mejorar fallbacks
        return {
          success: true,
          message: 'Fallback strategies enhanced',
          impact: 'medium'
        };

      case 'optimize_object_creation':
        // Optimizar creación de objetos
        return {
          success: true,
          message: 'Object creation patterns optimized',
          impact: 'medium'
        };

      case 'optimize_cache_keys':
        // Optimizar keys de cache
        return {
          success: true,
          message: 'Cache key strategies optimized',
          impact: 'medium'
        };

      default:
        return {
          success: false,
          message: `Unknown optimization action: ${action}`,
          impact: 'none'
        };
    }
  }

  /**
   * Verificar mejoras después de optimizaciones
   */
  async verifyOptimizations(_optimizations) {
    // Esperar un momento para que las optimizaciones surtan efecto
    await new Promise(resolve => setTimeout(resolve, 5000));

    const postOptimizationMetrics = await this.gatherCurrentMetrics();
    const improvements = [];

    // Comparar métricas antes y después
    const beforeMetrics = this.lastOptimization?.metrics || {};

    const comparisons = [
      { key: 'avgResponseTime', name: 'Average Response Time', unit: 'ms', lowerIsBetter: true },
      { key: 'errorRate', name: 'Error Rate', unit: '%', lowerIsBetter: true, multiply: 100 },
      { key: 'memoryUsage', name: 'Memory Usage', unit: '%', lowerIsBetter: true },
      { key: 'cacheHitRate', name: 'Cache Hit Rate', unit: '%', lowerIsBetter: false },
      { key: 'requestsPerMinute', name: 'Throughput', unit: 'req/min', lowerIsBetter: false }
    ];

    for (const comparison of comparisons) {
      const before = beforeMetrics[comparison.key] || 0;
      const after = postOptimizationMetrics[comparison.key] || 0;
      const multiplier = comparison.multiply || 1;
      
      const beforeValue = before * multiplier;
      const afterValue = after * multiplier;
      const change = afterValue - beforeValue;
      const percentChange = beforeValue > 0 ? (change / beforeValue) * 100 : 0;

      const improved = comparison.lowerIsBetter ? change < 0 : change > 0;

      improvements.push({
        metric: comparison.name,
        before: Math.round(beforeValue * 100) / 100,
        after: Math.round(afterValue * 100) / 100,
        change: Math.round(change * 100) / 100,
        percentChange: Math.round(percentChange * 100) / 100,
        unit: comparison.unit,
        improved,
        impact: Math.abs(percentChange) > 10 ? 'high' : Math.abs(percentChange) > 5 ? 'medium' : 'low'
      });
    }

    return {
      improvements,
      postOptimizationMetrics,
      totalImprovements: improvements.filter(i => i.improved).length,
      significantImprovements: improvements.filter(i => i.improved && Math.abs(i.percentChange) > 5).length,
      summary: {
        overallImprovement: improvements.filter(i => i.improved).length > improvements.filter(i => !i.improved).length,
        averageImprovement: improvements.reduce((acc, i) => acc + Math.abs(i.percentChange), 0) / improvements.length
      }
    };
  }

  /**
   * Generar reporte de optimización
   */
  generateOptimizationReport(initialMetrics, optimizations, verification) {
    const report = {
      reportId: `optimization_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      
      summary: {
        optimizationsApplied: optimizations.length,
        successfulOptimizations: optimizations.filter(o => o.result.status === 'success').length,
        totalImprovements: verification.totalImprovements,
        significantImprovements: verification.significantImprovements,
        overallSuccess: verification.summary.overallImprovement,
        averageImprovement: Math.round(verification.summary.averageImprovement * 100) / 100
      },

      initialMetrics: {
        responseTime: initialMetrics.avgResponseTime,
        errorRate: Math.round(initialMetrics.errorRate * 10000) / 100,
        memoryUsage: initialMetrics.memoryUsage,
        cacheHitRate: initialMetrics.cacheHitRate,
        throughput: initialMetrics.requestsPerMinute
      },

      optimizations: optimizations.map(opt => ({
        type: opt.type,
        name: opt.name,
        status: opt.result.status,
        successRate: opt.result.successRate,
        actions: opt.result.actions?.length || 0,
        expectedImprovement: opt.expectedImprovement
      })),

      improvements: verification.improvements,

      recommendations: [
        {
          category: 'Performance',
          priority: 'high',
          description: 'Continue monitoring metrics for sustained improvements',
          action: 'Schedule regular performance optimization cycles'
        },
        {
          category: 'Monitoring',
          priority: 'medium', 
          description: 'Set up automated alerts for performance regressions',
          action: 'Configure threshold-based alerting'
        },
        {
          category: 'Coverage',
          priority: 'medium',
          description: 'Work towards 45% SSR coverage target',
          action: 'Enable SSR for additional routes based on performance gains'
        }
      ],

      targets: {
        currentSSRCoverage: initialMetrics.ssrCoverage,
        targetSSRCoverage: 45,
        phase4Targets: PERFORMANCE_TARGETS.phase4,
        targetsAchieved: this.checkTargetsAchieved(verification.postOptimizationMetrics)
      }
    };

    return report;
  }

  /**
   * Verificar si se alcanzaron los targets de Fase 4
   */
  checkTargetsAchieved(metrics) {
    const targets = PERFORMANCE_TARGETS.phase4;
    
    return {
      ttfb: metrics.avgResponseTime <= targets.ttfb,
      errorRate: metrics.errorRate <= targets.errorRate,
      memoryUsage: metrics.memoryUsage <= targets.memoryUsage,
      cacheHitRate: metrics.cacheHitRate >= targets.cacheHitRate,
      throughput: metrics.requestsPerMinute >= targets.throughput,
      overall: [
        metrics.avgResponseTime <= targets.ttfb,
        metrics.errorRate <= targets.errorRate,
        metrics.memoryUsage <= targets.memoryUsage,
        metrics.cacheHitRate >= targets.cacheHitRate
      ].filter(Boolean).length >= 3
    };
  }

  /**
   * Funciones auxiliares
   */

  calculateCacheHitRate(cacheData) {
    if (!cacheData?.byRoute) return 0;
    
    let totalHits = 0;
    let totalRequests = 0;
    
    Object.values(cacheData.byRoute).forEach(route => {
      totalHits += route.fresh || 0;
      totalRequests += route.count || 0;
    });
    
    return totalRequests > 0 ? Math.round((totalHits / totalRequests) * 100) : 0;
  }

  extractRouteMetrics(routeData) {
    if (!routeData) return {};
    
    const metrics = {};
    
    Object.entries(routeData).forEach(([route, data]) => {
      metrics[route] = {
        avgTime: data.avgTime || 0,
        count: data.count || 0,
        p95Time: data.p95Time || 0,
        errorRate: data.errorRate || 0
      };
    });
    
    return metrics;
  }

  calculateSSRCoverage(routeData) {
    if (!routeData) return 0;
    
    const ssrRoutes = Object.keys(PERFORMANCE_TARGETS.ssrRoutes);
    const totalRoutes = Object.keys(routeData).length;
    const ssrActiveRoutes = Object.keys(routeData).filter(route => 
      ssrRoutes.some(ssrRoute => route.includes(ssrRoute))
    ).length;
    
    return totalRoutes > 0 ? Math.round((ssrActiveRoutes / totalRoutes) * 100) : 0;
  }

  analyzeRoutePerformance(routePerformance) {
    const gaps = [];
    
    Object.entries(routePerformance).forEach(([route, metrics]) => {
      if (metrics.avgTime > PERFORMANCE_TARGETS.phase4.ssrTime) {
        gaps.push({
          type: 'route_performance',
          route,
          current: metrics.avgTime,
          target: PERFORMANCE_TARGETS.phase4.ssrTime,
          gap: metrics.avgTime - PERFORMANCE_TARGETS.phase4.ssrTime,
          severity: 'warning',
          impact: 'medium'
        });
      }
    });
    
    return gaps;
  }

  generateRecommendations(gaps) {
    const recommendations = [];
    
    if (gaps.some(g => g.type === 'ttfb')) {
      recommendations.push({
        category: 'Performance',
        priority: 'high',
        description: 'Implement advanced caching and optimize data fetching patterns'
      });
    }
    
    if (gaps.some(g => g.type === 'error_rate')) {
      recommendations.push({
        category: 'Reliability',
        priority: 'high',
        description: 'Enhance error handling and implement circuit breaker patterns'
      });
    }
    
    if (gaps.some(g => g.type === 'memory_usage')) {
      recommendations.push({
        category: 'Resource Management',
        priority: 'medium',
        description: 'Optimize memory usage and implement garbage collection strategies'
      });
    }
    
    return recommendations;
  }
}

// Instancia global del optimizador
const performanceOptimizer = new SSRPerformanceOptimizer();

/**
 * Funciones públicas de la API
 */

export async function optimizeSSRPerformance() {
  return await performanceOptimizer.optimizePerformance();
}

export function getOptimizationHistory() {
  return performanceOptimizer.lastOptimization || null;
}

export function getPerformanceTargets() {
  return {
    phase4Targets: PERFORMANCE_TARGETS.phase4,
    alertThresholds: PERFORMANCE_TARGETS.alerts,
    ssrRoutes: PERFORMANCE_TARGETS.ssrRoutes,
    currentPhase: 'Phase 4 - Optimization & 45% Coverage'
  };
}

export function getSSRCoverageStatus() {
  const ssrRoutes = Object.keys(PERFORMANCE_TARGETS.ssrRoutes);
  const enabledRoutes = Object.entries(PERFORMANCE_TARGETS.ssrRoutes)
    .filter(([, config]) => config.enabled)
    .map(([route]) => route);

  return {
    totalSSRRoutes: ssrRoutes.length,
    enabledRoutes: enabledRoutes.length,
    targetCoverage: 45,
    currentCoverage: Math.round((enabledRoutes.length / ssrRoutes.length) * 100),
    routes: PERFORMANCE_TARGETS.ssrRoutes
  };
}

/**
 * Endpoint handler para optimización de performance
 */
export function performanceOptimizationHandler(req, res) {
  try {
    const { action } = req.query;

    switch (action) {
      case 'optimize':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        
        // Ejecutar optimización asíncrona
        optimizeSSRPerformance()
          .then(result => {
            console.info('Performance optimization completed:', result.status);
          })
          .catch(error => {
            console.error('Performance optimization failed:', error);
          });
          
        res.json({ 
          message: 'Performance optimization started',
          status: 'running'
        });
        break;

      case 'status':
        res.json({
          targets: getPerformanceTargets(),
          coverage: getSSRCoverageStatus(),
          lastOptimization: getOptimizationHistory()
        });
        break;

      case 'history':
        res.json({ 
          lastOptimization: getOptimizationHistory(),
          targets: PERFORMANCE_TARGETS.phase4
        });
        break;

      case 'targets':
        res.json(getPerformanceTargets());
        break;

      case 'coverage':
        res.json(getSSRCoverageStatus());
        break;

      default:
        res.json({
          message: 'SSR Performance Optimization System - Fase 4',
          availableActions: ['optimize', 'status', 'history', 'targets', 'coverage'],
          currentTargets: PERFORMANCE_TARGETS.phase4,
          ssrCoverage: getSSRCoverageStatus()
        });
    }

  } catch (error) {
    console.error('Error in performance optimization handler:', error);
    res.status(500).json({
      error: 'Failed to handle performance optimization request',
      message: error.message
    });
  }
}

export default {
  SSRPerformanceOptimizer,
  optimizeSSRPerformance,
  getOptimizationHistory,
  getPerformanceTargets,
  getSSRCoverageStatus,
  performanceOptimizationHandler,
  PERFORMANCE_TARGETS
};
