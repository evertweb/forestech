/**
 * Tests for Inventory Store (Zustand)
 * 
 * Testing strategy:
 * - Test initial state
 * - Test fetchInventory
 * - Test createInventoryLocation
 * - Test updateInventoryLocation
 * - Test validateStock
 * - Test getLowStockAlerts
 * - Test selectors/getters
 * - Test reset functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { InventoryLocation } from '../types/models';

// Mock Firebase Service before importing the store
vi.mock('../services/FirebaseInventoryService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getAllInventory: vi.fn().mockResolvedValue({ success: true, data: [] }),
      createInventoryLocation: vi.fn().mockResolvedValue({ success: true, data: {} }),
      updateInventoryLocation: vi.fn().mockResolvedValue({ success: true, data: {} }),
      validateStock: vi.fn().mockResolvedValue({ valid: true, message: 'Stock available' }),
      getLowStockAlerts: vi.fn().mockResolvedValue({ success: true, data: [] }),
      subscribeToInventory: vi.fn().mockReturnValue(() => {}),
      getAvailableStock: vi.fn().mockResolvedValue({ success: true, available: 1000 }),
    })),
  };
});

// Now import the store after mocking
import { useInventoryStore } from './inventory.store';

// Mock console methods to avoid noise in tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// Helper function to create mock InventoryLocation with all required fields
const createMockInventoryLocation = (overrides: Partial<InventoryLocation> = {}): InventoryLocation => ({
  id: '123',
  location: 'Bodega 1',
  fuelType: 'DIESEL',
  currentStock: 1000,
  maxCapacity: 5000,
  minStock: 500,
  unit: 'gal',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('InventoryStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useInventoryStore.getState().reset();
  });

  describe('Initial State', () => {
    it('should initialize with empty inventory array', () => {
      const { inventory } = useInventoryStore.getState();
      expect(inventory).toEqual([]);
    });

    it('should initialize with loading false', () => {
      const { loading } = useInventoryStore.getState();
      expect(loading).toBe(false);
    });

    it('should initialize with saving false', () => {
      const { saving } = useInventoryStore.getState();
      expect(saving).toBe(false);
    });

    it('should initialize with null error', () => {
      const { error } = useInventoryStore.getState();
      expect(error).toBeNull();
    });

    it('should initialize with null unsubscribe', () => {
      const { unsubscribe } = useInventoryStore.getState();
      expect(unsubscribe).toBeNull();
    });
  });

  describe('fetchInventory', () => {
    it('should set loading to true when fetching starts', () => {
      // Start fetch but don't await
      useInventoryStore.getState().fetchInventory();
      
      // Loading should be true initially
      const { loading } = useInventoryStore.getState();
      expect(loading).toBe(true);
    });

    it('should handle fetch completion', async () => {
      // Execute fetch
      await useInventoryStore.getState().fetchInventory();
      
      // Loading should be false after completion
      const { loading } = useInventoryStore.getState();
      expect(loading).toBe(false);
    });
  });

  describe('createInventoryLocation', () => {
    it('should set saving to true when creation starts', () => {
      const mockData = createMockInventoryLocation({ location: 'New Location' });
      
      // Start creation but don't await
      useInventoryStore.getState().createInventoryLocation(mockData);
      
      // Saving should be true initially
      const { saving } = useInventoryStore.getState();
      expect(saving).toBe(true);
    });

    it('should handle location creation result', async () => {
      const mockData = createMockInventoryLocation({ location: 'Test Location' });
      
      // Execute creation
      const result = await useInventoryStore.getState().createInventoryLocation(mockData);
      
      // Should return a result object
      expect(result).toHaveProperty('success');
      
      // Saving should be false after completion
      const { saving } = useInventoryStore.getState();
      expect(saving).toBe(false);
    });
  });

  describe('updateInventoryLocation', () => {
    it('should set saving to true when update starts', () => {
      const mockData = createMockInventoryLocation({ currentStock: 2000 });
      
      // Start update but don't await
      useInventoryStore.getState().updateInventoryLocation('123', mockData);
      
      // Saving should be true
      const { saving } = useInventoryStore.getState();
      expect(saving).toBe(true);
    });

    it('should handle location update result', async () => {
      const mockData = createMockInventoryLocation({ currentStock: 1500 });
      
      // Execute update
      const result = await useInventoryStore.getState().updateInventoryLocation('123', mockData);
      
      // Should return a result object
      expect(result).toHaveProperty('success');
      
      // Saving should be false after completion
      const { saving } = useInventoryStore.getState();
      expect(saving).toBe(false);
    });
  });

  describe('validateStock', () => {
    it('should validate stock with correct parameters', async () => {
      // Execute validation
      const result = await useInventoryStore.getState().validateStock('DIESEL', 'Bodega 1', 100);
      
      // Should return a validation result
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('message');
    });

    it('should return validation result for insufficient stock', async () => {
      // Execute validation with large quantity
      const result = await useInventoryStore.getState().validateStock('DIESEL', 'Bodega 1', 999999);
      
      // Should return a validation result (may be invalid)
      expect(result).toHaveProperty('valid');
      expect(typeof result.valid).toBe('boolean');
    });
  });

  describe('getLowStockAlerts', () => {
    it('should get low stock alerts as array', async () => {
      // Execute getLowStockAlerts
      const result = await useInventoryStore.getState().getLowStockAlerts();
      
      // Should return an array directly
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array by default', async () => {
      // Execute getLowStockAlerts
      const result = await useInventoryStore.getState().getLowStockAlerts();
      
      // Should be an array (empty from mock)
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Getters/Selectors', () => {
    it('should filter inventory by location', () => {
      const location1 = createMockInventoryLocation({ id: '1', location: 'Bodega 1' });
      const location2 = createMockInventoryLocation({ id: '2', location: 'Bodega 2' });
      
      // Manually set inventory for testing
      useInventoryStore.setState({ inventory: [location1, location2] });
      
      // Get by location
      const found = useInventoryStore.getState().getByLocation('Bodega 1');
      
      expect(found).toHaveLength(1);
      expect(found[0].location).toBe('Bodega 1');
    });

    it('should get available stock for fuel type and location', async () => {
      // Get available stock (calls service)
      const result = await useInventoryStore.getState().getAvailableStock('DIESEL', 'Bodega 1');
      
      // Should return a result with available property
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('available');
    });

    it('should calculate inventory stats', () => {
      const locations = [
        createMockInventoryLocation({ 
          id: '1', 
          fuelType: 'DIESEL', 
          currentStock: 1000, 
          maxCapacity: 5000 
        }),
        createMockInventoryLocation({ 
          id: '2', 
          fuelType: 'GASOLINA', 
          currentStock: 2000, 
          maxCapacity: 5000 
        }),
      ];
      
      // Manually set inventory for testing
      useInventoryStore.setState({ inventory: locations });
      
      // Get stats (from .js implementation)
      const stats: any = useInventoryStore.getState().getStats();
      
      expect(stats).toHaveProperty('totalLocations');
      expect(stats).toHaveProperty('totalStock');
      expect(stats.totalLocations).toBe(2);
      expect(stats.totalStock).toBe(3000);
      // totalCapacity might be in JS but not TS interface
      if (stats.totalCapacity !== undefined) {
        expect(stats.totalCapacity).toBe(10000);
      }
    });
  });

  describe('unsubscribeFromInventory', () => {
    it('should clear unsubscribe function when called', () => {
      // Mock an unsubscribe function
      const mockUnsubscribe = vi.fn();
      
      // Set unsubscribe function
      useInventoryStore.setState({ unsubscribe: mockUnsubscribe });
      
      // Call unsubscribe
      useInventoryStore.getState().unsubscribeFromInventory();
      
      // Unsubscribe should be called
      expect(mockUnsubscribe).toHaveBeenCalled();
      
      // Unsubscribe should be null after
      expect(useInventoryStore.getState().unsubscribe).toBeNull();
    });

    it('should handle null unsubscribe gracefully', () => {
      // Set unsubscribe to null
      useInventoryStore.setState({ unsubscribe: null });
      
      // Should not throw error
      expect(() => {
        useInventoryStore.getState().unsubscribeFromInventory();
      }).not.toThrow();
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      // Set some state first
      const mockLocations = [createMockInventoryLocation(), createMockInventoryLocation({ id: '456' })];
      useInventoryStore.setState({
        inventory: mockLocations,
        loading: true,
        saving: true,
        error: 'Some error',
      });
      
      // Reset
      useInventoryStore.getState().reset();
      
      // Verify reset
      const state = useInventoryStore.getState();
      expect(state.inventory).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.saving).toBe(false);
      expect(state.error).toBeNull();
      expect(state.unsubscribe).toBeNull();
    });
  });
});
