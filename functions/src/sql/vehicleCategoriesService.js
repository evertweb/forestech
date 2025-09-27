/**
 * vehicleCategoriesService.js - Servicio de categorías de vehículos usando Azure SQL Server en Firebase Functions
 * Migrado desde combustibles/src/services/SqlVehicleCategoriesService.js
 * Forestech Combustibles App - TASK-006
 */

import sqlConnection from './SqlConnection.js';

const TABLE_NAME = 'combustibles_vehicle_categories';

// Tipos de categoría
export const CATEGORY_TYPES = {
  VEHICLE: 'vehicle',
  MACHINERY: 'machinery',
  EQUIPMENT: 'equipment',
  TRANSPORT: 'transport',
};

/**
 * Crear nueva categoría de vehículo
 * @param {Object} categoryData - Datos de la categoría
 * @param {Object} userInfo - Información del usuario
 * @returns {Promise<Object>} - Resultado de la operación {success, id/data, error}
 */
export async function createCategory(categoryData, userInfo = null) {
  try {
    console.log('🚀 Iniciando creación de categoría SQL en Functions:', categoryData);

    // Validar datos requeridos
    if (!categoryData.name || categoryData.name.trim().length === 0) {
      return { success: false, error: 'El nombre de la categoría es requerido' };
    }

    // Verificar que el nombre sea único
    const existingQuery = `
      SELECT TOP 1 id FROM ${TABLE_NAME} WHERE name = @name
    `;

    const existingResult = await sqlConnection.query(existingQuery, {
      name: categoryData.name.trim()
    });

    if (existingResult.length > 0) {
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

      const existingCodeResult = await sqlConnection.query(existingCodeQuery, {
        code: categoryData.code.trim().toUpperCase()
      });

      if (existingCodeResult.length > 0) {
        return {
          success: false,
          error: `Ya existe una categoría con el código: ${categoryData.code}`
        };
      }
    }

    // Generar código automático si no se proporciona
    const code = categoryData.code || generateCategoryCode(categoryData.name);

    // Obtener el siguiente sortOrder
    const sortOrderQuery = `
      SELECT ISNULL(MAX(sortOrder), 0) + 1 as nextSortOrder FROM ${TABLE_NAME}
    `;
    const sortOrderResult = await sqlConnection.query(sortOrderQuery);
    const nextSortOrder = sortOrderResult[0].nextSortOrder;

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
      createdBy: userInfo?.email || 'unknown',
      updatedBy: userInfo?.email || 'unknown',
    };

    // Crear categoría en transacción
    const result = await sqlConnection.transaction(async (transaction) => {
      const columns = Object.keys(category);
      const values = columns.map((_, index) => `@param${index}`);
      const insertQuery = `
        INSERT INTO ${TABLE_NAME} (${columns.join(', ')})
        VALUES (${values.join(', ')});
        SELECT SCOPE_IDENTITY() as id;
      `;

      const insertRequest = transaction.request();
      columns.forEach((col, index) => {
        insertRequest.input(`param${index}`, category[col]);
      });
      const createResult = await insertRequest.query(insertQuery);
      const categoryId = createResult.recordset[0]?.id;

      if (!categoryId) {
        throw new Error('No se pudo crear la categoría');
      }

      return { id: categoryId, ...category };
    });

    console.log('✅ Categoría SQL creada exitosamente en Functions:', result.id);
    return { success: true, id: result.id, data: result };

  } catch (error) {
    console.error('❌ Error al crear categoría SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener todas las categorías
 * @param {Object} options - Opciones de filtrado
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getAllCategories(options = {}) {
  try {
    console.log('🔍 Obteniendo categorías SQL en Functions con opciones:', options);

    let query = `SELECT * FROM ${TABLE_NAME}`;
    const conditions = [];
    const params = {};

    // Filtros opcionales
    if (options.isActive !== undefined) {
      conditions.push('isActive = @isActive');
      params.isActive = options.isActive;
    }

    if (options.type) {
      conditions.push('type = @type');
      params.type = options.type;
    }

    if (options.search) {
      conditions.push('(name LIKE @search OR code LIKE @search OR description LIKE @search)');
      params.search = `%${options.search}%`;
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY sortOrder, name`;

    const result = await sqlConnection.query(query, params);

    if (result.length > 0) {
      // Procesar datos de respuesta
      const formattedData = result.map(category => ({
        ...category,
        customFields: category.customFields ? JSON.parse(category.customFields) : {},
        createdAt: category.createdAt ? category.createdAt.toISOString() : null,
        updatedAt: category.updatedAt ? category.updatedAt.toISOString() : null,
      }));
      return { success: true, data: formattedData, count: formattedData.length };
    }

    return { success: true, data: [], count: 0 };

  } catch (error) {
    console.error('❌ Error al obtener categorías SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener categoría por ID
 * @param {string} categoryId - ID de la categoría
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getCategory(categoryId) {
  try {
    if (!categoryId) {
      return { success: false, error: 'ID es requerido' };
    }

    const query = `SELECT * FROM ${TABLE_NAME} WHERE id = @id`;
    const result = await sqlConnection.query(query, { id: categoryId });

    if (result.length === 0) {
      return { success: false, error: 'Categoría no encontrada' };
    }

    const category = result[0];
    // Procesar datos de respuesta
    const formattedData = {
      ...category,
      customFields: category.customFields ? JSON.parse(category.customFields) : {},
      createdAt: category.createdAt ? category.createdAt.toISOString() : null,
      updatedAt: category.updatedAt ? category.updatedAt.toISOString() : null,
    };

    return { success: true, data: formattedData };

  } catch (error) {
    console.error('❌ Error al obtener categoría SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener categoría por código
 * @param {string} code - Código de la categoría
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getCategoryByCode(code) {
  try {
    if (!code) {
      return { success: false, error: 'Código es requerido' };
    }

    const query = `SELECT * FROM ${TABLE_NAME} WHERE code = @code`;
    const result = await sqlConnection.query(query, { code: code.toUpperCase() });

    if (result.length === 0) {
      return { success: false, error: 'Categoría no encontrada' };
    }

    const category = result[0];
    const formattedData = {
      ...category,
      customFields: category.customFields ? JSON.parse(category.customFields) : {},
      createdAt: category.createdAt ? category.createdAt.toISOString() : null,
      updatedAt: category.updatedAt ? category.updatedAt.toISOString() : null,
    };

    return { success: true, data: formattedData };

  } catch (error) {
    console.error('❌ Error al obtener categoría por código SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar categoría
 * @param {string} categoryId - ID de la categoría
 * @param {Object} updateData - Datos a actualizar
 * @param {Object} userInfo - Información del usuario
 * @returns {Promise<Object>} - {success, id, error}
 */
export async function updateCategory(categoryId, updateData, userInfo = null) {
  try {
    if (!categoryId) {
      return { success: false, error: 'ID es requerido' };
    }

    // Preparar datos de actualización
    const updatePayload = {
      ...updateData,
      updatedBy: userInfo?.email || 'unknown',
      updatedAt: new Date(),
    };

    // Procesar customFields como JSON
    if (updatePayload.customFields && typeof updatePayload.customFields === 'object') {
      updatePayload.customFields = JSON.stringify(updatePayload.customFields);
    }

    // Verificar unicidad del nombre si se actualiza
    if (updatePayload.name) {
      const existingQuery = `
        SELECT TOP 1 id FROM ${TABLE_NAME} WHERE name = @name AND id != @id
      `;

      const existingResult = await sqlConnection.query(existingQuery, {
        name: updatePayload.name.trim(),
        id: categoryId
      });

      if (existingResult.length > 0) {
        return {
          success: false,
          error: `Ya existe una categoría con el nombre: ${updatePayload.name}`
        };
      }
    }

    // Verificar unicidad del código si se actualiza
    if (updatePayload.code) {
      const existingCodeQuery = `
        SELECT TOP 1 id FROM ${TABLE_NAME} WHERE code = @code AND id != @id
      `;

      const existingCodeResult = await sqlConnection.query(existingCodeQuery, {
        code: updatePayload.code.trim().toUpperCase(),
        id: categoryId
      });

      if (existingCodeResult.length > 0) {
        return {
          success: false,
          error: `Ya existe una categoría con el código: ${updatePayload.code}`
        };
      }

      updatePayload.code = updatePayload.code.toUpperCase();
    }

    // Construir UPDATE
    const setParts = [];
    const params = { id: categoryId };

    Object.entries(updatePayload).forEach(([column, value], index) => {
      if (value !== undefined) {
        setParts.push(`${column} = @param${index}`);
        params[`param${index}`] = value;
      }
    });

    if (setParts.length === 0) {
      return { success: false, error: 'No hay datos para actualizar' };
    }

    const query = `
      UPDATE ${TABLE_NAME}
      SET ${setParts.join(', ')}
      WHERE id = @id
    `;

    const result = await sqlConnection.execute(query, params);

    return {
      success: true,
      id: categoryId,
      message: 'Categoría actualizada exitosamente',
      rowsAffected: result.rowsAffected,
    };

  } catch (error) {
    console.error('❌ Error al actualizar categoría SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Eliminar categoría
 * @param {string} categoryId - ID de la categoría
 * @returns {Promise<Object>} - {success, message, error}
 */
export async function deleteCategory(categoryId) {
  try {
    if (!categoryId) {
      return { success: false, error: 'ID es requerido' };
    }

    // Verificar que la categoría existe
    const categoryResult = await getCategory(categoryId);
    if (!categoryResult.success) {
      return categoryResult;
    }

    const category = categoryResult.data;

    // Verificar que no tenga vehículos asociados
    if (category.vehicleCount > 0) {
      return {
        success: false,
        error: 'No se puede eliminar una categoría que tiene vehículos asociados. Considere desactivarla.'
      };
    }

    const deleteQuery = `DELETE FROM ${TABLE_NAME} WHERE id = @id`;
    const result = await sqlConnection.execute(deleteQuery, { id: categoryId });

    console.log('✅ Categoría SQL eliminada exitosamente en Functions:', categoryId);
    return { success: true, message: 'Categoría eliminada exitosamente' };

  } catch (error) {
    console.error('❌ Error al eliminar categoría SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar contador de vehículos
 * @param {string} categoryId - ID de la categoría
 * @param {number} increment - Incremento/decremento del contador
 * @returns {Promise<Object>} - {success, message, error}
 */
export async function updateVehicleCount(categoryId, increment = 1) {
  try {
    if (!categoryId) {
      return { success: false, error: 'ID de categoría es requerido' };
    }

    const query = `
      UPDATE ${TABLE_NAME}
      SET vehicleCount = vehicleCount + @increment,
          updatedAt = @updatedAt
      WHERE id = @categoryId
    `;

    const result = await sqlConnection.execute(query, {
      categoryId,
      increment,
      updatedAt: new Date()
    });

    return { success: true, message: 'Contador actualizado exitosamente' };

  } catch (error) {
    console.error('❌ Error al actualizar contador de vehículos SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Reordenar categorías
 * @param {Array} categoryOrders - Array con {id, sortOrder}
 * @returns {Promise<Object>} - {success, message, error}
 */
export async function reorderCategories(categoryOrders) {
  try {
    if (!Array.isArray(categoryOrders)) {
      return { success: false, error: 'categoryOrders debe ser un array' };
    }

    // Actualizar en transacción
    await sqlConnection.transaction(async (transaction) => {
      for (const { id, sortOrder } of categoryOrders) {
        const query = `
          UPDATE ${TABLE_NAME}
          SET sortOrder = @sortOrder, updatedAt = @updatedAt
          WHERE id = @id
        `;

        const request = transaction.request();
        request.input('id', id);
        request.input('sortOrder', sortOrder);
        request.input('updatedAt', new Date());
        await request.query(query);
      }
    });

    return { success: true, message: 'Categorías reordenadas exitosamente' };

  } catch (error) {
    console.error('❌ Error al reordenar categorías SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener categorías activas
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getActiveCategories() {
  try {
    console.log('🔍 Obteniendo categorías activas SQL en Functions...');

    const result = await getAllCategories({ isActive: true });

    if (result.success) {
      console.log(`✅ Categorías activas obtenidas: ${result.data.length}`);
    }

    return result;

  } catch (error) {
    console.error('❌ Error al obtener categorías activas SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener estadísticas de categorías
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getCategoryStats() {
  try {
    console.log('📊 Obteniendo estadísticas de categorías SQL en Functions...');

    const query = `
      SELECT
        COUNT(*) as totalCategories,
        COUNT(CASE WHEN isActive = 1 THEN 1 END) as activeCategories,
        SUM(vehicleCount) as totalVehicles,
        AVG(CAST(vehicleCount as FLOAT)) as avgVehiclesPerCategory,
        COUNT(DISTINCT type) as uniqueTypes
      FROM ${TABLE_NAME}
    `;

    const result = await sqlConnection.query(query);

    if (result.length > 0) {
      const stats = result[0];
      return {
        success: true,
        data: {
          totalCategories: parseInt(stats.totalCategories) || 0,
          activeCategories: parseInt(stats.activeCategories) || 0,
          totalVehicles: parseInt(stats.totalVehicles) || 0,
          avgVehiclesPerCategory: parseFloat(stats.avgVehiclesPerCategory) || 0,
          uniqueTypes: parseInt(stats.uniqueTypes) || 0,
        }
      };
    }

    return {
      success: true,
      data: {
        totalCategories: 0,
        activeCategories: 0,
        totalVehicles: 0,
        avgVehiclesPerCategory: 0,
        uniqueTypes: 0,
      }
    };

  } catch (error) {
    console.error('❌ Error al obtener estadísticas de categorías SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Generar código de categoría automático
 * @param {string} name - Nombre de la categoría
 * @returns {string} - Código generado
 */
const generateCategoryCode = (name) => {
  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 10);
};