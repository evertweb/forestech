/**
 * SOLUCIÓN HÍBRIDA PARA DESARROLLO - SIN CORS
 * Usa el SDK @firebase-web-authn/browser directamente
 * bypaseando la Cloud Function problemática
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

// CONFIGURACIÓN HÍBRIDA - SDK DIRECTO
const functions = getFunctions(undefined, 'us-east1');

console.log('🔧 [HÍBRIDO] Servicio Web Authn configurado para usar SDK directo (sin CORS)');

/**
 * Crear nuevo usuario con passkey - SDK DIRECTO
 */
export const createUserWithWebAuthn = async (displayName = 'Usuario Forestech') => {
  try {
    console.log('🔐 [HÍBRIDO] Iniciando creación de usuario con passkey SDK directo...');

    // Usar SDK directamente - evita problemas CORS
    const userCredential = await createUserWithPasskey(auth, functions, displayName);

    console.log('✅ [HÍBRIDO] Usuario creado exitosamente:', userCredential.user.uid);

    return {
      success: true,
      user: userCredential.user,
      message: '¡Usuario creado exitosamente con passkey!'
    };
  } catch (error) {
    console.error('❌ [HÍBRIDO] Error creando usuario:', error);

    // Si el error es CORS, ofrecer alternativa
    if (error.message.includes('CORS') || error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Error de CORS: Configurar dominios autorizados en Firebase Console o usar HTTPS',
        recommendation: 'Ve a Firebase Console → Authentication → Settings → Authorized domains',
        originalError: error
      };
    }

    return {
      success: false,
      error: `Error SDK: ${error.message}`,
      originalError: error
    };
  }
};

/**
 * Iniciar sesión con passkey - SDK DIRECTO
 */
export const signInWithWebAuthn = async () => {
  try {
    console.log('🔐 [HÍBRIDO] Iniciando autenticación con passkey SDK directo...');

    const userCredential = await signInWithPasskey(auth, functions);

    console.log('✅ [HÍBRIDO] Autenticación exitosa:', userCredential.user.uid);

    return {
      success: true,
      user: userCredential.user,
      message: '¡Autenticación exitosa con passkey!'
    };
  } catch (error) {
    console.error('❌ [HÍBRIDO] Error en autenticación:', error);

    if (error.message.includes('CORS') || error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Error de CORS: La extensión requiere configuración adicional para desarrollo local',
        recommendation: 'Usar HTTPS o configurar proxy inverso',
        originalError: error
      };
    }

    return {
      success: false,
      error: `Error SDK: ${error.message}`,
      originalError: error
    };
  }
};

/**
 * Vincular passkey a usuario - SDK DIRECTO
 */
export const linkPasskeyToUser = async (displayName = 'Passkey Secundaria') => {
  try {
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado para vincular passkey');
    }

    console.log('🔗 [HÍBRIDO] Vinculando passkey con SDK directo...');

    const userCredential = await linkWithPasskey(auth, functions, displayName);

    console.log('✅ [HÍBRIDO] Passkey vinculada exitosamente:', userCredential.user.uid);

    return {
      success: true,
      user: userCredential.user,
      message: '¡Passkey vinculada exitosamente!'
    };
  } catch (error) {
    console.error('❌ [HÍBRIDO] Error vinculando passkey:', error);

    if (error.message.includes('CORS') || error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Error de CORS: Prueba en HTTPS o configura un proxy inverso',
        recommendation: 'Para desarrollo: usar ngrok o configurar HTTPS local',
        originalError: error
      };
    }

    return {
      success: false,
      error: `Error SDK: ${error.message}`,
      originalError: error
    };
  }
};

// Funciones auxiliares mantienen la misma implementación
export const isWebAuthnSupported = () => {
  return typeof window !== 'undefined' &&
         'credentials' in navigator &&
         'create' in navigator.credentials;
};

export const isPlatformAuthenticatorAvailable = async () => {
  if (!isWebAuthnSupported()) return false;
  try {
    const available = await window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable?.();
    return !!available;
  } catch (error) {
    return isWebAuthnSupported();
  }
};

export const getWebAuthnCapabilities = async () => {
  const capabilities = {
    webAuthnSupported: isWebAuthnSupported(),
    platformAuthenticatorAvailable: await isPlatformAuthenticatorAvailable(),
    conditionalMediationSupported: false,
    userVerifyingPlatformAuthenticatorAvailable: false,
    secureContext: typeof window !== 'undefined' ? window.isSecureContext : false,
    https: typeof window !== 'undefined' ? window.location.protocol === 'https:' : false,
    corsIssue: true // Indicar que hay problema CORS conocido
  };

  if (window.PublicKeyCredential?.isConditionalMediationAvailable) {
    try {
      capabilities.conditionalMediationSupported = await window.PublicKeyCredential.isConditionalMediationAvailable();
    } catch (e) {
      capabilities.conditionalMediationSupported = false;
    }
  }

  return capabilities;
};

export const checkWebAuthnReadiness = async () => {
  const capabilities = await getWebAuthnCapabilities();
  const issues = [];
  const recommendations = [];

  if (!capabilities.secureContext) {
    issues.push('Contexto no seguro detectado');
    recommendations.push('Usa HTTPS para habilitar passkeys completamente');
  }

  if (!capabilities.webAuthnSupported) {
    issues.push('WebAuthn no soportado en este navegador');
    recommendations.push('Actualiza tu navegador a la versión más reciente');
  }

  if (capabilities.corsIssue && !capabilities.https) {
    issues.push('Problema CORS en desarrollo local');
    recommendations.push('Configura HTTPS local o usa ngrok para testing completo');
  }

  if (!capabilities.platformAuthenticatorAvailable) {
    issues.push('No hay autenticadores de plataforma disponibles');
    recommendations.push('Configura Touch ID, Face ID o Windows Hello en tu dispositivo');
  }

  const isReady = capabilities.webAuthnSupported && capabilities.secureContext;

  return {
    ready: isReady,
    capabilities,
    issues,
    recommendations,
    summary: isReady
      ? '✅ [HÍBRIDO] WebAuthn ready - CORS issue conocido en desarrollo'
      : `❌ Se encontraron ${issues.length} problema(s) que impiden usar passkeys`
  };
};

// Placeholder para funciones no críticas
export const unlinkPasskeyFromUser = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado para desvincular passkey');
    }

    await unlinkPasskey(auth, functions);
    return { success: true, message: 'Passkey desvinculada exitosamente' };
  } catch (error) {
    return {
      success: false,
      error: error.message.includes('CORS')
        ? 'Error de CORS: Funcionalidad limitada en desarrollo local'
        : `Error: ${error.message}`
    };
  }
};

export const verifyUserWithWebAuthn = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado para verificar');
    }

    await verifyUserWithPasskey(auth, functions);
    return { success: true, message: 'Usuario verificado exitosamente' };
  } catch (error) {
    return {
      success: false,
      error: error.message.includes('CORS')
        ? 'Error de CORS: Funcionalidad limitada en desarrollo local'
        : `Error: ${error.message}`
    };
  }
};
