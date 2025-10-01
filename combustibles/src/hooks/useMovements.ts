/**
 * useMovements - Custom hook para gestión de movimientos de combustible
 * 
 * Este hook es un wrapper conveniente sobre useMovementsStore.
 * Proporciona la misma interfaz que antes pero usa el store de Zustand por debajo.
 * 
 * @module hooks/useMovements
 * @returns Estado y métodos de movimientos
 */

import { useMovementsStore } from '../stores';
import type { UseMovementsReturn } from '../types/hooks';

/**
 * Hook para gestión de movimientos de combustible
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { movements, loading, fetchMovements, createMovement } = useMovements();
 *   
 *   useEffect(() => {
 *     fetchMovements();
 *   }, [fetchMovements]);
 *   
 *   return <div>{movements.length} movimientos</div>;
 * }
 * ```
 */
export const useMovements = (): UseMovementsReturn => {
  // Obtener todo del store
  const {
    movements,
    loading,
    creating,
    error,
    fetchMovements,
    createMovement,
    deleteMovement,
    validateStock,
    getMovementsByType,
    getMovementById,
  } = useMovementsStore();

  return {
    movements,
    loading,
    creating,
    error,
    fetchMovements,
    createMovement,
    deleteMovement,
    validateStock,
    getMovementsByType,
    getMovementById,
  };
};

export default useMovements;
