/**
 * SqlVehicleCategoriesService - Servicio de categorías de vehículos usando Azure SQL Server
 * Migración completa del vehicleCategoriesService original
 * Forestech Combustibles App
 */

import SqlCrudService from './base/SqlCrudService.js';
import sqlConnection from './base/SqlConnection.js';

const TABLE_NAME = 'combustibles_vehicle_categories';

// Tipos de categoría
export const CATEGORY_TYPES = {
  VEHICLE: 'vehicle',
  MACHINERY: 'machinery',
  EQUIPMENT: 'equipment',
  TRANSPORT: 'transport',
};

class SqlVehicleCategoriesService extends SqlCrudService {
  constructor() {
    super(TABLE_NAME, 'categorías de vehículos');
  }

  /**
   * CRUD OPERATIONS - CREATE
   */

  /**
   * Crear nueva categoría de vehículo
   * @param {Object} categoryData - Datos de la categoría
   * @param {string} createdBy - Usuario que crea la categoría
   * @returns {Object} - Resultado de la operación
   */
  async createCategory(categoryData, createdBy) {
    try {
      // Validar datos requeridos
      if (!categoryData.name) {
        return { success: false, error: 'El nombre de la categoría es requerido' };
      }

      // Verificar que el nombre sea único
      const existingQuery = `
        SELECT TOP 1 id FROM ${TABLE_NAME} WHERE name = @name
      `;

      const pool = await sqlConnection.getConnection();
      const existingResult = await pool.request()
        .input('name', categoryData.name.trim())
        .query(existingQuery);

      if (existingResult.recordset.length > 0) {
        return { 
          success: false, 
          error: `Ya existe una categoría con el nombre: ${categoryData.name}` 
        };
      }

      // Verificar código único si se proporciona
      if (categoryData.code) {
        const existingCodeQuery = `
          SELECT TOP 1 id FROM ${TABLE_NAME} WHERE code = @code
        `;

        const existingCodeResult = await pool.request()
          .input('code', categoryData.code.trim().toUpperCase())
          .query(existingCodeQuery);

        if (existingCodeResult.recordset.length > 0) {
          return { 
            success: false, 
            error: `Ya existe una categoría con el código: ${categoryData.code}` 
          };
        }
      }

      // Generar código automático si no se proporciona
      const code = categoryData.code || this.generateCategoryCode(categoryData.name);

      // Obtener el siguiente sortOrder
      const sortOrderQuery = `
        SELECT ISNULL(MAX(sortOrder), 0) + 1 as nextSortOrder FROM ${TABLE_NAME}
      `;
      const sortOrderResult = await pool.request().query(sortOrderQuery);
      const nextSortOrder = sortOrderResult.recordset[0].nextSortOrder;

      // Preparar datos de la categoría
      const category = {
        name: categoryData.name.trim(),
        code: code.toUpperCase(),
        description: categoryData.description || '',
        type: categoryData.type || CATEGORY_TYPES.VEHICLE,
        icon: categoryData.icon || 'vehicle',
        color: categoryData.color || '#4F46E5',
        customFields: JSON.stringify(categoryData.customFields || {}),
        defaultFuelType: categoryData.defaultFuelType || 'DIESEL',
        estimatedConsumption: categoryData.estimatedConsumption || 0,
        isActive: categoryData.isActive !== false,
        sortOrder: categoryData.sortOrder || nextSortOrder,
        vehicleCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: createdBy,
        updatedBy: createdBy,
      };

      const result = await this.create(category);
      
      return {
        success: true,
        data: result,
        message: `Categoría ${categoryData.name} creada exitosamente`,
      };

    } catch (error) {
      console.error('Error creando categoría:', error);
      return { 
        success: false, 
        error: 'Error al crear la categoría: ' + error.message 
      };
    }
  }

  /**
   * CRUD OPERATIONS - READ
   */

