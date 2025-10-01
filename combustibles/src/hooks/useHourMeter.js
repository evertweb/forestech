/**
 * useHourMeter - Custom hook para gestión de horómetro
 * Encapsula toda la lógica de fetching y estado del horómetro
 * 
 * @param {string} vehicleId - ID del vehículo
 * @returns {object} Estado y métodos del horómetro
 */

import { useState, useEffect, useCallback } from 'react';
import FirebaseHourMeterService from '../services/FirebaseHourMeterService';

const hourMeterService = new FirebaseHourMeterService();

export const useHourMeter = (vehicleId) => {
  // Estado para resumen
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [errorSummary, setErrorSummary] = useState(null);

  // Estado para historial
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [errorHistory, setErrorHistory] = useState(null);

  /**
   * Cargar resumen del horómetro
   */
  const fetchSummary = useCallback(async () => {
    if (!vehicleId) {
      setSummary(null);
      return;
    }

    try {
      setLoadingSummary(true);
      setErrorSummary(null);

      // El servicio retorna el data directamente, no envuelto en {success, data}
      const data = await hourMeterService.getHourMeterSummary(vehicleId);
      
      if (data && !data.error) {
        setSummary(data);
      } else {
        setErrorSummary(data?.error || 'Error al cargar resumen del horómetro');
      }
    } catch (error) {
      console.error('❌ Error loading hour meter summary:', error);
      setErrorSummary('Error al cargar datos del horómetro');
    } finally {
      setLoadingSummary(false);
    }
  }, [vehicleId]);

  /**
   * Cargar historial del horómetro
   */
  const fetchHistory = useCallback(async (maxEntries = 50) => {
    if (!vehicleId) {
      setHistory([]);
      return;
    }

    try {
      setLoadingHistory(true);
      setErrorHistory(null);

      // El servicio retorna el array directamente
      const data = await hourMeterService.getHourMeterHistory(vehicleId, maxEntries);
      
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setErrorHistory('Error al cargar historial del horómetro');
      }
    } catch (error) {
      console.error('❌ Error loading hour meter history:', error);
      setErrorHistory('Error al cargar historial del horómetro');
    } finally {
      setLoadingHistory(false);
    }
  }, [vehicleId]);

  /**
   * Refrescar datos (útil después de crear un nuevo registro)
   */
  const refresh = useCallback(() => {
    fetchSummary();
    fetchHistory();
  }, [fetchSummary, fetchHistory]);

  // Auto-cargar resumen cuando cambia vehicleId
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    // Resumen
    summary,
    loadingSummary,
    errorSummary,
    
    // Historial
    history,
    loadingHistory,
    errorHistory,
    
    // Métodos
    fetchSummary,
    fetchHistory,
    refresh,
  };
};

export default useHourMeter;

