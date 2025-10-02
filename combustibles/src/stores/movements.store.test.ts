/**
 * Tests for Movements Store (Zustand)
 * 
 * Testing strategy:
 * - Test initial state
 * - Test fetchMovements
 * - Test createMovement
 * - Test deleteMovement
 * - Test validateStock
 * - Test selectors/getters
 * - Test reset functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Movement } from '../types/models';

// Mock Firebase Service before importing the store
vi.mock('../services/FirebaseMovementsService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getAllMovements: vi.fn().mockResolvedValue({ success: true, data: [] }),
      createMovement: vi.fn().mockResolvedValue({ success: true, data: {} }),
      deleteMovement: vi.fn().mockResolvedValue({ success: true }),
      validateStock: vi.fn().mockResolvedValue({ valid: true, message: 'Stock available' }),
      subscribeToMovements: vi.fn().mockReturnValue(() => {}),
    })),
  };
});

// Now import the store after mocking
import { useMovementsStore } from './movements.store';

// Mock console methods to avoid noise in tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// Helper function to create mock Movement with all required fields
const createMockMovement = (overrides: Partial<Movement> = {}): Movement => ({
  id: '123',
  type: 'entrada',
  fuelType: 'DIESEL',
  quantity: 100,
  unitPrice: 12.50,
  location: 'Bodega 1',
  status: 'completado',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'user123',
  ...overrides,
});

describe('MovementsStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useMovementsStore.getState().reset();
  });

  describe('Initial State', () => {
    it('should initialize with empty movements array', () => {
      const { movements } = useMovementsStore.getState();
      expect(movements).toEqual([]);
    });

    it('should initialize with loading false', () => {
      const { loading } = useMovementsStore.getState();
      expect(loading).toBe(false);
    });

    it('should initialize with creating false', () => {
      const { creating } = useMovementsStore.getState();
      expect(creating).toBe(false);
    });

    it('should initialize with null error', () => {
      const { error } = useMovementsStore.getState();
      expect(error).toBeNull();
    });

    it('should initialize with null unsubscribe', () => {
      const { unsubscribe } = useMovementsStore.getState();
      expect(unsubscribe).toBeNull();
    });
  });

  describe('fetchMovements', () => {
    it('should set loading to true when fetching starts', () => {
      // Start fetch but don't await
      useMovementsStore.getState().fetchMovements();
      
      // Loading should be true initially
      const { loading } = useMovementsStore.getState();
      expect(loading).toBe(true);
    });

    it('should handle fetch completion', async () => {
      // Execute fetch
      await useMovementsStore.getState().fetchMovements();
      
      // Loading should be false after completion
      const { loading } = useMovementsStore.getState();
      expect(loading).toBe(false);
    });
  });

  describe('createMovement', () => {
    it('should set creating to true when creation starts', () => {
      const mockData = createMockMovement({ type: 'entrada', quantity: 50 });
      
      // Start creation but don't await
      useMovementsStore.getState().createMovement(mockData);
      
      // Creating should be true initially
      const { creating } = useMovementsStore.getState();
      expect(creating).toBe(true);
    });

    it('should handle movement creation result', async () => {
      const mockData = createMockMovement({ type: 'salida', quantity: 25 });
      
      // Execute creation
      const result = await useMovementsStore.getState().createMovement(mockData);
      
      // Should return a result object
      expect(result).toHaveProperty('success');
      
      // Creating should be false after completion
      const { creating } = useMovementsStore.getState();
      expect(creating).toBe(false);
    });
  });

  describe('deleteMovement', () => {
    it('should set loading true when deletion starts', () => {
      // Start deletion but don't await
      useMovementsStore.getState().deleteMovement('123');
      
      // Loading should be true
      const { loading } = useMovementsStore.getState();
      expect(loading).toBe(true);
    });

    it('should handle deletion result', async () => {
      // Execute deletion
      const result = await useMovementsStore.getState().deleteMovement('123');
      
      // Should return a result object
      expect(result).toHaveProperty('success');
      
      // Loading should be false after completion
      const { loading } = useMovementsStore.getState();
      expect(loading).toBe(false);
    });
  });

  describe('validateStock', () => {
    it('should validate stock with correct parameters', async () => {
      // Execute validation
      const result = await useMovementsStore.getState().validateStock('DIESEL', 'Bodega 1', 100);
      
      // Should return a validation result
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('message');
    });

    it('should return validation result for insufficient stock', async () => {
      // Execute validation with large quantity
      const result = await useMovementsStore.getState().validateStock('DIESEL', 'Bodega 1', 999999);
      
      // Should return a validation result (may be invalid)
      expect(result).toHaveProperty('valid');
      expect(typeof result.valid).toBe('boolean');
    });
  });

  describe('Getters/Selectors', () => {
    it('should filter movements by type (entrada)', () => {
      const entradaMovement = createMockMovement({ id: '1', type: 'entrada' });
      const salidaMovement = createMockMovement({ id: '2', type: 'salida' });
      
      // Manually set movements for testing
      useMovementsStore.setState({ movements: [entradaMovement, salidaMovement] });
      
      // Get filtered movements
      const entradas = useMovementsStore.getState().getMovementsByType('entrada');
      
      expect(entradas).toHaveLength(1);
      expect(entradas[0].type).toBe('entrada');
    });

    it('should filter movements by type (salida)', () => {
      const entradaMovement = createMockMovement({ id: '1', type: 'entrada' });
      const salidaMovement = createMockMovement({ id: '2', type: 'salida' });
      
      // Manually set movements for testing
      useMovementsStore.setState({ movements: [entradaMovement, salidaMovement] });
      
      // Get filtered movements
      const salidas = useMovementsStore.getState().getMovementsByType('salida');
      
      expect(salidas).toHaveLength(1);
      expect(salidas[0].type).toBe('salida');
    });

    it('should calculate stats correctly', () => {
      const movements = [
        createMockMovement({ id: '1', type: 'entrada', quantity: 100, unitPrice: 10 }),
        createMockMovement({ id: '2', type: 'salida', quantity: 50, unitPrice: 12 }),
        createMockMovement({ id: '3', type: 'entrada', quantity: 200, unitPrice: 11 }),
      ];
      
      // Manually set movements for testing
      useMovementsStore.setState({ movements });
      
      // Get stats (from .js implementation)
      const stats: any = useMovementsStore.getState().getStats();
      
      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('totalEntradas');
      expect(stats).toHaveProperty('totalSalidas');
      expect(stats).toHaveProperty('totalQuantity');
      expect(stats.total).toBe(3);
      expect(stats.totalEntradas).toBe(2);
      expect(stats.totalSalidas).toBe(1);
      expect(stats.totalQuantity).toBe(350); // 100 + 50 + 200
    });
  });

  describe('unsubscribeFromMovements', () => {
    it('should clear unsubscribe function when called', () => {
      // Mock an unsubscribe function
      const mockUnsubscribe = vi.fn();
      
      // Set unsubscribe function
      useMovementsStore.setState({ unsubscribe: mockUnsubscribe });
      
      // Call unsubscribe
      useMovementsStore.getState().unsubscribeFromMovements();
      
      // Unsubscribe should be called
      expect(mockUnsubscribe).toHaveBeenCalled();
      
      // Unsubscribe should be null after
      expect(useMovementsStore.getState().unsubscribe).toBeNull();
    });

    it('should handle null unsubscribe gracefully', () => {
      // Set unsubscribe to null
      useMovementsStore.setState({ unsubscribe: null });
      
      // Should not throw error
      expect(() => {
        useMovementsStore.getState().unsubscribeFromMovements();
      }).not.toThrow();
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      // Set some state first
      const mockMovements = [createMockMovement(), createMockMovement({ id: '456' })];
      useMovementsStore.setState({
        movements: mockMovements,
        loading: true,
        creating: true,
        error: 'Some error',
      });
      
      // Reset
      useMovementsStore.getState().reset();
      
      // Verify reset
      const state = useMovementsStore.getState();
      expect(state.movements).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.creating).toBe(false);
      expect(state.error).toBeNull();
      expect(state.unsubscribe).toBeNull();
    });
  });
});
