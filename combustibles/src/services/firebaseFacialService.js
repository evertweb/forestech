/**
 * Firebase Facial Recognition Service
 * Integración de AWS Rekognition con Firebase Auth
 *
 * USO:
 * 1. Registro: Llama registerFace() con una imagen del usuario autenticado
 * 2. Login: Llama loginWithFace() con una imagen para verificar identidad
 *
 * CONFIGURACIÓN EN FIREBASE FUNCTIONS:
 * - AWS credentials: functions.config().aws.access_key_id, secret_access_key, region
 * - Similitud mínima: functions.config().facial.min_similarity (default: 90.0)
 *
 * COLECCIÓN DE FIRESTORE:
 * - facial_auth: { uid, faceId, registeredAt, lastUsed }
 *
 * LIMITACIONES:
 * - Requiere HTTPS para acceso a cámara
 * - Solo una cara por usuario
 * - Imágenes deben ser JPG/PNG válidas
 */

import { auth } from '../firebase/config';
import { signInWithCustomToken } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Inicializar Firebase Functions
const functions = getFunctions();
const registerFaceFn = httpsCallable(functions, 'registerFace');
const loginFaceFn = httpsCallable(functions, 'loginFace');

/**
 * Convertir imagen a base64
 * @param {File|Blob} imageFile - Archivo de imagen
 * @returns {Promise<string>} - Base64 string
 */
export const imageToBase64 = (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]; // Remover el prefijo data:image/...
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });
};

/**
 * Registrar rostro para autenticación facial
 * @param {File|Blob} imageFile - Imagen del rostro
 * @returns {Promise<Object>} - Resultado del registro
 */
export const registerFace = async (imageFile) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    console.log('📸 Registrando rostro para usuario:', currentUser.uid);

    // Convertir imagen a base64
    const imageBase64 = await imageToBase64(imageFile);

    // Llamar a la función de Firebase
    const result = await registerFaceFn({
      imageBase64: imageBase64,
      uid: currentUser.uid
    });

    console.log('✅ Rostro registrado:', result.data);

    return result.data;
  } catch (error) {
    console.error('❌ Error registrando rostro:', error);
    throw error;
  }
};

/**
 * Autenticar usando reconocimiento facial
 * @param {File|Blob} imageFile - Imagen del rostro
 * @returns {Promise<Object>} - Resultado de la autenticación
 */
export const loginWithFace = async (imageFile) => {
  try {
    console.log('🔍 Iniciando autenticación facial');

    // Convertir imagen a base64
    const imageBase64 = await imageToBase64(imageFile);

    // Llamar a la función de Firebase
    const result = await loginFaceFn({
      imageBase64: imageBase64
    });

    const data = result.data;

    if (data.success && data.customToken) {
      console.log('✅ Autenticación facial exitosa, iniciando sesión...');

      // Iniciar sesión con el custom token
      const userCredential = await signInWithCustomToken(auth, data.customToken);

      return {
        success: true,
        user: userCredential.user,
        similarity: data.similarity,
        uid: data.uid
      };
    } else {
      console.log('❌ Autenticación facial fallida:', data.error);
      return {
        success: false,
        error: data.error || 'Face not recognized'
      };
    }
  } catch (error) {
    console.error('❌ Error en autenticación facial:', error);
    throw error;
  }
};

/**
 * Verificar soporte de reconocimiento facial
 * @returns {boolean} - Si el navegador soporta captura de imagen
 */
export const checkFacialSupport = () => {
  // Verificar soporte básico de media devices
  const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  // En desarrollo, ser más permisivo
  if (import.meta.env.DEV) {
    return hasMediaDevices;
  }

  // En producción, verificar contexto seguro
  const isSecureContext = window.location.protocol === 'https:' ||
                         window.location.hostname === 'localhost' ||
                         window.location.hostname === '127.0.0.1';

  return hasMediaDevices && isSecureContext;
};

/**
 * Capturar imagen desde webcam
 * @param {HTMLVideoElement} videoElement - Elemento video
 * @param {HTMLCanvasElement} canvasElement - Elemento canvas para captura
 * @returns {Promise<Blob>} - Imagen capturada como blob
 */
export const captureImageFromVideo = (videoElement, canvasElement) => {
  return new Promise((resolve, reject) => {
    try {
      const context = canvasElement.getContext('2d');
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      context.drawImage(videoElement, 0, 0);

      canvasElement.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Error capturando imagen'));
        }
      }, 'image/jpeg', 0.9);
    } catch (error) {
      reject(error);
    }
  });
};