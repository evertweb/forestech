/**
 * Hooks Index - Exportación centralizada de custom hooks
 * Facilita imports en toda la aplicación
 * 
 * Uso:
 * import { useMovements, useVehicles, useInventory } from '../../hooks';
 */

// Core hooks
export { useHourMeter } from './useHourMeter';
export { useMovements } from './useMovements';
export { useVehicles } from './useVehicles';
export { useInventory } from './useInventory';

// Additional hooks
export { useProducts } from './useProducts';
export { useSuppliers } from './useSuppliers';
export { useVehicleCategories } from './useVehicleCategories';

