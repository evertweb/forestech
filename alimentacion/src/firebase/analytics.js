// src/firebase/analytics.js
import { logEvent } from "firebase/analytics";
import { analytics } from "./config";

// Función para verificar si Analytics está disponible
const isAnalyticsAvailable = () => {
  return analytics !== null && typeof window !== 'undefined';
};

// Eventos personalizados para la aplicación
export const trackEvent = (eventName, parameters = {}) => {
  if (!isAnalyticsAvailable()) {
    console.log(`Analytics no disponible - Evento: ${eventName}`, parameters);
    return;
  }
  
  try {
    logEvent(analytics, eventName, parameters);
    console.log(`✅ Evento tracked: ${eventName}`, parameters);
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Eventos específicos de la aplicación
export const analyticsEvents = {
  // Eventos de autenticación
  login: (method = 'email') => {
    trackEvent('login', {
      method: method,
      timestamp: new Date().toISOString()
    });
  },

  logout: () => {
    trackEvent('logout', {
      timestamp: new Date().toISOString()
    });
  },

  signup: (method = 'email') => {
    trackEvent('sign_up', {
      method: method,
      timestamp: new Date().toISOString()
    });
  },

  // Eventos de liquidaciones
  liquidacionCreada: (clientesCount, deduccionesCount, total) => {
    trackEvent('liquidacion_creada', {
      clientes_count: clientesCount,
      deducciones_count: deduccionesCount,
      total_amount: total,
      timestamp: new Date().toISOString()
    });
  },

  liquidacionCalculada: (total, clientesCount) => {
    trackEvent('liquidacion_calculada', {
      total_amount: total,
      clientes_count: clientesCount,
      timestamp: new Date().toISOString()
    });
  },

  pdfGenerado: (tipo = 'general') => {
    trackEvent('pdf_generado', {
      tipo: tipo, // 'general', 'individual', etc.
      timestamp: new Date().toISOString()
    });
  },

  pdfDescargado: (tipo = 'general') => {
    trackEvent('pdf_descargado', {
      tipo: tipo,
      timestamp: new Date().toISOString()
    });
  },

  // Eventos de navegación
  seccionVisitada: (seccion) => {
    trackEvent('seccion_visitada', {
      seccion: seccion, // 'general_data', 'clients', 'deductions', 'history'
      timestamp: new Date().toISOString()
    });
  },

  // Eventos de historial
  liquidacionEliminada: () => {
    trackEvent('liquidacion_eliminada', {
      timestamp: new Date().toISOString()
    });
  },

  liquidacionRestaurada: () => {
    trackEvent('liquidacion_restaurada', {
      timestamp: new Date().toISOString()
    });
  },

  // Eventos de tema
  temaChanged: (tema) => {
    trackEvent('tema_changed', {
      tema: tema, // 'light', 'dark'
      timestamp: new Date().toISOString()
    });
  },

  // Eventos de errores
  error: (errorType, errorMessage) => {
    trackEvent('app_error', {
      error_type: errorType,
      error_message: errorMessage,
      timestamp: new Date().toISOString()
    });
  },

  // Eventos de engagement
  formularioResetado: () => {
    trackEvent('formulario_reseteado', {
      timestamp: new Date().toISOString()
    });
  },

  clienteAñadido: () => {
    trackEvent('cliente_añadido', {
      timestamp: new Date().toISOString()
    });
  },

  deduccionAñadida: () => {
    trackEvent('deduccion_añadida', {
      timestamp: new Date().toISOString()
    });
  },

  // Eventos personalizados para sistema de roles y otras funcionalidades
  custom: (eventName, parameters = {}) => {
    trackEvent(eventName, {
      ...parameters,
      timestamp: new Date().toISOString()
    });
  }
};

// Función para trackear tiempo en página
export const trackPageView = (pageName) => {
  if (!isAnalyticsAvailable()) return;
  
  trackEvent('page_view', {
    page_title: pageName,
    page_location: window.location.href,
    timestamp: new Date().toISOString()
  });
};

// Función para trackear errores automáticamente
export const setupErrorTracking = () => {
  if (!isAnalyticsAvailable()) return;

  // Capturar errores de JavaScript
  window.addEventListener('error', (event) => {
    analyticsEvents.error('javascript_error', event.message);
  });

  // Capturar promesas rechazadas
  window.addEventListener('unhandledrejection', (event) => {
    analyticsEvents.error('promise_rejection', event.reason?.message || 'Promise rejected');
  });
};