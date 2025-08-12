/**
 * Advanced A/B Testing Framework - Phase 4
 * Sistema avanzado para rollout gradual y optimización SSR
 * Extiende el framework de Phase 1 con funcionalidades avanzadas
 */

import { shouldUseSSR as phase1ShouldUseSSR, updateRolloutPercentage } from './ab-testing-phase1.js';

/**
 * Configuración avanzada de rollout por ruta - FASE 4
 * Incrementa coverage total a 45%
 */
const PHASE4_SSR_ROLLOUT_CONFIG = {
  '/combustibles/dashboard': {
    enabled: true,
    percentage: 80,        // Incrementar de 10% a 80% (optimizado)
    minVersion: '4.0.0',
    maxErrors: 3,          // Más estricto tras optimizaciones
    description: 'Dashboard SSR Phase 4 - Optimized',
    metrics: {
      targetTTFB: 600,     // Objetivo más agresivo
      targetFCP: 900,
      targetLCP: 1400
    }
  },
  '/combustibles/movimientos': {
    enabled: true,
    percentage: 100,       // Mantener 100% tras validación exitosa
    minVersion: '4.0.0',
    maxErrors: 2,
    description: 'Movements SSR Phase 4 - Stable',
    metrics: {
      targetTTFB: 500,
      targetFCP: 800,
      targetLCP: 1200
    }
  },
  '/combustibles/vehiculos': {
    enabled: true,
    percentage: 60,        // Incrementar de 100% test a 60% estable
    minVersion: '4.0.0',
    maxErrors: 3,
    description: 'Vehicles SSR Phase 4 - Scaling',
    metrics: {
      targetTTFB: 400,     // Vehículos cachean más, deben ser más rápidos
      targetFCP: 600,
      targetLCP: 1000
    }
  },
  '/combustibles/inventario': {
    enabled: true,
    percentage: 40,        // Incrementar gradualmente
    minVersion: '4.0.0',
    maxErrors: 3,
    description: 'Inventory SSR Phase 4 - Initial Rollout',
    metrics: {
      targetTTFB: 500,
      targetFCP: 700,
      targetLCP: 1100
    }
  },
  '/combustibles/reportes': {
    enabled: true,
    percentage: 25,        // NUEVO - Primera ruta Phase 4
    minVersion: '4.0.0',
    maxErrors: 5,
    description: 'Reports SSR Phase 4 - New Feature',
    metrics: {
      targetTTFB: 800,     // Reportes más complejos, targets más flexibles
      targetFCP: 1200,
      targetLCP: 2000
    }
  },
  '/combustibles/ssr-health': {
    enabled: true,
    percentage: 100,       // Health check siempre al 100%
    minVersion: '4.0.0',
    maxErrors: 0,
    description: 'Health Check SSR'
  },
  '/combustibles/': {
    enabled: true,
    percentage: 100,       // Landing ya estable al 100%
    minVersion: '4.0.0', 
    maxErrors: 10,
    description: 'Landing Page SSR'
  }
};

/**
 * Feature flags avanzados para Phase 4
 */
const PHASE4_FEATURE_FLAGS = {
  ADVANCED_CACHING: process.env.ADVANCED_CACHING !== 'false',
  PERFORMANCE_OPTIMIZATION: process.env.PERFORMANCE_OPTIMIZATION !== 'false',
  INTELLIGENT_ROLLBACK: process.env.INTELLIGENT_ROLLBACK !== 'false',
  PREDICTIVE_SCALING: process.env.PREDICTIVE_SCALING !== 'false',
  ERROR_CATEGORIZATION: process.env.ERROR_CATEGORIZATION !== 'false',
  SMART_FALLBACKS: process.env.SMART_FALLBACKS !== 'false',
  REAL_TIME_METRICS: process.env.REAL_TIME_METRICS !== 'false'
};

/**
 * Configuración de segmentación de usuarios
 */
const USER_SEGMENTS = {
  POWER_USERS: {
    description: 'Usuarios con alta actividad',
    criteria: (user) => user?.totalSessions > 50,
    ssrBoost: 20 // +20% probabilidad de SSR
  },
  NEW_USERS: {
    description: 'Usuarios nuevos (< 7 días)',
    criteria: (user) => {
      const accountAge = Date.now() - new Date(user?.createdAt || 0).getTime();
      return accountAge < 7 * 24 * 60 * 60 * 1000; // 7 días
    },
    ssrBoost: 10 // +10% para mejor primera impresión
  },
  MOBILE_USERS: {
    description: 'Usuarios móviles',
    criteria: (user, req) => {
      const userAgent = req?.get('User-Agent') || '';
      return /Mobile|Android|iPhone|iPad/.test(userAgent);
    },
    ssrBoost: 15 // +15% para mejor performance mobile
  },
  SLOW_CONNECTION: {
    description: 'Conexiones lentas detectadas',
    criteria: (user, req) => {
      // En futuro: usar Connection API, Network Information API
      return req?.get('Save-Data') === 'on';
    },
    ssrBoost: 25 // +25% para usuarios con conexiones lentas
  }
};

