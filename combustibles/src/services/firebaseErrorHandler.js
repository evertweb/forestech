/**
 * Servicio centralizado de manejo de errores de Firebase
 * combustibles/src/services/firebaseErrorHandler.js
 */

// Mapeo de códigos de error Firebase a mensajes amigables en español
const FIREBASE_ERROR_MESSAGES = {
  // Auth errors
  'auth/user-not-found': 'Usuario no encontrado',
  'auth/wrong-password': 'Contraseña incorrecta',
  'auth/email-already-in-use': 'El email ya está registrado',
  'auth/weak-password': 'La contraseña es muy débil',
  'auth/invalid-email': 'Email inválido',
  'auth/user-disabled': 'Usuario deshabilitado',
  'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
  'auth/network-request-failed': 'Error de red. Verifica tu conexión',
  'auth/popup-closed-by-user': 'Ventana de autenticación cerrada',
  'auth/cancelled-popup-request': 'Solicitud de autenticación cancelada',
  'auth/popup-blocked': 'Popup bloqueado por el navegador',

  // Firestore errors
  'permission-denied': 'No tienes permisos para realizar esta acción',
  'not-found': 'Documento no encontrado',
  'already-exists': 'El documento ya existe',
  'resource-exhausted': 'Cuota de recursos excedida',
  'failed-precondition': 'Condición previa fallida',
  aborted: 'Operación abortada',
  'out-of-range': 'Fuera de rango',
  unimplemented: 'Funcionalidad no implementada',
  internal: 'Error interno del servidor',
  unavailable: 'Servicio no disponible temporalmente',
  'data-loss': 'Pérdida de datos',
  unauthenticated: 'No estás autenticado. Inicia sesión',
  'deadline-exceeded': 'Tiempo de espera agotado',
  'invalid-argument': 'Argumentos inválidos',

  // Storage errors
  'storage/object-not-found': 'Archivo no encontrado',
  'storage/bucket-not-found': 'Bucket de almacenamiento no encontrado',
  'storage/project-not-found': 'Proyecto no encontrado',
  'storage/quota-exceeded': 'Cuota de almacenamiento excedida',
  'storage/unauthenticated': 'No autenticado para Storage',
  'storage/unauthorized': 'Sin permisos para acceder al archivo',
  'storage/retry-limit-exceeded': 'Límite de reintentos excedido',
  'storage/invalid-checksum': 'Checksum de archivo inválido',
  'storage/canceled': 'Operación cancelada',
  'storage/invalid-event-name': 'Nombre de evento inválido',
  'storage/invalid-url': 'URL de Storage inválida',
  'storage/invalid-argument': 'Argumento inválido para Storage',
  'storage/no-default-bucket': 'No hay bucket predeterminado configurado',
  'storage/cannot-slice-blob': 'No se puede procesar el archivo',
  'storage/server-file-wrong-size': 'Tamaño de archivo incorrecto en servidor',

  // Network errors
  'network-request-failed': 'Error de red. Verifica tu conexión a internet',
  timeout: 'Tiempo de espera agotado. Intenta de nuevo',

  // Custom app errors
  'validation-error': 'Error de validación de datos',
  'business-logic-error': 'Error en lógica de negocio',
  'user-input-error': 'Error en datos ingresados',
};

/**
 * Obtiene un mensaje de error amigable para el usuario
 * @param {Error|Object} error - Error de Firebase
 * @returns {string} Mensaje amigable en español
 */
export const getFirebaseErrorMessage = (error) => {
  if (!error) return 'Error desconocido';

  // Si el error ya tiene un mensaje personalizado, usarlo
  if (error.userMessage) {
    return error.userMessage;
  }

  // Obtener código de error
  const errorCode = error.code || error.message;

  // Buscar mensaje personalizado
  const customMessage = FIREBASE_ERROR_MESSAGES[errorCode];
  if (customMessage) {
    return customMessage;
  }

  // Mensajes por categoría de error
  if (errorCode?.includes('auth/')) {
    return 'Error de autenticación. Verifica tus credenciales';
  }

  if (errorCode?.includes('storage/')) {
    return 'Error al acceder al almacenamiento de archivos';
  }

  if (errorCode?.includes('functions/')) {
    return 'Error en el servidor. Intenta más tarde';
  }

  // Si es error de red
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return 'Error de conexión. Verifica tu internet e intenta de nuevo';
  }

  // Si es error 400/401/403/404/500
  if (error.status) {
    switch (error.status) {
      case 400:
        return 'Solicitud inválida. Verifica los datos enviados';
      case 401:
        return 'No autorizado. Inicia sesión nuevamente';
      case 403:
        return 'Acceso denegado. No tienes permisos suficientes';
      case 404:
        return 'Recurso no encontrado';
      case 429:
        return 'Demasiadas solicitudes. Espera un momento e intenta de nuevo';
      case 500:
        return 'Error interno del servidor. Intenta más tarde';
      case 503:
        return 'Servicio no disponible temporalmente';
      default:
        return `Error del servidor (${error.status})`;
    }
  }

  // Fallback genérico
  return error.message || 'Error inesperado. Intenta de nuevo';
};

