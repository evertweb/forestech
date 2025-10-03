/**
 * CloudRunVehiclesService - Servicio de vehículos usando Cloud Run SQL endpoints
 * Reemplaza SqlVehiclesService para usar endpoints SQL migrados
 * Forestech Combustibles App
 */

import { httpsCallable, getFunctions } from 'firebase/functions';
import HttpService from './base/HttpService.js';
import { VEHICLE_STATUS, FUEL_TYPES } from '../data/vehicleCategories.js';

// Re-exportar constantes para compatibilidad
export { VEHICLE_STATUS, FUEL_TYPES } from '../data/vehicleCategories.js';

export const FUEL_COMPATIBILITY = {
  DIESEL: 'DIESEL',
  GASOLINE: 'GASOLINE',
  MIXED: 'MIXED',
};

class FirebaseVehiclesService extends HttpService {
  constructor() {
    super();
    this.functions = getFunctions();
  }

  // Métodos heredados de HttpService: isAuthenticated, getCurrentUser, isEndpointAvailable

  /**
   * Validar datos de vehículo
   * @param {Object} vehicleData - Datos a validar
   */
  validateVehicleData(vehicleData) {
    const required = ['vehicleId', 'name', 'type', 'fuelType'];

    for (const field of required) {
      if (!vehicleData[field]) {
        throw new Error(`Campo requerido: ${field}`);
      }
    }

    if (!vehicleData.type || vehicleData.type.trim().length === 0) {
      throw new Error('Tipo de vehículo requerido');
    }

    if (!Object.values(FUEL_COMPATIBILITY).includes(vehicleData.fuelType)) {
      throw new Error('Tipo de combustible inválido');
    }

    if (vehicleData.status && !Object.values(VEHICLE_STATUS).includes(vehicleData.status)) {
      throw new Error('Estado de vehículo inválido');
    }

    if (vehicleData.enginePower && vehicleData.enginePower <= 0) {
      throw new Error('La potencia del motor debe ser mayor a cero');
    }

    if (vehicleData.fuelCapacity && vehicleData.fuelCapacity <= 0) {
      throw new Error('La capacidad de combustible debe ser mayor a cero');
    }
  }

  /**
   * Calcular consumo estimado por hora
   * @param {Object} vehicleData - Datos del vehículo
   * @returns {number} - Consumo estimado
   */
  calculateEstimatedConsumption(vehicleData) {
    const { type, enginePower, fuelType } = vehicleData;

    const consumptionFactors = {
      excavadora: 0.04,
      bulldozer: 0.05,
      cargador: 0.035,
      camion: 0.03,
      camioneta: 0.03,
      grua: 0.045,
      motosierra: 0.02,
      tractor: 0.025,
      volqueta: 0.035,
      motobomba: 0.035,
      fumigadora: 0.025,
      guadana: 0.02,
      motocicleta: 0.015,
      planta_electrica: 0.08,
      otros: 0.03,
    };

    const fuelFactors = {
      [FUEL_COMPATIBILITY.DIESEL]: 1.0,
      [FUEL_COMPATIBILITY.GASOLINE]: 1.2,
      [FUEL_COMPATIBILITY.MIXED]: 1.1,
    };

    const baseFactor = consumptionFactors[type] || 0.03;
    const fuelFactor = fuelFactors[fuelType] || 1.0;
    const power = enginePower || 100;

    return baseFactor * power * fuelFactor;
  }

