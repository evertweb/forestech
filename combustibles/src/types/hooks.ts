/**
 * Hook Types - Return types for custom hooks
 * 
 * These types define the shape of data returned by custom hooks.
 */

import type { 
  Movement, 
  Vehicle, 
  InventoryLocation, 
  Product,
  Supplier,
  VehicleCategory,
  HourMeterReading,
} from './models';
import type { Result, ValidationResult } from './api';

/**
 * UseMovements hook return type
 */
export interface UseMovementsReturn {
  movements: Movement[];
  loading: boolean;
  creating: boolean;
  error: string | null;
  
  // Actions
  fetchMovements: () => Promise<void>;
  createMovement: (data: Partial<Movement>) => Promise<Result<Movement>>;
  deleteMovement: (id: string) => Promise<Result<void>>;
  validateStock: (fuelType: string, location: string, quantity: number) => Promise<ValidationResult>;
  
  // Getters
  getMovementsByType: (type: 'entrada' | 'salida') => Movement[];
  getMovementById: (id: string) => Movement | undefined;
}

/**
 * UseVehicles hook return type
 */
export interface UseVehiclesReturn {
  vehicles: Vehicle[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  
  // Actions
  fetchVehicles: () => Promise<void>;
  fetchActiveVehicles: () => Promise<void>;
  createVehicle: (data: Partial<Vehicle>) => Promise<Result<Vehicle>>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<Result<Vehicle>>;
  deleteVehicle: (id: string) => Promise<Result<void>>;
  
  // Getters
  getVehicle: (id: string) => Vehicle | undefined;
  getVehiclesByFuelType: (fuelType: string) => Vehicle[];
}

/**
 * UseInventory hook return type
 */
export interface UseInventoryReturn {
  inventory: InventoryLocation[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  
  // Actions
  fetchInventory: () => Promise<void>;
  createInventoryLocation: (data: Partial<InventoryLocation>) => Promise<Result<InventoryLocation>>;
  updateInventoryLocation: (id: string, data: Partial<InventoryLocation>) => Promise<Result<InventoryLocation>>;
  validateStock: (fuelType: string, location: string, quantity: number) => Promise<ValidationResult>;
  getLowStockAlerts: () => Promise<InventoryLocation[]>;
  
  // Getters
  getByLocation: (location: string) => InventoryLocation[];
  getAvailableStock: (fuelType: string, location: string) => number;
}

/**
 * UseProducts hook return type
 */
export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  fetchActiveProducts: () => Promise<void>;
  createProduct: (data: Partial<Product>) => Promise<Result<Product>>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<Result<Product>>;
  deleteProduct: (id: string) => Promise<Result<void>>;
  
  // Getters
  getProductById: (id: string) => Product | undefined;
  getProductByName: (name: string) => Product | undefined;
  getFuelTypesForSelect: () => Array<{ value: string; label: string; unit: string }>;
}

/**
 * UseSuppliers hook return type
 */
export interface UseSuppliersReturn {
  suppliers: Supplier[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  
  // Actions
  fetchSuppliers: () => Promise<void>;
  fetchActiveSuppliers: () => Promise<void>;
  createSupplier: (data: Partial<Supplier>) => Promise<Result<Supplier>>;
  updateSupplier: (id: string, data: Partial<Supplier>) => Promise<Result<Supplier>>;
  deleteSupplier: (id: string) => Promise<Result<void>>;
  
  // Getters
  getSupplierById: (id: string) => Supplier | undefined;
  getSupplierByName: (name: string) => Supplier | undefined;
}

/**
 * UseVehicleCategories hook return type
 */
export interface UseVehicleCategoriesReturn {
  categories: VehicleCategory[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  
  // Actions
  fetchCategories: () => Promise<void>;
  createCategory: (data: Partial<VehicleCategory>) => Promise<Result<VehicleCategory>>;
  updateCategory: (id: string, data: Partial<VehicleCategory>) => Promise<Result<VehicleCategory>>;
  deleteCategory: (id: string) => Promise<Result<void>>;
  
  // Getters
  getCategoryById: (id: string) => VehicleCategory | undefined;
  getCategoryByName: (name: string) => VehicleCategory | undefined;
}

/**
 * UseHourMeter hook return type
 */
export interface UseHourMeterReturn {
  readings: HourMeterReading[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  
  // Actions
  fetchReadings: (vehicleId: string) => Promise<void>;
  createReading: (data: Partial<HourMeterReading>) => Promise<Result<HourMeterReading>>;
  
  // Getters
  getLatestReading: (vehicleId: string) => HourMeterReading | undefined;
  getReadingsByVehicle: (vehicleId: string) => HourMeterReading[];
}
