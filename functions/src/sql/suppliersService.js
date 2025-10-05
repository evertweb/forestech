/**
 * suppliersService.js - Servicio de proveedores usando SQL Server DigitalOcean en Firebase Functions
 * Migrado desde combustibles/src/services/suppliersService.js
 * Forestech Combustibles App - TASK-001
 */

import sqlConnection from '../cloudsql/oil-connection.js';

const TABLE_NAME = 'combustibles_suppliers';

// Estados del proveedor (copiados de SqlSuppliersService.js para Functions)
export const SUPPLIER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  EVALUATION: 'evaluation',
};

// Tipos de proveedor (copiados de SqlSuppliersService.js para Functions)
export const SUPPLIER_TYPES = {
  PROVEEDOR: 'proveedor',
  DISTRIBUIDOR: 'distribuidor',
  ESTACION: 'estacion',
  MAYORISTA: 'mayorista',
};

// Categorías de proveedor (copiados de SqlSuppliersService.js para Functions)
export const SUPPLIER_CATEGORIES = {
  COMBUSTIBLES: 'combustibles',
  LUBRICANTES: 'lubricantes',
  SERVICIOS: 'servicios',
  MIXTO: 'mixto',
};

/**
 * Validar datos de proveedor
 * @param {Object} supplierData - Datos a validar
 * @throws {Error} Si validación falla
 */
const validateSupplierData = (supplierData) => {
  const required = ['name'];

  for (const field of required) {
    if (!supplierData[field]) {
      throw new Error(`Campo requerido: ${field}`);
    }
  }

  // Validar email si se proporciona
  if (supplierData.email && supplierData.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(supplierData.email.trim())) {
      throw new Error('Formato de email inválido');
    }
  }

  // Validar teléfono si se proporciona
  if (supplierData.phone && supplierData.phone.trim()) {
    const phoneRegex = /^[\d\s()+-]{7,15}$/;
    if (!phoneRegex.test(supplierData.phone.trim())) {
      throw new Error('Formato de teléfono inválido');
    }
  }

  // Validar estado si se proporciona
  if (supplierData.status && !Object.values(SUPPLIER_STATUS).includes(supplierData.status)) {
    throw new Error('Estado de proveedor inválido');
  }

  // Validar tipo si se proporciona
  if (supplierData.type && !Object.values(SUPPLIER_TYPES).includes(supplierData.type)) {
    throw new Error('Tipo de proveedor inválido');
  }

  // Validar categoría si se proporciona
  if (supplierData.category && !Object.values(SUPPLIER_CATEGORIES).includes(supplierData.category)) {
    throw new Error('Categoría de proveedor inválida');
  }
};

/**
 * Parsear JSON de manera segura
 * @param {string} jsonString - String JSON
 * @returns {Array|Object} - Objeto parseado o valor por defecto
 */
const parseJSON = (jsonString) => {
  try {
    return jsonString ? JSON.parse(jsonString) : [];
  } catch (error) {
    console.warn('Error parseando JSON:', error);
    return [];
  }
};

/**
 * Crear un nuevo proveedor
 * @param {Object} supplierData - Datos del proveedor
 * @param {Object} userInfo - Información del usuario (opcional)
 * @returns {Promise<Object>} - Resultado de la operación {success, id/data, error}
 */
