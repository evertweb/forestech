/**
 * authService.js - Servicio de autenticación mejorado con verificación de roles
 * Implementa las verificaciones de seguridad necesarias para migración
 */

import { auth } from './config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

/**
 * Detectar dominio automáticamente según entorno para WebAuthn
 * Esta función centralizada garantiza consistencia con el archivo .well-known/webauthn
 */
const getWebAuthnDomain = () => {
  if (typeof window === 'undefined') return 'localhost';

  const hostname = window.location.hostname;

  // Desarrollo local
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
    return 'localhost';
  }

  // Producción - dominio principal
  if (hostname.includes('forestechdecolombia.com.co')) {
    return 'forestechdecolombia.com.co';
  }

  // Firebase hosting por defecto
  if (hostname.includes('firebaseapp.com') || hostname.includes('web.app')) {
    return hostname;
  }

  // Fallback seguro
  return hostname;
};

/**
 * Roles autorizados para operaciones de migración
 */
export const MIGRATION_ROLES = ['admin', 'super_admin', 'migration_operator'];

/**
 * Obtener usuario actual autenticado
 * @returns {Promise<Object|null>} Usuario actual o null
 */
export const getCurrentUser = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

/**
 * Verificar si el usuario actual tiene permisos de migración
 * @param {Object} user - Usuario de Firebase Auth
 * @returns {Promise<boolean>} True si tiene permisos
 */
export const hasUserMigrationPermissions = async (user) => {
  if (!user) return false;

  try {
    // Obtener token con claims personalizados
    const idTokenResult = await user.getIdTokenResult();
    const customClaims = idTokenResult.claims;

    // Verificar roles
    const userRoles = customClaims.roles || [];
    return MIGRATION_ROLES.some((role) => userRoles.includes(role));
  } catch (error) {
    console.error('Error verificando permisos:', error);
    return false;
  }
};

/**
 * Obtener información completa del usuario con claims
 * @returns {Promise<Object|null>} Usuario con información de roles
 */
export const getCurrentUserWithClaims = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  try {
    const idTokenResult = await user.getIdTokenResult();
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      customClaims: idTokenResult.claims,
      hasMigrationPermissions: await hasUserMigrationPermissions(user),
    };
  } catch (error) {
    console.error('Error obteniendo claims:', error);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      customClaims: {},
      hasMigrationPermissions: false,
    };
  }
};

/**
 * Cerrar sesión
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    throw error;
  }
};

/**
 * Registrar una nueva passkey para el usuario actual
 * @param {string} displayName - Nombre para mostrar de la passkey
 * @returns {Promise<Object>} Resultado del registro
 */
export const registerPasskey = async (displayName = 'Passkey') => {
  try {
    // Verificar que el usuario esté autenticado
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado. Inicia sesión primero.');
    }

    // Generar desafío aleatorio de 32 bytes
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    // Generar ID único para el usuario basado en su UID
    const userIdBytes = new TextEncoder().encode(user.uid.slice(0, 16).padEnd(16, '0'));

    // Crear opciones para el registro de WebAuthn
    const publicKeyCredentialCreationOptions = {
      challenge: challenge,
      rp: {
        name: 'Forestech Combustibles',
        id: getWebAuthnDomain(),
      },
      user: {
        id: userIdBytes,
        name: user.email,
        displayName: displayName,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Preferir autenticadores integrados (Touch ID, Face ID, Windows Hello)
        userVerification: 'preferred',
        requireResidentKey: true, // Para que funcione con gestores de contraseñas
      },
      timeout: 60000,
      attestation: 'none', // No requerir attestation para simplificar
    };

    console.log(
      '🔐 Iniciando registro de passkey con opciones:',
      publicKeyCredentialCreationOptions
    );

    // Registrar la passkey
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });

    if (!credential) {
      throw new Error('No se pudo crear la credencial');
    }

    // Convertir a formato serializable
    const serializedCredential = {
      id: credential.id,
      rawId: Array.from(new Uint8Array(credential.rawId)),
      type: credential.type,
      response: {
        clientDataJSON: Array.from(new Uint8Array(credential.response.clientDataJSON)),
        attestationObject: Array.from(new Uint8Array(credential.response.attestationObject)),
      },
      userId: user.uid,
      userEmail: user.email,
      displayName: displayName,
      createdAt: new Date().toISOString(),
    };

    console.log('✅ Passkey registrada exitosamente:', credential.id);

    return { success: true, credential: serializedCredential };
  } catch (error) {
    console.error('❌ Error registrando passkey:', error);

    // Manejo específico de errores comunes
    if (error.name === 'NotSupportedError') {
      throw new Error(
        'Tu dispositivo no soporta passkeys. Intenta con otro método de autenticación.'
      );
    } else if (error.name === 'NotAllowedError') {
      throw new Error('Registro de passkey cancelado por el usuario.');
    } else if (error.name === 'InvalidStateError') {
      throw new Error('Ya existe una passkey para este dispositivo.');
    } else {
      throw new Error(`Error al registrar passkey: ${error.message}`);
    }
  }
};

