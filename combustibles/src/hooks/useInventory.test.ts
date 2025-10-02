/**
 * Tests for useInventory Hook
 * 
 * Testing strategy:
 * - Test that hook returns correct values from store
 * - Test that hook methods call store methods
 * - Test integration with inventory store
 * - Test loading and error states
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock the inventory store BEFORE importing anything
vi.mock('../stores', () => ({
  useInventoryStore: vi.fn(),
}));

// Now import after mocking - explicitly use .ts file
import { useInventory } from './useInventory.ts';
import * as stores from '../stores';

describe('useInventory', () => {
  const mockFetchInventory = vi.fn();
  const mockCreateInventoryLocation = vi.fn();
  const mockUpdateInventoryLocation = vi.fn();
  const mockGetByLocation = vi.fn();
  const mockGetAvailableStock = vi.fn();
  const mockValidateStock = vi.fn();
  const mockGetLowStockAlerts = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock return value
    (stores.useInventoryStore as any).mockReturnValue({
      inventory: [],
      loading: false,
      saving: false,
      error: null,
      fetchInventory: mockFetchInventory,
      createInventoryLocation: mockCreateInventoryLocation,
      updateInventoryLocation: mockUpdateInventoryLocation,
      getByLocation: mockGetByLocation,
      getAvailableStock: mockGetAvailableStock,
      validateStock: mockValidateStock,
      getLowStockAlerts: mockGetLowStockAlerts,
    });
  });

  describe('Initialization', () => {
    it('should return inventory from store', () => {
      const mockInventory = [
        { id: '1', location: 'Bodega 1', fuelType: 'DIESEL', currentStock: 1000 },
        { id: '2', location: 'Bodega 2', fuelType: 'GASOLINA', currentStock: 500 },
      ];

      (stores.useInventoryStore as any).mockReturnValue({
        inventory: mockInventory,
        loading: false,
        saving: false,
        error: null,
        fetchInventory: mockFetchInventory,
        createInventoryLocation: mockCreateInventoryLocation,
        updateInventoryLocation: mockUpdateInventoryLocation,
        getByLocation: mockGetByLocation,
        getAvailableStock: mockGetAvailableStock,
        validateStock: mockValidateStock,
        getLowStockAlerts: mockGetLowStockAlerts,
      });

      const { result } = renderHook(() => useInventory());
      
      expect(result.current.inventory).toEqual(mockInventory);
    });

    it('should return loading state from store', () => {
      (stores.useInventoryStore as any).mockReturnValue({
        inventory: [],
        loading: true,
        saving: false,
        error: null,
        fetchInventory: mockFetchInventory,
        createInventoryLocation: mockCreateInventoryLocation,
        updateInventoryLocation: mockUpdateInventoryLocation,
        getByLocation: mockGetByLocation,
        getAvailableStock: mockGetAvailableStock,
        validateStock: mockValidateStock,
        getLowStockAlerts: mockGetLowStockAlerts,
      });

      const { result } = renderHook(() => useInventory());
      
      expect(result.current.loading).toBe(true);
    });

    it('should return saving state from store', () => {
      (stores.useInventoryStore as any).mockReturnValue({
        inventory: [],
        loading: false,
        saving: true,
        error: null,
        fetchInventory: mockFetchInventory,
        createInventoryLocation: mockCreateInventoryLocation,
        updateInventoryLocation: mockUpdateInventoryLocation,
        getByLocation: mockGetByLocation,
        getAvailableStock: mockGetAvailableStock,
        validateStock: mockValidateStock,
        getLowStockAlerts: mockGetLowStockAlerts,
      });

      const { result } = renderHook(() => useInventory());
      
      expect(result.current.saving).toBe(true);
    });

    it('should return error state from store', () => {
      const mockError = 'Test error';
      
      (stores.useInventoryStore as any).mockReturnValue({
        inventory: [],
        loading: false,
        saving: false,
        error: mockError,
        fetchInventory: mockFetchInventory,
        createInventoryLocation: mockCreateInventoryLocation,
        updateInventoryLocation: mockUpdateInventoryLocation,
        getByLocation: mockGetByLocation,
        getAvailableStock: mockGetAvailableStock,
        validateStock: mockValidateStock,
        getLowStockAlerts: mockGetLowStockAlerts,
      });

      const { result } = renderHook(() => useInventory());
      
      expect(result.current.error).toBe(mockError);
    });
  });

  describe('Store Integration', () => {
    it('should call fetchInventory from store', () => {
      const { result } = renderHook(() => useInventory());
      
      result.current.fetchInventory();
      
      expect(mockFetchInventory).toHaveBeenCalledTimes(1);
    });

    it('should call createInventoryLocation from store with correct data', () => {
      const { result } = renderHook(() => useInventory());
      const mockData = {
        location: 'Bodega 3',
        fuelType: 'DIESEL',
        currentStock: 0,
      };
      
      result.current.createInventoryLocation(mockData as any);
      
      expect(mockCreateInventoryLocation).toHaveBeenCalledWith(mockData);
      expect(mockCreateInventoryLocation).toHaveBeenCalledTimes(1);
    });

    it('should call updateInventoryLocation from store with correct id and data', () => {
      const { result } = renderHook(() => useInventory());
      const locationId = 'inv-123';
      const mockData = { currentStock: 1500 };
      
      result.current.updateInventoryLocation(locationId, mockData as any);
      
      expect(mockUpdateInventoryLocation).toHaveBeenCalledWith(locationId, mockData);
      expect(mockUpdateInventoryLocation).toHaveBeenCalledTimes(1);
    });

    it('should call validateStock from store', () => {
      const { result } = renderHook(() => useInventory());
      
      result.current.validateStock('DIESEL', 'Bodega 1', 100);
      
      expect(mockValidateStock).toHaveBeenCalledWith('DIESEL', 'Bodega 1', 100);
      expect(mockValidateStock).toHaveBeenCalledTimes(1);
    });

    it('should call getLowStockAlerts from store', () => {
      const { result } = renderHook(() => useInventory());
      
      result.current.getLowStockAlerts();
      
      expect(mockGetLowStockAlerts).toHaveBeenCalledTimes(1);
    });

    it('should call getByLocation from store', () => {
      const { result } = renderHook(() => useInventory());
      
      result.current.getByLocation('Bodega 1');
      
      expect(mockGetByLocation).toHaveBeenCalledWith('Bodega 1');
      expect(mockGetByLocation).toHaveBeenCalledTimes(1);
    });

    it('should call getAvailableStock from store', () => {
      const { result } = renderHook(() => useInventory());
      
      result.current.getAvailableStock('DIESEL', 'Bodega 1');
      
      expect(mockGetAvailableStock).toHaveBeenCalledWith('DIESEL', 'Bodega 1');
      expect(mockGetAvailableStock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Hook Return Values', () => {
    it('should expose all expected properties', () => {
      const { result } = renderHook(() => useInventory());
      
      expect(result.current).toHaveProperty('inventory');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('saving');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('fetchInventory');
      expect(result.current).toHaveProperty('createInventoryLocation');
      expect(result.current).toHaveProperty('updateInventoryLocation');
      expect(result.current).toHaveProperty('validateStock');
      expect(result.current).toHaveProperty('getLowStockAlerts');
      expect(result.current).toHaveProperty('getByLocation');
      expect(result.current).toHaveProperty('getAvailableStock');
    });

    it('should return functions that are callable', () => {
      const { result } = renderHook(() => useInventory());
      
      expect(typeof result.current.fetchInventory).toBe('function');
      expect(typeof result.current.createInventoryLocation).toBe('function');
      expect(typeof result.current.updateInventoryLocation).toBe('function');
      expect(typeof result.current.validateStock).toBe('function');
      expect(typeof result.current.getLowStockAlerts).toBe('function');
      expect(typeof result.current.getByLocation).toBe('function');
      expect(typeof result.current.getAvailableStock).toBe('function');
    });
  });
});
