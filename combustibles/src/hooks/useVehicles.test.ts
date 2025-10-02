/**
 * Tests for useVehicles Hook
 * 
 * Testing strategy:
 * - Test that hook returns correct values from store
 * - Test that hook methods call store methods
 * - Test integration with vehicles store
 * - Test loading and error states
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock the vehicles store BEFORE importing anything
vi.mock('../stores', () => ({
  useVehiclesStore: vi.fn(),
}));

// Now import after mocking - explicitly use .ts file
import { useVehicles } from './useVehicles.ts';
import * as stores from '../stores';

describe('useVehicles', () => {
  const mockFetchVehicles = vi.fn();
  const mockFetchActiveVehicles = vi.fn();
  const mockCreateVehicle = vi.fn();
  const mockUpdateVehicle = vi.fn();
  const mockDeleteVehicle = vi.fn();
  const mockGetVehicle = vi.fn();
  const mockGetVehiclesByFuelType = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock return value
    (stores.useVehiclesStore as any).mockReturnValue({
      vehicles: [],
      loading: false,
      saving: false,
      error: null,
      fetchVehicles: mockFetchVehicles,
      fetchActiveVehicles: mockFetchActiveVehicles,
      createVehicle: mockCreateVehicle,
      updateVehicle: mockUpdateVehicle,
      deleteVehicle: mockDeleteVehicle,
      getVehicle: mockGetVehicle,
      getVehiclesByFuelType: mockGetVehiclesByFuelType,
    });
  });

  describe('Initialization', () => {
    it('should return vehicles from store', () => {
      const mockVehicles = [
        { id: '1', name: 'Tractor 1', fuelType: 'DIESEL' },
        { id: '2', name: 'Camión 1', fuelType: 'GASOLINA' },
      ];

      (stores.useVehiclesStore as any).mockReturnValue({
        vehicles: mockVehicles,
        loading: false,
        saving: false,
        error: null,
        fetchVehicles: mockFetchVehicles,
        fetchActiveVehicles: mockFetchActiveVehicles,
        createVehicle: mockCreateVehicle,
        updateVehicle: mockUpdateVehicle,
        deleteVehicle: mockDeleteVehicle,
        getVehicle: mockGetVehicle,
        getVehiclesByFuelType: mockGetVehiclesByFuelType,
      });

      const { result } = renderHook(() => useVehicles());
      
      expect(result.current.vehicles).toEqual(mockVehicles);
    });

    it('should return loading state from store', () => {
      (stores.useVehiclesStore as any).mockReturnValue({
        vehicles: [],
        loading: true,
        saving: false,
        error: null,
        fetchVehicles: mockFetchVehicles,
        fetchActiveVehicles: mockFetchActiveVehicles,
        createVehicle: mockCreateVehicle,
        updateVehicle: mockUpdateVehicle,
        deleteVehicle: mockDeleteVehicle,
        getVehicle: mockGetVehicle,
        getVehiclesByFuelType: mockGetVehiclesByFuelType,
      });

      const { result } = renderHook(() => useVehicles());
      
      expect(result.current.loading).toBe(true);
    });

    it('should return saving state from store', () => {
      (stores.useVehiclesStore as any).mockReturnValue({
        vehicles: [],
        loading: false,
        saving: true,
        error: null,
        fetchVehicles: mockFetchVehicles,
        fetchActiveVehicles: mockFetchActiveVehicles,
        createVehicle: mockCreateVehicle,
        updateVehicle: mockUpdateVehicle,
        deleteVehicle: mockDeleteVehicle,
        getVehicle: mockGetVehicle,
        getVehiclesByFuelType: mockGetVehiclesByFuelType,
      });

      const { result } = renderHook(() => useVehicles());
      
      expect(result.current.saving).toBe(true);
    });

    it('should return error state from store', () => {
      const mockError = 'Test error';
      
      (stores.useVehiclesStore as any).mockReturnValue({
        vehicles: [],
        loading: false,
        saving: false,
        error: mockError,
        fetchVehicles: mockFetchVehicles,
        fetchActiveVehicles: mockFetchActiveVehicles,
        createVehicle: mockCreateVehicle,
        updateVehicle: mockUpdateVehicle,
        deleteVehicle: mockDeleteVehicle,
        getVehicle: mockGetVehicle,
        getVehiclesByFuelType: mockGetVehiclesByFuelType,
      });

      const { result } = renderHook(() => useVehicles());
      
      expect(result.current.error).toBe(mockError);
    });
  });

  describe('Store Integration', () => {
    it('should call fetchVehicles from store', () => {
      const { result } = renderHook(() => useVehicles());
      
      result.current.fetchVehicles();
      
      expect(mockFetchVehicles).toHaveBeenCalledTimes(1);
    });

    it('should call fetchActiveVehicles from store', () => {
      const { result } = renderHook(() => useVehicles());
      
      result.current.fetchActiveVehicles();
      
      expect(mockFetchActiveVehicles).toHaveBeenCalledTimes(1);
    });

    it('should call createVehicle from store with correct data', () => {
      const { result } = renderHook(() => useVehicles());
      const mockData = {
        name: 'Tractor 1',
        fuelType: 'DIESEL',
        hasHourMeter: true,
      };
      
      result.current.createVehicle(mockData as any);
      
      expect(mockCreateVehicle).toHaveBeenCalledWith(mockData);
      expect(mockCreateVehicle).toHaveBeenCalledTimes(1);
    });

    it('should call updateVehicle from store with correct id and data', () => {
      const { result } = renderHook(() => useVehicles());
      const vehicleId = 'veh-123';
      const mockData = { name: 'Updated Tractor' };
      
      result.current.updateVehicle(vehicleId, mockData as any);
      
      expect(mockUpdateVehicle).toHaveBeenCalledWith(vehicleId, mockData);
      expect(mockUpdateVehicle).toHaveBeenCalledTimes(1);
    });

    it('should call deleteVehicle from store with correct id', () => {
      const { result } = renderHook(() => useVehicles());
      const vehicleId = 'veh-123';
      
      result.current.deleteVehicle(vehicleId);
      
      expect(mockDeleteVehicle).toHaveBeenCalledWith(vehicleId);
      expect(mockDeleteVehicle).toHaveBeenCalledTimes(1);
    });

    it('should call getVehicle from store with correct id', () => {
      const { result } = renderHook(() => useVehicles());
      const vehicleId = 'veh-123';
      
      result.current.getVehicle(vehicleId);
      
      expect(mockGetVehicle).toHaveBeenCalledWith(vehicleId);
      expect(mockGetVehicle).toHaveBeenCalledTimes(1);
    });

    it('should call getVehiclesByFuelType from store', () => {
      const { result } = renderHook(() => useVehicles());
      
      result.current.getVehiclesByFuelType('DIESEL');
      
      expect(mockGetVehiclesByFuelType).toHaveBeenCalledWith('DIESEL');
      expect(mockGetVehiclesByFuelType).toHaveBeenCalledTimes(1);
    });
  });

  describe('Hook Return Values', () => {
    it('should expose all expected properties', () => {
      const { result } = renderHook(() => useVehicles());
      
      expect(result.current).toHaveProperty('vehicles');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('saving');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('fetchVehicles');
      expect(result.current).toHaveProperty('fetchActiveVehicles');
      expect(result.current).toHaveProperty('createVehicle');
      expect(result.current).toHaveProperty('updateVehicle');
      expect(result.current).toHaveProperty('deleteVehicle');
      expect(result.current).toHaveProperty('getVehicle');
      expect(result.current).toHaveProperty('getVehiclesByFuelType');
    });

    it('should return functions that are callable', () => {
      const { result } = renderHook(() => useVehicles());
      
      expect(typeof result.current.fetchVehicles).toBe('function');
      expect(typeof result.current.fetchActiveVehicles).toBe('function');
      expect(typeof result.current.createVehicle).toBe('function');
      expect(typeof result.current.updateVehicle).toBe('function');
      expect(typeof result.current.deleteVehicle).toBe('function');
      expect(typeof result.current.getVehicle).toBe('function');
      expect(typeof result.current.getVehiclesByFuelType).toBe('function');
    });
  });
});
