/**
 * ================================================================================================================================
 * ARCHIVO: ssr-webhook-config.js  
 * MÓDULO: n8n integration
 * DESCRIPCIÓN: Configuración para integrar alertas SSR con webhook de n8n
 *
 * FUNCIONALIDAD:
 * - Define estructura de datos para alertas SSR → n8n
 * - Configura tipos de alertas: ERROR_SPIKE, SLOW_RESPONSE, HIGH_MEMORY
 * - Establece niveles de severidad y umbrales
 * - Proporciona función para envío de alertas a n8n
 * ================================================================================================================================
 */

// Configuración de webhook n8n
const N8N_CONFIG = {
  webhookUrl: 'https://n8n.forestechdecolombia.com.co/webhook/ssr-alerts',
  timeout: 5000,
  retryAttempts: 3,
  retryDelay: 1000
};

// Tipos de alertas SSR
const ALERT_TYPES = {
  ERROR_SPIKE: {
    name: 'ERROR_SPIKE',
    description: 'Incremento anormal en la tasa de errores',
    thresholds: {
      high: 10,     // errores por minuto
      critical: 25  // errores por minuto
    }
  },
  SLOW_RESPONSE: {
    name: 'SLOW_RESPONSE',
    description: 'Tiempo de respuesta degradado',
    thresholds: {
      high: 2000,    // ms
      critical: 5000 // ms
    }
  },
  HIGH_MEMORY: {
    name: 'HIGH_MEMORY',
    description: 'Uso excesivo de memoria',
    thresholds: {
      high: 80,   // % memoria
      critical: 95 // % memoria
    }
  }
};

// Función para determinar severidad
const getSeverity = (alertType, value) => {
  const thresholds = ALERT_TYPES[alertType]?.thresholds;
  if (!thresholds) return 'medium';
  
  if (value >= thresholds.critical) return 'critical';
  if (value >= thresholds.high) return 'high';
  return 'medium';
};

// Función para enviar alerta a n8n
const sendAlertToN8N = async (alertData) => {
  const payload = {
    alert_id: `ssr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    alert_type: alertData.type,
    severity: getSeverity(alertData.type, alertData.value),
    timestamp: new Date().toISOString(),
    description: ALERT_TYPES[alertData.type]?.description || 'Alerta SSR',
    metrics: {
      response_time: alertData.response_time,
      memory_usage: alertData.memory_usage,
      cpu_usage: alertData.cpu_usage,
      error_rate: alertData.error_rate,
      current_value: alertData.value
    },
    metadata: {
      source: 'forestech-combustibles-ssr',
      environment: process.env.NODE_ENV || 'production',
      server_info: {
        hostname: require('os').hostname(),
        platform: require('os').platform(),
        memory_total: Math.round(require('os').totalmem() / 1024 / 1024) + 'MB'
      }
    }
  };

  try {
    const response = await fetch(N8N_CONFIG.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Forestech-SSR-Monitor/1.0'
      },
      body: JSON.stringify(payload),
      timeout: N8N_CONFIG.timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log('✅ Alerta SSR enviada a n8n exitosamente:', {
      alert_id: payload.alert_id,
      type: payload.alert_type,
      severity: payload.severity,
      n8n_response: result
    });

    return { success: true, data: result };

  } catch (error) {
    console.error('❌ Error enviando alerta SSR a n8n:', error.message);
    
    // Log para debugging
    console.error('Payload enviado:', JSON.stringify(payload, null, 2));
    
    return { success: false, error: error.message };
  }
};

// Función de ejemplo para integrar en tu sistema SSR existente
const integrateWithSSRMonitoring = () => {
  // Ejemplo de uso en tu sistema de monitoreo existente:
  
  // Para ERROR_SPIKE
  const checkErrorSpike = (errorRate) => {
    if (errorRate >= ALERT_TYPES.ERROR_SPIKE.thresholds.high) {
      sendAlertToN8N({
        type: 'ERROR_SPIKE',
        value: errorRate,
        error_rate: errorRate,
        response_time: getCurrentResponseTime(),
        memory_usage: getCurrentMemoryUsage(),
        cpu_usage: getCurrentCpuUsage()
      });
    }
  };

  // Para SLOW_RESPONSE
  const checkSlowResponse = (responseTime) => {
    if (responseTime >= ALERT_TYPES.SLOW_RESPONSE.thresholds.high) {
      sendAlertToN8N({
        type: 'SLOW_RESPONSE',
        value: responseTime,
        response_time: responseTime,
        memory_usage: getCurrentMemoryUsage(),
        cpu_usage: getCurrentCpuUsage(),
        error_rate: getCurrentErrorRate()
      });
    }
  };

  // Para HIGH_MEMORY
  const checkHighMemory = (memoryUsage) => {
    if (memoryUsage >= ALERT_TYPES.HIGH_MEMORY.thresholds.high) {
      sendAlertToN8N({
        type: 'HIGH_MEMORY',
        value: memoryUsage,
        memory_usage: memoryUsage,
        response_time: getCurrentResponseTime(),
        cpu_usage: getCurrentCpuUsage(),
        error_rate: getCurrentErrorRate()
      });
    }
  };

  return {
    checkErrorSpike,
    checkSlowResponse,
    checkHighMemory
  };
};

// Funciones helper (implementar según tu sistema)
const getCurrentResponseTime = () => {
  // Implementar según tu sistema de métricas
  return Math.floor(Math.random() * 3000) + 500; // Ejemplo
};

const getCurrentMemoryUsage = () => {
  // Implementar según tu sistema de métricas
  const used = process.memoryUsage();
  return Math.round(used.heapUsed / 1024 / 1024); // MB
};

const getCurrentCpuUsage = () => {
  // Implementar según tu sistema de métricas
  return Math.floor(Math.random() * 100); // Ejemplo
};

const getCurrentErrorRate = () => {
  // Implementar según tu sistema de métricas
  return Math.floor(Math.random() * 20); // Ejemplo
};

// Exportar configuraciones y funciones
module.exports = {
  N8N_CONFIG,
  ALERT_TYPES,
  getSeverity,
  sendAlertToN8N,
  integrateWithSSRMonitoring
};

// Para uso en browser/cliente (si es necesario)
if (typeof window !== 'undefined') {
  window.ForestechSSRAlerts = {
    sendAlertToN8N,
    ALERT_TYPES,
    getSeverity
  };
}

/**
 * INSTRUCCIONES DE INTEGRACIÓN:
 * 
 * 1. Instalar en tu sistema SSR existente:
 *    ```javascript
 *    const { sendAlertToN8N, integrateWithSSRMonitoring } = require('./ssr-webhook-config');
 *    const { checkErrorSpike, checkSlowResponse, checkHighMemory } = integrateWithSSRMonitoring();
 *    ```
 * 
 * 2. En tu endpoint /ssr-alerts, agregar:
 *    ```javascript
 *    // Cuando detectes una condición de alerta
 *    if (errorRate > threshold) {
 *      await sendAlertToN8N({
 *        type: 'ERROR_SPIKE',
 *        value: errorRate,
 *        // ... otros datos de métricas
 *      });
 *    }
 *    ```
 * 
 * 3. El webhook de n8n recibirá la alerta y activará:
 *    - Email para alertas high/critical
 *    - WhatsApp para alertas critical
 *    - Slack para todas las alertas
 * 
 * 4. Configurar credenciales en n8n:
 *    - Gmail API credentials
 *    - WhatsApp Business API token
 *    - Slack webhook URL
 */