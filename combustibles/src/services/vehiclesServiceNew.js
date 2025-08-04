/**
 * VehiclesService - Servicio refactorizado para gestión de vehículos y maquinaria forestal
 * Utiliza BaseService y CRUDService para operaciones optimizadas
 * 
 * Forestech Colombia - Combustibles App
 * @author AI Agent - TASK 1.2 BaseService Implementation
 * @date 2025-01-04
 */

import { CRUDService } from './base/CRUDService.js';
import { VEHICLE_STATUS, FUEL_TYPES } from '../data/vehicleCategories.js';

/**
 * VehiclesService - Servicio especializado para vehículos
 */
class VehiclesService extends CRUDService {
  constructor() {
    super('combustibles_vehicles', {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'vehicleId',
      defaultOrderDirection: 'asc'
    });
  }

  /**
   * Validación específica para datos de vehículos
   * @param {Object} data - Datos del vehículo
   * @returns {Object} - Resultado de validación
   */
  validateData(data) {
    const baseValidation = super.validateData(data);
    if (!baseValidation.isValid) {
      return baseValidation;
    }

    const errors = [];

    // Validaciones requeridas
    if (!data.vehicleId || typeof data.vehicleId !== 'string' || data.vehicleId.trim().length === 0) {
      errors.push('El ID del vehículo es requerido');
    }

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('El nombre del vehículo es requerido');
    }

    // Validar tipo de combustible
    if (data.fuelType && !Object.values(FUEL_TYPES).includes(data.fuelType)) {
      errors.push(`Tipo de combustible inválido: ${data.fuelType}`);
    }

    // Validar estado
    if (data.status && !Object.values(VEHICLE_STATUS).includes(data.status)) {
      errors.push(`Estado de vehículo inválido: ${data.status}`);
    }

    // Validar capacidad de tanque
    if (data.tankCapacity !== undefined) {
      const capacity = Number(data.tankCapacity);
      if (isNaN(capacity) || capacity <= 0) {
        errors.push('La capacidad del tanque debe ser un número positivo');
      }
    }

    // Validar consumo promedio
    if (data.averageConsumption !== undefined) {
      const consumption = Number(data.averageConsumption);
      if (isNaN(consumption) || consumption < 0) {
        errors.push('El consumo promedio debe ser un número positivo o cero');
      }
    }

