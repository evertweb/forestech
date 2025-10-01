/**
 * 🚗 Vehicles Store - Zustand
 * 
 * Store para manejo de vehículos y sus operaciones CRUD.
 * Integra con el hook useVehicles y FirebaseVehiclesService.
 * 
 * @module stores/vehicles
 * 
 * @example
 * ```javascript
 * import { useVehiclesStore } from '@/stores/vehicles.store';
 * 
 * function VehiclesComponent() {
 *   const { vehicles, loading, fetchVehicles, createVehicle } = useVehiclesStore();
 *   
 *   useEffect(() => {
 *     fetchVehicles();
 *   }, [fetchVehicles]);
 * }
 * ```
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import FirebaseVehiclesService from '../services/FirebaseVehiclesService';

// Instancia del servicio
const vehiclesService = new FirebaseVehiclesService();

/**
 * Vehicles Store State
 * 
 * @typedef {Object} VehiclesState
 * @property {Array<Object>} vehicles - Lista de vehículos
 * @property {boolean} loading - Estado de carga
 * @property {boolean} saving - Estado de guardado
 * @property {string|null} error - Mensaje de error
 * @property {function|null} unsubscribe - Función para cancelar suscripción
 */

const initialState = {
  vehicles: [],
  loading: false,
  saving: false,
  error: null,
  unsubscribe: null,
};

/**
 * useVehiclesStore - Zustand store for vehicles
 * 
 * @returns {VehiclesState & VehiclesActions} Vehicles state and actions
 */
