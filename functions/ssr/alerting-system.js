/**
 * Sistema de Alertas SSR - Fase 4
 * Sistema automático de alertas y notificaciones para SSR
 */

import { getErrorStatistics } from './error-handler-advanced.js';
import { getAdvancedMetricsDashboard } from './monitoring-advanced.js';

// Configuración de alertas
const ALERTS_CONFIG = {
  // Tipos de alertas y sus configuraciones
  alertTypes: {
    ERROR_SPIKE: {
      description: 'Spike en errores detectado',
      threshold: 5, // errores por minuto
      windowMs: 5 * 60 * 1000, // 5 minutos
      severity: 'high',
      cooldown: 15 * 60 * 1000 // 15 minutos entre alertas
    },
    
    SLOW_RESPONSE: {
      description: 'Respuestas lentas detectadas',
      threshold: 1500, // ms promedio
      windowMs: 10 * 60 * 1000, // 10 minutos
      severity: 'medium',
      cooldown: 20 * 60 * 1000
    },
    
    HIGH_MEMORY: {
      description: 'Uso alto de memoria',
      threshold: 85, // % de memoria
      windowMs: 2 * 60 * 1000, // 2 minutos
      severity: 'high',
      cooldown: 10 * 60 * 1000
    },
    
    CACHE_DEGRADATION: {
      description: 'Degradación del cache',
      threshold: 60, // % hit rate
      windowMs: 15 * 60 * 1000, // 15 minutos
      severity: 'medium',
      cooldown: 30 * 60 * 1000
    },
    
    ROUTE_FAILURE: {
      description: 'Fallos en ruta específica',
      threshold: 3, // errores consecutivos
      windowMs: 5 * 60 * 1000, // 5 minutos
      severity: 'critical',
      cooldown: 5 * 60 * 1000
    },
    
    SYSTEM_OVERLOAD: {
      description: 'Sobrecarga del sistema',
      threshold: 95, // % CPU estimado
      windowMs: 3 * 60 * 1000, // 3 minutos
      severity: 'critical',
      cooldown: 10 * 60 * 1000
    }
  },
  
  // Canales de notificación
  channels: {
    console: { enabled: true },
    webhook: { 
      enabled: !!process.env.SSR_ALERTS_WEBHOOK_URL,
      url: process.env.SSR_ALERTS_WEBHOOK_URL
    },
    email: {
      enabled: !!process.env.SSR_ALERTS_EMAIL,
      recipients: (process.env.SSR_ALERTS_EMAIL || '').split(',')
    },
    slack: {
      enabled: !!process.env.SSR_SLACK_WEBHOOK_URL,
      url: process.env.SSR_SLACK_WEBHOOK_URL
    }
  },
  
  // Configuración de escalamiento
  escalation: {
    retryAttempts: 3,
    retryDelay: 5 * 60 * 1000, // 5 minutos
    escalationDelay: 30 * 60 * 1000, // 30 minutos para escalación
    criticalEscalationDelay: 10 * 60 * 1000 // 10 minutos para críticos
  }
};

// Storage para alertas activas y historial
const activeAlerts = new Map();
const alertHistory = new Map();
const alertCooldowns = new Map();

/**
 * Sistema principal de monitoreo de alertas
 */
export class SSRAlertingSystem {
  constructor() {
    this.isRunning = false;
    this.monitoringInterval = null;
    this.checkInterval = 60 * 1000; // Verificar cada minuto
  }
  
  /**
   * Iniciar sistema de alertas
   */
  start() {
    if (this.isRunning) {
      console.warn('SSR Alerting System already running');
      return;
    }
    
    this.isRunning = true;
    this.monitoringInterval = setInterval(() => {
      this.checkAlerts().catch(error => {
        console.error('Error in alert checking:', error);
      });
    }, this.checkInterval);
    
    console.info('SSR_ALERTING_STARTED:', JSON.stringify({
      checkInterval: this.checkInterval,
      alertTypes: Object.keys(ALERTS_CONFIG.alertTypes),
      channels: Object.entries(ALERTS_CONFIG.channels)
        .filter(([, config]) => config.enabled)
        .map(([name]) => name),
      timestamp: new Date().toISOString()
    }));
  }
  
