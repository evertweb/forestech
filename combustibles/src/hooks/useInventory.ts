/**
 * useInventory - Custom hook para gestión de inventario
 * 
 * Wrapper sobre useInventoryStore para proporcionar interfaz conveniente.
 * 
 * @module hooks/useInventory
 * @returns Estado y métodos de inventario
 */

import { useInventoryStore } from '../stores';
import type { UseInventoryReturn } from '../types/hooks';

/**
 * Hook para gestión de inventario
 * 
 * @example
 * ```tsx
 * function InventoryComponent() {
 *   const { inventory, loading, fetchInventory, validateStock } = useInventory();
 *   
 *   const checkStock = async () => {
 *     const validation = await validateStock('DIESEL', 'Bodega 1', 100);
 *     if (!validation.valid) alert(validation.message);
 *   };
 * }
 * ```
 */
export const useInventory = (): UseInventoryReturn => {
  const {
    inventory,
    loading,
    saving,
    error,
    fetchInventory,
    createInventoryLocation,
    updateInventoryLocation,
    getByLocation,
    getAvailableStock,
    validateStock,
    getLowStockAlerts,
  } = useInventoryStore();

  return {
    inventory,
    loading,
    saving,
    error,
    fetchInventory,
    createInventoryLocation,
    updateInventoryLocation,
    validateStock,
    getLowStockAlerts,
    getByLocation,
    getAvailableStock,
  };
};

export default useInventory;
