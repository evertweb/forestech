/**
 * inventoryService.js - Servicio de inventario usando SQL Server DigitalOcean en Firebase Functions
 * Migrado desde combustibles/src/services/SqlInventoryService.js
 * Forestech Combustibles App - TASK-003
 */

import sqlConnection from '../cloudsql/oil-connection.js';

const TABLE_NAME = 'combustibles_inventory';

// Estados del inventario
export const INVENTORY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MAINTENANCE: 'maintenance',
};

const FUEL_INFO = {
  ACPM: {
    name: 'ACPM (Diesel)',
    icon: '⛽',
    unit: 'gal',
    density: 0.84,
    description: 'Aceite Combustible Para Motor - Diesel',
    color: '#2563EB',
  },
  GASOLINA_CORRIENTE: {
    name: 'Gasolina Corriente',
    icon: '⛽',
    unit: 'gal',
    density: 0.75,
    description: 'Gasolina Corriente - Octanaje 87',
    color: '#DC2626',
  },
  GASOLINA_EXTRA: {
    name: 'Gasolina Extra',
    icon: '⛽',
    unit: 'gal',
    density: 0.75,
    description: 'Gasolina Extra - Octanaje 95',
    color: '#7C3AED',
  },
  JET_A1: {
    name: 'Jet A-1',
    icon: '✈️',
    unit: 'gal',
    density: 0.8,
    description: 'Combustible para aeronaves',
    color: '#059669',
  },
};

// Niveles de stock
const STOCK_LEVELS = {
  CRITICAL: 'critical',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  FULL: 'full',
};

// Función para obtener nivel de stock
const getStockLevel = (currentStock, minThreshold, maxCapacity) => {
  if (maxCapacity === 0) return STOCK_LEVELS.CRITICAL;

  const percentage = currentStock / maxCapacity;

  if (percentage < 0.1) return STOCK_LEVELS.CRITICAL;
  if (percentage < 0.25) return STOCK_LEVELS.LOW;
  if (percentage < 0.5) return STOCK_LEVELS.MEDIUM;
  if (percentage < 0.75) return STOCK_LEVELS.HIGH;
  return STOCK_LEVELS.FULL;
};

/**
 * Validar datos de inventario
 * @param {Object} inventoryData - Datos a validar
 * @throws {Error} Si validación falla
 */
const validateInventoryData = (inventoryData) => {
  const required = ['fuelType', 'location'];

  for (const field of required) {
    if (!inventoryData[field]) {
      throw new Error(`Campo requerido: ${field}`);
    }
  }

  if (inventoryData.fuelType) {
    inventoryData.fuelType = inventoryData.fuelType.toUpperCase();
  }

  const fuelInfo = FUEL_INFO[inventoryData.fuelType];
  if (!fuelInfo) {
    throw new Error('Tipo de combustible no válido');
  }

  if (inventoryData.currentStock !== undefined && inventoryData.currentStock < 0) {
    throw new Error('El stock actual no puede ser negativo');
  }

  if (inventoryData.maxCapacity !== undefined && inventoryData.maxCapacity <= 0) {
    throw new Error('La capacidad máxima debe ser mayor a cero');
  }
};

/**
 * Crear nuevo item de inventario
 * @param {Object} inventoryData - Datos del inventario
 * @param {Object} userInfo - Información del usuario (opcional)
 * @returns {Promise<Object>} - {success, id/data, error}
 */
