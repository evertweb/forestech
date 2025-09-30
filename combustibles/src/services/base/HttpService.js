/**
 * HttpService - Servicio base para comunicación con Firebase Functions
 * Migrado de Cloud Run a Firebase Functions usando httpsCallable
 * Forestech Combustibles App
 */

import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Mapeo de endpoints de Cloud Run a Firebase Functions
const ENDPOINT_TO_FUNCTION_MAP = {
  // Categorías de vehículos
  'sqlCreateCategory': { functionName: 'combustiblesCategories', action: 'create' },
  'sqlGetAllCategories': { functionName: 'combustiblesCategories', action: 'getAll' },
  'sqlGetCategory': { functionName: 'combustiblesCategories', action: 'getById' },
  'sqlGetCategoryByCode': { functionName: 'combustiblesCategories', action: 'getByCode' },
  'sqlUpdateCategory': { functionName: 'combustiblesCategories', action: 'update' },
  'sqlDeleteCategory': { functionName: 'combustiblesCategories', action: 'delete' },
  'sqlUpdateVehicleCount': { functionName: 'combustiblesCategories', action: 'updateVehicleCount' },
  'sqlReorderCategories': { functionName: 'combustiblesCategories', action: 'reorder' },
  'sqlGetActiveCategories': { functionName: 'combustiblesCategories', action: 'getActive' },
  'sqlGetCategoryStats': { functionName: 'combustiblesCategories', action: 'getStats' },

  // Vehículos
  'sqlCreateVehicle': { functionName: 'combustiblesVehicles', action: 'create' },
  'sqlGetAllVehicles': { functionName: 'combustiblesVehicles', action: 'getAll' },
  'sqlGetVehicle': { functionName: 'combustiblesVehicles', action: 'getById' },
  'sqlGetVehicleByCode': { functionName: 'combustiblesVehicles', action: 'getByCode' },
  'sqlUpdateVehicle': { functionName: 'combustiblesVehicles', action: 'update' },
  'sqlDeleteVehicle': { functionName: 'combustiblesVehicles', action: 'delete' },
  'sqlGetVehiclesStats': { functionName: 'combustiblesVehicles', action: 'getStats' },

  // Movimientos
  'sqlCreateMovement': { functionName: 'combustiblesMovements', action: 'create' },
  'sqlGetAllMovements': { functionName: 'combustiblesMovements', action: 'getAll' },
  'sqlGetMovement': { functionName: 'combustiblesMovements', action: 'getById' },
  'sqlUpdateMovement': { functionName: 'combustiblesMovements', action: 'update' },
  'sqlDeleteMovement': { functionName: 'combustiblesMovements', action: 'delete' },
  'sqlGetMovementsByVehicle': { functionName: 'combustiblesMovements', action: 'getByVehicle' },
  'sqlGetMovementsByDateRange': { functionName: 'combustiblesMovements', action: 'getByDateRange' },
  'sqlGetMovementsByLocation': { functionName: 'combustiblesMovements', action: 'getByLocation' },
  'sqlGetMovementsStats': { functionName: 'combustiblesMovements', action: 'getStats' },
  'sqlGetFuelConsumptionByPeriod': { functionName: 'combustiblesMovements', action: 'getFuelConsumptionByPeriod' },
  'sqlGetPendingMovements': { functionName: 'combustiblesMovements', action: 'getPending' },
  'sqlApproveMovement': { functionName: 'combustiblesMovements', action: 'approve' },
  'sqlRejectMovement': { functionName: 'combustiblesMovements', action: 'reject' },

  // Inventario
  'sqlCreateInventoryItem': { functionName: 'combustiblesInventory', action: 'create' },
  'sqlGetAllInventory': { functionName: 'combustiblesInventory', action: 'getAll' },
  'sqlGetInventoryItem': { functionName: 'combustiblesInventory', action: 'getById' },
  'sqlUpdateInventoryItem': { functionName: 'combustiblesInventory', action: 'update' },
  'sqlDeleteInventoryItem': { functionName: 'combustiblesInventory', action: 'delete' },
  'sqlGetInventoryByLocation': { functionName: 'combustiblesInventory', action: 'getByLocation' },
  'sqlUpdateStock': { functionName: 'combustiblesInventory', action: 'updateStock' },
  'sqlGetLowStockItems': { functionName: 'combustiblesInventory', action: 'getLowStock' },
  'sqlGetInventorySummary': { functionName: 'combustiblesInventory', action: 'getSummary' },

  // Proveedores
  'sqlCreateSupplier': { functionName: 'combustiblesSuppliers', action: 'create' },
  'sqlGetAllSuppliers': { functionName: 'combustiblesSuppliers', action: 'getAll' },
  'sqlGetSupplier': { functionName: 'combustiblesSuppliers', action: 'getById' },
  'sqlGetSupplierById': { functionName: 'combustiblesSuppliers', action: 'getById' },
  'sqlUpdateSupplier': { functionName: 'combustiblesSuppliers', action: 'update' },
  'sqlDeleteSupplier': { functionName: 'combustiblesSuppliers', action: 'delete' },
  'sqlGetSupplierStats': { functionName: 'combustiblesSuppliers', action: 'getStats' },

  // Productos
  'sqlCreateProduct': { functionName: 'combustiblesProducts', action: 'create' },
  'sqlGetAllProducts': { functionName: 'combustiblesProducts', action: 'getAll' },
  'sqlGetProduct': { functionName: 'combustiblesProducts', action: 'getById' },
  'sqlUpdateProduct': { functionName: 'combustiblesProducts', action: 'update' },
  'sqlDeleteProduct': { functionName: 'combustiblesProducts', action: 'delete' },
  'sqlGetProductsByCategory': { functionName: 'combustiblesProducts', action: 'getByCategory' },
  'sqlGetProductStats': { functionName: 'combustiblesProducts', action: 'getStats' },
  'sqlGetActiveProducts': { functionName: 'combustiblesProducts', action: 'getActive' },
  'sqlUpdateProductStock': { functionName: 'combustiblesProducts', action: 'updateStock' },
  'sqlSearchProducts': { functionName: 'combustiblesProducts', action: 'search' },
  'sqlGetLowStockProducts': { functionName: 'combustiblesProducts', action: 'getLowStock' },
  'sqlGetProductByCode': { functionName: 'combustiblesProducts', action: 'getByCode' },

  // Categorías de productos
  'sqlCreateProductCategory': { functionName: 'combustiblesProducts', action: 'createCategory' },
  'sqlGetProductCategories': { functionName: 'combustiblesProducts', action: 'getCategories' },
  'sqlGetProductCategory': { functionName: 'combustiblesProducts', action: 'getCategoryById' },
  'sqlUpdateProductCategory': { functionName: 'combustiblesProducts', action: 'updateCategory' },
  'sqlDeleteProductCategory': { functionName: 'combustiblesProducts', action: 'deleteCategory' },

  // Mantenimiento
  'sqlCreateMaintenance': { functionName: 'combustiblesMaintenance', action: 'create' },
  'sqlCreateMaintenanceRecord': { functionName: 'combustiblesMaintenance', action: 'create' },
  'sqlGetAllMaintenance': { functionName: 'combustiblesMaintenance', action: 'getAll' },
  'sqlGetAllMaintenanceRecords': { functionName: 'combustiblesMaintenance', action: 'getAll' },
  'sqlGetMaintenance': { functionName: 'combustiblesMaintenance', action: 'getById' },
  'sqlGetMaintenanceRecord': { functionName: 'combustiblesMaintenance', action: 'getById' },
  'sqlUpdateMaintenance': { functionName: 'combustiblesMaintenance', action: 'update' },
  'sqlUpdateMaintenanceRecord': { functionName: 'combustiblesMaintenance', action: 'update' },
  'sqlDeleteMaintenance': { functionName: 'combustiblesMaintenance', action: 'delete' },
  'sqlDeleteMaintenanceRecord': { functionName: 'combustiblesMaintenance', action: 'delete' },
  'sqlGetMaintenanceByVehicle': { functionName: 'combustiblesMaintenance', action: 'getByVehicle' },
  'sqlGetUpcomingMaintenance': { functionName: 'combustiblesMaintenance', action: 'getUpcoming' },
  'sqlGetMaintenanceStats': { functionName: 'combustiblesMaintenance', action: 'getStats' },

  // Horómetro
  'sqlRecordHourMeterReading': { functionName: 'combustiblesHourMeter', action: 'recordReading' },
  'sqlGetHourMeterHistory': { functionName: 'combustiblesHourMeter', action: 'getHistory' },
  'sqlGetHourMeterSummary': { functionName: 'combustiblesHourMeter', action: 'getSummary' },
  'sqlInitializeHourMeter': { functionName: 'combustiblesHourMeter', action: 'initialize' },
  'sqlGetHourMeterStats': { functionName: 'combustiblesHourMeter', action: 'getStats' },
  'sqlValidateHourMeterForMovement': { functionName: 'combustiblesHourMeter', action: 'validateForMovement' },
  'sqlUpdateHourMeterAfterMovement': { functionName: 'combustiblesHourMeter', action: 'updateAfterMovement' },
  'sqlGetVehiclesWithHourMeters': { functionName: 'combustiblesHourMeter', action: 'getVehiclesWithHourMeters' },
  'sqlGetHourMeterMaintenanceAlerts': { functionName: 'combustiblesHourMeter', action: 'getMaintenanceAlerts' },
};

