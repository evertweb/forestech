/**
 * Tests for useMovements Hook
 * 
 * Testing strategy:
 * - Test that hook returns correct values from store
 * - Test that hook methods call store methods
 * - Test integration with movements store
 * - Test loading and error states
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

// Mock the movements store BEFORE importing anything
vi.mock('../stores', () => ({
  useMovementsStore: vi.fn(),
}));

// Now import after mocking - explicitly use .ts file
import { useMovements } from './useMovements.ts';
import * as stores from '../stores';

describe('useMovements', () => {
  const mockFetchMovements = vi.fn();
  const mockCreateMovement = vi.fn();
  const mockDeleteMovement = vi.fn();
  const mockValidateStock = vi.fn();
  const mockGetMovementsByType = vi.fn();
  const mockGetMovementById = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock return value
    (stores.useMovementsStore as any).mockReturnValue({
      movements: [],
      loading: false,
      creating: false,
      error: null,
      fetchMovements: mockFetchMovements,
      createMovement: mockCreateMovement,
      deleteMovement: mockDeleteMovement,
      validateStock: mockValidateStock,
      getMovementsByType: mockGetMovementsByType,
      getMovementById: mockGetMovementById,
    });
  });

  describe('Initialization', () => {
    it('should return movements from store', () => {
      const mockMovements = [
        { id: '1', type: 'entrada', quantity: 100 },
        { id: '2', type: 'salida', quantity: 50 },
      ];

      (stores.useMovementsStore as any).mockReturnValue({
        movements: mockMovements,
        loading: false,
        creating: false,
        error: null,
        fetchMovements: mockFetchMovements,
        createMovement: mockCreateMovement,
        deleteMovement: mockDeleteMovement,
        validateStock: mockValidateStock,
        getMovementsByType: mockGetMovementsByType,
        getMovementById: mockGetMovementById,
      });

      const { result } = renderHook(() => useMovements());
      
      expect(result.current.movements).toEqual(mockMovements);
    });

    it('should return loading state from store', () => {
      (stores.useMovementsStore as any).mockReturnValue({
        movements: [],
        loading: true,
        creating: false,
        error: null,
        fetchMovements: mockFetchMovements,
        createMovement: mockCreateMovement,
        deleteMovement: mockDeleteMovement,
        validateStock: mockValidateStock,
        getMovementsByType: mockGetMovementsByType,
        getMovementById: mockGetMovementById,
      });

      const { result } = renderHook(() => useMovements());
      
      expect(result.current.loading).toBe(true);
    });

    it('should return creating state from store', () => {
      (stores.useMovementsStore as any).mockReturnValue({
        movements: [],
        loading: false,
        creating: true,
        error: null,
        fetchMovements: mockFetchMovements,
        createMovement: mockCreateMovement,
        deleteMovement: mockDeleteMovement,
        validateStock: mockValidateStock,
        getMovementsByType: mockGetMovementsByType,
        getMovementById: mockGetMovementById,
      });

      const { result } = renderHook(() => useMovements());
      
      expect(result.current.creating).toBe(true);
    });

    it('should return error state from store', () => {
      const mockError = 'Test error';
      
      (stores.useMovementsStore as any).mockReturnValue({
        movements: [],
        loading: false,
        creating: false,
        error: mockError,
        fetchMovements: mockFetchMovements,
        createMovement: mockCreateMovement,
        deleteMovement: mockDeleteMovement,
        validateStock: mockValidateStock,
        getMovementsByType: mockGetMovementsByType,
        getMovementById: mockGetMovementById,
      });

      const { result } = renderHook(() => useMovements());
      
      expect(result.current.error).toBe(mockError);
    });
  });

  describe('Store Integration', () => {
    it('should call fetchMovements from store', () => {
      const { result } = renderHook(() => useMovements());
      
      result.current.fetchMovements();
      
      expect(mockFetchMovements).toHaveBeenCalledTimes(1);
    });

    it('should call createMovement from store with correct data', () => {
      const { result } = renderHook(() => useMovements());
      const mockData = {
        type: 'entrada',
        fuelType: 'DIESEL',
        quantity: 100,
      };
      
      result.current.createMovement(mockData as any);
      
      expect(mockCreateMovement).toHaveBeenCalledWith(mockData);
      expect(mockCreateMovement).toHaveBeenCalledTimes(1);
    });

    it('should call deleteMovement from store with correct id', () => {
      const { result } = renderHook(() => useMovements());
      const movementId = 'mov-123';
      
      result.current.deleteMovement(movementId);
      
      expect(mockDeleteMovement).toHaveBeenCalledWith(movementId);
      expect(mockDeleteMovement).toHaveBeenCalledTimes(1);
    });

    it('should call validateStock from store', () => {
      const { result } = renderHook(() => useMovements());
      
      result.current.validateStock('DIESEL', 'Bodega 1', 100);
      
      expect(mockValidateStock).toHaveBeenCalledWith('DIESEL', 'Bodega 1', 100);
      expect(mockValidateStock).toHaveBeenCalledTimes(1);
    });

    it('should call getMovementsByType from store', () => {
      const { result } = renderHook(() => useMovements());
      
      result.current.getMovementsByType('entrada');
      
      expect(mockGetMovementsByType).toHaveBeenCalledWith('entrada');
      expect(mockGetMovementsByType).toHaveBeenCalledTimes(1);
    });

    it('should call getMovementById from store', () => {
      const { result } = renderHook(() => useMovements());
      
      result.current.getMovementById('mov-123');
      
      expect(mockGetMovementById).toHaveBeenCalledWith('mov-123');
      expect(mockGetMovementById).toHaveBeenCalledTimes(1);
    });
  });

  describe('Hook Return Values', () => {
    it('should expose all expected properties', () => {
      const { result } = renderHook(() => useMovements());
      
      expect(result.current).toHaveProperty('movements');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('creating');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('fetchMovements');
      expect(result.current).toHaveProperty('createMovement');
      expect(result.current).toHaveProperty('deleteMovement');
      expect(result.current).toHaveProperty('validateStock');
      expect(result.current).toHaveProperty('getMovementsByType');
      expect(result.current).toHaveProperty('getMovementById');
    });

    it('should return functions that are callable', () => {
      const { result } = renderHook(() => useMovements());
      
      expect(typeof result.current.fetchMovements).toBe('function');
      expect(typeof result.current.createMovement).toBe('function');
      expect(typeof result.current.deleteMovement).toBe('function');
      expect(typeof result.current.validateStock).toBe('function');
      expect(typeof result.current.getMovementsByType).toBe('function');
      expect(typeof result.current.getMovementById).toBe('function');
    });
  });
});
