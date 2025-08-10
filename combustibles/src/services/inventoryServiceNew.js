/**
 * InventoryService - Servicio refactorizado para gestión de inventario de combustibles
 * Utiliza BaseService y CRUDService para operaciones optimizadas
 */
import { CRUDService } from './base/CRUDService.js';
import { FUEL_INFO, getStockLevel } from '../constants/combustibleTypes';

class InventoryService extends CRUDService {
  constructor() {
    super('combustibles_inventory', {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'fuelType',
      defaultOrderDirection: 'asc',
    });
  }

  validateData(data) {
    const baseValidation = super.validateData(data);
    if (!baseValidation.isValid) return baseValidation;

    const errors = [];

    // Validar tipo de combustible
    if (!data.fuelType || !FUEL_INFO[data.fuelType]) {
      errors.push('Tipo de combustible no válido');
    }

    // Validar capacidad máxima
    if (!data.maxCapacity || Number(data.maxCapacity) <= 0) {
      errors.push('La capacidad máxima debe ser mayor a cero');
    }

    // Validar stock actual
    if (data.currentStock && Number(data.currentStock) < 0) {
      errors.push('El stock actual no puede ser negativo');
    }

    // Validar ubicación
    if (!data.location || data.location.trim().length === 0) {
      errors.push('La ubicación es requerida');
    }

    return { isValid: errors.length === 0, errors };
  }

  processData(data, isUpdate = false) {
    const baseProcessed = super.processData(data, isUpdate);

    // Agregar información del combustible
    if (data.fuelType && FUEL_INFO[data.fuelType]) {
      const fuelInfo = FUEL_INFO[data.fuelType];
      baseProcessed.name = fuelInfo.name;
      baseProcessed.unit = fuelInfo.unit;
      baseProcessed.description = data.description || fuelInfo.description;
    }

    // Procesar números
    if (data.currentStock !== undefined) {
      baseProcessed.currentStock = Number(data.currentStock) || 0;
    }
    if (data.maxCapacity !== undefined) {
      baseProcessed.maxCapacity = Number(data.maxCapacity);
    }
    if (data.minThreshold !== undefined) {
      baseProcessed.minThreshold = Number(data.minThreshold) || baseProcessed.maxCapacity * 0.15;
    }
    if (data.pricePerUnit !== undefined) {
      baseProcessed.pricePerUnit = Number(data.pricePerUnit) || 0;
    }

    // Normalizar ubicación
    if (data.location) {
      baseProcessed.location = data.location.toLowerCase();
    }

    // Estado por defecto
    if (!isUpdate && !data.status) {
      baseProcessed.status = 'active';
    }

    return baseProcessed;
  }

  async checkDuplicates(data, excludeId = null) {
    const filters = [
      { field: 'fuelType', operator: '==', value: data.fuelType },
      { field: 'location', operator: '==', value: data.location?.toLowerCase() },
    ];

    const result = await this.getAll(filters);
    if (!result.success) return { hasDuplicates: false };

    const duplicates = result.data.filter((item) => item.id !== excludeId);

    if (duplicates.length > 0 && FUEL_INFO[data.fuelType]) {
      const fuelInfo = FUEL_INFO[data.fuelType];
      return {
        hasDuplicates: true,
        message: `Ya existe ${fuelInfo.name} en ${data.location}`,
      };
    }

    return { hasDuplicates: false };
  }

  enrichData(item) {
    return {
      ...item,
      stockLevel: getStockLevel(item.currentStock, item.maxCapacity),
      stockPercentage: Math.round((item.currentStock / item.maxCapacity) * 100),
      needsRestock: item.currentStock <= item.minThreshold,
    };
  }

  async createInventory(data, user) {
    return await this.create(data, user);
  }

  async getAllInventory() {
    const result = await this.getAll();
    if (!result.success) return result;

    // Enriquecer datos con cálculos de stock
    const enrichedData = result.data.map((item) => this.enrichData(item));

    return { ...result, data: enrichedData };
  }

  async getInventoryById(id) {
    const result = await this.getById(id);
    if (!result.success) return result;

    // Enriquecer datos con cálculos de stock
    const enrichedData = this.enrichData(result.data);

    return { ...result, data: enrichedData };
  }

  async updateInventory(id, data, user) {
    return await this.update(id, data, user);
  }