export class HttpService {
  constructor() {
    this.auth = getAuth();
    this.functions = getFunctions();
    
    // Circuit Breaker para Firebase Functions
    this.circuitBreaker = {
      failures: new Map(), // functionName -> count
      lastFailure: new Map(), // functionName -> timestamp
      isOpen: new Map(), // functionName -> boolean
      failureThreshold: 3, // máximo errores consecutivos
      timeout: 60000, // 1 minuto de pausa después de circuit abierto
    };
  }

  /**
   * Verificar si el circuit breaker está abierto para una función
   */
  isCircuitOpen(functionName) {
    const isOpen = this.circuitBreaker.isOpen.get(functionName);
    if (!isOpen) return false;
    
    const lastFailure = this.circuitBreaker.lastFailure.get(functionName);
    const now = Date.now();
    
    // Si ha pasado el tiempo de timeout, intentar reset
    if (now - lastFailure > this.circuitBreaker.timeout) {
      console.log(`🔄 Circuit Breaker: Intentando reset para ${functionName}`);
      this.circuitBreaker.isOpen.set(functionName, false);
      this.circuitBreaker.failures.set(functionName, 0);
      return false;
    }
    
    return true;
  }

  /**
   * Registrar fallo en circuit breaker
   */
  recordFailure(functionName) {
    const failures = (this.circuitBreaker.failures.get(functionName) || 0) + 1;
    this.circuitBreaker.failures.set(functionName, failures);
    this.circuitBreaker.lastFailure.set(functionName, Date.now());
    
    if (failures >= this.circuitBreaker.failureThreshold) {
      console.error(`🚨 Circuit Breaker: ABIERTO para ${functionName} (${failures} fallos)`);
      this.circuitBreaker.isOpen.set(functionName, true);
    }
  }

