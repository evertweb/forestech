/**
 * API Types - Result types and service responses
 * 
 * These types are used for handling API responses, errors, and validations.
 */

/**
 * Result type for operations that can fail
 * 
 * Use this pattern for all async operations that might fail.
 * 
 * @example
 * ```ts
 * const result = await createMovement(data);
 * if (result.success) {
 *   console.log('Created:', result.data);
 * } else {
 *   console.error('Error:', result.error);
 * }
 * ```
 */
export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Service response type
 * 
 * Generic response structure for service methods.
 */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Validation result
 * 
 * Used for validating data before operations.
 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
  errors?: Record<string, string>;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Filter parameters for movements
 */
export interface MovementFilters {
  type?: 'entrada' | 'salida';
  fuelType?: string;
  location?: string;
  vehicleId?: string;
  supplierName?: string;
  status?: 'pendiente' | 'completado' | 'cancelado';
  dateFrom?: string;
  dateTo?: string;
}

/**
 * Filter parameters for vehicles
 */
export interface VehicleFilters {
  fuelType?: string;
  categoryName?: string;
  hasHourMeter?: boolean;
  status?: 'activo' | 'inactivo';
  active?: boolean;
}

/**
 * Filter parameters for inventory
 */
export interface InventoryFilters {
  location?: string;
  fuelType?: string;
  lowStock?: boolean;
}

/**
 * Statistics for movements
 */
export interface MovementStats {
  totalEntradas: number;
  totalSalidas: number;
  totalQuantityEntrada: number;
  totalQuantitySalida: number;
  totalValueEntrada: number;
  totalValueSalida: number;
  byFuelType: Record<string, {
    entradas: number;
    salidas: number;
    quantity: number;
  }>;
  byLocation: Record<string, {
    entradas: number;
    salidas: number;
    quantity: number;
  }>;
}

/**
 * Statistics for inventory
 */
export interface InventoryStats {
  totalLocations: number;
  totalStock: number;
  lowStockLocations: number;
  byFuelType: Record<string, {
    locations: number;
    stock: number;
    capacity: number;
  }>;
}

/**
 * Error codes for the application
 */
export enum ErrorCode {
  // Auth errors
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  
  // Validation errors
  INVALID_DATA = 'INVALID_DATA',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Business logic errors
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  NOT_FOUND = 'NOT_FOUND',
  
  // System errors
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Application error with code
 */
export interface AppError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}
