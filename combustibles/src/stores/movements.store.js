/**
 * 📦 Movements Store - Zustand
 * 
 * Store para manejo de movimientos de combustible (ENTRADA y SALIDA).
 * Integra con el hook useMovements y FirebaseMovementsService.
 * 
 * @module stores/movements
 * 
 * @example
 * ```javascript
 * import { useMovementsStore } from '@/stores/movements.store';
 * 
 * function MovementsComponent() {
 *   const { movements, loading, fetchMovements, createMovement } = useMovementsStore();
 *   
 *   useEffect(() => {
 *     fetchMovements();
 *   }, [fetchMovements]);
 * }
 * ```
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import FirebaseMovementsService from '../services/FirebaseMovementsService';

// Instancia del servicio
const movementsService = new FirebaseMovementsService();

/**
 * Movements Store State
 * 
 * @typedef {Object} MovementsState
 * @property {Array<Object>} movements - Lista de movimientos
 * @property {boolean} loading - Estado de carga
 * @property {boolean} creating - Estado de creación
 * @property {string|null} error - Mensaje de error
 * @property {function|null} unsubscribe - Función para cancelar suscripción
 */

const initialState = {
  movements: [],
  loading: false,
  creating: false,
  error: null,
  unsubscribe: null,
};

/**
 * useMovementsStore - Zustand store for movements
 * 
 * @returns {MovementsState & MovementsActions} Movements state and actions
 */