  /**
   * Registrar éxito en circuit breaker
   */
  recordSuccess(functionName) {
    this.circuitBreaker.failures.set(functionName, 0);
    this.circuitBreaker.isOpen.set(functionName, false);
  }

  /**
   * Ejecutar llamada a Firebase Function usando httpsCallable
   * @param {string} endpoint - Nombre del endpoint original (ej: 'sqlCreateCategory')
   * @param {Object} data - Datos a enviar
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async callEndpoint(endpoint, data = {}) {
    try {
      console.log(`� HttpService.callEndpoint - INICIO: ${endpoint}`, { data });

      // Buscar mapeo del endpoint
      const mapping = ENDPOINT_TO_FUNCTION_MAP[endpoint];
      if (!mapping) {
        throw new Error(`No se encontró mapeo para el endpoint: ${endpoint}`);
      }

      const { functionName, action } = mapping;

      // Verificar circuit breaker
      if (this.isCircuitOpen(functionName)) {
        console.warn(`⚡ Circuit Breaker: ${functionName} está CERRADO temporalmente`);
        return {
          success: false,
          error: 'Función temporalmente no disponible (circuit breaker)',
          circuitBreakerOpen: true
        };
      }

      console.log(`🔥 Firebase Function: Llamando a ${functionName}.${action}`, data);

      // Verificar autenticación
      const isAuth = await this.isAuthenticated();
      if (!isAuth) {
        console.warn(`⚠️ Firebase Function: Usuario no autenticado para ${functionName}.${action}`);
        return {
          success: false,
          error: 'Usuario no autenticado',
        };
      }

      // Obtener la función callable
      const callableFunction = httpsCallable(this.functions, functionName);

      // Preparar payload para Firebase Function
      const payload = {
        action: action,
        data: data
      };

      console.log(`📤 Firebase Function: Enviando payload:`, {
        functionName,
        action,
        dataKeys: Object.keys(data)
      });

      // Ejecutar función
      const result = await callableFunction(payload);

      console.log(`📥 Firebase Function: Response recibida de ${functionName}.${action}`, result.data);

      // Registrar éxito
      this.recordSuccess(functionName);

      // Firebase Functions devuelve el resultado en .data
      const responseData = result.data;

      if (responseData.success !== false) {
        return {
          success: true,
          data: responseData,
          ...responseData
        };
      } else {
        return {
          success: false,
          error: responseData.error || 'Error desconocido',
          ...responseData
        };
      }

    } catch (error) {
      console.error(`❌ Firebase Function: Error en ${endpoint}:`, error);
      console.error(`❌ HttpService.callEndpoint - Stack trace:`, error.stack);

      // Obtener nombre de función para circuit breaker
      const mapping = ENDPOINT_TO_FUNCTION_MAP[endpoint];
      if (mapping) {
        this.recordFailure(mapping.functionName);
      }

      // Manejar errores específicos de Firebase Functions
      let errorMessage = error.message || 'Error de conexión';
      
      if (error.code === 'functions/unauthenticated') {
        errorMessage = 'Usuario no autenticado';
      } else if (error.code === 'functions/permission-denied') {
        errorMessage = 'Sin permisos para esta operación';
      } else if (error.code === 'functions/unavailable') {
        errorMessage = 'Función temporalmente no disponible';
      }

      return {
        success: false,
        error: errorMessage,
        firebaseFunctionError: true,
        code: error.code
      };
    }
  }

  /**
   * Verificar si un endpoint está disponible (no está en circuit breaker)
   * @param {string} endpointName - Nombre del endpoint
   * @returns {boolean} - True si está disponible
   */
  isEndpointAvailable(endpointName) {
    const mapping = ENDPOINT_TO_FUNCTION_MAP[endpointName];
    if (!mapping) {
      console.warn(`⚠️ Endpoint no mapeado: ${endpointName}`);
      return false;
    }
    
    const isOpen = this.isCircuitOpen(mapping.functionName);
    if (isOpen) {
      console.warn(`🚫 Circuit Breaker abierto para ${mapping.functionName}`);
      return false;
    }
    
    return true;
  }

  /**
   * Verificar si el usuario está autenticado
   * @returns {Promise<boolean>} - Estado de autenticación
   */
  async isAuthenticated() {
    const auth = getAuth();
    return !!auth.currentUser;
  }

  /**
   * Obtener información del usuario actual
   * @returns {Promise<Object|null>} - Información del usuario
   */
  async getCurrentUser() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  }
}

export default HttpService;