// combustibles/src/services/FirebaseVehiclesService.js
// Servicio para vehículos usando Firebase Functions (httpsCallable)
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

const functions = getFunctions();

// Configurar emulador si es desarrollo
if (import.meta.env.DEV) {
  functions.useEmulator('localhost', 5001);
}

/**
 * Servicio de vehículos usando Firebase Functions
 * Reemplaza SqlVehiclesService para usar httpsCallable
 */
class FirebaseVehiclesService {
  constructor() {
    this.auth = getAuth();
  }

  /**
   * Crear un nuevo vehículo
   * @param {Object} vehicleData - Datos del vehículo
   * @param {Object} userInfo - Información del usuario (opcional)
   * @returns {Promise<Object>} Resultado de la operación
   */
  async createVehicle(vehicleData, userInfo = null) {
    try {
      console.log('🚜 Vehicle: Creando vehículo via Functions...', vehicleData);

      const createVehicleFn = httpsCallable(functions, 'sqlCreateVehicle');

      const functionData = {
        vehicleData,
        userInfo: userInfo || {
          uid: this.auth.currentUser?.uid,
          email: this.auth.currentUser?.email,
          displayName: this.auth.currentUser?.displayName,
        }
      };

      const result = await createVehicleFn(functionData);

      console.log('✅ Vehicle: Creado exitosamente:', result.data);
      return {
        success: true,
        id: result.data.id,
        data: result.data,
        message: 'Vehículo creado exitosamente'
      };
    } catch (error) {
      console.error('❌ Vehicle: Error al crear:', error);
      return {
        success: false,
        error: error.message || 'Error al crear vehículo',
        details: error
      };
    }
  }

  /**
   * Obtener todos los vehículos
   * @param {Object} filters - Filtros para la consulta
   * @returns {Promise<Object>} Resultado de la operación
   */
  async getAllVehicles(filters = {}) {
    try {
      console.log('🚜 Vehicle: Obteniendo vehículos via Functions...', filters);

      const getAllVehiclesFn = httpsCallable(functions, 'sqlGetAllVehicles');
      const result = await getAllVehiclesFn({ filters });

      console.log('✅ Vehicle: Obtenidos exitosamente:', result.data.vehicles?.length, 'vehículos');
      return {
        success: true,
        vehicles: result.data.vehicles || [],
        total: result.data.total || 0,
        data: result.data
      };
    } catch (error) {
      console.error('❌ Vehicle: Error al obtener:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener vehículos',
        details: error
      };
    }
  }

  /**
   * Obtener vehículo por ID
   * @param {string} vehicleId - ID del vehículo
   * @returns {Promise<Object>} Resultado de la operación
   */
  async getVehicleById(vehicleId) {
    try {
      console.log('🚜 Vehicle: Obteniendo vehículo por ID via Functions...', vehicleId);

      const getVehicleByIdFn = httpsCallable(functions, 'sqlGetVehicleById');
      const result = await getVehicleByIdFn({ vehicleId });

      console.log('✅ Vehicle: Obtenido por ID exitosamente:', result.data);
      return {
        success: true,
        vehicle: result.data.vehicle,
        data: result.data
      };
    } catch (error) {
      console.error('❌ Vehicle: Error al obtener por ID:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener vehículo',
        details: error
      };
    }
  }

  /**
   * Actualizar un vehículo
   * @param {string} vehicleId - ID del vehículo
   * @param {Object} updateData - Datos a actualizar
   * @param {Object} userInfo - Información del usuario (opcional)
   * @returns {Promise<Object>} Resultado de la operación
   */
  async updateVehicle(vehicleId, updateData, userInfo = null) {
    try {
      console.log('🚜 Vehicle: Actualizando vehículo via Functions...', vehicleId);

      const updateVehicleFn = httpsCallable(functions, 'sqlUpdateVehicle');

      const functionData = {
        vehicleId,
        updateData,
        userInfo: userInfo || {
          uid: this.auth.currentUser?.uid,
          email: this.auth.currentUser?.email,
          displayName: this.auth.currentUser?.displayName,
        }
      };

      const result = await updateVehicleFn(functionData);

      console.log('✅ Vehicle: Actualizado exitosamente:', result.data);
      return {
        success: true,
        data: result.data,
        message: 'Vehículo actualizado exitosamente'
      };
    } catch (error) {
      console.error('❌ Vehicle: Error al actualizar:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar vehículo',
        details: error
      };
    }
  }