/**
 * Determinar si un usuario debe recibir SSR - Versión Phase 4
 * @param {string} route - Ruta solicitada
 * @param {Object} user - Usuario (puede ser null)
 * @param {Object} req - Request object para análisis avanzado
 * @returns {Object} - Decisión detallada sobre SSR
 */
export function shouldUseSSRAdvanced(route, user = null, req = null) {
  const config = PHASE4_SSR_ROLLOUT_CONFIG[route];
  
  // Fallback a Phase 1 si no hay config Phase 4
  if (!config) {
    return {
      useSSR: phase1ShouldUseSSR(route, user),
      reason: 'fallback_phase1',
      confidence: 0.8
    };
  }
  
  // Verificar si está habilitado
  if (!config.enabled) {
    return {
      useSSR: false,
      reason: 'disabled',
      confidence: 1.0
    };
  }
  
  // Calcular porcentaje base
  let effectivePercentage = config.percentage;
  let boostReasons = [];
  
  // Aplicar segmentación de usuarios
  if (PHASE4_FEATURE_FLAGS.PREDICTIVE_SCALING) {
    Object.entries(USER_SEGMENTS).forEach(([segmentName, segment]) => {
      if (segment.criteria(user, req)) {
        effectivePercentage += segment.ssrBoost;
        boostReasons.push(`${segmentName.toLowerCase()}_boost`);
      }
    });
    
    // Cap al 100%
    effectivePercentage = Math.min(effectivePercentage, 100);
  }
  
  // Si es 100%, usar SSR
  if (effectivePercentage >= 100) {
    return {
      useSSR: true,
      reason: 'full_rollout',
      confidence: 1.0,
      boostReasons,
      effectivePercentage
    };
  }
  
  // Si es 0%, no usar SSR
  if (effectivePercentage <= 0) {
    return {
      useSSR: false,
      reason: 'zero_rollout',
      confidence: 1.0,
      effectivePercentage
    };
  }
  
  // A/B testing basado en hash consistente del usuario
  const userId = user?.uid || 'anonymous';
  const sessionId = generateAdvancedSessionId(req);
  const hash = advancedHash(userId + route + sessionId);
  const bucket = hash % 100;
  
  const shouldUse = bucket < effectivePercentage;
  
  // Calcular confidence basado en estabilidad de métricas
  const confidence = calculateDecisionConfidence(route, shouldUse);
  
  const decision = {
    useSSR: shouldUse,
    reason: shouldUse ? 'ab_test_selected' : 'ab_test_not_selected',
    confidence,
    bucket,
    effectivePercentage,
    basePercentage: config.percentage,
    boostReasons,
    segments: getUserSegments(user, req)
  };
  
  // Log avanzado para analytics
  logAdvancedDecision(route, decision, user, req);
  
  return decision;
}

/**
 * Hash más robusto para distribución uniforme
 */
function advancedHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return Math.abs(hash);
}

/**
 * Generar session ID avanzado considerando múltiples factores
 */
function generateAdvancedSessionId(req) {
  if (typeof globalThis.advancedSessionId === 'undefined') {
    const factors = [
      Date.now(),
      Math.random().toString(36),
      req?.ip || 'unknown',
      req?.get('User-Agent')?.substring(0, 50) || 'unknown'
    ];
    globalThis.advancedSessionId = advancedHash(factors.join('|')).toString(36);
  }
  return globalThis.advancedSessionId;
}

/**
 * Obtener segmentos de usuario activos
 */
function getUserSegments(user, req) {
  const activeSegments = [];
  
  Object.entries(USER_SEGMENTS).forEach(([segmentName, segment]) => {
    if (segment.criteria(user, req)) {
      activeSegments.push({
        name: segmentName,
        description: segment.description,
        boost: segment.ssrBoost
      });
    }
  });
  
  return activeSegments;
}

/**
 * Calcular confidence de la decisión basado en métricas históricas
 */
