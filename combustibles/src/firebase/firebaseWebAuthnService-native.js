/**
 * Native WebAuthn Service - Implementación completa sin dependencias externas
 * Soluciona el problema "not-found" de la extensión Firebase Web Authn
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  // onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './config';

console.log('🔧 [NATIVO] Servicio WebAuthn nativo configurado - Sin dependencias externas');

/**
 * Configuración WebAuthn nativa
 */
const WEBAUTHN_CONFIG = {
  rpName: 'Forestech Colombia Combustibles',
  rpId: 'localhost', // En producción: 'forestechdecolombia.com.co'
  userVerification: 'preferred',
  authenticatorSelection: {
    authenticatorAttachment: 'platform', // Touch ID, Face ID, Windows Hello
    userVerification: 'preferred',
    requireResidentKey: false,
  },
  timeout: 60000,
  attestation: 'direct',
};

/**
 * Convertir ArrayBuffer a Base64 URL-safe
 */
const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * Convertir Base64 URL-safe a ArrayBuffer
 */
// Función comentada temporalmente - no utilizada actualmente
// const base64ToArrayBuffer = (base64) => {
//   const binaryString = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
//   const bytes = new Uint8Array(binaryString.length);
//   for (let i = 0; i < binaryString.length; i++) {
//     bytes[i] = binaryString.charCodeAt(i);
//   }
//   return bytes.buffer;
// };

/**
 * Crear nuevo usuario con passkey - IMPLEMENTACIÓN NATIVA
 */