export async function createInventoryItem(inventoryData, userInfo = null) {
  try {
    console.log('📦 Iniciando creación de item de inventario SQL en Functions:', inventoryData);

    // Normalizar fuelType a mayúsculas
    if (inventoryData.fuelType) {
      inventoryData.fuelType = inventoryData.fuelType.toUpperCase();
    }

    const fuelInfo = FUEL_INFO[inventoryData.fuelType];
    if (!fuelInfo) {
      return { success: false, error: 'Tipo de combustible no válido' };
    }

    // Validar datos básicos
    validateInventoryData(inventoryData);

    // Verificar que no exista duplicado del mismo tipo en la misma ubicación
    const existingQuery = `
      SELECT TOP 1 id FROM ${TABLE_NAME} 
      WHERE fuelType = @fuelType AND location = @location
    `;

    const existingResult = await sqlConnection.query(existingQuery, {
      fuelType: inventoryData.fuelType,
      location: inventoryData.location.toLowerCase()
    });

    if (existingResult.length > 0) {
      return {
        success: false,
        error: `Ya existe un inventario de ${inventoryData.fuelType} en ${inventoryData.location}`
      };
    }

    // Preparar datos del inventario
    const inventoryItem = {
      fuelType: inventoryData.fuelType,
      name: inventoryData.name || fuelInfo.name,
      description: inventoryData.description || '',
      currentStock: inventoryData.currentStock || 0,
      maxCapacity: inventoryData.maxCapacity || 1000,
      minThreshold: inventoryData.minThreshold || 100,
      unit: inventoryData.unit || fuelInfo.unit || 'galones',
      location: inventoryData.location.toLowerCase(),
      pricePerUnit: inventoryData.pricePerUnit || 0,
      supplier: inventoryData.supplier || '',
      status: inventoryData.status || INVENTORY_STATUS.ACTIVE,
      createdBy: userInfo?.email || 'unknown',
      updatedBy: userInfo?.email || 'unknown',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Crear el item de inventario con OUTPUT INSERTED.* para obtener el ID
    const columns = Object.keys(inventoryItem).filter(key => key !== 'id');
    const values = columns.map((_, index) => `@param${index}`);
    const insertQuery = `
      INSERT INTO ${TABLE_NAME} (${columns.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')});
    `;

    const params = {};
    columns.forEach((col, index) => {
      params[`param${index}`] = inventoryItem[col];
    });
    
    const createResult = await sqlConnection.query(insertQuery, params);
    const insertedItem = createResult[0];

    if (!insertedItem || !insertedItem.id) {
      throw new Error('No se pudo crear el item de inventario - No se obtuvo el ID generado');
    }

    console.log('✅ Item de inventario SQL creado exitosamente en Functions:', insertedItem.id);
    return { success: true, id: insertedItem.id, data: insertedItem };

  } catch (error) {
    console.error('❌ Error al crear item de inventario SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener todos los items del inventario con filtros
 * @param {Object} filters - Filtros de búsqueda {fuelType, location, status}
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getAllInventory(filters = {}) {
  try {
    console.log('📦 Obteniendo inventario SQL en Functions con filtros:', filters);

    // Normalizar fuelType en filtros
    if (filters.fuelType) {
      filters.fuelType = filters.fuelType.toUpperCase();
    }

    // Construir filtros SQL
    let whereClause = '';
    const params = {};
    const filterConditions = [];

    if (filters.fuelType) {
      filterConditions.push('fuelType = @fuelType');
      params.fuelType = filters.fuelType;
    }
    if (filters.location) {
      filterConditions.push('location = @location');
      params.location = filters.location.toLowerCase();
    }
    if (filters.status) {
      filterConditions.push('status = @status');
      params.status = filters.status;
    }

    if (filterConditions.length > 0) {
      whereClause = `WHERE ${filterConditions.join(' AND ')}`;
    }

    const query = `
      SELECT * FROM ${TABLE_NAME}
      ${whereClause}
      ORDER BY fuelType, location
    `;

    const result = await sqlConnection.query(query, params);

    if (result.length > 0) {
      // Enriquecer datos con información adicional
      const enrichedData = result.map(item => {
        const fuelInfo = FUEL_INFO[item.fuelType] || {};
        return {
          ...item,
          stockLevel: getStockLevel(item.currentStock, item.minThreshold, item.maxCapacity),
          fuelInfo: fuelInfo,
          stockPercentage: item.maxCapacity > 0 ? (item.currentStock / item.maxCapacity) * 100 : 0,
          // Convertir timestamps para compatibilidad con frontend
          createdAt: item.createdAt ? item.createdAt.toISOString() : null,
          updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
        };
      });
      return { success: true, data: enrichedData, count: enrichedData.length };
    }

    return { success: true, data: [], count: 0 };

  } catch (error) {
    console.error('❌ Error al obtener inventario SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener item específico por ID
 * @param {string} itemId - ID del item
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getInventoryItem(itemId) {
  try {
    if (!itemId) {
      return { success: false, error: 'ID es requerido' };
    }

    const query = `SELECT * FROM ${TABLE_NAME} WHERE id = @id`;
    const result = await sqlConnection.query(query, { id: itemId });

    if (result.length === 0) {
      return { success: false, error: 'Item de inventario no encontrado' };
    }

    const item = result[0];
    const fuelInfo = FUEL_INFO[item.fuelType] || {};

    // Convertir timestamps y enriquecer datos
    const enrichedData = {
      ...item,
      stockLevel: getStockLevel(item.currentStock, item.minThreshold, item.maxCapacity),
      fuelInfo: fuelInfo,
      stockPercentage: item.maxCapacity > 0 ? (item.currentStock / item.maxCapacity) * 100 : 0,
      createdAt: item.createdAt ? item.createdAt.toISOString() : null,
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
    };

    return { success: true, data: enrichedData };

  } catch (error) {
    console.error('❌ Error al obtener item de inventario SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar item de inventario
 * @param {string} itemId - ID del item
 * @param {Object} updateData - Datos a actualizar
 * @param {Object} userInfo - Información del usuario (opcional)
 * @returns {Promise<Object>} - {success, id, error}
 */
export async function updateInventoryItem(itemId, updateData, userInfo = null) {
  try {
    if (!itemId) {
      return { success: false, error: 'ID es requerido' };
    }

    console.log('📦 Actualizando item de inventario SQL en Functions:', itemId, updateData);

    // Preparar datos de actualización
    const updateItem = {
      ...updateData,
      updatedBy: userInfo?.email || 'unknown',
      updatedAt: new Date(),
    };

    // Normalizar fuelType si está presente
    if (updateItem.fuelType) {
      updateItem.fuelType = updateItem.fuelType.toUpperCase();
    }

    // Construir UPDATE
    const setParts = [];
    const params = { id: itemId };

    Object.entries(updateItem).forEach(([column, value], index) => {
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

  await sqlConnection.execute(query, params);

    return {
      success: true,
      id: itemId,
      message: 'Item de inventario actualizado exitosamente',
    };

  } catch (error) {
    console.error('❌ Error al actualizar item de inventario SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Eliminar item de inventario
 * @param {string} itemId - ID del item
 * @returns {Promise<Object>} - {success, message, error}
 */
export async function deleteInventoryItem(itemId) {
  try {
    if (!itemId) {
      return { success: false, error: 'ID es requerido' };
    }

    console.log('📦 Eliminando item de inventario SQL en Functions:', itemId);

    // Verificar que no tenga stock
    const itemResult = await getInventoryItem(itemId);
    if (!itemResult.success) {
      return itemResult;
    }

    const item = itemResult.data;
    if (item.currentStock > 0) {
      return {
        success: false,
        error: 'No se puede eliminar un item con stock. Reduzca el stock a 0 primero.'
      };
    }

    // Eliminar el item
    const deleteQuery = `DELETE FROM ${TABLE_NAME} WHERE id = @id`;
  await sqlConnection.execute(deleteQuery, { id: itemId });

    console.log('✅ Item de inventario SQL eliminado exitosamente en Functions');
    return { success: true, message: 'Item de inventario eliminado exitosamente' };

  } catch (error) {
    console.error('❌ Error al eliminar item de inventario SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener inventario por ubicación
 * @param {string} location - Ubicación a filtrar
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getInventoryByLocation(location) {
  try {
    if (!location) {
      return { success: false, error: 'Ubicación es requerida' };
    }

    console.log('📦 Obteniendo inventario por ubicación SQL en Functions:', location);

    const filters = { location: location.toLowerCase() };
    return await getAllInventory(filters);

  } catch (error) {
    console.error('❌ Error al obtener inventario por ubicación SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar stock después de un movimiento
 * @param {string} itemId - ID del item
 * @param {number} quantity - Cantidad del movimiento (positiva para entrada, negativa para salida)
 * @param {Object} movementInfo - Información del movimiento
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function updateStock(itemId, quantity, movementInfo = {}) {
  try {
    console.log('📦 Actualizando stock SQL en Functions:', itemId, quantity);

    // Obtener stock actual
    const getCurrentStockQuery = `
      SELECT currentStock, maxCapacity, minThreshold, fuelType, location
      FROM ${TABLE_NAME} WHERE id = @itemId
    `;

    const currentResult = await sqlConnection.query(getCurrentStockQuery, { itemId });

    if (currentResult.length === 0) {
      return { success: false, error: 'Item de inventario no encontrado' };
    }

    const currentItem = currentResult[0];
    const newStock = parseFloat(currentItem.currentStock) + parseFloat(quantity);

    // Validar que el stock no sea negativo
    if (newStock < 0) {
      return {
        success: false,
        error: `Stock insuficiente. Stock actual: ${currentItem.currentStock}, cantidad solicitada: ${Math.abs(quantity)}`
      };
    }

    // Validar que no exceda la capacidad máxima
    if (newStock > currentItem.maxCapacity) {
      return {
        success: false,
        error: `La cantidad excede la capacidad máxima. Capacidad: ${currentItem.maxCapacity}, nuevo stock: ${newStock}`
      };
    }

    // Actualizar stock y información del último movimiento
    const updateStockQuery = `
      UPDATE ${TABLE_NAME}
      SET
        currentStock = @newStock,
        lastMovementId = @movementId,
        lastMovementType = @movementType,
        lastMovementQuantity = @movementQuantity,
        lastMovementDate = @movementDate,
        updatedAt = @updatedAt,
        updatedBy = @updatedBy
      WHERE id = @itemId
    `;

    await sqlConnection.execute(updateStockQuery, {
      itemId,
      newStock,
      movementId: movementInfo.movementId || null,
      movementType: movementInfo.type || null,
      movementQuantity: quantity,
      movementDate: movementInfo.date || new Date(),
      updatedAt: new Date(),
      updatedBy: movementInfo.updatedBy || 'system'
    });

    return {
      success: true,
      data: {
        previousStock: currentItem.currentStock,
        newStock: newStock,
        quantity: quantity,
      },
      message: 'Stock actualizado exitosamente',
    };

  } catch (error) {
    console.error('❌ Error al actualizar stock SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener items con stock bajo
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getLowStockItems() {
  try {
    console.log('📦 Obteniendo items con stock bajo SQL en Functions');

    const query = `
      SELECT * FROM ${TABLE_NAME}
      WHERE currentStock <= minThreshold AND status = 'active'
      ORDER BY (currentStock / NULLIF(minThreshold, 0)) ASC
    `;

    const result = await sqlConnection.query(query, {});

    if (result.length > 0) {
      const enrichedData = result.map(item => {
        const fuelInfo = FUEL_INFO[item.fuelType] || {};
        return {
          ...item,
          stockLevel: getStockLevel(item.currentStock, item.minThreshold, item.maxCapacity),
          fuelInfo: fuelInfo,
          stockPercentage: item.maxCapacity > 0 ? (item.currentStock / item.maxCapacity) * 100 : 0,
          createdAt: item.createdAt ? item.createdAt.toISOString() : null,
          updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
        };
      });
      return { success: true, data: enrichedData, count: enrichedData.length };
    }

    return { success: true, data: [], count: 0 };

  } catch (error) {
    console.error('❌ Error al obtener items con stock bajo SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener resumen del inventario
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getInventorySummary() {
  try {
    console.log('📦 Obteniendo resumen de inventario SQL en Functions');

    const query = `
      SELECT
        COUNT(*) as totalItems,
        SUM(CASE WHEN currentStock <= minThreshold THEN 1 ELSE 0 END) as lowStockItems,
        SUM(currentStock * pricePerUnit) as totalValue,
        AVG(currentStock / NULLIF(maxCapacity, 0) * 100) as avgStockPercentage,
        COUNT(DISTINCT location) as totalLocations,
        COUNT(DISTINCT fuelType) as totalFuelTypes
      FROM ${TABLE_NAME}
      WHERE status = 'active'
    `;

    const result = await sqlConnection.query(query, {});

    if (result.length > 0) {
      return { success: true, data: result[0] };
    }

    return { success: true, data: {
      totalItems: 0,
      lowStockItems: 0,
      totalValue: 0,
      avgStockPercentage: 0,
      totalLocations: 0,
      totalFuelTypes: 0,
    }};

  } catch (error) {
    console.error('❌ Error al obtener resumen de inventario SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}