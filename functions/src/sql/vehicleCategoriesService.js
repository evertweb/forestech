/**
 * vehicleCategoriesService.js - Servicio de categorías de vehículos usando Cloud SQL Server Server en Firebase Functions
 * Migrado desde combustibles/src/services/SqlVehicleCategoriesService.js
 * Forestech Combustibles App - TASK-006
 */

import sqlConnection from '../cloudsql/oil-connection.js';
import sql from 'mssql';

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
    const code = categoryData.code || categoryData.uniqueCode || generateCategoryCode(categoryData.name);

    // Verificar si la columna sortOrder existe y obtener el siguiente valor
    let nextSortOrder = 1;
    try {
      const columnCheck = await sqlConnection.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = '${TABLE_NAME}' AND COLUMN_NAME = 'sortOrder'
      `);
      
      if (columnCheck.length > 0) {
        const sortOrderQuery = `
          SELECT ISNULL(MAX(sortOrder), 0) + 1 as nextSortOrder FROM ${TABLE_NAME}
        `;
        const sortOrderResult = await sqlConnection.query(sortOrderQuery);
        nextSortOrder = sortOrderResult[0].nextSortOrder;
      } else {
        console.log('⚠️ Columna sortOrder no existe, usando valor por defecto');
      }
    } catch (sortError) {
      console.log('⚠️ Error obteniendo sortOrder, usando valor por defecto:', sortError.message);
    }

    // Mapear datos del frontend al formato de base de datos
    const customFieldsData = {
      fields: categoryData.fields || [],
      fuelTypes: categoryData.fuelTypes || [],
      ...(categoryData.customFields || {})
    };

    // Preparar datos básicos de la categoría
    const category = {
      name: categoryData.name.trim(),
      code: code.toUpperCase(),
      description: categoryData.description || '',
      type: categoryData.type || CATEGORY_TYPES.VEHICLE,
      icon: categoryData.icon || 'vehicle',
      color: categoryData.color || '#4F46E5',
      customFields: JSON.stringify(customFieldsData),
      defaultFuelType: (categoryData.fuelTypes && categoryData.fuelTypes[0]) || categoryData.defaultFuelType || 'DIESEL',
      estimatedConsumption: categoryData.estimatedConsumption || 0,
      isActive: categoryData.isActive !== false ? 1 : 0,  // Convertir a bit
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userInfo?.email || 'unknown',
      updatedBy: userInfo?.email || 'unknown',
    };

    // Agregar columnas opcionales solo si existen en la tabla
    try {
      const columnsCheck = await sqlConnection.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = '${TABLE_NAME}' AND COLUMN_NAME IN ('sortOrder', 'vehicleCount')
      `);
      
      const existingColumns = columnsCheck.map(row => row.COLUMN_NAME);
      
      if (existingColumns.includes('sortOrder')) {
        category.sortOrder = categoryData.sortOrder || nextSortOrder;
      }
      
      if (existingColumns.includes('vehicleCount')) {
        category.vehicleCount = 0;
      }
      
      console.log('🔍 Columnas opcionales detectadas:', existingColumns);
    } catch (columnError) {
      console.log('⚠️ Error verificando columnas opcionales:', columnError.message);
    }

    console.log('🔍 DEBUG - Datos mapeados para inserción:', category);

    // Crear categoría en transacción
    const result = await sqlConnection.transaction(async (transaction) => {
      const columns = Object.keys(category);
      const values = columns.map((_, index) => `@param${index}`);
      
      // Log detallado para debug
      console.log('🔍 DEBUG - Columnas a insertar:', columns);
      console.log('🔍 DEBUG - Valores a insertar:', Object.values(category));
      
      // Para tablas con UNIQUEIDENTIFIER, usar OUTPUT INSERTED.* en lugar de SCOPE_IDENTITY()
      const insertQuery = `
        INSERT INTO ${TABLE_NAME} (${columns.join(', ')})
        OUTPUT INSERTED.*
        VALUES (${values.join(', ')});
      `;
      
      console.log('🔍 DEBUG - Query generada:', insertQuery);

      const insertRequest = transaction.request();
      columns.forEach((col, index) => {
        const value = category[col];
        console.log(`🔍 DEBUG - Parámetro ${index}: ${col} = ${value} (type: ${typeof value})`);
        
        // Manejar tipos específicos para SQL Server
        if (col === 'isActive') {
          insertRequest.input(`param${index}`, sql.Bit, value ? 1 : 0);
        } else if (col === 'estimatedConsumption') {
          insertRequest.input(`param${index}`, sql.Decimal(8, 3), value || null);
        } else if (col === 'sortOrder' || col === 'vehicleCount') {
          insertRequest.input(`param${index}`, sql.Int, value || 0);
        } else if (col === 'createdAt' || col === 'updatedAt') {
          insertRequest.input(`param${index}`, sql.DateTime2, value);
        } else if (col === 'customFields') {
          insertRequest.input(`param${index}`, sql.NVarChar(sql.MAX), value);
        } else {
          insertRequest.input(`param${index}`, value);
        }
      });
      
      console.log('🔍 DEBUG - Ejecutando query...');
      const createResult = await insertRequest.query(insertQuery);
      
      console.log('🔍 DEBUG - Resultado completo:', createResult);
      console.log('🔍 DEBUG - Recordset:', createResult.recordset);
      
      // Con OUTPUT INSERTED.*, el recordset contiene el registro completo insertado
      const insertedCategory = createResult.recordset[0];
      console.log('🔍 DEBUG - Categoría insertada:', insertedCategory);

      if (!insertedCategory || !insertedCategory.id) {
        console.log('❌ DEBUG - No se pudo obtener el registro insertado');
        throw new Error('No se pudo crear la categoría - No se obtuvo el ID generado');
      }

      return insertedCategory;
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

    // Verificar si la columna sortOrder existe antes de usarla
    try {
      const columnCheck = await sqlConnection.query(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = '${TABLE_NAME}' AND COLUMN_NAME = 'sortOrder'
      `);
      
      if (columnCheck.length > 0) {
        query += ` ORDER BY sortOrder, name`;
      } else {
        console.log('⚠️ Columna sortOrder no existe, ordenando solo por name');
        query += ` ORDER BY name`;
      }
    } catch (columnError) {
      console.log('⚠️ Error verificando columna sortOrder, usando orden por name:', columnError.message);
      query += ` ORDER BY name`;
    }

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
  await sqlConnection.execute(deleteQuery, { id: categoryId });

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

    await sqlConnection.execute(query, {
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

    // Verificar si la columna sortOrder existe
    const columnCheck = await sqlConnection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = '${TABLE_NAME}' AND COLUMN_NAME = 'sortOrder'
    `);
    
    if (columnCheck.length === 0) {
      console.log('⚠️ Columna sortOrder no existe, no se puede reordenar');
      return { 
        success: false, 
        error: 'La columna sortOrder no existe en la tabla. Ejecuta la migración de esquema primero.' 
      };
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