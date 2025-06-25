/**
 * Servicio de Notificaciones Push con Firebase Cloud Messaging
 * Gestiona tokens FCM, permisos y envío de notificaciones
 * Mantiene consistencia con servicios Firebase existentes
 */

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import { analyticsEvents } from './analytics';

// Inicializar Firebase Messaging
let messaging = null;

try {
  messaging = getMessaging();
} catch (error) {
  console.warn('Firebase Messaging no disponible:', error);
}

/**
 * Clave pública VAPID para FCM
 * Configurada desde Firebase Console -> Project Settings -> Cloud Messaging
 */
const VAPID_KEY = 'BOPEiBBOuZfrxl5TTwpOtl_AlLmAieTuinqmQYcnOD9DEL5I11rASCwm8KUNV3ZCldra_fv2qGtw7p5NyCvLC7A';

/**
 * Obtiene la referencia para tokens FCM en Firestore
 */
const getUserTokenPath = (userId) => {
  return `artifacts/${import.meta.env.VITE_FIREBASE_APP_ID}/users/${userId}/fcm/token`;
};

/**
 * Solicita permisos de notificación al usuario
 * @returns {Promise<string>} - 'granted', 'denied', o 'default'
 */
export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      console.warn('Este navegador no soporta notificaciones');
      return 'not-supported';
    }

    const permission = await Notification.requestPermission();
    
    analyticsEvents.custom('notification_permission_requested', {
      permission: permission,
      user_agent: navigator.userAgent
    });

    console.log('📱 Permiso de notificaciones:', permission);
    return permission;
    
  } catch (error) {
    console.error('❌ Error solicitando permisos:', error);
    analyticsEvents.custom('notification_permission_error', {
      error_message: error.message
    });
    return 'error';
  }
};

/**
 * Obtiene el token FCM del dispositivo
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} - Resultado con token o error
 */
export const getFCMToken = async (userId) => {
  try {
    if (!messaging) {
      return { 
        success: false, 
        message: 'Firebase Messaging no disponible' 
      };
    }

    // Verificar permisos
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      return { 
        success: false, 
        message: 'Permisos de notificación denegados' 
      };
    }

    // Obtener token FCM
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    
    if (token) {
      // Guardar token en Firestore
      await saveTokenToFirestore(userId, token);
      
      analyticsEvents.custom('fcm_token_generated', {
        user_id: userId,
        has_token: true
      });

      console.log('🎯 TOKEN FCM COMPLETO PARA PRUEBAS:');
      console.log('==========================================');
      console.log(token);
      console.log('==========================================');
      console.log('✅ Token FCM obtenido exitosamente');
      return { 
        success: true, 
        token: token,
        message: 'Token FCM obtenido exitosamente' 
      };
    } else {
      return { 
        success: false, 
        message: 'No se pudo obtener token FCM' 
      };
    }
    
  } catch (error) {
    console.error('❌ Error obteniendo token FCM:', error);
    analyticsEvents.custom('fcm_token_error', {
      error_message: error.message
    });
    
    return { 
      success: false, 
      error: error.message,
      message: 'Error obteniendo token FCM' 
    };
  }
};

/**
 * Guarda el token FCM en Firestore
 * @param {string} userId - ID del usuario
 * @param {string} token - Token FCM
 */
const saveTokenToFirestore = async (userId, token) => {
  try {
    const tokenRef = doc(db, getUserTokenPath(userId));
    
    const tokenData = {
      token: token,
      userId: userId,
      createdAt: serverTimestamp(),
      lastUpdated: serverTimestamp(),
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      },
      isActive: true
    };

    await setDoc(tokenRef, tokenData);
    console.log('✅ Token FCM guardado en Firestore');
    
  } catch (error) {
    console.error('❌ Error guardando token FCM:', error);
  }
};

/**
 * Obtiene el token FCM guardado del usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} - Token guardado o null
 */
export const getSavedFCMToken = async (userId) => {
  try {
    const tokenRef = doc(db, getUserTokenPath(userId));
    const docSnap = await getDoc(tokenRef);
    
    if (docSnap.exists()) {
      return { success: true, tokenData: docSnap.data() };
    } else {
      return { success: false, tokenData: null };
    }
    
  } catch (error) {
    console.error('❌ Error obteniendo token guardado:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Configura el listener para mensajes en primer plano
 * @param {Function} callback - Función a ejecutar cuando llega mensaje
 */
export const setupForegroundMessaging = (callback) => {
  if (!messaging) {
    console.warn('Firebase Messaging no disponible para foreground');
    return null;
  }

  try {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('📨 Mensaje recibido en primer plano:', payload);
      
      // Analytics tracking
      analyticsEvents.custom('notification_received_foreground', {
        title: payload.notification?.title,
        has_data: !!payload.data
      });

      // Mostrar notificación personalizada
      if (payload.notification) {
        showCustomNotification(payload.notification);
      }

      // Ejecutar callback si se proporciona
      if (callback && typeof callback === 'function') {
        callback(payload);
      }
    });

    console.log('✅ Listener de mensajes en primer plano configurado');
    return unsubscribe;
    
  } catch (error) {
    console.error('❌ Error configurando foreground messaging:', error);
    return null;
  }
};

/**
 * Muestra una notificación personalizada en el navegador
 * @param {Object} notification - Datos de la notificación
 */
const showCustomNotification = (notification) => {
  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notif = new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'forestech-notification'
      });

      // Auto-cerrar después de 5 segundos
      setTimeout(() => {
        notif.close();
      }, 5000);

      // Manejar click en notificación
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    }
  } catch (error) {
    console.error('❌ Error mostrando notificación:', error);
  }
};

