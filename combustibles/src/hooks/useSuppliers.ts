/**
 * useSuppliers - Custom hook para gestión de proveedores
 * 
 * Hook para CRUD de proveedores de combustibles.
 * Por ahora usa el servicio directamente ya que no hay store de suppliers.
 * 
 * @module hooks/useSuppliers
 * @returns Estado y métodos de proveedores
 */

import { useState, useCallback } from 'react';
import type { UseSuppliersReturn } from '../types/hooks';
import type { Supplier } from '../types/models';
import type { Result } from '../types/api';
// @ts-expect-error - Service not yet migrated to TypeScript
import FirebaseSuppliersService from '../services/FirebaseSuppliersService';

let suppliersServiceInstance: any = null;

export const getSuppliersService = () => {
  if (!suppliersServiceInstance) {
    suppliersServiceInstance = new FirebaseSuppliersService();
  }
  return suppliersServiceInstance;
};

export const __setSuppliersService = (service: any) => {
  suppliersServiceInstance = service;
};

export const __resetSuppliersService = () => {
  suppliersServiceInstance = null;
};

/**
 * Hook para gestión de proveedores
 * 
 * @example
 * ```tsx
 * function SuppliersComponent() {
 *   const { suppliers, loading, fetchSuppliers, createSupplier } = useSuppliers();
 * }
 * ```
 */
export const useSuppliers = (): UseSuppliersReturn => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const service = getSuppliersService();
      const result = await service.getAllSuppliers();
      
      if (result.success) {
        setSuppliers(result.data || []);
      } else {
        setError(result.error || 'Error al cargar proveedores');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActiveSuppliers = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
  const service = getSuppliersService();
  const result = await service.getActiveSuppliers();
      
      if (result.success) {
        setSuppliers(result.data || []);
      } else {
        setError(result.error || 'Error al cargar proveedores');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSupplier = useCallback(async (data: Partial<Supplier>): Promise<Result<Supplier>> => {
    try {
      setSaving(true);
      setError(null);
  const service = getSuppliersService();
  const result = await service.createSupplier(data);
      
      if (result.success) {
        await fetchSuppliers();
      } else {
        setError(result.error || 'Error al crear proveedor');
      }
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  }, [fetchSuppliers]);

  const updateSupplier = useCallback(async (id: string, data: Partial<Supplier>): Promise<Result<Supplier>> => {
    try {
      setSaving(true);
      setError(null);
  const service = getSuppliersService();
  const result = await service.updateSupplier(id, data);
      
      if (result.success) {
        await fetchSuppliers();
      } else {
        setError(result.error || 'Error al actualizar proveedor');
      }
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  }, [fetchSuppliers]);

  const deleteSupplier = useCallback(async (id: string): Promise<Result<void>> => {
    try {
      setSaving(true);
      setError(null);
  const service = getSuppliersService();
  const result = await service.deleteSupplier(id);
      
      if (result.success) {
        await fetchSuppliers();
      } else {
        setError(result.error || 'Error al eliminar proveedor');
      }
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  }, [fetchSuppliers]);

  const getSupplierById = useCallback((id: string): Supplier | undefined => {
    return suppliers.find((s) => s.id === id);
  }, [suppliers]);

  const getSupplierByName = useCallback((name: string): Supplier | undefined => {
    return suppliers.find((s) => s.name.toLowerCase() === name.toLowerCase());
  }, [suppliers]);

  return {
    suppliers,
    loading,
    saving,
    error,
    fetchSuppliers,
    fetchActiveSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    getSupplierById,
    getSupplierByName,
  };
};

export default useSuppliers;
