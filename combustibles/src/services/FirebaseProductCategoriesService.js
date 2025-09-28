/**
 * FirebaseProductCategoriesService - Servicio de categorías de productos usando Cloud Run SQL endpoints
 * Reemplaza productCategoriesService para usar endpoints SQL migrados
 * Forestech Combustibles App
 */

import HttpService from './base/HttpService.js';

// Categorías predeterminadas (no se pueden eliminar)
export const DEFAULT_PRODUCT_CATEGORIES = [
  {
    id: 'combustible',
    name: 'Combustible',
    description: 'Combustibles líquidos como diesel, gasolina, mezclas',
    icon: '⛽',
    color: '#FF6B35',
    isDefault: true,
    isActive: true
  },
  {
    id: 'lubricante',
    name: 'Lubricante',
    description: 'Aceites y lubricantes para maquinaria',
    icon: '🛢️',
    color: '#4ECDC4',
    isDefault: true,
    isActive: true
  },
  {
    id: 'aditivo',
    name: 'Aditivo',
    description: 'Aditivos y mejoradores de combustible',
    icon: '🧪',
    color: '#45B7D1',
    isDefault: true,
    isActive: true
  },
  {
    id: 'suministro',
    name: 'Suministro',
    description: 'Otros suministros y productos químicos',
    icon: '📦',
    color: '#96CEB4',
    isDefault: true,
    isActive: true
  }
];

class FirebaseProductCategoriesService extends HttpService {
  constructor() {
    super();
  }

  /**
   * Crear nueva categoría de producto
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

      const result = await this.callEndpoint('sqlCreateProductCategory', {
        categoryData: {
          ...categoryData,
          createdBy: this.getCurrentUser()?.uid
        }
      });

      return result;
    } catch (error) {
      console.error('Error creando categoría de producto:', error);
      return {
        success: false,
        error: 'Error al crear la categoría: ' + error.message
      };
    }
  }

  /**
   * Obtener todas las categorías de productos
   * @returns {Promise<Object>} - Lista de categorías
   */
  async getAllCategories() {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.callEndpoint('sqlGetProductCategories', {});
      
      if (result.success && result.data) {
        // Combinar categorías predeterminadas con personalizadas
        const customCategories = result.data || [];
        const allCategories = [...DEFAULT_PRODUCT_CATEGORIES, ...customCategories];
        
        return {
          success: true,
          data: allCategories
        };
      }

      return result;
    } catch (error) {
      console.error('Error obteniendo categorías de productos:', error);
      return {
        success: false,
        error: 'Error al obtener categorías: ' + error.message
      };
    }
  }

  /**
   * Obtener categoría por ID
   * @param {string} categoryId - ID de la categoría
   * @returns {Promise<Object>} - Datos de la categoría
   */
  async getCategory(categoryId) {
    try {
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Verificar si es una categoría predeterminada
      const defaultCategory = DEFAULT_PRODUCT_CATEGORIES.find(cat => cat.id === categoryId);
      if (defaultCategory) {
        return {
          success: true,
          data: defaultCategory
        };
      }

      const result = await this.callEndpoint('sqlGetProductCategory', { categoryId });
      return result;
    } catch (error) {
      console.error('Error obteniendo categoría de producto:', error);
      return {
        success: false,
        error: 'Error al obtener la categoría: ' + error.message
      };
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

      // No permitir editar categorías predeterminadas
      const isDefault = DEFAULT_PRODUCT_CATEGORIES.some(cat => cat.id === categoryId);
      if (isDefault) {
        return {
          success: false,
          error: 'No se pueden editar las categorías predeterminadas'
        };
      }

      const result = await this.callEndpoint('sqlUpdateProductCategory', {
        categoryId,
        updateData: {
          ...updateData,
          updatedBy: this.getCurrentUser()?.uid
        }
      });

      return result;
    } catch (error) {
      console.error('Error actualizando categoría de producto:', error);
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
      if (!this.isAuthenticated()) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      // No permitir eliminar categorías predeterminadas
      const isDefault = DEFAULT_PRODUCT_CATEGORIES.some(cat => cat.id === categoryId);
      if (isDefault) {
        return {
          success: false,
          error: 'No se pueden eliminar las categorías predeterminadas'
        };
      }

      const result = await this.callEndpoint('sqlDeleteProductCategory', { categoryId });
      return result;
    } catch (error) {
      console.error('Error eliminando categoría de producto:', error);
      return {
        success: false,
        error: 'Error al eliminar la categoría: ' + error.message
      };
    }
  }

  /**
   * Obtener categorías activas
   * @returns {Promise<Object>} - Lista de categorías activas
   */
  async getActiveCategories() {
    try {
      const result = await this.getAllCategories();
      
      if (result.success && result.data) {
        const activeCategories = result.data.filter(category => category.isActive !== false);
        return {
          success: true,
          data: activeCategories
        };
      }

      return result;
    } catch (error) {
      console.error('Error obteniendo categorías activas:', error);
      return {
        success: false,
        error: 'Error al obtener categorías activas: ' + error.message
      };
    }
  }

  /**
   * Suscribirse a cambios en categorías (compatibilidad)
   * @param {Function} callback - Función de callback
   * @returns {Function} - Función para cancelar suscripción
   */
  subscribeToCategories(callback) {
    let intervalId;
    
    const fetchAndNotify = async () => {
      try {
        const result = await this.getAllCategories();
        if (result.success) {
          callback(result.data || []);
        }
      } catch (error) {
        console.error('Error en suscripción a categorías:', error);
      }
    };

    // Llamada inicial
    fetchAndNotify();
    
    // Polling cada 30 segundos para cambios
    intervalId = setInterval(fetchAndNotify, 30000);
    
    // Retornar función de limpieza
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }
}

