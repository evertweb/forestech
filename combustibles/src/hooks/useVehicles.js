/**
 * useVehicles - Custom hook para gestión de vehículos
 * Encapsula toda la lógica de CRUD de vehículos
 * 
 * @returns {object} Estado y métodos de vehículos
 */

import { useState, useCallback } from 'react';
import FirebaseVehiclesService from '../services/FirebaseVehiclesService';

const vehiclesService = new FirebaseVehiclesService();

export const useVehicles = () => {
  // Estado
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  /**
   * Obtener todos los vehículos
   * @param {object} filters - Filtros opcionales (categoría, estado, etc)
   */
  const fetchVehicles = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await vehiclesService.getAll(filters);

      if (result.success) {
        setVehicles(result.data || []);
      } else {
        setError(result.error || 'Error al cargar vehículos');
      }
    } catch (err) {
      console.error('❌ Error fetching vehicles:', err);
      setError('Error al cargar vehículos');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener un vehículo por ID
   * @param {string} vehicleId - ID del vehículo
   */
  const getVehicle = useCallback(async (vehicleId) => {
    try {
      const result = await vehiclesService.getById(vehicleId);
      
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err) {
      console.error('❌ Error getting vehicle:', err);
      return null;
    }
  }, []);

  /**
   * Crear nuevo vehículo
   * @param {object} vehicleData - Datos del vehículo
   */
  const createVehicle = useCallback(async (vehicleData) => {
    try {
      setSaving(true);
      setError(null);

      const result = await vehiclesService.create(vehicleData);

      if (result.success) {
        // Refrescar lista después de crear
        await fetchVehicles();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Error al crear vehículo');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error creating vehicle:', err);
      const errorMsg = err.message || 'Error al crear vehículo';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  }, [fetchVehicles]);

  /**
   * Actualizar vehículo existente
   * @param {string} vehicleId - ID del vehículo
   * @param {object} updates - Datos a actualizar
   */
  const updateVehicle = useCallback(async (vehicleId, updates) => {
    try {
      setSaving(true);
      setError(null);

      const result = await vehiclesService.update(vehicleId, updates);

      if (result.success) {
        // Refrescar lista después de actualizar
        await fetchVehicles();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Error al actualizar vehículo');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error updating vehicle:', err);
      setError('Error al actualizar vehículo');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [fetchVehicles]);

  /**
   * Eliminar un vehículo
   * @param {string} vehicleId - ID del vehículo
   */
  const deleteVehicle = useCallback(async (vehicleId) => {
    try {
      setSaving(true);
      setError(null);

      const result = await vehiclesService.delete(vehicleId);

      if (result.success) {
        // Refrescar lista después de eliminar
        await fetchVehicles();
        return { success: true };
      } else {
        setError(result.error || 'Error al eliminar vehículo');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error deleting vehicle:', err);
      setError('Error al eliminar vehículo');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [fetchVehicles]);

  /**
   * Obtener vehículos activos (filtro rápido)
   */
  const fetchActiveVehicles = useCallback(async () => {
    return fetchVehicles({ status: 'active' });
  }, [fetchVehicles]);

  /**
   * Obtener vehículos por tipo de combustible
   * @param {string} fuelType - Tipo de combustible
   */
  const getVehiclesByFuelType = useCallback(async (fuelType) => {
    return fetchVehicles({ fuelType });
  }, [fetchVehicles]);

  return {
    // Estado
    vehicles,
    loading,
    error,
    saving,

    // Métodos
    fetchVehicles,
    fetchActiveVehicles,
    getVehicle,
    getVehiclesByFuelType,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
};

export default useVehicles;

