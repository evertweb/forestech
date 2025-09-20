// combustibles/src/services/FirebaseMovementsService.js
// Servicio para movimientos usando Firebase Functions (httpsCallable)
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

const functions = getFunctions();

// Configurar emulador si es desarrollo
if (import.meta.env.DEV) {
  functions.useEmulator('localhost', 5001);
}

/**
 * Servicio de movimientos usando Firebase Functions
 * Reemplaza SqlMovementsService para usar httpsCallable
 */
class FirebaseMovementsService {
  constructor() {
    this.auth = getAuth();
  }

  /**
   * Crear un nuevo movimiento
   * @param {Object} movementData - Datos del movimiento
   * @param {Object} userInfo - Información del usuario (opcional)
   * @returns {Promise<Object>} Resultado de la operación
   */
  async createMovement(movementData, userInfo = null) {
    try {
      console.log('📊 Movement: Creando movimiento via Functions...', movementData);

      const createMovementFn = httpsCallable(functions, 'sqlCreateMovement');

      // Preparar datos para la función
      const functionData = {
        movementData,
        userInfo: userInfo || {
          uid: this.auth.currentUser?.uid,
          email: this.auth.currentUser?.email,
          displayName: this.auth.currentUser?.displayName,
        }
      };

      const result = await createMovementFn(functionData);

      console.log('✅ Movement: Creado exitosamente:', result.data);
      return {
        success: true,
        id: result.data.id,
        data: result.data,
        message: 'Movimiento creado exitosamente'
      };
    } catch (error) {
      console.error('❌ Movement: Error al crear:', error);
      return {
        success: false,
        error: error.message || 'Error al crear movimiento',
        details: error
      };
    }
  }

  /**
   * Obtener todos los movimientos
   * @param {Object} filters - Filtros para la consulta
   * @returns {Promise<Object>} Resultado de la operación
   */
  async getAllMovements(filters = {}) {
    try {
      console.log('📊 Movement: Obteniendo movimientos via Functions...', filters);

      const getAllMovementsFn = httpsCallable(functions, 'sqlGetAllMovements');
      const result = await getAllMovementsFn({ filters });

      console.log('✅ Movement: Obtenidos exitosamente:', result.data.movements?.length, 'movimientos');
      return {
        success: true,
        movements: result.data.movements || [],
        total: result.data.total || 0,
        data: result.data
      };
    } catch (error) {
      console.error('❌ Movement: Error al obtener:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener movimientos',
        details: error
      };
    }
  }

  /**
   * Actualizar un movimiento
   * @param {string} movementId - ID del movimiento
   * @param {Object} updateData - Datos a actualizar
   * @param {Object} userInfo - Información del usuario (opcional)
   * @returns {Promise<Object>} Resultado de la operación
   */
  async updateMovement(movementId, updateData, userInfo = null) {
    try {
      console.log('📊 Movement: Actualizando movimiento via Functions...', movementId);

      const updateMovementFn = httpsCallable(functions, 'sqlUpdateMovement');

      const functionData = {
        movementId,
        updateData,
        userInfo: userInfo || {
          uid: this.auth.currentUser?.uid,
          email: this.auth.currentUser?.email,
          displayName: this.auth.currentUser?.displayName,
        }
      };

      const result = await updateMovementFn(functionData);

      console.log('✅ Movement: Actualizado exitosamente:', result.data);
      return {
        success: true,
        data: result.data,
        message: 'Movimiento actualizado exitosamente'
      };
    } catch (error) {
      console.error('❌ Movement: Error al actualizar:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar movimiento',
        details: error
      };
    }
  }

  /**
   * Eliminar un movimiento
   * @param {string} movementId - ID del movimiento
   * @returns {Promise<Object>} Resultado de la operación
   */
  async deleteMovement(movementId) {
    try {
      console.log('📊 Movement: Eliminando movimiento via Functions...', movementId);

      const deleteMovementFn = httpsCallable(functions, 'sqlDeleteMovement');
      const result = await deleteMovementFn({ movementId });

      console.log('✅ Movement: Eliminado exitosamente:', result.data);
      return {
        success: true,
        data: result.data,
        message: 'Movimiento eliminado exitosamente'
      };
    } catch (error) {
      console.error('❌ Movement: Error al eliminar:', error);
      return {
        success: false,
        error: error.message || 'Error al eliminar movimiento',
        details: error
      };
    }
  }

  /**
   * Obtener movimientos con paginación
   * @param {Object} options - Opciones de paginación
   * @returns {Promise<Object>} Resultado de la operación
   */
  async getMovements(options = {}) {
    try {
      console.log('📊 Movement: Obteniendo movimientos paginados via Functions...', options);

      const getAllMovementsFn = httpsCallable(functions, 'sqlGetAllMovements');
      const result = await getAllMovementsFn({
        filters: {
          limit: options.limit || 50,
          offset: options.offset || 0,
          orderBy: options.orderBy || 'createdAt',
          orderDirection: options.orderDirection || 'DESC',
          ...options.filters
        }
      });

      console.log('✅ Movement: Paginación exitosa:', result.data.movements?.length, 'movimientos');
      return {
        success: true,
        movements: result.data.movements || [],
        total: result.data.total || 0,
        hasMore: result.data.hasMore || false,
        data: result.data
      };
    } catch (error) {
      console.error('❌ Movement: Error en paginación:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener movimientos paginados',
        details: error
      };
    }
  }

  /**
   * Suscribirse a cambios en movimientos (simulado con polling)
   * @param {Function} callback - Función callback para cambios
   * @param {number} interval - Intervalo de polling en ms (default: 5000)
   * @returns {Function} Función para cancelar suscripción
   */
  subscribeToMovements(callback, interval = 5000) {
    console.log('📊 Movement: Iniciando suscripción a movimientos...');

    let isSubscribed = true;
    let lastUpdate = Date.now();

    const poll = async () => {
      if (!isSubscribed) return;

      try {
        const result = await this.getMovements({ limit: 100 });

        if (result.success) {
          callback(result.movements, null);
        } else {
          callback([], result.error);
        }
      } catch (error) {
        console.error('❌ Movement: Error en suscripción:', error);
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
      console.log('📊 Movement: Cancelando suscripción a movimientos');
      isSubscribed = false;
    };
  }
}

// Exportar función subscribeToMovements para compatibilidad
export const subscribeToMovements = (callback, interval = 5000) => {
  const service = new FirebaseMovementsService();
  return service.subscribeToMovements(callback, interval);
};

// Exportar instancia singleton
export default new FirebaseMovementsService();