function calculateDecisionConfidence(route, useSSR) {
  // En futuro: usar métricas reales de performance
  // Por ahora: confidence basado en madurez de la ruta
  const routeMaturity = {
    '/combustibles/': 1.0,           // Muy maduro
    '/combustibles/dashboard': 0.9,   // Maduro tras Phase 1-3
    '/combustibles/movimientos': 0.95, // Muy maduro
    '/combustibles/vehiculos': 0.8,   // Moderadamente maduro
    '/combustibles/inventario': 0.75, // Moderadamente maduro
    '/combustibles/reportes': 0.6     // Nuevo en Phase 4
  };
  
  const baseConfidence = routeMaturity[route] || 0.5;
  
  // Ajustar confidence: SSR tiene slightly menos confidence para rutas nuevas
  return useSSR ? baseConfidence * 0.95 : baseConfidence;
}

/**
 * Log avanzado para analytics y debugging
 */
function logAdvancedDecision(route, decision, user, req) {
  const logData = {
    type: 'ssr_decision_advanced',
    route,
    decision: decision.useSSR ? 'SSR' : 'CSR',
    reason: decision.reason,
    confidence: decision.confidence,
    bucket: decision.bucket,
    effectivePercentage: decision.effectivePercentage,
    basePercentage: decision.basePercentage,
    boostReasons: decision.boostReasons,
    segments: decision.segments.map(s => s.name),
    user: {
      id: user?.uid ? user.uid.substring(0, 8) + '...' : 'anonymous',
      isAuthenticated: !!user?.uid
    },
    request: {
      userAgent: req?.get('User-Agent')?.substring(0, 100),
      ip: req?.ip?.replace(/\d+$/, 'xxx'), // Anonymize last octet
      saveData: req?.get('Save-Data')
    },
    timestamp: new Date().toISOString()
  };
  
  console.info('SSR_DECISION_ADVANCED:', JSON.stringify(logData));
}

/**
 * Rollback inteligente basado en múltiples métricas
 */
export function intelligentRollback(route, metrics) {
  if (!PHASE4_FEATURE_FLAGS.INTELLIGENT_ROLLBACK) {
    return false;
  }
  
  const config = PHASE4_SSR_ROLLOUT_CONFIG[route];
  if (!config) return false;
  
  const issues = [];
  
  // Verificar métricas de performance
  if (config.metrics) {
    if (metrics.avgTTFB > config.metrics.targetTTFB * 1.5) {
      issues.push(`TTFB too slow: ${metrics.avgTTFB}ms > ${config.metrics.targetTTFB * 1.5}ms`);
    }
    
    if (metrics.errorRate > 5) {
      issues.push(`Error rate too high: ${metrics.errorRate}%`);
    }
    
    if (metrics.p95Duration > 3000) {
      issues.push(`P95 duration too high: ${metrics.p95Duration}ms`);
    }
  }
  
  // Verificar tendencias
  if (metrics.trend && metrics.trend.direction === 'worsening') {
    issues.push(`Performance trend worsening: ${metrics.trend.change}%`);
  }
  
  // Si hay issues críticos, hacer rollback
  if (issues.length >= 2) {
    const rollbackPercentage = Math.max(0, config.percentage - 20); // Reduce 20%
    
    console.error('INTELLIGENT_ROLLBACK:', JSON.stringify({
      route,
      issues,
      oldPercentage: config.percentage,
      newPercentage: rollbackPercentage,
      timestamp: new Date().toISOString()
    }));
    
    updateRolloutPercentage(route, rollbackPercentage);
    return true;
  }
  
  return false;
}

/**
 * Scaling predictivo basado en métricas en tiempo real
 */
export function predictiveScaling(route, metrics, timeOfDay) {
  if (!PHASE4_FEATURE_FLAGS.PREDICTIVE_SCALING) {
    return null;
  }
  
  const config = PHASE4_SSR_ROLLOUT_CONFIG[route];
  if (!config || config.percentage >= 100) {
    return null;
  }
  
  const suggestions = [];
  
  // Si las métricas son excelentes, sugerir incremento
  if (metrics.errorRate < 1 && 
      metrics.avgDuration < config.metrics?.targetTTFB && 
      metrics.successRate > 98) {
    
    const suggestedIncrease = Math.min(20, 100 - config.percentage);
    if (suggestedIncrease > 0) {
      suggestions.push({
        action: 'scale_up',
        currentPercentage: config.percentage,
        suggestedPercentage: config.percentage + suggestedIncrease,
        reason: 'excellent_metrics',
        confidence: 0.8
      });
    }
  }
  
  // Si es hora pico y performance es buena, ser más conservador
  const isPeakHour = timeOfDay >= 8 && timeOfDay <= 18;
  if (isPeakHour && metrics.successRate > 95 && config.percentage < 50) {
    suggestions.push({
      action: 'scale_up_conservative',
      currentPercentage: config.percentage,
      suggestedPercentage: Math.min(config.percentage + 10, 50),
      reason: 'peak_hour_conservative',
      confidence: 0.6
    });
  }
  
  return suggestions.length > 0 ? suggestions[0] : null;
}

