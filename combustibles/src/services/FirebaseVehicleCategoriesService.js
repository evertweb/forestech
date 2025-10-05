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
      console.log('🔥 FirebaseVehicleCategoriesService.createCategory - INICIO:', categoryData);

      // Verificar autenticación
      if (!(await this.isAuthenticated())) {
        console.error('❌ FirebaseVehicleCategoriesService.createCategory - Usuario no autenticado');
        return { success: false, error: 'Usuario no autenticado' };
      }

      console.log('✅ FirebaseVehicleCategoriesService.createCategory - Usuario autenticado');

      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        console.error('❌ FirebaseVehicleCategoriesService.createCategory - No se pudo obtener el usuario actual');
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Validación de payload básico
      if (!categoryData || typeof categoryData !== 'object') {
        console.error('❌ FirebaseVehicleCategoriesService.createCategory - Payload inválido:', categoryData);
        return { success: false, error: 'Datos de categoría inválidos' };
      }

      // Validación de campos requeridos
      if (!categoryData.name || typeof categoryData.name !== 'string' || categoryData.name.trim().length === 0) {
        console.error('❌ FirebaseVehicleCategoriesService.createCategory - Nombre requerido:', categoryData.name);
        return { success: false, error: 'El nombre de la categoría es requerido y debe ser texto válido' };
      }

      if (categoryData.name.trim().length < 2) {
        console.error('❌ FirebaseVehicleCategoriesService.createCategory - Nombre demasiado corto:', categoryData.name);
        return { success: false, error: 'El nombre debe tener al menos 2 caracteres' };
      }

      // Validación de fuelTypes si está presente
      if (categoryData.fuelTypes !== undefined) {
        if (!Array.isArray(categoryData.fuelTypes)) {
          console.error('❌ FirebaseVehicleCategoriesService.createCategory - fuelTypes debe ser array:', categoryData.fuelTypes);
          return { success: false, error: 'Los tipos de combustible deben ser un array' };
        }
        if (categoryData.fuelTypes.length === 0) {
          console.error('❌ FirebaseVehicleCategoriesService.createCategory - fuelTypes vacío');
          return { success: false, error: 'Debe seleccionar al menos un tipo de combustible' };
        }
      }

      // Validación de code si está presente
      if (categoryData.code && (typeof categoryData.code !== 'string' || categoryData.code.trim().length === 0)) {
        console.error('❌ FirebaseVehicleCategoriesService.createCategory - Código inválido:', categoryData.code);
        return { success: false, error: 'El código debe ser texto válido' };
      }

      console.log('✅ FirebaseVehicleCategoriesService.createCategory - Validación exitosa');

      // Preparar payload para Cloud Run
      const payload = {
        categoryData: {
          ...categoryData,
          name: categoryData.name.trim(),
          code: categoryData.code ? categoryData.code.trim().toUpperCase() : this.generateCategoryCode(categoryData.name),
          createdBy: currentUser.uid,
          createdAt: new Date().toISOString(),
        }
      };

      console.log('📤 FirebaseVehicleCategoriesService.createCategory - Payload a enviar:', payload);

      const result = await this.callEndpoint('sqlCreateCategory', payload);

      console.log('📥 FirebaseVehicleCategoriesService.createCategory - Resultado recibido:', result);

      if (result.success) {
        console.log('✅ FirebaseVehicleCategoriesService.createCategory - Categoría creada exitosamente');
      } else {
        console.error('❌ FirebaseVehicleCategoriesService.createCategory - Error en Cloud Run:', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ FirebaseVehicleCategoriesService.createCategory - Error inesperado:', error);
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
      console.log('🔥 FirebaseVehicleCategoriesService.updateCategory - INICIO:', { categoryId, updateData });

      // Verificar autenticación
      if (!(await this.isAuthenticated())) {
        console.error('❌ FirebaseVehicleCategoriesService.updateCategory - Usuario no autenticado');
        return { success: false, error: 'Usuario no autenticado' };
      }

      const currentUser = await this.getCurrentUser();
      if (!currentUser) {
        console.error('❌ FirebaseVehicleCategoriesService.updateCategory - No se pudo obtener el usuario actual');
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Validación de parámetros
      if (!categoryId || typeof categoryId !== 'string' || categoryId.trim().length === 0) {
        console.error('❌ FirebaseVehicleCategoriesService.updateCategory - ID de categoría inválido:', categoryId);
        return { success: false, error: 'ID de categoría requerido' };
      }

      if (!updateData || typeof updateData !== 'object' || Object.keys(updateData).length === 0) {
        console.error('❌ FirebaseVehicleCategoriesService.updateCategory - Datos de actualización inválidos:', updateData);
        return { success: false, error: 'Datos de actualización requeridos' };
      }

      // Validación específica de campos
      if (updateData.name !== undefined) {
        if (typeof updateData.name !== 'string' || updateData.name.trim().length === 0) {
          console.error('❌ FirebaseVehicleCategoriesService.updateCategory - Nombre inválido:', updateData.name);
          return { success: false, error: 'El nombre debe ser texto válido' };
        }
        if (updateData.name.trim().length < 2) {
          console.error('❌ FirebaseVehicleCategoriesService.updateCategory - Nombre demasiado corto:', updateData.name);
          return { success: false, error: 'El nombre debe tener al menos 2 caracteres' };
        }
        updateData.name = updateData.name.trim();
      }

      if (updateData.fuelTypes !== undefined) {
        if (!Array.isArray(updateData.fuelTypes)) {
          console.error('❌ FirebaseVehicleCategoriesService.updateCategory - fuelTypes debe ser array:', updateData.fuelTypes);
          return { success: false, error: 'Los tipos de combustible deben ser un array' };
        }
        if (updateData.fuelTypes.length === 0) {
          console.error('❌ FirebaseVehicleCategoriesService.updateCategory - fuelTypes vacío');
          return { success: false, error: 'Debe seleccionar al menos un tipo de combustible' };
        }
      }

      console.log('✅ FirebaseVehicleCategoriesService.updateCategory - Validación exitosa');

      // Preparar payload
      const payload = {
        categoryId: categoryId.trim(),
        updateData: {
          ...updateData,
          updatedBy: currentUser.uid,
          updatedAt: new Date().toISOString(),
        }
      };

      console.log('📤 FirebaseVehicleCategoriesService.updateCategory - Payload a enviar:', payload);

      const result = await this.callEndpoint('sqlUpdateCategory', payload);

      console.log('📥 FirebaseVehicleCategoriesService.updateCategory - Resultado recibido:', result);

      if (result.success) {
        console.log('✅ FirebaseVehicleCategoriesService.updateCategory - Categoría actualizada exitosamente');
      } else {
        console.error('❌ FirebaseVehicleCategoriesService.updateCategory - Error en Cloud Run:', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ FirebaseVehicleCategoriesService.updateCategory - Error inesperado:', error);
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
      console.log('🔥 FirebaseVehicleCategoriesService.deleteCategory - INICIO:', categoryId);

      // Verificar autenticación
      if (!(await this.isAuthenticated())) {
        console.error('❌ FirebaseVehicleCategoriesService.deleteCategory - Usuario no autenticado');
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Validación de parámetros
      if (!categoryId || typeof categoryId !== 'string' || categoryId.trim().length === 0) {
        console.error('❌ FirebaseVehicleCategoriesService.deleteCategory - ID de categoría inválido:', categoryId);
        return { success: false, error: 'ID de categoría requerido' };
      }

      console.log('✅ FirebaseVehicleCategoriesService.deleteCategory - Validación exitosa');

      const payload = {
        categoryId: categoryId.trim()
      };

      console.log('📤 FirebaseVehicleCategoriesService.deleteCategory - Payload a enviar:', payload);

      const result = await this.callEndpoint('sqlDeleteCategory', payload);

      console.log('📥 FirebaseVehicleCategoriesService.deleteCategory - Resultado recibido:', result);

      if (result.success) {
        console.log('✅ FirebaseVehicleCategoriesService.deleteCategory - Categoría eliminada exitosamente');
      } else {
        console.error('❌ FirebaseVehicleCategoriesService.deleteCategory - Error en Cloud Run:', result.error);
      }

      return result;
    } catch (error) {
      console.error('❌ FirebaseVehicleCategoriesService.deleteCategory - Error inesperado:', error);
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
   * @param {string|Object} jsonString - String JSON o ya parseado
   * @returns {Object} - Objeto parseado o valor por defecto
   */
  parseJSON(jsonString) {
    try {
      // Si ya es un objeto, devolverlo directamente
      if (typeof jsonString === 'object' && jsonString !== null) {
        return jsonString;
      }
      // Si es string, intentar parsear
      return jsonString ? JSON.parse(jsonString) : {};
    } catch (error) {
      console.warn('⚠️ Error parseando JSON:', error.message, 'Valor:', jsonString);
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