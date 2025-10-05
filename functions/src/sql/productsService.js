/**
 * productsService.js - Servicio de productos usando SQL Server DigitalOcean en Firebase Functions
 * Migrado desde combustibles/src/services/productsService.js
 * Forestech Combustibles App - TASK-006
 */

import sqlConnection from '../cloudsql/oil-connection.js';
import { randomUUID } from 'crypto';

const TABLE_NAME = 'combustibles_products';

// Funciones de utilidad para cálculos precisos
const preciseRound = (value, decimals = 2) => {
  const num = parseFloat(value) || 0;
  return parseFloat(num.toFixed(decimals));
};

/**
 * Validar datos de producto (interna)
 * @param {Object} productData - Datos a validar
 * @throws {Error} Si validación falla
 */
const validateProductData = (productData) => {
  if (!productData.name || productData.name.trim().length === 0) {
    throw new Error('El nombre del producto es requerido');
  }

  if (productData.price !== undefined && productData.price < 0) {
    throw new Error('El precio no puede ser negativo');
  }

  if (productData.currentStock !== undefined && productData.currentStock < 0) {
    throw new Error('El stock no puede ser negativo');
  }

  if (productData.minThreshold !== undefined && productData.minThreshold < 0) {
    throw new Error('El umbral mínimo no puede ser negativo');
  }
};

/**
 * Crear nuevo producto
 * @param {Object} productData - Datos del producto
 * @param {Object} userInfo - Información del usuario (opcional)
 * @returns {Promise<Object>} - Resultado de la operación {success, id/data, error}
 */
