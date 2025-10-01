/**
 * 📊 Inventory Store - Zustand
 * 
 * Store para manejo de inventario y stock de combustibles.
 * Integra con el hook useInventory y FirebaseInventoryService.
 * 
 * @module stores/inventory
 * 
 * @example
 * ```javascript
 * import { useInventoryStore } from '@/stores/inventory.store';
 * 
 * function InventoryComponent() {
 *   const { inventory, loading, fetchInventory, validateStock } = useInventoryStore();
 *   
 *   useEffect(() => {
 *     fetchInventory();
 *   }, [fetchInventory]);
 * }
 * ```
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import FirebaseInventoryService from '../services/FirebaseInventoryService';

// Instancia del servicio
const inventoryService = new FirebaseInventoryService();

/**
 * Inventory Store State
 * 
 * @typedef {Object} InventoryState
 * @property {Array<Object>} inventory - Lista de ubicaciones de inventario
 * @property {boolean} loading - Estado de carga
 * @property {boolean} saving - Estado de guardado
 * @property {string|null} error - Mensaje de error
 * @property {function|null} unsubscribe - Función para cancelar suscripción
 */

const initialState = {
  inventory: [],
  loading: false,
  saving: false,
  error: null,
  unsubscribe: null,
};

/**
 * useInventoryStore - Zustand store for inventory
 * 
 * @returns {InventoryState & InventoryActions} Inventory state and actions
 */
