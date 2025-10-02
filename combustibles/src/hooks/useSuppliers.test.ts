/**
 * Tests for useSuppliers Hook
 * 
 * Testing strategy:
 * - Test initial state
 * - Test fetchSuppliers updates state
 * - Test fetchActiveSuppliers updates state
 * - Test createSupplier
 * - Test updateSupplier
 * - Test deleteSupplier
 * - Test loading states
 * - Test error handling
 * - Test getSupplierById filter
 * - Test getSupplierByName filter
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Mock Firebase Service before imports
vi.mock('../services/FirebaseSuppliersService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getAllSuppliers: vi.fn().mockResolvedValue({ success: true, data: [] }),
      getActiveSuppliers: vi.fn().mockResolvedValue({ success: true, data: [] }),
      createSupplier: vi.fn().mockResolvedValue({ success: true, data: {} }),
      updateSupplier: vi.fn().mockResolvedValue({ success: true, data: {} }),
      deleteSupplier: vi.fn().mockResolvedValue({ success: true }),
    })),
  };
});

// Now import after mocking - explicitly use .ts file
import { useSuppliers } from './useSuppliers.ts';
import FirebaseSuppliersService from '../services/FirebaseSuppliersService';

describe('useSuppliers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with empty suppliers array', () => {
      const { result } = renderHook(() => useSuppliers());
      
      expect(result.current.suppliers).toEqual([]);
    });

    it('should initialize with loading false', () => {
      const { result } = renderHook(() => useSuppliers());
      
      expect(result.current.loading).toBe(false);
    });

    it('should initialize with saving false', () => {
      const { result } = renderHook(() => useSuppliers());
      
      expect(result.current.saving).toBe(false);
    });

    it('should initialize with null error', () => {
      const { result } = renderHook(() => useSuppliers());
      
      expect(result.current.error).toBeNull();
    });
  });

  describe('fetchSuppliers', () => {
    it('should fetch suppliers and update state', async () => {
      const mockSuppliers = [
        { id: '1', name: 'Supplier 1', isActive: true },
        { id: '2', name: 'Supplier 2', isActive: true },
      ];

      const mockService = {
        getAllSuppliers: vi.fn().mockResolvedValue({
          success: true,
          data: mockSuppliers,
        }),
      };

      (FirebaseSuppliersService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useSuppliers());

      await result.current.fetchSuppliers();

      await waitFor(() => {
        expect(result.current.suppliers).toEqual(mockSuppliers);
      });
    });

    it('should set loading true while fetching', async () => {
      const { result } = renderHook(() => useSuppliers());

      const promise = result.current.fetchSuppliers();

      // Check loading is true initially (without await)
      expect(result.current.loading).toBe(true);

      await promise;
    });

    it('should set loading false after fetch completes', async () => {
      const { result } = renderHook(() => useSuppliers());

      await result.current.fetchSuppliers();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle fetch error', async () => {
      const mockService = {
        getAllSuppliers: vi.fn().mockResolvedValue({
          success: false,
          error: 'Network error',
        }),
      };

      (FirebaseSuppliersService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useSuppliers());

      await result.current.fetchSuppliers();

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });
    });
  });

  describe('fetchActiveSuppliers', () => {
    it('should fetch active suppliers and update state', async () => {
      const mockSuppliers = [
        { id: '1', name: 'Active Supplier', isActive: true },
      ];

      const mockService = {
        getActiveSuppliers: vi.fn().mockResolvedValue({
          success: true,
          data: mockSuppliers,
        }),
      };

      (FirebaseSuppliersService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useSuppliers());

      await result.current.fetchActiveSuppliers();

      await waitFor(() => {
        expect(result.current.suppliers).toEqual(mockSuppliers);
      });
    });
  });

  describe('createSupplier', () => {
    it('should create supplier and refresh list', async () => {
      const newSupplier = { id: '3', name: 'New Supplier', isActive: true };
      const mockSuppliers = [newSupplier];

      const mockService = {
        createSupplier: vi.fn().mockResolvedValue({
          success: true,
          data: newSupplier,
        }),
        getAllSuppliers: vi.fn().mockResolvedValue({
          success: true,
          data: mockSuppliers,
        }),
      };

      (FirebaseSuppliersService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useSuppliers());

      const response = await result.current.createSupplier({ name: 'New Supplier' });

      expect(response.success).toBe(true);
      expect(mockService.createSupplier).toHaveBeenCalledWith({ name: 'New Supplier' });
      expect(mockService.getAllSuppliers).toHaveBeenCalled();
    });

    it('should set saving true while creating', async () => {
      const { result } = renderHook(() => useSuppliers());

      const promise = result.current.createSupplier({ name: 'Test' });

      expect(result.current.saving).toBe(true);

      await promise;
    });

    it('should handle create error', async () => {
      const mockService = {
        createSupplier: vi.fn().mockResolvedValue({
          success: false,
          error: 'Create failed',
        }),
      };

      (FirebaseSuppliersService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useSuppliers());

      const response = await result.current.createSupplier({ name: 'Test' });

      expect(response.success).toBe(false);
      await waitFor(() => {
        expect(result.current.error).toBe('Create failed');
      });
    });
  });

  describe('updateSupplier', () => {
    it('should update supplier and refresh list', async () => {
      const updatedSupplier = { id: '1', name: 'Updated Supplier', isActive: true };

      const mockService = {
        updateSupplier: vi.fn().mockResolvedValue({
          success: true,
          data: updatedSupplier,
        }),
        getAllSuppliers: vi.fn().mockResolvedValue({
          success: true,
          data: [updatedSupplier],
        }),
      };

      (FirebaseSuppliersService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useSuppliers());

      const response = await result.current.updateSupplier('1', { name: 'Updated Supplier' });

      expect(response.success).toBe(true);
      expect(mockService.updateSupplier).toHaveBeenCalledWith('1', { name: 'Updated Supplier' });
      expect(mockService.getAllSuppliers).toHaveBeenCalled();
    });
  });

  describe('deleteSupplier', () => {
    it('should delete supplier and refresh list', async () => {
      const mockService = {
        deleteSupplier: vi.fn().mockResolvedValue({
          success: true,
        }),
        getAllSuppliers: vi.fn().mockResolvedValue({
          success: true,
          data: [],
        }),
      };

      (FirebaseSuppliersService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useSuppliers());

      const response = await result.current.deleteSupplier('1');

      expect(response.success).toBe(true);
      expect(mockService.deleteSupplier).toHaveBeenCalledWith('1');
      expect(mockService.getAllSuppliers).toHaveBeenCalled();
    });
  });

  describe('getSupplierById', () => {
    it('should return supplier by id', async () => {
      const mockSuppliers = [
        { id: '1', name: 'Supplier 1', isActive: true },
        { id: '2', name: 'Supplier 2', isActive: true },
      ];

      const mockService = {
        getAllSuppliers: vi.fn().mockResolvedValue({
          success: true,
          data: mockSuppliers,
        }),
      };

      (FirebaseSuppliersService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useSuppliers());

      await result.current.fetchSuppliers();

      await waitFor(() => {
        const supplier = result.current.getSupplierById('1');
        expect(supplier).toEqual(mockSuppliers[0]);
      });
    });

    it('should return undefined for non-existent id', async () => {
      const { result } = renderHook(() => useSuppliers());

      const supplier = result.current.getSupplierById('999');
      expect(supplier).toBeUndefined();
    });
  });

  describe('getSupplierByName', () => {
    it('should return supplier by name (case-insensitive)', async () => {
      const mockSuppliers = [
        { id: '1', name: 'Supplier One', isActive: true },
        { id: '2', name: 'Supplier Two', isActive: true },
      ];

      const mockService = {
        getAllSuppliers: vi.fn().mockResolvedValue({
          success: true,
          data: mockSuppliers,
        }),
      };

      (FirebaseSuppliersService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useSuppliers());

      await result.current.fetchSuppliers();

      await waitFor(() => {
        const supplier = result.current.getSupplierByName('supplier one');
        expect(supplier).toEqual(mockSuppliers[0]);
      });
    });

    it('should return undefined for non-existent name', async () => {
      const { result } = renderHook(() => useSuppliers());

      const supplier = result.current.getSupplierByName('Non Existent');
      expect(supplier).toBeUndefined();
    });
  });

  describe('Hook Return Values', () => {
    it('should expose all expected properties', () => {
      const { result } = renderHook(() => useSuppliers());
      
      expect(result.current).toHaveProperty('suppliers');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('saving');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('fetchSuppliers');
      expect(result.current).toHaveProperty('fetchActiveSuppliers');
      expect(result.current).toHaveProperty('createSupplier');
      expect(result.current).toHaveProperty('updateSupplier');
      expect(result.current).toHaveProperty('deleteSupplier');
      expect(result.current).toHaveProperty('getSupplierById');
      expect(result.current).toHaveProperty('getSupplierByName');
    });

    it('should return functions that are callable', () => {
      const { result } = renderHook(() => useSuppliers());
      
      expect(typeof result.current.fetchSuppliers).toBe('function');
      expect(typeof result.current.fetchActiveSuppliers).toBe('function');
      expect(typeof result.current.createSupplier).toBe('function');
      expect(typeof result.current.updateSupplier).toBe('function');
      expect(typeof result.current.deleteSupplier).toBe('function');
      expect(typeof result.current.getSupplierById).toBe('function');
      expect(typeof result.current.getSupplierByName).toBe('function');
    });
  });
});
