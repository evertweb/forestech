/**
 * useInventory - Custom hook para gestión de inventario de combustibles
 * Encapsula toda la lógica de inventario y stock
 * 
 * @returns {object} Estado y métodos de inventario
 */

import { useState, useCallback } from 'react';
import FirebaseInventoryService from '../services/FirebaseInventoryService';

const inventoryService = new FirebaseInventoryService();

export const useInventory = () => {
  // Estado
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  /**
   * Obtener todo el inventario
   * @param {object} filters - Filtros opcionales (ubicación, tipo, etc)
   */
  const fetchInventory = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await inventoryService.getAll(filters);

      if (result.success) {
        setInventory(result.data || []);
      } else {
        setError(result.error || 'Error al cargar inventario');
      }
    } catch (err) {
      console.error('❌ Error fetching inventory:', err);
      setError('Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener inventario por ubicación
   * @param {string} location - Ubicación
   */
  const getByLocation = useCallback(async (location) => {
    try {
      const result = await inventoryService.getByLocation(location);
      
      if (result.success) {
        return result.data || [];
      }
      return [];
    } catch (err) {
      console.error('❌ Error getting inventory by location:', err);
      return [];
    }
  }, []);

  /**
   * Obtener stock disponible de un combustible en una ubicación
   * @param {string} fuelType - Tipo de combustible
   * @param {string} location - Ubicación
   */
  const getAvailableStock = useCallback(async (fuelType, location) => {
    try {
      const result = await inventoryService.getAvailableStock({
        fuelType,
        location
      });
      
      if (result.success) {
        return {
          available: result.data?.currentStock || 0,
          maxCapacity: result.data?.maxCapacity || 0,
          minThreshold: result.data?.minThreshold || 0,
          isLow: result.data?.isLow || false,
        };
      }
      return { available: 0, maxCapacity: 0, minThreshold: 0, isLow: false };
    } catch (err) {
      console.error('❌ Error getting available stock:', err);
      return { available: 0, maxCapacity: 0, minThreshold: 0, isLow: false };
    }
  }, []);

  /**
   * Validar si hay stock suficiente
   * @param {string} fuelType - Tipo de combustible
   * @param {string} location - Ubicación
   * @param {number} quantity - Cantidad requerida
   */
  const validateStock = useCallback(async (fuelType, location, quantity) => {
    try {
      const stockInfo = await getAvailableStock(fuelType, location);
      
      const hasEnough = stockInfo.available >= quantity;
      
      return {
        valid: hasEnough,
        available: stockInfo.available,
        required: quantity,
        remaining: stockInfo.available - quantity,
        message: hasEnough 
          ? 'Stock suficiente' 
          : `Stock insuficiente. Disponible: ${stockInfo.available}, Requerido: ${quantity}`
      };
    } catch (err) {
      console.error('❌ Error validating stock:', err);
      return {
        valid: false,
        message: 'Error al validar stock'
      };
    }
  }, [getAvailableStock]);

  /**
   * Crear nueva ubicación de inventario
   * @param {object} inventoryData - Datos de la ubicación
   */
  const createInventoryLocation = useCallback(async (inventoryData) => {
    try {
      setSaving(true);
      setError(null);

      const result = await inventoryService.create(inventoryData);

      if (result.success) {
        // Refrescar inventario después de crear
        await fetchInventory();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Error al crear ubicación de inventario');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error creating inventory location:', err);
      const errorMsg = err.message || 'Error al crear ubicación';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  }, [fetchInventory]);

  /**
   * Actualizar ubicación de inventario
   * @param {string} inventoryId - ID de la ubicación
   * @param {object} updates - Datos a actualizar
   */
  const updateInventoryLocation = useCallback(async (inventoryId, updates) => {
    try {
      setSaving(true);
      setError(null);

      const result = await inventoryService.update(inventoryId, updates);

      if (result.success) {
        // Refrescar inventario después de actualizar
        await fetchInventory();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Error al actualizar inventario');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error updating inventory:', err);
      setError('Error al actualizar inventario');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [fetchInventory]);

  /**
   * Obtener alertas de stock bajo
   */
  const getLowStockAlerts = useCallback(async () => {
    try {
      const result = await inventoryService.getLowStockAlerts();
      
      if (result.success) {
        return result.data || [];
      }
      return [];
    } catch (err) {
      console.error('❌ Error getting low stock alerts:', err);
      return [];
    }
  }, []);

  /**
   * Obtener estadísticas de inventario
   */
  const getStats = useCallback(async () => {
    try {
      const result = await inventoryService.getStats();
      
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err) {
      console.error('❌ Error getting inventory stats:', err);
      return null;
    }
  }, []);

  return {
    // Estado
    inventory,
    loading,
    error,
    saving,

    // Métodos
    fetchInventory,
    getByLocation,
    getAvailableStock,
    validateStock,
    createInventoryLocation,
    updateInventoryLocation,
    getLowStockAlerts,
    getStats,
  };
};

export default useInventory;

