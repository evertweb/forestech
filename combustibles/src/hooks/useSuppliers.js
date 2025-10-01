/**
 * useSuppliers - Custom hook para gestión de proveedores
 * Encapsula toda la lógica de CRUD de proveedores
 * 
 * @returns {object} Estado y métodos de proveedores
 */

import { useState, useCallback } from 'react';
import FirebaseSuppliersService from '../services/FirebaseSuppliersService';

const suppliersService = new FirebaseSuppliersService();

export const useSuppliers = () => {
  // Estado
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  /**
   * Obtener todos los proveedores
   * @param {object} filters - Filtros opcionales (categoría, activos, etc)
   */
  const fetchSuppliers = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await suppliersService.getAll(filters);

      if (result.success) {
        setSuppliers(result.data || []);
      } else {
        setError(result.error || 'Error al cargar proveedores');
      }
    } catch (err) {
      console.error('❌ Error fetching suppliers:', err);
      setError('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener un proveedor por ID
   * @param {string} supplierId - ID del proveedor
   */
  const getSupplier = useCallback(async (supplierId) => {
    try {
      const result = await suppliersService.getById(supplierId);
      
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err) {
      console.error('❌ Error getting supplier:', err);
      return null;
    }
  }, []);

  /**
   * Crear nuevo proveedor
   * @param {object} supplierData - Datos del proveedor
   */
  const createSupplier = useCallback(async (supplierData) => {
    try {
      setSaving(true);
      setError(null);

      const result = await suppliersService.create(supplierData);

      if (result.success) {
        // Refrescar lista después de crear
        await fetchSuppliers();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Error al crear proveedor');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error creating supplier:', err);
      const errorMsg = err.message || 'Error al crear proveedor';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  }, [fetchSuppliers]);

  /**
   * Actualizar proveedor existente
   * @param {string} supplierId - ID del proveedor
   * @param {object} updates - Datos a actualizar
   */
  const updateSupplier = useCallback(async (supplierId, updates) => {
    try {
      setSaving(true);
      setError(null);

      const result = await suppliersService.update(supplierId, updates);

      if (result.success) {
        // Refrescar lista después de actualizar
        await fetchSuppliers();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Error al actualizar proveedor');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error updating supplier:', err);
      setError('Error al actualizar proveedor');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [fetchSuppliers]);

  /**
   * Eliminar un proveedor
   * @param {string} supplierId - ID del proveedor
   */
  const deleteSupplier = useCallback(async (supplierId) => {
    try {
      setSaving(true);
      setError(null);

      const result = await suppliersService.delete(supplierId);

      if (result.success) {
        // Refrescar lista después de eliminar
        await fetchSuppliers();
        return { success: true };
      } else {
        setError(result.error || 'Error al eliminar proveedor');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error deleting supplier:', err);
      setError('Error al eliminar proveedor');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [fetchSuppliers]);

  /**
   * Obtener proveedores activos solamente
   */
  const fetchActiveSuppliers = useCallback(async () => {
    return fetchSuppliers({ isActive: true });
  }, [fetchSuppliers]);

  /**
   * Obtener proveedores por categoría
   * @param {string} category - Categoría (fuel, parts, service, other)
   */
  const getSuppliersByCategory = useCallback(async (category) => {
    return fetchSuppliers({ category });
  }, [fetchSuppliers]);

  /**
   * Obtener proveedores de combustible (filtro rápido)
   */
  const getFuelSuppliers = useCallback(async () => {
    return fetchSuppliers({ category: 'fuel' });
  }, [fetchSuppliers]);

  /**
   * Obtener estadísticas de proveedores
   */
  const getStats = useCallback(async () => {
    try {
      const result = await suppliersService.getStats();
      
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err) {
      console.error('❌ Error getting supplier stats:', err);
      return null;
    }
  }, []);

  /**
   * Validar NIT/Tax ID único
   * @param {string} taxId - NIT a validar
   */
  const validateTaxId = useCallback(async (taxId) => {
    try {
      const result = await suppliersService.validateTaxId(taxId);
      return result.success ? result.valid : false;
    } catch (err) {
      console.error('❌ Error validating tax ID:', err);
      return false;
    }
  }, []);

  return {
    // Estado
    suppliers,
    loading,
    error,
    saving,

    // Métodos
    fetchSuppliers,
    fetchActiveSuppliers,
    getSupplier,
    getSuppliersByCategory,
    getFuelSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getStats,
    validateTaxId,
  };
};

export default useSuppliers;