/**
 * Obtener configuración actual Phase 4
 */
export function getPhase4Config() {
  return {
    routes: PHASE4_SSR_ROLLOUT_CONFIG,
    featureFlags: PHASE4_FEATURE_FLAGS,
    userSegments: USER_SEGMENTS,
    totalCoverage: calculateTotalCoverage(),
    version: '4.0.0',
    timestamp: new Date().toISOString()
  };
}

/**
 * Calcular coverage total esperado
 */
function calculateTotalCoverage() {
  const routes = Object.values(PHASE4_SSR_ROLLOUT_CONFIG);
  const totalPercentage = routes.reduce((sum, route) => sum + (route.percentage || 0), 0);
  const avgPercentage = totalPercentage / routes.length;
  
  return {
    averagePercentage: Math.round(avgPercentage),
    totalRoutes: routes.length,
    enabledRoutes: routes.filter(r => r.enabled).length,
    estimatedCoverage: Math.round(avgPercentage * 0.45) // Factor de adjustment realista
  };
}

/**
 * Endpoint para controlar A/B testing avanzado
 */
export function advancedABTestingHandler(req, res) {
  if (process.env.NODE_ENV === 'production' && !req.user?.admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  const { action, route, percentage, feature } = req.query;
  
  switch (action) {
    case 'status':
      res.json(getPhase4Config());
      break;
      
    case 'simulate':
      if (!route) {
        return res.status(400).json({ error: 'Missing route parameter' });
      }
      
      // Simular decisiones para diferentes tipos de usuario
      const simulations = simulateUserDecisions(route, 1000);
      res.json({ route, simulations });
      break;
      
    case 'toggle_feature':
      if (!feature) {
        return res.status(400).json({ error: 'Missing feature parameter' });
      }
      
      if (feature in PHASE4_FEATURE_FLAGS) {
        PHASE4_FEATURE_FLAGS[feature] = !PHASE4_FEATURE_FLAGS[feature];
        res.json({ 
          feature, 
          enabled: PHASE4_FEATURE_FLAGS[feature],
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(400).json({ error: 'Unknown feature flag' });
      }
      break;
      
    default:
      res.status(400).json({ 
        error: 'Invalid action', 
        availableActions: ['status', 'simulate', 'toggle_feature']
      });
  }
}

/**
 * Simular decisiones de SSR para análisis
 */
function simulateUserDecisions(route, sampleSize = 1000) {
  const results = {
    totalSamples: sampleSize,
    ssrCount: 0,
    csrCount: 0,
    bySegment: {},
    avgConfidence: 0
  };
  
  let totalConfidence = 0;
  
  for (let i = 0; i < sampleSize; i++) {
    // Simular diferentes tipos de usuarios
    const mockUser = generateMockUser();
    const mockReq = generateMockRequest();
    
    const decision = shouldUseSSRAdvanced(route, mockUser, mockReq);
    
    if (decision.useSSR) {
      results.ssrCount++;
    } else {
      results.csrCount++;
    }
    
    totalConfidence += decision.confidence;
    
    // Group by segments
    decision.segments?.forEach(segment => {
      if (!results.bySegment[segment.name]) {
        results.bySegment[segment.name] = { ssr: 0, csr: 0 };
      }
      
      if (decision.useSSR) {
        results.bySegment[segment.name].ssr++;
      } else {
        results.bySegment[segment.name].csr++;
      }
    });
  }
  
  results.ssrPercentage = Math.round((results.ssrCount / sampleSize) * 100);
  results.avgConfidence = totalConfidence / sampleSize;
  
  return results;
}

/**
 * Generar usuario mock para simulaciones
 */
function generateMockUser() {
  const userTypes = [
    null, // anonymous
    { uid: 'user1', totalSessions: 10, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // regular
    { uid: 'user2', totalSessions: 100, createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }, // power user
    { uid: 'user3', totalSessions: 1, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // new user
  ];
  
  return userTypes[Math.floor(Math.random() * userTypes.length)];
}

/**
 * Generar request mock para simulaciones
 */
function generateMockRequest() {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
    'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0',
    'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
  ];
  
  const mockReq = {
    ip: '192.168.1.' + Math.floor(Math.random() * 255),
    get: (header) => {
      if (header === 'User-Agent') {
        return userAgents[Math.floor(Math.random() * userAgents.length)];
      }
      if (header === 'Save-Data') {
        return Math.random() < 0.1 ? 'on' : undefined; // 10% have save-data
      }
      return undefined;
    }
  };
  
  return mockReq;
}

export default {
  shouldUseSSRAdvanced,
  intelligentRollback,
  predictiveScaling,
  getPhase4Config,
  advancedABTestingHandler
};