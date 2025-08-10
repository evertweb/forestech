/**
 * BackgroundImageService - Servicio refactorizado para gestión de imágenes de fondo
 * Utiliza BaseService y CRUDService para operaciones optimizadas
 *
 * Funcionalidades:
 * - Gestión de imagen de fondo del login desde Firebase Storage
 * - Sistema de fallback con imágenes predeterminadas
 * - Cache local para optimizar carga de imágenes
 * - Upload y gestión de imágenes personalizadas
 * - Validación de formatos y tamaños de imagen
 *
 * Forestech Colombia - Combustibles App
 * @author AI Agent - TASK 1.2 BaseService Implementation
 * @date 2025-08-04
 */

import { CRUDService } from './base/CRUDService.js';
import { getStorage, ref, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';

/**
 * Configuración de la imagen de fondo
 */
const BACKGROUND_CONFIG = {
  // Ruta en Firebase Storage donde se almacena la imagen
  storagePath: 'auth/login-background.jpg',

  // Imagen de fallback si no se puede cargar desde Firebase
  fallbackUrl: '/api/placeholder/1920/1080',

  // URLs de imágenes predeterminadas CORS compatible
  defaultImages: [
    '/assets/background-forest.svg',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJmb3Jlc3QiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNGI3OTg4IiAvPgo8c3RvcCBvZmZzZXQ9IjMwJSIgc3RvcC1jb2xvcj0iIzMzNjM1OSIgLz4KPHN0b3Agb2Zmc2V0PSI3MCUiIHN0b3AtY29sb3I9IiMyMTU0MzIiIC8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFmMzIyZiIgLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2ZvcmVzdCkiLz4KPC9zdmc+',
  ],

  // Configuración de validación
  validation: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxDimensions: { width: 3840, height: 2160 }, // 4K
    minDimensions: { width: 1280, height: 720 }, // HD
  },
};

/**
 * Clase BackgroundImageService refactorizada
 */
class BackgroundImageService extends CRUDService {
  constructor() {
    super('background_image_logs', {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'createdAt',
      defaultOrderDirection: 'desc',
    });

    this.storage = getStorage();
    this.cache = new Map(); // Cache de URLs
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 horas
  }

