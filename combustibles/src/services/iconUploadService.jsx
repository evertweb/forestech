/**
 * Servicio para subida y gestión de iconos personalizados
 * Utiliza Firebase Storage para almacenar imágenes de iconos
 */

import React from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '../firebase/config';

const ICONS_PATH = 'category-icons';
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

/**
 * Validar archivo de imagen
 * @param {File} file - Archivo a validar
 * @returns {Object} - {isValid: boolean, error?: string}
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No se ha seleccionado ningún archivo' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tipo de archivo no válido. Use JPG, PNG, GIF, WebP o SVG',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'El archivo es demasiado grande. Máximo 2MB',
    };
  }

  return { isValid: true };
};

/**
 * Redimensionar imagen antes de subirla
 * @param {File} file - Archivo de imagen
 * @param {number} maxSize - Tamaño máximo (ancho/alto)
 * @returns {Promise<Blob>} - Imagen redimensionada
 */
export const resizeImage = (file, maxSize = 128) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo proporción
      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir a blob
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        file.type,
        0.8
      ); // Calidad 80%
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Subir icono personalizado a Firebase Storage
 * @param {File} file - Archivo de imagen
 * @param {string} categoryId - ID de la categoría
 * @returns {Promise<string>} - URL de descarga del icono
 */
export const uploadCategoryIcon = async (file, categoryId) => {
  try {
    // Validar archivo
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Redimensionar imagen
    const resizedImage = await resizeImage(file, 128);

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${categoryId}_${timestamp}.${fileExtension}`;

    // Crear referencia de Storage
    const iconRef = ref(storage, `${ICONS_PATH}/${fileName}`);

    // Subir archivo
    const uploadTask = await uploadBytes(iconRef, resizedImage);

    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(uploadTask.ref);

    console.log('✅ Icono subido exitosamente:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('❌ Error subiendo icono:', error);
    throw new Error(`Error al subir icono: ${error.message}`);
  }
};

/**
 * Eliminar icono personalizado de Firebase Storage
 * @param {string} iconURL - URL del icono a eliminar
 * @returns {Promise<boolean>} - Éxito de la operación
 */
export const deleteCategoryIcon = async (iconURL) => {
  try {
    if (!iconURL || !iconURL.includes('firebase')) {
      return true; // No es un icono de Firebase, no hay nada que eliminar
    }

    // Extraer path del archivo desde la URL
    const url = new URL(iconURL);
    const pathMatch = url.pathname.match(/o\/(.+?)\?/);

    if (!pathMatch) {
      throw new Error('No se pudo extraer el path del archivo');
    }

    const filePath = decodeURIComponent(pathMatch[1]);
    const iconRef = ref(storage, filePath);

    // Eliminar archivo
    await deleteObject(iconRef);

    console.log('✅ Icono eliminado exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error eliminando icono:', error);
    // No lanzar error para no bloquear otras operaciones
    return false;
  }
};

/**
 * Listar todos los iconos de categorías
 * @returns {Promise<Array>} - Lista de URLs de iconos
 */
export const listCategoryIcons = async () => {
  try {
    const iconsRef = ref(storage, ICONS_PATH);
    const result = await listAll(iconsRef);

    const iconURLs = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          url: url,
          path: itemRef.fullPath,
        };
      })
    );

    return iconURLs;
  } catch (error) {
    console.error('❌ Error listando iconos:', error);
    return [];
  }
};

/**
 * Generar vista previa de imagen desde archivo
 * @param {File} file - Archivo de imagen
 * @returns {Promise<string>} - Data URL para vista previa
 */
export const generateImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      resolve(e.target.result);
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Verificar si una URL es un icono personalizado (de Firebase)
 * @param {string} iconURL - URL del icono
 * @returns {boolean} - True si es un icono personalizado
 */
export const isCustomIcon = (iconURL) => {
  return (
    iconURL &&
    (iconURL.includes('firebasestorage.googleapis.com') ||
      iconURL.includes('firebase') ||
      iconURL.startsWith('http'))
  );
};

/**
 * Renderizar icono (emoji o imagen personalizada)
 * @param {string} icon - Emoji o URL de imagen
 * @param {Object} props - Propiedades adicionales (className, style, etc.)
 * @returns {JSX.Element} - Elemento JSX para renderizar
 */
export const renderCategoryIcon = (icon, props = {}) => {
  if (isCustomIcon(icon)) {
    return (
      <img
        src={icon}
        alt="Icono de categoría"
        className={`category-custom-icon ${props.className || ''}`}
        style={{
          width: '1em',
          height: '1em',
          objectFit: 'contain',
          display: 'inline-block',
          verticalAlign: 'middle',
          ...props.style,
        }}
        width={16}
        height={16}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          // Fallback a emoji por defecto si falla la carga
          e.target.style.display = 'none';
          e.target.parentNode.insertAdjacentHTML('afterbegin', '🚗');
        }}
      />
    );
  }

  // Es un emoji
  return (
    <span className={props.className} style={props.style}>
      {icon}
    </span>
  );
};

export default {
  validateImageFile,
  resizeImage,
  uploadCategoryIcon,
  deleteCategoryIcon,
  listCategoryIcons,
  generateImagePreview,
  isCustomIcon,
  renderCategoryIcon,
};
