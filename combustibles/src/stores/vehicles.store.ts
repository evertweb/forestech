/**
 * 🚗 Vehicles Store - Zustand (TypeScript)
 * 
 * Store para manejo de vehículos y sus operaciones CRUD.
 * Integra con FirebaseVehiclesService.
 * 
 * @module stores/vehicles
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { VehiclesState } from '../types/store';
import type { Vehicle } from '../types/models';
import type { Result } from '../types/api';
// @ts-expect-error - Service not yet migrated to TypeScript
import FirebaseVehiclesService from '../services/FirebaseVehiclesService';

const vehiclesService = new FirebaseVehiclesService();

const initialState = {
  vehicles: [],
  loading: false,
  saving: false,
  error: null,
  unsubscribe: null,
};

export const useVehiclesStore = create<VehiclesState>()(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        ...initialState,

        fetchVehicles: async (): Promise<void> => {
          console.log('🚗 VehiclesStore: fetchVehicles');
          set({ loading: true, error: null }, false, 'vehicles/fetchStart');

          try {
            const result = await vehiclesService.getAllVehicles();
            
            if (result.success) {
              console.log(`✅ VehiclesStore: ${result.data.length} vehículos cargados`);
              set({ vehicles: result.data, loading: false }, false, 'vehicles/fetchSuccess');
            } else {
              console.error('❌ VehiclesStore: Error:', result.error);
              set({ error: result.error, loading: false }, false, 'vehicles/fetchError');
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ VehiclesStore: Exception:', error);
            set({ error: errorMsg, loading: false }, false, 'vehicles/fetchException');
          }
        },

        fetchActiveVehicles: async (): Promise<void> => {
          console.log('🚗 VehiclesStore: fetchActiveVehicles');
          set({ loading: true, error: null }, false, 'vehicles/fetchActiveStart');

          try {
            const result = await vehiclesService.getActiveVehicles();
            
            if (result.success) {
              console.log(`✅ VehiclesStore: ${result.data.length} vehículos activos`);
              set({ vehicles: result.data, loading: false }, false, 'vehicles/fetchActiveSuccess');
            } else {
              console.error('❌ VehiclesStore: Error:', result.error);
              set({ error: result.error, loading: false }, false, 'vehicles/fetchActiveError');
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ VehiclesStore: Exception:', error);
            set({ error: errorMsg, loading: false }, false, 'vehicles/fetchActiveException');
          }
        },

        subscribeToVehicles: () => {
          console.log('🚗 VehiclesStore: subscribeToVehicles');
          
          const { unsubscribe: currentUnsub } = get();
          if (currentUnsub) {
            console.log('🚗 VehiclesStore: Cancelando suscripción anterior');
            currentUnsub();
          }

          set({ loading: true, error: null }, false, 'vehicles/subscribeStart');

          const unsubscribe = vehiclesService.subscribeToVehicles((data: any, error: any) => {
            if (error) {
              console.error('❌ VehiclesStore: Error en suscripción:', error);
              set({ error, loading: false }, false, 'vehicles/subscribeError');
            } else {
              console.log(`✅ VehiclesStore: ${data.length} vehículos actualizados`);
              set({ vehicles: data, loading: false }, false, 'vehicles/subscribeUpdate');
            }
          });

          set({ unsubscribe }, false, 'vehicles/subscribeActive');
          return unsubscribe;
        },

        unsubscribeFromVehicles: () => {
          console.log('🚗 VehiclesStore: unsubscribeFromVehicles');
          const { unsubscribe } = get();
          
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
            set({ unsubscribe: null }, false, 'vehicles/unsubscribe');
          }
        },

        createVehicle: async (vehicleData: Partial<Vehicle>): Promise<Result<Vehicle>> => {
          console.log('🚗 VehiclesStore: createVehicle', vehicleData.name);
          set({ saving: true, error: null }, false, 'vehicles/createStart');

          try {
            const result = await vehiclesService.createVehicle(vehicleData);

            if (result.success) {
              console.log('✅ VehiclesStore: Vehículo creado');
              set({ saving: false }, false, 'vehicles/createSuccess');
              get().fetchVehicles();
            } else {
              console.error('❌ VehiclesStore: Error:', result.error);
              set({ error: result.error, saving: false }, false, 'vehicles/createError');
            }

            return result;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ VehiclesStore: Exception:', error);
            set({ error: errorMsg, saving: false }, false, 'vehicles/createException');
            return { success: false, error: errorMsg };
          }
        },

        updateVehicle: async (id: string, vehicleData: Partial<Vehicle>): Promise<Result<Vehicle>> => {
          console.log('🚗 VehiclesStore: updateVehicle', id);
          set({ saving: true, error: null }, false, 'vehicles/updateStart');

          try {
            const result = await vehiclesService.updateVehicle(id, vehicleData);

            if (result.success) {
              console.log('✅ VehiclesStore: Vehículo actualizado');
              set({ saving: false }, false, 'vehicles/updateSuccess');
              get().fetchVehicles();
            } else {
              console.error('❌ VehiclesStore: Error:', result.error);
              set({ error: result.error, saving: false }, false, 'vehicles/updateError');
            }

            return result;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ VehiclesStore: Exception:', error);
            set({ error: errorMsg, saving: false }, false, 'vehicles/updateException');
            return { success: false, error: errorMsg };
          }
        },

        deleteVehicle: async (id: string): Promise<Result<void>> => {
          console.log('🚗 VehiclesStore: deleteVehicle', id);
          set({ saving: true, error: null }, false, 'vehicles/deleteStart');

          try {
            const result = await vehiclesService.deleteVehicle(id);

            if (result.success) {
              console.log('✅ VehiclesStore: Vehículo eliminado');
              set({ saving: false }, false, 'vehicles/deleteSuccess');
              get().fetchVehicles();
            } else {
              console.error('❌ VehiclesStore: Error:', result.error);
              set({ error: result.error, saving: false }, false, 'vehicles/deleteError');
            }

            return result;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ VehiclesStore: Exception:', error);
            set({ error: errorMsg, saving: false }, false, 'vehicles/deleteException');
            return { success: false, error: errorMsg };
          }
        },

        getVehicle: (id: string): Vehicle | undefined => {
          const { vehicles } = get();
          return vehicles.find((v) => v.id === id);
        },

        getVehiclesByFuelType: (fuelType: string): Vehicle[] => {
          const { vehicles } = get();
          return vehicles.filter((v) => v.fuelType === fuelType);
        },

        getVehiclesByCategory: (categoryName: string): Vehicle[] => {
          const { vehicles } = get();
          return vehicles.filter((v) => v.categoryName === categoryName);
        },

        reset: () => {
          console.log('🔄 VehiclesStore: reset');
          get().unsubscribeFromVehicles();
          set(initialState, false, 'vehicles/reset');
        },
      }),
      {
        name: 'vehicles-store',
        enabled: import.meta.env.DEV,
      }
    )
  )
);

// Selectores
export const selectVehiclesCount = (state: VehiclesState): number => state.vehicles.length;
export const selectActiveVehicles = (state: VehiclesState): Vehicle[] =>
  state.vehicles.filter((v) => v.active);
export const selectVehiclesLoading = (state: VehiclesState): boolean => state.loading;
export const selectVehiclesWithHourMeter = (state: VehiclesState): Vehicle[] =>
  state.vehicles.filter((v) => v.hasHourMeter);
