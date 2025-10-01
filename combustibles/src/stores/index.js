/**
 * 🏪 Stores Index - Exports centralizados
 * 
 * Exporta todos los stores de Zustand para facilitar imports.
 * 
 * @module stores
 * 
 * @example
 * // Import individual stores
 * import { useAuthStore } from '@/stores';
 * import { useMovementsStore, useVehiclesStore } from '@/stores';
 * 
 * // Import with alias
 * import { useAuthStore as useAuth } from '@/stores';
 */

// Import stores for resetAllStores function
// Using TypeScript files where migrated (.ts), JavaScript files (.js) where not yet migrated
import { useAuthStore } from './auth.store.ts';
import { useMovementsStore } from './movements.store';
import { useVehiclesStore } from './vehicles.store';
import { useInventoryStore } from './inventory.store';
import { useProductsStore } from './products.store';

// Re-export Auth Store (migrated to TS)
export { 
  selectUserEmail, 
  selectUserRole, 
  selectLoading, 
  selectIsAuthenticated 
} from './auth.store.ts';

// Re-export Movements Store
export { 
  selectMovementsCount, 
  selectMovementsLoading, 
  selectMovementsByType 
} from './movements.store';

// Re-export Vehicles Store
export { 
  selectVehiclesCount, 
  selectActiveVehicles, 
  selectVehiclesLoading, 
  selectVehiclesWithHourMeter 
} from './vehicles.store';

// Re-export Inventory Store
export { 
  selectInventoryCount, 
  selectInventoryLoading, 
  selectLowStockItems, 
  selectInventoryByFuelType 
} from './inventory.store';

// Re-export Products Store
export { 
  selectProductsCount, 
  selectActiveProducts, 
  selectProductsLoading, 
  selectFuelTypesNames 
} from './products.store';

// Export stores (already imported above)
export { 
  useAuthStore,
  useMovementsStore,
  useVehiclesStore,
  useInventoryStore,
  useProductsStore,
};

/**
 * Reset all stores
 * Útil para logout completo
 * 
 * @example
 * import { resetAllStores } from '@/stores';
 * resetAllStores();
 */
export const resetAllStores = () => {
  console.log('🔄 Resetting all stores...');
  
  // Import stores directly (already imported at top)
  const stores = [
    useAuthStore,
    useMovementsStore,
    useVehiclesStore,
    useInventoryStore,
    useProductsStore,
  ];

  // Reset each store
  stores.forEach(store => {
    if (store && typeof store.getState === 'function') {
      const state = store.getState();
      if (typeof state.reset === 'function') {
        state.reset();
      }
    }
  });

  console.log('✅ All stores reset');
};