export const useMovementsStore = create(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        // Estado inicial
        ...initialState,

        // Acciones
        /**
         * Fetch all movements (one-time fetch)
         * 
         * @returns {Promise<void>}
         * 
         * @example
         * await fetchMovements();
         */
        fetchMovements: async () => {
          console.log('📦 MovementsStore: fetchMovements');
          set({ loading: true, error: null }, false, 'movements/fetchMovements');

          try {
            const result = await movementsService.getAllMovements();
            
            if (result.success) {
              console.log(`✅ MovementsStore: ${result.data.length} movimientos cargados`);
              set({ movements: result.data, loading: false }, false, 'movements/fetchSuccess');
            } else {
              console.error('❌ MovementsStore: Error al cargar movimientos:', result.error);
              set({ error: result.error, loading: false }, false, 'movements/fetchError');
            }
          } catch (error) {
            console.error('❌ MovementsStore: Excepción al cargar movimientos:', error);
            set({ error: error.message, loading: false }, false, 'movements/fetchException');
          }
        },

        /**
         * Subscribe to real-time movements updates
         * Automatically updates the store when movements change in Firestore
         * 
         * @returns {function} Unsubscribe function
         * 
         * @example
         * const unsubscribe = subscribeToMovements();
         * // Later: unsubscribe();
         */
        subscribeToMovements: () => {
          console.log('📦 MovementsStore: subscribeToMovements');
          
          // Si ya hay una suscripción activa, cancelarla primero
          const { unsubscribe: currentUnsub } = get();
          if (currentUnsub) {
            console.log('📦 MovementsStore: Cancelando suscripción anterior');
            currentUnsub();
          }

          set({ loading: true, error: null }, false, 'movements/subscribeStart');

          const unsubscribe = movementsService.subscribeToMovements((data, error) => {
            if (error) {
              console.error('❌ MovementsStore: Error en suscripción:', error);
              set({ error, loading: false }, false, 'movements/subscribeError');
            } else {
              console.log(`✅ MovementsStore: Suscripción actualizada - ${data.length} movimientos`);
              set({ movements: data, loading: false }, false, 'movements/subscribeUpdate');
            }
          });

          set({ unsubscribe }, false, 'movements/subscribeActive');
          return unsubscribe;
        },

        /**
         * Unsubscribe from real-time updates
         * 
         * @example
         * unsubscribeFromMovements();
         */
        unsubscribeFromMovements: () => {
          console.log('📦 MovementsStore: unsubscribeFromMovements');
          const { unsubscribe } = get();
          
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
            set({ unsubscribe: null }, false, 'movements/unsubscribe');
          }
        },

        /**
         * Create new movement
         * 
         * @param {Object} movementData - Movement data
         * @returns {Promise<Object>} Result object with success/error
         * 
         * @example
         * const result = await createMovement({
         *   type: 'entrada',
         *   fuelType: 'DIESEL',
         *   quantity: 100,
         *   location: 'Bodega 1'
         * });
         */
        createMovement: async (movementData) => {
          console.log('📦 MovementsStore: createMovement', movementData.type);
          set({ creating: true, error: null }, false, 'movements/createStart');

          try {
            const result = await movementsService.createMovement(movementData);

            if (result.success) {
              console.log('✅ MovementsStore: Movimiento creado exitosamente');
              set({ creating: false }, false, 'movements/createSuccess');
              
              // Refrescar lista de movimientos
              get().fetchMovements();
            } else {
              console.error('❌ MovementsStore: Error al crear movimiento:', result.error);
              set({ error: result.error, creating: false }, false, 'movements/createError');
            }

            return result;
          } catch (error) {
            console.error('❌ MovementsStore: Excepción al crear movimiento:', error);
            const errorMsg = error.message;
            set({ error: errorMsg, creating: false }, false, 'movements/createException');
            return { success: false, error: errorMsg };
          }
        },

        /**
         * Delete movement by ID
         * 
         * @param {string} movementId - Movement ID to delete
         * @returns {Promise<Object>} Result object
         * 
         * @example
         * const result = await deleteMovement('movement-123');
         */
        deleteMovement: async (movementId) => {
          console.log('📦 MovementsStore: deleteMovement', movementId);
          set({ loading: true, error: null }, false, 'movements/deleteStart');

          try {
            const result = await movementsService.deleteMovement(movementId);

            if (result.success) {
              console.log('✅ MovementsStore: Movimiento eliminado');
              set({ loading: false }, false, 'movements/deleteSuccess');
              
              // Refrescar lista
              get().fetchMovements();
            } else {
              console.error('❌ MovementsStore: Error al eliminar:', result.error);
              set({ error: result.error, loading: false }, false, 'movements/deleteError');
            }

            return result;
          } catch (error) {
            console.error('❌ MovementsStore: Excepción al eliminar:', error);
            const errorMsg = error.message;
            set({ error: errorMsg, loading: false }, false, 'movements/deleteException');
            return { success: false, error: errorMsg };
          }
        },

        /**
         * Validate stock availability before creating a SALIDA movement
         * 
         * @param {string} fuelType - Fuel type
         * @param {string} location - Inventory location
         * @param {number} quantity - Quantity to check
         * @returns {Promise<Object>} Validation result
         * 
         * @example
         * const validation = await validateStock('DIESEL', 'Bodega 1', 50);
         * if (validation.valid) {
         *   // Stock is available
         * }
         */
        validateStock: async (fuelType, location, quantity) => {
          console.log('📦 MovementsStore: validateStock', { fuelType, location, quantity });

          try {
            const result = await movementsService.validateStock(fuelType, location, quantity);
            return result;
          } catch (error) {
            console.error('❌ MovementsStore: Error validando stock:', error);
            return {
              valid: false,
              message: error.message,
            };
          }
        },

        /**
         * Get movements statistics
         * 
         * @returns {Object} Statistics object with totals by type
         * 
         * @example
         * const stats = getStats();
         * console.log(stats.totalEntradas, stats.totalSalidas);
         */
        getStats: () => {
          const { movements } = get();
          
          const stats = {
            total: movements.length,
            totalEntradas: movements.filter(m => m.type === 'entrada').length,
            totalSalidas: movements.filter(m => m.type === 'salida').length,
            totalQuantity: movements.reduce((sum, m) => sum + (m.quantity || 0), 0),
          };

          console.log('📊 MovementsStore: getStats', stats);
          return stats;
        },

        /**
         * Get movements by type (entrada/salida)
         * 
         * @param {string} type - Movement type ('entrada' or 'salida')
         * @returns {Array<Object>} Filtered movements
         * 
         * @example
         * const entradas = getMovementsByType('entrada');
         */
        getMovementsByType: (type) => {
          const { movements } = get();
          return movements.filter(m => m.type === type);
        },

        /**
         * Get movement by ID
         * 
         * @param {string} id - Movement ID
         * @returns {Object|undefined} Movement or undefined
         * 
         * @example
         * const movement = getMovementById('movement-123');
         */
        getMovementById: (id) => {
          const { movements } = get();
          return movements.find(m => m.id === id);
        },

        /**
         * Reset store to initial state
         * 
         * @example
         * reset();
         */
        reset: () => {
          console.log('🔄 MovementsStore: reset');
          const { unsubscribe } = get();
          
          // Cancelar suscripción si existe
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
          }

          set(initialState, false, 'movements/reset');
        },
      }),
      {
        name: 'movements-store',
        enabled: import.meta.env.DEV,
      }
    )
  )
);

// Selectores útiles
/**
 * Selector to get only movements count
 */
export const selectMovementsCount = (state) => state.movements.length;

/**
 * Selector to get loading state
 */
export const selectMovementsLoading = (state) => state.loading;

/**
 * Selector to get movements by type
 */
export const selectMovementsByType = (type) => (state) =>
  state.movements.filter(m => m.type === type);

