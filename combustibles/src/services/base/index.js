/**
 * Services Base - Índice de exportación
 * Facilita imports de clases base y servicios refactorizados
 * 
 * Forestech Colombia - Combustibles App
 * @author AI Agent - TASK 1.2 BaseService Implementation
 * @date 2025-01-04
 */

// Clases base
export { BaseService } from './BaseService.js';
export { CRUDService } from './CRUDService.js';

// Servicios refactorizados
export { default as suppliersService } from '../suppliersServiceNew.js';
export { default as vehiclesService } from '../vehiclesServiceNew.js';
export { default as productsService } from '../productsServiceNew.js';

// Re-exportar métodos de servicios para compatibilidad
export * as SuppliersAPI from '../suppliersServiceNew.js';
export * as VehiclesAPI from '../vehiclesServiceNew.js';
export * as ProductsAPI from '../productsServiceNew.js';