/**
 * Desactiva las notificaciones para un usuario
 * @param {string} userId - ID del usuario
 */
export const disableNotifications = async (userId) => {
  try {
    const tokenRef = doc(db, getUserTokenPath(userId));
    await updateDoc(tokenRef, {
      isActive: false,
      disabledAt: serverTimestamp()
    });

    analyticsEvents.custom('notifications_disabled', {
      user_id: userId
    });

    console.log('🔕 Notificaciones desactivadas');
    return { success: true, message: 'Notificaciones desactivadas' };
    
  } catch (error) {
    console.error('❌ Error desactivando notificaciones:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verifica si el navegador soporta notificaciones push
 * @returns {boolean} - True si soporta notificaciones
 */
export const isNotificationSupported = () => {
  return 'Notification' in window && 'serviceWorker' in navigator && messaging !== null;
};

/**
 * Obtiene el estado actual de permisos de notificación
 * @returns {string} - Estado del permiso
 */
export const getNotificationPermissionStatus = () => {
  if (!('Notification' in window)) {
    return 'not-supported';
  }
  return Notification.permission;
};

/**
 * Envía una notificación local automática
 * @param {string} title - Título de la notificación
 * @param {string} body - Cuerpo de la notificación
 * @param {string} eventType - Tipo de evento para analytics
 */
export const sendLocalNotification = (title, body, eventType = 'local_notification') => {
  try {
    if (!('Notification' in window)) {
      console.warn('Notificaciones no disponibles');
      return;
    }

    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body: body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'forestech-auto-notification',
        requireInteraction: false,
        silent: false,
        timestamp: Date.now()
      });

      // Analytics tracking
      analyticsEvents.custom(eventType, {
        title: title,
        body: body.substring(0, 50),
        timestamp: new Date().toISOString()
      });

      // Auto-cerrar después de 5 segundos
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Manejar click en notificación
      notification.onclick = () => {
        window.focus();
        notification.close();
        
        analyticsEvents.custom('notification_clicked', {
          event_type: eventType
        });
      };

      console.log('🔔 Notificación local enviada:', title);
    } else {
      console.warn('Permisos de notificación no concedidos');
    }
    
  } catch (error) {
    console.error('❌ Error enviando notificación local:', error);
  }
};

/**
 * Notificación específica para liquidación guardada
 * @param {Object} liquidationData - Datos de la liquidación
 */
export const notifyLiquidationSaved = (liquidationData) => {
  const totalFormatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(liquidationData.totalPayment || 0);

  const title = '✅ Liquidación Guardada';
  const body = `Tu liquidación de ${totalFormatted} ha sido guardada exitosamente en el historial.`;
  
  sendLocalNotification(title, body, 'liquidation_saved_notification');
};

/**
 * Notificación específica para PDF generado
 * @param {Object} pdfData - Datos del PDF generado
 */
export const notifyPDFGenerated = (pdfData) => {
  const totalFormatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(pdfData.totalPayment || 0);

  const title = '📄 PDF Generado';
  const body = `El PDF de tu liquidación por ${totalFormatted} ha sido generado y descargado exitosamente.`;
  
  sendLocalNotification(title, body, 'pdf_generated_notification');
};

/**
 * Inicializa el servicio de notificaciones para un usuario
 * @param {string} userId - ID del usuario
 * @param {Function} messageCallback - Callback para mensajes
 * @returns {Promise<Object>} - Resultado de inicialización
 */
export const initializeNotifications = async (userId, messageCallback = null) => {
  try {
    if (!isNotificationSupported()) {
      return {
        success: false,
        message: 'Notificaciones no soportadas en este navegador'
      };
    }

    // Obtener token FCM
    const tokenResult = await getFCMToken(userId);
    if (!tokenResult.success) {
      return tokenResult;
    }

    // Configurar listener de mensajes
    const unsubscribe = setupForegroundMessaging(messageCallback);

    analyticsEvents.custom('notifications_initialized', {
      user_id: userId,
      success: true
    });

    return {
      success: true,
      token: tokenResult.token,
      unsubscribe: unsubscribe,
      message: 'Notificaciones inicializadas exitosamente'
    };
    
  } catch (error) {
    console.error('❌ Error inicializando notificaciones:', error);
    analyticsEvents.custom('notifications_init_error', {
      error_message: error.message
    });
    
    return {
      success: false,
      error: error.message,
      message: 'Error inicializando notificaciones'
    };
  }
};