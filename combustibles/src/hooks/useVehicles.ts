/**
 * useVehicles - Custom hook para gestión de vehículos
 * 
 * Wrapper sobre useVehiclesStore para proporcionar interfaz conveniente.
 * 
 * @module hooks/useVehicles
 * @returns Estado y métodos de vehículos
 */

import { useVehiclesStore } from '../stores';
import type { UseVehiclesReturn } from '../types/hooks';

/**
 * Hook para gestión de vehículos
 * 
 * @example
 * ```tsx
 * function VehiclesComponent() {
 *   const { vehicles, loading, fetchVehicles, createVehicle } = useVehicles();
 *   
 *   useEffect(() => {
 *     fetchVehicles();
 *   }, [fetchVehicles]);
 * }
 * ```
 */
export const useVehicles = (): UseVehiclesReturn => {
  const {
    vehicles,
    loading,
    saving,
    error,
    fetchVehicles,
    fetchActiveVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicle,
    getVehiclesByFuelType,
  } = useVehiclesStore();

  return {
    vehicles,
    loading,
    saving,
    error,
    fetchVehicles,
    fetchActiveVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicle,
    getVehiclesByFuelType,
  };
};

export default useVehicles;
