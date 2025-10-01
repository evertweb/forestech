/**
 * Store Types - Zustand store interfaces
 * 
 * These interfaces define the shape of each Zustand store.
 */

import type { 
  Movement, 
  Vehicle, 
  InventoryLocation, 
  Product,
  Supplier,
  VehicleCategory,
  UserProfile,
  FirebaseUser,
} from './models';
import type { Result, ValidationResult, MovementStats, InventoryStats } from './api';

/**
 * Auth Store State
 * 
 * Manages authentication and user permissions.
 */
export interface AuthState {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  authReady: boolean;
  
  // Actions
  setUser: (user: FirebaseUser | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAuthReady: (ready: boolean) => void;
  
  // Helpers
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isCounterOrAbove: () => boolean;
  reset: () => void;
}

/**
 * Movements Store State
 * 
 * Manages fuel movements (ENTRADA/SALIDA).
 */
export interface MovementsState {
  movements: Movement[];
  loading: boolean;
  creating: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  
  // Actions
  fetchMovements: () => Promise<void>;
  subscribeToMovements: () => () => void;
  unsubscribeFromMovements: () => void;
  createMovement: (data: Partial<Movement>) => Promise<Result<Movement>>;
  deleteMovement: (id: string) => Promise<Result<void>>;
  validateStock: (fuelType: string, location: string, quantity: number) => Promise<ValidationResult>;
  
  // Getters
  getStats: () => MovementStats;
  getMovementsByType: (type: 'entrada' | 'salida') => Movement[];
  getMovementById: (id: string) => Movement | undefined;
  reset: () => void;
}

/**
 * Vehicles Store State
 * 
 * Manages vehicles and machinery.
 */
export interface VehiclesState {
  vehicles: Vehicle[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  
  // Actions
  fetchVehicles: () => Promise<void>;
  fetchActiveVehicles: () => Promise<void>;
  subscribeToVehicles: () => () => void;
  unsubscribeFromVehicles: () => void;
  createVehicle: (data: Partial<Vehicle>) => Promise<Result<Vehicle>>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<Result<Vehicle>>;
  deleteVehicle: (id: string) => Promise<Result<void>>;
  
  // Getters
  getVehicle: (id: string) => Vehicle | undefined;
  getVehiclesByFuelType: (fuelType: string) => Vehicle[];
  getVehiclesByCategory: (categoryName: string) => Vehicle[];
  reset: () => void;
}

/**
 * Inventory Store State
 * 
 * Manages fuel inventory across locations.
 */
export interface InventoryState {
  inventory: InventoryLocation[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  
  // Actions
  fetchInventory: () => Promise<void>;
  subscribeToInventory: () => () => void;
  unsubscribeFromInventory: () => void;
  createInventoryLocation: (data: Partial<InventoryLocation>) => Promise<Result<InventoryLocation>>;
  updateInventoryLocation: (id: string, data: Partial<InventoryLocation>) => Promise<Result<InventoryLocation>>;
  
  // Getters
  getByLocation: (location: string) => InventoryLocation[];
  getAvailableStock: (fuelType: string, location: string) => number;
  validateStock: (fuelType: string, location: string, quantity: number) => Promise<ValidationResult>;
  getLowStockAlerts: () => Promise<InventoryLocation[]>;
  getStats: () => InventoryStats;
  reset: () => void;
}

/**
 * Products Store State
 * 
 * Manages fuel types (products) that are dynamically created by users.
 */
export interface ProductsState {
  products: Product[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  
  // Actions
  fetchProducts: () => Promise<void>;
  fetchActiveProducts: () => Promise<void>;
  subscribeToProducts: () => () => void;
  unsubscribeFromProducts: () => void;
  createProduct: (data: Partial<Product>) => Promise<Result<Product>>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<Result<Product>>;
  deleteProduct: (id: string) => Promise<Result<void>>;
  
  // Getters
  getProductById: (id: string) => Product | undefined;
  getProductByName: (name: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getFuelTypesForSelect: () => Array<{ value: string; label: string; unit: string }>;
  reset: () => void;
}

/**
 * Suppliers Store State (if implemented in future)
 */
export interface SuppliersState {
  suppliers: Supplier[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  unsubscribe: (() => void) | null;
  
  // Actions
  fetchSuppliers: () => Promise<void>;
  fetchActiveSuppliers: () => Promise<void>;
  subscribeToSuppliers: () => () => void;
  unsubscribeFromSuppliers: () => void;
  createSupplier: (data: Partial<Supplier>) => Promise<Result<Supplier>>;
  updateSupplier: (id: string, data: Partial<Supplier>) => Promise<Result<Supplier>>;
  deleteSupplier: (id: string) => Promise<Result<void>>;
  
  // Getters
  getSupplierById: (id: string) => Supplier | undefined;
  getSupplierByName: (name: string) => Supplier | undefined;
  reset: () => void;
}

/**
 * Vehicle Categories Store State (if implemented in future)
 */
export interface VehicleCategoriesState {
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
  reset: () => void;
}
