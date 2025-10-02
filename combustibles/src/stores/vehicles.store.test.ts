/**
 * Tests for Vehicles Store (Zustand)
 * 
 * Testing strategy:
 * - Test initial state
 * - Test fetchVehicles / fetchActiveVehicles
 * - Test createVehicle
 * - Test updateVehicle
 * - Test deleteVehicle
 * - Test selectors/getters
 * - Test reset functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Vehicle } from '../types/models';

// Mock Firebase Service before importing the store
vi.mock('../services/FirebaseVehiclesService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getAllVehicles: vi.fn().mockResolvedValue({ success: true, data: [] }),
      getActiveVehicles: vi.fn().mockResolvedValue({ success: true, data: [] }),
      getVehicle: vi.fn().mockResolvedValue({ 
        success: true, 
        data: { id: '1', name: 'Vehicle 1', fuelType: 'DIESEL' } 
      }),
      createVehicle: vi.fn().mockResolvedValue({ success: true, data: {} }),
      updateVehicle: vi.fn().mockResolvedValue({ success: true, data: {} }),
      deleteVehicle: vi.fn().mockResolvedValue({ success: true }),
      subscribeToVehicles: vi.fn().mockReturnValue(() => {}),
    })),
  };
});

// Now import the store after mocking
import { useVehiclesStore } from './vehicles.store';

// Mock console methods to avoid noise in tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// Helper function to create mock Vehicle with all required fields
const createMockVehicle = (overrides: Partial<Vehicle> = {}): Vehicle => ({
  id: '123',
  vehicleId: 'V-001',
  name: 'Camión 1',
  fuelType: 'DIESEL',
  categoryName: 'Transporte',
  hasHourMeter: true,
  status: 'activo',
  active: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

describe('VehiclesStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useVehiclesStore.getState().reset();
  });

  describe('Initial State', () => {
    it('should initialize with empty vehicles array', () => {
      const { vehicles } = useVehiclesStore.getState();
      expect(vehicles).toEqual([]);
    });

    it('should initialize with loading false', () => {
      const { loading } = useVehiclesStore.getState();
      expect(loading).toBe(false);
    });

    it('should initialize with saving false', () => {
      const { saving } = useVehiclesStore.getState();
      expect(saving).toBe(false);
    });

    it('should initialize with null error', () => {
      const { error } = useVehiclesStore.getState();
      expect(error).toBeNull();
    });

    it('should initialize with null unsubscribe', () => {
      const { unsubscribe } = useVehiclesStore.getState();
      expect(unsubscribe).toBeNull();
    });
  });

  describe('fetchVehicles', () => {
    it('should set loading to true when fetching starts', () => {
      // Start fetch but don't await
      useVehiclesStore.getState().fetchVehicles();
      
      // Loading should be true initially
      const { loading } = useVehiclesStore.getState();
      expect(loading).toBe(true);
    });

    it('should handle fetch completion', async () => {
      // Execute fetch
      await useVehiclesStore.getState().fetchVehicles();
      
      // Loading should be false after completion
      const { loading } = useVehiclesStore.getState();
      expect(loading).toBe(false);
    });
  });

  describe('fetchActiveVehicles', () => {
    it('should set loading to true when fetching active vehicles', () => {
      // Start fetch but don't await
      useVehiclesStore.getState().fetchActiveVehicles();
      
      // Loading should be true initially
      const { loading } = useVehiclesStore.getState();
      expect(loading).toBe(true);
    });

    it('should handle fetch active completion', async () => {
      // Execute fetch
      await useVehiclesStore.getState().fetchActiveVehicles();
      
      // Loading should be false after completion
      const { loading } = useVehiclesStore.getState();
      expect(loading).toBe(false);
    });
  });

  describe('createVehicle', () => {
    it('should set saving to true when creation starts', () => {
      const mockData = createMockVehicle({ name: 'New Vehicle' });
      
      // Start creation but don't await
      useVehiclesStore.getState().createVehicle(mockData);
      
      // Saving should be true initially
      const { saving } = useVehiclesStore.getState();
      expect(saving).toBe(true);
    });

    it('should handle vehicle creation result', async () => {
      const mockData = createMockVehicle({ name: 'Test Vehicle' });
      
      // Execute creation
      const result = await useVehiclesStore.getState().createVehicle(mockData);
      
      // Should return a result object
      expect(result).toHaveProperty('success');
      
      // Saving should be false after completion
      const { saving } = useVehiclesStore.getState();
      expect(saving).toBe(false);
    });
  });

  describe('updateVehicle', () => {
    it('should set saving to true when update starts', () => {
      const mockData = createMockVehicle({ name: 'Updated Vehicle' });
      
      // Start update but don't await
      useVehiclesStore.getState().updateVehicle('123', mockData);
      
      // Saving should be true
      const { saving } = useVehiclesStore.getState();
      expect(saving).toBe(true);
    });

    it('should handle vehicle update result', async () => {
      const mockData = createMockVehicle({ name: 'Updated Vehicle' });
      
      // Execute update
      const result = await useVehiclesStore.getState().updateVehicle('123', mockData);
      
      // Should return a result object
      expect(result).toHaveProperty('success');
      
      // Saving should be false after completion
      const { saving } = useVehiclesStore.getState();
      expect(saving).toBe(false);
    });
  });

  describe('deleteVehicle', () => {
    it('should set loading to true when deletion starts', () => {
      // Start deletion but don't await
      useVehiclesStore.getState().deleteVehicle('123');
      
      // Loading should be true
      const { loading } = useVehiclesStore.getState();
      expect(loading).toBe(true);
    });

    it('should handle deletion result', async () => {
      // Execute deletion
      const result = await useVehiclesStore.getState().deleteVehicle('123');
      
      // Should return a result object
      expect(result).toHaveProperty('success');
      
      // Loading should be false after completion
      const { loading } = useVehiclesStore.getState();
      expect(loading).toBe(false);
    });
  });

  describe('Getters/Selectors', () => {
    it('should get vehicle by id from service', async () => {
      // Get vehicle by id (calls the service)
      const result: any = await useVehiclesStore.getState().getVehicle('1');
      
      // Should return a result object from the mocked service
      expect(result).toHaveProperty('success');
      expect(result.success).toBe(true);
      if (result.data) {
        expect(result.data.id).toBe('1');
      }
    });

    it('should filter vehicles by fuel type', () => {
      const dieselVehicle = createMockVehicle({ id: '1', fuelType: 'DIESEL' });
      const gasolinaVehicle = createMockVehicle({ id: '2', fuelType: 'GASOLINA' });
      
      // Manually set vehicles for testing
      useVehiclesStore.setState({ vehicles: [dieselVehicle, gasolinaVehicle] });
      
      // Get diesel vehicles
      const dieselVehicles = useVehiclesStore.getState().getVehiclesByFuelType('DIESEL');
      
      expect(dieselVehicles).toHaveLength(1);
      expect(dieselVehicles[0].fuelType).toBe('DIESEL');
    });

    it('should filter vehicles by category', () => {
      const transportVehicle = createMockVehicle({ id: '1', categoryName: 'Transporte' });
      const maquinariaVehicle = createMockVehicle({ id: '2', categoryName: 'Maquinaria' });
      
      // Manually set vehicles for testing
      useVehiclesStore.setState({ vehicles: [transportVehicle, maquinariaVehicle] });
      
      // Get transport vehicles
      const transportVehicles = useVehiclesStore.getState().getVehiclesByCategory('Transporte');
      
      expect(transportVehicles).toHaveLength(1);
      expect(transportVehicles[0].categoryName).toBe('Transporte');
    });

    it('should filter active vehicles from state', () => {
      const activeVehicle = createMockVehicle({ id: '1', active: true });
      const inactiveVehicle = createMockVehicle({ id: '2', active: false });
      
      // Manually set vehicles for testing
      useVehiclesStore.setState({ vehicles: [activeVehicle, inactiveVehicle] });
      
      // Filter active vehicles manually since there's no getter
      const { vehicles } = useVehiclesStore.getState();
      const activeVehicles = vehicles.filter(v => v.active);
      
      expect(activeVehicles).toHaveLength(1);
      expect(activeVehicles[0].active).toBe(true);
    });
  });

  describe('unsubscribeFromVehicles', () => {
    it('should clear unsubscribe function when called', () => {
      // Mock an unsubscribe function
      const mockUnsubscribe = vi.fn();
      
      // Set unsubscribe function
      useVehiclesStore.setState({ unsubscribe: mockUnsubscribe });
      
      // Call unsubscribe
      useVehiclesStore.getState().unsubscribeFromVehicles();
      
      // Unsubscribe should be called
      expect(mockUnsubscribe).toHaveBeenCalled();
      
      // Unsubscribe should be null after
      expect(useVehiclesStore.getState().unsubscribe).toBeNull();
    });

    it('should handle null unsubscribe gracefully', () => {
      // Set unsubscribe to null
      useVehiclesStore.setState({ unsubscribe: null });
      
      // Should not throw error
      expect(() => {
        useVehiclesStore.getState().unsubscribeFromVehicles();
      }).not.toThrow();
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      // Set some state first
      const mockVehicles = [createMockVehicle(), createMockVehicle({ id: '456' })];
      useVehiclesStore.setState({
        vehicles: mockVehicles,
        loading: true,
        saving: true,
        error: 'Some error',
      });
      
      // Reset
      useVehiclesStore.getState().reset();
      
      // Verify reset
      const state = useVehiclesStore.getState();
      expect(state.vehicles).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.saving).toBe(false);
      expect(state.error).toBeNull();
      expect(state.unsubscribe).toBeNull();
    });
  });
});
