/**
 * CRUDService - Implementa operaciones CRUD genéricas
 * Extiende BaseService con funcionalidad completa de Create, Read, Update, Delete
 *
 * Forestech Colombia - Combustibles App
 * @author AI Agent - TASK 1.2 BaseService Implementation
 * @date 2025-01-04
 */

import {
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { BaseService } from './BaseService.js';

/**
 * CRUDService - Implementación completa de operaciones CRUD
 */
export class CRUDService extends BaseService {
  /**
   * Constructor de CRUDService
   * @param {string} collectionName - Nombre de la colección
   * @param {Object} config - Configuración del servicio
   */
  constructor(collectionName, config = {}) {
    super(collectionName, config);
  }

  /**
   * CREATE - Crear un nuevo documento
   * @param {Object} data - Datos del documento
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async create(data, options = {}) {
    try {
      // Validar datos
      const validation = this.validateData(data);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Datos inválidos: ${validation.errors.join(', ')}`,
        };
      }

      // Verificar duplicados si se especifica
      if (options.duplicateField) {
        const isDuplicate = await this.checkDuplicate(
          options.duplicateField,
          data[options.duplicateField]
        );

        if (isDuplicate) {
          return {
            success: false,
            error: `Ya existe un elemento con ${options.duplicateField}: ${data[options.duplicateField]}`,
          };
        }
      }

      // Procesar datos
      const processedData = this.processData(data, false);

      // Crear documento
      const docRef = await addDoc(this.getCollectionRef(), processedData);

      // Log de auditoría
      this.logOperation('CREATE', docRef.id, {
        duplicateCheck: !!options.duplicateField,
      });

      return {
        success: true,
        id: docRef.id,
        message: 'Elemento creado exitosamente',
      };
    } catch (error) {
      return this.handleError(error, 'CREATE');
    }
  }

  /**
   * READ - Obtener un documento por ID
   * @param {string} id - ID del documento
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async getById(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'ID es requerido',
        };
      }

      const docRef = this.getDocRef(id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Elemento no encontrado',
        };
      }

      return {
        success: true,
        data: {
          id: docSnap.id,
          ...docSnap.data(),
        },
      };
    } catch (error) {
      return this.handleError(error, 'READ_BY_ID');
    }
  }

  /**
   * READ ALL - Obtener todos los documentos
   * @param {Object} options - Opciones de consulta
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async getAll(options = {}) {
    try {
      let q = this.getCollectionRef();

      // Aplicar filtros si existen
      if (options.filters && Array.isArray(options.filters)) {
        options.filters.forEach((filter) => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });
      }

      // Aplicar ordenamiento
      const orderField = options.orderBy || this.config.defaultOrderBy;
      const orderDirection = options.orderDirection || this.config.defaultOrderDirection;

      if (orderField) {
        q = query(q, orderBy(orderField, orderDirection));
      }

      // Aplicar límite
      if (options.limit) {
        q = query(q, limit(options.limit));
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        success: true,
        data,
        count: data.length,
        totalCount: snapshot.size,
      };
    } catch (error) {
      return this.handleError(error, 'READ_ALL');
    }
  }

  /**
   * UPDATE - Actualizar un documento
   * @param {string} id - ID del documento
   * @param {Object} data - Datos a actualizar
   * @param {Object} options - Opciones adicionales
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async update(id, data, options = {}) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'ID es requerido',
        };
      }

      // Verificar que el documento existe
      const existsResult = await this.getById(id);
      if (!existsResult.success) {
        return existsResult;
      }

      // Validar datos
      const validation = this.validateData(data);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Datos inválidos: ${validation.errors.join(', ')}`,
        };
      }

      // Verificar duplicados si se especifica
      if (options.duplicateField && data[options.duplicateField]) {
        const isDuplicate = await this.checkDuplicate(
          options.duplicateField,
          data[options.duplicateField],
          id
        );

        if (isDuplicate) {
          return {
            success: false,
            error: `Ya existe un elemento con ${options.duplicateField}: ${data[options.duplicateField]}`,
          };
        }
      }

      // Procesar datos
      const processedData = this.processData(data, true);

      // Actualizar documento
      const docRef = this.getDocRef(id);
      await updateDoc(docRef, processedData);

      // Log de auditoría
      this.logOperation('UPDATE', id, {
        fieldsUpdated: Object.keys(processedData),
        duplicateCheck: !!options.duplicateField,
      });

      return {
        success: true,
        id,
        message: 'Elemento actualizado exitosamente',
      };
    } catch (error) {
      return this.handleError(error, 'UPDATE');
    }
  }

  /**
   * DELETE - Eliminar un documento
   * @param {string} id - ID del documento
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async delete(id) {
    try {
      if (!id) {
        return {
          success: false,
          error: 'ID es requerido',
        };
      }

      // Verificar que el documento existe
      const existsResult = await this.getById(id);
      if (!existsResult.success) {
        return existsResult;
      }

      // Soft delete si está habilitado
      if (this.config.enableSoftDelete) {
        const softDeleteData = {
          deleted: true,
          deletedAt: serverTimestamp(),
        };

        const updateResult = await this.update(id, softDeleteData);
        if (updateResult.success) {
          this.logOperation('SOFT_DELETE', id);
          return {
            success: true,
            id,
            message: 'Elemento eliminado exitosamente',
          };
        }
        return updateResult;
      }

      // Hard delete
      const docRef = this.getDocRef(id);
      await deleteDoc(docRef);

      // Log de auditoría
      this.logOperation('DELETE', id, {
        hardDelete: true,
      });

      return {
        success: true,
        id,
        message: 'Elemento eliminado permanentemente',
      };
    } catch (error) {
      return this.handleError(error, 'DELETE');
    }
  }

  /**
   * FIND - Buscar documentos por criterios
   * @param {Object} criteria - Criterios de búsqueda
   * @param {Object} options - Opciones de consulta
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async find(criteria, options = {}) {
    try {
      const filters = Object.entries(criteria).map(([field, value]) => ({
        field,
        operator: '==',
        value,
      }));

      return await this.getAll({
        ...options,
        filters: [...(options.filters || []), ...filters],
      });
    } catch (error) {
      return this.handleError(error, 'FIND');
    }
  }

  /**
   * COUNT - Contar documentos
   * @param {Object} criteria - Criterios de filtro
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async count(criteria = {}) {
    try {
      const result = await this.find(criteria);

      if (!result.success) {
        return result;
      }

      return {
        success: true,
        count: result.count,
      };
    } catch (error) {
      return this.handleError(error, 'COUNT');
    }
  }

  /**
   * LISTEN - Escuchar cambios en tiempo real
   * @param {Function} callback - Función callback para cambios
   * @param {Object} options - Opciones de consulta
   * @returns {Function} - Función para cancelar la suscripción
   */
  listen(callback, options = {}) {
    try {
      let q = this.getCollectionRef();

      // Aplicar filtros
      if (options.filters && Array.isArray(options.filters)) {
        options.filters.forEach((filter) => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });
      }

      // Aplicar ordenamiento
      const orderField = options.orderBy || this.config.defaultOrderBy;
      const orderDirection = options.orderDirection || this.config.defaultOrderDirection;

      if (orderField) {
        q = query(q, orderBy(orderField, orderDirection));
      }

      // Configurar listener
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          callback({
            success: true,
            data,
            count: data.length,
          });
        },
        (error) => {
          callback(this.handleError(error, 'LISTEN'));
        }
      );

      return unsubscribe;
    } catch (error) {
      callback(this.handleError(error, 'LISTEN'));
      return () => {}; // Función vacía para cancelar
    }
  }
}

export default CRUDService;
