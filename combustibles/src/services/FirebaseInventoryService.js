/**
 * FirebaseInventoryService - Servicio de inventario usando Firebase Functions
 * Reemplaza SqlInventoryService para usar endpoints SQL migrados
 * Forestech Combustibles App
 */

import HttpService from './base/HttpService.js';
import { FUEL_INFO, getStockLevel } from '../constants/combustibleTypes.js';

// Estados del inventario
export const INVENTORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
};

class FirebaseInventoryService extends HttpService {
  constructor() {
    super();
  }

  /**
   * CRUD OPERATIONS - CREATE
   */

  /**
   * Crear nuevo tipo de combustible en inventario
   * @param {Object} inventoryData - Datos del combustible
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async createInventoryItem(inventoryData) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Normalizar fuelType a mayúsculas
      if (inventoryData.fuelType) {
        inventoryData.fuelType = inventoryData.fuelType.toUpperCase();
      }

      const fuelInfo = FUEL_INFO[inventoryData.fuelType];
      if (!fuelInfo) {
        return { success: false, error: 'Tipo de combustible no válido' };
      }

      const result = await this.callEndpoint('sqlCreateInventoryItem', {
        inventoryData: {
          ...inventoryData,
          createdBy: this.getCurrentUser()?.uid
        }
      });

      return result;
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
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Array>} - Lista de items de inventario
   */
  async getInventory(filters = {}) {
    try {
      const result = await this.callEndpoint('sqlGetAllInventory', { filters });

      if (result.success && result.data) {
        // Enriquecer datos con información adicional
        return result.data.map(item => {
          const fuelInfo = FUEL_INFO[item.fuelType] || {};
          return {
            ...item,
            stockLevel: getStockLevel(item.currentStock, item.minThreshold, item.maxCapacity),
            fuelInfo: fuelInfo,
            stockPercentage: (item.currentStock / item.maxCapacity) * 100,
          };
        });
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo inventario:', error);
      throw error;
    }
  }

  /**
   * Obtener item específico por ID
   * @param {string} itemId - ID del item
   * @returns {Promise<Object>} - Item de inventario
   */
  async getInventoryItem(itemId) {
    try {
      const result = await this.callEndpoint('sqlGetInventoryItem', { itemId });

      if (result.success && result.data) {
        const fuelInfo = FUEL_INFO[result.data.fuelType] || {};
        return {
          ...result.data,
          stockLevel: getStockLevel(result.data.currentStock, result.data.minThreshold, result.data.maxCapacity),
          fuelInfo: fuelInfo,
          stockPercentage: (result.data.currentStock / result.data.maxCapacity) * 100,
        };
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo item de inventario:', error);
      throw error;
    }
  }

  /**
   * Obtener inventario por ubicación
   * @param {string} location - Ubicación del inventario
   * @returns {Promise<Array>} - Items de inventario en la ubicación
   */
  async getInventoryByLocation(location) {
    try {
      const result = await this.callEndpoint('sqlGetInventoryByLocation', { location });

      if (result.success && result.data) {
        return result.data.map(item => {
          const fuelInfo = FUEL_INFO[item.fuelType] || {};
          return {
            ...item,
            stockLevel: getStockLevel(item.currentStock, item.minThreshold, item.maxCapacity),
            fuelInfo: fuelInfo,
            stockPercentage: (item.currentStock / item.maxCapacity) * 100,
          };
        });
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo inventario por ubicación:', error);
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
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateInventoryItem(itemId, updateData) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Normalizar fuelType si está presente
      if (updateData.fuelType) {
        updateData.fuelType = updateData.fuelType.toUpperCase();
      }

      const result = await this.callEndpoint('sqlUpdateInventoryItem', {
        itemId,
        updateData: {
          ...updateData,
          updatedBy: this.getCurrentUser()?.uid
        }
      });

      return result;
    } catch (error) {
      console.error('Error actualizando item de inventario:', error);
      return {
        success: false,
        error: 'Error al actualizar el item de inventario: ' + error.message
      };
    }
  }

  /**
   * CRUD OPERATIONS - DELETE
   */

  /**
   * Eliminar item de inventario
   * @param {string} itemId - ID del item
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async deleteInventoryItem(itemId) {
    try {
      const result = await this.callEndpoint('sqlDeleteInventoryItem', { itemId });
      return result;
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
    let isActive = true;

    const poll = async () => {
      if (!isActive) return;

      try {
        // Verificar circuit breaker ANTES de intentar autenticación
        if (!this.isEndpointAvailable('sqlGetAllInventory')) {
          console.warn('⚡ InventoryService: Circuit breaker abierto, omitiendo polling por 5 minutos');
          callback([], null); // Devolver array vacío
          if (isActive) {
            setTimeout(poll, 300000); // Poll cada 5 minutos cuando circuit breaker activo
          }
          return;
        }

        // Verificar autenticación antes de hacer la llamada
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
          console.log('🔒 InventoryService: Usuario no autenticado, omitiendo polling');
          callback([], null); // Devolver array vacío en lugar de error
          if (isActive) {
            setTimeout(poll, 60000); // Poll cada 1 minuto cuando no autenticado
          }
          return;
        }

        const data = await this.getInventory();
        callback(data, null);
        
        // Éxito - usar intervalo normal
        if (isActive) {
          setTimeout(poll, 30000); // Poll cada 30 segundos
        }
      } catch (error) {
        console.error('❌ Error en polling de inventario:', error);
        callback(null, error);
        
        // Backoff exponencial basado en si es circuit breaker error
        let nextInterval = 30000; // 30 segundos default
        
        if (error.circuitBreakerOpen) {
          nextInterval = 300000; // 5 minutos si circuit breaker está abierto
          console.warn('⚡ InventoryService: Circuit breaker detectado, esperando 5 minutos');
        } else if (error.message && error.message.includes('404')) {
          nextInterval = 120000; // 2 minutos para errores 404
          console.warn('🔍 InventoryService: Endpoint no disponible, esperando 2 minutos');
        }
        
        if (isActive) {
          setTimeout(poll, nextInterval);
        }
        return;
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
   * @returns {Promise<Array>} - Items con stock bajo
   */
  async getLowStockItems() {
    try {
      const result = await this.callEndpoint('sqlGetLowStockItems');

      if (result.success && result.data) {
        return result.data.map(item => {
          const fuelInfo = FUEL_INFO[item.fuelType] || {};
          return {
            ...item,
            stockLevel: getStockLevel(item.currentStock, item.minThreshold, item.maxCapacity),
            fuelInfo: fuelInfo,
            stockPercentage: (item.currentStock / item.maxCapacity) * 100,
          };
        });
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo items con stock bajo:', error);
      throw error;
    }
  }

  /**
   * Obtener resumen del inventario
   * @returns {Promise<Object>} - Resumen estadístico
   */
  async getInventorySummary() {
    try {
      const result = await this.callEndpoint('sqlGetInventorySummary');
      return result.success ? result.data : null;
    } catch (error) {
      console.error('Error obteniendo resumen de inventario:', error);
      throw error;
    }
  }
}

export default FirebaseInventoryService;

// Funciones de compatibilidad con el servicio anterior
export const createInventoryItem = async (inventoryData) => {
  const service = new FirebaseInventoryService();
  return service.createInventoryItem(inventoryData);
};

export const subscribeToInventory = (callback) => {
  const service = new FirebaseInventoryService();
  return service.subscribeToInventory(callback);
};

export const updateInventoryItem = async (itemId, updateData) => {
  const service = new FirebaseInventoryService();
  return service.updateInventoryItem(itemId, updateData);
};

export const deleteInventoryItem = async (itemId) => {
  const service = new FirebaseInventoryService();
  return service.deleteInventoryItem(itemId);
};