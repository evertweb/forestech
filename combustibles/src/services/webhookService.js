/**
 * WebhookService - Servicio para envío de notificaciones a n8n
 * Envía eventos de la app combustibles a workflows de n8n para notificaciones automáticas
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
 * Enviar notificación de login a n8n
 * @param {Object} user - Datos del usuario que se autenticó
 * @param {string} loginMethod - Método de login ('email', 'google')
 * @param {Object} userProfile - Perfil del usuario con permisos (opcional)
 * @returns {Promise<boolean>} - true si se envió correctamente
 */
export const sendLoginNotification = async (user, loginMethod = 'email', userProfile = null) => {
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
        // Información adicional del perfil si está disponible
        role: userProfile?.role || 'cliente',
        permissions: userProfile?.combustiblesPermissions || {},
        lastLogin: userProfile?.lastLogin || null,
        emailVerified: user.emailVerified || false,
      },
      loginMethod,
      app: 'combustibles',
      metadata: {
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        hasProfile: !!userProfile,
      },
    };

    console.log('📤 Payload preparado para n8n (login):', payload);

    const success = await sendWebhook(payload);

    if (success) {
      console.log('✅ Notificación de login enviada exitosamente');
    } else {
      console.warn('⚠️ Error al enviar notificación de login');
    }

    return success;
  } catch (error) {
    console.error('❌ Error en sendLoginNotification:', error);
    return false;
  }
};

/**
 * Enviar notificación de movimiento a n8n
 * @param {Object} movement - Datos del movimiento creado
 * @param {string} movementId - ID del movimiento en Firestore
 * @param {Object} userInfo - Información del usuario que creó el movimiento (opcional)
 * @returns {Promise<boolean>} - true si se envió correctamente
 */
export const sendMovementNotification = async (movement, movementId, userInfo = null) => {
  try {
    console.log(
      '🚀 INICIANDO sendMovementNotification - Movimiento ID:',
      movementId,
      'Tipo:',
      movement.type
    );
    console.log('🚀 userInfo recibido:', userInfo);
    console.log('🚀 userInfo es null?', userInfo === null);
    console.log('🚀 userInfo es undefined?', userInfo === undefined);

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
        destinationLocation: movement.destinationLocation || null,
        vehicleId: movement.vehicleId || null,
        supplierName: movement.supplierName || null,
        description: movement.description || null,
        effectiveDate: movement.effectiveDate
          ? new Date(movement.effectiveDate).toISOString()
          : new Date().toISOString(),
        status: movement.status || 'completado',
        reference: movement.reference || null,
      },
      // Información del usuario que creó el movimiento
      createdBy: userInfo
        ? {
            uid: userInfo.uid,
            email: userInfo.email,
            displayName: userInfo.displayName || userInfo.email?.split('@')[0] || 'Usuario',
            role: userInfo.role || 'cliente',
          }
        : null,
      app: 'combustibles',
      metadata: {
        timestamp: Date.now(),
        source: 'movementsService',
        hasUserInfo: !!userInfo,
      },
    };

    console.log('📤 Payload preparado para n8n (movement):', payload);

    const success = await sendWebhook(payload);

    if (success) {
      console.log('✅ Notificación de movimiento enviada exitosamente');
    } else {
      console.warn('⚠️ Error al enviar notificación de movimiento');
    }

    return success;
  } catch (error) {
    console.error('❌ Error en sendMovementNotification:', error);
    return false;
  }
};

/**
 * Función principal para enviar webhook a n8n
 * @param {Object} payload - Datos a enviar
 * @returns {Promise<boolean>} - true si se envió correctamente
 */
const sendWebhook = async (payload) => {
  const url = `${WEBHOOK_CONFIG.baseUrl}/${WEBHOOK_CONFIG.endpoints.combustibles}`;

  for (let attempt = 1; attempt <= WEBHOOK_CONFIG.retryAttempts; attempt++) {
    try {
      console.log(
        `🔄 Intento ${attempt}/${WEBHOOK_CONFIG.retryAttempts} - Enviando webhook a: ${url}`
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
        console.log(`✅ Webhook enviado exitosamente (intento ${attempt}):`, responseData);
        return true;
      } else {
        console.warn(
          `⚠️ Webhook falló (intento ${attempt}) - Status: ${response.status} ${response.statusText}`
        );

        if (attempt === WEBHOOK_CONFIG.retryAttempts) {
          console.error('❌ Todos los intentos de webhook fallaron');
          return false;
        }

        // Esperar antes del siguiente intento (backoff exponencial)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    } catch (error) {
      console.error(`❌ Error en intento ${attempt} de webhook:`, error.message);

      if (attempt === WEBHOOK_CONFIG.retryAttempts) {
        console.error('❌ Todos los intentos de webhook fallaron por errores de red');
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

    console.log('🧪 Probando conectividad con webhook...');
    const success = await sendWebhook(testPayload);

    if (success) {
      console.log('✅ Test de conectividad exitoso');
    } else {
      console.warn('⚠️ Test de conectividad falló');
    }

    return success;
  } catch (error) {
    console.error('❌ Error en test de conectividad:', error);
    return false;
  }
};

export default {
  sendLoginNotification,
  sendMovementNotification,
  testWebhookConnectivity,
};
