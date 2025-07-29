/**
 * Servicio para gestionar la imagen de fondo del login desde Firebase Storage
 * combustibles/src/services/backgroundImageService.js
 */

import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';

const storage = getStorage();

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
    '/assets/background-forest.svg', // Imagen SVG local de bosque
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJmb3Jlc3QiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNGI3OTg4IiAvPgo8c3RvcCBvZmZzZXQ9IjMwJSIgc3RvcC1jb2xvcj0iIzMzNjM1OSIgLz4KPHN0b3Agb2Zmc2V0PSI3MCUiIHN0b3AtY29sb3I9IiMyMTU0MzIiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFmMzIyZiIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2ZvcmVzdCkiLz4KPC9zdmc+'
  ]
};

/**
 * Obtiene la URL de la imagen de fondo
 * @returns {Promise<string>} URL de la imagen
 */
export const getBackgroundImageUrl = async () => {
  try {
    // Intentar obtener la imagen desde Firebase Storage
    const imageRef = ref(storage, BACKGROUND_CONFIG.storagePath);
    const url = await getDownloadURL(imageRef);
    
    return url;
    
  } catch (error) {
    
    // Usar una imagen predeterminada aleatoria como fallback
    const randomIndex = Math.floor(Math.random() * BACKGROUND_CONFIG.defaultImages.length);
    const fallbackUrl = BACKGROUND_CONFIG.defaultImages[randomIndex];
    
    console.log('🔄 Usando imagen predeterminada como fallback:', fallbackUrl);
    return fallbackUrl;
  }
};

/**
 * Sube una nueva imagen de fondo a Firebase Storage
 * @param {File} file - Archivo de imagen
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadBackgroundImage = async (file) => {
  try {
    // Validar que es una imagen
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'El archivo debe ser una imagen'
      };
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'La imagen no puede superar los 5MB'
      };
    }

    // Validar formatos permitidos
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Formato no soportado. Use JPG, PNG o WebP'
      };
    }

    console.log('🔄 Subiendo imagen de fondo...', {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
      type: file.type
    });

    // Subir imagen a Firebase Storage
    const imageRef = ref(storage, BACKGROUND_CONFIG.storagePath);
    const uploadResult = await uploadBytes(imageRef, file);
    
    // Obtener URL de descarga
    const url = await getDownloadURL(imageRef);
    
    return {
      success: true,
      url: url
    };
    
  } catch (error) {
    console.error('❌ Error subiendo imagen de fondo:', error);
    
    // Mensajes de error más específicos
    let errorMessage = 'Error al subir la imagen';
    
    if (error.code === 'storage/unauthorized') {
      errorMessage = 'Sin permisos para subir imagen. Contacta al administrador.';
    } else if (error.code === 'storage/quota-exceeded') {
      errorMessage = 'Cuota de almacenamiento excedida';
    } else if (error.code === 'storage/invalid-format') {
      errorMessage = 'Formato de imagen no válido';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
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
    
    img.onerror = (error) => {
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
  BACKGROUND_CONFIG
};