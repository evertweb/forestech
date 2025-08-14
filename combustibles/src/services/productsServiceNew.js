/**
 * ProductsService - Servicio refactorizado para gestión de productos/combustibles
 * Utiliza BaseService y CRUDService para operaciones optimizadas
 *
 * Forestech Colombia - Combustibles App
 * @author AI Agent - TASK 1.2 BaseService Implementation
 * @date 2025-01-04
 */

import { CRUDService } from './base/CRUDService.js';

/**
 * ProductsService - Servicio especializado para productos/combustibles
 */
class ProductsService extends CRUDService {
  constructor() {
    super('combustibles_products', {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'name',
      defaultOrderDirection: 'asc',
    });
  }

  /**
   * Validación específica para datos de productos
   * @param {Object} data - Datos del producto
   * @returns {Object} - Resultado de validación
   */
  validateData(data) {
    const baseValidation = super.validateData(data);
    if (!baseValidation.isValid) {
      return baseValidation;
    }

    const errors = [];

    // Validaciones requeridas
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('El nombre del producto es requerido');
    }

    if (!data.type || typeof data.type !== 'string' || data.type.trim().length === 0) {
      errors.push('El tipo de producto es requerido');
    }

    // Validar precio
    if (data.price !== undefined) {
      const price = Number(data.price);
      if (isNaN(price) || price < 0) {
        errors.push('El precio debe ser un número positivo o cero');
      }
    }

    // Validar cantidad mínima
    if (data.minQuantity !== undefined) {
      const minQty = Number(data.minQuantity);
      if (isNaN(minQty) || minQty < 0) {
        errors.push('La cantidad mínima debe ser un número positivo o cero');
      }
    }

