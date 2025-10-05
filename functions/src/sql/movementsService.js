/**
 * movementsService.js - Servicio de movimientos usando SQL Server DigitalOcean en Firebase Functions
 * Migrado desde combustibles/src/services/SqlMovementsService.js
 * Forestech Combustibles App - TASK-002
 */

import sqlConnection from '../cloudsql/oil-connection.js';

const TABLE_NAME = 'combustibles_movements';
const INVENTORY_TABLE = 'combustibles_inventory';
const VEHICLES_TABLE = 'combustibles_vehicles';

/**
 * Verificar si una tabla específica existe en la base de datos
 * @param {string} tableName - Nombre de la tabla a verificar
 * @returns {Promise<boolean>} - true si existe, false si no
 */
const checkTableExists = async (tableName) => {
  try {
    const query = `
      SELECT COUNT(*) as tableExists
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = @tableName
      AND TABLE_SCHEMA = SCHEMA_NAME()
    `;
    
    const result = await sqlConnection.query(query, { tableName });
    const exists = result[0]?.tableExists > 0;
    
    return exists;
  } catch (error) {
    console.error(`🔍 Error verificando tabla ${tableName}:`, error.message);
    return false;
  }
};

/**
 * Verificar que las tablas requeridas existan antes de operaciones críticas
 * @returns {Promise<Object>} - Resultado de la verificación
 */
const verifyRequiredTables = async () => {
  try {
    const movementsTableExists = await checkTableExists(TABLE_NAME);
    const inventoryTableExists = await checkTableExists(INVENTORY_TABLE);
    const vehiclesTableExists = await checkTableExists(VEHICLES_TABLE);
    
    const missingTables = [];
    if (!movementsTableExists) missingTables.push(TABLE_NAME);
    if (!inventoryTableExists) missingTables.push(INVENTORY_TABLE);
    if (!vehiclesTableExists) missingTables.push(VEHICLES_TABLE);
    
    return {
      success: missingTables.length === 0,
      movementsTableExists,
      inventoryTableExists,
      vehiclesTableExists,
      missingTables,
      message: missingTables.length > 0 
        ? `Faltan tablas: ${missingTables.join(', ')}. Ejecute inicialización de base de datos.`
        : 'Todas las tablas requeridas existen'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Error al verificar tablas requeridas'
    };
  }
};

// Tipos de movimientos (mantenemos compatibilidad)
export const MOVEMENT_TYPES = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
  TRANSFERENCIA: 'transferencia',
  AJUSTE: 'ajuste',
  MANTENIMIENTO: 'mantenimiento',
};

export const MOVEMENT_STATUS = {
  PENDIENTE: 'pendiente',
  COMPLETADO: 'completado',
  CANCELADO: 'cancelado',
};

// Funciones precisas locales (copiadas de calculations.js)
const preciseAdd = (a, b, decimals = 2) => {
  const numA = parseFloat(a) || 0;
  const numB = parseFloat(b) || 0;
  return parseFloat((numA + numB).toFixed(decimals));
};

const preciseSubtract = (a, b, decimals = 2) => {
  const numA = parseFloat(a) || 0;
  const numB = parseFloat(b) || 0;
  return parseFloat((numA - numB).toFixed(decimals));
};

const preciseRound = (value, decimals = 2) => {
  const num = parseFloat(value) || 0;
  return parseFloat(num.toFixed(decimals));
};

/**
 * Validar datos de movimiento (interna)
 * @param {Object} movementData - Datos a validar
 * @throws {Error} Si validación falla
 */
const validateMovementData = (movementData) => {
  const required = ['type', 'fuelType', 'quantity', 'unitPrice'];

  for (const field of required) {
    if (!movementData[field]) {
      throw new Error(`Campo requerido: ${field}`);
    }
  }

  if (movementData.fuelType) {
    movementData.fuelType = movementData.fuelType.toUpperCase();
  }

  if (!Object.values(MOVEMENT_TYPES).includes(movementData.type)) {
    throw new Error('Tipo de movimiento inválido');
  }

  if (movementData.quantity <= 0) {
    throw new Error('La cantidad debe ser mayor a cero');
  }

  if (movementData.unitPrice < 0) {
    throw new Error('El precio unitario no puede ser negativo');
  }

  // Validaciones específicas por tipo
  if (movementData.type === MOVEMENT_TYPES.SALIDA && !movementData.vehicleId) {
    throw new Error('Las salidas deben tener un vehículo asociado');
  }

  if (movementData.type === MOVEMENT_TYPES.TRANSFERENCIA && !movementData.destinationLocation) {
    throw new Error('Las transferencias deben tener una ubicación destino');
  }

  if (movementData.type === MOVEMENT_TYPES.ENTRADA) {
    if (!movementData.supplierName) {
      throw new Error('Las entradas deben tener un proveedor');
    }
    if (!movementData.destinationLocation) {
      throw new Error('Las entradas deben tener una ubicación destino');
    }
  }
};

