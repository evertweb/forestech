/**
 * BaseService - Clase base para servicios Firebase
 * Proporciona funcionalidad común para operaciones CRUD y manejo de errores
 *
 * Forestech Colombia - Combustibles App
 * @author AI Agent - TASK 1.2 BaseService Implementation
 * @date 2025-01-04
 */

import { collection, doc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';

/**
 * BaseService - Clase base para servicios Firebase
 */
export class BaseService {
  /**
   * Constructor de BaseService
   * @param {string} collectionName - Nombre de la colección de Firebase
   * @param {Object} config - Configuración del servicio
   */
  constructor(collectionName, config = {}) {
    if (!collectionName) {
      throw new Error('BaseService: collectionName es requerido');
    }

    this.collectionName = collectionName;
    this.config = {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'createdAt',
      defaultOrderDirection: 'desc',
      ...config,
    };
  }

  /**
   * Obtener referencia de la colección
   * @returns {CollectionReference} - Referencia de Firebase
   */
  getCollectionRef() {
    return collection(db, this.collectionName);
  }

  /**
   * Obtener referencia de un documento
   * @param {string} id - ID del documento
   * @returns {DocumentReference} - Referencia del documento
   */
  getDocRef(id) {
    return doc(db, this.collectionName, id);
  }

  /**
   * Validar datos antes de guardar
   * Método virtual - debe ser implementado por las clases hijas
   * @param {Object} data - Datos a validar
   * @returns {Object} - Resultado de validación { isValid, errors }
   */
  validateData(data) {
    // Implementación base - validar que data existe
    if (!data || typeof data !== 'object') {
      return {
        isValid: false,
        errors: ['Los datos son requeridos y deben ser un objeto'],
      };
    }

    return { isValid: true, errors: [] };
  }

  /**
   * Procesar datos antes de guardar
   * @param {Object} data - Datos originales
   * @param {boolean} isUpdate - Si es una actualización
   * @returns {Object} - Datos procesados
   */
  processData(data, isUpdate = false) {
    const processedData = { ...data };

    if (this.config.enableTimestamps) {
      processedData.updatedAt = serverTimestamp();

      if (!isUpdate) {
        processedData.createdAt = serverTimestamp();
      }
    }

    // Limpiar campos undefined/null
    Object.keys(processedData).forEach((key) => {
      if (processedData[key] === undefined) {
        delete processedData[key];
      }
    });

    return processedData;
  }

  /**
   * Manejar errores de manera consistente
   * @param {Error} error - Error capturado
   * @param {string} operation - Operación que falló
   * @returns {Object} - Respuesta estructurada de error
   */
  handleError(error, operation) {
    console.error(`${this.constructor.name} - ${operation}:`, error);

    let errorMessage = 'Ocurrió un error inesperado';

    // Mapear errores comunes de Firebase
    switch (error.code) {
      case 'permission-denied':
        errorMessage = 'No tienes permisos para realizar esta operación';
        break;
      case 'unauthenticated':
        errorMessage = 'Debes iniciar sesión para continuar';
        break;
      case 'unavailable':
        errorMessage = 'El servicio no está disponible. Intenta más tarde';
        break;
      case 'not-found':
        errorMessage = 'El elemento solicitado no existe';
        break;
      case 'already-exists':
        errorMessage = 'Este elemento ya existe';
        break;
      default:
        errorMessage = error.message || errorMessage;
    }

    return {
      success: false,
      error: errorMessage,
      code: error.code || 'unknown',
      operation,
    };
  }

  /**
   * Verificar duplicados basado en un campo
   * @param {string} field - Campo a verificar
   * @param {any} value - Valor a buscar
   * @param {string} excludeId - ID a excluir de la búsqueda (para updates)
   * @returns {Promise<boolean>} - true si existe duplicado
   */
  async checkDuplicate(field, value, excludeId = null) {
    try {
      const q = query(this.getCollectionRef(), where(field, '==', value));

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return false;
      }

      // Si es una actualización, excluir el documento actual
      if (excludeId) {
        const duplicates = snapshot.docs.filter((doc) => doc.id !== excludeId);
        return duplicates.length > 0;
      }

      return true;
    } catch (error) {
      console.error('Error checking duplicate:', error);
      return false;
    }
  }

  /**
   * Logs de auditoría para operaciones críticas
   * @param {string} operation - Operación realizada
   * @param {string} documentId - ID del documento
   * @param {Object} metadata - Información adicional
   */
  logOperation(operation, documentId, metadata = {}) {
    const logData = {
      service: this.constructor.name,
      collection: this.collectionName,
      operation,
      documentId,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    console.info(`[${this.constructor.name}] ${operation}:`, logData);

    // En producción, aquí se podría enviar a un servicio de auditoría
    if (typeof window !== 'undefined' && window.location?.hostname === 'production-domain') {
      // TODO: Implementar logging a servicio externo
    }
  }
}

export default BaseService;
