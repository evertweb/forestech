/**
 * FirebaseMaintenanceService - Servicio de mantenimiento usando Firebase Functions
 * Reemplaza SqlMaintenanceService para usar endpoints SQL migrados
 * Forestech Combustibles App
 */

import HttpService from './base/HttpService.js';

// Constantes del servicio
export const MAINTENANCE_TYPES = {
  PREVENTIVO: 'preventivo',
  CORRECTIVO: 'correctivo',
  PREDICTIVO: 'predictivo',
  INSPECCION: 'inspeccion',
};

export const MAINTENANCE_STATUS = {
  PENDIENTE: 'pendiente',
  EN_PROGRESO: 'en_progreso',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
};

export const BATTERY_STATUS = {
  BUENO: 'bueno',
  REGULAR: 'regular',
  MALO: 'malo',
  REQUIERE_REEMPLAZO: 'requiere_reemplazo',
};

export const MAINTENANCE_CONSTANTS = {
  MAX_DAYS_UPCOMING: 30,
  DEFAULT_PRIORITY: 'media',
  CRITICAL_HOURS_THRESHOLD: 100,
};

class FirebaseMaintenanceService extends HttpService {
  constructor() {
    super();
  }

  /**
   * Crear registro de mantenimiento
   * @param {Object} maintenanceData - Datos del mantenimiento
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async createMaintenanceRecord(maintenanceData) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.callEndpoint('sqlCreateMaintenance', {
        maintenanceData: {
          ...maintenanceData,
          createdBy: this.getCurrentUser()?.uid
        }
      });

      return result;
    } catch (error) {
      console.error('Error creando registro de mantenimiento:', error);
      return {
        success: false,
        error: 'Error al crear el registro de mantenimiento: ' + error.message
      };
    }
  }

  /**
   * Obtener todos los registros de mantenimiento
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Array>} - Lista de registros de mantenimiento
   */
  async getAllMaintenanceRecords(filters = {}) {
    try {
      const result = await this.callEndpoint('sqlGetAllMaintenance', { filters });

      if (result.success && result.data) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo registros de mantenimiento:', error);
      throw error;
    }
  }