  /**
   * Detener sistema de alertas
   */
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    console.info('SSR_ALERTING_STOPPED:', {
      timestamp: new Date().toISOString()
    });
  }
  
  /**
   * Verificar todas las condiciones de alerta
   */
  async checkAlerts() {
    try {
      const currentMetrics = await this.gatherMetrics();
      
      // Verificar cada tipo de alerta
      for (const [alertType, config] of Object.entries(ALERTS_CONFIG.alertTypes)) {
        await this.checkAlertCondition(alertType, config, currentMetrics);
      }
      
      // Limpiar alertas resueltas
      this.cleanupResolvedAlerts(currentMetrics);
      
      // Limpiar cooldowns expirados
      this.cleanupExpiredCooldowns();
      
    } catch (error) {
      console.error('Error checking alerts:', error);
    }
  }
  
  /**
   * Recopilar métricas actuales
   */
  async gatherMetrics() {
    const [errorStats, performanceData] = await Promise.all([
      getErrorStatistics(5 * 60 * 1000), // Últimos 5 minutos
      getAdvancedMetricsDashboard(5 * 60 * 1000)
    ]);
    
    return {
      timestamp: Date.now(),
      errors: errorStats,
      performance: performanceData,
      
      // Métricas derivadas
      errorRate: errorStats.totalErrors / Math.max(1, performanceData.summary.totalRequests) * 100,
      avgResponseTime: performanceData.summary.averageResponseTime,
      memoryUsage: performanceData.summary.averageMemoryUsage,
      cacheHitRate: this.calculateCacheHitRate(performanceData.cache)
    };
  }
  
  /**
   * Verificar condición específica de alerta
   */
  async checkAlertCondition(alertType, config, metrics) {
    const currentValue = this.getMetricValue(alertType, metrics);
    const shouldAlert = this.evaluateAlertCondition(alertType, currentValue, config.threshold);
    
    if (shouldAlert && !this.isInCooldown(alertType)) {
      await this.triggerAlert(alertType, config, currentValue, metrics);
    }
  }
  
  /**
   * Obtener valor de métrica para tipo de alerta
   */
  getMetricValue(alertType, metrics) {
    switch (alertType) {
      case 'ERROR_SPIKE':
        return metrics.errors.totalErrors;
      case 'SLOW_RESPONSE':
        return metrics.avgResponseTime;
      case 'HIGH_MEMORY':
        return metrics.memoryUsage;
      case 'CACHE_DEGRADATION':
        return metrics.cacheHitRate;
      case 'ROUTE_FAILURE':
        return this.calculateRouteFailures(metrics);
      case 'SYSTEM_OVERLOAD':
        return this.estimateSystemLoad(metrics);
      default:
        return 0;
    }
  }
  
  /**
   * Evaluar si se debe disparar alerta
   */
  evaluateAlertCondition(alertType, currentValue, threshold) {
    // Alertas que se disparan cuando el valor es MAYOR al threshold
    const higherIsBad = ['ERROR_SPIKE', 'SLOW_RESPONSE', 'HIGH_MEMORY', 'ROUTE_FAILURE', 'SYSTEM_OVERLOAD'];
    
    // Alertas que se disparan cuando el valor es MENOR al threshold  
    const lowerIsBad = ['CACHE_DEGRADATION'];
    
    if (higherIsBad.includes(alertType)) {
      return currentValue > threshold;
    }
    
    if (lowerIsBad.includes(alertType)) {
      return currentValue < threshold;
    }
    
    return false;
  }
  
  /**
   * Disparar alerta
   */
  async triggerAlert(alertType, config, currentValue, metrics) {
    const alertId = this.generateAlertId(alertType);
    
    const alert = {
      id: alertId,
      type: alertType,
      severity: config.severity,
      description: config.description,
      currentValue,
      threshold: config.threshold,
      triggeredAt: new Date().toISOString(),
      metrics: this.extractRelevantMetrics(alertType, metrics),
      status: 'active'
    };
    
    // Almacenar alerta activa
    activeAlerts.set(alertId, alert);
    
    // Establecer cooldown
    alertCooldowns.set(alertType, Date.now() + config.cooldown);
    
    // Enviar notificaciones
    await this.sendNotifications(alert);
    
    // Registrar en historial
    this.recordAlertHistory(alert);
    
    console.error('SSR_ALERT_TRIGGERED:', JSON.stringify(alert));
  }
  
  /**
   * Enviar notificaciones por todos los canales habilitados
   */
  async sendNotifications(alert) {
    const notifications = [];
    
    // Console (siempre habilitado)
    notifications.push(this.sendConsoleNotification(alert));
    
    // Webhook
    if (ALERTS_CONFIG.channels.webhook.enabled) {
      notifications.push(this.sendWebhookNotification(alert));
    }
    
    // Slack
    if (ALERTS_CONFIG.channels.slack.enabled) {
      notifications.push(this.sendSlackNotification(alert));
    }
    
    // Email (simulado)
    if (ALERTS_CONFIG.channels.email.enabled) {
      notifications.push(this.sendEmailNotification(alert));
    }
    
    // Esperar todas las notificaciones
    const results = await Promise.allSettled(notifications);
    
    // Log resultados
    const failed = results.filter(r => r.status === 'rejected').length;
    if (failed > 0) {
      console.warn(`${failed} notification channels failed for alert ${alert.id}`);
    }
  }
  
  /**
   * Notificación por console
   */
  async sendConsoleNotification(alert) {
    const emoji = this.getSeverityEmoji(alert.severity);
    console.error(`${emoji} SSR ALERT: ${alert.description} - ${alert.currentValue} (threshold: ${alert.threshold})`);
  }
  
  /**
   * Notificación por webhook
   */
  async sendWebhookNotification(alert) {
    try {
      await fetch(ALERTS_CONFIG.channels.webhook.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ssr_alert',
          ...alert,
          source: 'forestech-ssr',
          environment: process.env.NODE_ENV || 'production'
        })
      });
    } catch (error) {
      console.error('Failed to send webhook notification:', error.message);
      throw error;
    }
  }
  
  /**
   * Notificación por Slack
   */
  async sendSlackNotification(alert) {
    const emoji = this.getSeverityEmoji(alert.severity);
    const color = this.getSeverityColor(alert.severity);
    
    const slackPayload = {
      text: `${emoji} SSR Alert: ${alert.description}`,
      attachments: [{
        color,
        fields: [
          { title: 'Tipo', value: alert.type, short: true },
          { title: 'Severidad', value: alert.severity.toUpperCase(), short: true },
          { title: 'Valor Actual', value: alert.currentValue.toString(), short: true },
          { title: 'Threshold', value: alert.threshold.toString(), short: true },
          { title: 'Hora', value: new Date(alert.triggeredAt).toLocaleString('es-CO'), short: false }
        ],
        footer: 'Forestech SSR Monitoring',
        ts: Math.floor(new Date(alert.triggeredAt).getTime() / 1000)
      }]
    };
    
    try {
      await fetch(ALERTS_CONFIG.channels.slack.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackPayload)
      });
    } catch (error) {
      console.error('Failed to send Slack notification:', error.message);
      throw error;
    }
  }
  
  /**
   * Notificación por email (simulada)
   */
  async sendEmailNotification(alert) {
    // En producción aquí iría integración con SendGrid, SES, etc.
    console.info('EMAIL_NOTIFICATION_SENT:', JSON.stringify({
      recipients: ALERTS_CONFIG.channels.email.recipients,
      subject: `SSR Alert: ${alert.description}`,
      alertId: alert.id,
      severity: alert.severity
    }));
  }
  
  /**
   * Limpiar alertas resueltas
   */
  cleanupResolvedAlerts(currentMetrics) {
    for (const [alertId, alert] of activeAlerts.entries()) {
      const config = ALERTS_CONFIG.alertTypes[alert.type];
      const currentValue = this.getMetricValue(alert.type, currentMetrics);
      const isResolved = !this.evaluateAlertCondition(alert.type, currentValue, config.threshold);
      
      if (isResolved) {
        // Marcar como resuelta
        alert.status = 'resolved';
        alert.resolvedAt = new Date().toISOString();
        alert.resolvedValue = currentValue;
        
        // Mover a historial
        this.recordAlertHistory(alert);
        
        // Remover de alertas activas
        activeAlerts.delete(alertId);
        
        console.info('SSR_ALERT_RESOLVED:', JSON.stringify({
          id: alertId,
          type: alert.type,
          resolvedValue: currentValue,
          threshold: config.threshold
        }));
      }
    }
  }
  
  /**
   * Limpiar cooldowns expirados
   */
  cleanupExpiredCooldowns() {
    const now = Date.now();
    for (const [alertType, expiryTime] of alertCooldowns.entries()) {
      if (now > expiryTime) {
        alertCooldowns.delete(alertType);
      }
    }
  }
  
  /**
   * Verificar si alerta está en cooldown
   */
  isInCooldown(alertType) {
    const expiryTime = alertCooldowns.get(alertType);
    return expiryTime && Date.now() < expiryTime;
  }
  
  /**
   * Funciones de utilidad
   */
  
  generateAlertId(alertType) {
    return `alert_${alertType}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }
  
  calculateCacheHitRate(cacheData) {
    if (!cacheData || !cacheData.byRoute) return 0;
    
    let totalHits = 0;
    let totalRequests = 0;
    
    Object.values(cacheData.byRoute).forEach(route => {
      totalHits += route.fresh || 0;
      totalRequests += route.count || 0;
    });
    
    return totalRequests > 0 ? Math.round((totalHits / totalRequests) * 100) : 0;
  }
  
  calculateRouteFailures(metrics) {
    if (!metrics.errors.byRoute) return 0;
    return Math.max(...Object.values(metrics.errors.byRoute));
  }
  
  estimateSystemLoad(metrics) {
    // Estimación simple basada en memoria y tiempo de respuesta
    const memoryLoad = metrics.memoryUsage;
    const responseLoad = Math.min(100, (metrics.avgResponseTime / 20)); // 2000ms = 100%
    return Math.round((memoryLoad + responseLoad) / 2);
  }
  
  extractRelevantMetrics(alertType, metrics) {
    const base = {
      totalRequests: metrics.performance.summary.totalRequests,
      totalErrors: metrics.errors.totalErrors,
      timestamp: metrics.timestamp
    };
    
    switch (alertType) {
      case 'ERROR_SPIKE':
        return { ...base, errorsByCategory: metrics.errors.byCategory };
      case 'SLOW_RESPONSE':
        return { ...base, routePerformance: metrics.performance.performance.byRoute };
      case 'HIGH_MEMORY':
        return { ...base, memoryUsage: metrics.memoryUsage };
      case 'CACHE_DEGRADATION':
        return { ...base, cacheStats: metrics.performance.cache };
      default:
        return base;
    }
  }
  
  getSeverityEmoji(severity) {
    const emojis = {
      critical: '🚨',
      high: '⚠️',
      medium: '⚡',
      low: 'ℹ️'
    };
    return emojis[severity] || '📢';
  }
  
  getSeverityColor(severity) {
    const colors = {
      critical: '#dc2626',
      high: '#f59e0b',
      medium: '#3b82f6',
      low: '#10b981'
    };
    return colors[severity] || '#6b7280';
  }
  
  recordAlertHistory(alert) {
    alertHistory.set(alert.id, { ...alert });
    
    // Mantener solo las últimas 1000 alertas
    if (alertHistory.size > 1000) {
      const oldestKey = alertHistory.keys().next().value;
      alertHistory.delete(oldestKey);
    }
  }
}

// Instancia global del sistema de alertas
const alertingSystem = new SSRAlertingSystem();

/**
 * Funciones de control público
 */

export function startAlertingSystem() {
  alertingSystem.start();
}

export function stopAlertingSystem() {
  alertingSystem.stop();
}

export function getActiveAlerts() {
  return Array.from(activeAlerts.values());
}

export function getAlertHistory(limit = 50) {
  return Array.from(alertHistory.values())
    .sort((a, b) => new Date(b.triggeredAt) - new Date(a.triggeredAt))
    .slice(0, limit);
}

export function getAlertingSystemStatus() {
  return {
    isRunning: alertingSystem.isRunning,
    activeAlerts: activeAlerts.size,
    totalHistoryAlerts: alertHistory.size,
    cooldowns: Array.from(alertCooldowns.entries()).map(([type, expiry]) => ({
      type,
      expiresAt: new Date(expiry).toISOString(),
      remaining: Math.max(0, expiry - Date.now())
    })),
    channels: Object.entries(ALERTS_CONFIG.channels)
      .filter(([, config]) => config.enabled)
      .map(([name]) => name),
    lastCheckAt: new Date().toISOString()
  };
}

/**
 * Endpoint para gestión de alertas
 */
export function alertsHandler(req, res) {
  try {
    const { action } = req.query;
    
    switch (action) {
      case 'status':
        res.json(getAlertingSystemStatus());
        break;
        
      case 'active':
        res.json({ activeAlerts: getActiveAlerts() });
        break;
        
      case 'history': {
        const limit = parseInt(req.query.limit, 10) || 50;
        res.json({ history: getAlertHistory(limit) });
        break;
      }
        
      case 'start':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        startAlertingSystem();
        res.json({ message: 'Alerting system started', status: getAlertingSystemStatus() });
        break;
        
      case 'stop':
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method not allowed' });
        }
        stopAlertingSystem();
        res.json({ message: 'Alerting system stopped', status: getAlertingSystemStatus() });
        break;
        
      default:
        res.json({
          alertingSystem: getAlertingSystemStatus(),
          availableActions: ['status', 'active', 'history', 'start', 'stop']
        });
    }
    
  } catch (error) {
    console.error('Error in alerts handler:', error);
    res.status(500).json({ 
      error: 'Failed to handle alerts request',
      message: error.message 
    });
  }
}

/**
 * Disparar alerta manual (para testing)
 */
export async function triggerTestAlert(alertType = 'SLOW_RESPONSE') {
  if (!ALERTS_CONFIG.alertTypes[alertType]) {
    throw new Error(`Unknown alert type: ${alertType}`);
  }
  
  const config = ALERTS_CONFIG.alertTypes[alertType];
  const testValue = config.threshold * 1.5; // 50% por encima del threshold
  
  await alertingSystem.triggerAlert(alertType, config, testValue, {
    timestamp: Date.now(),
    errors: { totalErrors: 0, byCategory: {}, byRoute: {} },
    performance: { summary: { totalRequests: 100 } },
    avgResponseTime: testValue,
    memoryUsage: 50,
    cacheHitRate: 80
  });
  
  return { message: `Test alert ${alertType} triggered`, value: testValue, threshold: config.threshold };
}

export default {
  SSRAlertingSystem,
  startAlertingSystem,
  stopAlertingSystem,
  getActiveAlerts,
  getAlertHistory,
  getAlertingSystemStatus,
  alertsHandler,
  triggerTestAlert
};
