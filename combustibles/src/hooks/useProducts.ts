/**
 * useProducts - Custom hook para gestión de productos (tipos de combustibles)
 * 
 * Wrapper sobre useProductsStore para proporcionar interfaz conveniente.
 * 
 * @module hooks/useProducts
 * @returns Estado y métodos de productos
 */

import { useProductsStore } from '../stores';
import type { UseProductsReturn } from '../types/hooks';

/**
 * Hook para gestión de productos (tipos de combustibles dinámicos)
 * 
 * @example
 * ```tsx
 * function ProductsComponent() {
 *   const { products, loading, fetchProducts, createProduct } = useProducts();
 *   
 *   const fuelOptions = getFuelTypesForSelect();
 * }
 * ```
 */
export const useProducts = (): UseProductsReturn => {
  const {
    products,
    loading,
    saving,
    error,
    fetchProducts,
    fetchActiveProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductByName,
    getFuelTypesForSelect,
  } = useProductsStore();

  return {
    products,
    loading,
    saving,
    error,
    fetchProducts,
    fetchActiveProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductByName,
    getFuelTypesForSelect,
  };
};

export default useProducts;