export async function createProduct(productData, userInfo = null) {
  try {
    console.log('🚀 Iniciando creación de producto SQL en Functions:', productData);

    // Validar datos
    validateProductData(productData);

    // Preparar datos del producto
    // Mantener sólo los campos esenciales (payload simplificado)
    const product = {
      id: productData.id || randomUUID(),
      name: productData.name.trim(),
      displayName: productData.displayName || productData.name.trim(),
      code: productData.code?.toUpperCase() || null,
      category: productData.category || 'combustible',
      unit: productData.unit || 'galones',
      price: preciseRound(productData.price || productData.defaultPrice || 0),
      currentStock: preciseRound(productData.currentStock || 0),
      minThreshold: preciseRound(productData.minThreshold || 0),
      maxCapacity: productData.maxCapacity || 1000,
      isActive: productData.isActive !== false,
      createdBy: userInfo?.email || 'unknown',
      createdByUid: userInfo?.uid || null,
      createdByName: userInfo?.displayName || userInfo?.email || 'Usuario',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Crear producto en transacción
    const result = await sqlConnection.transaction(async (transaction) => {
      // Insert explícito con columnas esperadas (evita depender de customFields)
      const insertQuery = `
        INSERT INTO ${TABLE_NAME} (
          id, name, displayName, code, category, unit,
          price, currentStock, minThreshold, maxCapacity, isActive,
          createdBy, createdByUid, createdByName, createdAt, updatedAt
        )
        VALUES (
          @id, @name, @displayName, @code, @category, @unit,
          @price, @currentStock, @minThreshold, @maxCapacity, @isActive,
          @createdBy, @createdByUid, @createdByName, @createdAt, @updatedAt
        );
        SELECT @id as id;
      `;

      const insertRequest = transaction.request();
      insertRequest.input('id', product.id);
      insertRequest.input('name', product.name);
      insertRequest.input('displayName', product.displayName);
      insertRequest.input('code', product.code);
      insertRequest.input('category', product.category);
      insertRequest.input('unit', product.unit);
      insertRequest.input('price', product.price);
      insertRequest.input('currentStock', product.currentStock);
      insertRequest.input('minThreshold', product.minThreshold);
      insertRequest.input('maxCapacity', product.maxCapacity);
      insertRequest.input('isActive', product.isActive ? 1 : 0);
      insertRequest.input('createdBy', product.createdBy);
      insertRequest.input('createdByUid', product.createdByUid);
      insertRequest.input('createdByName', product.createdByName);
      insertRequest.input('createdAt', product.createdAt);
      insertRequest.input('updatedAt', product.updatedAt);

  const createResult = await insertRequest.query(insertQuery);
  const productId = createResult.recordset[0]?.id || product.id;

      if (!productId) {
        throw new Error('No se pudo crear el producto');
      }

      return { id: productId, ...product };
    });

    console.log('✅ Producto SQL creado exitosamente en Functions:', result.id);
    return { success: true, id: result.id, data: result };

  } catch (error) {
    console.error('❌ Error al crear producto SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener todos los productos con filtros opcionales
 * @param {Object} filters - Filtros de búsqueda {category, isActive, search}
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getAllProducts(filters = {}) {
  try {
    console.log('🔍 Obteniendo productos SQL en Functions con filtros:', filters);

    // Construir filtros SQL
    let whereClause = '';
    const params = {};
    const filterConditions = [];

    // category filter removed

    if (filters.isActive !== undefined) {
      filterConditions.push('isActive = @isActive');
      params.isActive = filters.isActive;
    }

    if (filters.search) {
      // Buscar solo en name y displayName: description fue removido del esquema simplificado
      filterConditions.push('(name LIKE @search OR displayName LIKE @search)');
      params.search = `%${filters.search}%`;
    }

    if (filterConditions.length > 0) {
      whereClause = `WHERE ${filterConditions.join(' AND ')}`;
    }

    const query = `
      SELECT * FROM ${TABLE_NAME}
      ${whereClause}
      ORDER BY name ASC
    `;

    const result = await sqlConnection.query(query, params);

    if (result.length > 0) {
      // Convertir timestamps (schema simplificado, sin description/customFields)
      const formattedData = result.map(product => ({
        ...product,
        createdAt: product.createdAt ? product.createdAt.toISOString() : null,
        updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
      }));
      return { success: true, data: formattedData, count: formattedData.length };
    }

    return { success: true, data: [], count: 0 };

  } catch (error) {
    console.error('❌ Error al obtener productos SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener producto específico por ID
 * @param {string} productId - ID del producto
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getProduct(productId) {
  try {
    if (!productId) {
      return { success: false, error: 'ID es requerido' };
    }

    const query = `SELECT * FROM ${TABLE_NAME} WHERE id = @id`;
    const result = await sqlConnection.query(query, { id: productId });

    if (result.length === 0) {
      return { success: false, error: 'Producto no encontrado' };
    }

    const product = result[0];
    // Convertir timestamps y parsear JSON
    const formattedData = {
      ...product,
      createdAt: product.createdAt ? product.createdAt.toISOString() : null,
      updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
    };

    return { success: true, data: formattedData };

  } catch (error) {
    console.error('❌ Error al obtener producto SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar producto
 * @param {string} productId - ID del producto
 * @param {Object} updateData - Datos a actualizar
 * @param {Object} userInfo - Información del usuario (opcional)
 * @returns {Promise<Object>} - {success, id, error}
 */
export async function updateProduct(productId, updateData, userInfo = null) {
  try {
    if (!productId) {
      return { success: false, error: 'ID es requerido' };
    }

    // Validar datos si se proporcionan
    if (updateData.name || updateData.price !== undefined || updateData.currentStock !== undefined) {
      const tempData = { ...updateData };
      if (updateData.name) tempData.name = updateData.name;
      if (updateData.price !== undefined) tempData.price = updateData.price;
      if (updateData.currentStock !== undefined) tempData.currentStock = updateData.currentStock;
      validateProductData(tempData);
    }

    // Preparar datos de actualización y filtrar solo campos permitidos
    const updatePayload = {
      ...updateData,
      updatedAt: new Date(),
    };

    if (userInfo) {
      updatePayload.updatedBy = userInfo.email || 'unknown';
    }

    // Solo permitir actualizar columnas explícitas para evitar inyección de columnas
    const allowedFields = new Set([
      'name',
      'displayName',
      'code',
      'category',
      'unit',
      'price',
      'currentStock',
      'minThreshold',
      'maxCapacity',
      'isActive',
      'updatedAt',
      'updatedBy'
    ]);

    const setParts = [];
    const params = { id: productId };

    Object.entries(updatePayload).forEach(([column, value], index) => {
      if (!allowedFields.has(column)) {
        // Ignorar campos no permitidos (por ejemplo customFields)
        console.warn(`⚠️ Ignorando campo no permitido en updateProduct: ${column}`);
        return;
      }

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
      id: productId,
      message: 'Producto actualizado exitosamente',
      rowsAffected: result.rowsAffected,
    };

  } catch (error) {
    console.error('❌ Error al actualizar producto SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Eliminar producto
 * @param {string} productId - ID del producto
 * @returns {Promise<Object>} - {success, message, error}
 */
export async function deleteProduct(productId) {
  try {
    if (!productId) {
      return { success: false, error: 'ID es requerido' };
    }

    // Verificar que el producto existe
    const productResult = await getProduct(productId);
    if (!productResult.success) {
      return productResult;
    }

    const deleteQuery = `DELETE FROM ${TABLE_NAME} WHERE id = @id`;
  await sqlConnection.execute(deleteQuery, { id: productId });

    console.log('✅ Producto SQL eliminado exitosamente en Functions:', productId);
    return { success: true, message: 'Producto eliminado exitosamente' };

  } catch (error) {
    console.error('❌ Error al eliminar producto SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener productos por categoría
 * @param {string} category - Categoría del producto
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getProductsByCategory(category) {
  try {
    if (!category) {
      return { success: false, error: 'Categoría es requerida' };
    }

    const query = `
      SELECT * FROM ${TABLE_NAME}
      WHERE category = @category AND isActive = 1
      ORDER BY name ASC
    `;

    const result = await sqlConnection.query(query, { category });

    if (result.length > 0) {
      const formattedData = result.map(product => ({
        ...product,
        createdAt: product.createdAt ? product.createdAt.toISOString() : null,
        updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
      }));
      return { success: true, data: formattedData, count: formattedData.length };
    }

    return { success: true, data: [], count: 0 };

  } catch (error) {
    console.error('❌ Error al obtener productos por categoría SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener productos activos
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getActiveProducts() {
  try {
    console.log('🔍 Obteniendo productos activos SQL en Functions...');

    const query = `
      SELECT * FROM ${TABLE_NAME}
      WHERE isActive = 1
      ORDER BY name ASC
    `;

    const result = await sqlConnection.query(query);

    if (result.length > 0) {
      const formattedData = result.map(product => ({
        ...product,
        createdAt: product.createdAt ? product.createdAt.toISOString() : null,
        updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
      }));
      console.log(`✅ Productos activos obtenidos: ${formattedData.length}`);
      return { success: true, data: formattedData, count: formattedData.length };
    }

    return { success: true, data: [], count: 0 };

  } catch (error) {
    console.error('❌ Error al obtener productos activos SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar stock de producto
 * @param {string} productId - ID del producto
 * @param {number} newStock - Nuevo stock
 * @param {Object} userInfo - Información del usuario (opcional)
 * @returns {Promise<Object>} - {success, message, error}
 */
export async function updateProductStock(productId, newStock, userInfo = null) {
  try {
    if (!productId) {
      return { success: false, error: 'ID es requerido' };
    }

    if (newStock < 0) {
      return { success: false, error: 'El stock no puede ser negativo' };
    }

    const updateData = {
      currentStock: preciseRound(newStock),
      updatedAt: new Date(),
    };

    if (userInfo) {
      updateData.updatedBy = userInfo.email || 'unknown';
    }

    const result = await updateProduct(productId, updateData, userInfo);

    if (result.success) {
      console.log('✅ Stock de producto actualizado exitosamente en Functions');
    }

    return result;

  } catch (error) {
    console.error('❌ Error al actualizar stock de producto SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Buscar productos por nombre
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function searchProducts(searchTerm) {
  try {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return { success: false, error: 'Término de búsqueda es requerido' };
    }

    const query = `
      SELECT * FROM ${TABLE_NAME}
      WHERE isActive = 1 AND (
        name LIKE @search OR
        displayName LIKE @search
      )
      ORDER BY name ASC
    `;

    const result = await sqlConnection.query(query, { search: `%${searchTerm.trim()}%` });

    if (result.length > 0) {
      const formattedData = result.map(product => ({
        ...product,
        createdAt: product.createdAt ? product.createdAt.toISOString() : null,
        updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
      }));
      return { success: true, data: formattedData, count: formattedData.length };
    }

    return { success: true, data: [], count: 0 };

  } catch (error) {
    console.error('❌ Error al buscar productos SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener productos con stock bajo
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getLowStockProducts() {
  try {
    console.log('🔍 Obteniendo productos con stock bajo SQL en Functions...');

    const query = `
      SELECT * FROM ${TABLE_NAME}
      WHERE isActive = 1 AND currentStock <= minThreshold
      ORDER BY currentStock ASC
    `;

    const result = await sqlConnection.query(query);

    if (result.length > 0) {
      const formattedData = result.map(product => ({
        ...product,
        // customFields removed from simplified schema
        createdAt: product.createdAt ? product.createdAt.toISOString() : null,
        updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
      }));
      console.log(`✅ Productos con stock bajo encontrados: ${formattedData.length}`);
      return { success: true, data: formattedData, count: formattedData.length };
    }

    return { success: true, data: [], count: 0 };

  } catch (error) {
    console.error('❌ Error al obtener productos con stock bajo SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener producto por código
 * @param {string} productCode - Código del producto
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getProductByCode(productCode) {
  try {
    if (!productCode) {
      return { success: false, error: 'Código es requerido' };
    }

    const query = `SELECT * FROM ${TABLE_NAME} WHERE code = @code`;
    const result = await sqlConnection.query(query, { code: productCode.toUpperCase() });

    if (result.length === 0) {
      return { success: false, error: 'Producto no encontrado' };
    }

    const product = result[0];
    const formattedData = {
      ...product,
      createdAt: product.createdAt ? product.createdAt.toISOString() : null,
      updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
    };

    return { success: true, data: formattedData };

  } catch (error) {
    console.error('❌ Error al obtener producto por código SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}