export const useInventoryStore = create(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        // Estado inicial
        ...initialState,

        // Acciones
        /**
         * Fetch all inventory locations
         * 
         * @returns {Promise<void>}
         * 
         * @example
         * await fetchInventory();
         */
        fetchInventory: async () => {
          console.log('📊 InventoryStore: fetchInventory');
          set({ loading: true, error: null }, false, 'inventory/fetch');

          try {
            const result = await inventoryService.getAllInventory();
            
            if (result.success) {
              console.log(`✅ InventoryStore: ${result.data.length} ubicaciones cargadas`);
              set({ inventory: result.data, loading: false }, false, 'inventory/fetchSuccess');
            } else {
              console.error('❌ InventoryStore: Error al cargar inventario:', result.error);
              set({ error: result.error, loading: false }, false, 'inventory/fetchError');
            }
          } catch (error) {
            console.error('❌ InventoryStore: Excepción:', error);
            set({ error: error.message, loading: false }, false, 'inventory/fetchException');
          }
        },

        /**
         * Subscribe to real-time inventory updates
         * 
         * @returns {function} Unsubscribe function
         * 
         * @example
         * const unsubscribe = subscribeToInventory();
         * // Later: unsubscribe();
         */
        subscribeToInventory: () => {
          console.log('📊 InventoryStore: subscribeToInventory');
          
          // Cancelar suscripción anterior si existe
          const { unsubscribe: currentUnsub } = get();
          if (currentUnsub) {
            console.log('📊 InventoryStore: Cancelando suscripción anterior');
            currentUnsub();
          }

          set({ loading: true, error: null }, false, 'inventory/subscribeStart');

          const unsubscribe = inventoryService.subscribeToInventory((data, error) => {
            if (error) {
              console.error('❌ InventoryStore: Error en suscripción:', error);
              set({ error, loading: false }, false, 'inventory/subscribeError');
            } else {
              console.log(`✅ InventoryStore: Suscripción actualizada - ${data.length} ubicaciones`);
              set({ inventory: data, loading: false }, false, 'inventory/subscribeUpdate');
            }
          });

          set({ unsubscribe }, false, 'inventory/subscribeActive');
          return unsubscribe;
        },

        /**
         * Unsubscribe from real-time updates
         * 
         * @example
         * unsubscribeFromInventory();
         */
        unsubscribeFromInventory: () => {
          console.log('📊 InventoryStore: unsubscribeFromInventory');
          const { unsubscribe } = get();
          
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
            set({ unsubscribe: null }, false, 'inventory/unsubscribe');
          }
        },

        /**
         * Create new inventory location
         * 
         * @param {Object} locationData - Location data
         * @returns {Promise<Object>} Result object
         * 
         * @example
         * const result = await createInventoryLocation({
         *   location: 'Bodega 1',
         *   fuelType: 'DIESEL',
         *   maxCapacity: 10000,
         *   minStock: 500
         * });
         */
        createInventoryLocation: async (locationData) => {
          console.log('📊 InventoryStore: createInventoryLocation', locationData.location);
          set({ saving: true, error: null }, false, 'inventory/createStart');

          try {
            const result = await inventoryService.createInventoryLocation(locationData);

            if (result.success) {
              console.log('✅ InventoryStore: Ubicación creada');
              set({ saving: false }, false, 'inventory/createSuccess');
              
              // Refrescar lista
              get().fetchInventory();
            } else {
              console.error('❌ InventoryStore: Error al crear:', result.error);
              set({ error: result.error, saving: false }, false, 'inventory/createError');
            }

            return result;
          } catch (error) {
            console.error('❌ InventoryStore: Excepción:', error);
            const errorMsg = error.message;
            set({ error: errorMsg, saving: false }, false, 'inventory/createException');
            return { success: false, error: errorMsg };
          }
        },

        /**
         * Update inventory location
         * 
         * @param {string} locationId - Location ID
         * @param {Object} updates - Fields to update
         * @returns {Promise<Object>} Result object
         * 
         * @example
         * const result = await updateInventoryLocation('loc-123', { minStock: 1000 });
         */
        updateInventoryLocation: async (locationId, updates) => {
          console.log('📊 InventoryStore: updateInventoryLocation', locationId);
          set({ saving: true, error: null }, false, 'inventory/updateStart');

          try {
            const result = await inventoryService.updateInventoryLocation(locationId, updates);

            if (result.success) {
              console.log('✅ InventoryStore: Ubicación actualizada');
              set({ saving: false }, false, 'inventory/updateSuccess');
              
              // Refrescar lista
              get().fetchInventory();
            } else {
              console.error('❌ InventoryStore: Error al actualizar:', result.error);
              set({ error: result.error, saving: false }, false, 'inventory/updateError');
            }

            return result;
          } catch (error) {
            console.error('❌ InventoryStore: Excepción:', error);
            const errorMsg = error.message;
            set({ error: errorMsg, saving: false }, false, 'inventory/updateException');
            return { success: false, error: errorMsg };
          }
        },

        /**
         * Get inventory by location
         * 
         * @param {string} location - Location name
         * @returns {Array<Object>} Filtered inventory items
         * 
         * @example
         * const bodega1 = getByLocation('Bodega 1');
         */
        getByLocation: (location) => {
          const { inventory } = get();
          return inventory.filter(item => item.location === location);
        },

        /**
         * Get available stock for specific fuel type and location
         * 
         * @param {string} fuelType - Fuel type
         * @param {string} location - Location name
         * @returns {Promise<Object>} Available stock info
         * 
         * @example
         * const stock = await getAvailableStock('DIESEL', 'Bodega 1');
         * console.log(stock.available);
         */
        getAvailableStock: async (fuelType, location) => {
          console.log('📊 InventoryStore: getAvailableStock', { fuelType, location });

          try {
            const result = await inventoryService.getAvailableStock(fuelType, location);
            return result;
          } catch (error) {
            console.error('❌ InventoryStore: Error obteniendo stock:', error);
            return {
              success: false,
              available: 0,
              error: error.message,
            };
          }
        },

        /**
         * Validate if there's enough stock for a movement
         * 
         * @param {string} fuelType - Fuel type
         * @param {string} location - Location name
         * @param {number} quantity - Quantity needed
         * @returns {Promise<Object>} Validation result
         * 
         * @example
         * const validation = await validateStock('DIESEL', 'Bodega 1', 50);
         * if (validation.valid) {
         *   // Proceed with movement
         * }
         */
        validateStock: async (fuelType, location, quantity) => {
          console.log('📊 InventoryStore: validateStock', { fuelType, location, quantity });

          try {
            const result = await inventoryService.validateStock(fuelType, location, quantity);
            return result;
          } catch (error) {
            console.error('❌ InventoryStore: Error validando stock:', error);
            return {
              valid: false,
              message: error.message,
            };
          }
        },

        /**
         * Get low stock alerts
         * 
         * @returns {Promise<Array<Object>>} List of locations with low stock
         * 
         * @example
         * const alerts = await getLowStockAlerts();
         * console.log(`${alerts.length} alertas de stock bajo`);
         */
        getLowStockAlerts: async () => {
          console.log('📊 InventoryStore: getLowStockAlerts');

          try {
            const result = await inventoryService.getLowStockAlerts();
            return result.success ? result.data : [];
          } catch (error) {
            console.error('❌ InventoryStore: Error obteniendo alertas:', error);
            return [];
          }
        },

        /**
         * Get inventory statistics
         * 
         * @returns {Object} Statistics object
         * 
         * @example
         * const stats = getStats();
         * console.log(stats.totalLocations, stats.totalStock);
         */
        getStats: () => {
          const { inventory } = get();
          
          const stats = {
            totalLocations: inventory.length,
            totalStock: inventory.reduce((sum, item) => sum + (item.currentStock || 0), 0),
            totalCapacity: inventory.reduce((sum, item) => sum + (item.maxCapacity || 0), 0),
            lowStockCount: inventory.filter(item => 
              item.currentStock <= item.minStock
            ).length,
          };

          console.log('📊 InventoryStore: getStats', stats);
          return stats;
        },

        /**
         * Reset store to initial state
         * 
         * @example
         * reset();
         */
        reset: () => {
          console.log('🔄 InventoryStore: reset');
          const { unsubscribe } = get();
          
          // Cancelar suscripción si existe
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
          }

          set(initialState, false, 'inventory/reset');
        },
      }),
      {
        name: 'inventory-store',
        enabled: import.meta.env.DEV,
      }
    )
  )
);

// Selectores útiles
/**
 * Selector to get inventory count
 */
export const selectInventoryCount = (state) => state.inventory.length;

/**
 * Selector to get loading state
 */
export const selectInventoryLoading = (state) => state.loading;

/**
 * Selector to get low stock items
 */
export const selectLowStockItems = (state) =>
  state.inventory.filter(item => item.currentStock <= item.minStock);

/**
 * Selector to get inventory by fuel type
 */
export const selectInventoryByFuelType = (fuelType) => (state) =>
  state.inventory.filter(item => item.fuelType === fuelType);

