/**
 * CloudRunProductsService - Servicio de productos usando Cloud Run SQL endpoints
 * Reemplaza productsService para usar endpoints SQL migrados
 * Forestech Combustibles App
 */

import HttpService from './base/HttpService.js';

class FirebaseProductsService extends HttpService {
  constructor() {
    super();
  }

  /**
   * Crear un nuevo producto
   * @param {Object} productData - Datos del producto
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async createProduct(productData) {
    try {
      if (!(await this.isAuthenticated())) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.callEndpoint('sqlCreateProduct', {
        productData: {
          ...productData,
          createdBy: (await this.getCurrentUser())?.uid
        }
      });

      return result;
    } catch (error) {
      console.error('Error creando producto:', error);
      return {
        success: false,
        error: 'Error al crear el producto: ' + error.message
      };
    }
  }

  /**
   * Obtener todos los productos
   * @param {Object} filters - Filtros opcionales
   * @returns {Promise<Array>} - Lista de productos
   */
  async getAllProducts(filters = {}) {
    try {
      const result = await this.callEndpoint('sqlGetAllProducts', { filters });

      if (result.success && result.data) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      throw error;
    }
  }

  /**
   * Obtener producto por ID
   * @param {string} productId - ID del producto
   * @returns {Promise<Object|null>} - Producto encontrado
   */
  async getProduct(productId) {
    try {
      const result = await this.callEndpoint('sqlGetProduct', { productId });

      if (result.success && result.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      throw error;
    }
  }

  /**
   * Actualizar producto
   * @param {string} productId - ID del producto
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateProduct(productId, updateData) {
    try {
      if (!(await this.isAuthenticated())) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.callEndpoint('sqlUpdateProduct', {
        productId,
        updateData: {
          ...updateData,
          updatedBy: (await this.getCurrentUser())?.uid
        }
      });

      return result;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      return {
        success: false,
        error: 'Error al actualizar el producto: ' + error.message
      };
    }
  }

  /**
   * Eliminar producto
   * @param {string} productId - ID del producto
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async deleteProduct(productId) {
    try {
      const result = await this.callEndpoint('sqlDeleteProduct', { productId });
      return result;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      return {
        success: false,
        error: 'Error al eliminar el producto: ' + error.message
      };
    }
  }

  /**
   * Obtener productos por categoría
   * @param {string} category - Categoría del producto
   * @returns {Promise<Array>} - Lista de productos
   */
  async getProductsByCategory(category) {
    try {
      const result = await this.callEndpoint('sqlGetProductsByCategory', { category });

      if (result.success && result.data) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo productos por categoría:', error);
      throw error;
    }
  }

  /**
   * Obtener productos activos
   * @returns {Promise<Array>} - Lista de productos activos
   */
  async getActiveProducts() {
    try {
      const result = await this.callEndpoint('sqlGetActiveProducts');

      if (result.success && result.data) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo productos activos:', error);
      throw error;
    }
  }

  /**
   * Suscribirse a cambios en productos
   * @param {Function} callback - Función de callback
   * @returns {Function} - Función para cancelar suscripción
   */
  subscribeToProducts(callback) {
    let isActive = true;

    const poll = async () => {
      if (!isActive) return;

      try {
        const data = await this.getAllProducts();
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
   * Actualizar stock de producto
   * @param {string} productId - ID del producto
   * @param {number} newStock - Nuevo stock
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateProductStock(productId, newStock) {
    try {
      if (!(await this.isAuthenticated())) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const result = await this.callEndpoint('sqlUpdateProductStock', {
        productId,
        newStock
      });

      return result;
    } catch (error) {
      console.error('Error actualizando stock de producto:', error);
      return {
        success: false,
        error: 'Error al actualizar el stock: ' + error.message
      };
    }
  }

  /**
   * Buscar productos por término
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Array>} - Lista de productos encontrados
   */
  async searchProducts(searchTerm) {
    try {
      const result = await this.callEndpoint('sqlSearchProducts', { searchTerm });

      if (result.success && result.data) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error('Error buscando productos:', error);
      throw error;
    }
  }

  /**
   * Obtener productos con stock bajo
   * @returns {Promise<Array>} - Lista de productos con stock bajo
   */
  async getLowStockProducts() {
    try {
      const result = await this.callEndpoint('sqlGetLowStockProducts');

      if (result.success && result.data) {
        return result.data;
      }

      return [];
    } catch (error) {
      console.error('Error obteniendo productos con stock bajo:', error);
      throw error;
    }
  }

  /**
   * Obtener producto por código
   * @param {string} productCode - Código del producto
   * @returns {Promise<Object|null>} - Producto encontrado o null
   */
  async getProductByCode(productCode) {
    try {
      const result = await this.callEndpoint('sqlGetProductByCode', { productCode });

      if (result.success && result.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo producto por código:', error);
      throw error;
    }
  }
}

export default FirebaseProductsService;

// Funciones de compatibilidad con el servicio anterior
export const createProduct = async (productData) => {
  const service = new FirebaseProductsService();
  return service.createProduct(productData);
};

export const getAllProducts = async (filters = {}) => {
  const service = new FirebaseProductsService();
  return service.getAllProducts(filters);
};

export const getProduct = async (productId) => {
  const service = new FirebaseProductsService();
  return service.getProduct(productId);
};

export const updateProduct = async (productId, updateData) => {
  const service = new FirebaseProductsService();
  return service.updateProduct(productId, updateData);
};

export const deleteProduct = async (productId) => {
  const service = new FirebaseProductsService();
  return service.deleteProduct(productId);
};

export const getProductsByCategory = async (category) => {
  const service = new FirebaseProductsService();
  return service.getProductsByCategory(category);
};

export const getActiveProducts = async () => {
  const service = new FirebaseProductsService();
  return service.getActiveProducts();
};

export const subscribeToProducts = (callback) => {
  const service = new FirebaseProductsService();
  return service.subscribeToProducts(callback);
};

export const updateProductStock = async (productId, newStock) => {
  const service = new FirebaseProductsService();
  return service.updateProductStock(productId, newStock);
};

export const searchProducts = async (searchTerm) => {
  const service = new FirebaseProductsService();
  return service.searchProducts(searchTerm);
};

export const getLowStockProducts = async () => {
  const service = new FirebaseProductsService();
  return service.getLowStockProducts();
};

export const getProductByCode = async (productCode) => {
  const service = new FirebaseProductsService();
  return service.getProductByCode(productCode);
};