/**
 * Registra un error de Firebase con contexto adicional
 * @param {Error|Object} error - Error de Firebase
 * @param {Object} context - Contexto adicional del error
 */
export const logFirebaseError = (error, context = {}) => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    code: error.code,
    message: error.message,
    stack: error.stack,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // Log en consola para desarrollo
  if (typeof window !== 'undefined' && import.meta.env && import.meta.env.DEV) {
    console.group('🔥 Firebase Error');
    console.error('Error:', error);
    console.log('Context:', context);
    console.log('Full Info:', errorInfo);
    console.groupEnd();
  } else {
    // En producción o cuando no está definido DEV, solo error básico
    console.error('Firebase Error:', errorInfo);
  }

  return errorInfo;
};

/**
 * Determina si un error de Firebase justifica un reintento
 * @param {Error|Object} error - Error de Firebase
 * @returns {boolean} true si se debe reintentar
 */
export const shouldRetryFirebaseOperation = (error) => {
  const retryableCodes = [
    'unavailable',
    'deadline-exceeded',
    'internal',
    'network-request-failed',
    'timeout',
    'aborted',
  ];

  return (
    retryableCodes.includes(error.code) ||
    error.message?.includes('network') ||
    error.message?.includes('timeout')
  );
};

/**
 * Ejecuta una operación de Firebase con reintento automático
 * @param {Function} operation - Función async que ejecuta la operación Firebase
 * @param {Object} options - Opciones de reintento
 * @returns {Promise} Resultado de la operación
 */
export const retryFirebaseOperation = async (operation, options = {}) => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    context = {},
  } = options;

  let lastError;
  let delay = baseDelay;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await operation();
      return result;
    } catch (error) {
      lastError = error;

      // Log del intento fallido
      logFirebaseError(error, {
        ...context,
        attempt: attempt + 1,
        maxRetries,
      });

      // No reintentar si el error no es retryable
      if (!shouldRetryFirebaseOperation(error)) {
        throw error;
      }

      // No reintentar si es el último intento
      if (attempt === maxRetries - 1) {
        break;
      }

      // Esperar antes del siguiente intento
      await new Promise((resolve) => setTimeout(resolve, Math.min(delay, maxDelay)));
      delay *= backoffMultiplier;
    }
  }

  // Si llegamos aquí, todos los reintentos fallaron
  throw lastError;
};

/**
 * Wrapper para operaciones de Firestore con manejo de errores
 * @param {Function} operation - Operación de Firestore
 * @param {Object} context - Contexto de la operación
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const safeFirestoreOperation = async (operation, context = {}) => {
  try {
    const result = await retryFirebaseOperation(operation, { context });
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    logFirebaseError(error, context);

    return {
      success: false,
      error: getFirebaseErrorMessage(error),
      code: error.code,
    };
  }
};

/**
 * Wrapper para operaciones de Storage con manejo de errores
 * @param {Function} operation - Operación de Storage
 * @param {Object} context - Contexto de la operación
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const safeStorageOperation = async (operation, context = {}) => {
  try {
    const result = await retryFirebaseOperation(operation, {
      maxRetries: 2, // Menos reintentos para Storage
      context,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    logFirebaseError(error, context);

    return {
      success: false,
      error: getFirebaseErrorMessage(error),
      code: error.code,
    };
  }
};

/**
 * Verifica la conectividad con Firebase
 * @returns {Promise<boolean>} true si Firebase está disponible
 */
export const checkFirebaseConnectivity = async () => {
  try {
    // Intentar una operación simple de Firestore
    const { firestore } = await import('../firebase/config');
    const { doc, getDoc } = await import('firebase/firestore');

    // Intentar leer un documento que sabemos que no existe (no genera error en reglas)
    const testRef = doc(firestore, '_health_check_', 'connectivity');
    await getDoc(testRef);

    return true;
  } catch (error) {
    console.warn('Firebase connectivity check failed:', error);
    return false;
  }
};

export default {
  getFirebaseErrorMessage,
  logFirebaseError,
  shouldRetryFirebaseOperation,
  retryFirebaseOperation,
  safeFirestoreOperation,
  safeStorageOperation,
  checkFirebaseConnectivity,
};
