/**
 * SqlInventoryService - Servicio de inventario usando Azure SQL Server
 * Migración completa del inventoryService original
 * Forestech Combustibles App
 */

import SqlCrudService from './base/SqlCrudService.js';
import sqlConnection from './base/SqlConnection.js';
import { FUEL_INFO, getStockLevel } from '../constants/combustibleTypes.js';

const TABLE_NAME = 'combustibles_inventory';

// Estados del inventario
export const INVENTORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
};

class SqlInventoryService extends SqlCrudService {
  constructor() {
    super(TABLE_NAME, 'inventario');
  }

  /**
   * CRUD OPERATIONS - CREATE
   */

  /**
   * Crear nuevo tipo de combustible en inventario
   * @param {Object} inventoryData - Datos del combustible
   * @param {string} createdBy - Usuario que crea el item
   * @returns {Object} - Resultado de la operación
   */
  async createInventoryItem(inventoryData, createdBy) {
    try {
      // Normalizar fuelType a mayúsculas
      if (inventoryData.fuelType) {
        inventoryData.fuelType = inventoryData.fuelType.toUpperCase();
      }

      const fuelInfo = FUEL_INFO[inventoryData.fuelType];
      if (!fuelInfo) {
        return { success: false, error: 'Tipo de combustible no válido' };
      }

      // Verificar que no exista duplicado del mismo tipo en la misma ubicación
      const existingQuery = `
        SELECT TOP 1 id FROM ${TABLE_NAME} 
        WHERE fuelType = @fuelType AND location = @location
      `;

      const pool = await sqlConnection.getConnection();
      const existingResult = await pool.request()
        .input('fuelType', inventoryData.fuelType)
        .input('location', inventoryData.location.toLowerCase())
        .query(existingQuery);

      if (existingResult.recordset.length > 0) {
        return { 
          success: false, 
          error: `Ya existe un inventario de ${inventoryData.fuelType} en ${inventoryData.location}` 
        };
      }

      // Preparar datos del inventario
      const inventoryItem = {
        fuelType: inventoryData.fuelType,
        name: inventoryData.name || fuelInfo.name,
        description: inventoryData.description || '',
        currentStock: inventoryData.currentStock || 0,
        maxCapacity: inventoryData.maxCapacity || 1000,
        minThreshold: inventoryData.minThreshold || 100,
        unit: inventoryData.unit || fuelInfo.unit || 'galones',
        location: inventoryData.location.toLowerCase(),
        pricePerUnit: inventoryData.pricePerUnit || 0,
        supplier: inventoryData.supplier || '',
        status: inventoryData.status || INVENTORY_STATUS.ACTIVE,
        createdBy: createdBy,
        updatedBy: createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await this.create(inventoryItem);
      
      return {
        success: true,
        data: result,
        message: `Inventario de ${inventoryData.fuelType} creado exitosamente`,
      };

    } catch (error) {
      console.error('Error creando item de inventario:', error);
      return { 
        success: false, 
        error: 'Error al crear el item de inventario: ' + error.message 
      };
    }
  }

  /**
   * CRUD OPERATIONS - READ
   */

  /**
   * Obtener todos los items del inventario
   * @param {Object} options - Opciones de filtrado
   * @returns {Array} - Lista de items de inventario
   */
  async getInventory(options = {}) {
    try {
      let query = `SELECT * FROM ${TABLE_NAME}`;
      const conditions = [];
      const pool = await sqlConnection.getConnection();
      const request = pool.request();

      // Filtros opcionales
      if (options.fuelType) {
        conditions.push('fuelType = @fuelType');
        request.input('fuelType', options.fuelType.toUpperCase());
      }

      if (options.location) {
        conditions.push('location = @location');
        request.input('location', options.location.toLowerCase());
      }

      if (options.status) {
        conditions.push('status = @status');
        request.input('status', options.status);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ` ORDER BY fuelType, location`;

      const result = await request.query(query);
      
      // Enriquecer datos con información adicional
      const enrichedData = result.recordset.map(item => {
        const fuelInfo = FUEL_INFO[item.fuelType] || {};
        return {
          ...item,
          stockLevel: getStockLevel(item.currentStock, item.minThreshold, item.maxCapacity),
          fuelInfo: fuelInfo,
          stockPercentage: (item.currentStock / item.maxCapacity) * 100,
        };
      });

      return enrichedData;

    } catch (error) {
      console.error('Error obteniendo inventario:', error);
      throw error;
    }
  }

  /**
   * Obtener item específico por ID
   * @param {string} itemId - ID del item
   * @returns {Object} - Item de inventario
   */
  async getInventoryItem(itemId) {
    try {
      const result = await this.getById(itemId);
      
      if (result) {
        const fuelInfo = FUEL_INFO[result.fuelType] || {};
        return {
          ...result,
          stockLevel: getStockLevel(result.currentStock, result.minThreshold, result.maxCapacity),
          fuelInfo: fuelInfo,
          stockPercentage: (result.currentStock / result.maxCapacity) * 100,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error obteniendo item de inventario:', error);
      throw error;
    }
  }

  /**
   * CRUD OPERATIONS - UPDATE
   */

  /**
   * Actualizar item de inventario
   * @param {string} itemId - ID del item
   * @param {Object} updateData - Datos a actualizar
   * @param {string} updatedBy - Usuario que actualiza
   * @returns {Object} - Resultado de la operación
   */
  async updateInventoryItem(itemId, updateData, updatedBy) {
    try {
      // Preparar datos de actualización
      const updateItem = {
        ...updateData,
        updatedBy: updatedBy,
        updatedAt: new Date(),
      };

      // Normalizar fuelType si está presente
      if (updateItem.fuelType) {
        updateItem.fuelType = updateItem.fuelType.toUpperCase();
      }

      const result = await this.update(itemId, updateItem);
      
      return {
        success: true,
        data: result,
        message: 'Item de inventario actualizado exitosamente',
      };

    } catch (error) {
      console.error('Error actualizando item de inventario:', error);
      return { 
        success: false, 
        error: 'Error al actualizar el item de inventario: ' + error.message 
      };
    }
  }

  /**
   * Actualizar stock después de un movimiento
   * @param {string} itemId - ID del item
   * @param {number} quantity - Cantidad del movimiento (positiva para entrada, negativa para salida)
   * @param {Object} movementInfo - Información del movimiento
   * @returns {Object} - Resultado de la operación
   */
  async updateStock(itemId, quantity, movementInfo = {}) {
    try {
      const pool = await sqlConnection.getConnection();
      
      // Obtener stock actual
      const getCurrentStockQuery = `
        SELECT currentStock, maxCapacity, minThreshold, fuelType, location 
        FROM ${TABLE_NAME} WHERE id = @itemId
      `;
      
      const currentResult = await pool.request()
        .input('itemId', itemId)
        .query(getCurrentStockQuery);

      if (currentResult.recordset.length === 0) {
        return { success: false, error: 'Item de inventario no encontrado' };
      }

      const currentItem = currentResult.recordset[0];
      const newStock = parseFloat(currentItem.currentStock) + parseFloat(quantity);

      // Validar que el stock no sea negativo
      if (newStock < 0) {
        return { 
          success: false, 
          error: `Stock insuficiente. Stock actual: ${currentItem.currentStock}, cantidad solicitada: ${Math.abs(quantity)}` 
        };
      }

      // Validar que no exceda la capacidad máxima
      if (newStock > currentItem.maxCapacity) {
        return { 
          success: false, 
          error: `La cantidad excede la capacidad máxima. Capacidad: ${currentItem.maxCapacity}, nuevo stock: ${newStock}` 
        };
      }

      // Actualizar stock y información del último movimiento
      const updateStockQuery = `
        UPDATE ${TABLE_NAME} 
        SET 
          currentStock = @newStock,
          lastMovementId = @movementId,
          lastMovementType = @movementType,
          lastMovementQuantity = @movementQuantity,
          lastMovementDate = @movementDate,
          updatedAt = @updatedAt,
          updatedBy = @updatedBy
        WHERE id = @itemId
      `;

      await pool.request()
        .input('itemId', itemId)
        .input('newStock', newStock)
        .input('movementId', movementInfo.movementId || null)
        .input('movementType', movementInfo.type || null)
        .input('movementQuantity', quantity)
        .input('movementDate', movementInfo.date || new Date())
        .input('updatedAt', new Date())
        .input('updatedBy', movementInfo.updatedBy || 'system')
        .query(updateStockQuery);

      return {
        success: true,
        data: {
          previousStock: currentItem.currentStock,
          newStock: newStock,
          quantity: quantity,
        },
        message: 'Stock actualizado exitosamente',
      };

    } catch (error) {
      console.error('Error actualizando stock:', error);
      return { 
        success: false, 
        error: 'Error al actualizar el stock: ' + error.message 
      };
    }
  }

  /**
   * CRUD OPERATIONS - DELETE
   */

  /**
   * Eliminar item de inventario
   * @param {string} itemId - ID del item
   * @returns {Object} - Resultado de la operación
   */
  async deleteInventoryItem(itemId) {
    try {
      // Verificar que no tenga stock
      const item = await this.getById(itemId);
      if (item && item.currentStock > 0) {
        return { 
          success: false, 
          error: 'No se puede eliminar un item con stock. Reduzca el stock a 0 primero.' 
        };
      }

      await this.delete(itemId);
      
      return {
        success: true,
        message: 'Item de inventario eliminado exitosamente',
      };

    } catch (error) {
      console.error('Error eliminando item de inventario:', error);
      return { 
        success: false, 
        error: 'Error al eliminar el item de inventario: ' + error.message 
      };
    }
  }

  /**
   * SUSCRIPCIONES Y REPORTES
   */

  /**
   * Suscribirse a cambios en el inventario
   * @param {Function} callback - Función de callback
   * @returns {Function} - Función para cancelar suscripción
   */
  subscribeToInventory(callback) {
    // Implementar polling cada 30 segundos para simular tiempo real
    let isActive = true;
    
    const poll = async () => {
      if (!isActive) return;
      
      try {
        const data = await this.getInventory();
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
   * Obtener items con stock bajo
   * @returns {Array} - Items con stock bajo
   */
  async getLowStockItems() {
    try {
      const query = `
        SELECT * FROM ${TABLE_NAME} 
        WHERE currentStock <= minThreshold AND status = 'active'
        ORDER BY (currentStock / NULLIF(minThreshold, 0)) ASC
      `;

      const pool = await sqlConnection.getConnection();
      const result = await pool.request().query(query);
      
      return result.recordset.map(item => {
        const fuelInfo = FUEL_INFO[item.fuelType] || {};
        return {
          ...item,
          stockLevel: getStockLevel(item.currentStock, item.minThreshold, item.maxCapacity),
          fuelInfo: fuelInfo,
          stockPercentage: (item.currentStock / item.maxCapacity) * 100,
        };
      });

    } catch (error) {
      console.error('Error obteniendo items con stock bajo:', error);
      throw error;
    }
  }

  /**
   * Obtener resumen del inventario
   * @returns {Object} - Resumen estadístico
   */
  async getInventorySummary() {
    try {
      const query = `
        SELECT 
          COUNT(*) as totalItems,
          SUM(CASE WHEN currentStock <= minThreshold THEN 1 ELSE 0 END) as lowStockItems,
          SUM(currentStock * pricePerUnit) as totalValue,
          AVG(currentStock / NULLIF(maxCapacity, 0) * 100) as avgStockPercentage,
          COUNT(DISTINCT location) as totalLocations,
          COUNT(DISTINCT fuelType) as totalFuelTypes
        FROM ${TABLE_NAME} 
        WHERE status = 'active'
      `;

      const pool = await sqlConnection.getConnection();
      const result = await pool.request().query(query);
      
      return result.recordset[0];

    } catch (error) {
      console.error('Error obteniendo resumen de inventario:', error);
      throw error;
    }
  }
}

export default SqlInventoryService;

// Funciones de compatibilidad con el servicio anterior
export const createInventoryItem = async (inventoryData, createdBy) => {
  const service = new SqlInventoryService();
  return service.createInventoryItem(inventoryData, createdBy);
};

export const subscribeToInventory = (callback) => {
  const service = new SqlInventoryService();
  return service.subscribeToInventory(callback);
};

export const updateInventoryItem = async (itemId, updateData, updatedBy) => {
  const service = new SqlInventoryService();
  return service.updateInventoryItem(itemId, updateData, updatedBy);
};

export const deleteInventoryItem = async (itemId) => {
  const service = new SqlInventoryService();
  return service.deleteInventoryItem(itemId);
};