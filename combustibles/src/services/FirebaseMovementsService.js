/**
 * CloudRunMovementsService - Servicio de movimientos usando Cloud Run SQL endpoints
 * Reemplaza SqlMovementsService para usar endpoints SQL migrados
 * Forestech Combustibles App
 */

import HttpService from './base/HttpService.js';

// Tipos de movimientos (mantenemos compatibilidad)
export const MOVEMENT_TYPES = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
  TRANSFERENCIA: 'transferencia',
  AJUSTE: 'ajuste',
  MANTENIMIENTO: 'mantenimiento',
};

export const MOVEMENT_STATUS = {
  PENDIENTE: 'pendiente',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
};

class FirebaseMovementsService extends HttpService {
  constructor() {
    super();
  }

  /**
   * Crear nuevo movimiento con lógica de negocio
   * @param {Object} movementData - Datos del movimiento
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async createMovement(movementData) {
    try {
      if (!(await this.isAuthenticated())) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Normalizar fuelType
      if (movementData.fuelType) {
        movementData.fuelType = movementData.fuelType.toUpperCase();
      }

      // Validar datos básicos
      this.validateMovementData(movementData);

      const result = await this.callEndpoint('sqlCreateMovement', {
        movementData: {
          ...movementData,
          createdBy: (await this.getCurrentUser())?.uid
        }
      });

      return result;
    } catch (error) {
      console.error('Error al crear movimiento:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener movimientos con filtros
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Array>} - Lista de movimientos
   */
  async getAllMovements(filters = {}) {
    try {
      // Normalizar fuelType en filtros
      if (filters.fuelType) {
        filters.fuelType = filters.fuelType.toUpperCase();
      }

      const result = await this.callEndpoint('sqlGetAllMovements', { filters });

      if (result.success && result.data) {
        // Convertir timestamps para compatibilidad con frontend
        return result.data.map(movement => ({
          ...movement,
          createdAt: movement.createdAt?.toISOString(),
          updatedAt: movement.updatedAt?.toISOString(),
          effectiveDate: movement.effectiveDate?.toISOString(),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      return [];
    }
  }

  /**
   * Obtener movimiento específico por ID
   * @param {string} movementId - ID del movimiento
   * @returns {Promise<Object|null>} - Datos del movimiento
   */
  async getMovement(movementId) {
    try {
      const result = await this.callEndpoint('sqlGetMovement', { movementId });

      if (result.success && result.data) {
        // Convertir timestamps
        return {
          ...result.data,
          createdAt: result.data.createdAt?.toISOString(),
          updatedAt: result.data.updatedAt?.toISOString(),
          effectiveDate: result.data.effectiveDate?.toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error('Error al obtener movimiento:', error);
      return null;
    }
  }

  /**
   * Actualizar movimiento
   * @param {string} movementId - ID del movimiento
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateMovement(movementId, updateData) {
    try {
      if (!(await this.isAuthenticated())) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.callEndpoint('sqlUpdateMovement', {
        movementId,
        updateData: {
          ...updateData,
          updatedBy: (await this.getCurrentUser())?.uid
        }
      });

      return result;
    } catch (error) {
      console.error('Error al actualizar movimiento:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar movimiento y revertir inventario
   * @param {string} movementId - ID del movimiento
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async deleteMovement(movementId) {
    try {
      const result = await this.callEndpoint('sqlDeleteMovement', { movementId });
      return result;
    } catch (error) {
      console.error('Error al eliminar movimiento:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Suscribirse a cambios en movimientos
   * @param {Function} callback - Función de callback
   * @returns {Function} - Función para cancelar suscripción
   */
  subscribeToMovements(callback) {
    let isActive = true;

    const poll = async () => {
      if (!isActive) return;

      try {
        // Verificar circuit breaker ANTES de intentar autenticación
        if (!this.isEndpointAvailable('sqlGetAllMovements')) {
          console.warn('⚡ MovementsService: Circuit breaker abierto, omitiendo polling por 5 minutos');
          callback([], null); // Devolver array vacío
          if (isActive) {
            setTimeout(poll, 300000); // Poll cada 5 minutos cuando circuit breaker activo
          }
          return;
        }

        // Verificar autenticación antes de hacer la llamada
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
          console.log('🔒 MovementsService: Usuario no autenticado, omitiendo polling');
          callback([], null); // Devolver array vacío en lugar de error
          if (isActive) {
            setTimeout(poll, 60000); // Poll cada 1 minuto cuando no autenticado
          }
          return;
        }

        const data = await this.getAllMovements();
        callback(data, null);
        
        // Éxito - usar intervalo normal
        if (isActive) {
          setTimeout(poll, 30000); // Poll cada 30 segundos
        }
      } catch (error) {
        console.error('❌ Error en polling de movimientos:', error);
        callback(null, error);
        
        // Backoff exponencial basado en tipo de error
        let nextInterval = 30000; // 30 segundos default
        
        if (error.circuitBreakerOpen) {
          nextInterval = 300000; // 5 minutos si circuit breaker está abierto
          console.warn('⚡ MovementsService: Circuit breaker detectado, esperando 5 minutos');
        } else if (error.message && error.message.includes('404')) {
          nextInterval = 120000; // 2 minutos para errores 404
          console.warn('🔍 MovementsService: Endpoint no disponible, esperando 2 minutos');
        }
        
        if (isActive) {
          setTimeout(poll, nextInterval);
        }
        return;
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
   * Obtener movimientos por vehículo
   * @param {string} vehicleId - ID del vehículo
   * @param {Object} options - Opciones de filtrado
   * @returns {Promise<Array>} - Lista de movimientos del vehículo
   */
  async getMovementsByVehicle(vehicleId, options = {}) {
    try {
      const result = await this.callEndpoint('sqlGetMovementsByVehicle', {
        vehicleId,
        options
      });

      if (result.success && result.data) {
        return result.data.map(movement => ({
          ...movement,
          createdAt: movement.createdAt?.toISOString(),
          updatedAt: movement.updatedAt?.toISOString(),
          effectiveDate: movement.effectiveDate?.toISOString(),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo movimientos por vehículo:', error);
      throw error;
    }
  }

  /**
   * Obtener movimientos por ubicación
   * @param {string} location - Ubicación
   * @param {Object} options - Opciones de filtrado
   * @returns {Promise<Array>} - Lista de movimientos en la ubicación
   */
  async getMovementsByLocation(location, options = {}) {
    try {
      const result = await this.callEndpoint('sqlGetMovementsByLocation', {
        location,
        options
      });

      if (result.success && result.data) {
        return result.data.map(movement => ({
          ...movement,
          createdAt: movement.createdAt?.toISOString(),
          updatedAt: movement.updatedAt?.toISOString(),
          effectiveDate: movement.effectiveDate?.toISOString(),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo movimientos por ubicación:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de movimientos
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Object|null>} - Estadísticas de movimientos
   */
  async getMovementsStats(filters = {}) {
    try {
      const result = await this.callEndpoint('sqlGetMovementsStats', { filters });

      if (result.success && result.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo estadísticas de movimientos:', error);
      throw error;
    }
  }

  /**
   * Obtener consumo de combustible por período
   * @param {Object} period - Período de consulta {startDate, endDate}
   * @param {Object} filters - Filtros adicionales
   * @returns {Promise<Object>} - Datos de consumo
   */
  async getFuelConsumptionByPeriod(period, filters = {}) {
    try {
      const result = await this.callEndpoint('sqlGetFuelConsumptionByPeriod', {
        period,
        filters
      });

      if (result.success && result.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo consumo de combustible por período:', error);
      throw error;
    }
  }

  /**
   * Obtener movimientos pendientes de aprobación
   * @returns {Promise<Array>} - Lista de movimientos pendientes
   */
  async getPendingMovements() {
    try {
      const result = await this.callEndpoint('sqlGetPendingMovements');

      if (result.success && result.data) {
        return result.data.map(movement => ({
          ...movement,
          createdAt: movement.createdAt?.toISOString(),
          updatedAt: movement.updatedAt?.toISOString(),
          effectiveDate: movement.effectiveDate?.toISOString(),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo movimientos pendientes:', error);
      throw error;
    }
  }

  /**
   * Aprobar movimiento
   * @param {string} movementId - ID del movimiento
   * @param {Object} approvalData - Datos de aprobación
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async approveMovement(movementId, approvalData = {}) {
    try {
      if (!(await this.isAuthenticated())) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.callEndpoint('sqlApproveMovement', {
        movementId,
        approvalData: {
          ...approvalData,
          approvedBy: (await this.getCurrentUser())?.uid
        }
      });

      return result;
    } catch (error) {
      console.error('Error aprobando movimiento:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Rechazar movimiento
   * @param {string} movementId - ID del movimiento
   * @param {string} reason - Razón del rechazo
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async rejectMovement(movementId, reason) {
    try {
      if (!(await this.isAuthenticated())) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.callEndpoint('sqlRejectMovement', {
        movementId,
        reason,
        rejectedBy: (await this.getCurrentUser())?.uid
      });

      return result;
    } catch (error) {
      console.error('Error rechazando movimiento:', error);
      return { success: false, error: error.message };
    }
  }

  // ========== MÉTODOS DE VALIDACIÓN ==========

  /**
   * Validar datos de movimiento
   * @param {Object} movementData - Datos a validar
   */
  validateMovementData(movementData) {
    const required = ['type', 'fuelType', 'quantity', 'unitPrice'];

    for (const field of required) {
      if (!movementData[field]) {
        throw new Error(`Campo requerido: ${field}`);
      }
    }

    if (movementData.fuelType) {
      movementData.fuelType = movementData.fuelType.toUpperCase();
    }

    if (!Object.values(MOVEMENT_TYPES).includes(movementData.type)) {
      throw new Error('Tipo de movimiento inválido');
    }

    if (movementData.quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a cero');
    }

    if (movementData.unitPrice < 0) {
      throw new Error('El precio unitario no puede ser negativo');
    }

    // Validaciones específicas por tipo
    if (movementData.type === MOVEMENT_TYPES.SALIDA && !movementData.vehicleId) {
      throw new Error('Las salidas deben tener un vehículo asociado');
    }

    if (movementData.type === MOVEMENT_TYPES.TRANSFERENCIA && !movementData.destinationLocation) {
      throw new Error('Las transferencias deben tener una ubicación destino');
    }

    if (movementData.type === MOVEMENT_TYPES.ENTRADA) {
      if (!movementData.supplierName) {
        throw new Error('Las entradas deben tener un proveedor');
      }
      if (!movementData.destinationLocation) {
        throw new Error('Las entradas deben tener una ubicación destino');
      }
    }
  }

  /**
   * Calcular valor total del movimiento
   * @param {Object} movementData - Datos del movimiento
   * @returns {number} - Valor total
   */
  calculateMovementValue(movementData) {
    return (movementData.quantity || 0) * (movementData.unitPrice || 0);
  }
}

export default FirebaseMovementsService;

// Funciones de compatibilidad con el servicio anterior
export const createMovement = async (movementData) => {
  const service = new FirebaseMovementsService();
  return service.createMovement(movementData);
};

export const getAllMovements = async (filters = {}) => {
  const service = new FirebaseMovementsService();
  return service.getAllMovements(filters);
};

export const getMovement = async (movementId) => {
  const service = new FirebaseMovementsService();
  return service.getMovement(movementId);
};

export const updateMovement = async (movementId, updateData) => {
  const service = new FirebaseMovementsService();
  return service.updateMovement(movementId, updateData);
};

export const deleteMovement = async (movementId) => {
  const service = new FirebaseMovementsService();
  return service.deleteMovement(movementId);
};

export const subscribeToMovements = (callback) => {
  const service = new FirebaseMovementsService();
  return service.subscribeToMovements(callback);
};

export const getMovementsStats = async (filters = {}) => {
  const service = new FirebaseMovementsService();
  return service.getMovementsStats(filters);
};

export const approveMovement = async (movementId, approvalData) => {
  const service = new FirebaseMovementsService();
  return service.updateMovement(movementId, { 
    status: 'completado',
    approvedAt: new Date().toISOString(),
    ...approvalData 
  });
};