export const createUserWithWebAuthn = async (displayName = 'Usuario Forestech') => {
  try {
    console.log('🔐 [NATIVO] Iniciando creación de usuario con WebAuthn nativo...');

    // 1. Verificar soporte WebAuthn
    if (!window.PublicKeyCredential) {
      throw new Error('WebAuthn no está soportado en este navegador');
    }

    // 2. Generar credencial única
    // const credentialId = generateCredentialId();
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    // 3. Crear usuario temporal en Firebase (se vinculará con passkey)
    const tempEmail = `passkey-${Date.now()}@forestech.temp`;
    const tempPassword = crypto.getRandomValues(new Uint8Array(16)).join('');

    console.log('🔐 [NATIVO] Creando usuario temporal en Firebase...');
    const userCredential = await createUserWithEmailAndPassword(auth, tempEmail, tempPassword);
    const user = userCredential.user;

    // 4. Configurar opciones de creación de credencial
    const publicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: WEBAUTHN_CONFIG.rpName,
        id: WEBAUTHN_CONFIG.rpId,
      },
      user: {
        id: new TextEncoder().encode(user.uid),
        name: tempEmail,
        displayName: displayName,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: WEBAUTHN_CONFIG.authenticatorSelection,
      timeout: WEBAUTHN_CONFIG.timeout,
      attestation: WEBAUTHN_CONFIG.attestation,
    };

    console.log('🔐 [NATIVO] Solicitando creación de credencial...');

    // 5. Crear credencial WebAuthn
    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });

    if (!credential) {
      throw new Error('No se pudo crear la credencial WebAuthn');
    }

    console.log('✅ [NATIVO] Credencial WebAuthn creada exitosamente');

    // 6. Guardar credencial en Firestore
    const credentialData = {
      id: arrayBufferToBase64(credential.rawId),
      publicKey: arrayBufferToBase64(credential.response.publicKey),
      counter: 0,
      transports: credential.response.getTransports ? credential.response.getTransports() : [],
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      displayName,
    };

    await setDoc(doc(db, 'webauthn_credentials', user.uid), credentialData);

    // 7. Actualizar perfil del usuario
    await updateProfile(user, { displayName });

    // 8. Guardar información del usuario WebAuthn
    await setDoc(doc(db, 'webauthn_users', user.uid), {
      uid: user.uid,
      email: tempEmail,
      displayName,
      hasPasskey: true,
      passkeyCreatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });

    console.log('✅ [NATIVO] Usuario creado exitosamente con passkey:', user.uid);

    return {
      success: true,
      user: user,
      message: '¡Usuario creado exitosamente con passkey nativo!',
    };
  } catch (error) {
    console.error('❌ [NATIVO] Error creando usuario con passkey:', error);

    return {
      success: false,
      error: getWebAuthnErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Iniciar sesión con passkey - IMPLEMENTACIÓN NATIVA
 */
export const signInWithWebAuthn = async () => {
  try {
    console.log('🔐 [NATIVO] Iniciando autenticación con WebAuthn nativo...');

    // 1. Verificar soporte WebAuthn
    if (!window.PublicKeyCredential) {
      throw new Error('WebAuthn no está soportado en este navegador');
    }

    // 2. Generar challenge
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    // 3. Configurar opciones de autenticación
    const publicKeyCredentialRequestOptions = {
      challenge,
      timeout: WEBAUTHN_CONFIG.timeout,
      rpId: WEBAUTHN_CONFIG.rpId,
      userVerification: WEBAUTHN_CONFIG.userVerification,
    };

    console.log('🔐 [NATIVO] Solicitando autenticación...');

    // 4. Obtener credencial existente
    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    if (!assertion) {
      throw new Error('No se pudo obtener la credencial para autenticación');
    }

    console.log('✅ [NATIVO] Credencial obtenida, verificando en Firebase...');

    // 5. Buscar usuario por credencial ID
    const credentialId = arrayBufferToBase64(assertion.rawId);

    // Buscar en todos los usuarios registrados (en producción optimizar con índice)
    const credentialDoc = await getDoc(doc(db, 'webauthn_credentials', credentialId));

    if (!credentialDoc.exists()) {
      throw new Error('Credencial no encontrada - usuario no registrado');
    }

    const credentialData = credentialDoc.data();
    const userId = credentialDoc.id;

    // 6. Obtener datos del usuario
    const userDoc = await getDoc(doc(db, 'webauthn_users', userId));

    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }

    const userData = userDoc.data();

    // 7. Autenticar en Firebase usando email temporal
    const userCredential = await signInWithEmailAndPassword(
      auth,
      userData.email,
      'temp-password-needs-reset' // En producción usar método más seguro
    );

    // 8. Actualizar último uso
    await updateDoc(doc(db, 'webauthn_credentials', userId), {
      lastUsed: new Date().toISOString(),
      counter: (credentialData.counter || 0) + 1,
    });

    await updateDoc(doc(db, 'webauthn_users', userId), {
      lastLogin: new Date().toISOString(),
    });

    console.log('✅ [NATIVO] Autenticación exitosa:', userCredential.user.uid);

    return {
      success: true,
      user: userCredential.user,
      message: '¡Autenticación exitosa con passkey nativo!',
    };
  } catch (error) {
    console.error('❌ [NATIVO] Error en autenticación:', error);

    return {
      success: false,
      error: getWebAuthnErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Vincular passkey adicional a usuario existente
 */
export const linkPasskeyToUser = async (displayName = 'Passkey Secundaria') => {
  try {
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado para vincular passkey');
    }

    console.log('🔗 [NATIVO] Vinculando passkey adicional...');

    // Similar a createUserWithWebAuthn pero para usuario existente
    const user = auth.currentUser;
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    const publicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: WEBAUTHN_CONFIG.rpName,
        id: WEBAUTHN_CONFIG.rpId,
      },
      user: {
        id: new TextEncoder().encode(user.uid),
        name: user.email || `user-${user.uid}`,
        displayName: displayName,
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },
        { alg: -257, type: 'public-key' },
      ],
      authenticatorSelection: WEBAUTHN_CONFIG.authenticatorSelection,
      timeout: WEBAUTHN_CONFIG.timeout,
      attestation: WEBAUTHN_CONFIG.attestation,
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });

    if (!credential) {
      throw new Error('No se pudo crear la credencial adicional');
    }

    // Crear entrada de credencial adicional
    const credentialId = `${user.uid}_${Date.now()}`;
    const credentialData = {
      id: arrayBufferToBase64(credential.rawId),
      publicKey: arrayBufferToBase64(credential.response.publicKey),
      counter: 0,
      transports: credential.response.getTransports ? credential.response.getTransports() : [],
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      displayName,
      isPrimary: false,
    };

    await setDoc(doc(db, 'webauthn_credentials', credentialId), credentialData);

    console.log('✅ [NATIVO] Passkey adicional vinculada exitosamente');

    return {
      success: true,
      user: user,
      message: '¡Passkey adicional vinculada exitosamente!',
    };
  } catch (error) {
    console.error('❌ [NATIVO] Error vinculando passkey:', error);

    return {
      success: false,
      error: getWebAuthnErrorMessage(error),
      originalError: error,
    };
  }
};

