/**
 * A/B Testing Framework para Rollout Fase 1
 * Sistema para rollout gradual del Dashboard SSR
 */

/**
 * Configuración de rollout por ruta - FASE 1
 */
const SSR_ROLLOUT_CONFIG = {
  '/combustibles/dashboard': {
    enabled: true,
    percentage: 10,        // Empezar con 10% de usuarios
    minVersion: '1.0.0',
    maxErrors: 5,          // Máx 5 errores antes de rollback automático
    description: 'Dashboard SSR Fase 1'
  },
  '/combustibles/movimientos': {
    enabled: true,
    percentage: 100,       // Fase 2 - Empezar con 100% para testing
    minVersion: '2.0.0',
    maxErrors: 5,          // Máx 5 errores antes de rollback automático
    description: 'Movements SSR Fase 2'
  },
  '/combustibles/ssr-health': {
    enabled: true,
    percentage: 100,       // Health check siempre al 100%
    minVersion: '1.0.0',
    maxErrors: 0,
    description: 'Health Check SSR'
  },
  '/combustibles/': {
    enabled: true,
    percentage: 100,       // Landing ya estable al 100%
    minVersion: '1.0.0', 
    maxErrors: 10,
    description: 'Landing Page SSR'
  }
};

/**
 * Feature flags para control granular
 */
const FEATURE_FLAGS = {
  DASHBOARD_SSR_ENABLED: process.env.DASHBOARD_SSR_ENABLED !== 'false',
  PERFORMANCE_MONITORING: process.env.PERFORMANCE_MONITORING !== 'false',
  ERROR_REPORTING: process.env.ERROR_REPORTING !== 'false',
  A_B_TESTING_ACTIVE: process.env.A_B_TESTING_ACTIVE !== 'false',
  ROLLBACK_ON_ERRORS: process.env.ROLLBACK_ON_ERRORS !== 'false'
};

/**
 * Determinar si un usuario debe recibir SSR
 * @param {string} route - Ruta solicitada
 * @param {Object} user - Usuario (puede ser null)
 * @returns {boolean} - true si debe usar SSR
 */
export function shouldUseSSR(route, user = null) {
  // Feature flag global
  if (!FEATURE_FLAGS.A_B_TESTING_ACTIVE) {
    return true; // Usar configuración default si A/B testing deshabilitado
  }
  
  // Verificar si la ruta tiene configuración
  const config = SSR_ROLLOUT_CONFIG[route];
  if (!config) {
    // Rutas no configuradas usan SSR por defecto
    return true;
  }
  
  // Verificar si está habilitado
  if (!config.enabled) {
    return false;
  }
  
  // Si es 100%, usar SSR
  if (config.percentage >= 100) {
    return true;
  }
  
  // Si es 0%, no usar SSR
  if (config.percentage <= 0) {
    return false;
  }
  
  // A/B testing basado en hash consistente del usuario
  const userId = user?.uid || 'anonymous';
  const sessionId = generateSessionId();
  const hash = simpleHash(userId + route + sessionId);
  const bucket = hash % 100;
  
  const shouldUse = bucket < config.percentage;
  
  // Log para monitoreo
  console.info('A_B_TEST:', JSON.stringify({
    route,
    userId: userId === 'anonymous' ? 'anonymous' : userId.substring(0, 8) + '...',
    bucket,
    percentage: config.percentage,
    decision: shouldUse ? 'SSR' : 'CSR',
    timestamp: new Date().toISOString()
  }));
  
  return shouldUse;
}

/**
 * Hash simple para distribución consistente
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Generar session ID para usuarios anónimos
 */
function generateSessionId() {
  // En producción esto vendría del request o cookies
  // Por ahora, usamos timestamp + random para variedad
  if (typeof globalThis.sessionId === 'undefined') {
    globalThis.sessionId = Date.now() + Math.random().toString(36);
  }
  return globalThis.sessionId;
}

