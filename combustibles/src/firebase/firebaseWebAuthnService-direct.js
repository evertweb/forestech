/**
 * SOLUCIÓN TEMPORAL PARA ERROR 404 EN DESARROLLO
 * Este archivo reemplaza temporalmente firebaseWebAuthnService.js
 * para trabajar directamente con las Cloud Functions de producción
 */

import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from './config';

// CONFIGURACIÓN DIRECTA PARA DESARROLLO
const functions = getFunctions(undefined, 'us-east1');

// Función helper para llamar directamente a la Cloud Function
const callWebAuthnFunction = async (functionName, data = {}) => {
  try {
    const callable = httpsCallable(functions, 'ext-firebase-web-authn-api');
    const result = await callable({
      action: functionName,
      ...data
    });
    return result.data;
  } catch (error) {
    console.error(`Error en ${functionName}:`, error);
    throw error;
  }
};

/**
 * Crear nuevo usuario con passkey - IMPLEMENTACIÓN DIRECTA
 */
export const createUserWithWebAuthn = async (displayName = 'Usuario Forestech') => {
  try {
    console.log('🔐 [DIRECTO] Iniciando creación de usuario con passkey...');

    // Llamada directa a la Cloud Function
    const result = await callWebAuthnFunction('createUser', {
      displayName,
      userId: auth.currentUser?.uid || 'anonymous'
    });

    console.log('✅ [DIRECTO] Usuario creado exitosamente:', result);

    return {
      success: true,
      user: result.user || auth.currentUser,
      message: '¡Usuario creado exitosamente con passkey!'
    };
  } catch (error) {
    console.error('❌ [DIRECTO] Error creando usuario:', error);

    return {
      success: false,
      error: `Error directo: ${error.message}`,
      originalError: error
    };
  }
};

/**
 * Iniciar sesión con passkey - IMPLEMENTACIÓN DIRECTA
 */
export const signInWithWebAuthn = async () => {
  try {
    console.log('🔐 [DIRECTO] Iniciando autenticación con passkey...');

    const result = await callWebAuthnFunction('signIn');

    console.log('✅ [DIRECTO] Autenticación exitosa:', result);

    return {
      success: true,
      user: result.user || auth.currentUser,
      message: '¡Autenticación exitosa con passkey!'
    };
  } catch (error) {
    console.error('❌ [DIRECTO] Error en autenticación:', error);

    return {
      success: false,
      error: `Error directo: ${error.message}`,
      originalError: error
    };
  }
};

/**
 * Vincular passkey a usuario - IMPLEMENTACIÓN DIRECTA
 */
export const linkPasskeyToUser = async (displayName = 'Passkey Secundaria') => {
  try {
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado para vincular passkey');
    }

    console.log('🔗 [DIRECTO] Vinculando passkey al usuario actual...');

    const result = await callWebAuthnFunction('linkPasskey', {
      displayName,
      userId: auth.currentUser.uid
    });

    console.log('✅ [DIRECTO] Passkey vinculada exitosamente:', result);

    return {
      success: true,
      user: result.user || auth.currentUser,
      message: '¡Passkey vinculada exitosamente!'
    };
  } catch (error) {
    console.error('❌ [DIRECTO] Error vinculando passkey:', error);

    return {
      success: false,
      error: `Error directo: ${error.message}`,
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
  return {
    webAuthnSupported: isWebAuthnSupported(),
    platformAuthenticatorAvailable: await isPlatformAuthenticatorAvailable(),
    conditionalMediationSupported: false,
    userVerifyingPlatformAuthenticatorAvailable: false,
    secureContext: typeof window !== 'undefined' ? window.isSecureContext : false,
    https: typeof window !== 'undefined' ? window.location.protocol === 'https:' : false
  };
};

export const checkWebAuthnReadiness = async () => {
  const capabilities = await getWebAuthnCapabilities();
  return {
    ready: capabilities.webAuthnSupported,
    capabilities,
    issues: [],
    recommendations: [],
    summary: '✅ [DIRECTO] Configuración directa a Cloud Functions activa'
  };
};

// Placeholder para funciones no críticas
export const unlinkPasskeyFromUser = async () => {
  return { success: false, error: 'Función no implementada en modo directo' };
};

export const verifyUserWithWebAuthn = async () => {
  return { success: false, error: 'Función no implementada en modo directo' };
};

console.log('🔧 [DIRECTO] Servicio Web Authn configurado para llamadas directas a Cloud Functions');
