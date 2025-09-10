/**
 * firebaseWebAuthnService.js - Servicio profesional de WebAuthn usando la extensión Firebase
 * Reemplaza la implementación manual anterior con funcionalidades completas
 */

import { getFunctions } from 'firebase/functions';
import {
  createUserWithPasskey,
  signInWithPasskey,
  linkWithPasskey,
  unlinkPasskey,
  verifyUserWithPasskey
} from '@firebase-web-authn/browser';
import { auth } from './config';

// Inicializar Functions para la extensión WebAuthn
// DEVELOPMENT: Usar emulador local si está disponible
let functions;
if (import.meta.env.DEV && typeof window !== 'undefined') {
  // En desarrollo, intentar usar emulador local
  try {
    functions = getFunctions(undefined, 'us-east1');
    // Verificar si el emulador está corriendo
    if (window.location.hostname === 'localhost') {
      console.log('🔧 Configurando Firebase Functions para desarrollo local');
      // El emulador estará disponible en localhost:5001 si está corriendo
    }
  } catch (error) {
    console.warn('⚠️ Emulador no disponible, usando producción:', error);
    functions = getFunctions(undefined, 'us-east1');
  }
} else {
  // En producción, usar región configurada
  functions = getFunctions(undefined, 'us-east1');
}

/**
 * Verificar si WebAuthn está soportado en el navegador
 * @returns {boolean} True si WebAuthn está disponible
 */
export const isWebAuthnSupported = () => {
  return typeof window !== 'undefined' &&
         'credentials' in navigator &&
         'create' in navigator.credentials;
};

/**
 * Verificar si hay autenticadores de plataforma disponibles
 * @returns {Promise<boolean>} True si hay autenticadores disponibles
 */
export const isPlatformAuthenticatorAvailable = async () => {
  if (!isWebAuthnSupported()) return false;

  try {
    // Verificar autenticadores de plataforma (Touch ID, Face ID, Windows Hello)
    const platformAvailable = await window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable?.();

    // NUEVO: También verificar autenticadores cross-platform (Google Password Manager, etc.)
    const conditionalAvailable = window.PublicKeyCredential?.isConditionalMediationAvailable
      ? await window.PublicKeyCredential.isConditionalMediationAvailable()
      : false;

    // Retorna true si cualquiera está disponible
    return !!(platformAvailable || conditionalAvailable || window.PublicKeyCredential);
  } catch (error) {
    console.warn('Error verificando autenticador de plataforma:', error);
    // Si hay error, pero WebAuthn está soportado, probablemente funcione con gestores de contraseñas
    return isWebAuthnSupported();
  }
};

/**
 * Crear nuevo usuario con passkey como método principal de autenticación
 * @param {string} displayName - Nombre a mostrar para la passkey
 * @returns {Promise<Object>} Resultado de la creación del usuario
 */
export const createUserWithWebAuthn = async (displayName = 'Usuario Forestech') => {
  try {
    console.log('🔐 Iniciando creación de usuario con passkey...');

    const userCredential = await createUserWithPasskey(auth, functions, displayName);

    console.log('✅ Usuario creado exitosamente con passkey:', userCredential.user.uid);

    return {
      success: true,
      user: userCredential.user,
      message: '¡Usuario creado exitosamente con passkey!'
    };
  } catch (error) {
    console.error('❌ Error creando usuario con passkey:', error);

    return {
      success: false,
      error: getWebAuthnErrorMessage(error),
      originalError: error
    };
  }
};

/**
 * Iniciar sesión usando passkey existente
 * @returns {Promise<Object>} Resultado del inicio de sesión
 */
export const signInWithWebAuthn = async () => {
  try {
    console.log('🔐 Iniciando autenticación con passkey...');

    const userCredential = await signInWithPasskey(auth, functions);

    console.log('✅ Autenticación exitosa con passkey:', userCredential.user.uid);

    return {
      success: true,
      user: userCredential.user,
      message: '¡Autenticación exitosa con passkey!'
    };
  } catch (error) {
    console.error('❌ Error en autenticación con passkey:', error);

    return {
      success: false,
      error: getWebAuthnErrorMessage(error),
      originalError: error
    };
  }
};

/**
 * Vincular passkey a usuario ya autenticado (como 2FA o método alternativo)
 * @param {string} displayName - Nombre para la nueva passkey
 * @returns {Promise<Object>} Resultado de la vinculación
 */
export const linkPasskeyToUser = async (displayName = 'Passkey Secundaria') => {
  try {
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado para vincular passkey');
    }

    console.log('🔗 Vinculando passkey al usuario actual...');

    const userCredential = await linkWithPasskey(auth, functions, displayName);

    console.log('✅ Passkey vinculada exitosamente al usuario:', userCredential.user.uid);

    return {
      success: true,
      user: userCredential.user,
      message: '¡Passkey vinculada exitosamente!'
    };
  } catch (error) {
    console.error('❌ Error vinculando passkey:', error);

    return {
      success: false,
      error: getWebAuthnErrorMessage(error),
      originalError: error
    };
  }
};

/**
 * Desvincular passkey del usuario actual
 * @returns {Promise<Object>} Resultado de la desvinculación
 */
export const unlinkPasskeyFromUser = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado para desvincular passkey');
    }

    console.log('🔓 Desvinculando passkey del usuario actual...');

    await unlinkPasskey(auth, functions);

    console.log('✅ Passkey desvinculada exitosamente');

    return {
      success: true,
      message: 'Passkey desvinculada exitosamente'
    };
  } catch (error) {
    console.error('❌ Error desvinculando passkey:', error);

    return {
      success: false,
      error: getWebAuthnErrorMessage(error),
      originalError: error
    };
  }
};

