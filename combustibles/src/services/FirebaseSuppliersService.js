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
};

export const SUPPLIER_TYPES = {
  PROVEEDOR: 'proveedor',
  DISTRIBUIDOR: 'distribuidor',
  MAYORISTA: 'mayorista',
};

export const SUPPLIER_CATEGORIES = {
  COMBUSTIBLES: 'combustibles',
  LUBRICANTES: 'lubricantes',
  ADITIVOS: 'aditivos',
};

export const SUPPLIER_PAYMENT_TERMS = {
  CONTADO: 'contado',
  TREINTA_DIAS: '30dias',
  SESENTA_DIAS: '60dias',
  NOVENTA_DIAS: '90dias',
};

const SUPPLIER_ALLOWED_FIELDS = new Set([
  'name',
  'taxId',
  'type',
  'category',
  'contactPerson',
  'phone',
  'email',
  'city',
  'status',
  'paymentTerms',
]);

const sanitizeSupplierPayload = (payload = {}) => {
  const sanitized = {};
  const unexpected = [];

  Object.entries(payload).forEach(([key, value]) => {
    if (SUPPLIER_ALLOWED_FIELDS.has(key)) {
      sanitized[key] = typeof value === 'string' ? value.trim() : value;
    } else {
      unexpected.push(key);
    }
  });

  if (unexpected.length > 0) {
    console.warn('⚠️ FirebaseSuppliersService - Campos inesperados ignorados:', unexpected);
  }

  return sanitized;
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

      const sanitizedData = sanitizeSupplierPayload(supplierData);

      const result = await this.callEndpoint('sqlCreateSupplier', {
        supplierData: sanitizedData
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
        return result.data;
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
        return result.data;
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

      const sanitizedUpdate = sanitizeSupplierPayload(updateData);

      if (Object.keys(sanitizedUpdate).length === 0) {
        return { success: false, error: 'No hay campos válidos para actualizar' };
      }

      const result = await this.callEndpoint('sqlUpdateSupplier', {
        supplierId,
        updateData: sanitizedUpdate
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
   * Suscribirse a cambios en proveedores (polling simple)
   * @param {Function} callback - Recibe (datos, error)
   * @returns {Function} - Cancela la suscripción
   */
  subscribeToSuppliers(callback) {
    let isActive = true;

    const poll = async () => {
      if (!isActive) return;

      try {
        const data = await this.getSuppliers();
        callback(data || [], null);
      } catch (error) {
        console.error('Error en polling de proveedores:', error);
        callback(null, error);
      }

      if (isActive) {
        setTimeout(poll, 30000);
      }
    };

    poll();

    return () => {
      isActive = false;
    };
  }
}

export default FirebaseSuppliersService;

// Funciones de compatibilidad con el servicio anterior
export const createSupplier = async (supplierData) => {
  const service = new FirebaseSuppliersService();
  return service.createSupplier(supplierData);
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

export const getAllSuppliers = async (filters = {}) => {
  const service = new FirebaseSuppliersService();
  return service.getSuppliers(filters);
};

export const subscribeToSuppliers = (callback) => {
  const service = new FirebaseSuppliersService();
  return service.subscribeToSuppliers(callback);
};