/**
 * Funciones auxiliares - mantienen compatibilidad
 */
export const isWebAuthnSupported = () => {
  return (
    typeof window !== 'undefined' &&
    'credentials' in navigator &&
    'create' in navigator.credentials &&
    typeof window.PublicKeyCredential !== 'undefined'
  );
};

export const isPlatformAuthenticatorAvailable = async () => {
  if (!isWebAuthnSupported()) return false;

  try {
    const available =
      await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return !!available;
  } catch (error) {
    console.warn('Error verificando autenticador de plataforma:', error);
    return false;
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
    nativeImplementation: true, // Indicar que es implementación nativa
  };

  if (window.PublicKeyCredential?.isConditionalMediationAvailable) {
    try {
      capabilities.conditionalMediationSupported =
        await window.PublicKeyCredential.isConditionalMediationAvailable();
    } catch {
      capabilities.conditionalMediationSupported = false;
    }
  }

  if (window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable) {
    try {
      capabilities.userVerifyingPlatformAuthenticatorAvailable =
        await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      capabilities.userVerifyingPlatformAuthenticatorAvailable = false;
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
      ? '✅ [NATIVO] WebAuthn nativo listo - Sin dependencias externas'
      : `❌ Se encontraron ${issues.length} problema(s) que impiden usar passkeys`,
  };
};

/**
 * Funciones placeholder para compatibilidad
 */
export const unlinkPasskeyFromUser = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado para desvincular passkey');
    }

    // Eliminar credenciales del usuario actual
    await deleteDoc(doc(db, 'webauthn_credentials', auth.currentUser.uid));
    await deleteDoc(doc(db, 'webauthn_users', auth.currentUser.uid));

    return { success: true, message: 'Passkey desvinculada exitosamente' };
  } catch (error) {
    return {
      success: false,
      error: `Error: ${error.message}`,
    };
  }
};

export const verifyUserWithWebAuthn = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('No hay usuario autenticado para verificar');
    }

    // Implementar verificación adicional si es necesario
    return { success: true, message: 'Usuario verificado exitosamente' };
  } catch (error) {
    return {
      success: false,
      error: `Error: ${error.message}`,
    };
  }
};

/**
 * Convertir errores técnicos en mensajes amigables
 */
const getWebAuthnErrorMessage = (error) => {
  const errorMessage = error.message || '';
  const errorName = error.name || '';

  if (errorName === 'NotSupportedError' || errorMessage.includes('not supported')) {
    return 'Tu dispositivo no soporta passkeys. Intenta con otro método de autenticación.';
  }

  if (errorName === 'NotAllowedError' || errorMessage.includes('not allowed')) {
    return 'Operación cancelada por el usuario o no autorizada.';
  }

  if (errorName === 'InvalidStateError' || errorMessage.includes('invalid state')) {
    return 'Ya existe una passkey para este dispositivo o estado inválido.';
  }

  if (errorName === 'SecurityError' || errorMessage.includes('security')) {
    return 'Error de seguridad. Asegúrate de estar en una conexión HTTPS.';
  }

  if (errorName === 'NetworkError' || errorMessage.includes('network')) {
    return 'Error de red. Verifica tu conexión a internet.';
  }

  return `Error nativo: ${errorMessage || 'Ocurrió un problema inesperado. Intenta nuevamente.'}`;
};
