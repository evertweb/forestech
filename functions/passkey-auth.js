/**
 * Passkey Authentication Functions
 * Funciones para manejar autenticación con passkeys usando custom tokens
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions/v2';

// Inicializar Firebase Admin solo si no está ya inicializado
let app;
if (getApps().length === 0) {
  app = initializeApp();
} else {
  app = getApps()[0];
}

const db = getFirestore(app);
const auth = getAuth(app);

/**
 * Genera un custom token para un usuario verificado por passkey
 */
export const generatePasskeyToken = onCall(async (request) => {
  try {
    const { credentialId, challenge } = request.data;

    if (!credentialId) {
      throw new HttpsError('invalid-argument', 'credentialId es requerido');
    }

    console.log('🔐 Generando token para passkey:', credentialId);

    // 1. Buscar credencial en Firestore
    const credentialRef = db.collection('passkey_credentials').doc(credentialId);
    const credentialDoc = await credentialRef.get();

    if (!credentialDoc.exists) {
      throw new HttpsError('not-found', 'Credencial de passkey no encontrada');
    }

    const credentialData = credentialDoc.data();
    const userId = credentialData.userId;

    console.log('✅ Credencial encontrada para usuario:', userId);

    // 2. Buscar información del usuario
    const userRef = db.collection('passkey_users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'Usuario no encontrado');
    }

    const userData = userDoc.data();

    // 3. Generar custom token usando una configuración alternativa para evitar problemas de permisos
    let customToken;
    try {
      // Usar createCustomToken con configuración básica
      customToken = await auth.createCustomToken(userId, {
        passkey: true,
        credentialId: credentialId,
        loginMethod: 'passkey',
        timestamp: Date.now()
      });
      
      console.log('✅ Custom token generado exitosamente');
    } catch (authError) {
      console.error('❌ Error generando custom token:', authError);
      
      // Si falla, intentar con configuración mínima
      try {
        customToken = await auth.createCustomToken(userId);
        console.log('✅ Custom token básico generado como fallback');
      } catch (fallbackError) {
        console.error('❌ Error en fallback de custom token:', fallbackError);
        throw new HttpsError('internal', 'Error generando token de autenticación. Configuración de permisos requerida.');
      }
    }

    console.log('✅ Custom token generado exitosamente para usuario:', userId);

    // 4. Obtener información del usuario de Firebase Auth si es posible
    let userInfo = {
      uid: userId,
      email: userData.email,
      displayName: userData.displayName || userData.email
    };

    try {
      const userRecord = await auth.getUser(userId);
      userInfo = {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName || userRecord.email
      };
    } catch (userError) {
      console.log('⚠️ No se pudo obtener información completa del usuario, usando datos de passkey');
    }

    return {
      success: true,
      customToken,
      user: userInfo
    };

  } catch (error) {
    logger.error('❌ Error generando passkey token:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Error interno del servidor');
  }
});

/**
 * Verificar si un usuario tiene passkeys registradas (público)
 */
export const checkUserPasskeys = onCall(async (request) => {
  try {
    const { email } = request.data;

    if (!email) {
      throw new HttpsError('invalid-argument', 'email es requerido');
    }

    // Buscar usuario por email
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch (error) {
      return { hasPasskeys: false, reason: 'user_not_found' };
    }

    // Verificar si tiene passkeys
    const userDoc = await db.collection('passkey_users').doc(userRecord.uid).get();
    
    if (userDoc.exists && userDoc.data().hasPasskeys) {
      return { 
        hasPasskeys: true, 
        uid: userRecord.uid,
        displayName: userRecord.displayName 
      };
    }

    return { hasPasskeys: false, reason: 'no_passkeys' };

  } catch (error) {
    logger.error('❌ Error verificando passkeys:', error);
    throw new HttpsError('internal', 'Error verificando passkeys');
  }
});