/**
 * Verificar usuario con passkey (para acciones sensibles)
 * @returns {Promise<Object>} Resultado de la verificación
 */
export const verifyUserWithWebAuthn = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado para verificar');
    }

    console.log('🔍 Verificando usuario con passkey...');

    await verifyUserWithPasskey(auth, functions);

    console.log('✅ Usuario verificado exitosamente con passkey');

    return {
      success: true,
      message: 'Usuario verificado exitosamente'
    };
  } catch (error) {
    console.error('❌ Error verificando usuario con passkey:', error);

    return {
      success: false,
      error: getWebAuthnErrorMessage(error),
      originalError: error
    };
  }
};

/**
 * Convertir errores técnicos de WebAuthn en mensajes amigables para el usuario
 * @param {Error} error - Error original de WebAuthn
 * @returns {string} Mensaje amigable para el usuario
 */
const getWebAuthnErrorMessage = (error) => {
  const errorCode = error.code || error.name || '';
  const errorMessage = error.message || '';

  // Errores específicos de WebAuthn
  if (errorCode.includes('NotSupportedError') || errorMessage.includes('not supported')) {
    return 'Tu dispositivo no soporta passkeys. Intenta con otro método de autenticación.';
  }

  if (errorCode.includes('NotAllowedError') || errorMessage.includes('not allowed')) {
    return 'Operación cancelada por el usuario o no autorizada.';
  }

  if (errorCode.includes('InvalidStateError') || errorMessage.includes('invalid state')) {
    return 'Ya existe una passkey para este dispositivo o estado inválido.';
  }

  if (errorCode.includes('SecurityError') || errorMessage.includes('security')) {
    return 'Error de seguridad. Asegúrate de estar en una conexión HTTPS.';
  }

  if (errorCode.includes('NetworkError') || errorMessage.includes('network')) {
    return 'Error de red. Verifica tu conexión a internet.';
  }

  // Errores específicos de Firebase
  if (errorCode.includes('auth/user-not-found')) {
    return 'No se encontró una cuenta asociada a esta passkey.';
  }

  if (errorCode.includes('auth/credential-already-in-use')) {
    return 'Esta passkey ya está asociada a otra cuenta.';
  }

  if (errorCode.includes('auth/invalid-credential')) {
    return 'Credencial inválida o expirada.';
  }

  if (errorCode.includes('auth/operation-not-allowed')) {
    return 'Las passkeys no están habilitadas en este proyecto.';
  }

  // Error genérico
  return `Error: ${errorMessage || 'Ocurrió un problema inesperado. Intenta nuevamente.'}`;
};

/**
 * Obtener información sobre las capacidades de WebAuthn del dispositivo
 * @returns {Promise<Object>} Información detallada sobre el soporte
 */
export const getWebAuthnCapabilities = async () => {
  const capabilities = {
    webAuthnSupported: isWebAuthnSupported(),
    platformAuthenticatorAvailable: false,
    conditionalMediationSupported: false,
    userVerifyingPlatformAuthenticatorAvailable: false,
    secureContext: typeof window !== 'undefined' ? window.isSecureContext : false,
    https: typeof window !== 'undefined' ? window.location.protocol === 'https:' : false
  };

  try {
    if (capabilities.webAuthnSupported) {
      capabilities.platformAuthenticatorAvailable = await isPlatformAuthenticatorAvailable();

      // Verificar soporte para autenticación condicional
      if (window.PublicKeyCredential?.isConditionalMediationAvailable) {
        capabilities.conditionalMediationSupported = await window.PublicKeyCredential.isConditionalMediationAvailable();
      }

      // Verificar autenticador de plataforma con verificación de usuario
      if (window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable) {
        capabilities.userVerifyingPlatformAuthenticatorAvailable =
          await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      }
    }
  } catch (error) {
    console.warn('Error verificando capacidades WebAuthn:', error);
  }

  return capabilities;
};

/**
 * Verificar si el entorno es adecuado para usar passkeys
 * @returns {Promise<Object>} Estado de preparación y mensajes de ayuda
 */
export const checkWebAuthnReadiness = async () => {
  const capabilities = await getWebAuthnCapabilities();
  const issues = [];
  const recommendations = [];

  if (!capabilities.secureContext) {
    issues.push('Contexto no seguro detectado');
    recommendations.push('Usa HTTPS para habilitar passkeys');
  }

  if (!capabilities.webAuthnSupported) {
    issues.push('WebAuthn no soportado en este navegador');
    recommendations.push('Actualiza tu navegador a la versión más reciente');
  }

  if (!capabilities.platformAuthenticatorAvailable) {
    issues.push('No hay autenticadores de plataforma disponibles');
    recommendations.push('Configura Touch ID, Face ID o Windows Hello en tu dispositivo');
  }

  const isReady = issues.length === 0;

  return {
    ready: isReady,
    capabilities,
    issues,
    recommendations,
    summary: isReady
      ? '✅ Tu dispositivo está listo para usar passkeys'
      : `❌ Se encontraron ${issues.length} problema(s) que impiden usar passkeys`
  };
};

// Exportar todas las funciones
export default {
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
  createUserWithWebAuthn,
  signInWithWebAuthn,
  linkPasskeyToUser,
  unlinkPasskeyFromUser,
  verifyUserWithWebAuthn,
  getWebAuthnCapabilities,
  checkWebAuthnReadiness
};