    // Validar densidad si se proporciona
    if (data.density !== undefined) {
      const density = Number(data.density);
      if (isNaN(density) || density <= 0) {
        errors.push('La densidad debe ser un número positivo');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Procesar datos específicos de productos
   * @param {Object} data - Datos originales
   * @param {boolean} isUpdate - Si es actualización
   * @returns {Object} - Datos procesados
   */
  processData(data, isUpdate = false) {
    const baseProcessed = super.processData(data, isUpdate);

    // Limpiar y normalizar strings
    if (baseProcessed.name) {
      baseProcessed.name = baseProcessed.name.trim();
    }
    if (baseProcessed.type) {
      baseProcessed.type = baseProcessed.type.trim();
    }
    if (baseProcessed.description) {
      baseProcessed.description = baseProcessed.description.trim();
    }
    if (baseProcessed.unit) {
      baseProcessed.unit = baseProcessed.unit.trim().toLowerCase();
    }

    // Convertir números
    if (baseProcessed.price !== undefined) {
      baseProcessed.price = Number(baseProcessed.price);
    }
    if (baseProcessed.minQuantity !== undefined) {
      baseProcessed.minQuantity = Number(baseProcessed.minQuantity);
    }
    if (baseProcessed.density !== undefined) {
      baseProcessed.density = Number(baseProcessed.density);
    }

    // Establecer valores por defecto solo en creación
    if (!isUpdate) {
      baseProcessed.status = baseProcessed.status || 'active';
      baseProcessed.unit = baseProcessed.unit || 'litros';
      baseProcessed.category = baseProcessed.category || 'combustible';
      baseProcessed.minQuantity = baseProcessed.minQuantity || 0;
      baseProcessed.isActive = baseProcessed.isActive !== false; // default true

      // Propiedades específicas de combustibles
      if (baseProcessed.category === 'combustible') {
        baseProcessed.octaneRating = baseProcessed.octaneRating || null;
        baseProcessed.cetaneNumber = baseProcessed.cetaneNumber || null;
        baseProcessed.flashPoint = baseProcessed.flashPoint || null;
        baseProcessed.viscosity = baseProcessed.viscosity || null;
      }
    }

    return baseProcessed;
  }

  /**
   * Crear nuevo producto con validación de duplicados
   * @param {Object} productData - Datos del producto
   * @param {string} createdBy - Usuario que crea
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async createProduct(productData, createdBy = 'system') {
    // Agregar metadatos de auditoría
    const dataWithAudit = {
      ...productData,
      createdBy,
      updatedBy: createdBy,
    };

    // Crear usando el método base con validación de nombre
    const result = await this.create(dataWithAudit, {
      duplicateField: 'name',
    });

    if (result.success) {
      this.logOperation('CREATE_PRODUCT', result.id, {
        productName: productData.name,
        productType: productData.type,
        createdBy,
      });
    }

    return result;
  }

  /**
   * Obtener todos los productos
   * @param {Object} options - Opciones de consulta
   * @returns {Promise<Object>} - Lista de productos
   */
  async getAllProducts(options = {}) {
    return await this.getAll({
      orderBy: 'name',
      orderDirection: 'asc',
      ...options,
    });
  }

  /**
   * Obtener producto por ID
   * @param {string} productId - ID del producto
   * @returns {Promise<Object>} - Datos del producto
   */
  async getProduct(productId) {
    return await this.getById(productId);
  }

  /**
   * Actualizar producto
   * @param {string} productId - ID del producto
   * @param {Object} updateData - Datos a actualizar
   * @param {string} updatedBy - Usuario que actualiza
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateProduct(productId, updateData, updatedBy = 'system') {
    const dataWithAudit = {
      ...updateData,
      updatedBy,
    };

    const result = await this.update(productId, dataWithAudit, {
      duplicateField: updateData.name ? 'name' : null,
    });

    if (result.success) {
      this.logOperation('UPDATE_PRODUCT', productId, {
        updatedBy,
        fieldsUpdated: Object.keys(updateData),
      });
    }

    return result;
  }

  /**
   * Eliminar producto
   * @param {string} productId - ID del producto
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async deleteProduct(productId) {
    const result = await this.delete(productId);

    if (result.success) {
      this.logOperation('DELETE_PRODUCT', productId);
    }

    return result;
  }

  /**
   * Obtener productos activos
   * @returns {Promise<Object>} - Lista de productos activos
   */
  async getActiveProducts() {
    return await this.find(
      {
        status: 'active',
        isActive: true,
      },
      {
        orderBy: 'name',
        orderDirection: 'asc',
      }
    );
  }

  /**
   * Obtener productos por tipo
   * @param {string} type - Tipo de producto
   * @returns {Promise<Object>} - Lista de productos
   */
  async getProductsByType(type) {
    return await this.find(
      { type },
      {
        orderBy: 'name',
        orderDirection: 'asc',
      }
    );
  }

  /**
   * Obtener productos por categoría
   * @param {string} category - Categoría del producto
   * @returns {Promise<Object>} - Lista de productos
   */
  async getProductsByCategory(category) {
    return await this.find(
      { category },
      {
        orderBy: 'name',
        orderDirection: 'asc',
      }
    );
  }

  /**
   * Buscar productos por término
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Object>} - Resultados de búsqueda
   */
  async searchProducts(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return await this.getAllProducts();
    }

    // Buscar por nombre
    const nameResults = await this.getAll({
      filters: [
        { field: 'name', operator: '>=', value: searchTerm },
        { field: 'name', operator: '<=', value: searchTerm + '\uf8ff' },
      ],
    });

    // Buscar por tipo
    const typeResults = await this.getAll({
      filters: [
        { field: 'type', operator: '>=', value: searchTerm },
        { field: 'type', operator: '<=', value: searchTerm + '\uf8ff' },
      ],
    });

    // Combinar resultados sin duplicados
    const combined = new Map();

    if (nameResults.success) {
      nameResults.data.forEach((product) => combined.set(product.id, product));
    }

    if (typeResults.success) {
      typeResults.data.forEach((product) => combined.set(product.id, product));
    }

    return {
      success: true,
      data: Array.from(combined.values()),
      count: combined.size,
    };
  }

  /**
   * Obtener productos con stock bajo
   * @param {number} threshold - Umbral mínimo
   * @returns {Promise<Object>} - Lista de productos con stock bajo
   */
  async getLowStockProducts(threshold = null) {
    const allProducts = await this.getActiveProducts();

    if (!allProducts.success) {
      return allProducts;
    }

    const lowStockProducts = allProducts.data.filter((product) => {
      const minQty = threshold !== null ? threshold : product.minQuantity || 0;
      const currentQty = product.currentQuantity || 0;
      return currentQty <= minQty;
    });

    return {
      success: true,
      data: lowStockProducts,
      count: lowStockProducts.length,
    };
  }

  /**
   * Actualizar precio de producto
   * @param {string} productId - ID del producto
   * @param {number} newPrice - Nuevo precio
   * @param {string} updatedBy - Usuario que actualiza
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async updateProductPrice(productId, newPrice, updatedBy = 'system') {
    const price = Number(newPrice);
    if (isNaN(price) || price < 0) {
      return {
        success: false,
        error: 'El precio debe ser un número positivo',
      };
    }

    const result = await this.updateProduct(
      productId,
      {
        price,
        lastPriceUpdate: new Date(),
      },
      updatedBy
    );

    if (result.success) {
      this.logOperation('UPDATE_PRODUCT_PRICE', productId, {
        newPrice: price,
        updatedBy,
      });
    }

    return result;
  }

  /**
   * Cambiar estado de producto
   * @param {string} productId - ID del producto
   * @param {string} newStatus - Nuevo estado
   * @param {string} updatedBy - Usuario que actualiza
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async changeProductStatus(productId, newStatus, updatedBy = 'system') {
    const validStatuses = ['active', 'inactive', 'discontinued'];
    if (!validStatuses.includes(newStatus)) {
      return {
        success: false,
        error: `Estado inválido: ${newStatus}. Estados válidos: ${validStatuses.join(', ')}`,
      };
    }

    const result = await this.updateProduct(
      productId,
      {
        status: newStatus,
        isActive: newStatus === 'active',
        statusChangedAt: new Date(),
      },
      updatedBy
    );

    if (result.success) {
      this.logOperation('CHANGE_PRODUCT_STATUS', productId, {
        newStatus,
        updatedBy,
      });
    }

    return result;
  }

  /**
   * Escuchar cambios en productos en tiempo real
   * @param {Function} callback - Callback para cambios
   * @param {Object} options - Opciones de consulta
   * @returns {Function} - Función para cancelar suscripción
   */
  listenToProducts(callback, options = {}) {
    return this.listen(callback, {
      orderBy: 'name',
      orderDirection: 'asc',
      ...options,
    });
  }

  /**
   * Inicializar productos por defecto
   * @returns {Promise<Object>} - Resultado de la operación
   */
  async initializeDefaultProducts() {
    const defaultProducts = [
      {
        name: 'DIESEL Común',
        type: 'DIESEL',
        category: 'combustible',
        description: 'Combustible diesel estándar para maquinaria pesada',
        unit: 'litros',
        density: 0.832,
        cetaneNumber: 45,
        price: 2800,
      },
      {
        name: 'Gasolina Corriente',
        type: 'Gasolina',
        category: 'combustible',
        description: 'Gasolina octanaje 87 para vehículos livianos',
        unit: 'litros',
        density: 0.745,
        octaneRating: 87,
        price: 3200,
      },
      {
        name: 'Aceite Motor 15W-40',
        type: 'Lubricante',
        category: 'lubricante',
        description: 'Aceite multigrado para motores diesel',
        unit: 'litros',
        density: 0.875,
        price: 15000,
      },
    ];

    const results = [];

    for (const product of defaultProducts) {
      // Verificar si ya existe
      const existing = await this.find({ name: product.name });

      if (existing.success && existing.data.length === 0) {
        const result = await this.createProduct(product, 'system');
        results.push(result);
      } else {
        results.push({
          success: true,
          message: `Producto "${product.name}" ya existe`,
          skipped: true,
        });
      }
    }

    return {
      success: true,
      results,
      message: `Inicialización completada. ${results.filter((r) => !r.skipped).length} productos creados.`,
    };
  }
}

// Crear y exportar instancia singleton
const productsService = new ProductsService();

// Exportar métodos para compatibilidad con código existente
export const createProduct = (data, createdBy) => productsService.createProduct(data, createdBy);
export const getAllProducts = (options) => productsService.getAllProducts(options);
export const getProduct = (id) => productsService.getProduct(id);
export const updateProduct = (id, data, updatedBy) =>
  productsService.updateProduct(id, data, updatedBy);
export const deleteProduct = (id) => productsService.deleteProduct(id);
export const getActiveProducts = () => productsService.getActiveProducts();
export const getProductsByType = (type) => productsService.getProductsByType(type);
export const getProductsByCategory = (category) => productsService.getProductsByCategory(category);
export const searchProducts = (searchTerm) => productsService.searchProducts(searchTerm);
export const getLowStockProducts = (threshold) => productsService.getLowStockProducts(threshold);
export const updateProductPrice = (id, price, updatedBy) =>
  productsService.updateProductPrice(id, price, updatedBy);
export const changeProductStatus = (id, status, updatedBy) =>
  productsService.changeProductStatus(id, status, updatedBy);
export const listenToProducts = (callback, options) =>
  productsService.listenToProducts(callback, options);
export const initializeDefaultProducts = () => productsService.initializeDefaultProducts();

// Exportar servicio para uso avanzado
export { productsService };
export default productsService;