/**
 * Actualizar porcentaje de rollout en tiempo real
 * @param {string} route - Ruta a actualizar
 * @param {number} percentage - Nuevo porcentaje (0-100)
 * @returns {boolean} - true si se actualizó exitosamente
 */
export function updateRolloutPercentage(route, percentage) {
  if (!SSR_ROLLOUT_CONFIG[route]) {
    console.warn(`Route ${route} not found in rollout config`);
    return false;
  }
  
  if (percentage < 0 || percentage > 100) {
    console.error(`Invalid percentage ${percentage}. Must be 0-100`);
    return false;
  }
  
  const oldPercentage = SSR_ROLLOUT_CONFIG[route].percentage;
  SSR_ROLLOUT_CONFIG[route].percentage = percentage;
  
  console.info('ROLLOUT_UPDATE:', JSON.stringify({
    route,
    oldPercentage,
    newPercentage: percentage,
    timestamp: new Date().toISOString()
  }));
  
  return true;
}

/**
 * Rollback automático si hay muchos errores
 * @param {string} route - Ruta con errores
 * @param {number} errorCount - Número de errores
 */
export function checkRollback(route, errorCount) {
  if (!FEATURE_FLAGS.ROLLBACK_ON_ERRORS) {
    return false;
  }
  
  const config = SSR_ROLLOUT_CONFIG[route];
  if (!config || errorCount < config.maxErrors) {
    return false;
  }
  
  // Rollback automático - reducir a 0%
  const originalPercentage = config.percentage;
  config.percentage = 0;
  
  console.error('AUTO_ROLLBACK:', JSON.stringify({
    route,
    errorCount,
    maxErrors: config.maxErrors,
    originalPercentage,
    newPercentage: 0,
    timestamp: new Date().toISOString()
  }));
  
  // En producción, aquí enviarías alertas
  sendRollbackAlert(route, errorCount, originalPercentage);
  
  return true;
}

/**
 * Enviar alerta de rollback
 */
async function sendRollbackAlert(route, errorCount, originalPercentage) {
  const alertData = {
    type: 'AUTO_ROLLBACK',
    severity: 'critical',
    route,
    errorCount,
    originalPercentage,
    timestamp: new Date().toISOString()
  };
  
  console.error('ROLLBACK_ALERT:', JSON.stringify(alertData));
  
  // TODO: Implementar webhook a Slack/PagerDuty
  if (process.env.SLACK_WEBHOOK_URL) {
    try {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 AUTO ROLLBACK: ${route} rolled back due to ${errorCount} errors (was ${originalPercentage}%)`
        })
      });
    } catch (error) {
      console.error('Failed to send rollback alert:', error.message);
    }
  }
}

/**
 * Obtener estadísticas del A/B testing
 */
export function getABTestingStats() {
  return {
    config: SSR_ROLLOUT_CONFIG,
    featureFlags: FEATURE_FLAGS,
    timestamp: new Date().toISOString(),
    version: '1.0.0-fase1'
  };
}

/**
 * Endpoint para controlar A/B testing (solo desarrollo)
 */
export function abTestingHandler(req, res) {
  if (process.env.NODE_ENV === 'production' && !req.user?.admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  const { action, route, percentage } = req.query;
  
  switch (action) {
    case 'status':
      res.json(getABTestingStats());
      break;
      
    case 'update':
      if (!route || percentage === undefined) {
        return res.status(400).json({ error: 'Missing route or percentage' });
      }
      const success = updateRolloutPercentage(route, parseInt(percentage));
      res.json({ success, route, percentage: parseInt(percentage) });
      break;
      
    case 'rollback':
      if (!route) {
        return res.status(400).json({ error: 'Missing route' });
      }
      updateRolloutPercentage(route, 0);
      res.json({ success: true, route, percentage: 0, action: 'rollback' });
      break;
      
    default:
      res.status(400).json({ error: 'Invalid action. Use: status, update, rollback' });
  }
}