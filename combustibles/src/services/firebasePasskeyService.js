/**
 * Firebase Passkey Service - Integración de WebAuthn nativo con Firebase
 * Combina simpleWebAuthnService con Firebase Auth y Firestore
 */

import { auth, db } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  updateProfile 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import {
  registerPasskey as registerPasskeyNative,
  authenticateWithPasskey as authenticatePasskeyNative,
  checkWebAuthnSupport,
  getRegisteredPasskeys as getLocalPasskeys,
  clearAllPasskeys as clearLocalPasskeys
} from '../services/simpleWebAuthnService';

// Inicializar Firebase Functions
const functions = getFunctions();
const generatePasskeyTokenFn = httpsCallable(functions, 'generatePasskeyToken');
const checkUserPasskeysFn = httpsCallable(functions, 'checkUserPasskeys');

/**
 * Colecciones de Firestore para passkeys
 */
const COLLECTIONS = {
  PASSKEY_USERS: 'passkey_users',
  PASSKEY_CREDENTIALS: 'passkey_credentials'
};

/**
 * Verificar si el usuario actual tiene passkeys registradas
 */
export const checkUserHasPasskeys = async () => {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return {
        hasPasskeys: false,
        reason: 'no_user',
        message: 'Usuario no autenticado'
      };
    }

    console.log('🔐 Verificando passkeys para usuario:', currentUser.uid);

    // Verificar en Firestore
    const userDoc = await getDoc(doc(db, COLLECTIONS.PASSKEY_USERS, currentUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        hasPasskeys: userData.hasPasskeys || false,
        userData,
        message: userData.hasPasskeys ? 'Usuario tiene passkeys registradas' : 'Usuario no tiene passkeys'
      };
    }

    return {
      hasPasskeys: false,
      reason: 'no_passkeys',
      message: 'Usuario no tiene passkeys registradas'
    };

  } catch (error) {
    console.error('❌ Error verificando passkeys:', error);
    return {
      hasPasskeys: false,
      reason: 'error',
      message: 'Error verificando passkeys: ' + error.message,
      error
    };
  }
};

/**
 * Registrar passkey para el usuario actual autenticado
 */
export const registerPasskeyForUser = async () => {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('Usuario no autenticado. Inicia sesión primero.');
    }

    if (!checkWebAuthnSupport()) {
      throw new Error('WebAuthn no es soportado en este navegador');
    }

    console.log('🔐 Registrando passkey para usuario:', currentUser.uid);

    // 1. Registrar passkey usando el servicio nativo
    const displayName = currentUser.displayName || currentUser.email || 'Usuario Forestech';
    const passkeyResult = await registerPasskeyNative(displayName);

    if (!passkeyResult.success) {
      throw new Error(passkeyResult.error);
    }

    // 2. Guardar información en Firestore
    const passkeyData = {
      id: passkeyResult.credential.id,
      rawId: passkeyResult.credential.rawId,
      publicKey: passkeyResult.credential.publicKey,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      displayName,
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      counter: 0
    };

    // Guardar credencial
    await setDoc(doc(db, COLLECTIONS.PASSKEY_CREDENTIALS, passkeyResult.credential.id), passkeyData);

    // Marcar usuario como teniendo passkeys
    await setDoc(doc(db, COLLECTIONS.PASSKEY_USERS, currentUser.uid), {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName,
      hasPasskeys: true,
      passkeyCreatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }, { merge: true });

    console.log('✅ Passkey registrada exitosamente en Firebase');

    return {
      success: true,
      message: '¡Passkey registrada exitosamente! Ahora puedes usarla para iniciar sesión.',
      credential: passkeyData
    };

  } catch (error) {
    console.error('❌ Error registrando passkey:', error);
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
};

/**
 * Autenticar usuario usando passkey (flujo completo con login automático)
 */
