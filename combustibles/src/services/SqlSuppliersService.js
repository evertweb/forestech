/**
 * SqlSuppliersService - Servicio de proveedores usando Azure SQL Server
 * Migración completa del suppliersService original
 * Forestech Combustibles App
 */

import SqlCrudService from './base/SqlCrudService.js';
import sqlConnection from './base/SqlConnection.js';

const TABLE_NAME = 'combustibles_suppliers';

// Estados del proveedor
export const SUPPLIER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  EVALUATION: 'evaluation',
};

// Tipos de proveedor
export const SUPPLIER_TYPES = {
  PROVEEDOR: 'proveedor',
  DISTRIBUIDOR: 'distribuidor',
  ESTACION: 'estacion',
  MAYORISTA: 'mayorista',
};

// Categorías de proveedor
export const SUPPLIER_CATEGORIES = {
  COMBUSTIBLES: 'combustibles',
  LUBRICANTES: 'lubricantes',
  SERVICIOS: 'servicios',
  MIXTO: 'mixto',
};

class SqlSuppliersService extends SqlCrudService {
  constructor() {
    super(TABLE_NAME, 'proveedores');
  }

  /**
   * CRUD OPERATIONS - CREATE
   */

  /**
   * Crear un nuevo proveedor
   * @param {Object} supplierData - Datos del proveedor
   * @param {string} createdBy - Usuario que crea el proveedor
   * @returns {Object} - Resultado de la operación
   */
  async createSupplier(supplierData, createdBy) {
    try {
      // Validar datos requeridos
      if (!supplierData.name) {
        return { success: false, error: 'El nombre del proveedor es requerido' };
      }

      // Verificar que el nombre sea único
      const existingQuery = `
        SELECT TOP 1 id FROM ${TABLE_NAME} WHERE name = @name
      `;

      const pool = await sqlConnection.getConnection();
      const existingResult = await pool.request()
        .input('name', supplierData.name.trim())
        .query(existingQuery);

      if (existingResult.recordset.length > 0) {
        return { 
          success: false, 
          error: `Ya existe un proveedor con el nombre: ${supplierData.name}` 
        };
      }

      // Verificar taxId único si se proporciona
      if (supplierData.taxId) {
        const existingTaxQuery = `
          SELECT TOP 1 id FROM ${TABLE_NAME} WHERE taxId = @taxId
        `;

        const existingTaxResult = await pool.request()
          .input('taxId', supplierData.taxId.trim())
          .query(existingTaxQuery);

        if (existingTaxResult.recordset.length > 0) {
          return { 
            success: false, 
            error: `Ya existe un proveedor con el NIT/RUT: ${supplierData.taxId}` 
          };
        }
      }

      // Preparar datos del proveedor
      const supplier = {
        name: supplierData.name.trim(),
        taxId: supplierData.taxId?.trim() || null,
        type: supplierData.type || SUPPLIER_TYPES.PROVEEDOR,
        category: supplierData.category || SUPPLIER_CATEGORIES.COMBUSTIBLES,
        contactPerson: supplierData.contactPerson || '',
        phone: supplierData.phone || '',
        email: supplierData.email || '',
        address: supplierData.address || '',
        city: supplierData.city || '',
        state: supplierData.state || 'Colombia',
        fuelTypes: JSON.stringify(supplierData.fuelTypes || []),
        paymentTerms: supplierData.paymentTerms || 'contado',
        creditLimit: supplierData.creditLimit || 0,
        priceList: JSON.stringify(supplierData.priceList || {}),
        rating: supplierData.rating || 5.0,
        evaluationNotes: supplierData.evaluationNotes || '',
        status: supplierData.status || SUPPLIER_STATUS.ACTIVE,
        isPreferred: supplierData.isPreferred || false,
        totalOrders: 0,
        totalPurchased: 0,
        lastOrderDate: null,
        averageDeliveryTime: supplierData.averageDeliveryTime || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: createdBy,
        updatedBy: createdBy,
      };

      const result = await this.create(supplier);
      
      return {
        success: true,
        data: result,
        message: `Proveedor ${supplierData.name} creado exitosamente`,
      };

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
   * @param {Object} options - Opciones de filtrado
   * @returns {Array} - Lista de proveedores
   */
  async getSuppliers(options = {}) {
    try {
      let query = `SELECT * FROM ${TABLE_NAME}`;
      const conditions = [];
      const pool = await sqlConnection.getConnection();
      const request = pool.request();

      // Filtros opcionales
      if (options.status) {
        conditions.push('status = @status');
        request.input('status', options.status);
      }

      if (options.type) {
        conditions.push('type = @type');
        request.input('type', options.type);
      }

      if (options.category) {
        conditions.push('category = @category');
        request.input('category', options.category);
      }

      if (options.isPreferred !== undefined) {
        conditions.push('isPreferred = @isPreferred');
        request.input('isPreferred', options.isPreferred);
      }

      if (options.search) {
        conditions.push('(name LIKE @search OR contactPerson LIKE @search OR email LIKE @search)');
        request.input('search', `%${options.search}%`);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ` ORDER BY isPreferred DESC, name`;

      const result = await request.query(query);
      
      // Procesar datos de respuesta
      return result.recordset.map(supplier => ({
        ...supplier,
        fuelTypes: this.parseJSON(supplier.fuelTypes),
        priceList: this.parseJSON(supplier.priceList),
      }));

    } catch (error) {
      console.error('Error obteniendo proveedores:', error);
      throw error;
    }
  }

  /**
   * Obtener proveedor por ID
   * @param {string} supplierId - ID del proveedor
   * @returns {Object} - Datos del proveedor
   */
  async getSupplier(supplierId) {
    try {
      const result = await this.getById(supplierId);
      
      if (result) {
        return {
          ...result,
          fuelTypes: this.parseJSON(result.fuelTypes),
          priceList: this.parseJSON(result.priceList),
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
   * @param {string} updatedBy - Usuario que actualiza
   * @returns {Object} - Resultado de la operación
   */
  async updateSupplier(supplierId, updateData, updatedBy) {
    try {
      // Preparar datos de actualización
      const updateItem = {
        ...updateData,
        updatedBy: updatedBy,
        updatedAt: new Date(),
      };

      // Procesar arrays/objetos como JSON
      if (updateItem.fuelTypes && Array.isArray(updateItem.fuelTypes)) {
        updateItem.fuelTypes = JSON.stringify(updateItem.fuelTypes);
      }

      if (updateItem.priceList && typeof updateItem.priceList === 'object') {
        updateItem.priceList = JSON.stringify(updateItem.priceList);
      }

      // Verificar unicidad del nombre si se actualiza
      if (updateItem.name) {
        const existingQuery = `
          SELECT TOP 1 id FROM ${TABLE_NAME} WHERE name = @name AND id != @id
        `;

        const pool = await sqlConnection.getConnection();
        const existingResult = await pool.request()
          .input('name', updateItem.name.trim())
          .input('id', supplierId)
          .query(existingQuery);

        if (existingResult.recordset.length > 0) {
          return { 
            success: false, 
            error: `Ya existe un proveedor con el nombre: ${updateItem.name}` 
          };
        }
      }

      // Verificar unicidad del taxId si se actualiza
      if (updateItem.taxId) {
        const existingTaxQuery = `
          SELECT TOP 1 id FROM ${TABLE_NAME} WHERE taxId = @taxId AND id != @id
        `;

        const pool = await sqlConnection.getConnection();
        const existingTaxResult = await pool.request()
          .input('taxId', updateItem.taxId.trim())
          .input('id', supplierId)
          .query(existingTaxQuery);

        if (existingTaxResult.recordset.length > 0) {
          return { 
            success: false, 
            error: `Ya existe un proveedor con el NIT/RUT: ${updateItem.taxId}` 
          };
        }
      }

      const result = await this.update(supplierId, updateItem);
      
      return {
        success: true,
        data: result,
        message: 'Proveedor actualizado exitosamente',
      };

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
   * @returns {Object} - Resultado de la operación
   */
  async updateSupplierStats(supplierId, stats) {
    try {
      const updateData = {
        totalOrders: stats.totalOrders,
        totalPurchased: stats.totalPurchased,
        lastOrderDate: stats.lastOrderDate,
        averageDeliveryTime: stats.averageDeliveryTime,
        updatedAt: new Date(),
        updatedBy: 'system',
      };

      await this.update(supplierId, updateData);
      
      return { success: true, message: 'Estadísticas actualizadas exitosamente' };

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
   * @returns {Object} - Resultado de la operación
   */
  async deleteSupplier(supplierId) {
    try {
      // Verificar que no tenga órdenes asociadas
      const supplier = await this.getById(supplierId);
      if (supplier && supplier.totalOrders > 0) {
        return { 
          success: false, 
          error: 'No se puede eliminar un proveedor que tiene órdenes asociadas. Considere marcarlo como inactivo.' 
        };
      }

      await this.delete(supplierId);
      
      return {
        success: true,
        message: 'Proveedor eliminado exitosamente',
      };

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
        const data = await this.getSuppliers();
        callback(data, null);
      } catch (error) {
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
   * @returns {Array} - Lista de proveedores preferidos
   */
  async getPreferredSuppliers() {
    try {
      return await this.getSuppliers({ 
        isPreferred: true, 
        status: SUPPLIER_STATUS.ACTIVE 
      });
    } catch (error) {
      console.error('Error obteniendo proveedores preferidos:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de proveedores
   * @returns {Object} - Estadísticas de proveedores
   */
  async getSupplierStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as totalSuppliers,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as activeSuppliers,
          COUNT(CASE WHEN isPreferred = 1 THEN 1 END) as preferredSuppliers,
          AVG(rating) as averageRating,
          SUM(totalPurchased) as totalPurchased,
          COUNT(CASE WHEN totalOrders > 0 THEN 1 END) as suppliersWithOrders,
          AVG(averageDeliveryTime) as avgDeliveryTime
        FROM ${TABLE_NAME}
      `;

      const pool = await sqlConnection.getConnection();
      const result = await pool.request().query(query);
      
      return result.recordset[0];

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

export default SqlSuppliersService;

// Funciones de compatibilidad con el servicio anterior
export const createSupplier = async (supplierData, createdBy) => {
  const service = new SqlSuppliersService();
  return service.createSupplier(supplierData, createdBy);
};

export const subscribeToSuppliers = (callback) => {
  const service = new SqlSuppliersService();
  return service.subscribeToSuppliers(callback);
};

export const updateSupplier = async (supplierId, updateData, updatedBy) => {
  const service = new SqlSuppliersService();
  return service.updateSupplier(supplierId, updateData, updatedBy);
};

export const deleteSupplier = async (supplierId) => {
  const service = new SqlSuppliersService();
  return service.deleteSupplier(supplierId);
};

export const getSupplier = async (supplierId) => {
  const service = new SqlSuppliersService();
  return service.getSupplier(supplierId);
};