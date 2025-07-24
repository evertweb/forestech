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
  
  // URLs de imágenes predeterminadas que se pueden usar
  defaultImages: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Bosque
    'https://images.unsplash.com/photo-1574263867128-6fbaa6ccbacd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Tanque combustible
    'https://images.unsplash.com/photo-1582718471137-d4b7a5c82d8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Industrial
    'https://images.unsplash.com/photo-1586810883395-3a5c2f6c84b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'  // Energía
  ]
};

/**
 * Obtiene la URL de la imagen de fondo
 * @returns {Promise<string>} URL de la imagen
 */
export const getBackgroundImageUrl = async () => {
  try {
    console.log('🔄 Intentando cargar imagen de fondo desde Firebase Storage...');
    console.log('📍 Ruta:', BACKGROUND_CONFIG.storagePath);
    
    // Intentar obtener la imagen desde Firebase Storage
    const imageRef = ref(storage, BACKGROUND_CONFIG.storagePath);
    const url = await getDownloadURL(imageRef);
    
    console.log('✅ Imagen de fondo cargada desde Firebase Storage');
    console.log('🔗 URL:', url);
    return url;
  } catch (error) {
    console.warn('⚠️ No se pudo cargar imagen de Firebase Storage:', {
      code: error.code,
      message: error.message,
      path: BACKGROUND_CONFIG.storagePath
    });
    
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
    
    console.log('✅ Archivo subido, obteniendo URL...', uploadResult.metadata);
    
    // Obtener URL de descarga
    const url = await getDownloadURL(imageRef);
    
    console.log('✅ Imagen de fondo subida exitosamente:', url);
    
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
  console.log('🔄 Precargando imagen de fondo:', url);
  
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      console.log('✅ Imagen de fondo precargada exitosamente');
      console.log('📐 Dimensiones:', `${img.naturalWidth}x${img.naturalHeight}px`);
      resolve(true);
    };
    
    img.onerror = (error) => {
      console.warn('⚠️ Error precargando imagen de fondo:', error);
      console.warn('🔗 URL problemática:', url);
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