    // Validar año del modelo
    if (data.modelYear !== undefined) {
      const year = Number(data.modelYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        errors.push(`El año del modelo debe estar entre 1900 y ${currentYear + 1}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Procesar datos específicos de vehículos
   * @param {Object} data - Datos originales
   * @param {boolean} isUpdate - Si es actualización
   * @returns {Object} - Datos procesados
   */
  processData(data, isUpdate = false) {
    const baseProcessed = super.processData(data, isUpdate);

    // Limpiar y normalizar strings
    if (baseProcessed.vehicleId) {
      baseProcessed.vehicleId = baseProcessed.vehicleId.trim().toUpperCase();
    }
    if (baseProcessed.name) {
      baseProcessed.name = baseProcessed.name.trim();
    }
    if (baseProcessed.brand) {
      baseProcessed.brand = baseProcessed.brand.trim();
    }
    if (baseProcessed.model) {
      baseProcessed.model = baseProcessed.model.trim();
    }

    // Convertir números
    if (baseProcessed.tankCapacity !== undefined) {
      baseProcessed.tankCapacity = Number(baseProcessed.tankCapacity);
    }
    if (baseProcessed.averageConsumption !== undefined) {
      baseProcessed.averageConsumption = Number(baseProcessed.averageConsumption);
    }
    if (baseProcessed.modelYear !== undefined) {
      baseProcessed.modelYear = Number(baseProcessed.modelYear);
    }

    // Establecer valores por defecto solo en creación
    if (!isUpdate) {
      baseProcessed.status = baseProcessed.status || VEHICLE_STATUS.ACTIVE;
      baseProcessed.fuelType = baseProcessed.fuelType || FUEL_TYPES.DIESEL;
      baseProcessed.currentLocation = baseProcessed.currentLocation || 'Base Principal';
      baseProcessed.category = baseProcessed.category || 'vehiculo';
      baseProcessed.isAssigned = baseProcessed.isAssigned || false;
      
      // Inicializar métricas
      baseProcessed.totalFuelConsumed = 0;
      baseProcessed.totalDistance = 0;
      baseProcessed.totalOperatingHours = 0;
      baseProcessed.maintenanceCount = 0;
      baseProcessed.lastMovementDate = null;
      baseProcessed.lastMaintenanceDate = null;
      baseProcessed.nextMaintenanceDate = null;
    }

    return baseProcessed;
  }

  /**
   * Crear nuevo vehículo con validación de duplicados
   * @param {Object} vehicleData - Datos del vehículo
   * @param {string} createdBy - Usuario que crea
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async createVehicle(vehicleData, createdBy = 'system') {
    // Agregar metadatos de auditoría
    const dataWithAudit = {
      ...vehicleData,
      createdBy,
      updatedBy: createdBy
    };

    // Crear usando el método base con validación de vehicleId
    const result = await this.create(dataWithAudit, {
      duplicateField: 'vehicleId'
    });

    if (result.success) {
      this.logOperation('CREATE_VEHICLE', result.id, { 
        vehicleId: vehicleData.vehicleId,
        vehicleName: vehicleData.name,
        createdBy 
      });
    }

    return result;
  }

  /**
   * Obtener todos los vehículos
   * @param {Object} options - Opciones de consulta
   * @returns {Promise<Object>} - Lista de vehículos
   */
  async getAllVehicles(options = {}) {
    return await this.getAll({
      orderBy: 'vehicleId',
      orderDirection: 'asc',
      ...options
    });
  }

  /**
   * Obtener vehículo por ID
   * @param {string} vehicleId - ID del vehículo
   * @returns {Promise<Object>} - Datos del vehículo
   */
  async getVehicle(vehicleId) {
    return await this.getById(vehicleId);
  }

  /**
   * Obtener vehículo por código/vehicleId
   * @param {string} vehicleCode - Código del vehículo
   * @returns {Promise<Object>} - Datos del vehículo
   */
  async getVehicleByCode(vehicleCode) {
    const result = await this.find({ vehicleId: vehicleCode.trim().toUpperCase() });
    
    if (result.success && result.data.length > 0) {
      return {
        success: true,
        data: result.data[0]
      };
    }
    
    return {
      success: false,
      error: 'Vehículo no encontrado'
    };
  }

  /**
   * Actualizar vehículo
   * @param {string} vehicleId - ID del vehículo
   * @param {Object} updateData - Datos a actualizar
   * @param {string} updatedBy - Usuario que actualiza
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateVehicle(vehicleId, updateData, updatedBy = 'system') {
    const dataWithAudit = {
      ...updateData,
      updatedBy
    };

    const result = await this.update(vehicleId, dataWithAudit, {
      duplicateField: updateData.vehicleId ? 'vehicleId' : null
    });

    if (result.success) {
      this.logOperation('UPDATE_VEHICLE', vehicleId, { 
        updatedBy,
        fieldsUpdated: Object.keys(updateData)
      });
    }

    return result;
  }

  /**
   * Eliminar vehículo
   * @param {string} vehicleId - ID del vehículo
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async deleteVehicle(vehicleId) {
    const result = await this.delete(vehicleId);

    if (result.success) {
      this.logOperation('DELETE_VEHICLE', vehicleId);
    }

    return result;
  }

  /**
   * Obtener vehículos por estado
   * @param {string} status - Estado del vehículo
   * @returns {Promise<Object>} - Lista de vehículos
   */
  async getVehiclesByStatus(status) {
    return await this.find({ status }, {
      orderBy: 'vehicleId',
      orderDirection: 'asc'
    });
  }

  /**
   * Obtener vehículos activos
   * @returns {Promise<Object>} - Lista de vehículos activos
   */
  async getActiveVehicles() {
    return await this.getVehiclesByStatus(VEHICLE_STATUS.ACTIVE);
  }

  /**
   * Obtener vehículos por tipo de combustible
   * @param {string} fuelType - Tipo de combustible
   * @returns {Promise<Object>} - Lista de vehículos
   */
  async getVehiclesByFuelType(fuelType) {
    return await this.find({ 
      fuelType,
      status: VEHICLE_STATUS.ACTIVE 
    }, {
      orderBy: 'vehicleId',
      orderDirection: 'asc'
    });
  }

  /**
   * Obtener vehículos por ubicación
   * @param {string} location - Ubicación
   * @returns {Promise<Object>} - Lista de vehículos
   */
  async getVehiclesByLocation(location) {
    return await this.find({ 
      currentLocation: location,
      status: VEHICLE_STATUS.ACTIVE 
    });
  }

  /**
   * Buscar vehículos por término
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Object>} - Resultados de búsqueda
   */
  async searchVehicles(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return await this.getAllVehicles();
    }

    const term = searchTerm.trim().toUpperCase();

    // Buscar por vehicleId
    const idResults = await this.getAll({
      filters: [
        { field: 'vehicleId', operator: '>=', value: term },
        { field: 'vehicleId', operator: '<=', value: term + '\uf8ff' }
      ]
    });

    // Buscar por nombre
    const nameResults = await this.getAll({
      filters: [
        { field: 'name', operator: '>=', value: searchTerm },
        { field: 'name', operator: '<=', value: searchTerm + '\uf8ff' }
      ]
    });

    // Combinar resultados sin duplicados
    const combined = new Map();
    
    if (idResults.success) {
      idResults.data.forEach(vehicle => combined.set(vehicle.id, vehicle));
    }
    
    if (nameResults.success) {
      nameResults.data.forEach(vehicle => combined.set(vehicle.id, vehicle));
    }

    return {
      success: true,
      data: Array.from(combined.values()),
      count: combined.size
    };
  }

  /**
   * Actualizar métricas de un vehículo
   * @param {string} vehicleId - ID del vehículo
   * @param {Object} metrics - Métricas a actualizar
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateVehicleMetrics(vehicleId, metrics) {
    const updateData = {};
    
    if (metrics.totalFuelConsumed !== undefined) {
      updateData.totalFuelConsumed = Number(metrics.totalFuelConsumed);
    }
    if (metrics.totalDistance !== undefined) {
      updateData.totalDistance = Number(metrics.totalDistance);
    }
    if (metrics.totalOperatingHours !== undefined) {
      updateData.totalOperatingHours = Number(metrics.totalOperatingHours);
    }
    if (metrics.lastMovementDate) {
      updateData.lastMovementDate = metrics.lastMovementDate;
    }
    if (metrics.lastMaintenanceDate) {
      updateData.lastMaintenanceDate = metrics.lastMaintenanceDate;
    }
    if (metrics.nextMaintenanceDate) {
      updateData.nextMaintenanceDate = metrics.nextMaintenanceDate;
    }

    return await this.update(vehicleId, updateData);
  }

  /**
   * Cambiar estado de vehículo
   * @param {string} vehicleId - ID del vehículo
   * @param {string} newStatus - Nuevo estado
   * @param {string} reason - Razón del cambio
   * @param {string} updatedBy - Usuario que actualiza
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async changeVehicleStatus(vehicleId, newStatus, reason = '', updatedBy = 'system') {
    if (!Object.values(VEHICLE_STATUS).includes(newStatus)) {
      return {
        success: false,
        error: `Estado inválido: ${newStatus}`
      };
    }

    const result = await this.updateVehicle(vehicleId, {
      status: newStatus,
      statusChangeReason: reason,
      statusChangedAt: new Date()
    }, updatedBy);

    if (result.success) {
      this.logOperation('CHANGE_VEHICLE_STATUS', vehicleId, {
        newStatus,
        reason,
        updatedBy
      });
    }

    return result;
  }

  /**
   * Escuchar cambios en vehículos en tiempo real
   * @param {Function} callback - Callback para cambios
   * @param {Object} options - Opciones de consulta
   * @returns {Function} - Función para cancelar suscripción
   */
  listenToVehicles(callback, options = {}) {
    return this.listen(callback, {
      orderBy: 'vehicleId',
      orderDirection: 'asc',
      ...options
    });
  }
}

// Crear y exportar instancia singleton
const vehiclesService = new VehiclesService();

// Exportar métodos para compatibilidad con código existente
export const createVehicle = (data, createdBy) => vehiclesService.createVehicle(data, createdBy);
export const getAllVehicles = (options) => vehiclesService.getAllVehicles(options);
export const getVehicle = (id) => vehiclesService.getVehicle(id);
export const getVehicleByCode = (code) => vehiclesService.getVehicleByCode(code);
export const updateVehicle = (id, data, updatedBy) => vehiclesService.updateVehicle(id, data, updatedBy);
export const deleteVehicle = (id) => vehiclesService.deleteVehicle(id);
export const getVehiclesByStatus = (status) => vehiclesService.getVehiclesByStatus(status);
export const getActiveVehicles = () => vehiclesService.getActiveVehicles();
export const getVehiclesByFuelType = (fuelType) => vehiclesService.getVehiclesByFuelType(fuelType);
export const getVehiclesByLocation = (location) => vehiclesService.getVehiclesByLocation(location);
export const searchVehicles = (searchTerm) => vehiclesService.searchVehicles(searchTerm);
export const updateVehicleMetrics = (id, metrics) => vehiclesService.updateVehicleMetrics(id, metrics);
export const changeVehicleStatus = (id, status, reason, updatedBy) => vehiclesService.changeVehicleStatus(id, status, reason, updatedBy);
export const listenToVehicles = (callback, options) => vehiclesService.listenToVehicles(callback, options);

// Re-exportar constantes para compatibilidad
export { VEHICLE_STATUS, FUEL_TYPES } from '../data/vehicleCategories.js';

// Exportar servicio para uso avanzado
export { vehiclesService };
export default vehiclesService;
