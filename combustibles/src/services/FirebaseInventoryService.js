// combustibles/src/services/FirebaseInventoryService.js
// Servicio para inventario usando Firebase Functions (httpsCallable)
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

const functions = getFunctions();

// Configurar emulador si es desarrollo
if (import.meta.env.DEV) {
  functions.useEmulator('localhost', 5001);
}

/**
 * Servicio de inventario usando Firebase Functions
 * Reemplaza SqlInventoryService para usar httpsCallable
 */
class FirebaseInventoryService {
  constructor() {
    this.auth = getAuth();
  }

  /**
   * Crear un nuevo item de inventario
   * @param {Object} inventoryData - Datos del item de inventario
   * @param {Object} userInfo - Información del usuario (opcional)
   * @returns {Promise<Object>} Resultado de la operación
   */
  async createInventoryItem(inventoryData, userInfo = null) {
    try {
      console.log('📦 Inventory: Creando item via Functions...', inventoryData);

      const createInventoryFn = httpsCallable(functions, 'sqlCreateInventoryItem');

      const functionData = {
        inventoryData,
        userInfo: userInfo || {
          uid: this.auth.currentUser?.uid,
          email: this.auth.currentUser?.email,
          displayName: this.auth.currentUser?.displayName,
        }
      };

      const result = await createInventoryFn(functionData);

      console.log('✅ Inventory: Creado exitosamente:', result.data);
      return {
        success: true,
        id: result.data.id,
        data: result.data,
        message: 'Item de inventario creado exitosamente'
      };
    } catch (error) {
      console.error('❌ Inventory: Error al crear:', error);
      return {
        success: false,
        error: error.message || 'Error al crear item de inventario',
        details: error
      };
    }
  }

  /**
   * Obtener todos los items del inventario
   * @param {Object} filters - Filtros para la consulta
   * @returns {Promise<Object>} Resultado de la operación
   */
  async getAllInventory(filters = {}) {
    try {
      console.log('📦 Inventory: Obteniendo inventario via Functions...', filters);

      const getAllInventoryFn = httpsCallable(functions, 'sqlGetAllInventory');
      const result = await getAllInventoryFn({ filters });

      console.log('✅ Inventory: Obtenido exitosamente:', result.data.inventory?.length, 'items');
      return {
        success: true,
        inventory: result.data.inventory || [],
        total: result.data.total || 0,
        data: result.data
      };
    } catch (error) {
      console.error('❌ Inventory: Error al obtener:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener inventario',
        details: error
      };
    }
  }

  /**
   * Actualizar un item de inventario
   * @param {string} itemId - ID del item
   * @param {Object} updateData - Datos a actualizar
   * @param {Object} userInfo - Información del usuario (opcional)
   * @returns {Promise<Object>} Resultado de la operación
   */
  async updateInventoryItem(itemId, updateData, userInfo = null) {
    try {
      console.log('📦 Inventory: Actualizando item via Functions...', itemId);

      const updateInventoryFn = httpsCallable(functions, 'sqlUpdateInventoryItem');

      const functionData = {
        itemId,
        updateData,
        userInfo: userInfo || {
          uid: this.auth.currentUser?.uid,
          email: this.auth.currentUser?.email,
          displayName: this.auth.currentUser?.displayName,
        }
      };

      const result = await updateInventoryFn(functionData);

      console.log('✅ Inventory: Actualizado exitosamente:', result.data);
      return {
        success: true,
        data: result.data,
        message: 'Item de inventario actualizado exitosamente'
      };
    } catch (error) {
      console.error('❌ Inventory: Error al actualizar:', error);
      return {
        success: false,
        error: error.message || 'Error al actualizar item de inventario',
        details: error
      };
    }
  }

  /**
   * Eliminar un item de inventario
   * @param {string} itemId - ID del item
   * @returns {Promise<Object>} Resultado de la operación
   */
  async deleteInventoryItem(itemId) {
    try {
      console.log('📦 Inventory: Eliminando item via Functions...', itemId);

      const deleteInventoryFn = httpsCallable(functions, 'sqlDeleteInventoryItem');
      const result = await deleteInventoryFn({ itemId });

      console.log('✅ Inventory: Eliminado exitosamente:', result.data);
      return {
        success: true,
        data: result.data,
        message: 'Item de inventario eliminado exitosamente'
      };
    } catch (error) {
      console.error('❌ Inventory: Error al eliminar:', error);
      return {
        success: false,
        error: error.message || 'Error al eliminar item de inventario',
        details: error
      };
    }
  }

  /**
   * Obtener inventario por ubicación
   * @param {string} location - Ubicación del inventario
   * @returns {Promise<Object>} Resultado de la operación
   */
  async getInventoryByLocation(location) {
    try {
      console.log('📦 Inventory: Obteniendo por ubicación via Functions...', location);

      const getByLocationFn = httpsCallable(functions, 'sqlGetInventoryByLocation');
      const result = await getByLocationFn({ location });

      console.log('✅ Inventory: Obtenido por ubicación exitosamente:', result.data.inventory?.length, 'items');
      return {
        success: true,
        inventory: result.data.inventory || [],
        data: result.data
      };
    } catch (error) {
      console.error('❌ Inventory: Error al obtener por ubicación:', error);
      return {
        success: false,
        error: error.message || 'Error al obtener inventario por ubicación',
        details: error
      };
    }
  }

  /**
   * Suscribirse a cambios en inventario (simulado con polling)
   * @param {Function} callback - Función callback para cambios
   * @param {number} interval - Intervalo de polling en ms (default: 10000)
   * @returns {Function} Función para cancelar suscripción
   */
  subscribeToInventory(callback, interval = 10000) {
    console.log('📦 Inventory: Iniciando suscripción a inventario...');

    let isSubscribed = true;

    const poll = async () => {
      if (!isSubscribed) return;

      try {
        const result = await this.getAllInventory();

        if (result.success) {
          callback(result.inventory, null);
        } else {
          callback([], result.error);
        }
      } catch (error) {
        console.error('❌ Inventory: Error en suscripción:', error);
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
      console.log('📦 Inventory: Cancelando suscripción a inventario');
      isSubscribed = false;
    };
  }
}

// Exportar función subscribeToInventory para compatibilidad
export const subscribeToInventory = (callback, interval = 10000) => {
  const service = new FirebaseInventoryService();
  return service.subscribeToInventory(callback, interval);
};

// Exportar instancia singleton
export default new FirebaseInventoryService();