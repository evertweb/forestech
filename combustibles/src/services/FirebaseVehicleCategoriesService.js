/**
 * FirebaseVehicleCategoriesService - Servicio de categorías de vehículos usando Firebase Functions
 * Reemplaza SqlVehicleCategoriesService para usar endpoints SQL migrados
 * Forestech Combustibles App
 */

import HttpService from './base/HttpService.js';

// Tipos de categoría
export const CATEGORY_TYPES = {
  VEHICLE: 'vehicle',
  MACHINERY: 'machinery',
  EQUIPMENT: 'equipment',
  TRANSPORT: 'transport',
};

class FirebaseVehicleCategoriesService extends HttpService {
  constructor() {
    super();
  }

  /**
   * Crear nueva categoría de vehículo
   * @param {Object} categoryData - Datos de la categoría
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async createCategory(categoryData) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      if (!categoryData.name) {
        return { success: false, error: 'El nombre de la categoría es requerido' };
      }

      const result = await this.callEndpoint('sqlCreateCategory', {
        categoryData: {
          ...categoryData,
          createdBy: this.getCurrentUser()?.uid
        }
      });

      return result;
    } catch (error) {
      console.error('Error creando categoría:', error);
      return {
        success: false,
        error: 'Error al crear la categoría: ' + error.message
      };
    }
  }

  /**
   * Obtener todas las categorías
   * @param {Object} options - Opciones de filtrado
   * @returns {Promise<Array>} - Lista de categorías
   */
  async getCategories(options = {}) {
    try {
      const result = await this.callEndpoint('sqlGetAllCategories', { options });

      if (result.success && result.data) {
        // Procesar datos de respuesta
        return result.data.map(category => ({
          ...category,
          customFields: this.parseJSON(category.customFields),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      throw error;
    }
  }

  /**
   * Obtener categoría por ID
   * @param {string} categoryId - ID de la categoría
   * @returns {Promise<Object|null>} - Datos de la categoría
   */
  async getCategory(categoryId) {
    try {
      const result = await this.callEndpoint('sqlGetCategory', { categoryId });

      if (result.success && result.data) {
        return {
          ...result.data,
          customFields: this.parseJSON(result.data.customFields),
        };
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo categoría:', error);
      throw error;
    }
  }

  /**
   * Obtener categoría por código
   * @param {string} code - Código de la categoría
   * @returns {Promise<Object|null>} - Datos de la categoría
   */
  async getCategoryByCode(code) {
    try {
      const result = await this.callEndpoint('sqlGetCategoryByCode', { code });

      if (result.success && result.data) {
        return {
          ...result.data,
          customFields: this.parseJSON(result.data.customFields),
        };
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo categoría por código:', error);
      throw error;
    }
  }

  /**
   * Actualizar categoría
   * @param {string} categoryId - ID de la categoría
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateCategory(categoryId, updateData) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.callEndpoint('sqlUpdateCategory', {
        categoryId,
        updateData: {
          ...updateData,
          updatedBy: this.getCurrentUser()?.uid
        }
      });

      return result;
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      return {
        success: false,
        error: 'Error al actualizar la categoría: ' + error.message
      };
    }
  }

  /**
   * Eliminar categoría
   * @param {string} categoryId - ID de la categoría
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async deleteCategory(categoryId) {
    try {
      const result = await this.callEndpoint('sqlDeleteCategory', { categoryId });
      return result;
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      return {
        success: false,
        error: 'Error al eliminar la categoría: ' + error.message
      };
    }
  }

  /**
   * Actualizar contador de vehículos
   * @param {string} categoryId - ID de la categoría
   * @param {number} increment - Incremento/decremento del contador
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateVehicleCount(categoryId, increment = 1) {
    try {
      const result = await this.callEndpoint('sqlUpdateVehicleCount', {
        categoryId,
        increment
      });

      return result;
    } catch (error) {
      console.error('Error actualizando contador de vehículos:', error);
      return {
        success: false,
        error: 'Error al actualizar el contador: ' + error.message
      };
    }
  }

  /**
   * Reordenar categorías
   * @param {Array} categoryOrders - Array con {id, sortOrder}
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async reorderCategories(categoryOrders) {
    try {
      const result = await this.callEndpoint('sqlReorderCategories', {
        categoryOrders
      });

      return result;
    } catch (error) {
      console.error('Error reordenando categorías:', error);
      return {
        success: false,
        error: 'Error al reordenar las categorías: ' + error.message
      };
    }
  }

  /**
   * Obtener categorías activas
   * @returns {Promise<Array>} - Lista de categorías activas
   */
  async getActiveCategories() {
    try {
      const result = await this.callEndpoint('sqlGetActiveCategories');

      if (result.success && result.data) {
        return result.data.map(category => ({
          ...category,
          customFields: this.parseJSON(category.customFields),
        }));
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo categorías activas:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de categorías
   * @returns {Promise<Object|null>} - Estadísticas de categorías
   */
  async getCategoryStats() {
    try {
      const result = await this.callEndpoint('sqlGetCategoryStats');

      if (result.success && result.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo estadísticas de categorías:', error);
      throw error;
    }
  }

  /**
   * Suscribirse a cambios en categorías
   * @param {Function} callback - Función de callback
   * @returns {Function} - Función para cancelar suscripción
   */
  subscribeToCategories(callback) {
    let isActive = true;

    const poll = async () => {
      if (!isActive) return;

      try {
        // Verificar autenticación antes de hacer la llamada
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
          console.log('🔒 CategoriesService: Usuario no autenticado, omitiendo polling');
          callback([], null); // Devolver array vacío en lugar de error
          if (isActive) {
            setTimeout(poll, 30000); // Poll cada 30 segundos
          }
          return;
        }

        const data = await this.getCategories();
        callback(data, null);
      } catch (error) {
        console.error('Error en polling de categorías:', error);
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
   * MÉTODOS AUXILIARES
   */

  /**
   * Generar código de categoría automático
   * @param {string} name - Nombre de la categoría
   * @returns {string} - Código generado
   */
  generateCategoryCode(name) {
    return name
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 10);
  }

  /**
   * Parsear JSON de manera segura
   * @param {string} jsonString - String JSON
   * @returns {Object} - Objeto parseado o valor por defecto
   */
  parseJSON(jsonString) {
    try {
      return jsonString ? JSON.parse(jsonString) : {};
    } catch (error) {
      console.warn('Error parseando JSON:', error);
      return {};
    }
  }
}

export default FirebaseVehicleCategoriesService;

// Funciones de compatibilidad con el servicio anterior
export const createCategory = async (categoryData) => {
  const service = new FirebaseVehicleCategoriesService();
  return service.createCategory(categoryData);
};

export const subscribeToCategories = (callback) => {
  const service = new FirebaseVehicleCategoriesService();
  return service.subscribeToCategories(callback);
};

export const updateCategory = async (categoryId, updateData) => {
  const service = new FirebaseVehicleCategoriesService();
  return service.updateCategory(categoryId, updateData);
};

export const deleteCategory = async (categoryId) => {
  const service = new FirebaseVehicleCategoriesService();
  return service.deleteCategory(categoryId);
};

export const getCategoryByCode = async (code) => {
  const service = new FirebaseVehicleCategoriesService();
  return service.getCategoryByCode(code);
};

export const getAllVehicleCategories = async (options = {}) => {
  const service = new FirebaseVehicleCategoriesService();
  return service.getCategories(options);
};

export const getActiveCategories = async () => {
  const service = new FirebaseVehicleCategoriesService();
  return service.getActiveCategories();
};

export const getCategoryStats = async () => {
  const service = new FirebaseVehicleCategoriesService();
  return service.getCategoryStats();
};