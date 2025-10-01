/**
 * Base Models - Core data structures for Combustibles app
 * 
 * These types define the structure of data throughout the application.
 * All Firebase documents should conform to these interfaces.
 */

/**
 * Movement type - Only ENTRADA or SALIDA allowed
 */
export type MovementType = 'entrada' | 'salida';

/**
 * Movement status
 */
export type MovementStatus = 'pendiente' | 'completado' | 'cancelado';

/**
 * Fuel unit types
 */
export type FuelUnit = 'gal' | 'L' | 'barrel';

/**
 * Movement - Movimiento de combustible (ENTRADA/SALIDA)
 * 
 * Represents a fuel movement in the system.
 * ENTRADA = Purchase/Reception of fuel
 * SALIDA = Consumption by vehicle
 */
export interface Movement {
  id: string;
  type: MovementType;
  fuelType: string;
  quantity: number;
  unitPrice: number;
  location: string;
  vehicleId?: string;
  supplierName?: string;
  description?: string;
  reference?: string;
  status: MovementStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

/**
 * Movement data for creation (without auto-generated fields)
 */
export type MovementData = Omit<Movement, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Vehicle - Vehículo/Maquinaria
 * 
 * Represents a vehicle or machinery that consumes fuel.
 */
export interface Vehicle {
  id: string;
  vehicleId: string;
  name: string;
  fuelType: string;
  categoryName: string;
  hasHourMeter: boolean;
  status: 'activo' | 'inactivo';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Vehicle data for creation
 */
export type VehicleData = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * InventoryLocation - Ubicación de inventario
 * 
 * Represents a storage location for fuel with capacity and stock tracking.
 */
export interface InventoryLocation {
  id: string;
  location: string;
  fuelType: string;
  currentStock: number;
  maxCapacity: number;
  minStock: number;
  unit: FuelUnit;
  createdAt: string;
  updatedAt: string;
}

/**
 * Inventory data for creation
 */
export type InventoryData = Omit<InventoryLocation, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Product - Tipo de combustible (dinámico)
 * 
 * Represents a fuel type that can be dynamically created by users.
 * Replaces hardcoded fuel types with user-defined products.
 */
export interface Product {
  id: string;
  name: string;
  unit: FuelUnit;
  density?: number;
  color?: string;
  active: boolean;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product data for creation
 */
export type ProductData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Supplier - Proveedor de combustible
 */
export interface Supplier {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  category?: string;
  rating?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Supplier data for creation
 */
export type SupplierData = Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * VehicleCategory - Categoría de vehículo
 */
export interface VehicleCategory {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * VehicleCategory data for creation
 */
export type VehicleCategoryData = Omit<VehicleCategory, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * HourMeter - Lectura de horómetro
 */
export interface HourMeterReading {
  id: string;
  vehicleId: string;
  reading: number;
  date: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
}

/**
 * HourMeter data for creation
 */
export type HourMeterData = Omit<HourMeterReading, 'id' | 'createdAt'>;

/**
 * User permissions for combustibles module
 */
export interface CombustiblesPermissions {
  'movements:view'?: boolean;
  'movements:create'?: boolean;
  'movements:delete'?: boolean;
  'vehicles:view'?: boolean;
  'vehicles:create'?: boolean;
  'vehicles:edit'?: boolean;
  'vehicles:delete'?: boolean;
  'inventory:view'?: boolean;
  'inventory:edit'?: boolean;
  'products:view'?: boolean;
  'products:create'?: boolean;
  'products:edit'?: boolean;
  'products:delete'?: boolean;
  'suppliers:view'?: boolean;
  'suppliers:create'?: boolean;
  'suppliers:edit'?: boolean;
  'suppliers:delete'?: boolean;
  'admin:access'?: boolean;
}

/**
 * User profile stored in Firestore
 */
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'supervisor' | 'contador' | 'operador';
  combustiblesPermissions?: CombustiblesPermissions;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Firebase Auth User (simplified)
 */
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}