export const useVehiclesStore = create(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        // Estado inicial
        ...initialState,

        // Acciones
        /**
         * Fetch all vehicles
         * 
         * @returns {Promise<void>}
         * 
         * @example
         * await fetchVehicles();
         */
        fetchVehicles: async () => {
          console.log('🚗 VehiclesStore: fetchVehicles');
          set({ loading: true, error: null }, false, 'vehicles/fetch');

          try {
            const result = await vehiclesService.getAllVehicles();
            
            if (result.success) {
              console.log(`✅ VehiclesStore: ${result.data.length} vehículos cargados`);
              set({ vehicles: result.data, loading: false }, false, 'vehicles/fetchSuccess');
            } else {
              console.error('❌ VehiclesStore: Error al cargar vehículos:', result.error);
              set({ error: result.error, loading: false }, false, 'vehicles/fetchError');
            }
          } catch (error) {
            console.error('❌ VehiclesStore: Excepción:', error);
            set({ error: error.message, loading: false }, false, 'vehicles/fetchException');
          }
        },

        /**
         * Fetch only active vehicles
         * 
         * @returns {Promise<void>}
         * 
         * @example
         * await fetchActiveVehicles();
         */
        fetchActiveVehicles: async () => {
          console.log('🚗 VehiclesStore: fetchActiveVehicles');
          set({ loading: true, error: null }, false, 'vehicles/fetchActive');

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
            console.error('❌ VehiclesStore: Excepción:', error);
            set({ error: error.message, loading: false }, false, 'vehicles/fetchActiveException');
          }
        },

        /**
         * Subscribe to real-time vehicles updates
         * 
         * @returns {function} Unsubscribe function
         * 
         * @example
         * const unsubscribe = subscribeToVehicles();
         * // Later: unsubscribe();
         */
        subscribeToVehicles: () => {
          console.log('🚗 VehiclesStore: subscribeToVehicles');
          
          // Cancelar suscripción anterior si existe
          const { unsubscribe: currentUnsub } = get();
          if (currentUnsub) {
            console.log('🚗 VehiclesStore: Cancelando suscripción anterior');
            currentUnsub();
          }

          set({ loading: true, error: null }, false, 'vehicles/subscribeStart');

          const unsubscribe = vehiclesService.subscribeToVehicles((data, error) => {
            if (error) {
              console.error('❌ VehiclesStore: Error en suscripción:', error);
              set({ error, loading: false }, false, 'vehicles/subscribeError');
            } else {
              console.log(`✅ VehiclesStore: Suscripción actualizada - ${data.length} vehículos`);
              set({ vehicles: data, loading: false }, false, 'vehicles/subscribeUpdate');
            }
          });

          set({ unsubscribe }, false, 'vehicles/subscribeActive');
          return unsubscribe;
        },

        /**
         * Unsubscribe from real-time updates
         * 
         * @example
         * unsubscribeFromVehicles();
         */
        unsubscribeFromVehicles: () => {
          console.log('🚗 VehiclesStore: unsubscribeFromVehicles');
          const { unsubscribe } = get();
          
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
            set({ unsubscribe: null }, false, 'vehicles/unsubscribe');
          }
        },

        /**
         * Create new vehicle
         * 
         * @param {Object} vehicleData - Vehicle data
         * @returns {Promise<Object>} Result object
         * 
         * @example
         * const result = await createVehicle({
         *   vehicleId: 'TR-001',
         *   name: 'Tractor 1',
         *   fuelType: 'DIESEL',
         *   hasHourMeter: true
         * });
         */
        createVehicle: async (vehicleData) => {
          console.log('🚗 VehiclesStore: createVehicle', vehicleData.name);
          set({ saving: true, error: null }, false, 'vehicles/createStart');

          try {
            const result = await vehiclesService.createVehicle(vehicleData);

            if (result.success) {
              console.log('✅ VehiclesStore: Vehículo creado');
              set({ saving: false }, false, 'vehicles/createSuccess');
              
              // Refrescar lista
              get().fetchVehicles();
            } else {
              console.error('❌ VehiclesStore: Error al crear:', result.error);
              set({ error: result.error, saving: false }, false, 'vehicles/createError');
            }

            return result;
          } catch (error) {
            console.error('❌ VehiclesStore: Excepción:', error);
            const errorMsg = error.message;
            set({ error: errorMsg, saving: false }, false, 'vehicles/createException');
            return { success: false, error: errorMsg };
          }
        },

        /**
         * Update existing vehicle
         * 
         * @param {string} vehicleId - Vehicle ID
         * @param {Object} updates - Fields to update
         * @returns {Promise<Object>} Result object
         * 
         * @example
         * const result = await updateVehicle('vehicle-123', { name: 'New Name' });
         */
        updateVehicle: async (vehicleId, updates) => {
          console.log('🚗 VehiclesStore: updateVehicle', vehicleId);
          set({ saving: true, error: null }, false, 'vehicles/updateStart');

          try {
            const result = await vehiclesService.updateVehicle(vehicleId, updates);

            if (result.success) {
              console.log('✅ VehiclesStore: Vehículo actualizado');
              set({ saving: false }, false, 'vehicles/updateSuccess');
              
              // Refrescar lista
              get().fetchVehicles();
            } else {
              console.error('❌ VehiclesStore: Error al actualizar:', result.error);
              set({ error: result.error, saving: false }, false, 'vehicles/updateError');
            }

            return result;
          } catch (error) {
            console.error('❌ VehiclesStore: Excepción:', error);
            const errorMsg = error.message;
            set({ error: errorMsg, saving: false }, false, 'vehicles/updateException');
            return { success: false, error: errorMsg };
          }
        },

        /**
         * Delete vehicle
         * 
         * @param {string} vehicleId - Vehicle ID
         * @returns {Promise<Object>} Result object
         * 
         * @example
         * const result = await deleteVehicle('vehicle-123');
         */
        deleteVehicle: async (vehicleId) => {
          console.log('🚗 VehiclesStore: deleteVehicle', vehicleId);
          set({ loading: true, error: null }, false, 'vehicles/deleteStart');

          try {
            const result = await vehiclesService.deleteVehicle(vehicleId);

            if (result.success) {
              console.log('✅ VehiclesStore: Vehículo eliminado');
              set({ loading: false }, false, 'vehicles/deleteSuccess');
              
              // Refrescar lista
              get().fetchVehicles();
            } else {
              console.error('❌ VehiclesStore: Error al eliminar:', result.error);
              set({ error: result.error, loading: false }, false, 'vehicles/deleteError');
            }

            return result;
          } catch (error) {
            console.error('❌ VehiclesStore: Excepción:', error);
            const errorMsg = error.message;
            set({ error: errorMsg, loading: false }, false, 'vehicles/deleteException');
            return { success: false, error: errorMsg };
          }
        },

        /**
         * Get vehicle by ID
         * 
         * @param {string} id - Vehicle ID
         * @returns {Promise<Object>} Result with vehicle data
         * 
         * @example
         * const result = await getVehicle('vehicle-123');
         */
        getVehicle: async (id) => {
          console.log('🚗 VehiclesStore: getVehicle', id);

          try {
            const result = await vehiclesService.getVehicle(id);
            return result;
          } catch (error) {
            console.error('❌ VehiclesStore: Error obteniendo vehículo:', error);
            return { success: false, error: error.message };
          }
        },

        /**
         * Get vehicles by fuel type
         * 
         * @param {string} fuelType - Fuel type (e.g., 'DIESEL', 'GASOLINA')
         * @returns {Array<Object>} Filtered vehicles
         * 
         * @example
         * const dieselVehicles = getVehiclesByFuelType('DIESEL');
         */
        getVehiclesByFuelType: (fuelType) => {
          const { vehicles } = get();
          return vehicles.filter(v => v.fuelType === fuelType);
        },

        /**
         * Get vehicles by category
         * 
         * @param {string} categoryName - Category name
         * @returns {Array<Object>} Filtered vehicles
         * 
         * @example
         * const tractors = getVehiclesByCategory('Tractor');
         */
        getVehiclesByCategory: (categoryName) => {
          const { vehicles } = get();
          return vehicles.filter(v => v.categoryName === categoryName);
        },

        /**
         * Reset store to initial state
         * 
         * @example
         * reset();
         */
        reset: () => {
          console.log('🔄 VehiclesStore: reset');
          const { unsubscribe } = get();
          
          // Cancelar suscripción si existe
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
          }

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

// Selectores útiles
/**
 * Selector to get vehicles count
 */
export const selectVehiclesCount = (state) => state.vehicles.length;

/**
 * Selector to get active vehicles only
 */
export const selectActiveVehicles = (state) =>
  state.vehicles.filter(v => v.status === 'activo' || v.active);

/**
 * Selector to get loading state
 */
export const selectVehiclesLoading = (state) => state.loading;

/**
 * Selector to get vehicles with hour meter
 */
export const selectVehiclesWithHourMeter = (state) =>
  state.vehicles.filter(v => v.hasHourMeter);

