/**
 * 📊 Inventory Store - Zustand (TypeScript)
 * 
 * Store para manejo de inventario y stock de combustibles.
 * Integra con FirebaseInventoryService.
 * 
 * @module stores/inventory
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { InventoryState } from '../types/store';
import type { InventoryLocation } from '../types/models';
import type { Result, ValidationResult, InventoryStats } from '../types/api';
// @ts-expect-error - Service not yet migrated to TypeScript
import FirebaseInventoryService from '../services/FirebaseInventoryService';

const inventoryService = new FirebaseInventoryService();

const initialState = {
  inventory: [],
  loading: false,
  saving: false,
  error: null,
  unsubscribe: null,
};

export const useInventoryStore = create<InventoryState>()(
  subscribeWithSelector(
    devtools(
      (set, get) => ({
        ...initialState,

        fetchInventory: async (): Promise<void> => {
          console.log('📊 InventoryStore: fetchInventory');
          set({ loading: true, error: null }, false, 'inventory/fetchStart');

          try {
            const result = await inventoryService.getAllInventory();
            
            if (result.success) {
              console.log(`✅ InventoryStore: ${result.data.length} ubicaciones cargadas`);
              set({ inventory: result.data, loading: false }, false, 'inventory/fetchSuccess');
            } else {
              console.error('❌ InventoryStore: Error:', result.error);
              set({ error: result.error, loading: false }, false, 'inventory/fetchError');
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ InventoryStore: Exception:', error);
            set({ error: errorMsg, loading: false }, false, 'inventory/fetchException');
          }
        },

        subscribeToInventory: () => {
          console.log('📊 InventoryStore: subscribeToInventory');
          
          const { unsubscribe: currentUnsub } = get();
          if (currentUnsub) {
            console.log('📊 InventoryStore: Cancelando suscripción anterior');
            currentUnsub();
          }

          set({ loading: true, error: null }, false, 'inventory/subscribeStart');

          const unsubscribe = inventoryService.subscribeToInventory((data: any, error: any) => {
            if (error) {
              console.error('❌ InventoryStore: Error en suscripción:', error);
              set({ error, loading: false }, false, 'inventory/subscribeError');
            } else {
              console.log(`✅ InventoryStore: ${data.length} ubicaciones actualizadas`);
              set({ inventory: data, loading: false }, false, 'inventory/subscribeUpdate');
            }
          });

          set({ unsubscribe }, false, 'inventory/subscribeActive');
          return unsubscribe;
        },

        unsubscribeFromInventory: () => {
          console.log('📊 InventoryStore: unsubscribeFromInventory');
          const { unsubscribe } = get();
          
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
            set({ unsubscribe: null }, false, 'inventory/unsubscribe');
          }
        },

        createInventoryLocation: async (data: Partial<InventoryLocation>): Promise<Result<InventoryLocation>> => {
          console.log('📊 InventoryStore: createInventoryLocation', data.location);
          set({ saving: true, error: null }, false, 'inventory/createStart');

          try {
            const result = await inventoryService.createInventoryLocation(data);

            if (result.success) {
              console.log('✅ InventoryStore: Ubicación creada');
              set({ saving: false }, false, 'inventory/createSuccess');
              get().fetchInventory();
            } else {
              console.error('❌ InventoryStore: Error:', result.error);
              set({ error: result.error, saving: false }, false, 'inventory/createError');
            }

            return result;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ InventoryStore: Exception:', error);
            set({ error: errorMsg, saving: false }, false, 'inventory/createException');
            return { success: false, error: errorMsg };
          }
        },

        updateInventoryLocation: async (id: string, data: Partial<InventoryLocation>): Promise<Result<InventoryLocation>> => {
          console.log('📊 InventoryStore: updateInventoryLocation', id);
          set({ saving: true, error: null }, false, 'inventory/updateStart');

          try {
            const result = await inventoryService.updateInventoryLocation(id, data);

            if (result.success) {
              console.log('✅ InventoryStore: Ubicación actualizada');
              set({ saving: false }, false, 'inventory/updateSuccess');
              get().fetchInventory();
            } else {
              console.error('❌ InventoryStore: Error:', result.error);
              set({ error: result.error, saving: false }, false, 'inventory/updateError');
            }

            return result;
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ InventoryStore: Exception:', error);
            set({ error: errorMsg, saving: false }, false, 'inventory/updateException');
            return { success: false, error: errorMsg };
          }
        },

        getByLocation: (location: string): InventoryLocation[] => {
          const { inventory } = get();
          return inventory.filter((item) => item.location === location);
        },

        getAvailableStock: (fuelType: string, location: string): number => {
          const { inventory } = get();
          const item = inventory.find((i) => i.fuelType === fuelType && i.location === location);
          return item?.currentStock || 0;
        },

        validateStock: async (fuelType: string, location: string, quantity: number): Promise<ValidationResult> => {
          try {
            const availableStock = get().getAvailableStock(fuelType, location);
            
            if (availableStock >= quantity) {
              return { valid: true };
            } else {
              return {
                valid: false,
                message: `Stock insuficiente. Disponible: ${availableStock}, Requerido: ${quantity}`,
              };
            }
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            return { valid: false, message: errorMsg };
          }
        },

        getLowStockAlerts: async (): Promise<InventoryLocation[]> => {
          const { inventory } = get();
          return inventory.filter((item) => item.currentStock <= item.minStock);
        },

        getStats: (): InventoryStats => {
          const { inventory } = get();
          
          const stats: InventoryStats = {
            totalLocations: inventory.length,
            totalStock: 0,
            lowStockLocations: 0,
            byFuelType: {},
          };

          inventory.forEach((item) => {
            stats.totalStock += item.currentStock;
            
            if (item.currentStock <= item.minStock) {
              stats.lowStockLocations++;
            }

            if (!stats.byFuelType[item.fuelType]) {
              stats.byFuelType[item.fuelType] = {
                locations: 0,
                stock: 0,
                capacity: 0,
              };
            }

            stats.byFuelType[item.fuelType].locations++;
            stats.byFuelType[item.fuelType].stock += item.currentStock;
            stats.byFuelType[item.fuelType].capacity += item.maxCapacity;
          });

          return stats;
        },

        reset: () => {
          console.log('🔄 InventoryStore: reset');
          get().unsubscribeFromInventory();
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

// Selectores
export const selectInventoryCount = (state: InventoryState): number => state.inventory.length;
export const selectInventoryLoading = (state: InventoryState): boolean => state.loading;
export const selectLowStockItems = (state: InventoryState): InventoryLocation[] =>
  state.inventory.filter((item) => item.currentStock <= item.minStock);
export const selectInventoryByFuelType = (fuelType: string) => (state: InventoryState): InventoryLocation[] =>
  state.inventory.filter((item) => item.fuelType === fuelType);
