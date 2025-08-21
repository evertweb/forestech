/**
 * WebhookService - Servicio para env�o de notificaciones a n8n
 * Env�a eventos de la app combustibles a workflows de n8n para notificaciones autom�ticas
 */

const WEBHOOK_CONFIG = {
  baseUrl: 'https://n8n.forestechdecolombia.com.co/webhook',
  endpoints: {
    combustibles: 'combustibles-notifications',
  },
  timeout: 5000, // 5 segundos timeout
  retryAttempts: 2,
};

/**
 * Enviar notificaci�n de login a n8n
 * @param {Object} user - Datos del usuario que se autentic�
 * @param {string} loginMethod - M�todo de login ('email', 'google')
 * @returns {Promise<boolean>} - true si se envi� correctamente
 */
export const sendLoginNotification = async (user, loginMethod = 'email') => {
  try {
    console.log(
      '🚀 INICIANDO sendLoginNotification - Usuario:',
      user.email,
      'Método:',
      loginMethod
    );

    const payload = {
      eventType: 'login',
      timestamp: new Date().toISOString(),
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Usuario',
        photoURL: user.photoURL || null,
      },
      loginMethod,
      app: 'combustibles',
      metadata: {
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      },
    };

    console.log('=� Enviando notificaci�n de login a n8n:', payload);

    const success = await sendWebhook(payload);

    if (success) {
      console.log(' Notificaci�n de login enviada exitosamente');
    } else {
      console.warn('� Error al enviar notificaci�n de login');
    }

    return success;
  } catch (error) {
    console.error('L Error en sendLoginNotification:', error);
    return false;
  }
};

/**
 * Enviar notificaci�n de movimiento a n8n
 * @param {Object} movement - Datos del movimiento creado
 * @param {string} movementId - ID del movimiento en Firestore
 * @returns {Promise<boolean>} - true si se envi� correctamente
 */
export const sendMovementNotification = async (movement, movementId) => {
  try {
    const payload = {
      eventType: 'movement',
      timestamp: new Date().toISOString(),
      movement: {
        id: movementId,
        type: movement.type,
        fuelType: movement.fuelType,
        quantity: movement.quantity,
        unitPrice: movement.unitPrice,
        totalValue: movement.totalValue || movement.quantity * movement.unitPrice,
        location: movement.location || movement.destinationLocation || 'principal',
        vehicleId: movement.vehicleId || null,
        supplierName: movement.supplierName || null,
        description: movement.description || null,
        effectiveDate: movement.effectiveDate
          ? new Date(movement.effectiveDate).toISOString()
          : new Date().toISOString(),
        status: movement.status || 'completado',
      },
      app: 'combustibles',
      metadata: {
        timestamp: Date.now(),
        source: 'movementsService',
      },
    };

    console.log('=� Enviando notificaci�n de movimiento a n8n:', payload);

    const success = await sendWebhook(payload);

    if (success) {
      console.log(' Notificaci�n de movimiento enviada exitosamente');
    } else {
      console.warn('� Error al enviar notificaci�n de movimiento');
    }

    return success;
  } catch (error) {
    console.error('L Error en sendMovementNotification:', error);
    return false;
  }
};

/**
 * Funci�n principal para enviar webhook a n8n
 * @param {Object} payload - Datos a enviar
 * @returns {Promise<boolean>} - true si se envi� correctamente
 */
const sendWebhook = async (payload) => {
  const url = `${WEBHOOK_CONFIG.baseUrl}/${WEBHOOK_CONFIG.endpoints.combustibles}`;

  for (let attempt = 1; attempt <= WEBHOOK_CONFIG.retryAttempts; attempt++) {
    try {
      console.log(
        `= Intento ${attempt}/${WEBHOOK_CONFIG.retryAttempts} - Enviando webhook a: ${url}`
      );

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_CONFIG.timeout);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Combustibles-App/1.0',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const responseData = await response.text();
        console.log(` Webhook enviado exitosamente (intento ${attempt}):`, responseData);
        return true;
      } else {
        console.warn(
          `� Webhook fall� (intento ${attempt}) - Status: ${response.status} ${response.statusText}`
        );

        if (attempt === WEBHOOK_CONFIG.retryAttempts) {
          console.error('L Todos los intentos de webhook fallaron');
          return false;
        }

        // Esperar antes del siguiente intento (backoff exponencial)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    } catch (error) {
      console.error(`L Error en intento ${attempt} de webhook:`, error.message);

      if (attempt === WEBHOOK_CONFIG.retryAttempts) {
        console.error('L Todos los intentos de webhook fallaron por errores de red');
        return false;
      }

      // Esperar antes del siguiente intento
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }

  return false;
};

/**
 * Probar conectividad con el webhook de n8n
 * @returns {Promise<boolean>} - true si el webhook responde
 */
export const testWebhookConnectivity = async () => {
  try {
    const testPayload = {
      eventType: 'test',
      timestamp: new Date().toISOString(),
      message: 'Test de conectividad desde combustibles app',
      app: 'combustibles',
    };

    console.log('>� Probando conectividad con webhook...');
    const success = await sendWebhook(testPayload);

    if (success) {
      console.log(' Test de conectividad exitoso');
    } else {
      console.warn('� Test de conectividad fall�');
    }

    return success;
  } catch (error) {
    console.error('L Error en test de conectividad:', error);
    return false;
  }
};

export default {
  sendLoginNotification,
  sendMovementNotification,
  testWebhookConnectivity,
};