/**
 * Autenticar usando una passkey existente
 * @returns {Promise<Object>} Usuario autenticado
 */
export const signInWithPasskey = async () => {
  try {
    // Generar desafío aleatorio
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    // Crear opciones para la autenticación WebAuthn
    const publicKeyCredentialRequestOptions = {
      challenge: challenge,
      rpId: getWebAuthnDomain(),
      userVerification: 'preferred',
      timeout: 60000,
      // No incluir allowCredentials para permitir que el gestor de contraseñas
      // muestre todas las passkeys disponibles
    };

    console.log('🔐 Iniciando autenticación con passkey...');

    // Obtener la passkey
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    if (!assertion) {
      throw new Error('No se pudo obtener la credencial');
    }

    // Convertir a formato serializable
    const serializedAssertion = {
      id: assertion.id,
      rawId: Array.from(new Uint8Array(assertion.rawId)),
      type: assertion.type,
      response: {
        clientDataJSON: Array.from(new Uint8Array(assertion.response.clientDataJSON)),
        authenticatorData: Array.from(new Uint8Array(assertion.response.authenticatorData)),
        signature: Array.from(new Uint8Array(assertion.response.signature)),
        userHandle: assertion.response.userHandle
          ? Array.from(new Uint8Array(assertion.response.userHandle))
          : null,
      },
      authenticatedAt: new Date().toISOString(),
    };

    console.log('✅ Passkey autenticada exitosamente:', assertion.id);

    return { success: true, assertion: serializedAssertion };
  } catch (error) {
    console.error('❌ Error autenticando con passkey:', error);

    // Manejo específico de errores comunes
    if (error.name === 'NotSupportedError') {
      throw new Error(
        'Tu dispositivo no soporta passkeys. Intenta con otro método de autenticación.'
      );
    } else if (error.name === 'NotAllowedError') {
      throw new Error('Autenticación con passkey cancelada por el usuario.');
    } else if (error.name === 'InvalidStateError') {
      throw new Error('No se encontraron passkeys válidas para este sitio.');
    } else {
      throw new Error(`Error al autenticar con passkey: ${error.message}`);
    }
  }
};

/**
 * Verificar si el navegador soporta WebAuthn
 * @returns {boolean} True si está soportado
 */
export const isWebAuthnSupported = () => {
  return (
    window.PublicKeyCredential &&
    window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
    typeof window.PublicKeyCredential === 'function'
  );
};

/**
 * Verificar si hay autenticadores disponibles
 * @returns {Promise<boolean>} True si hay autenticadores
 */
export const isPlatformAuthenticatorAvailable = async () => {
  if (!isWebAuthnSupported()) return false;

  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (error) {
    console.error('Error verificando autenticador:', error);
    return false;
  }
};

export default {
  getCurrentUser,
  getCurrentUserWithClaims,
  hasUserMigrationPermissions,
  logout,
  MIGRATION_ROLES,
  registerPasskey,
  signInWithPasskey,
  isWebAuthnSupported,
  isPlatformAuthenticatorAvailable,
};
