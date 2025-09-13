/**
 * Simple WebAuthn Service - Versión simplificada sin dependencias externas
 * Solo usa WebAuthn nativo y localStorage para almacenamiento
 */

const STORAGE_KEY = 'simple_webauthn_credentials';

/**
 * Configuración básica de WebAuthn
 */
const WEBAUTHN_CONFIG = {
  rpName: 'Forestech Simple Passkeys',
  rpId: window.location.hostname,
  userVerification: 'preferred',
  timeout: 60000,
};

/**
 * Utilidades para conversión Base64
 */
const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

const base64ToArrayBuffer = (base64) => {
  const binary = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Obtener credenciales guardadas
 */
const getStoredCredentials = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error obteniendo credenciales:', error);
    return [];
  }
};

/**
 * Guardar credenciales
 */
const saveCredentials = (credentials) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  } catch (error) {
    console.error('Error guardando credenciales:', error);
  }
};

/**
 * Verificar soporte de WebAuthn
 */
export const checkWebAuthnSupport = () => {
  return typeof window !== 'undefined' && !!window.PublicKeyCredential;
};

/**
 * Registrar una nueva passkey
 */
export const registerPasskey = async (userName = 'Usuario') => {
  try {
    if (!checkWebAuthnSupport()) {
      throw new Error('WebAuthn no es soportado en este navegador');
    }

    // Generar challenge aleatorio
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    // Crear ID único para el usuario
    const userId = crypto.getRandomValues(new Uint8Array(16));

    const publicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: WEBAUTHN_CONFIG.rpName,
        id: WEBAUTHN_CONFIG.rpId,
      },
      user: {
        id: userId,
        name: userName,
        displayName: userName,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'preferred',
        requireResidentKey: false,
      },
      timeout: WEBAUTHN_CONFIG.timeout,
      attestation: 'direct',
    };

    console.log('Solicitando creación de credencial...');

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });

    if (!credential) {
      throw new Error('No se pudo crear la credencial');
    }

    // Guardar la credencial
    const credentialData = {
      id: credential.id,
      rawId: arrayBufferToBase64(credential.rawId),
      publicKey: arrayBufferToBase64(credential.response.publicKey),
      userName,
      createdAt: new Date().toISOString(),
      counter: 0,
    };

    const credentials = getStoredCredentials();
    credentials.push(credentialData);
    saveCredentials(credentials);

    console.log('Passkey registrada exitosamente');

    return {
      success: true,
      message: '¡Passkey registrada exitosamente!',
      credential: credentialData,
    };

  } catch (error) {
    console.error('Error registrando passkey:', error);

    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Autenticar con passkey
 */
export const authenticateWithPasskey = async () => {
  try {
    if (!checkWebAuthnSupport()) {
      throw new Error('WebAuthn no es soportado en este navegador');
    }

    const credentials = getStoredCredentials();
    if (credentials.length === 0) {
      throw new Error('No hay passkeys registradas');
    }

    // Generar challenge
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    const publicKeyCredentialRequestOptions = {
      challenge,
      timeout: WEBAUTHN_CONFIG.timeout,
      rpId: WEBAUTHN_CONFIG.rpId,
      userVerification: WEBAUTHN_CONFIG.userVerification,
      // allowCredentials se puede agregar si queremos especificar credenciales
    };

    console.log('Solicitando autenticación...');

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    if (!assertion) {
      throw new Error('No se pudo obtener la credencial');
    }

    // Verificar que la credencial existe en nuestro almacenamiento
    const credentialId = assertion.id;
    const storedCredential = credentials.find(c => c.id === credentialId);

    if (!storedCredential) {
      throw new Error('Credencial no reconocida');
    }

    // Actualizar contador de uso
    storedCredential.lastUsed = new Date().toISOString();
    storedCredential.counter = (storedCredential.counter || 0) + 1;
    saveCredentials(credentials);

    console.log('Autenticación exitosa');

    return {
      success: true,
      message: '¡Autenticación exitosa!',
      userName: storedCredential.userName,
    };

  } catch (error) {
    console.error('Error autenticando:', error);

    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

/**
 * Obtener passkeys registradas
 */
export const getRegisteredPasskeys = () => {
  return getStoredCredentials();
};

/**
 * Eliminar todas las passkeys
 */
export const clearAllPasskeys = () => {
  localStorage.removeItem(STORAGE_KEY);
  return { success: true, message: 'Todas las passkeys eliminadas' };
};

/**
 * Convertir errores técnicos en mensajes amigables
 */
const getErrorMessage = (error) => {
  const message = error.message || '';

  if (message.includes('not supported') || error.name === 'NotSupportedError') {
    return 'Tu dispositivo no soporta passkeys';
  }

  if (message.includes('not allowed') || error.name === 'NotAllowedError') {
    return 'Operación cancelada o no autorizada';
  }

  if (message.includes('timeout') || error.name === 'TimeoutError') {
    return 'Tiempo de espera agotado';
  }

  return message || 'Error desconocido';
};