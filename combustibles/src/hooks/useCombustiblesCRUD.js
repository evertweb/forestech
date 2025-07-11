// combustibles/src/hooks/useCombustiblesCRUD.js
// Hook para operaciones CRUD optimizadas - NIVEL 2 OPTIMIZACIÓN
import { useState, useCallback } from 'react';
import movementsService from '../services/movementsService';

export const useCombustiblesCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Operaciones de movimientos
  const deleteMovement = useCallback(async (movementId) => {
    try {
      setLoading(true);
      setError(null);
      await movementsService.deleteMovement(movementId);
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar el movimiento:", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const createMovement = useCallback(async (movementData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await movementsService.createMovement(movementData);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error al crear el movimiento:", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMovement = useCallback(async (movementId, updateData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await movementsService.updateMovement(movementId, updateData);
      return { success: true, data: result };
    } catch (error) {
      console.error("Error al actualizar el movimiento:", error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Funciones de refresh individuales (para casos específicos)
  const refreshInventory = useCallback(async () => {
    console.log('Refresh manual del inventario...');
    // TODO: Implementar si es necesario un refresh manual
  }, []);

  const refreshMovements = useCallback(async () => {
    console.log('Refresh manual de movimientos...');
    // TODO: Implementar si es necesario un refresh manual
  }, []);

  const refreshVehicles = useCallback(async () => {
    console.log('Refresh manual de vehículos...');
    // TODO: Implementar si es necesario un refresh manual
  }, []);

  const refreshSuppliers = useCallback(async () => {
    console.log('Refresh manual de proveedores...');
    // TODO: Implementar si es necesario un refresh manual
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    loading,
    error,

    // Operaciones CRUD
    deleteMovement,
    createMovement,
    updateMovement,

    // Funciones de utilidad
    refreshInventory,
    refreshMovements,
    refreshVehicles,
    refreshSuppliers,
    clearError
  };
};