export default FirebaseProductCategoriesService;

// Funciones de compatibilidad con el servicio anterior
export const createCategory = async (categoryData) => {
  const service = new FirebaseProductCategoriesService();
  return service.createCategory(categoryData);
};

export const getAllCategories = async () => {
  const service = new FirebaseProductCategoriesService();
  return service.getAllCategories();
};

export const getCategory = async (categoryId) => {
  const service = new FirebaseProductCategoriesService();
  return service.getCategory(categoryId);
};

export const updateCategory = async (categoryId, updateData) => {
  const service = new FirebaseProductCategoriesService();
  return service.updateCategory(categoryId, updateData);
};

export const deleteCategory = async (categoryId) => {
  const service = new FirebaseProductCategoriesService();
  return service.deleteCategory(categoryId);
};

export const getActiveCategories = async () => {
  const service = new FirebaseProductCategoriesService();
  return service.getActiveCategories();
};

export const subscribeToCategories = (callback) => {
  const service = new FirebaseProductCategoriesService();
  return service.subscribeToCategories(callback);
};

// Campos disponibles para categorías personalizadas
export const AVAILABLE_FIELDS = [
  { key: 'name', label: 'Nombre', type: 'text', required: true },
  { key: 'description', label: 'Descripción', type: 'textarea', required: false },
  { key: 'icon', label: 'Icono', type: 'text', required: false },
  { key: 'color', label: 'Color', type: 'color', required: false },
  { key: 'isActive', label: 'Activa', type: 'boolean', required: false }
];

export const generateCategoryId = (name, existingCategories = []) => {
  if (!name) return '';
  
  // Convertir a formato de ID: minúsculas, sin espacios, sin caracteres especiales
  let baseId = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9]/g, '') // Solo letras y números
    .substring(0, 20); // Máximo 20 caracteres

  // Verificar que no exista ya
  const existingIds = existingCategories.map(cat => cat.id);
  let finalId = baseId;
  let counter = 1;

  while (existingIds.includes(finalId)) {
    finalId = `${baseId}${counter}`;
    counter++;
  }

  return finalId;
};

export const getAllProductCategories = async () => {
  const service = new FirebaseProductCategoriesService();
  return service.getAllCategories();
};

export const getCategoryStats = async () => {
  // Esta función necesitaría implementación específica en el servicio
  // Por ahora retornamos un resultado vacío
  return {
    success: true,
    data: []
  };
};

export const getCategoryById = async (categoryId) => {
  const service = new FirebaseProductCategoriesService();
  return service.getCategory(categoryId);
};

export const initializeDefaultCategories = async () => {
  // Las categorías por defecto ya están definidas en DEFAULT_PRODUCT_CATEGORIES
  return {
    success: true,
    message: 'Categorías por defecto ya están disponibles'
  };
};