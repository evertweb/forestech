/**
 * FirebaseHourMeterService - Servicio de horómetros usando Firebase Functions
 * Reemplaza hourMeterService para usar endpoints SQL migrados
 * Forestech Combustibles App
 */

import HttpService from './base/HttpService.js';

class FirebaseHourMeterService extends HttpService {
  constructor() {
    super();
  }

  /**
   * Registrar nueva lectura de horómetro
   * @param {string} vehicleId - ID del vehículo
   * @param {number} newReading - Nueva lectura del horómetro
   * @param {string} movementId - ID del movimiento asociado (opcional)
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async recordHourMeterReading(vehicleId, newReading, movementId = null) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.callEndpoint('sqlRecordHourMeterReading', {
        vehicleId,
        newReading,
        movementId
      });

      return result;
    } catch (error) {
      console.error('Error registrando lectura de horómetro:', error);
      return {
        success: false,
        error: 'Error al registrar la lectura de horómetro: ' + error.message
      };
    }
  }

  /**
   * Validar lectura de horómetro antes de movimiento
   * @param {string} vehicleId - ID del vehículo
   * @param {number} requiredReading - Lectura requerida
   * @returns {Promise<Object>} - Resultado de la validación
   */
  async validateHourMeterForMovement(vehicleId, requiredReading) {
    try {
      const result = await this.callEndpoint('sqlValidateHourMeterForMovement', {
        vehicleId,
        requiredReading
      });

      return result;
    } catch (error) {
      console.error('Error validando horómetro:', error);
      return { valid: false, message: error.message };
    }
  }

  /**
   * Obtener historial de horómetro de un vehículo
   * @param {string} vehicleId - ID del vehículo
   * @param {number} limit - Límite de registros (default: 50)
   * @returns {Promise<Array>} - Historial de lecturas
   */
  async getHourMeterHistory(vehicleId, limit = 50) {
    try {
      const result = await this.callEndpoint('sqlGetHourMeterHistory', {
        vehicleId,
        limit
      });

      if (result.success && result.data) {
        return result.data.map(entry => ({
          ...entry,
          date: entry.date instanceof Date ? entry.date : new Date(entry.date),
          formattedDate:
            entry.date instanceof Date
              ? entry.date.toLocaleDateString('es-CO')
              : new Date(entry.date).toLocaleDateString('es-CO'),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo historial de horómetro:', error);
      return [];
    }
  }

  /**
   * Inicializar horómetro para vehículo existente
   * @param {string} vehicleId - ID del vehículo
   * @param {number} initialReading - Lectura inicial
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async initializeHourMeter(vehicleId, initialReading) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.callEndpoint('sqlInitializeHourMeter', {
        vehicleId,
        initialReading
      });

      return result;
    } catch (error) {
      console.error('Error inicializando horómetro:', error);
      return {
        success: false,
        error: 'Error al inicializar el horómetro: ' + error.message
      };
    }
  }

  /**
   * Obtener resumen de eficiencia de horómetro
   * @param {string} vehicleId - ID del vehículo
   * @returns {Promise<Object>} - Resumen de eficiencia
   */
  async getHourMeterSummary(vehicleId) {
    try {
      const result = await this.callEndpoint('sqlGetHourMeterSummary', {
        vehicleId
      });

      if (result.success && result.data) {
        return result.data;
      }

      return {
        hasHourMeter: false,
        message: 'Vehículo sin horómetro',
      };
    } catch (error) {
      console.error('Error obteniendo resumen de horómetro:', error);
      return {
        hasHourMeter: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtener estadísticas de horómetros
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object|null>} - Estadísticas de horómetros
   */
  async getHourMeterStats(filters = {}) {
    try {
      const result = await this.callEndpoint('sqlGetHourMeterStats', { filters });

      if (result.success && result.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo estadísticas de horómetros:', error);
      throw error;
    }
  }

  /**
   * Suscribirse a cambios en horómetros
   * @param {Function} callback - Función de callback
   * @returns {Function} - Función para cancelar suscripción
   */
  subscribeToHourMeters(callback) {
    let isActive = true;

    const poll = async () => {
      if (!isActive) return;

      try {
        const data = await this.getHourMeterStats();
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
   * Actualizar horómetro después de movimiento
   * @param {string} vehicleId - ID del vehículo
   * @param {number} newReading - Nueva lectura
   * @param {string} movementId - ID del movimiento
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateHourMeterAfterMovement(vehicleId, newReading, movementId) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.callEndpoint('sqlUpdateHourMeterAfterMovement', {
        vehicleId,
        newReading,
        movementId
      });

      return result;
    } catch (error) {
      console.error('Error actualizando horómetro después de movimiento:', error);
      return {
        success: false,
        error: 'Error al actualizar el horómetro: ' + error.message
      };
    }
  }

  /**
   * Obtener vehículos con horómetros activos
   * @returns {Promise<Array>} - Lista de vehículos con horómetros
   */
  async getVehiclesWithHourMeters() {
    try {
      const result = await this.callEndpoint('sqlGetVehiclesWithHourMeters');

      if (result.success && result.data) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo vehículos con horómetros:', error);
      throw error;
    }
  }

  /**
   * Obtener alertas de mantenimiento por horómetro
   * @returns {Promise<Array>} - Lista de alertas de mantenimiento
   */
  async getHourMeterMaintenanceAlerts() {
    try {
      const result = await this.callEndpoint('sqlGetHourMeterMaintenanceAlerts');

      if (result.success && result.data) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo alertas de mantenimiento por horómetro:', error);
      throw error;
    }
  }
}

export default FirebaseHourMeterService;

// Funciones de compatibilidad con el servicio anterior
export const recordHourMeterReading = async (vehicleId, newReading, movementId = null) => {
  const service = new FirebaseHourMeterService();
  return service.recordHourMeterReading(vehicleId, newReading, movementId);
};

export const validateHourMeterForMovement = async (vehicleId, requiredReading) => {
  const service = new FirebaseHourMeterService();
  return service.validateHourMeterForMovement(vehicleId, requiredReading);
};

export const getHourMeterHistory = async (vehicleId, limit = 50) => {
  const service = new FirebaseHourMeterService();
  return service.getHourMeterHistory(vehicleId, limit);
};

export const initializeHourMeter = async (vehicleId, initialReading) => {
  const service = new FirebaseHourMeterService();
  return service.initializeHourMeter(vehicleId, initialReading);
};

export const getHourMeterSummary = async (vehicleId) => {
  const service = new FirebaseHourMeterService();
  return service.getHourMeterSummary(vehicleId);
};

export const getHourMeterStats = async (filters = {}) => {
  const service = new FirebaseHourMeterService();
  return service.getHourMeterStats(filters);
};

export const subscribeToHourMeters = (callback) => {
  const service = new FirebaseHourMeterService();
  return service.subscribeToHourMeters(callback);
};