export async function createSupplier(supplierData, userInfo = null) {
  try {
    console.log('🏪 Iniciando creación de proveedor SQL en Functions:', supplierData);

    // Validar datos básicos
    validateSupplierData(supplierData);

    // Verificar que el nombre sea único
    const existingQuery = `
      SELECT TOP 1 id FROM ${TABLE_NAME} WHERE name = @name
    `;

    const existingResult = await sqlConnection.query(existingQuery, {
      name: supplierData.name.trim()
    });

    if (existingResult.length > 0) {
      throw new Error(`Ya existe un proveedor con el nombre: ${supplierData.name}`);
    }

    // Verificar taxId único si se proporciona
    if (supplierData.taxId && supplierData.taxId.trim()) {
      const existingTaxQuery = `
        SELECT TOP 1 id FROM ${TABLE_NAME} WHERE taxId = @taxId
      `;

      const existingTaxResult = await sqlConnection.query(existingTaxQuery, {
        taxId: supplierData.taxId.trim()
      });

      if (existingTaxResult.length > 0) {
        throw new Error(`Ya existe un proveedor con el NIT/RUT: ${supplierData.taxId}`);
      }
    }

    // Preparar datos del proveedor
    const supplier = {
      name: supplierData.name.trim(),
      taxId: supplierData.taxId?.trim() || null,
      type: supplierData.type || SUPPLIER_TYPES.PROVEEDOR,
      category: supplierData.category || SUPPLIER_CATEGORIES.COMBUSTIBLES,
      contactPerson: supplierData.contactPerson || '',
      phone: supplierData.phone || '',
      email: supplierData.email || '',
      address: supplierData.address || '',
      city: supplierData.city || '',
      state: supplierData.state || 'Colombia',
      fuelTypes: JSON.stringify(supplierData.fuelTypes || []),
      paymentTerms: supplierData.paymentTerms || 'contado',
      creditLimit: supplierData.creditLimit || 0,
      priceList: JSON.stringify(supplierData.priceList || {}),
      rating: supplierData.rating || 5.0,
      evaluationNotes: supplierData.evaluationNotes || '',
      status: supplierData.status || SUPPLIER_STATUS.ACTIVE,
      isPreferred: supplierData.isPreferred || false,
      totalOrders: 0,
      totalPurchased: 0,
      lastOrderDate: null,
      averageDeliveryTime: supplierData.averageDeliveryTime || 0,
      createdBy: userInfo?.email || 'unknown',
      updatedBy: userInfo?.email || 'unknown',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Crear el proveedor
    const columns = Object.keys(supplier);
    const values = columns.map((_, index) => `@param${index}`);
    const insertQuery = `
      INSERT INTO ${TABLE_NAME} (${columns.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')});
    `;

    const params = {};
    columns.forEach((col, index) => {
      params[`param${index}`] = supplier[col];
    });
    const createResult = await sqlConnection.query(insertQuery, params);
    const supplierId = createResult[0]?.id;

    if (!supplierId) {
      throw new Error('No se pudo crear el proveedor');
    }

    console.log('✅ Proveedor SQL creado exitosamente en Functions:', supplierId);
    return { success: true, id: supplierId, data: { ...supplier, id: supplierId } };

  } catch (error) {
    console.error('❌ Error al crear proveedor SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener todos los proveedores
 * @param {Object} filters - Filtros de búsqueda {status, type, category, isPreferred, search}
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getAllSuppliers(filters = {}) {
  try {
    console.log('🏪 Obteniendo proveedores SQL en Functions con filtros:', filters);

    // Construir filtros SQL
    let whereClause = '';
    const params = {};
    const filterConditions = [];

    if (filters.status) {
      filterConditions.push('status = @status');
      params.status = filters.status;
    }

    if (filters.type) {
      filterConditions.push('type = @type');
      params.type = filters.type;
    }

    if (filters.category) {
      filterConditions.push('category = @category');
      params.category = filters.category;
    }

    if (filters.isPreferred !== undefined) {
      filterConditions.push('isPreferred = @isPreferred');
      params.isPreferred = filters.isPreferred;
    }

    if (filters.search) {
      filterConditions.push('(name LIKE @search OR contactPerson LIKE @search OR email LIKE @search)');
      params.search = `%${filters.search}%`;
    }

    if (filterConditions.length > 0) {
      whereClause = `WHERE ${filterConditions.join(' AND ')}`;
    }

    // Paginación: limit y offset
    const limit = filters.limit || 100; // Default 100 proveedores
    const offset = filters.offset || 0;

    const query = `
      SELECT * FROM ${TABLE_NAME}
      ${whereClause}
      ORDER BY isPreferred DESC, name
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    const result = await sqlConnection.query(query, params);

    const processedData = result.map((supplier) => ({
      id: supplier.id,
      name: supplier.name,
      taxId: supplier.taxId,
      type: supplier.type,
      category: supplier.category,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      city: supplier.city,
      state: supplier.state,
      fuelTypes: parseJSON(supplier.fuelTypes),
      paymentTerms: supplier.paymentTerms,
      creditLimit: supplier.creditLimit,
      priceList: parseJSON(supplier.priceList),
      rating: supplier.rating,
      evaluationNotes: supplier.evaluationNotes,
      status: supplier.status,
      isPreferred: supplier.isPreferred || false,
      totalOrders: supplier.totalOrders,
      totalPurchased: supplier.totalPurchased,
      lastOrderDate: supplier.lastOrderDate,
      averageDeliveryTime: supplier.averageDeliveryTime,
      createdBy: supplier.createdBy,
      updatedBy: supplier.updatedBy,
      createdAt: supplier.createdAt ? supplier.createdAt.toISOString() : null,
      updatedAt: supplier.updatedAt ? supplier.updatedAt.toISOString() : null,
    }));

    const pagination = {
      limit,
      offset,
      returned: processedData.length,
      hasMore: processedData.length === limit,
    };

    return {
      success: true,
      data: processedData,
      meta: pagination,
    };
  } catch (error) {
    console.error('❌ Error al obtener proveedores SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener proveedor por ID
 * @param {string} supplierId - ID del proveedor
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getSupplierById(supplierId) {
  try {
    if (!supplierId) {
      return { success: false, error: 'ID de proveedor requerido' };
    }

    const query = `SELECT * FROM ${TABLE_NAME} WHERE id = @id`;
    const result = await sqlConnection.query(query, { id: supplierId });

    if (result.length === 0) {
      return { success: false, error: 'Proveedor no encontrado' };
    }

    const supplier = result[0];

    // Procesar datos para compatibilidad
    const processedData = {
      id: supplier.id,
      name: supplier.name,
      taxId: supplier.taxId,
      type: supplier.type,
      category: supplier.category,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      city: supplier.city,
      state: supplier.state,
      fuelTypes: parseJSON(supplier.fuelTypes),
      paymentTerms: supplier.paymentTerms,
      creditLimit: supplier.creditLimit,
      priceList: parseJSON(supplier.priceList),
      rating: supplier.rating,
      evaluationNotes: supplier.evaluationNotes,
      status: supplier.status,
      isPreferred: supplier.isPreferred,
      totalOrders: supplier.totalOrders,
      totalPurchased: supplier.totalPurchased,
      lastOrderDate: supplier.lastOrderDate,
      averageDeliveryTime: supplier.averageDeliveryTime,
      createdBy: supplier.createdBy,
      updatedBy: supplier.updatedBy,
      createdAt: supplier.createdAt ? supplier.createdAt.toISOString() : null,
      updatedAt: supplier.updatedAt ? supplier.updatedAt.toISOString() : null,
    };

    return { success: true, data: processedData };

  } catch (error) {
    console.error('❌ Error al obtener proveedor SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar proveedor
 * @param {string} supplierId - ID del proveedor
 * @param {Object} updateData - Datos a actualizar
 * @param {Object} userInfo - Información del usuario (opcional)
 * @returns {Promise<Object>} - {success, id, error}
 */
export async function updateSupplier(supplierId, updateData, userInfo = null) {
  try {
    if (!supplierId) {
      return { success: false, error: 'ID de proveedor requerido' };
    }

    console.log('🏪 Actualizando proveedor SQL en Functions:', supplierId, updateData);

    // Verificar unicidad del nombre si se actualiza
    if (updateData.name) {
      const existingQuery = `
        SELECT TOP 1 id FROM ${TABLE_NAME} WHERE name = @name AND id != @id
      `;

      const existingResult = await sqlConnection.query(existingQuery, {
        name: updateData.name.trim(),
        id: supplierId
      });

      if (existingResult.length > 0) {
        return { success: false, error: `Ya existe un proveedor con el nombre: ${updateData.name}` };
      }
    }

    // Verificar unicidad del taxId si se actualiza
    if (updateData.taxId && updateData.taxId.trim()) {
      const existingTaxQuery = `
        SELECT TOP 1 id FROM ${TABLE_NAME} WHERE taxId = @taxId AND id != @id
      `;

      const existingTaxResult = await sqlConnection.query(existingTaxQuery, {
        taxId: updateData.taxId.trim(),
        id: supplierId
      });

      if (existingTaxResult.length > 0) {
        return { success: false, error: `Ya existe un proveedor con el NIT/RUT: ${updateData.taxId}` };
      }
    }

    // Preparar datos de actualización
    const updatedData = {
      ...updateData,
      updatedBy: userInfo?.email || 'unknown',
      updatedAt: new Date(),
    };

    // Procesar arrays/objetos como JSON
    if (updatedData.fuelTypes && Array.isArray(updatedData.fuelTypes)) {
      updatedData.fuelTypes = JSON.stringify(updatedData.fuelTypes);
    }

    if (updatedData.priceList && typeof updatedData.priceList === 'object') {
      updatedData.priceList = JSON.stringify(updatedData.priceList);
    }

    // Construir UPDATE
    const setParts = [];
    const params = { id: supplierId };

    Object.entries(updatedData).forEach(([column, value], index) => {
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
      id: supplierId,
      message: 'Proveedor actualizado exitosamente',
      rowsAffected: result.rowsAffected,
    };

  } catch (error) {
    console.error('❌ Error al actualizar proveedor SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Eliminar proveedor
 * @param {string} supplierId - ID del proveedor
 * @returns {Promise<Object>} - {success, message, error}
 */
export async function deleteSupplier(supplierId) {
  try {
    if (!supplierId) {
      return { success: false, error: 'ID de proveedor requerido' };
    }

    console.log('🏪 Eliminando proveedor SQL en Functions:', supplierId);

    // Verificar que no tenga órdenes asociadas (simplificado para Functions)
    const supplierResult = await getSupplierById(supplierId);
    if (!supplierResult.success) {
      return supplierResult;
    }

    const supplier = supplierResult.data;

    if (supplier.totalOrders > 0) {
      return {
        success: false,
        error: 'No se puede eliminar un proveedor que tiene órdenes asociadas. Considere marcarlo como inactivo.'
      };
    }

    // Eliminar el proveedor
    const deleteQuery = `DELETE FROM ${TABLE_NAME} WHERE id = @id`;
    const result = await sqlConnection.execute(deleteQuery, { id: supplierId });

    console.log('✅ Proveedor SQL eliminado exitosamente en Functions');
    return { success: true, message: 'Proveedor eliminado exitosamente', rowsAffected: result.rowsAffected };

  } catch (error) {
    console.error('❌ Error al eliminar proveedor SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar estadísticas del proveedor
 * @param {string} supplierId - ID del proveedor
 * @param {Object} stats - Estadísticas a actualizar
 * @returns {Promise<Object>} - {success, message, error}
 */
export async function updateSupplierStats(supplierId, stats) {
  try {
    if (!supplierId) {
      return { success: false, error: 'ID de proveedor requerido' };
    }

    console.log('📊 Actualizando estadísticas de proveedor SQL en Functions:', supplierId, stats);

    const updateData = {
      totalOrders: stats.totalOrders,
      totalPurchased: stats.totalPurchased,
      lastOrderDate: stats.lastOrderDate,
      averageDeliveryTime: stats.averageDeliveryTime,
      updatedAt: new Date(),
      updatedBy: 'system',
    };

    const result = await updateSupplier(supplierId, updateData);

    if (!result.success) {
      return result;
    }

    return { success: true, message: 'Estadísticas actualizadas exitosamente' };

  } catch (error) {
    console.error('❌ Error al actualizar estadísticas de proveedor SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener proveedores preferidos
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getPreferredSuppliers() {
  try {
    console.log('⭐ Obteniendo proveedores preferidos SQL en Functions');

    const result = await getAllSuppliers({
      isPreferred: true,
      status: SUPPLIER_STATUS.ACTIVE
    });

    return result;

  } catch (error) {
    console.error('❌ Error al obtener proveedores preferidos SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener estadísticas de proveedores
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getSuppliersStats() {
  try {
    console.log('📊 Obteniendo estadísticas de proveedores SQL en Functions');

    const query = `
      SELECT
        COUNT(*) as totalSuppliers,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as activeSuppliers,
        COUNT(CASE WHEN isPreferred = 1 THEN 1 END) as preferredSuppliers,
        AVG(rating) as averageRating,
        SUM(totalPurchased) as totalPurchased,
        COUNT(CASE WHEN totalOrders > 0 THEN 1 END) as suppliersWithOrders,
        AVG(averageDeliveryTime) as avgDeliveryTime
      FROM ${TABLE_NAME}
    `;

    const result = await sqlConnection.query(query);

    if (result.length === 0) {
      return { success: false, error: 'No se pudieron obtener las estadísticas' };
    }

    const stats = result[0];

    return { success: true, data: stats };

  } catch (error) {
    console.error('❌ Error al obtener estadísticas de proveedores SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}