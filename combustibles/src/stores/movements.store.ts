/**
 * 📦 Movements Store - Zustand (TypeScript)
 * 
 * Store para manejo de movimientos de combustible (ENTRADA y SALIDA).
 * Integra con FirebaseMovementsService.
 * 
 * @module stores/movements
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { MovementsState } from '../types/store';
import type { Movement } from '../types/models';
import type { Result, ValidationResult, MovementStats } from '../types/api';
// @ts-expect-error - Service not yet migrated to TypeScript
import FirebaseMovementsService from '../services/FirebaseMovementsService';

const movementsService = new FirebaseMovementsService();

const initialState = {
  movements: [],
  loading: false,
  creating: false,
  error: null,
  unsubscribe: null,
};

export const useMovementsStore = create<MovementsState>()(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        ...initialState,

        fetchMovements: async (): Promise<void> => {
          console.log('📦 MovementsStore: fetchMovements');
          set({ loading: true, error: null }, false, 'movements/fetchStart');

          try {
            const result = await movementsService.getAllMovements();
            
            if (result.success) {
              console.log(`✅ MovementsStore: ${result.data.length} movimientos cargados`);
              set({ movements: result.data, loading: false }, false, 'movements/fetchSuccess');
            } else {
              console.error('❌ MovementsStore: Error:', result.error);
              set({ error: result.error, loading: false }, false, 'movements/fetchError');
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ MovementsStore: Exception:', error);
            set({ error: errorMsg, loading: false }, false, 'movements/fetchException');
          }
        },

        subscribeToMovements: () => {
          console.log('📦 MovementsStore: subscribeToMovements');
          
          const { unsubscribe: currentUnsub } = get();
          if (currentUnsub) {
            console.log('📦 MovementsStore: Cancelando suscripción anterior');
            currentUnsub();
          }

          set({ loading: true, error: null }, false, 'movements/subscribeStart');

          const unsubscribe = movementsService.subscribeToMovements((data: any, error: any) => {
            if (error) {
              console.error('❌ MovementsStore: Error en suscripción:', error);
              set({ error, loading: false }, false, 'movements/subscribeError');
            } else {
              console.log(`✅ MovementsStore: ${data.length} movimientos actualizados`);
              set({ movements: data, loading: false }, false, 'movements/subscribeUpdate');
            }
          });

          set({ unsubscribe }, false, 'movements/subscribeActive');
          return unsubscribe;
        },

        unsubscribeFromMovements: () => {
          console.log('📦 MovementsStore: unsubscribeFromMovements');
          const { unsubscribe } = get();
          
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
            set({ unsubscribe: null }, false, 'movements/unsubscribe');
          }
        },

        createMovement: async (movementData: Partial<Movement>): Promise<Result<Movement>> => {
          console.log('📦 MovementsStore: createMovement', movementData.type);
          set({ creating: true, error: null }, false, 'movements/createStart');

          try {
            const result = await movementsService.createMovement(movementData);

            if (result.success) {
              console.log('✅ MovementsStore: Movimiento creado');
              set({ creating: false }, false, 'movements/createSuccess');
              get().fetchMovements();
            } else {
              console.error('❌ MovementsStore: Error:', result.error);
              set({ error: result.error, creating: false }, false, 'movements/createError');
            }

            return result;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ MovementsStore: Exception:', error);
            set({ error: errorMsg, creating: false }, false, 'movements/createException');
            return { success: false, error: errorMsg };
          }
        },

        deleteMovement: async (movementId: string): Promise<Result<void>> => {
          console.log('📦 MovementsStore: deleteMovement', movementId);
          set({ loading: true, error: null }, false, 'movements/deleteStart');

          try {
            const result = await movementsService.deleteMovement(movementId);

            if (result.success) {
              console.log('✅ MovementsStore: Movimiento eliminado');
              set({ loading: false }, false, 'movements/deleteSuccess');
              get().fetchMovements();
            } else {
              console.error('❌ MovementsStore: Error:', result.error);
              set({ error: result.error, loading: false }, false, 'movements/deleteError');
            }

            return result;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ MovementsStore: Exception:', error);
            set({ error: errorMsg, loading: false }, false, 'movements/deleteException');
            return { success: false, error: errorMsg };
          }
        },

        validateStock: async (
          fuelType: string,
          location: string,
          quantity: number
        ): Promise<ValidationResult> => {
          try {
            return await movementsService.validateStock(fuelType, location, quantity);
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            return { valid: false, message: errorMsg };
          }
        },

        getStats: (): MovementStats => {
          const { movements } = get();
          
          const stats: MovementStats = {
            totalEntradas: 0,
            totalSalidas: 0,
            totalQuantityEntrada: 0,
            totalQuantitySalida: 0,
            totalValueEntrada: 0,
            totalValueSalida: 0,
            byFuelType: {},
            byLocation: {},
          };

          movements.forEach((mov) => {
            if (mov.type === 'entrada') {
              stats.totalEntradas++;
              stats.totalQuantityEntrada += mov.quantity;
              stats.totalValueEntrada += mov.quantity * mov.unitPrice;
            } else {
              stats.totalSalidas++;
              stats.totalQuantitySalida += mov.quantity;
              stats.totalValueSalida += mov.quantity * mov.unitPrice;
            }

            // By fuel type
            if (!stats.byFuelType[mov.fuelType]) {
              stats.byFuelType[mov.fuelType] = { entradas: 0, salidas: 0, quantity: 0 };
            }
            if (mov.type === 'entrada') {
              stats.byFuelType[mov.fuelType].entradas++;
            } else {
              stats.byFuelType[mov.fuelType].salidas++;
            }
            stats.byFuelType[mov.fuelType].quantity += mov.quantity;

            // By location
            if (!stats.byLocation[mov.location]) {
              stats.byLocation[mov.location] = { entradas: 0, salidas: 0, quantity: 0 };
            }
            if (mov.type === 'entrada') {
              stats.byLocation[mov.location].entradas++;
            } else {
              stats.byLocation[mov.location].salidas++;
            }
            stats.byLocation[mov.location].quantity += mov.quantity;
          });

          return stats;
        },

        getMovementsByType: (type: 'entrada' | 'salida'): Movement[] => {
          const { movements } = get();
          return movements.filter((m) => m.type === type);
        },

        getMovementById: (id: string): Movement | undefined => {
          const { movements } = get();
          return movements.find((m) => m.id === id);
        },

        reset: () => {
          console.log('🔄 MovementsStore: reset');
          get().unsubscribeFromMovements();
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

// Selectores
export const selectMovementsCount = (state: MovementsState): number => state.movements.length;
export const selectMovementsLoading = (state: MovementsState): boolean => state.loading;
export const selectMovementsByType = (type: 'entrada' | 'salida') => (state: MovementsState): Movement[] =>
  state.movements.filter((m) => m.type === type);
