/**
 * useMovements - Custom hook para gestión de movimientos de combustible
 * Encapsula toda la lógica de CRUD de movimientos
 * 
 * SIMPLIFICADO: Solo soporta ENTRADA y SALIDA (según refactoring)
 * 
 * @returns {object} Estado y métodos de movimientos
 */

import { useState, useCallback } from 'react';
import FirebaseMovementsService from '../services/FirebaseMovementsService';

const movementsService = new FirebaseMovementsService();

export const useMovements = () => {
  // Estado
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  /**
   * Obtener todos los movimientos
   * @param {object} filters - Filtros opcionales (tipo, fecha, vehículo)
   */
  const fetchMovements = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await movementsService.getAll(filters);

      if (result.success) {
        setMovements(result.data || []);
      } else {
        setError(result.error || 'Error al cargar movimientos');
      }
    } catch (err) {
      console.error('❌ Error fetching movements:', err);
      setError('Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crear nuevo movimiento (ENTRADA o SALIDA)
   * @param {object} movementData - Datos del movimiento
   */
  const createMovement = useCallback(async (movementData) => {
    try {
      setCreating(true);
      setError(null);

      // Validar que solo sea ENTRADA o SALIDA
      if (!['entrada', 'salida'].includes(movementData.type?.toLowerCase())) {
        throw new Error('Solo se permiten movimientos de tipo ENTRADA o SALIDA');
      }

      const result = await movementsService.create(movementData);

      if (result.success) {
        // Refrescar lista después de crear
        await fetchMovements();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Error al crear movimiento');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error creating movement:', err);
      const errorMsg = err.message || 'Error al crear movimiento';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setCreating(false);
    }
  }, [fetchMovements]);

  /**
   * Eliminar un movimiento
   * @param {string} movementId - ID del movimiento
   */
  const deleteMovement = useCallback(async (movementId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await movementsService.delete(movementId);

      if (result.success) {
        // Refrescar lista después de eliminar
        await fetchMovements();
        return { success: true };
      } else {
        setError(result.error || 'Error al eliminar movimiento');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error deleting movement:', err);
      setError('Error al eliminar movimiento');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchMovements]);

  /**
   * Validar stock disponible antes de crear movimiento
   * @param {string} fuelType - Tipo de combustible
   * @param {string} location - Ubicación
   * @param {number} quantity - Cantidad solicitada
   */
  const validateStock = useCallback(async (fuelType, location, quantity) => {
    try {
      const result = await movementsService.validateStock({
        fuelType,
        location,
        quantity
      });

      return result;
    } catch (err) {
      console.error('❌ Error validating stock:', err);
      return {
        success: false,
        valid: false,
        error: 'Error al validar stock disponible'
      };
    }
  }, []);

  /**
   * Obtener estadísticas de movimientos
   * @param {object} filters - Filtros opcionales
   */
  const getStats = useCallback(async (filters = {}) => {
    try {
      const result = await movementsService.getStats(filters);
      
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err) {
      console.error('❌ Error getting stats:', err);
      return null;
    }
  }, []);

  return {
    // Estado
    movements,
    loading,
    error,
    creating,

    // Métodos
    fetchMovements,
    createMovement,
    deleteMovement,
    validateStock,
    getStats,
  };
};

export default useMovements;