  async deleteInventory(id) {
    return await this.delete(id);
  }

  async getLowStockItems() {
    const result = await this.getAllInventory();
    if (!result.success) return result;

    const lowStockItems = result.data.filter((item) => item.needsRestock);

    return { success: true, data: lowStockItems };
  }

  async updateStock(itemId, newStock, updatedBy) {
    try {
      // Validar que no se intente dejar el stock en negativo
      if (Number(newStock) < 0) {
        return {
          success: false,
          error: 'No hay suficiente stock disponible para realizar esta salida.',
        };
      }

      const updateData = {
        currentStock: Number(newStock),
      };

      const result = await this.update(itemId, updateData, updatedBy);

      if (result.success) {
        return {
          success: true,
          message: 'Stock actualizado exitosamente',
        };
      }

      return result;
    } catch (error) {
      this.logError('updateStock', error, { itemId, newStock, updatedBy });
      return { success: false, error: error.message };
    }
  }

  async getInventoryStats() {
    try {
      const result = await this.getAllInventory();
      if (!result.success) return result;

      const items = result.data;
      const stats = {
        totalItems: items.length,
        activeItems: items.filter((item) => item.status === 'active').length,
        lowStockItems: items.filter((item) => item.needsRestock).length,
        totalValue: items.reduce((sum, item) => sum + item.currentStock * item.pricePerUnit, 0),
        averageStockLevel:
          items.length > 0
            ? Math.round(items.reduce((sum, item) => sum + item.stockPercentage, 0) / items.length)
            : 0,
        byFuelType: {},
      };

      // Estadísticas por tipo de combustible
      items.forEach((item) => {
        if (!stats.byFuelType[item.fuelType]) {
          stats.byFuelType[item.fuelType] = {
            count: 0,
            totalStock: 0,
            totalCapacity: 0,
            totalValue: 0,
          };
        }

        stats.byFuelType[item.fuelType].count++;
        stats.byFuelType[item.fuelType].totalStock += item.currentStock;
        stats.byFuelType[item.fuelType].totalCapacity += item.maxCapacity;
        stats.byFuelType[item.fuelType].totalValue += item.currentStock * item.pricePerUnit;
      });

      return { success: true, data: stats };
    } catch (error) {
      this.logError('getInventoryStats', error);
      return { success: false, error: error.message };
    }
  }

  async batchUpdateInventory(updates, updatedBy) {
    try {
      const batchUpdates = updates.map((update) => ({
        id: update.id,
        data: update.data,
      }));

      const result = await this.batchUpdate(batchUpdates, updatedBy);

      if (result.success) {
        return {
          success: true,
          message: `${updates.length} items actualizados exitosamente`,
        };
      }

      return result;
    } catch (error) {
      this.logError('batchUpdateInventory', error, { updates, updatedBy });
      return { success: false, error: error.message };
    }
  }

  subscribeToInventory(callback) {
    // Wrapper para enriquecer datos en tiempo real
    return this.subscribeToChanges(
      (items, error) => {
        if (error) {
          callback(null, error);
          return;
        }

        const enrichedItems = items.map((item) => this.enrichData(item));
        callback(enrichedItems);
      },
      {
        orderBy: 'fuelType',
        orderDirection: 'asc',
      }
    );
  }
}

// Singleton
const inventoryService = new InventoryService();

// Exports para compatibilidad con código existente
export const createInventoryItem = (data, user) => inventoryService.createInventory(data, user);
export const getAllInventoryItems = () => inventoryService.getAllInventory();
export const getInventoryItem = (id) => inventoryService.getInventoryById(id);
export const updateInventoryItem = (id, data, user) =>
  inventoryService.updateInventory(id, data, user);
export const deleteInventoryItem = (id) => inventoryService.deleteInventory(id);
export const getLowStockItems = () => inventoryService.getLowStockItems();
export const updateStock = (itemId, newStock, user) =>
  inventoryService.updateStock(itemId, newStock, user);
export const getInventoryStats = () => inventoryService.getInventoryStats();
export const batchUpdateInventory = (updates, user) =>
  inventoryService.batchUpdateInventory(updates, user);
export const subscribeToInventory = (callback) => inventoryService.subscribeToInventory(callback);

export default inventoryService;
