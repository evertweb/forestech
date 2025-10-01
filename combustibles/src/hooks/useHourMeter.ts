/**
 * useHourMeter - Custom hook para gestión de horómetros
 * 
 * Hook para registrar y consultar lecturas de horómetro de vehículos.
 * 
 * @module hooks/useHourMeter
 * @returns Estado y métodos de horómetro
 */

import { useState, useCallback } from 'react';
import type { UseHourMeterReturn } from '../types/hooks';
import type { HourMeterReading } from '../types/models';
import type { Result } from '../types/api';
// @ts-expect-error - Service not yet migrated to TypeScript
import FirebaseHourMeterService from '../services/FirebaseHourMeterService';

const hourMeterService = new FirebaseHourMeterService();

/**
 * Hook para gestión de horómetros
 * 
 * @example
 * ```tsx
 * function HourMeterComponent({ vehicleId }: { vehicleId: string }) {
 *   const { readings, loading, fetchReadings, createReading } = useHourMeter();
 *   
 *   useEffect(() => {
 *     fetchReadings(vehicleId);
 *   }, [vehicleId, fetchReadings]);
 * }
 * ```
 */
export const useHourMeter = (): UseHourMeterReturn => {
  const [readings, setReadings] = useState<HourMeterReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReadings = useCallback(async (vehicleId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const result = await hourMeterService.getReadingsByVehicle(vehicleId);
      
      if (result.success) {
        setReadings(result.data || []);
      } else {
        setError(result.error || 'Error al cargar lecturas');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const createReading = useCallback(async (data: Partial<HourMeterReading>): Promise<Result<HourMeterReading>> => {
    try {
      setSaving(true);
      setError(null);
      const result = await hourMeterService.createReading(data);
      
      if (result.success && data.vehicleId) {
        await fetchReadings(data.vehicleId);
      } else if (!result.success) {
        setError(result.error || 'Error al crear lectura');
      }
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setSaving(false);
    }
  }, [fetchReadings]);

  const getLatestReading = useCallback((vehicleId: string): HourMeterReading | undefined => {
    const vehicleReadings = readings.filter((r) => r.vehicleId === vehicleId);
    if (vehicleReadings.length === 0) return undefined;
    
    return vehicleReadings.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }, [readings]);

  const getReadingsByVehicle = useCallback((vehicleId: string): HourMeterReading[] => {
    return readings
      .filter((r) => r.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [readings]);

  return {
    readings,
    loading,
    saving,
    error,
    fetchReadings,
    createReading,
    getLatestReading,
    getReadingsByVehicle,
  };
};

export default useHourMeter;
