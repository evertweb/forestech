/**
 * Tests for useProducts Hook
 * 
 * Testing strategy:
 * - Test that hook returns correct values from store
 * - Test that hook methods call store methods
 * - Test integration with products store
 * - Test loading and error states
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock the products store BEFORE importing anything
vi.mock('../stores', () => ({
  useProductsStore: vi.fn(),
}));

// Now import after mocking - explicitly use .ts file
import { useProducts } from './useProducts.ts';
import * as stores from '../stores';

describe('useProducts', () => {
  const mockFetchProducts = vi.fn();
  const mockFetchActiveProducts = vi.fn();
  const mockCreateProduct = vi.fn();
  const mockUpdateProduct = vi.fn();
  const mockDeleteProduct = vi.fn();
  const mockGetProductById = vi.fn();
  const mockGetProductByName = vi.fn();
  const mockGetFuelTypesForSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock return value
    (stores.useProductsStore as any).mockReturnValue({
      products: [],
      loading: false,
      saving: false,
      error: null,
      fetchProducts: mockFetchProducts,
      fetchActiveProducts: mockFetchActiveProducts,
      createProduct: mockCreateProduct,
      updateProduct: mockUpdateProduct,
      deleteProduct: mockDeleteProduct,
      getProductById: mockGetProductById,
      getProductByName: mockGetProductByName,
      getFuelTypesForSelect: mockGetFuelTypesForSelect,
    });
  });

  describe('Initialization', () => {
    it('should return products from store', () => {
      const mockProducts = [
        { id: '1', name: 'DIESEL', isActive: true },
        { id: '2', name: 'GASOLINA', isActive: true },
      ];

      (stores.useProductsStore as any).mockReturnValue({
        products: mockProducts,
        loading: false,
        saving: false,
        error: null,
        fetchProducts: mockFetchProducts,
        fetchActiveProducts: mockFetchActiveProducts,
        createProduct: mockCreateProduct,
        updateProduct: mockUpdateProduct,
        deleteProduct: mockDeleteProduct,
        getProductById: mockGetProductById,
        getProductByName: mockGetProductByName,
        getFuelTypesForSelect: mockGetFuelTypesForSelect,
      });

      const { result } = renderHook(() => useProducts());
      
      expect(result.current.products).toEqual(mockProducts);
    });

    it('should return loading state from store', () => {
      (stores.useProductsStore as any).mockReturnValue({
        products: [],
        loading: true,
        saving: false,
        error: null,
        fetchProducts: mockFetchProducts,
        fetchActiveProducts: mockFetchActiveProducts,
        createProduct: mockCreateProduct,
        updateProduct: mockUpdateProduct,
        deleteProduct: mockDeleteProduct,
        getProductById: mockGetProductById,
        getProductByName: mockGetProductByName,
        getFuelTypesForSelect: mockGetFuelTypesForSelect,
      });

      const { result } = renderHook(() => useProducts());
      
      expect(result.current.loading).toBe(true);
    });

    it('should return saving state from store', () => {
      (stores.useProductsStore as any).mockReturnValue({
        products: [],
        loading: false,
        saving: true,
        error: null,
        fetchProducts: mockFetchProducts,
        fetchActiveProducts: mockFetchActiveProducts,
        createProduct: mockCreateProduct,
        updateProduct: mockUpdateProduct,
        deleteProduct: mockDeleteProduct,
        getProductById: mockGetProductById,
        getProductByName: mockGetProductByName,
        getFuelTypesForSelect: mockGetFuelTypesForSelect,
      });

      const { result } = renderHook(() => useProducts());
      
      expect(result.current.saving).toBe(true);
    });

    it('should return error state from store', () => {
      const mockError = 'Test error';
      
      (stores.useProductsStore as any).mockReturnValue({
        products: [],
        loading: false,
        saving: false,
        error: mockError,
        fetchProducts: mockFetchProducts,
        fetchActiveProducts: mockFetchActiveProducts,
        createProduct: mockCreateProduct,
        updateProduct: mockUpdateProduct,
        deleteProduct: mockDeleteProduct,
        getProductById: mockGetProductById,
        getProductByName: mockGetProductByName,
        getFuelTypesForSelect: mockGetFuelTypesForSelect,
      });

      const { result } = renderHook(() => useProducts());
      
      expect(result.current.error).toBe(mockError);
    });
  });

  describe('Store Integration', () => {
    it('should call fetchProducts from store', () => {
      const { result } = renderHook(() => useProducts());
      
      result.current.fetchProducts();
      
      expect(mockFetchProducts).toHaveBeenCalledTimes(1);
    });

    it('should call fetchActiveProducts from store', () => {
      const { result } = renderHook(() => useProducts());
      
      result.current.fetchActiveProducts();
      
      expect(mockFetchActiveProducts).toHaveBeenCalledTimes(1);
    });

    it('should call createProduct from store with correct data', () => {
      const { result } = renderHook(() => useProducts());
      const mockData = {
        name: 'JET A1',
        isActive: true,
      };
      
      result.current.createProduct(mockData as any);
      
      expect(mockCreateProduct).toHaveBeenCalledWith(mockData);
      expect(mockCreateProduct).toHaveBeenCalledTimes(1);
    });

    it('should call updateProduct from store with correct id and data', () => {
      const { result } = renderHook(() => useProducts());
      const productId = 'prod-123';
      const mockData = { name: 'DIESEL UPDATED' };
      
      result.current.updateProduct(productId, mockData as any);
      
      expect(mockUpdateProduct).toHaveBeenCalledWith(productId, mockData);
      expect(mockUpdateProduct).toHaveBeenCalledTimes(1);
    });

    it('should call deleteProduct from store with correct id', () => {
      const { result } = renderHook(() => useProducts());
      const productId = 'prod-123';
      
      result.current.deleteProduct(productId);
      
      expect(mockDeleteProduct).toHaveBeenCalledWith(productId);
      expect(mockDeleteProduct).toHaveBeenCalledTimes(1);
    });

    it('should call getProductById from store', () => {
      const { result } = renderHook(() => useProducts());
      const productId = 'prod-123';
      
      result.current.getProductById(productId);
      
      expect(mockGetProductById).toHaveBeenCalledWith(productId);
      expect(mockGetProductById).toHaveBeenCalledTimes(1);
    });

    it('should call getProductByName from store', () => {
      const { result } = renderHook(() => useProducts());
      
      result.current.getProductByName('DIESEL');
      
      expect(mockGetProductByName).toHaveBeenCalledWith('DIESEL');
      expect(mockGetProductByName).toHaveBeenCalledTimes(1);
    });

    it('should call getFuelTypesForSelect from store', () => {
      const { result } = renderHook(() => useProducts());
      
      result.current.getFuelTypesForSelect();
      
      expect(mockGetFuelTypesForSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Hook Return Values', () => {
    it('should expose all expected properties', () => {
      const { result } = renderHook(() => useProducts());
      
      expect(result.current).toHaveProperty('products');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('saving');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('fetchProducts');
      expect(result.current).toHaveProperty('fetchActiveProducts');
      expect(result.current).toHaveProperty('createProduct');
      expect(result.current).toHaveProperty('updateProduct');
      expect(result.current).toHaveProperty('deleteProduct');
      expect(result.current).toHaveProperty('getProductById');
      expect(result.current).toHaveProperty('getProductByName');
      expect(result.current).toHaveProperty('getFuelTypesForSelect');
    });

    it('should return functions that are callable', () => {
      const { result } = renderHook(() => useProducts());
      
      expect(typeof result.current.fetchProducts).toBe('function');
      expect(typeof result.current.fetchActiveProducts).toBe('function');
      expect(typeof result.current.createProduct).toBe('function');
      expect(typeof result.current.updateProduct).toBe('function');
      expect(typeof result.current.deleteProduct).toBe('function');
      expect(typeof result.current.getProductById).toBe('function');
      expect(typeof result.current.getProductByName).toBe('function');
      expect(typeof result.current.getFuelTypesForSelect).toBe('function');
    });
  });
});
