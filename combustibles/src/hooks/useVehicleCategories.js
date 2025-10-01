/**
 * useVehicleCategories - Custom hook para gestión de categorías de vehículos
 * Encapsula toda la lógica de CRUD de categorías
 * 
 * SIMPLIFICADO: Categorías dinámicas creadas por usuario (sin campos personalizados complejos)
 * 
 * @returns {object} Estado y métodos de categorías de vehículos
 */

import { useState, useCallback } from 'react';
import FirebaseVehicleCategoriesService from '../services/FirebaseVehicleCategoriesService';

const categoriesService = new FirebaseVehicleCategoriesService();

export const useVehicleCategories = () => {
  // Estado
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  /**
   * Obtener todas las categorías
   * @param {object} filters - Filtros opcionales
   */
  const fetchCategories = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await categoriesService.getAll(filters);

      if (result.success) {
        setCategories(result.data || []);
      } else {
        setError(result.error || 'Error al cargar categorías');
      }
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtener una categoría por ID
   * @param {string} categoryId - ID de la categoría
   */
  const getCategory = useCallback(async (categoryId) => {
    try {
      const result = await categoriesService.getById(categoryId);
      
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err) {
      console.error('❌ Error getting category:', err);
      return null;
    }
  }, []);

  /**
   * Crear nueva categoría de vehículo
   * @param {object} categoryData - Datos de la categoría
   */
  const createCategory = useCallback(async (categoryData) => {
    try {
      setSaving(true);
      setError(null);

      const result = await categoriesService.create(categoryData);

      if (result.success) {
        // Refrescar lista después de crear
        await fetchCategories();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Error al crear categoría');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error creating category:', err);
      const errorMsg = err.message || 'Error al crear categoría';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  }, [fetchCategories]);

  /**
   * Actualizar categoría existente
   * @param {string} categoryId - ID de la categoría
   * @param {object} updates - Datos a actualizar
   */
  const updateCategory = useCallback(async (categoryId, updates) => {
    try {
      setSaving(true);
      setError(null);

      const result = await categoriesService.update(categoryId, updates);

      if (result.success) {
        // Refrescar lista después de actualizar
        await fetchCategories();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Error al actualizar categoría');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error updating category:', err);
      setError('Error al actualizar categoría');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [fetchCategories]);

  /**
   * Eliminar una categoría
   * @param {string} categoryId - ID de la categoría
   */
  const deleteCategory = useCallback(async (categoryId) => {
    try {
      setSaving(true);
      setError(null);

      const result = await categoriesService.delete(categoryId);

      if (result.success) {
        // Refrescar lista después de eliminar
        await fetchCategories();
        return { success: true };
      } else {
        setError(result.error || 'Error al eliminar categoría');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error deleting category:', err);
      setError('Error al eliminar categoría');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [fetchCategories]);

  /**
   * Obtener categorías activas solamente
   */
  const fetchActiveCategories = useCallback(async () => {
    return fetchCategories({ isActive: true });
  }, [fetchCategories]);

  /**
   * Obtener estadísticas de una categoría (ej: cantidad de vehículos)
   * @param {string} categoryId - ID de la categoría
   */
  const getCategoryStats = useCallback(async (categoryId) => {
    try {
      const result = await categoriesService.getStats(categoryId);
      
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err) {
      console.error('❌ Error getting category stats:', err);
      return null;
    }
  }, []);

  /**
   * Validar si un código de categoría ya existe
   * @param {string} code - Código de la categoría
   */
  const validateCategoryCode = useCallback(async (code) => {
    try {
      const result = await categoriesService.validateCode(code);
      return result.success ? result.valid : false;
    } catch (err) {
      console.error('❌ Error validating category code:', err);
      return false;
    }
  }, []);

  /**
   * Suscribirse a cambios en tiempo real (opcional)
   * @param {Function} callback - Función de callback cuando hay cambios
   */
  const subscribeToCategories = useCallback((callback) => {
    try {
      const unsubscribe = categoriesService.subscribeToCategories((updatedCategories) => {
        setCategories(updatedCategories);
        if (callback) callback(updatedCategories);
      });

      return unsubscribe;
    } catch (err) {
      console.error('❌ Error subscribing to categories:', err);
      return () => {}; // Return noop function
    }
  }, []);

  // Auto-cargar categorías al montar (opcional)
  // Comentado para dar control explícito al componente
  // useEffect(() => {
  //   fetchCategories();
  // }, [fetchCategories]);

  return {
    // Estado
    categories,
    loading,
    error,
    saving,

    // Métodos
    fetchCategories,
    fetchActiveCategories,
    getCategory,
    getCategoryStats,
    createCategory,
    updateCategory,
    deleteCategory,
    validateCategoryCode,
    subscribeToCategories,
  };
};

export default useVehicleCategories;