  /**
   * Eliminar un vehículo
   * @param {string} vehicleId - ID del vehículo
   * @returns {Promise<Object>} Resultado de la operación
   */
  async deleteVehicle(vehicleId) {
    try {
      console.log('🚜 Vehicle: Eliminando vehículo via Functions...', vehicleId);

      const deleteVehicleFn = httpsCallable(functions, 'sqlDeleteVehicle');
      const result = await deleteVehicleFn({ vehicleId });

      console.log('✅ Vehicle: Eliminado exitosamente:', result.data);
      return {
        success: true,
        data: result.data,
        message: 'Vehículo eliminado exitosamente'
      };
    } catch (error) {
      console.error('❌ Vehicle: Error al eliminar:', error);
      return {
        success: false,
        error: error.message || 'Error al eliminar vehículo',
        details: error
      };
    }
  }

  /**
   * Obtener estadísticas de vehículos
   * @param {Object} filters - Filtros para las estadísticas
   * @returns {Promise<Object>} Resultado de la operación
   */
  async getVehiclesStats(filters = {}) {
    try {
      console.log('🚜 Vehicle: Obteniendo estadísticas via Functions...', filters);

      const getVehiclesStatsFn = httpsCallable(functions, 'sqlGetVehiclesStats');
      const result = await getVehiclesStatsFn({ filters });

      console.log('✅ Vehicle: Estadísticas obtenidas exitosamente:', result.data);
      return {
        success: true,
        stats: result.data.stats,
        data: result.data
      };
    } catch (error) {
      console.error('❌ Vehicle: Error al obtener estadísticas:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener estadísticas de vehículos',
        details: error
      };
    }
  }

  /**
   * Suscribirse a cambios en vehículos (simulado con polling)
   * @param {Function} callback - Función callback para cambios
   * @param {number} interval - Intervalo de polling en ms (default: 8000)
   * @returns {Function} Función para cancelar suscripción
   */
  subscribeToVehicles(callback, interval = 8000) {
    console.log('🚜 Vehicle: Iniciando suscripción a vehículos...');

    let isSubscribed = true;

    const poll = async () => {
      if (!isSubscribed) return;

      try {
        const result = await this.getAllVehicles();

        if (result.success) {
          callback(result.vehicles, null);
        } else {
          callback([], result.error);
        }
      } catch (error) {
        console.error('❌ Vehicle: Error en suscripción:', error);
        callback([], error.message);
      }

      // Programar siguiente poll
      if (isSubscribed) {
        setTimeout(poll, interval);
      }
    };

    // Iniciar polling
    poll();

    // Retornar función de cancelación
    return () => {
      console.log('🚜 Vehicle: Cancelando suscripción a vehículos');
      isSubscribed = false;
    };
  }
}

// Constantes exportadas desde Firebase Functions
export const VEHICLE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
  OUT_OF_SERVICE: 'out_of_service'
};

export const FUEL_TYPES = {
  DIESEL: 'diesel',
  GASOLINE: 'gasoline',
  ELECTRIC: 'electric',
  HYBRID: 'hybrid'
};

export const FUEL_COMPATIBILITY = {
  [FUEL_TYPES.DIESEL]: [FUEL_TYPES.DIESEL],
  [FUEL_TYPES.GASOLINE]: [FUEL_TYPES.GASOLINE],
  [FUEL_TYPES.ELECTRIC]: [FUEL_TYPES.ELECTRIC],
  [FUEL_TYPES.HYBRID]: [FUEL_TYPES.DIESEL, FUEL_TYPES.GASOLINE, FUEL_TYPES.ELECTRIC]
};

// Exportar función subscribeToVehicles para compatibilidad
export const subscribeToVehicles = (callback, interval = 8000) => {
  const service = new FirebaseVehiclesService();
  return service.subscribeToVehicles(callback, interval);
};

// Exportar función getVehiclesStats para compatibilidad
export const getVehiclesStats = (filters = {}) => {
  const service = new FirebaseVehiclesService();
  return service.getVehiclesStats(filters);
};

// Exportar instancia singleton
export default new FirebaseVehiclesService();