  /**
   * Crear un nuevo vehículo
   * @param {Object} vehicleData - Datos del vehículo
   * @returns {Promise<Object>} - Resultado
   */
  async createVehicle(vehicleData) {
    try {
      if (!(await this.isAuthenticated())) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Normalizar fuelType
      if (vehicleData.fuelType) {
        vehicleData.fuelType = vehicleData.fuelType.toUpperCase();
      }

      // Validar
      this.validateVehicleData(vehicleData);

      const result = await httpsCallable(this.functions, 'combustiblesVehicles')({
        action: 'create',
        data: {
          vehicleData: {
            ...vehicleData,
            createdBy: (await this.getCurrentUser())?.uid
          }
        }
      });

      return result.data;
    } catch (error) {
      console.error('Error al crear vehículo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener todos los vehículos
   * @param {Object} filters - Filtros
   * @returns {Promise<Array>} - Lista de vehículos
   */
  async getAllVehicles(filters = {}) {
    try {
      // Normalizar fuelType
      if (filters.fuelType) {
        filters.fuelType = filters.fuelType.toUpperCase();
      }

      const result = await httpsCallable(this.functions, 'combustiblesVehicles')({
        action: 'getAll',
        data: { filters }
      });

      console.log('🚗 FirebaseVehiclesService - Result from Firebase:', result);
      
      // La respuesta de Firebase Functions tiene estructura: {data: {success: true, data: [...]}}
      if (result.data && result.data.success && Array.isArray(result.data.data)) {
        const vehicles = result.data.data;
        console.log(`🚗 FirebaseVehiclesService - Procesando ${vehicles.length} vehículos`);
        
        // Los campos ya vienen como arrays desde SQL Server, no necesitan parsing
        return vehicles.map(vehicle => ({
          ...vehicle,
          fuelType: vehicle.fuelType?.toUpperCase() || vehicle.fuelType,
          hourMeterHistory: Array.isArray(vehicle.hourMeterHistory) ? vehicle.hourMeterHistory : [],
          maintenanceHistory: Array.isArray(vehicle.maintenanceHistory) ? vehicle.maintenanceHistory : [],
          searchTags: Array.isArray(vehicle.searchTags) ? vehicle.searchTags : [],
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
          lastMovementDate: vehicle.lastMovementDate,
          lastMaintenanceDate: vehicle.lastMaintenanceDate,
          lastHourMeterUpdate: vehicle.lastHourMeterUpdate,
        }));
      }

      console.log('🚗 FirebaseVehiclesService - No se encontraron vehículos válidos');
      return [];
    } catch (error) {
      console.error('Error al obtener vehículos:', error);
      throw new Error(`Error al obtener vehículos: ${error.message}`);
    }
  }

  /**
   * Obtener vehículo por ID
   * @param {string} vehicleId - ID
   * @returns {Promise<Object|null>} - Vehículo
   */
  async getVehicle(vehicleId) {
    try {
      if (!vehicleId) {
        throw new Error('ID de vehículo requerido');
      }

      const result = await httpsCallable(this.functions, 'combustiblesVehicles')({
        action: 'get',
        data: { vehicleId }
      });

      const data = result.data;
      if (data) {
        const vehicle = data;
        return {
          id: vehicle.id,
          ...vehicle,
          fuelType: vehicle.fuelType?.toUpperCase() || vehicle.fuelType,
          hourMeterHistory: vehicle.hourMeterHistory ? JSON.parse(vehicle.hourMeterHistory) : [],
          maintenanceHistory: vehicle.maintenanceHistory ? JSON.parse(vehicle.maintenanceHistory) : [],
          searchTags: vehicle.searchTags ? JSON.parse(vehicle.searchTags) : [],
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
          lastMovementDate: vehicle.lastMovementDate,
          lastMaintenanceDate: vehicle.lastMaintenanceDate,
          lastHourMeterUpdate: vehicle.lastHourMeterUpdate,
        };
      }

      return null;
    } catch (error) {
      console.error('Error al obtener vehículo:', error);
      throw new Error(`Error al obtener vehículo: ${error.message}`);
    }
  }

  /**
   * Obtener vehículo por código
   * @param {string} vehicleCode - Código
   * @returns {Promise<Object|null>} - Vehículo
   */
  async getVehicleByCode(vehicleCode) {
    try {
      const result = await httpsCallable(this.functions, 'combustiblesVehicles')({
        action: 'getByCode',
        data: { vehicleCode }
      });

      const data = result.data;
      if (data) {
        const vehicle = data;
        return {
          id: vehicle.id,
          ...vehicle,
          fuelType: vehicle.fuelType?.toUpperCase() || vehicle.fuelType,
          hourMeterHistory: vehicle.hourMeterHistory ? JSON.parse(vehicle.hourMeterHistory) : [],
          maintenanceHistory: vehicle.maintenanceHistory ? JSON.parse(vehicle.maintenanceHistory) : [],
          searchTags: vehicle.searchTags ? JSON.parse(vehicle.searchTags) : [],
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
          lastMovementDate: vehicle.lastMovementDate,
          lastMaintenanceDate: vehicle.lastMaintenanceDate,
          lastHourMeterUpdate: vehicle.lastHourMeterUpdate,
        };
      }

      return null;
    } catch (error) {
      console.error('Error al buscar vehículo por código:', error);
      throw new Error(`Error al buscar vehículo: ${error.message}`);
    }
  }

  /**
   * Actualizar vehículo
   * @param {string} vehicleId - ID
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} - Resultado
   */
  async updateVehicle(vehicleId, updateData) {
    try {
      if (!(await this.isAuthenticated())) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      if (!vehicleId) {
        throw new Error('ID de vehículo requerido');
      }

      // Normalizar fuelType
      if (updateData.fuelType) {
        updateData.fuelType = updateData.fuelType.toUpperCase();
      }

      const result = await httpsCallable(this.functions, 'combustiblesVehicles')({
        action: 'update',
        data: {
          vehicleId,
          updateData: {
            ...updateData,
            updatedBy: (await this.getCurrentUser())?.uid
          }
        }
      });

      return result.data;
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar vehículo
   * @param {string} vehicleId - ID
   * @returns {Promise<Object>} - Resultado
   */
  async deleteVehicle(vehicleId) {
    try {
      const result = await httpsCallable(this.functions, 'combustiblesVehicles')({
        action: 'delete',
        data: { vehicleId }
      });
      return result.data;
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      throw new Error(`Error al eliminar vehículo: ${error.message}`);
    }
  }

  /**
   * Suscribirse a vehículos
   * @param {Function} callback - Callback
   * @param {Object} filters - Filtros
   * @returns {Function} - Unsubscribe
   */
  subscribeToVehicles(callback, filters = {}) {
    let isActive = true;

    const poll = async () => {
      if (!isActive) return;

      try {
        // Verificar circuit breaker ANTES de intentar autenticación
        if (!this.isEndpointAvailable('sqlGetAllVehicles')) {
          console.warn('⚡ VehiclesService: Circuit breaker abierto, omitiendo polling por 10 minutos');
          callback([], null, { added: [], modified: [], removed: [] }); // Devolver array vacío
          if (isActive) {
            setTimeout(poll, 600000); // Poll cada 10 minutos cuando circuit breaker activo
          }
          return;
        }

        // Verificar autenticación antes de hacer la llamada
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
          console.log('🔒 VehiclesService: Usuario no autenticado, omitiendo polling');
          callback([], null, { added: [], modified: [], removed: [] }); // Devolver array vacío
          if (isActive) {
            setTimeout(poll, 120000); // Poll cada 2 minuto cuando no autenticado
          }
          return;
        }

        const vehicles = await this.getAllVehicles(filters);
        callback(vehicles, null, { added: [], modified: [], removed: [] });
        
        // Éxito - usar intervalo normal
        if (isActive) {
          setTimeout(poll, 60000); // Poll cada 1 minuto
        }
      } catch (error) {
        console.error('❌ Error en polling de vehículos:', {
          message: error.message,
          code: error.code,
          stack: error.stack,
          name: error.name,
          endpoint: 'sqlGetAllVehicles'
        });
        callback(null, error);
        
        // Backoff exponencial más agresivo para vehículos
        let nextInterval = 60000; // 1 minuto default
        
        if (error.circuitBreakerOpen) {
          nextInterval = 600000; // 10 minutos si circuit breaker está abierto
          console.warn('⚡ VehiclesService: Circuit breaker detectado, esperando 10 minutos');
        } else if (error.message && error.message.includes('404')) {
          nextInterval = 300000; // 5 minutos para errores 404
          console.warn('🔍 VehiclesService: Endpoint no disponible, esperando 5 minutos');
        }
        
        if (isActive) {
          setTimeout(poll, nextInterval);
        }
        return;
      }
    };

    // Llamada inicial
    poll();

    return () => {
      isActive = false;
    };
  }

  /**
   * Obtener estadísticas de vehículos
   * @param {Object} filters - Filtros
   * @returns {Promise<Object>} - Estadísticas
   */
  async getVehiclesStats(filters = {}) {
    try {
      const result = await httpsCallable(this.functions, 'combustiblesVehicles')({
        action: 'getStats',
        data: { filters }
      });

      const data = result.data;
      if (data) {
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error al calcular estadísticas:', error);
      throw new Error(`Error al calcular estadísticas: ${error.message}`);
    }
  }

  /**
   * Actualizar métricas del vehículo
   * @param {string} vehicleCode - Código
   * @param {Object} movementData - Datos movimiento
   * @returns {Promise<void>}
   */
  async updateVehicleMetrics(vehicleCode, movementData) {
    try {
      const result = await httpsCallable(this.functions, 'combustiblesVehicles')({
        action: 'updateMetrics',
        data: {
          vehicleCode,
          movementData
        }
      });

      if (result.data) {
        console.log(`✅ Métricas del vehículo ${vehicleCode} actualizadas`);
      }
    } catch (error) {
      console.error('Error al actualizar métricas:', error);
    }
  }

  /**
   * Actualizar horómetro
   * @param {string} vehicleCode - Código
   * @param {number} newHours - Nuevas horas
   * @param {string} notes - Notas
   * @returns {Promise<Object>} - Resultado
   */
  async updateHourMeter(vehicleCode, newHours, notes = '') {
    try {
      const result = await httpsCallable(this.functions, 'combustiblesVehicles')({
        action: 'updateHourMeter',
        data: {
          vehicleCode,
          newHours,
          notes
        }
      });

      return result.data;
    } catch (error) {
      console.error('Error al actualizar horómetro:', error);
      throw new Error(`Error al actualizar horómetro: ${error.message}`);
    }
  }

  /**
   * Obtener historial de horómetro
   * @param {string} vehicleCode - Código
   * @param {number} limit - Límite
   * @returns {Promise<Array>} - Historial
   */
  async getHourMeterHistory(vehicleCode, limit = 50) {
    try {
      const result = await httpsCallable(this.functions, 'combustiblesVehicles')({
        action: 'getHourMeterHistory',
        data: {
          vehicleCode,
          limit
        }
      });

      const data = result.data;
      if (data) {
        return data;
      }

      return [];
    } catch (error) {
      console.error('Error al obtener historial:', error);
      throw new Error(`Error al obtener historial: ${error.message}`);
    }
  }

  /**
   * Calcular consumo de vehículo
   * @param {string} vehicleCode - Código
   * @returns {Promise<Object>} - Métricas
   */
  async calculateVehicleConsumption(vehicleCode) {
    try {
      const result = await httpsCallable(this.functions, 'combustiblesVehicles')({
        action: 'calculateConsumption',
        data: {
          vehicleCode
        }
      });

      const data = result.data;
      if (data) {
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error al calcular consumo:', error);
      throw new Error(`Error al calcular métricas: ${error.message}`);
    }
  }

  /**
   * Registrar mantenimiento
   * @param {string} vehicleId - ID
   * @param {Object} maintenanceData - Datos
   * @returns {Promise<Object>} - Resultado
   */
  async registerMaintenance(vehicleId, maintenanceData) {
    try {
      const result = await httpsCallable(this.functions, 'combustiblesVehicles')({
        action: 'registerMaintenance',
        data: {
          vehicleId,
          maintenanceData
        }
      });

      return result.data;
    } catch (error) {
      console.error('Error al registrar mantenimiento:', error);
      throw new Error(`Error al registrar mantenimiento: ${error.message}`);
    }
  }

  /**
   * Contar vehículos por categoría
   * @param {string} categoryId - ID categoría
   * @returns {Promise<number>} - Conteo
   */
  async countVehiclesByCategory(categoryId) {
    try {
      const result = await httpsCallable(this.functions, 'combustiblesVehicles')({
        action: 'countByCategory',
        data: {
          categoryId
        }
      });

      const data = result.data;
      if (data) {
        return data.count || 0;
      }

      return 0;
    } catch (error) {
      console.error('Error al contar vehículos por categoría:', error);
      return 0;
    }
  }
}

export default FirebaseVehiclesService;

// Funciones de compatibilidad con el servicio anterior
export const createVehicle = async (vehicleData) => {
  const service = new FirebaseVehiclesService();
  return service.createVehicle(vehicleData);
};

export const subscribeToVehicles = (callback, filters = {}) => {
  const service = new FirebaseVehiclesService();
  return service.subscribeToVehicles(callback, filters);
};

export const updateVehicle = async (vehicleId, updateData) => {
  const service = new FirebaseVehiclesService();
  return service.updateVehicle(vehicleId, updateData);
};

export const deleteVehicle = async (vehicleId) => {
  const service = new FirebaseVehiclesService();
  return service.deleteVehicle(vehicleId);
};

export const getVehicle = async (vehicleId) => {
  const service = new FirebaseVehiclesService();
  return service.getVehicle(vehicleId);
};

export const getVehiclesStats = async (filters = {}) => {
  const service = new FirebaseVehiclesService();
  return service.getVehiclesStats(filters);
};

export const getAllVehicles = async (filters = {}) => {
  const service = new FirebaseVehiclesService();
  return service.getAllVehicles(filters);
};