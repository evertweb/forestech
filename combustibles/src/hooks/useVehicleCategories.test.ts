/**
 * Tests for useVehicleCategories Hook
 * 
 * Testing strategy:
 * - Test initial state
 * - Test fetchCategories updates state
 * - Test createCategory
 * - Test updateCategory
 * - Test deleteCategory
 * - Test loading states
 * - Test error handling
 * - Test getCategoryById filter
 * - Test getCategoryByName filter
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Mock Firebase Service before imports
vi.mock('../services/FirebaseVehicleCategoriesService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getAllCategories: vi.fn().mockResolvedValue({ success: true, data: [] }),
      createCategory: vi.fn().mockResolvedValue({ success: true, data: {} }),
      updateCategory: vi.fn().mockResolvedValue({ success: true, data: {} }),
      deleteCategory: vi.fn().mockResolvedValue({ success: true }),
    })),
  };
});

// Now import after mocking - explicitly use .ts file
import { useVehicleCategories } from './useVehicleCategories.ts';
import FirebaseVehicleCategoriesService from '../services/FirebaseVehicleCategoriesService';

describe('useVehicleCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with empty categories array', () => {
      const { result } = renderHook(() => useVehicleCategories());
      
      expect(result.current.categories).toEqual([]);
    });

    it('should initialize with loading false', () => {
      const { result } = renderHook(() => useVehicleCategories());
      
      expect(result.current.loading).toBe(false);
    });

    it('should initialize with saving false', () => {
      const { result } = renderHook(() => useVehicleCategories());
      
      expect(result.current.saving).toBe(false);
    });

    it('should initialize with null error', () => {
      const { result } = renderHook(() => useVehicleCategories());
      
      expect(result.current.error).toBeNull();
    });
  });

  describe('fetchCategories', () => {
    it('should fetch categories and update state', async () => {
      const mockCategories = [
        { id: '1', name: 'Tractors', description: 'Farm tractors' },
        { id: '2', name: 'Trucks', description: 'Transport trucks' },
      ];

      const mockService = {
        getAllCategories: vi.fn().mockResolvedValue({
          success: true,
          data: mockCategories,
        }),
      };

      (FirebaseVehicleCategoriesService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useVehicleCategories());

      await result.current.fetchCategories();

      await waitFor(() => {
        expect(result.current.categories).toEqual(mockCategories);
      });
    });

    it('should set loading true while fetching', async () => {
      const { result } = renderHook(() => useVehicleCategories());

      const promise = result.current.fetchCategories();

      // Check loading is true initially (without await)
      expect(result.current.loading).toBe(true);

      await promise;
    });

    it('should set loading false after fetch completes', async () => {
      const { result } = renderHook(() => useVehicleCategories());

      await result.current.fetchCategories();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle fetch error', async () => {
      const mockService = {
        getAllCategories: vi.fn().mockResolvedValue({
          success: false,
          error: 'Network error',
        }),
      };

      (FirebaseVehicleCategoriesService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useVehicleCategories());

      await result.current.fetchCategories();

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });
    });
  });

  describe('createCategory', () => {
    it('should create category and refresh list', async () => {
      const newCategory = { id: '3', name: 'Excavators', description: 'Heavy machinery' };
      const mockCategories = [newCategory];

      const mockService = {
        createCategory: vi.fn().mockResolvedValue({
          success: true,
          data: newCategory,
        }),
        getAllCategories: vi.fn().mockResolvedValue({
          success: true,
          data: mockCategories,
        }),
      };

      (FirebaseVehicleCategoriesService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useVehicleCategories());

      const response = await result.current.createCategory({ name: 'Excavators' });

      expect(response.success).toBe(true);
      expect(mockService.createCategory).toHaveBeenCalledWith({ name: 'Excavators' });
      expect(mockService.getAllCategories).toHaveBeenCalled();
    });

    it('should set saving true while creating', async () => {
      const { result } = renderHook(() => useVehicleCategories());

      const promise = result.current.createCategory({ name: 'Test' });

      expect(result.current.saving).toBe(true);

      await promise;
    });

    it('should handle create error', async () => {
      const mockService = {
        createCategory: vi.fn().mockResolvedValue({
          success: false,
          error: 'Create failed',
        }),
      };

      (FirebaseVehicleCategoriesService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useVehicleCategories());

      const response = await result.current.createCategory({ name: 'Test' });

      expect(response.success).toBe(false);
      await waitFor(() => {
        expect(result.current.error).toBe('Create failed');
      });
    });
  });

  describe('updateCategory', () => {
    it('should update category and refresh list', async () => {
      const updatedCategory = { id: '1', name: 'Updated Category', description: 'Updated' };

      const mockService = {
        updateCategory: vi.fn().mockResolvedValue({
          success: true,
          data: updatedCategory,
        }),
        getAllCategories: vi.fn().mockResolvedValue({
          success: true,
          data: [updatedCategory],
        }),
      };

      (FirebaseVehicleCategoriesService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useVehicleCategories());

      const response = await result.current.updateCategory('1', { name: 'Updated Category' });

      expect(response.success).toBe(true);
      expect(mockService.updateCategory).toHaveBeenCalledWith('1', { name: 'Updated Category' });
      expect(mockService.getAllCategories).toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    it('should delete category and refresh list', async () => {
      const mockService = {
        deleteCategory: vi.fn().mockResolvedValue({
          success: true,
        }),
        getAllCategories: vi.fn().mockResolvedValue({
          success: true,
          data: [],
        }),
      };

      (FirebaseVehicleCategoriesService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useVehicleCategories());

      let response;
      await waitFor(async () => {
        response = await result.current.deleteCategory('1');
      });

      expect(response.success).toBe(true);
      expect(mockService.deleteCategory).toHaveBeenCalledWith('1');
      expect(mockService.getAllCategories).toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should return category by id', async () => {
      const mockCategories = [
        { id: '1', name: 'Category 1', description: 'Desc 1' },
        { id: '2', name: 'Category 2', description: 'Desc 2' },
      ];

      const mockService = {
        getAllCategories: vi.fn().mockResolvedValue({
          success: true,
          data: mockCategories,
        }),
      };

      (FirebaseVehicleCategoriesService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useVehicleCategories());

      await waitFor(async () => {
        await result.current.fetchCategories();
      });

      await waitFor(() => {
        expect(result.current.categories.length).toBe(2);
      });

      const category = result.current.getCategoryById('1');
      expect(category).toEqual(mockCategories[0]);
    });

    it('should return undefined for non-existent id', async () => {
      const { result } = renderHook(() => useVehicleCategories());

      const category = result.current.getCategoryById('999');
      expect(category).toBeUndefined();
    });
  });

  describe('getCategoryByName', () => {
    it('should return category by name (case-insensitive)', async () => {
      const mockCategories = [
        { id: '1', name: 'Category One', description: 'First' },
        { id: '2', name: 'Category Two', description: 'Second' },
      ];

      const mockService = {
        getAllCategories: vi.fn().mockResolvedValue({
          success: true,
          data: mockCategories,
        }),
      };

      (FirebaseVehicleCategoriesService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useVehicleCategories());

      await waitFor(async () => {
        await result.current.fetchCategories();
      });

      await waitFor(() => {
        expect(result.current.categories.length).toBe(2);
      });

      const category = result.current.getCategoryByName('category one');
      expect(category).toEqual(mockCategories[0]);
    });

    it('should return undefined for non-existent name', async () => {
      const { result } = renderHook(() => useVehicleCategories());

      const category = result.current.getCategoryByName('Non Existent');
      expect(category).toBeUndefined();
    });
  });

  describe('Hook Return Values', () => {
    it('should expose all expected properties', () => {
      const { result } = renderHook(() => useVehicleCategories());
      
      expect(result.current).toHaveProperty('categories');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('saving');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('fetchCategories');
      expect(result.current).toHaveProperty('createCategory');
      expect(result.current).toHaveProperty('updateCategory');
      expect(result.current).toHaveProperty('deleteCategory');
      expect(result.current).toHaveProperty('getCategoryById');
      expect(result.current).toHaveProperty('getCategoryByName');
    });

    it('should return functions that are callable', () => {
      const { result } = renderHook(() => useVehicleCategories());
      
      expect(typeof result.current.fetchCategories).toBe('function');
      expect(typeof result.current.createCategory).toBe('function');
      expect(typeof result.current.updateCategory).toBe('function');
      expect(typeof result.current.deleteCategory).toBe('function');
      expect(typeof result.current.getCategoryById).toBe('function');
      expect(typeof result.current.getCategoryByName).toBe('function');
    });
  });
});
