/**
 * Central export point for all type definitions
 * 
 * Import types from here to ensure consistency across the application.
 * 
 * @example
 * ```ts
 * import type { Movement, Result, AuthState } from '@/types';
 * ```
 */

// Models
export type {
  Movement,
  MovementType,
  MovementStatus,
  MovementData,
  Vehicle,
  VehicleData,
  InventoryLocation,
  InventoryData,
  Product,
  ProductData,
  Supplier,
  SupplierData,
  VehicleCategory,
  VehicleCategoryData,
  HourMeterReading,
  HourMeterData,
  CombustiblesPermissions,
  UserProfile,
  FirebaseUser,
  FuelUnit,
} from './models';

// API Types
export type {
  Result,
  ServiceResponse,
  ValidationResult,
  PaginationParams,
  PaginatedResponse,
  MovementFilters,
  VehicleFilters,
  InventoryFilters,
  MovementStats,
  InventoryStats,
  AppError,
} from './api';

export { ErrorCode } from './api';

// Store Types
export type {
  AuthState,
  MovementsState,
  VehiclesState,
  InventoryState,
  ProductsState,
  SuppliersState,
  VehicleCategoriesState,
} from './store';

// Hook Types
export type {
  UseMovementsReturn,
  UseVehiclesReturn,
  UseInventoryReturn,
  UseProductsReturn,
  UseSuppliersReturn,
  UseVehicleCategoriesReturn,
  UseHourMeterReturn,
} from './hooks';