/**
 * Calcular valor total del movimiento (interna)
 * @param {Object} movementData - Datos del movimiento
 * @returns {number} - Valor total
 */
const calculateMovementValue = (movementData) => {
  return preciseRound((movementData.quantity || 0) * (movementData.unitPrice || 0));
};

/**
 * Actualizar inventario desde movimiento (interna, dentro de transacción)
 * @param {Object} transaction - Objeto de transacción mssql
 * @param {Object} movement - Datos del movimiento
 * @param {string} movementId - ID del movimiento
 * @throws {Error} Si falla la actualización
 */
const updateInventoryFromMovement = async (transaction, movement, movementId) => {
  try {
    // Determinar ubicación correcta
    let targetLocation = movement.location || 'principal';
    if (movement.type === MOVEMENT_TYPES.ENTRADA) {
      targetLocation = movement.destinationLocation || 'principal';
    }

    console.log(`🔍 Buscando inventario: fuelType=${movement.fuelType}, location=${targetLocation}`);

    // Buscar item de inventario
    const inventoryQuery = `
      SELECT * FROM ${INVENTORY_TABLE}
      WHERE fuelType = @fuelType AND location = @location
    `;

    const request = transaction.request();
    request.input('fuelType', movement.fuelType);
    request.input('location', targetLocation);
    const inventoryResult = await request.query(inventoryQuery);

    console.log(`📦 Inventario encontrado: ${inventoryResult.recordset.length} registros`);
    if (inventoryResult.recordset.length > 0) {
      console.log(`   Stock actual: ${inventoryResult.recordset[0].currentStock}`);
      console.log(`   Movimiento cantidad: ${movement.quantity}`);
    }

    if (inventoryResult.recordset.length === 0) {
      // Crear inventario automáticamente
      if (movement.type !== MOVEMENT_TYPES.ENTRADA) {
        throw new Error(`No se encontró inventario para ${movement.fuelType} en ${targetLocation}`);
      }

      console.log(`📦 Creando inventario SQL automático para ${movement.fuelType} en ${targetLocation}`);

      const newInventory = {
        fuelType: movement.fuelType,
        location: targetLocation,
        name: movement.fuelType,
        maxCapacity: 1000,
        currentStock: preciseRound(movement.quantity, 2),
        minThreshold: 150,
        pricePerUnit: movement.unitPrice || 0,
        status: 'active',
        lastMovementId: movementId,
        lastMovementType: movement.type,
        lastMovementQuantity: movement.quantity,
        lastMovementDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const columns = Object.keys(newInventory);
      const values = columns.map((_, index) => `@param${index}`);
      const insertQuery = `
        INSERT INTO ${INVENTORY_TABLE} (${columns.join(', ')})
        VALUES (${values.join(', ')})
      `;

      const insertRequest = transaction.request();
      columns.forEach((col, index) => {
        insertRequest.input(`param${index}`, newInventory[col]);
      });
      await insertRequest.query(insertQuery);

    } else {
      // Actualizar inventario existente
      const inventory = inventoryResult.recordset[0];
      let newQuantity = inventory.currentStock;

      // Aplicar cambio según tipo de movimiento
      switch (movement.type) {
        case MOVEMENT_TYPES.ENTRADA:
          newQuantity = preciseAdd(newQuantity, movement.quantity);
          break;
        case MOVEMENT_TYPES.SALIDA:
          newQuantity = preciseSubtract(newQuantity, movement.quantity);
          if (newQuantity < 0) {
            throw new Error('Stock insuficiente para realizar la salida');
          }
          break;
        case MOVEMENT_TYPES.AJUSTE:
          newQuantity = preciseAdd(newQuantity, movement.quantity);
          if (newQuantity < 0) newQuantity = 0;
          break;
        case MOVEMENT_TYPES.TRANSFERENCIA:
          newQuantity = preciseSubtract(newQuantity, movement.quantity);
          if (newQuantity < 0) {
            throw new Error('Stock insuficiente para realizar la transferencia');
          }
          // TODO: Implementar transferencia al destino
          break;
      }

      newQuantity = preciseRound(newQuantity, 2);

      const updateQuery = `
        UPDATE ${INVENTORY_TABLE}
        SET currentStock = @currentStock,
            lastMovementId = @lastMovementId,
            lastMovementType = @lastMovementType,
            lastMovementQuantity = @lastMovementQuantity,
            lastMovementDate = @lastMovementDate,
            updatedAt = @updatedAt
        WHERE id = @id
      `;

      const updateRequest = transaction.request();
      updateRequest.input('id', inventory.id);
      updateRequest.input('currentStock', newQuantity);
      updateRequest.input('lastMovementId', movementId);
      updateRequest.input('lastMovementType', movement.type);
      updateRequest.input('lastMovementQuantity', movement.quantity);
      updateRequest.input('lastMovementDate', new Date());
      updateRequest.input('updatedAt', new Date());
      await updateRequest.query(updateQuery);
    }

  } catch (error) {
    console.error('❌ Error al actualizar inventario SQL en Functions:', error);
    throw error;
  }
};

/**
 * Revertir cambios de inventario (interna, dentro de transacción)
 * @param {Object} transaction - Objeto de transacción mssql
 * @param {Object} movement - Movimiento a revertir
 * @throws {Error} Si falla la reversión
 */
const revertInventoryChanges = async (transaction, movement) => {
  try {
    console.log('🔄 Revirtiendo cambios de inventario SQL para movimiento:', movement.id);

    // Lógica simplificada para reversión
    let targetLocation = movement.location || 'principal';
    if (movement.type === MOVEMENT_TYPES.ENTRADA) {
      targetLocation = movement.destinationLocation || 'principal';
    }

    const inventoryQuery = `
      SELECT * FROM ${INVENTORY_TABLE}
      WHERE fuelType = @fuelType AND location = @location
    `;

    const request = transaction.request();
    request.input('fuelType', movement.fuelType);
    request.input('location', targetLocation);
    const inventoryResult = await request.query(inventoryQuery);

    if (inventoryResult.recordset.length > 0) {
      const inventory = inventoryResult.recordset[0];
      let newQuantity = inventory.currentStock;

      // Revertir según tipo de movimiento
      switch (movement.type) {
        case MOVEMENT_TYPES.ENTRADA:
          newQuantity = preciseSubtract(newQuantity, movement.quantity);
          if (newQuantity < 0) newQuantity = 0;
          break;
        case MOVEMENT_TYPES.SALIDA:
        case MOVEMENT_TYPES.MANTENIMIENTO:
          newQuantity = preciseAdd(newQuantity, movement.quantity);
          break;
        case MOVEMENT_TYPES.AJUSTE:
          newQuantity = preciseSubtract(newQuantity, movement.quantity);
          if (newQuantity < 0) newQuantity = 0;
          break;
        case MOVEMENT_TYPES.TRANSFERENCIA:
          newQuantity = preciseAdd(newQuantity, movement.quantity);
          break;
      }

      newQuantity = preciseRound(newQuantity, 2);

      const updateQuery = `
        UPDATE ${INVENTORY_TABLE}
        SET currentStock = @currentStock,
            lastMovementId = NULL,
            updatedAt = @updatedAt
        WHERE id = @id
      `;

      const updateRequest = transaction.request();
      updateRequest.input('id', inventory.id);
      updateRequest.input('currentStock', newQuantity);
      updateRequest.input('updatedAt', new Date());
      await updateRequest.query(updateQuery);
    }

  } catch (error) {
    console.error('❌ Error al revertir inventario SQL en Functions:', error);
    throw error;
  }
};

/**
 * Crear nuevo movimiento con lógica de negocio
 * @param {Object} movementData - Datos del movimiento
 * @param {Object} userInfo - Información del usuario (opcional)
 * @returns {Promise<Object>} - Resultado de la operación {success, id/data, error}
 */
export async function createMovement(movementData, userInfo = null) {
  try {
    console.log('🚀 Iniciando creación de movimiento SQL en Functions:', movementData);
    console.log('👤 Información del usuario:', userInfo);

    // Verificar que las tablas requeridas existan
    const tableVerification = await verifyRequiredTables();
    if (!tableVerification.success) {
      console.error('❌ Error en verificación de tablas:', tableVerification.message);
      return {
        success: false,
        error: tableVerification.message,
        code: 'MISSING_TABLES',
        missingTables: tableVerification.missingTables || [],
        recommendation: 'Ejecute /system/autorepair o /sqlInitializeDatabase para crear las tablas faltantes'
      };
    }

    console.log('✅ Verificación de tablas exitosa');

    // Normalizar fuelType
    if (movementData.fuelType) {
      movementData.fuelType = movementData.fuelType.toUpperCase();
    }

    console.log('🔧 Datos normalizados:', movementData);

    // Validar datos básicos
    validateMovementData(movementData);
    console.log('✅ Validación de datos exitosa');

    // Preparar datos del movimiento
    const movement = {
      type: movementData.type,
      fuelType: movementData.fuelType,
      quantity: preciseRound(movementData.quantity),
      unitPrice: preciseRound(movementData.unitPrice || 0),
      totalValue: preciseRound(calculateMovementValue(movementData)),
      vehicleId: movementData.vehicleId || null,
      location: movementData.location?.toLowerCase() || 'principal',
      destinationLocation: movementData.destinationLocation?.toLowerCase() || null,
      description: movementData.description || '',
      effectiveDate: movementData.effectiveDate || new Date(),

      // Metadatos específicos por tipo
      ...(movementData.type === MOVEMENT_TYPES.ENTRADA && {
        supplierName: movementData.supplierName,
        invoiceNumber: movementData.invoiceNumber || null,
        purchaseOrderNumber: movementData.purchaseOrderNumber || null,
      }),

      // Información del usuario
      createdBy: userInfo?.email || 'unknown',
      createdByUid: userInfo?.uid || null,
      createdByName: userInfo?.displayName || userInfo?.email || 'Usuario',

      // Timestamps
      status: 'completed',
      approvedBy: userInfo?.email || 'system',
      approvedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Crear movimiento en transacción para actualizar inventario
    const result = await sqlConnection.transaction(async (transaction) => {
      // Crear el movimiento
      const columns = Object.keys(movement).filter(key => key !== 'id');
      const values = columns.map((_, index) => `@param${index}`);
      const insertQuery = `
        INSERT INTO ${TABLE_NAME} (${columns.join(', ')})
        OUTPUT INSERTED.*
        VALUES (${values.join(', ')});
      `;

      const insertRequest = transaction.request();
      columns.forEach((col, index) => {
        insertRequest.input(`param${index}`, movement[col]);
      });
      const createResult = await insertRequest.query(insertQuery);
      const movementId = createResult.recordset[0]?.id;

      if (!movementId) {
        throw new Error('No se pudo crear el movimiento');
      }

      // Actualizar inventario
      await updateInventoryFromMovement(transaction, movement, movementId);

      return { id: movementId, ...movement };
    });

    console.log('✅ Movimiento SQL creado exitosamente en Functions:', result.id);
    return { success: true, id: result.id, data: result };

  } catch (error) {
    console.error('❌ Error al crear movimiento SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener movimientos con filtros
 * @param {Object} filters - Filtros de búsqueda {type, status, fuelType, vehicleId}
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getAllMovements(filters = {}) {
  try {
    // Verificar que la tabla de movimientos exista
    const movementsTableExists = await checkTableExists(TABLE_NAME);
    if (!movementsTableExists) {
      console.warn(`⚠️ Tabla ${TABLE_NAME} no existe - retornando lista vacía`);
      return {
        success: true,
        data: [],
        count: 0,
        message: `Tabla ${TABLE_NAME} no existe. Ejecute inicialización de base de datos.`,
        code: 'MISSING_TABLE',
        recommendation: 'Ejecute /system/autorepair o /sqlInitializeDatabase para crear las tablas faltantes'
      };
    }

    // Normalizar fuelType en filtros
    if (filters.fuelType) {
      filters.fuelType = filters.fuelType.toUpperCase();
    }

    // Construir filtros SQL
    let whereClause = '';
    const params = {};
    const filterConditions = [];

    if (filters.type) {
      filterConditions.push('type = @type');
      params.type = filters.type;
    }
    if (filters.status) {
      filterConditions.push('status = @status');
      params.status = filters.status;
    }
    if (filters.fuelType) {
      filterConditions.push('fuelType = @fuelType');
      params.fuelType = filters.fuelType;
    }
    if (filters.vehicleId) {
      filterConditions.push('vehicleId = @vehicleId');
      params.vehicleId = filters.vehicleId;
    }

    if (filterConditions.length > 0) {
      whereClause = `WHERE ${filterConditions.join(' AND ')}`;
    }

    // Paginación: limit y offset
    const limit = filters.limit || 100; // Default 100 registros
    const offset = filters.offset || 0;

    const query = `
      SELECT * FROM ${TABLE_NAME}
      ${whereClause}
      ORDER BY createdAt DESC
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    const result = await sqlConnection.query(query, params);

    if (result.length > 0) {
      // Convertir timestamps para compatibilidad con frontend
      const formattedData = result.map(movement => ({
        ...movement,
        createdAt: movement.createdAt ? movement.createdAt.toISOString() : null,
        updatedAt: movement.updatedAt ? movement.updatedAt.toISOString() : null,
        effectiveDate: movement.effectiveDate ? movement.effectiveDate.toISOString() : null,
      }));
      return { success: true, data: formattedData, count: formattedData.length, limit, offset };
    }

    return { success: true, data: [], count: 0, limit, offset };

  } catch (error) {
    console.error('❌ Error al obtener movimientos SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener movimiento específico por ID
 * @param {string} movementId - ID del movimiento
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getMovement(movementId) {
  try {
    if (!movementId) {
      return { success: false, error: 'ID es requerido' };
    }

    const query = `SELECT * FROM ${TABLE_NAME} WHERE id = @id`;
    const result = await sqlConnection.query(query, { id: movementId });

    if (result.length === 0) {
      return { success: false, error: 'Movimiento no encontrado' };
    }

    const movement = result[0];
    // Convertir timestamps
    const formattedData = {
      ...movement,
      createdAt: movement.createdAt ? movement.createdAt.toISOString() : null,
      updatedAt: movement.updatedAt ? movement.updatedAt.toISOString() : null,
      effectiveDate: movement.effectiveDate ? movement.effectiveDate.toISOString() : null,
    };

    return { success: true, data: formattedData };

  } catch (error) {
    console.error('❌ Error al obtener movimiento SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar movimiento
 * @param {string} movementId - ID del movimiento
 * @param {Object} updateData - Datos a actualizar
 * @param {Object} userInfo - Información del usuario (opcional)
 * @returns {Promise<Object>} - {success, id, error}
 */
export async function updateMovement(movementId, updateData, userInfo = null) {
  try {
    if (!movementId) {
      return { success: false, error: 'ID es requerido' };
    }

    // Obtener movimiento actual para recalcular si es necesario
    const currentResult = await getMovement(movementId);
    if (!currentResult.success) {
      return currentResult;
    }

    const currentMovement = currentResult.data;

    // Recalcular valor si cambian cantidades o precios
    if (updateData.quantity || updateData.unitPrice) {
      updateData.totalValue = calculateMovementValue({
        ...currentMovement,
        ...updateData,
      });
    }

    updateData.updatedAt = new Date();
    if (userInfo) {
      updateData.updatedBy = userInfo.email || 'unknown';
    }

    // Construir UPDATE
    const setParts = [];
    const params = { id: movementId };

    Object.entries(updateData).forEach(([column, value], index) => {
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
      id: movementId,
      message: 'Movimiento actualizado exitosamente',
      rowsAffected: result.rowsAffected,
    };

  } catch (error) {
    console.error('❌ Error al actualizar movimiento SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Eliminar movimiento y revertir inventario
 * @param {string} movementId - ID del movimiento
 * @returns {Promise<Object>} - {success, message, error}
 */
export async function deleteMovement(movementId) {
  try {
    if (!movementId) {
      return { success: false, error: 'ID es requerido' };
    }

    // Obtener el movimiento para poder revertirlo
    const movementResult = await getMovement(movementId);
    if (!movementResult.success) {
      return movementResult;
    }

    const movement = movementResult.data;

    // Ejecutar en transacción
    await sqlConnection.transaction(async (transaction) => {
      // Revertir cambios de inventario
      await revertInventoryChanges(transaction, movement);

      // Eliminar el movimiento (hard delete)
      const deleteQuery = `DELETE FROM ${TABLE_NAME} WHERE id = @id`;
      const deleteRequest = transaction.request();
      deleteRequest.input('id', movementId);
      await deleteRequest.query(deleteQuery);
    });

    console.log('✅ Movimiento SQL eliminado y cambios de inventario revertidos en Functions');
    return { success: true, message: 'Movimiento eliminado exitosamente' };

  } catch (error) {
    console.error('❌ Error al eliminar movimiento SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener estadísticas de movimientos
 * @param {Object} filters - Filtros opcionales (type, fuelType, status, dateRange)
 * @returns {Promise<Object>} - Estadísticas calculadas
 */
export async function getMovementsStats(filters = {}) {
  try {
    console.log('📊 Calculando estadísticas de movimientos con filtros:', filters);

    const verifyResult = await verifyRequiredTables();
    if (!verifyResult.success) {
      return verifyResult;
    }

    // Construir query con filtros
    let whereClause = '1=1';
    const params = {};

    if (filters.type) {
      whereClause += ' AND type = @type';
      params.type = filters.type;
    }
    if (filters.fuelType) {
      whereClause += ' AND fuelType = @fuelType';
      params.fuelType = filters.fuelType;
    }
    if (filters.status) {
      whereClause += ' AND status = @status';
      params.status = filters.status;
    }
    if (filters.dateRange && filters.dateRange !== 'all') {
      const days = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      }[filters.dateRange] || 30;
      
      whereClause += ' AND createdAt >= DATEADD(day, -@days, GETDATE())';
      params.days = days;
    }

    const query = `
      SELECT 
        COUNT(*) as totalMovements,
        ISNULL(SUM(quantity * unitPrice), 0) as totalValue,
        ISNULL(AVG(quantity * unitPrice), 0) as avgValue,
        COUNT(CASE WHEN type = 'entrada' THEN 1 END) as totalEntradas,
        COUNT(CASE WHEN type = 'salida' THEN 1 END) as totalSalidas,
        COUNT(CASE WHEN type = 'transferencia' THEN 1 END) as totalTransferencias,
        COUNT(CASE WHEN type = 'ajuste' THEN 1 END) as totalAjustes,
        COUNT(CASE WHEN status = 'pendiente' THEN 1 END) as movimientosPendientes,
        COUNT(CASE WHEN status = 'completado' THEN 1 END) as movimientosCompletados,
        COUNT(CASE WHEN fuelType = 'ACPM' THEN 1 END) as movimientosACPM,
        COUNT(CASE WHEN fuelType = 'GASOLINA_CORRIENTE' THEN 1 END) as movimientosGasolina,
        ISNULL(SUM(CASE WHEN type = 'entrada' THEN quantity ELSE 0 END), 0) as totalEntradasVolumen,
        ISNULL(SUM(CASE WHEN type = 'salida' THEN quantity ELSE 0 END), 0) as totalSalidasVolumen,
        MAX(createdAt) as fechaUltimoMovimiento
      FROM ${TABLE_NAME}
      WHERE ${whereClause}
    `;

    const result = await sqlConnection.query(query, params);
    
    if (!result || result.length === 0) {
      return {
        success: true,
        data: {
          totalMovements: 0,
          totalValue: 0,
          avgValue: 0,
          byType: {},
          byFuelType: {},
          byStatus: {},
          lastMovement: null
        }
      };
    }

    const data = result[0];
    
    const stats = {
      totalMovements: data.totalMovements || 0,
      totalValue: parseFloat(data.totalValue) || 0,
      avgValue: parseFloat(data.avgValue) || 0,
      byType: {
        entrada: data.totalEntradas || 0,
        salida: data.totalSalidas || 0,
        transferencia: data.totalTransferencias || 0,
        ajuste: data.totalAjustes || 0
      },
      byFuelType: {
        ACPM: data.movimientosACPM || 0,
        GASOLINA_CORRIENTE: data.movimientosGasolina || 0
      },
      byStatus: {
        pendiente: data.movimientosPendientes || 0,
        completado: data.movimientosCompletados || 0
      },
      volumeStats: {
        totalEntradas: parseFloat(data.totalEntradasVolumen) || 0,
        totalSalidas: parseFloat(data.totalSalidasVolumen) || 0,
        balance: parseFloat(data.totalEntradasVolumen || 0) - parseFloat(data.totalSalidasVolumen || 0)
      },
      lastMovement: data.fechaUltimoMovimiento || null
    };

    console.log('✅ Estadísticas de movimientos calculadas exitosamente');
    return { success: true, data: stats };

  } catch (error) {
    console.error('❌ Error al calcular estadísticas de movimientos:', error);
    return { success: false, error: error.message };
  }
}