  /**
   * Obtener registro de mantenimiento por ID
   * @param {string} maintenanceId - ID del registro
   * @returns {Promise<Object|null>} - Registro de mantenimiento
   */
  async getMaintenanceRecord(maintenanceId) {
    try {
      const result = await this.callEndpoint('sqlGetMaintenance', { maintenanceId });

      if (result.success && result.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo registro de mantenimiento:', error);
      throw error;
    }
  }

  /**
   * Actualizar registro de mantenimiento
   * @param {string} maintenanceId - ID del registro
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateMaintenanceRecord(maintenanceId, updateData) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.callEndpoint('sqlUpdateMaintenance', {
        maintenanceId,
        updateData: {
          ...updateData,
          updatedBy: this.getCurrentUser()?.uid
        }
      });

      return result;
    } catch (error) {
      console.error('Error actualizando registro de mantenimiento:', error);
      return {
        success: false,
        error: 'Error al actualizar el registro de mantenimiento: ' + error.message
      };
    }
  }

  /**
   * Eliminar registro de mantenimiento
   * @param {string} maintenanceId - ID del registro
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async deleteMaintenanceRecord(maintenanceId) {
    try {
      const result = await this.callEndpoint('sqlDeleteMaintenance', { maintenanceId });
      return result;
    } catch (error) {
      console.error('Error eliminando registro de mantenimiento:', error);
      return {
        success: false,
        error: 'Error al eliminar el registro de mantenimiento: ' + error.message
      };
    }
  }

  /**
   * Obtener mantenimientos por vehículo
   * @param {string} vehicleId - ID del vehículo
   * @returns {Promise<Array>} - Lista de mantenimientos del vehículo
   */
  async getMaintenanceByVehicle(vehicleId) {
    try {
      const result = await this.callEndpoint('sqlGetMaintenanceByVehicle', { vehicleId });

      if (result.success && result.data) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo mantenimientos por vehículo:', error);
      throw error;
    }
  }

  /**
   * Obtener próximos mantenimientos
   * @returns {Promise<Array>} - Lista de próximos mantenimientos
   */
  async getUpcomingMaintenance() {
    try {
      const result = await this.callEndpoint('sqlGetUpcomingMaintenance');

      if (result.success && result.data) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo próximos mantenimientos:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de mantenimiento
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object|null>} - Estadísticas de mantenimiento
   */
  async getMaintenanceStats(filters = {}) {
    try {
      const result = await this.callEndpoint('sqlGetMaintenanceStats', { filters });

      if (result.success && result.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo estadísticas de mantenimiento:', error);
      throw error;
    }
  }

  /**
   * Suscribirse a cambios en registros de mantenimiento
   * @param {Function} callback - Función de callback
   * @returns {Function} - Función para cancelar suscripción
   */
  subscribeToMaintenance(callback) {
    let isActive = true;

    const poll = async () => {
      if (!isActive) return;

      try {
        const data = await this.getAllMaintenanceRecords();
        callback(data, null);
      } catch (error) {
        callback(null, error);
      }

      if (isActive) {
        setTimeout(poll, 30000); // Poll cada 30 segundos
      }
    };

    // Ejecutar inmediatamente
    poll();

    // Retornar función para cancelar suscripción
    return () => {
      isActive = false;
    };
  }

  /**
   * Programar mantenimiento preventivo
   * @param {string} vehicleId - ID del vehículo
   * @param {Object} scheduleData - Datos del mantenimiento programado
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async schedulePreventiveMaintenance(vehicleId, scheduleData) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const maintenanceData = {
        vehicleId,
        type: MAINTENANCE_TYPES.PREVENTIVO,
        status: MAINTENANCE_STATUS.PENDIENTE,
        scheduledDate: scheduleData.scheduledDate,
        description: scheduleData.description || 'Mantenimiento preventivo programado',
        priority: scheduleData.priority || MAINTENANCE_CONSTANTS.DEFAULT_PRIORITY,
        estimatedDuration: scheduleData.estimatedDuration || 120, // 2 horas por defecto
        estimatedCost: scheduleData.estimatedCost || 0,
        partsRequired: scheduleData.partsRequired || [],
        notes: scheduleData.notes || '',
        createdBy: this.getCurrentUser()?.uid
      };

      const result = await this.createMaintenanceRecord(maintenanceData);
      return result;
    } catch (error) {
      console.error('Error programando mantenimiento preventivo:', error);
      return {
        success: false,
        error: 'Error al programar el mantenimiento preventivo: ' + error.message
      };
    }
  }

  /**
   * Registrar mantenimiento completado
   * @param {string} maintenanceId - ID del mantenimiento
   * @param {Object} completionData - Datos de completación
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async completeMaintenance(maintenanceId, completionData) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const updateData = {
        status: MAINTENANCE_STATUS.COMPLETADO,
        completedDate: new Date(),
        actualDuration: completionData.actualDuration,
        actualCost: completionData.actualCost,
        workPerformed: completionData.workPerformed,
        partsUsed: completionData.partsUsed || [],
        technicianNotes: completionData.technicianNotes || '',
        nextMaintenanceDate: completionData.nextMaintenanceDate,
        updatedBy: this.getCurrentUser()?.uid
      };

      const result = await this.updateMaintenanceRecord(maintenanceId, updateData);
      return result;
    } catch (error) {
      console.error('Error completando mantenimiento:', error);
      return {
        success: false,
        error: 'Error al completar el mantenimiento: ' + error.message
      };
    }
  }
}

export default FirebaseMaintenanceService;

// Funciones de compatibilidad con el servicio anterior
export const createMaintenanceRecord = async (maintenanceData) => {
  const service = new FirebaseMaintenanceService();
  return service.createMaintenanceRecord(maintenanceData);
};

export const getAllMaintenanceRecords = async (filters = {}) => {
  const service = new FirebaseMaintenanceService();
  return service.getAllMaintenanceRecords(filters);
};

export const getMaintenanceRecord = async (maintenanceId) => {
  const service = new FirebaseMaintenanceService();
  return service.getMaintenanceRecord(maintenanceId);
};

export const updateMaintenanceRecord = async (maintenanceId, updateData) => {
  const service = new FirebaseMaintenanceService();
  return service.updateMaintenanceRecord(maintenanceId, updateData);
};

export const deleteMaintenanceRecord = async (maintenanceId) => {
  const service = new FirebaseMaintenanceService();
  return service.deleteMaintenanceRecord(maintenanceId);
};

export const getMaintenanceByVehicle = async (vehicleId) => {
  const service = new FirebaseMaintenanceService();
  return service.getMaintenanceByVehicle(vehicleId);
};

export const getUpcomingMaintenance = async () => {
  const service = new FirebaseMaintenanceService();
  return service.getUpcomingMaintenance();
};

export const getMaintenanceStats = async (filters = {}) => {
  const service = new FirebaseMaintenanceService();
  return service.getMaintenanceStats(filters);
};

export const subscribeToMaintenance = (callback) => {
  const service = new FirebaseMaintenanceService();
  return service.subscribeToMaintenance(callback);
};

export const getVehiclesForMaintenance = async () => {
  // Esta función obtiene vehículos que necesitan mantenimiento
  // Por ahora retornaremos una implementación básica
  try {
    const service = new FirebaseMaintenanceService();
    const upcomingMaintenance = await service.getUpcomingMaintenance();
    
    if (upcomingMaintenance.success && upcomingMaintenance.data) {
      // Extraer vehículos únicos que necesitan mantenimiento
      const vehicles = upcomingMaintenance.data.map(record => ({
        id: record.vehicleId,
        vehicleName: record.vehicleName || record.vehicleId,
        maintenanceType: record.maintenanceType,
        dueDate: record.dueDate
      }));
      
      // Remover duplicados
      const uniqueVehicles = vehicles.filter((vehicle, index, self) =>
        index === self.findIndex(v => v.id === vehicle.id)
      );
      
      return { success: true, data: uniqueVehicles };
    }
    
    return { success: true, data: [] };
  } catch (error) {
    console.error('Error obteniendo vehículos para mantenimiento:', error);
    return { success: false, error: error.message };
  }
};

export const calculateNextOilChange = (vehicleData, lastOilChangeHours = 0) => {
  // Cálculo básico para próximo cambio de aceite
  const DEFAULT_OIL_CHANGE_INTERVAL = MAINTENANCE_CONSTANTS.DEFAULT_OIL_CHANGE_HOURS || 250;
  
  if (!vehicleData) {
    return {
      nextChangeHours: lastOilChangeHours + DEFAULT_OIL_CHANGE_INTERVAL,
      hoursRemaining: DEFAULT_OIL_CHANGE_INTERVAL,
      isOverdue: false
    };
  }
  
  const currentHours = vehicleData.currentHourMeter || 0;
  const nextChangeHours = lastOilChangeHours + DEFAULT_OIL_CHANGE_INTERVAL;
  const hoursRemaining = Math.max(0, nextChangeHours - currentHours);
  const isOverdue = currentHours > nextChangeHours;
  
  return {
    nextChangeHours,
    hoursRemaining,
    isOverdue,
    currentHours
  };
};