  /**
   * Validación específica para logs de imágenes de fondo
   */
  validateData(data) {
    const baseValidation = super.validateData(data);
    if (!baseValidation.isValid) return baseValidation;

    const errors = [];

    if (data.action && !['upload', 'download', 'delete', 'error'].includes(data.action)) {
      errors.push('action debe ser: upload, download, delete, o error');
    }

    if (data.fileSize && typeof data.fileSize !== 'number') {
      errors.push('fileSize debe ser un número');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Procesar datos específicos de logs de imagen
   */
  processData(data, isUpdate = false) {
    const baseProcessed = super.processData(data, isUpdate);

    // Agregar metadatos específicos
    baseProcessed.userAgent =
      typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 200) : 'Unknown';

    return baseProcessed;
  }

  /**
   * Obtener URL de la imagen de fondo con cache
   */
  async getBackgroundImageUrl() {
    try {
      // Verificar cache primero
      const cacheKey = 'background_image_url';
      const cachedData = this.cache.get(cacheKey);

      if (cachedData && Date.now() - cachedData.timestamp < this.cacheExpiry) {
        this.log('URL de imagen obtenida desde cache');
        return {
          success: true,
          url: cachedData.url,
          fromCache: true,
        };
      }

      // Intentar obtener desde Firebase Storage
      this.log('Obteniendo imagen de fondo desde Firebase Storage');
      const imageRef = ref(this.storage, BACKGROUND_CONFIG.storagePath);
      const url = await getDownloadURL(imageRef);

      // Actualizar cache
      this.cache.set(cacheKey, {
        url,
        timestamp: Date.now(),
      });

      // Log del acceso exitoso
      await this.logImageAccess('download', url, 'success');

      this.log('Imagen de fondo obtenida exitosamente desde Firebase');

      return {
        success: true,
        url,
        fromCache: false,
      };
    } catch (error) {
      this.logError('Error obteniendo imagen de Firebase Storage', error);

      // Usar imagen predeterminada aleatoria como fallback
      const fallbackUrl = this.getRandomFallbackImage();

      // Log del fallback
      await this.logImageAccess('download', fallbackUrl, 'fallback', error.message);

      this.log('Usando imagen predeterminada como fallback', { url: fallbackUrl });

      return {
        success: true,
        url: fallbackUrl,
        fromCache: false,
        fallback: true,
        error: error.message,
      };
    }
  }

  /**
   * Obtener imagen predeterminada aleatoria
   */
  getRandomFallbackImage() {
    const randomIndex = Math.floor(Math.random() * BACKGROUND_CONFIG.defaultImages.length);
    return BACKGROUND_CONFIG.defaultImages[randomIndex];
  }

  /**
   * Subir nueva imagen de fondo
   */
  async uploadBackgroundImage(file, userId) {
    try {
      // Validar archivo
      const validation = this.validateImageFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Archivo inválido',
          errors: validation.errors,
        };
      }

      this.log(`Iniciando upload de imagen de fondo: ${file.name}`, {
        size: file.size,
        type: file.type,
        userId,
      });

      // Crear referencia en Storage
      const imageRef = ref(this.storage, BACKGROUND_CONFIG.storagePath);

      // Subir archivo
      const uploadResult = await uploadBytes(imageRef, file, {
        customMetadata: {
          uploadedBy: userId,
          uploadedAt: new Date().toISOString(),
          originalName: file.name,
        },
      });

      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Limpiar cache
      this.cache.clear();

      // Log del upload exitoso
      await this.logImageAccess('upload', downloadURL, 'success', null, {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userId,
      });

      this.log('Imagen de fondo subida exitosamente', {
        url: downloadURL,
        fileName: file.name,
        size: file.size,
      });

      return {
        success: true,
        url: downloadURL,
        fileName: file.name,
        fileSize: file.size,
      };
    } catch (error) {
      this.logError('Error subiendo imagen de fondo', error);

      // Log del error
      await this.logImageAccess('upload', null, 'error', error.message, {
        fileName: file?.name,
        fileSize: file?.size,
        userId,
      });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Validar archivo de imagen
   */
  validateImageFile(file) {
    const errors = [];
    const config = BACKGROUND_CONFIG.validation;

    // Verificar que existe el archivo
    if (!file) {
      errors.push('No se proporcionó archivo');
      return { isValid: false, errors };
    }

    // Verificar tamaño
    if (file.size > config.maxFileSize) {
      errors.push(
        `Archivo demasiado grande. Máximo: ${(config.maxFileSize / 1024 / 1024).toFixed(1)}MB`
      );
    }

    if (file.size === 0) {
      errors.push('Archivo vacío');
    }

    // Verificar formato
    if (!config.allowedFormats.includes(file.type)) {
      errors.push(`Formato no permitido. Formatos válidos: ${config.allowedFormats.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validar dimensiones de imagen (requiere cargar la imagen)
   */
  async validateImageDimensions(file) {
    return new Promise((resolve) => {
      const config = BACKGROUND_CONFIG.validation;
      const img = new Image();

      img.onload = () => {
        const errors = [];

        if (img.width < config.minDimensions.width || img.height < config.minDimensions.height) {
          errors.push(
            `Dimensiones muy pequeñas. Mínimo: ${config.minDimensions.width}x${config.minDimensions.height}`
          );
        }

        if (img.width > config.maxDimensions.width || img.height > config.maxDimensions.height) {
          errors.push(
            `Dimensiones muy grandes. Máximo: ${config.maxDimensions.width}x${config.maxDimensions.height}`
          );
        }

        resolve({
          isValid: errors.length === 0,
          errors,
          dimensions: { width: img.width, height: img.height },
        });
      };

      img.onerror = () => {
        resolve({
          isValid: false,
          errors: ['No se pudo cargar la imagen para validar dimensiones'],
          dimensions: null,
        });
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Eliminar imagen de fondo actual
   */
  async deleteBackgroundImage(userId) {
    try {
      this.log('Eliminando imagen de fondo actual', { userId });

      const imageRef = ref(this.storage, BACKGROUND_CONFIG.storagePath);
      await deleteObject(imageRef);

      // Limpiar cache
      this.cache.clear();

      // Log de eliminación
      await this.logImageAccess('delete', null, 'success', null, { userId });

      this.log('Imagen de fondo eliminada exitosamente');

      return {
        success: true,
        message: 'Imagen eliminada exitosamente',
      };
    } catch (error) {
      this.logError('Error eliminando imagen de fondo', error);

      // Log del error
      await this.logImageAccess('delete', null, 'error', error.message, { userId });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Restaurar imagen predeterminada
   */
  async restoreDefaultImage(userId) {
    try {
      // Primero eliminar imagen actual si existe
      await this.deleteBackgroundImage(userId);

      // Limpiar cache para forzar fallback
      this.cache.clear();

      this.log('Imagen predeterminada restaurada', { userId });

      return {
        success: true,
        message: 'Imagen predeterminada restaurada',
        url: this.getRandomFallbackImage(),
      };
    } catch (error) {
      this.logError('Error restaurando imagen predeterminada', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtener información de la imagen actual
   */
  async getImageInfo() {
    try {
      const imageRef = ref(this.storage, BACKGROUND_CONFIG.storagePath);

      // Intentar obtener metadata
      const metadata = (await imageRef.getMetadata?.()) || {};
      const url = await getDownloadURL(imageRef);

      return {
        success: true,
        data: {
          url,
          size: metadata.size || 0,
          type: metadata.contentType || 'unknown',
          uploaded: metadata.timeCreated || null,
          uploadedBy: metadata.customMetadata?.uploadedBy || 'unknown',
          originalName: metadata.customMetadata?.originalName || 'background.jpg',
        },
      };
    } catch (error) {
      this.logError('Error obteniendo información de imagen', error);
      return {
        success: false,
        error: error.message,
        fallback: true,
        url: this.getRandomFallbackImage(),
      };
    }
  }

  /**
   * Limpiar cache de imágenes
   */
  clearCache() {
    const cacheSize = this.cache.size;
    this.cache.clear();
    this.log(`Cache limpiado: ${cacheSize} elementos eliminados`);

    return {
      success: true,
      clearedCount: cacheSize,
    };
  }

  /**
   * Obtener estadísticas de cache
   */
  getCacheStats() {
    const stats = {
      size: this.cache.size,
      entries: [],
    };

    this.cache.forEach((value, key) => {
      stats.entries.push({
        key,
        timestamp: value.timestamp,
        age: Date.now() - value.timestamp,
        expired: Date.now() - value.timestamp > this.cacheExpiry,
      });
    });

    return stats;
  }

  /**
   * Registrar acceso a imagen en logs
   */
  async logImageAccess(action, url, status, error = null, metadata = {}) {
    try {
      const logData = {
        action,
        url: url || 'N/A',
        status, // 'success', 'error', 'fallback'
        error,
        ...metadata,
      };

      await this.create(logData);
    } catch (logError) {
      console.error('Error registrando acceso a imagen:', logError);
    }
  }

  /**
   * Obtener estadísticas de uso de imágenes
   */
  async getUsageStats(days = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentLogs = await this.search('createdAt', '>=', cutoffDate);

      const stats = {
        totalAccesses: recentLogs.length,
        successfulAccesses: recentLogs.filter((log) => log.status === 'success').length,
        fallbackAccesses: recentLogs.filter((log) => log.status === 'fallback').length,
        errorAccesses: recentLogs.filter((log) => log.status === 'error').length,
        uploads: recentLogs.filter((log) => log.action === 'upload').length,
        downloads: recentLogs.filter((log) => log.action === 'download').length,
        deletes: recentLogs.filter((log) => log.action === 'delete').length,
      };

      stats.successRate =
        stats.totalAccesses > 0
          ? Math.round((stats.successfulAccesses / stats.totalAccesses) * 100)
          : 0;

      stats.fallbackRate =
        stats.totalAccesses > 0
          ? Math.round((stats.fallbackAccesses / stats.totalAccesses) * 100)
          : 0;

      return { success: true, data: stats };
    } catch (error) {
      this.logError('Error obteniendo estadísticas de uso', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Limpiar logs antiguos
   */
  async cleanOldLogs(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const oldLogs = await this.search('createdAt', '<', cutoffDate);
      let cleanedCount = 0;

      for (const log of oldLogs) {
        await this.delete(log.id);
        cleanedCount++;
      }

      this.log(`Limpieza de logs completada: ${cleanedCount} logs antiguos eliminados`);
      return { success: true, cleanedCount };
    } catch (error) {
      this.logError('Error en limpieza de logs', error);
      return { success: false, error: error.message };
    }
  }
}

// Crear instancia singleton
const backgroundImageService = new BackgroundImageService();

// Exportar métodos para compatibilidad con código existente
export const getBackgroundImageUrl = () => backgroundImageService.getBackgroundImageUrl();
export const uploadBackgroundImage = (file, userId) =>
  backgroundImageService.uploadBackgroundImage(file, userId);
export const deleteBackgroundImage = (userId) =>
  backgroundImageService.deleteBackgroundImage(userId);
export const restoreDefaultImage = (userId) => backgroundImageService.restoreDefaultImage(userId);
export const getImageInfo = () => backgroundImageService.getImageInfo();
export const validateImageFile = (file) => backgroundImageService.validateImageFile(file);
export const validateImageDimensions = (file) =>
  backgroundImageService.validateImageDimensions(file);
export const clearCache = () => backgroundImageService.clearCache();
export const getCacheStats = () => backgroundImageService.getCacheStats();
export const getUsageStats = (days) => backgroundImageService.getUsageStats(days);
export const cleanOldLogs = (daysOld) => backgroundImageService.cleanOldLogs(daysOld);

// Exportar configuración
export { BACKGROUND_CONFIG };

// Exportar clase por defecto
export default backgroundImageService;
