/**
 * Hooks Index - Exportación centralizada de custom hooks
 * Facilita imports en toda la aplicación
 * 
 * Uso:
 * import { useMovements, useVehicles, useInventory } from '../../hooks';
 */

// Core hooks (migrated to TypeScript)
export { useHourMeter } from './useHourMeter.ts';
export { useMovements } from './useMovements.ts';
export { useVehicles } from './useVehicles.ts';
export { useInventory } from './useInventory.ts';

// Additional hooks (migrated to TypeScript)
export { useProducts } from './useProducts.ts';
export { useSuppliers } from './useSuppliers.ts';
export { useVehicleCategories } from './useVehicleCategories.ts';

