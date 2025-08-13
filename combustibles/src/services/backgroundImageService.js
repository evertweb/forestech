/**
 * Servicio para gestionar la imagen de fondo del login desde Firebase Storage
 * combustibles/src/services/backgroundImageService.js
 */

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';
// eslint-disable-next-line no-unused-vars
import { getFirebaseErrorMessage, logFirebaseError } from './firebaseErrorHandler';

/**
 * Configuración de la imagen de fondo
 */
const BACKGROUND_CONFIG = {
  // Ruta en Firebase Storage donde se almacena la imagen
  storagePath: 'auth/login-background.jpg',

  // Imagen de fallback si no se puede cargar desde Firebase
  fallbackUrl: '/api/placeholder/1920/1080',

  // URLs de imágenes predeterminadas que se pueden usar (CORS compatible)
  defaultImages: [
    '/combustibles/assets/background-forest.svg', // Imagen SVG local de bosque
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZm9yZXN0LWJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNGI3OTg4IiAvPjxzdG9wIG9mZnNldD0iMzAlIiBzdG9wLWNvbG9yPSIjMzM2MzU5IiAvPjxzdG9wIG9mZnNldD0iNzAlIiBzdG9wLWNvbG9yPSIjMjE1NDMyIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFmMzIyZiIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2ZvcmVzdC1iZykiLz48L3N2Zz4=',
  ],
};

/**
 * Operación segura de Storage con manejo de errores mejorado
 */
const safeStorageOperation = async (operation, context = {}) => {
  try {
    const result = await operation();
    console.log(`✅ Storage operation successful:`, context);
    return { success: true, data: result };
  } catch (error) {
    const errorDetails = {
      ...context,
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
    };

    console.warn('⚠️ Storage operation failed:', errorDetails);

    // Categorizar el error para mejor troubleshooting
    if (error.message.includes('timeout')) {
      console.log('🔄 Timeout detected - will use fallback image');
    } else if (error.code === 'storage/object-not-found') {
      console.log('📁 Image not found in Storage - will use fallback');
    } else if (error.code === 'storage/unauthorized') {
      console.log('🔒 Storage access denied - check Firebase rules');
    }

    return { success: false, error: error.message, context: errorDetails };
  }
};

/**
 * Obtiene la URL de la imagen de fondo
 * @returns {Promise<string>} URL de la imagen
 */
export const getBackgroundImageUrl = async () => {
  const result = await safeStorageOperation(
    async () => {
      const imageRef = ref(storage, BACKGROUND_CONFIG.storagePath);
      const TIMEOUT_MS = Number(import.meta.env.VITE_BG_DOWNLOAD_TIMEOUT_MS) || 10000;

      const withTimeout = (promise, ms) => {
        return new Promise((resolve, reject) => {
          const id = setTimeout(
            () => reject(new Error(`Firebase Storage timeout after ${ms}ms`)),
            ms
          );
          promise
            .then((value) => {
              clearTimeout(id);
              resolve(value);
            })
            .catch((error) => {
              clearTimeout(id);
              reject(error);
            });
        });
      };

      console.log(`🔍 Obteniendo imagen de fondo desde Storage (timeout: ${TIMEOUT_MS}ms)...`);
      return await withTimeout(getDownloadURL(imageRef), TIMEOUT_MS);
    },
    {
      operation: 'get_background_image',
      storagePath: BACKGROUND_CONFIG.storagePath,
    }
  );

  if (result.success) {
    return result.data;
  }

  // Log específico para diagnóstico sin interrumpir UI
  console.warn(
    '⚠️ No se pudo obtener imagen de fondo desde Storage, usando fallback:',
    result.error
  );

  // Usar una imagen predeterminada aleatoria como fallback
  const randomIndex = Math.floor(Math.random() * BACKGROUND_CONFIG.defaultImages.length);
  const fallbackUrl = BACKGROUND_CONFIG.defaultImages[randomIndex];

  console.log('🔄 Usando imagen predeterminada como fallback:', fallbackUrl);
  return fallbackUrl;
};

/**
 * Sube una nueva imagen de fondo a Firebase Storage
 * @param {File} file - Archivo de imagen
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadBackgroundImage = async (file) => {
  // Validaciones locales primero
  if (!file.type.startsWith('image/')) {
    return {
      success: false,
      error: 'El archivo debe ser una imagen',
    };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      success: false,
      error: 'La imagen no puede superar los 5MB',
    };
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Formato no soportado. Use JPG, PNG o WebP',
    };
  }

  console.log('🔄 Subiendo imagen de fondo...', {
    name: file.name,
    size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
    type: file.type,
  });

  // Subir usando el manejador de errores seguro
  const result = await safeStorageOperation(
    async () => {
      const imageRef = ref(storage, BACKGROUND_CONFIG.storagePath);
      await uploadBytes(imageRef, file);
      return await getDownloadURL(imageRef);
    },
    {
      operation: 'upload_background_image',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    }
  );

  if (result.success) {
    return {
      success: true,
      url: result.data,
    };
  }

  return {
    success: false,
    error: result.error,
  };
};

/**
 * Preloader para optimizar la carga de la imagen
 * @param {string} url - URL de la imagen
 * @returns {Promise<boolean>} true si se cargó correctamente
 */
export const preloadBackgroundImage = (url) => {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      resolve(true);
    };

    img.onerror = () => {
      resolve(false);
    };

    img.src = url;
  });
};

// Hook personalizado para usar la imagen de fondo (requiere import de React en el componente)
// export const useBackgroundImage = () => {
//   const [imageUrl, setImageUrl] = React.useState(BACKGROUND_CONFIG.fallbackUrl);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);

//   React.useEffect(() => {
//     const loadImage = async () => {
//       try {
//         const url = await getBackgroundImageUrl();

//         // Precargar la imagen
//         const loaded = await preloadBackgroundImage(url);

//         if (loaded) {
//           setImageUrl(url);
//         } else {
//           setError('Error cargando imagen');
//         }
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadImage();
//   }, []);

//   return { imageUrl, loading, error };
// };

export default {
  getBackgroundImageUrl,
  uploadBackgroundImage,
  preloadBackgroundImage,
  BACKGROUND_CONFIG,
};