  /**
   * Obtener todas las categorías
   * @param {Object} options - Opciones de filtrado
   * @returns {Array} - Lista de categorías
   */
  async getCategories(options = {}) {
    try {
      let query = `SELECT * FROM ${TABLE_NAME}`;
      const conditions = [];
      const pool = await sqlConnection.getConnection();
      const request = pool.request();

      // Filtros opcionales
      if (options.isActive !== undefined) {
        conditions.push('isActive = @isActive');
        request.input('isActive', options.isActive);
      }

      if (options.type) {
        conditions.push('type = @type');
        request.input('type', options.type);
      }

      if (options.search) {
        conditions.push('(name LIKE @search OR code LIKE @search OR description LIKE @search)');
        request.input('search', `%${options.search}%`);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ` ORDER BY sortOrder, name`;

      const result = await request.query(query);
      
      // Procesar datos de respuesta
      return result.recordset.map(category => ({
        ...category,
        customFields: this.parseJSON(category.customFields),
      }));

    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      throw error;
    }
  }

  /**
   * Obtener categoría por código
   * @param {string} code - Código de la categoría
   * @returns {Object} - Datos de la categoría
   */
  async getCategoryByCode(code) {
    try {
      const query = `SELECT * FROM ${TABLE_NAME} WHERE code = @code`;
      const pool = await sqlConnection.getConnection();
      const result = await pool.request()
        .input('code', code.toUpperCase())
        .query(query);

      if (result.recordset.length === 0) {
        return null;
      }

      const category = result.recordset[0];
      return {
        ...category,
        customFields: this.parseJSON(category.customFields),
      };

    } catch (error) {
      console.error('Error obteniendo categoría por código:', error);
      throw error;
    }
  }

  /**
   * CRUD OPERATIONS - UPDATE
   */

  /**
   * Actualizar categoría
   * @param {string} categoryId - ID de la categoría
   * @param {Object} updateData - Datos a actualizar
   * @param {string} updatedBy - Usuario que actualiza
   * @returns {Object} - Resultado de la operación
   */
  async updateCategory(categoryId, updateData, updatedBy) {
    try {
      // Preparar datos de actualización
      const updateItem = {
        ...updateData,
        updatedBy: updatedBy,
        updatedAt: new Date(),
      };

      // Procesar customFields como JSON
      if (updateItem.customFields && typeof updateItem.customFields === 'object') {
        updateItem.customFields = JSON.stringify(updateItem.customFields);
      }

      // Verificar unicidad del nombre si se actualiza
      if (updateItem.name) {
        const existingQuery = `
          SELECT TOP 1 id FROM ${TABLE_NAME} WHERE name = @name AND id != @id
        `;

        const pool = await sqlConnection.getConnection();
        const existingResult = await pool.request()
          .input('name', updateItem.name.trim())
          .input('id', categoryId)
          .query(existingQuery);

        if (existingResult.recordset.length > 0) {
          return { 
            success: false, 
            error: `Ya existe una categoría con el nombre: ${updateItem.name}` 
          };
        }
      }

      // Verificar unicidad del código si se actualiza
      if (updateItem.code) {
        const existingCodeQuery = `
          SELECT TOP 1 id FROM ${TABLE_NAME} WHERE code = @code AND id != @id
        `;

        const pool = await sqlConnection.getConnection();
        const existingCodeResult = await pool.request()
          .input('code', updateItem.code.trim().toUpperCase())
          .input('id', categoryId)
          .query(existingCodeQuery);

        if (existingCodeResult.recordset.length > 0) {
          return { 
            success: false, 
            error: `Ya existe una categoría con el código: ${updateItem.code}` 
          };
        }

        updateItem.code = updateItem.code.toUpperCase();
      }

      const result = await this.update(categoryId, updateItem);
      
      return {
        success: true,
        data: result,
        message: 'Categoría actualizada exitosamente',
      };

    } catch (error) {
      console.error('Error actualizando categoría:', error);
      return { 
        success: false, 
        error: 'Error al actualizar la categoría: ' + error.message 
      };
    }
  }

  /**
   * Actualizar contador de vehículos
   * @param {string} categoryId - ID de la categoría
   * @param {number} increment - Incremento/decremento del contador
   * @returns {Object} - Resultado de la operación
   */
  async updateVehicleCount(categoryId, increment = 1) {
    try {
      const query = `
        UPDATE ${TABLE_NAME} 
        SET vehicleCount = vehicleCount + @increment,
            updatedAt = @updatedAt
        WHERE id = @categoryId
      `;

      const pool = await sqlConnection.getConnection();
      await pool.request()
        .input('categoryId', categoryId)
        .input('increment', increment)
        .input('updatedAt', new Date())
        .query(query);

      return { success: true, message: 'Contador actualizado exitosamente' };

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
   * @returns {Object} - Resultado de la operación
   */
  async reorderCategories(categoryOrders) {
    try {
      const pool = await sqlConnection.getConnection();
      
      for (const { id, sortOrder } of categoryOrders) {
        const query = `
          UPDATE ${TABLE_NAME} 
          SET sortOrder = @sortOrder, updatedAt = @updatedAt
          WHERE id = @id
        `;

        await pool.request()
          .input('id', id)
          .input('sortOrder', sortOrder)
          .input('updatedAt', new Date())
          .query(query);
      }

      return { success: true, message: 'Categorías reordenadas exitosamente' };

    } catch (error) {
      console.error('Error reordenando categorías:', error);
      return { 
        success: false, 
        error: 'Error al reordenar las categorías: ' + error.message 
      };
    }
  }

  /**
   * CRUD OPERATIONS - DELETE
   */

  /**
   * Eliminar categoría
   * @param {string} categoryId - ID de la categoría
   * @returns {Object} - Resultado de la operación
   */
  async deleteCategory(categoryId) {
    try {
      // Verificar que no tenga vehículos asociados
      const category = await this.getById(categoryId);
      if (category && category.vehicleCount > 0) {
        return { 
          success: false, 
          error: 'No se puede eliminar una categoría que tiene vehículos asociados. Considere desactivarla.' 
        };
      }

      await this.delete(categoryId);
      
      return {
        success: true,
        message: 'Categoría eliminada exitosamente',
      };

    } catch (error) {
      console.error('Error eliminando categoría:', error);
      return { 
        success: false, 
        error: 'Error al eliminar la categoría: ' + error.message 
      };
    }
  }

  /**
   * SUSCRIPCIONES Y UTILIDADES
   */

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
        const data = await this.getCategories();
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
   * Obtener categorías activas
   * @returns {Array} - Lista de categorías activas
   */
  async getActiveCategories() {
    try {
      return await this.getCategories({ isActive: true });
    } catch (error) {
      console.error('Error obteniendo categorías activas:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de categorías
   * @returns {Object} - Estadísticas de categorías
   */
  async getCategoryStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as totalCategories,
          COUNT(CASE WHEN isActive = 1 THEN 1 END) as activeCategories,
          SUM(vehicleCount) as totalVehicles,
          AVG(CAST(vehicleCount as FLOAT)) as avgVehiclesPerCategory,
          COUNT(DISTINCT type) as uniqueTypes
        FROM ${TABLE_NAME}
      `;

      const pool = await sqlConnection.getConnection();
      const result = await pool.request().query(query);
      
      return result.recordset[0];

    } catch (error) {
      console.error('Error obteniendo estadísticas de categorías:', error);
      throw error;
    }
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

export default SqlVehicleCategoriesService;

// Funciones de compatibilidad con el servicio anterior
export const createCategory = async (categoryData, createdBy) => {
  const service = new SqlVehicleCategoriesService();
  return service.createCategory(categoryData, createdBy);
};

export const subscribeToCategories = (callback) => {
  const service = new SqlVehicleCategoriesService();
  return service.subscribeToCategories(callback);
};

export const updateCategory = async (categoryId, updateData, updatedBy) => {
  const service = new SqlVehicleCategoriesService();
  return service.updateCategory(categoryId, updateData, updatedBy);
};

export const deleteCategory = async (categoryId) => {
  const service = new SqlVehicleCategoriesService();
  return service.deleteCategory(categoryId);
};

export const getCategoryByCode = async (code) => {
  const service = new SqlVehicleCategoriesService();
  return service.getCategoryByCode(code);
};