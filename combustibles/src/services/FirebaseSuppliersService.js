/**
 * CloudRunSuppliersService - Servicio de proveedores usando Cloud Run SQL endpoints
 * Reemplaza SqlSuppliersService para usar endpoints SQL migrados
 * Forestech Combustibles App
 */

import HttpService from './base/HttpService.js';

// Constantes del servicio
export const SUPPLIER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  EVALUATION: 'evaluation',
};

export const SUPPLIER_TYPES = {
  PROVEEDOR: 'proveedor',
  DISTRIBUIDOR: 'distribuidor',
  ESTACION: 'estacion',
  MAYORISTA: 'mayorista',
};

export const SUPPLIER_CATEGORIES = {
  COMBUSTIBLES: 'combustibles',
  LUBRICANTES: 'lubricantes',
  SERVICIOS: 'servicios',
  MIXTO: 'mixto',
};

class FirebaseSuppliersService extends HttpService {
  constructor() {
    super();
  }

  /**
   * CRUD OPERATIONS - CREATE
   */

  /**
   * Crear un nuevo proveedor
   * @param {Object} supplierData - Datos del proveedor
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async createSupplier(supplierData) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      if (!supplierData.name) {
        return { success: false, error: 'El nombre del proveedor es requerido' };
      }

      const result = await this.callEndpoint('sqlCreateSupplier', {
        supplierData: {
          ...supplierData,
          createdBy: this.getCurrentUser()?.uid
        }
      });

      return result;
    } catch (error) {
      console.error('Error creando proveedor:', error);
      return {
        success: false,
        error: 'Error al crear el proveedor: ' + error.message
      };
    }
  }

  /**
   * CRUD OPERATIONS - READ
   */

  /**
   * Obtener todos los proveedores
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Array>} - Lista de proveedores
   */
  async getSuppliers(filters = {}) {
    try {
      const result = await this.callEndpoint('sqlGetAllSuppliers', { filters });

      if (result.success && result.data) {
        // Procesar datos de respuesta
        return result.data.map(supplier => ({
          ...supplier,
          fuelTypes: this.parseJSON(supplier.fuelTypes),
          priceList: this.parseJSON(supplier.priceList),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo proveedores:', error);
      throw error;
    }
  }

  /**
   * Obtener proveedor por ID
   * @param {string} supplierId - ID del proveedor
   * @returns {Promise<Object>} - Datos del proveedor
   */
  async getSupplier(supplierId) {
    try {
      const result = await this.callEndpoint('sqlGetSupplierById', { supplierId });

      if (result.success && result.data) {
        return {
          ...result.data,
          fuelTypes: this.parseJSON(result.data.fuelTypes),
          priceList: this.parseJSON(result.data.priceList),
        };
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo proveedor:', error);
      throw error;
    }
  }

  /**
   * CRUD OPERATIONS - UPDATE
   */

  /**
   * Actualizar proveedor
   * @param {string} supplierId - ID del proveedor
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateSupplier(supplierId, updateData) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.callEndpoint('sqlUpdateSupplier', {
        supplierId,
        updateData: {
          ...updateData,
          updatedBy: this.getCurrentUser()?.uid
        }
      });

      return result;
    } catch (error) {
      console.error('Error actualizando proveedor:', error);
      return {
        success: false,
        error: 'Error al actualizar el proveedor: ' + error.message
      };
    }
  }

  /**
   * Actualizar estadísticas del proveedor
   * @param {string} supplierId - ID del proveedor
   * @param {Object} stats - Estadísticas a actualizar
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateSupplierStats(supplierId, stats) {
    try {
      const result = await this.callEndpoint('sqlUpdateSupplierStats', {
        supplierId,
        stats
      });

      return result;
    } catch (error) {
      console.error('Error actualizando estadísticas del proveedor:', error);
      return {
        success: false,
        error: 'Error al actualizar las estadísticas: ' + error.message
      };
    }
  }

  /**
   * CRUD OPERATIONS - DELETE
   */

  /**
   * Eliminar proveedor
   * @param {string} supplierId - ID del proveedor
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async deleteSupplier(supplierId) {
    try {
      const result = await this.callEndpoint('sqlDeleteSupplier', { supplierId });
      return result;
    } catch (error) {
      console.error('Error eliminando proveedor:', error);
      return {
        success: false,
        error: 'Error al eliminar el proveedor: ' + error.message
      };
    }
  }

  /**
   * SUSCRIPCIONES Y REPORTES
   */

  /**
   * Suscribirse a cambios en proveedores
   * @param {Function} callback - Función de callback
   * @returns {Function} - Función para cancelar suscripción
   */
  subscribeToSuppliers(callback) {
    let isActive = true;

    const poll = async () => {
      if (!isActive) return;

      try {
        // Verificar autenticación antes de hacer la llamada
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
          console.log('🔒 SuppliersService: Usuario no autenticado, omitiendo polling');
          callback([], null); // Devolver array vacío en lugar de error
          if (isActive) {
            setTimeout(poll, 30000); // Poll cada 30 segundos
          }
          return;
        }

        const data = await this.getSuppliers();
        callback(data, null);
      } catch (error) {
        console.error('Error en polling de proveedores:', error);
        callback(null, error);
      }

      if (isActive) {
        setTimeout(poll, 30000); // Poll cada 30 segundos
      }
    };

    // Ejecutar inmediatamente
    poll();

    // Retornar función para cancelar suscripción
    return () => {
      isActive = false;
    };
  }

  /**
   * Obtener proveedores preferidos
   * @returns {Promise<Array>} - Lista de proveedores preferidos
   */
  async getPreferredSuppliers() {
    try {
      const result = await this.callEndpoint('sqlGetPreferredSuppliers');

      if (result.success && result.data) {
        return result.data.map(supplier => ({
          ...supplier,
          fuelTypes: this.parseJSON(supplier.fuelTypes),
          priceList: this.parseJSON(supplier.priceList),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo proveedores preferidos:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de proveedores
   * @returns {Promise<Object>} - Estadísticas de proveedores
   */
  async getSupplierStats() {
    try {
      const result = await this.callEndpoint('sqlGetSuppliersStats');
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Error obteniendo estadísticas de proveedores:', error);
      throw error;
    }
  }

  /**
   * MÉTODOS AUXILIARES
   */

  /**
   * Parsear JSON de manera segura
   * @param {string} jsonString - String JSON
   * @returns {Array|Object} - Objeto parseado o valor por defecto
   */
  parseJSON(jsonString) {
    try {
      return jsonString ? JSON.parse(jsonString) : [];
    } catch (error) {
      console.warn('Error parseando JSON:', error);
      return [];
    }
  }
}

export default FirebaseSuppliersService;

// Funciones de compatibilidad con el servicio anterior
export const createSupplier = async (supplierData) => {
  const service = new FirebaseSuppliersService();
  return service.createSupplier(supplierData);
};

export const subscribeToSuppliers = (callback) => {
  const service = new FirebaseSuppliersService();
  return service.subscribeToSuppliers(callback);
};

export const updateSupplier = async (supplierId, updateData) => {
  const service = new FirebaseSuppliersService();
  return service.updateSupplier(supplierId, updateData);
};

export const deleteSupplier = async (supplierId) => {
  const service = new FirebaseSuppliersService();
  return service.deleteSupplier(supplierId);
};

export const getSupplier = async (supplierId) => {
  const service = new FirebaseSuppliersService();
  return service.getSupplier(supplierId);
};