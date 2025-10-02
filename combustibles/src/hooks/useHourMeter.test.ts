/**
 * Tests for useHourMeter Hook
 * 
 * Testing strategy:
 * - Test initial state
 * - Test fetchReadings updates state
 * - Test createReading
 * - Test getLatestReading
 * - Test getReadingsByVehicle
 * - Test loading states
 * - Test error handling
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Mock Firebase Service before imports
vi.mock('../services/FirebaseHourMeterService', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getReadingsByVehicle: vi.fn().mockResolvedValue({ success: true, data: [] }),
      createReading: vi.fn().mockResolvedValue({ success: true, data: {} }),
    })),
  };
});

// Now import after mocking - explicitly use .ts file
import { useHourMeter } from './useHourMeter.ts';
import FirebaseHourMeterService from '../services/FirebaseHourMeterService';

describe('useHourMeter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with empty readings array', () => {
      const { result } = renderHook(() => useHourMeter());
      
      expect(result.current.readings).toEqual([]);
    });

    it('should initialize with loading false', () => {
      const { result } = renderHook(() => useHourMeter());
      
      expect(result.current.loading).toBe(false);
    });

    it('should initialize with saving false', () => {
      const { result } = renderHook(() => useHourMeter());
      
      expect(result.current.saving).toBe(false);
    });

    it('should initialize with null error', () => {
      const { result } = renderHook(() => useHourMeter());
      
      expect(result.current.error).toBeNull();
    });
  });

  describe('fetchReadings', () => {
    it('should fetch readings for a vehicle and update state', async () => {
      const vehicleId = 'vehicle-123';
      const mockReadings = [
        { id: '1', vehicleId, reading: 1000, date: '2025-01-01' },
        { id: '2', vehicleId, reading: 1050, date: '2025-01-02' },
      ];

      const mockService = {
        getReadingsByVehicle: vi.fn().mockResolvedValue({
          success: true,
          data: mockReadings,
        }),
      };

      (FirebaseHourMeterService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useHourMeter());

      await result.current.fetchReadings(vehicleId);

      await waitFor(() => {
        expect(result.current.readings).toEqual(mockReadings);
      });
      
      expect(mockService.getReadingsByVehicle).toHaveBeenCalledWith(vehicleId);
    });

    it('should set loading true while fetching', async () => {
      const { result } = renderHook(() => useHourMeter());

      const promise = result.current.fetchReadings('vehicle-123');

      // Check loading is true initially (without await)
      expect(result.current.loading).toBe(true);

      await promise;
    });

    it('should set loading false after fetch completes', async () => {
      const { result } = renderHook(() => useHourMeter());

      await result.current.fetchReadings('vehicle-123');

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle fetch error', async () => {
      const mockService = {
        getReadingsByVehicle: vi.fn().mockResolvedValue({
          success: false,
          error: 'Network error',
        }),
      };

      (FirebaseHourMeterService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useHourMeter());

      await result.current.fetchReadings('vehicle-123');

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });
    });
  });

  describe('createReading', () => {
    it('should create reading and refresh list for vehicle', async () => {
      const vehicleId = 'vehicle-123';
      const newReading = { id: '3', vehicleId, reading: 1100, date: '2025-01-03' };
      const mockReadings = [newReading];

      const mockService = {
        createReading: vi.fn().mockResolvedValue({
          success: true,
          data: newReading,
        }),
        getReadingsByVehicle: vi.fn().mockResolvedValue({
          success: true,
          data: mockReadings,
        }),
      };

      (FirebaseHourMeterService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useHourMeter());

      const response = await result.current.createReading({
        vehicleId,
        reading: 1100,
        date: '2025-01-03',
      });

      expect(response.success).toBe(true);
      expect(mockService.createReading).toHaveBeenCalledWith({
        vehicleId,
        reading: 1100,
        date: '2025-01-03',
      });
      expect(mockService.getReadingsByVehicle).toHaveBeenCalledWith(vehicleId);
    });

    it('should set saving true while creating', async () => {
      const { result } = renderHook(() => useHourMeter());

      const promise = result.current.createReading({
        vehicleId: 'vehicle-123',
        reading: 1000,
      });

      expect(result.current.saving).toBe(true);

      await promise;
    });

    it('should handle create error', async () => {
      const mockService = {
        createReading: vi.fn().mockResolvedValue({
          success: false,
          error: 'Create failed',
        }),
      };

      (FirebaseHourMeterService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useHourMeter());

      const response = await result.current.createReading({
        vehicleId: 'vehicle-123',
        reading: 1000,
      });

      expect(response.success).toBe(false);
      await waitFor(() => {
        expect(result.current.error).toBe('Create failed');
      });
    });
  });

  describe('getLatestReading', () => {
    it('should return latest reading for a vehicle', async () => {
      const vehicleId = 'vehicle-123';
      const mockReadings = [
        { id: '1', vehicleId, reading: 1000, date: '2025-01-01' },
        { id: '2', vehicleId, reading: 1050, date: '2025-01-03' }, // Latest
        { id: '3', vehicleId, reading: 1025, date: '2025-01-02' },
      ];

      const mockService = {
        getReadingsByVehicle: vi.fn().mockResolvedValue({
          success: true,
          data: mockReadings,
        }),
      };

      (FirebaseHourMeterService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useHourMeter());

      await result.current.fetchReadings(vehicleId);

      await waitFor(() => {
        const latest = result.current.getLatestReading(vehicleId);
        expect(latest).toEqual(mockReadings[1]); // The one with date 2025-01-03
      });
    });

    it('should return undefined for vehicle with no readings', () => {
      const { result } = renderHook(() => useHourMeter());

      const latest = result.current.getLatestReading('non-existent');
      expect(latest).toBeUndefined();
    });
  });

  describe('getReadingsByVehicle', () => {
    it('should return readings for a specific vehicle', async () => {
      const vehicle1 = 'vehicle-123';
      const vehicle2 = 'vehicle-456';
      const mockReadings = [
        { id: '1', vehicleId: vehicle1, reading: 1000, date: '2025-01-01' },
        { id: '2', vehicleId: vehicle2, reading: 2000, date: '2025-01-01' },
        { id: '3', vehicleId: vehicle1, reading: 1050, date: '2025-01-02' },
      ];

      const mockService = {
        getReadingsByVehicle: vi.fn().mockResolvedValue({
          success: true,
          data: mockReadings,
        }),
      };

      (FirebaseHourMeterService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useHourMeter());

      await result.current.fetchReadings(vehicle1);

      await waitFor(() => {
        const vehicle1Readings = result.current.getReadingsByVehicle(vehicle1);
        expect(vehicle1Readings).toHaveLength(2);
        expect(vehicle1Readings.every(r => r.vehicleId === vehicle1)).toBe(true);
      });
    });

    it('should return readings sorted by date (newest first)', async () => {
      const vehicleId = 'vehicle-123';
      const mockReadings = [
        { id: '1', vehicleId, reading: 1000, date: '2025-01-01' },
        { id: '2', vehicleId, reading: 1050, date: '2025-01-03' },
        { id: '3', vehicleId, reading: 1025, date: '2025-01-02' },
      ];

      const mockService = {
        getReadingsByVehicle: vi.fn().mockResolvedValue({
          success: true,
          data: mockReadings,
        }),
      };

      (FirebaseHourMeterService as any).mockImplementation(() => mockService);

      const { result } = renderHook(() => useHourMeter());

      await result.current.fetchReadings(vehicleId);

      await waitFor(() => {
        const readings = result.current.getReadingsByVehicle(vehicleId);
        expect(readings[0].date).toBe('2025-01-03'); // Newest first
        expect(readings[1].date).toBe('2025-01-02');
        expect(readings[2].date).toBe('2025-01-01');
      });
    });

    it('should return empty array for vehicle with no readings', () => {
      const { result } = renderHook(() => useHourMeter());

      const readings = result.current.getReadingsByVehicle('non-existent');
      expect(readings).toEqual([]);
    });
  });

  describe('Hook Return Values', () => {
    it('should expose all expected properties', () => {
      const { result } = renderHook(() => useHourMeter());
      
      expect(result.current).toHaveProperty('readings');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('saving');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('fetchReadings');
      expect(result.current).toHaveProperty('createReading');
      expect(result.current).toHaveProperty('getLatestReading');
      expect(result.current).toHaveProperty('getReadingsByVehicle');
    });

    it('should return functions that are callable', () => {
      const { result } = renderHook(() => useHourMeter());
      
      expect(typeof result.current.fetchReadings).toBe('function');
      expect(typeof result.current.createReading).toBe('function');
      expect(typeof result.current.getLatestReading).toBe('function');
      expect(typeof result.current.getReadingsByVehicle).toBe('function');
    });
  });
});
