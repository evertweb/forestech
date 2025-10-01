/**
 * useVehicleCategories - Custom hook para gestión de categorías de vehículos
 * 
 * Hook para CRUD de categorías de vehículos.
 * 
 * @module hooks/useVehicleCategories
 * @returns Estado y métodos de categorías
 */

import { useState, useCallback } from 'react';
import type { UseVehicleCategoriesReturn } from '../types/hooks';
import type { VehicleCategory } from '../types/models';
import type { Result } from '../types/api';
// @ts-expect-error - Service not yet migrated to TypeScript
import FirebaseVehicleCategoriesService from '../services/FirebaseVehicleCategoriesService';

const categoriesService = new FirebaseVehicleCategoriesService();

/**
 * Hook para gestión de categorías de vehículos
 * 
 * @example
 * ```tsx
 * function CategoriesComponent() {
 *   const { categories, loading, fetchCategories } = useVehicleCategories();
 * }
 * ```
 */
export const useVehicleCategories = (): UseVehicleCategoriesReturn => {
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const result = await categoriesService.getAllCategories();
      
      if (result.success) {
        setCategories(result.data || []);
      } else {
        setError(result.error || 'Error al cargar categorías');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: Partial<VehicleCategory>): Promise<Result<VehicleCategory>> => {
    try {
      setSaving(true);
      setError(null);
      const result = await categoriesService.createCategory(data);
      
      if (result.success) {
        await fetchCategories();
      } else {
        setError(result.error || 'Error al crear categoría');
      }
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id: string, data: Partial<VehicleCategory>): Promise<Result<VehicleCategory>> => {
    try {
      setSaving(true);
      setError(null);
      const result = await categoriesService.updateCategory(id, data);
      
      if (result.success) {
        await fetchCategories();
      } else {
        setError(result.error || 'Error al actualizar categoría');
      }
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id: string): Promise<Result<void>> => {
    try {
      setSaving(true);
      setError(null);
      const result = await categoriesService.deleteCategory(id);
      
      if (result.success) {
        await fetchCategories();
      } else {
        setError(result.error || 'Error al eliminar categoría');
      }
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  }, [fetchCategories]);

  const getCategoryById = useCallback((id: string): VehicleCategory | undefined => {
    return categories.find((c) => c.id === id);
  }, [categories]);

  const getCategoryByName = useCallback((name: string): VehicleCategory | undefined => {
    return categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
  }, [categories]);

  return {
    categories,
    loading,
    saving,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryByName,
  };
};

export default useVehicleCategories;
