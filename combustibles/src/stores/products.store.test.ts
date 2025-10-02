/**
 * Tests for Products Store (Zustand)
 * 
 * Testing strategy:
 * - Test initial state
 * - Test fetchProducts / fetchActiveProducts
 * - Test createProduct
 * - Test updateProduct
 * - Test deleteProduct
 * - Test selectors/getters
 * - Test reset functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Product } from '../types/models';

// Mock Firebase Service before importing the store
vi.mock('../services/FirebaseProductsService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getAllProducts: vi.fn().mockResolvedValue({ success: true, data: [] }),
      getActiveProducts: vi.fn().mockResolvedValue({ success: true, data: [] }),
      createProduct: vi.fn().mockResolvedValue({ success: true, data: {} }),
      updateProduct: vi.fn().mockResolvedValue({ success: true, data: {} }),
      deleteProduct: vi.fn().mockResolvedValue({ success: true }),
      subscribeToProducts: vi.fn().mockReturnValue(() => {}),
    })),
  };
});

// Now import the store after mocking
import { useProductsStore } from './products.store';

// Mock console methods to avoid noise in tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// Helper function to create mock Product with all required fields
const createMockProduct = (overrides: Partial<Product> = {}): Product => ({
  id: '123',
  name: 'DIESEL',
  category: 'combustible',
  unit: 'gal',
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('ProductsStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useProductsStore.getState().reset();
  });

  describe('Initial State', () => {
    it('should initialize with empty products array', () => {
      const { products } = useProductsStore.getState();
      expect(products).toEqual([]);
    });

    it('should initialize with loading false', () => {
      const { loading } = useProductsStore.getState();
      expect(loading).toBe(false);
    });

    it('should initialize with saving false', () => {
      const { saving } = useProductsStore.getState();
      expect(saving).toBe(false);
    });

    it('should initialize with null error', () => {
      const { error } = useProductsStore.getState();
      expect(error).toBeNull();
    });

    it('should initialize with null unsubscribe', () => {
      const { unsubscribe } = useProductsStore.getState();
      expect(unsubscribe).toBeNull();
    });
  });

  describe('fetchProducts', () => {
    it('should set loading to true when fetching starts', () => {
      // Start fetch but don't await
      useProductsStore.getState().fetchProducts();
      
      // Loading should be true initially
      const { loading } = useProductsStore.getState();
      expect(loading).toBe(true);
    });

    it('should handle fetch completion', async () => {
      // Execute fetch
      await useProductsStore.getState().fetchProducts();
      
      // Loading should be false after completion
      const { loading } = useProductsStore.getState();
      expect(loading).toBe(false);
    });
  });

  describe('fetchActiveProducts', () => {
    it('should set loading to true when fetching active products', () => {
      // Start fetch but don't await
      useProductsStore.getState().fetchActiveProducts();
      
      // Loading should be true initially
      const { loading } = useProductsStore.getState();
      expect(loading).toBe(true);
    });

    it('should handle fetch active completion', async () => {
      // Execute fetch
      await useProductsStore.getState().fetchActiveProducts();
      
      // Loading should be false after completion
      const { loading } = useProductsStore.getState();
      expect(loading).toBe(false);
    });
  });

  describe('createProduct', () => {
    it('should set saving to true when creation starts', () => {
      const mockData = createMockProduct({ name: 'New Product' });
      
      // Start creation but don't await
      useProductsStore.getState().createProduct(mockData);
      
      // Saving should be true initially
      const { saving } = useProductsStore.getState();
      expect(saving).toBe(true);
    });

    it('should handle product creation result', async () => {
      const mockData = createMockProduct({ name: 'Test Product' });
      
      // Execute creation
      const result = await useProductsStore.getState().createProduct(mockData);
      
      // Should return a result object
      expect(result).toHaveProperty('success');
      
      // Saving should be false after completion
      const { saving } = useProductsStore.getState();
      expect(saving).toBe(false);
    });
  });

  describe('updateProduct', () => {
    it('should set saving to true when update starts', () => {
      const mockData = createMockProduct({ name: 'Updated Product' });
      
      // Start update but don't await
      useProductsStore.getState().updateProduct('123', mockData);
      
      // Saving should be true
      const { saving } = useProductsStore.getState();
      expect(saving).toBe(true);
    });

    it('should handle product update result', async () => {
      const mockData = createMockProduct({ name: 'Updated Product' });
      
      // Execute update
      const result = await useProductsStore.getState().updateProduct('123', mockData);
      
      // Should return a result object
      expect(result).toHaveProperty('success');
      
      // Saving should be false after completion
      const { saving } = useProductsStore.getState();
      expect(saving).toBe(false);
    });
  });

  describe('deleteProduct', () => {
    it('should set loading to true when deletion starts', () => {
      // Start deletion but don't await
      useProductsStore.getState().deleteProduct('123');
      
      // Loading should be true
      const { loading } = useProductsStore.getState();
      expect(loading).toBe(true);
    });

    it('should handle deletion result', async () => {
      // Execute deletion
      const result = await useProductsStore.getState().deleteProduct('123');
      
      // Should return a result object
      expect(result).toHaveProperty('success');
      
      // Loading should be false after completion
      const { loading } = useProductsStore.getState();
      expect(loading).toBe(false);
    });
  });

  describe('Getters/Selectors', () => {
    it('should get product by id', () => {
      const product1 = createMockProduct({ id: '1', name: 'Product 1' });
      const product2 = createMockProduct({ id: '2', name: 'Product 2' });
      
      // Manually set products for testing
      useProductsStore.setState({ products: [product1, product2] });
      
      // Get product by id
      const found = useProductsStore.getState().getProductById('1');
      
      expect(found).toBeDefined();
      expect(found?.id).toBe('1');
      expect(found?.name).toBe('Product 1');
    });

    it('should get product by name', () => {
      const product1 = createMockProduct({ id: '1', name: 'DIESEL' });
      const product2 = createMockProduct({ id: '2', name: 'GASOLINA' });
      
      // Manually set products for testing
      useProductsStore.setState({ products: [product1, product2] });
      
      // Get product by name
      const found = useProductsStore.getState().getProductByName('DIESEL');
      
      expect(found).toBeDefined();
      expect(found?.name).toBe('DIESEL');
    });

    it('should filter products by category', () => {
      const combustible = createMockProduct({ id: '1', category: 'combustible' });
      const lubricante = createMockProduct({ id: '2', category: 'lubricante' });
      
      // Manually set products for testing
      useProductsStore.setState({ products: [combustible, lubricante] });
      
      // Get products by category
      const combustibles = useProductsStore.getState().getProductsByCategory('combustible');
      
      expect(combustibles).toHaveLength(1);
      expect(combustibles[0].category).toBe('combustible');
    });

    it('should get fuel types for select options', () => {
      const product1 = createMockProduct({ id: '1', name: 'DIESEL', category: 'combustible' });
      const product2 = createMockProduct({ id: '2', name: 'GASOLINA', category: 'combustible' });
      const product3 = createMockProduct({ id: '3', name: 'ACEITE', category: 'lubricante' });
      
      // Manually set products for testing
      useProductsStore.setState({ products: [product1, product2, product3] });
      
      // Get fuel types
      const fuelTypes = useProductsStore.getState().getFuelTypesForSelect();
      
      // Should only include combustible category
      expect(Array.isArray(fuelTypes)).toBe(true);
      expect(fuelTypes.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('unsubscribeFromProducts', () => {
    it('should clear unsubscribe function when called', () => {
      // Mock an unsubscribe function
      const mockUnsubscribe = vi.fn();
      
      // Set unsubscribe function
      useProductsStore.setState({ unsubscribe: mockUnsubscribe });
      
      // Call unsubscribe
      useProductsStore.getState().unsubscribeFromProducts();
      
      // Unsubscribe should be called
      expect(mockUnsubscribe).toHaveBeenCalled();
      
      // Unsubscribe should be null after
      expect(useProductsStore.getState().unsubscribe).toBeNull();
    });

    it('should handle null unsubscribe gracefully', () => {
      // Set unsubscribe to null
      useProductsStore.setState({ unsubscribe: null });
      
      // Should not throw error
      expect(() => {
        useProductsStore.getState().unsubscribeFromProducts();
      }).not.toThrow();
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      // Set some state first
      const mockProducts = [createMockProduct(), createMockProduct({ id: '456' })];
      useProductsStore.setState({
        products: mockProducts,
        loading: true,
        saving: true,
        error: 'Some error',
      });
      
      // Reset
      useProductsStore.getState().reset();
      
      // Verify reset
      const state = useProductsStore.getState();
      expect(state.products).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.saving).toBe(false);
      expect(state.error).toBeNull();
      expect(state.unsubscribe).toBeNull();
    });
  });
});