export const authenticateWithPasskey = async () => {
  try {
    if (!checkWebAuthnSupport()) {
      throw new Error('WebAuthn no es soportado en este navegador');
    }

    console.log('🔐 Iniciando autenticación completa con passkey...');

    // 1. Usar el servicio nativo para obtener la credencial local
    const authResult = await authenticatePasskeyNative();

    if (!authResult.success) {
      throw new Error(authResult.error);
    }

    console.log('✅ Credencial verificada localmente');

    // 2. Obtener información local de la credencial para buscar el ID
    const localPasskeys = getLocalPasskeys();
    const matchingPasskey = localPasskeys.find(p => p.userName === authResult.userName);

    if (!matchingPasskey) {
      throw new Error('No se encontró información local de la passkey');
    }

    const credentialId = matchingPasskey.id;
    console.log('🔍 Buscando credencial en Firebase:', credentialId);

    // 3. Llamar a Firebase Function para generar custom token
    try {
      const result = await generatePasskeyTokenFn({ 
        credentialId: credentialId,
        challenge: Date.now().toString() // Simple challenge
      });

      if (!result.data.success) {
        throw new Error('Error generando token de autenticación');
      }

      console.log('✅ Custom token generado exitosamente');

      // 4. Hacer login con el custom token
      const userCredential = await signInWithCustomToken(auth, result.data.customToken);
      
      console.log('✅ Login automático exitoso!');

      return {
        success: true,
        message: `¡Bienvenido, ${result.data.user.displayName || result.data.user.email}! Autenticación con passkey exitosa.`,
        user: userCredential.user,
        loginMethod: 'passkey'
      };

    } catch (firebaseError) {
      console.error('❌ Error en Firebase Function:', firebaseError);
      
      // Fallback: mostrar mensaje de éxito temporal
      return {
        success: true,
        message: `¡Passkey verificada exitosamente para ${authResult.userName}! 
                  (Login automático en desarrollo - usa email/contraseña para acceder)`,
        userName: authResult.userName,
        temporaryAuth: true,
        fallback: true
      };
    }

  } catch (error) {
    console.error('❌ Error autenticando con passkey:', error);
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
};

/**
 * Eliminar passkeys del usuario actual
 */
export const removeUserPasskeys = async () => {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    console.log('🗑️ Eliminando passkeys para usuario:', currentUser.uid);

    // 1. Buscar y eliminar credenciales del usuario
    const credentialsQuery = query(
      collection(db, COLLECTIONS.PASSKEY_CREDENTIALS),
      where('userId', '==', currentUser.uid)
    );
    
    const credentialDocs = await getDocs(credentialsQuery);
    
    // Eliminar cada credencial
    for (const credDoc of credentialDocs.docs) {
      await deleteDoc(credDoc.ref);
    }

    // 2. Actualizar usuario para marcar que no tiene passkeys
    await updateDoc(doc(db, COLLECTIONS.PASSKEY_USERS, currentUser.uid), {
      hasPasskeys: false,
      passkeyRemovedAt: new Date().toISOString()
    });

    // 3. Limpiar passkeys locales también
    clearLocalPasskeys();

    console.log('✅ Passkeys eliminadas exitosamente');

    return {
      success: true,
      message: 'Passkeys eliminadas exitosamente'
    };

  } catch (error) {
    console.error('❌ Error eliminando passkeys:', error);
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
};

/**
 * Obtener información de passkeys del usuario
 */
export const getUserPasskeyInfo = async () => {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return { hasPasskeys: false, message: 'Usuario no autenticado' };
    }

    const userDoc = await getDoc(doc(db, COLLECTIONS.PASSKEY_USERS, currentUser.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // También obtener información de credenciales
      const credentialsQuery = query(
        collection(db, COLLECTIONS.PASSKEY_CREDENTIALS),
        where('userId', '==', currentUser.uid)
      );
      
      const credentialDocs = await getDocs(credentialsQuery);
      const credentials = credentialDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        hasPasskeys: userData.hasPasskeys || false,
        userData,
        credentials,
        localPasskeys: getLocalPasskeys() // También incluir passkeys locales
      };
    }

    return { hasPasskeys: false, message: 'Usuario no encontrado' };

  } catch (error) {
    console.error('❌ Error obteniendo info de passkeys:', error);
    return { hasPasskeys: false, error: error.message };
  }
};

/**
 * Verificar soporte de WebAuthn
 */
export const isWebAuthnSupported = () => {
  return checkWebAuthnSupport();
};

/**
 * Convertir errores técnicos en mensajes amigables
 */
const getErrorMessage = (error) => {
  const message = error.message || '';

  if (message.includes('not supported') || error.name === 'NotSupportedError') {
    return 'Tu dispositivo no soporta passkeys. Usa Touch ID, Face ID o Windows Hello.';
  }

  if (message.includes('not allowed') || error.name === 'NotAllowedError') {
    return 'Operación cancelada. Por favor, intenta nuevamente.';
  }

  if (message.includes('timeout') || error.name === 'TimeoutError') {
    return 'Tiempo de espera agotado. Intenta nuevamente.';
  }

  if (message.includes('not found')) {
    return 'Passkey no encontrada. Esta passkey no está registrada en tu cuenta.';
  }

  if (message.includes('not authenticated')) {
    return 'Debes iniciar sesión primero para gestionar passkeys.';
  }

  return message || 'Error desconocido';
};