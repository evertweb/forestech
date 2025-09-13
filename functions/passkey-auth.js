/**
 * Passkey Authentication Functions
 * Funciones para manejar autenticación con passkeys usando custom tokens
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions/v2';
import * as functions from 'firebase-functions';

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

/**
 * Registrar rostro para autenticación facial
 */
export const registerFace = onCall(async (request) => {
  try {
    // Importar dinámicamente para evitar problemas de carga
    const { RekognitionClient, IndexFacesCommand, CreateCollectionCommand } = await import('@aws-sdk/client-rekognition');
    
    const { imageBase64, uid } = request.data;

    if (!imageBase64 || !uid) {
      throw new HttpsError('invalid-argument', 'imageBase64 y uid son requeridos');
    }

    console.log('📸 Registrando rostro para usuario:', uid);

    // Verificar que el usuario existe
    try {
      await auth.getUser(uid);
    } catch (error) {
      throw new HttpsError('not-found', 'Usuario no encontrado');
    }

    // Configurar cliente AWS
    const rekognitionClient = new RekognitionClient({
      region: functions.config().aws?.region || 'us-east-1',
      credentials: {
        accessKeyId: functions.config().aws?.access_key_id,
        secretAccessKey: functions.config().aws?.secret_access_key,
      },
    });

    // Convertir base64 a buffer
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    // Crear colección si no existe
    try {
      await rekognitionClient.send(new CreateCollectionCommand({
        CollectionId: 'users'
      }));
      console.log('✅ Colección users creada');
    } catch (error) {
      if (error.name !== 'ResourceAlreadyExistsException') {
        console.warn('⚠️ Error creando colección (puede que ya exista):', error.message);
      }
    }

    // Indexar el rostro
    const indexCommand = new IndexFacesCommand({
      CollectionId: 'users',
      Image: {
        Bytes: imageBuffer
      },
      ExternalImageId: uid, // Usar uid como identificador externo
      MaxFaces: 1,
      QualityFilter: 'AUTO'
    });

    const indexResponse = await rekognitionClient.send(indexCommand);

    if (!indexResponse.FaceRecords || indexResponse.FaceRecords.length === 0) {
      throw new HttpsError('failed-precondition', 'No se detectó ningún rostro en la imagen');
    }

    const faceId = indexResponse.FaceRecords[0].Face.FaceId;

    // Guardar la relación uid -> faceId en Firestore
    await db.collection('facial_auth').doc(uid).set({
      faceId: faceId,
      registeredAt: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    }, { merge: true });

    console.log('✅ Rostro registrado exitosamente:', faceId);

    return {
      success: true,
      faceId: faceId,
      message: 'Rostro registrado correctamente'
    };

  } catch (error) {
    logger.error('❌ Error registrando rostro:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Error interno del servidor');
  }
});

/**
 * Autenticar usando reconocimiento facial
 */
export const loginFace = onCall(async (request) => {
  try {
    // Importar dinámicamente para evitar problemas de carga
    const { RekognitionClient, SearchFacesByImageCommand } = await import('@aws-sdk/client-rekognition');
    
    const { imageBase64 } = request.data;
    const minSimilarity = parseFloat(functions.config().facial?.min_similarity) || 90.0;

    if (!imageBase64) {
      throw new HttpsError('invalid-argument', 'imageBase64 es requerido');
    }

    console.log('🔍 Buscando coincidencia facial, similitud mínima:', minSimilarity);

    // Configurar cliente AWS
    const rekognitionClient = new RekognitionClient({
      region: functions.config().aws?.region || 'us-east-1',
      credentials: {
        accessKeyId: functions.config().aws?.access_key_id,
        secretAccessKey: functions.config().aws?.secret_access_key,
      },
    });

    // Convertir base64 a buffer
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    // Buscar rostros similares
    const searchCommand = new SearchFacesByImageCommand({
      CollectionId: 'users',
      Image: {
        Bytes: imageBuffer
      },
      MaxFaces: 1,
      FaceMatchThreshold: minSimilarity
    });

    const searchResponse = await rekognitionClient.send(searchCommand);

    if (!searchResponse.FaceMatches || searchResponse.FaceMatches.length === 0) {
      console.log('❌ No se encontró coincidencia facial');
      return {
        success: false,
        error: 'Face not recognized'
      };
    }

    const faceMatch = searchResponse.FaceMatches[0];
    const similarity = faceMatch.Similarity;
    const faceId = faceMatch.Face.FaceId;

    console.log('✅ Coincidencia encontrada:', faceId, 'Similitud:', similarity);

    // Buscar el uid correspondiente en Firestore
    const facialAuthQuery = await db.collection('facial_auth')
      .where('faceId', '==', faceId)
      .limit(1)
      .get();

    if (facialAuthQuery.empty) {
      console.log('❌ FaceId no encontrado en base de datos');
      return {
        success: false,
        error: 'Face not recognized'
      };
    }

    const facialDoc = facialAuthQuery.docs[0];
    const uid = facialDoc.id;

    // Actualizar lastUsed
    await facialDoc.ref.update({
      lastUsed: new Date().toISOString()
    });

    // Generar custom token para el usuario
    const customToken = await auth.createCustomToken(uid, {
      facial: true,
      similarity: similarity,
      loginMethod: 'facial',
      timestamp: Date.now()
    });

    console.log('✅ Autenticación facial exitosa para usuario:', uid);

    return {
      success: true,
      uid: uid,
      similarity: similarity,
      customToken: customToken
    };

  } catch (error) {
    logger.error('❌ Error en autenticación facial:', error);
    
    if (error instanceof HttpsError) {
      throw error;
    }
    
    throw new HttpsError('internal', 'Error interno del servidor');
  }
});