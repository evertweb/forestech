/**
 * useProducts - Custom hook para gestión de productos (tipos de combustibles)
 * Encapsula toda la lógica de CRUD de productos
 * 
 * IMPORTANTE: En la refactorización, "Productos" = "Tipos de Combustibles"
 * Los usuarios crean tipos de combustibles dinámicamente (no hardcodeados)
 * 
 * @returns {object} Estado y métodos de productos
 */

import { useState, useCallback } from 'react';
import FirebaseProductsService from '../services/FirebaseProductsService';

const productsService = new FirebaseProductsService();

export const useProducts = () => {
  // Estado
  const [products, setProducts] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]); // Alias para productos = combustibles
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  /**
   * Obtener todos los productos (tipos de combustibles)
   * @param {object} filters - Filtros opcionales
   */
  const fetchProducts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const result = await productsService.getAll(filters);

      if (result.success) {
        const data = result.data || [];
        setProducts(data);
        setFuelTypes(data); // Sincronizar ambos estados
      } else {
        setError(result.error || 'Error al cargar productos');
      }
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Alias para fetchProducts - más semántico para combustibles
   */
  const fetchFuelTypes = useCallback(async (filters = {}) => {
    return fetchProducts(filters);
  }, [fetchProducts]);

  /**
   * Obtener un producto por ID
   * @param {string} productId - ID del producto
   */
  const getProduct = useCallback(async (productId) => {
    try {
      const result = await productsService.getById(productId);
      
      if (result.success) {
        return result.data;
      }
      return null;
    } catch (err) {
      console.error('❌ Error getting product:', err);
      return null;
    }
  }, []);

  /**
   * Crear nuevo tipo de combustible
   * @param {object} productData - Datos del producto/combustible
   */
  const createProduct = useCallback(async (productData) => {
    try {
      setSaving(true);
      setError(null);

      const result = await productsService.create(productData);

      if (result.success) {
        // Refrescar lista después de crear
        await fetchProducts();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Error al crear producto');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error creating product:', err);
      const errorMsg = err.message || 'Error al crear producto';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  }, [fetchProducts]);

  /**
   * Alias para createProduct - más semántico
   */
  const createFuelType = useCallback(async (fuelTypeData) => {
    return createProduct({
      ...fuelTypeData,
      category: 'fuel', // Asegurar que sea categoría fuel
    });
  }, [createProduct]);

  /**
   * Actualizar producto/tipo de combustible
   * @param {string} productId - ID del producto
   * @param {object} updates - Datos a actualizar
   */
  const updateProduct = useCallback(async (productId, updates) => {
    try {
      setSaving(true);
      setError(null);

      const result = await productsService.update(productId, updates);

      if (result.success) {
        // Refrescar lista después de actualizar
        await fetchProducts();
        return { success: true, data: result.data };
      } else {
        setError(result.error || 'Error al actualizar producto');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error updating product:', err);
      setError('Error al actualizar producto');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [fetchProducts]);

  /**
   * Eliminar producto/tipo de combustible
   * @param {string} productId - ID del producto
   */
  const deleteProduct = useCallback(async (productId) => {
    try {
      setSaving(true);
      setError(null);

      const result = await productsService.delete(productId);

      if (result.success) {
        // Refrescar lista después de eliminar
        await fetchProducts();
        return { success: true };
      } else {
        setError(result.error || 'Error al eliminar producto');
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('❌ Error deleting product:', err);
      setError('Error al eliminar producto');
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, [fetchProducts]);

  /**
   * Obtener solo tipos de combustibles (filtro por categoría)
   */
  const getFuelTypesOnly = useCallback(async () => {
    return fetchProducts({ category: 'fuel' });
  }, [fetchProducts]);

  /**
   * Validar si un código de producto ya existe
   * @param {string} code - Código del producto
   */
  const validateProductCode = useCallback(async (code) => {
    try {
      const result = await productsService.validateCode(code);
      return result.success ? result.valid : false;
    } catch (err) {
      console.error('❌ Error validating product code:', err);
      return false;
    }
  }, []);

  return {
    // Estado
    products,
    fuelTypes,        // Alias semántico
    loading,
    error,
    saving,

    // Métodos generales
    fetchProducts,
    fetchFuelTypes,   // Alias semántico
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    
    // Métodos específicos para combustibles
    createFuelType,
    getFuelTypesOnly,
    validateProductCode,
  };
};

export default useProducts;

