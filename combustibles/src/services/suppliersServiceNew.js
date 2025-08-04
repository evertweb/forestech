/**
 * SuppliersService - Servicio refactorizado para gestión de proveedores
 * Utiliza BaseService y CRUDService para operaciones optimizadas
 * 
 * Forestech Colombia - Combustibles App
 * @author AI Agent - TASK 1.2 BaseService Implementation
 * @date 2025-01-04
 */

import { CRUDService } from './base/CRUDService.js';
import { FUEL_TYPES } from '../constants/combustibleTypes.js';

/**
 * SuppliersService - Servicio especializado para proveedores
 */
class SuppliersService extends CRUDService {
  constructor() {
    super('combustibles_suppliers', {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'name',
      defaultOrderDirection: 'asc'
    });
  }

  /**
   * Validación específica para datos de proveedores
   * @param {Object} data - Datos del proveedor
   * @returns {Object} - Resultado de validación
   */
  validateData(data) {
    const baseValidation = super.validateData(data);
    if (!baseValidation.isValid) {
      return baseValidation;
    }

    const errors = [];

    // Validaciones requeridas
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('El nombre del proveedor es requerido');
    }

    // Validar email si se proporciona
    if (data.email && data.email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        errors.push('El formato del email no es válido');
      }
    }

    // Validar tipos de combustible
    if (data.fuelTypes && Array.isArray(data.fuelTypes)) {
      const validFuelTypes = Object.values(FUEL_TYPES);
      const invalidTypes = data.fuelTypes.filter(type => !validFuelTypes.includes(type));
      if (invalidTypes.length > 0) {
        errors.push(`Tipos de combustible inválidos: ${invalidTypes.join(', ')}`);
      }
    }

    // Validar rating
    if (data.rating !== undefined) {
      const rating = Number(data.rating);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        errors.push('El rating debe ser un número entre 1 y 5');
      }
    }

    // Validar límite de crédito
    if (data.creditLimit !== undefined) {
      const creditLimit = Number(data.creditLimit);
      if (isNaN(creditLimit) || creditLimit < 0) {
        errors.push('El límite de crédito debe ser un número positivo');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Procesar datos específicos de proveedores
   * @param {Object} data - Datos originales
   * @param {boolean} isUpdate - Si es actualización
   * @returns {Object} - Datos procesados
   */
  processData(data, isUpdate = false) {
    const baseProcessed = super.processData(data, isUpdate);

    // Limpiar y normalizar strings
    if (baseProcessed.name) {
      baseProcessed.name = baseProcessed.name.trim();
    }
    if (baseProcessed.taxId) {
      baseProcessed.taxId = baseProcessed.taxId.trim();
    }
    if (baseProcessed.email) {
      baseProcessed.email = baseProcessed.email.trim().toLowerCase();
    }
    if (baseProcessed.phone) {
      baseProcessed.phone = baseProcessed.phone.trim();
    }

    // Establecer valores por defecto solo en creación
    if (!isUpdate) {
      baseProcessed.type = baseProcessed.type || 'proveedor';
      baseProcessed.category = baseProcessed.category || 'combustibles';
      baseProcessed.status = baseProcessed.status || 'active';
      baseProcessed.rating = Number(baseProcessed.rating) || 5;
      baseProcessed.creditLimit = Number(baseProcessed.creditLimit) || 0;
      baseProcessed.fuelTypes = baseProcessed.fuelTypes || [];
      baseProcessed.paymentTerms = baseProcessed.paymentTerms || 'contado';
      baseProcessed.isPreferred = baseProcessed.isPreferred || false;
      
      // Estadísticas iniciales
      baseProcessed.totalOrders = 0;
      baseProcessed.totalPurchased = 0;
      baseProcessed.lastOrderDate = null;
      baseProcessed.averageDeliveryTime = 0;
    }

    return baseProcessed;
  }

  /**
   * Crear nuevo proveedor con validación de duplicados
   * @param {Object} supplierData - Datos del proveedor
   * @param {string} createdBy - Usuario que crea
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async createSupplier(supplierData, createdBy = 'system') {
    // Agregar metadatos de auditoría
    const dataWithAudit = {
      ...supplierData,
      createdBy,
      updatedBy: createdBy
    };

    // Verificar duplicado por taxId si se proporciona
    if (supplierData.taxId && supplierData.taxId.trim()) {
      const duplicateCheck = await this.checkDuplicate('taxId', supplierData.taxId.trim());
      if (duplicateCheck) {
        return {
          success: false,
          error: `Ya existe un proveedor con el NIT/Documento "${supplierData.taxId}"`
        };
      }
    }

    // Crear usando el método base con validación de nombre
    const result = await this.create(dataWithAudit, {
      duplicateField: 'name'
    });

    if (result.success) {
      this.logOperation('CREATE_SUPPLIER', result.id, { 
        supplierName: supplierData.name,
        createdBy 
      });
    }

    return result;
  }

  /**
   * Obtener todos los proveedores
   * @param {Object} options - Opciones de consulta
   * @returns {Promise<Object>} - Lista de proveedores
   */
  async getAllSuppliers(options = {}) {
    return await this.getAll({
      orderBy: 'name',
      orderDirection: 'asc',
      ...options
    });
  }

  /**
   * Obtener proveedor por ID
   * @param {string} supplierId - ID del proveedor
   * @returns {Promise<Object>} - Datos del proveedor
   */
  async getSupplierById(supplierId) {
    return await this.getById(supplierId);
  }

  /**
   * Actualizar proveedor
   * @param {string} supplierId - ID del proveedor
   * @param {Object} updateData - Datos a actualizar
   * @param {string} updatedBy - Usuario que actualiza
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateSupplier(supplierId, updateData, updatedBy = 'system') {
    const dataWithAudit = {
      ...updateData,
      updatedBy
    };

    const result = await this.update(supplierId, dataWithAudit, {
      duplicateField: updateData.name ? 'name' : null
    });

    if (result.success) {
      this.logOperation('UPDATE_SUPPLIER', supplierId, { 
        updatedBy,
        fieldsUpdated: Object.keys(updateData)
      });
    }

    return result;
  }

  /**
   * Eliminar proveedor
   * @param {string} supplierId - ID del proveedor
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async deleteSupplier(supplierId) {
    const result = await this.delete(supplierId);

    if (result.success) {
      this.logOperation('DELETE_SUPPLIER', supplierId);
    }

    return result;
  }

  /**
   * Obtener proveedores por tipo de combustible
   * @param {string} fuelType - Tipo de combustible
   * @returns {Promise<Object>} - Lista de proveedores
   */
  async getSuppliersByFuelType(fuelType) {
    return await this.getAll({
      filters: [
        { field: 'fuelTypes', operator: 'array-contains', value: fuelType },
        { field: 'status', operator: '==', value: 'active' }
      ],
      orderBy: 'rating',
      orderDirection: 'desc'
    });
  }

  /**
   * Obtener proveedores activos
   * @returns {Promise<Object>} - Lista de proveedores activos
   */
  async getActiveSuppliers() {
    return await this.find({ status: 'active' }, {
      orderBy: 'name',
      orderDirection: 'asc'
    });
  }

  /**
   * Obtener proveedores preferidos
   * @returns {Promise<Object>} - Lista de proveedores preferidos
   */
  async getPreferredSuppliers() {
    return await this.find({ 
      isPreferred: true, 
      status: 'active' 
    }, {
      orderBy: 'rating',
      orderDirection: 'desc'
    });
  }

  /**
   * Buscar proveedores por nombre o NIT
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Object>} - Resultados de búsqueda
   */
  async searchSuppliers(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return await this.getAllSuppliers();
    }

    // Por limitaciones de Firebase, hacemos búsquedas separadas
    const nameResults = await this.getAll({
      filters: [
        { field: 'name', operator: '>=', value: searchTerm },
        { field: 'name', operator: '<=', value: searchTerm + '\uf8ff' }
      ]
    });

    const taxResults = await this.find({ taxId: searchTerm });

    // Combinar resultados sin duplicados
    const combined = new Map();
    
    if (nameResults.success) {
      nameResults.data.forEach(supplier => combined.set(supplier.id, supplier));
    }
    
    if (taxResults.success) {
      taxResults.data.forEach(supplier => combined.set(supplier.id, supplier));
    }

    return {
      success: true,
      data: Array.from(combined.values()),
      count: combined.size
    };
  }

  /**
   * Escuchar cambios en proveedores en tiempo real
   * @param {Function} callback - Callback para cambios
   * @param {Object} options - Opciones de consulta
   * @returns {Function} - Función para cancelar suscripción
   */
  listenToSuppliers(callback, options = {}) {
    return this.listen(callback, {
      orderBy: 'name',
      orderDirection: 'asc',
      ...options
    });
  }

  /**
   * Actualizar estadísticas de un proveedor
   * @param {string} supplierId - ID del proveedor
   * @param {Object} stats - Estadísticas a actualizar
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateSupplierStats(supplierId, stats) {
    const updateData = {};
    
    if (stats.totalOrders !== undefined) {
      updateData.totalOrders = Number(stats.totalOrders);
    }
    if (stats.totalPurchased !== undefined) {
      updateData.totalPurchased = Number(stats.totalPurchased);
    }
    if (stats.lastOrderDate) {
      updateData.lastOrderDate = stats.lastOrderDate;
    }
    if (stats.averageDeliveryTime !== undefined) {
      updateData.averageDeliveryTime = Number(stats.averageDeliveryTime);
    }

    return await this.update(supplierId, updateData);
  }
}

// Crear y exportar instancia singleton
const suppliersService = new SuppliersService();

// Exportar métodos para compatibilidad con código existente
export const createSupplier = (data, createdBy) => suppliersService.createSupplier(data, createdBy);
export const getAllSuppliers = (options) => suppliersService.getAllSuppliers(options);
export const getSupplierById = (id) => suppliersService.getSupplierById(id);
export const updateSupplier = (id, data, updatedBy) => suppliersService.updateSupplier(id, data, updatedBy);
export const deleteSupplier = (id) => suppliersService.deleteSupplier(id);
export const getSuppliersByFuelType = (fuelType) => suppliersService.getSuppliersByFuelType(fuelType);
export const getActiveSuppliers = () => suppliersService.getActiveSuppliers();
export const getPreferredSuppliers = () => suppliersService.getPreferredSuppliers();
export const searchSuppliers = (searchTerm) => suppliersService.searchSuppliers(searchTerm);
export const listenToSuppliers = (callback, options) => suppliersService.listenToSuppliers(callback, options);
export const updateSupplierStats = (id, stats) => suppliersService.updateSupplierStats(id, stats);

// Exportar servicio para uso avanzado
export { suppliersService };
export default suppliersService;
