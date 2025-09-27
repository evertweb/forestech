/**
 * maintenanceService.js - Servicio de mantenimientos usando Azure SQL Server en Firebase Functions
 * Migrado desde combustibles/src/services/maintenanceService.js
 * Forestech Combustibles App - TASK-006
 */

import sqlConnection from './SqlConnection.js';

const TABLE_NAME = 'combustibles_maintenance';
const VEHICLES_TABLE = 'combustibles_vehicles';

// Tipos de mantenimiento
export const MAINTENANCE_TYPES = {
  OIL_CHANGE: 'oil_change',
  BATTERY_CHANGE: 'battery_change',
  FILTER_CHANGE: 'filter_change',
  GENERAL_MAINTENANCE: 'general_maintenance'
};

// Estados de mantenimiento
export const MAINTENANCE_STATUS = {
  COMPLETED: 'completado',
  PENDING: 'pendiente',
  CANCELLED: 'cancelado'
};

// Estados de baterías
export const BATTERY_STATUS = {
  NEW: 'nueva',
  USED: 'usada',
  REPAIRED: 'reparada'
};

// Constantes de mantenimiento
export const MAINTENANCE_CONSTANTS = {
  OIL_CHANGE_HOURS: 250,      // Cambio de aceite cada 250 horas
  FILTER_CHANGE_HOURS: 500,   // Cambio de filtros cada 500 horas
  BATTERY_LIFETIME_MONTHS: 24 // Vida útil batería 24 meses
};

/**
 * Validar datos de mantenimiento (interna)
 * @param {Object} data - Datos a validar
 * @throws {Error} Si validación falla
 */
const validateMaintenanceData = (data) => {
  const errors = [];

  if (!data.type) {
    errors.push('El tipo de mantenimiento es obligatorio');
  }

  if (!data.vehicleId) {
    errors.push('El vehículo es obligatorio');
  }

  if (!data.date) {
    errors.push('La fecha es obligatoria');
  }

  if (data.type === MAINTENANCE_TYPES.OIL_CHANGE) {
    if (!data.quantity || data.quantity <= 0) {
      errors.push('La cantidad de aceite es obligatoria y debe ser mayor a 0');
    }
    if (!data.currentHours || data.currentHours < 0) {
      errors.push('La lectura del horómetro es obligatoria');
    }
  }

  if (data.type === MAINTENANCE_TYPES.BATTERY_CHANGE) {
    if (!data.batteryType) {
      errors.push('El tipo de batería es obligatorio');
    }
    if (!data.cost || data.cost <= 0) {
      errors.push('El costo de la batería es obligatorio');
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
};

/**
 * Validar datos de actualización de mantenimiento (interna)
 * @param {Object} data - Datos a validar
 * @throws {Error} Si validación falla
 */
const validateMaintenanceUpdateData = (data) => {
  const errors = [];

  if (data.type && !Object.values(MAINTENANCE_TYPES).includes(data.type)) {
    errors.push('Tipo de mantenimiento inválido');
  }

  if (data.status && !Object.values(MAINTENANCE_STATUS).includes(data.status)) {
    errors.push('Estado de mantenimiento inválido');
  }

  if (data.batteryStatus && !Object.values(BATTERY_STATUS).includes(data.batteryStatus)) {
    errors.push('Estado de batería inválido');
  }

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }
};

/**
 * Calcular próximo cambio de aceite basado en horómetro actual
 * @param {number} currentHours - Horas actuales
 * @returns {number} - Próximo cambio
 */
const calculateNextOilChange = (currentHours) => {
  return parseInt(currentHours) + MAINTENANCE_CONSTANTS.OIL_CHANGE_HOURS;
};

/**
 * Calcular próxima fecha de cambio de batería
 * @param {Date|string} lastChangeDate - Fecha del último cambio
 * @returns {Date} - Próxima fecha de cambio
 */
const calculateNextBatteryChange = (lastChangeDate) => {
  const date = new Date(lastChangeDate);
  date.setMonth(date.getMonth() + MAINTENANCE_CONSTANTS.BATTERY_LIFETIME_MONTHS);
  return date;
};

/**
 * Actualizar horómetro del vehículo (para tractores)
 * @param {string} vehicleId - ID del vehículo
 * @param {number} newHours - Nuevas horas
 * @returns {Promise<Object>} - Resultado de la operación
 */
const updateVehicleHourMeter = async (vehicleId, newHours) => {
  try {
    const vehiclesQuery = `
      SELECT * FROM ${VEHICLES_TABLE}
      WHERE vehicleId = @vehicleId
    `;

    const vehicleResult = await sqlConnection.query(vehiclesQuery, { vehicleId });

    if (vehicleResult.length > 0) {
      const vehicle = vehicleResult[0];

      if (vehicle.hasHourMeter && vehicle.type === 'tractor') {
        const currentHours = parseInt(vehicle.currentHours) || 0;
        const newHoursInt = parseInt(newHours) || 0;

        if (newHoursInt > currentHours) {
          const updateQuery = `
            UPDATE ${VEHICLES_TABLE}
            SET currentHours = @newHoursInt,
                lastHourMeterDate = @lastHourMeterDate,
                updatedAt = @updatedAt
            WHERE vehicleId = @vehicleId
          `;

          await sqlConnection.execute(updateQuery, {
            newHoursInt,
            lastHourMeterDate: new Date(),
            updatedAt: new Date(),
            vehicleId
          });

          console.log(`✅ Horómetro actualizado para ${vehicleId}: ${currentHours} → ${newHoursInt}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error al actualizar horómetro del vehículo:', error);
  }
};

/**
 * Crear un nuevo registro de mantenimiento
 * @param {Object} maintenanceData - Datos del mantenimiento
 * @param {Object} userInfo - Información del usuario (opcional)
 * @returns {Promise<Object>} - Resultado de la operación {success, id/data, error}
 */
export async function createMaintenanceRecord(maintenanceData, userInfo = null) {
  try {
    console.log('🚀 Iniciando creación de mantenimiento SQL en Functions:', maintenanceData);

    // Validar datos
    validateMaintenanceData(maintenanceData);

    // Preparar datos del mantenimiento
    const maintenance = {
      type: maintenanceData.type,
      vehicleId: maintenanceData.vehicleId,
      date: new Date(maintenanceData.date),
      description: maintenanceData.description || '',
      notes: maintenanceData.notes || '',
      cost: parseFloat(maintenanceData.cost) || 0,
      hours: parseFloat(maintenanceData.hours) || 0,
      laborCost: parseFloat(maintenanceData.laborCost) || 0,
      technician: maintenanceData.technician || '',
      priority: maintenanceData.priority || 'media',
      title: maintenanceData.title || 'Mantenimiento',
      status: maintenanceData.status || MAINTENANCE_STATUS.COMPLETED,
      createdBy: maintenanceData.createdBy || userInfo?.email || 'system',
      createdByUid: userInfo?.uid || null,
      createdByName: userInfo?.displayName || userInfo?.email || 'Usuario',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Datos específicos por tipo de mantenimiento
    if (maintenanceData.type === MAINTENANCE_TYPES.OIL_CHANGE) {
      maintenance.quantity = parseFloat(maintenanceData.quantity) || 0;
      maintenance.oilType = maintenanceData.oilType || '';
      maintenance.currentHours = parseFloat(maintenanceData.currentHours) || 0;
      maintenance.nextChangeHours = calculateNextOilChange(maintenance.currentHours);
    }

    if (maintenanceData.type === MAINTENANCE_TYPES.BATTERY_CHANGE) {
      maintenance.batteryType = maintenanceData.batteryType || '';
      maintenance.batteryStatus = maintenanceData.batteryStatus || BATTERY_STATUS.NEW;
      maintenance.nextBatteryChange = calculateNextBatteryChange(maintenanceData.date);
    }

    if (maintenanceData.type === MAINTENANCE_TYPES.FILTER_CHANGE) {
      maintenance.filterType = maintenanceData.filterType || '';
      maintenance.filterCount = parseInt(maintenanceData.filterCount) || 0;
    }

    // Partes y repuestos
    if (maintenanceData.parts && Array.isArray(maintenanceData.parts)) {
      maintenance.parts = JSON.stringify(maintenanceData.parts);
      maintenance.totalPartsCost = maintenanceData.parts.reduce((sum, part) => sum + (part.total || 0), 0);
    } else {
      maintenance.parts = JSON.stringify([]);
      maintenance.totalPartsCost = 0;
    }

    // Calcular costo total
    maintenance.totalCost = (maintenance.laborCost || 0) + (maintenance.totalPartsCost || 0) + (maintenance.cost || 0);

    // Crear mantenimiento en transacción
    const result = await sqlConnection.transaction(async (transaction) => {
      const columns = Object.keys(maintenance);
      const values = columns.map((_, index) => `@param${index}`);
      const insertQuery = `
        INSERT INTO ${TABLE_NAME} (${columns.join(', ')})
        VALUES (${values.join(', ')});
        SELECT SCOPE_IDENTITY() as id;
      `;

      const insertRequest = transaction.request();
      columns.forEach((col, index) => {
        insertRequest.input(`param${index}`, maintenance[col]);
      });
      const createResult = await insertRequest.query(insertQuery);
      const maintenanceId = createResult.recordset[0]?.id;

      if (!maintenanceId) {
        throw new Error('No se pudo crear el mantenimiento');
      }

      // Actualizar horómetro del vehículo si aplica
      if (maintenanceData.vehicleId && maintenanceData.currentHours) {
        await updateVehicleHourMeter(maintenanceData.vehicleId, maintenanceData.currentHours);
      }

      return { id: maintenanceId, ...maintenance };
    });

    console.log('✅ Mantenimiento SQL creado exitosamente en Functions:', result.id);
    return { success: true, id: result.id, data: result };

  } catch (error) {
    console.error('❌ Error al crear mantenimiento SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener todos los registros de mantenimiento con filtros opcionales
 * @param {Object} filters - Filtros de búsqueda {type, vehicleId, status, dateFrom, dateTo}
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getAllMaintenanceRecords(filters = {}) {
  try {
    console.log('🔍 Obteniendo mantenimientos SQL en Functions con filtros:', filters);

    // Construir filtros SQL
    let whereClause = '';
    const params = {};
    const filterConditions = [];

    if (filters.type) {
      filterConditions.push('type = @type');
      params.type = filters.type;
    }

    if (filters.vehicleId) {
      filterConditions.push('vehicleId = @vehicleId');
      params.vehicleId = filters.vehicleId;
    }

    if (filters.status) {
      filterConditions.push('status = @status');
      params.status = filters.status;
    }

    if (filters.dateFrom) {
      filterConditions.push('date >= @dateFrom');
      params.dateFrom = new Date(filters.dateFrom);
    }

    if (filters.dateTo) {
      filterConditions.push('date <= @dateTo');
      params.dateTo = new Date(filters.dateTo);
    }

    if (filterConditions.length > 0) {
      whereClause = `WHERE ${filterConditions.join(' AND ')}`;
    }

    const query = `
      SELECT * FROM ${TABLE_NAME}
      ${whereClause}
      ORDER BY date DESC
    `;

    const result = await sqlConnection.query(query, params);

    if (result.length > 0) {
      // Convertir timestamps y parsear JSON
      const formattedData = result.map(record => ({
        ...record,
        parts: record.parts ? JSON.parse(record.parts) : [],
        date: record.date ? record.date.toISOString().split('T')[0] : null,
        createdAt: record.createdAt ? record.createdAt.toISOString() : null,
        updatedAt: record.updatedAt ? record.updatedAt.toISOString() : null,
      }));
      return { success: true, data: formattedData, count: formattedData.length };
    }

    return { success: true, data: [], count: 0 };

  } catch (error) {
    console.error('❌ Error al obtener mantenimientos SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener un registro de mantenimiento por ID
 * @param {string} maintenanceId - ID del mantenimiento
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getMaintenanceRecord(maintenanceId) {
  try {
    if (!maintenanceId) {
      return { success: false, error: 'ID es requerido' };
    }

    const query = `SELECT * FROM ${TABLE_NAME} WHERE id = @id`;
    const result = await sqlConnection.query(query, { id: maintenanceId });

    if (result.length === 0) {
      return { success: false, error: 'Mantenimiento no encontrado' };
    }

    const record = result[0];
    // Convertir timestamps y parsear JSON
    const formattedData = {
      ...record,
      parts: record.parts ? JSON.parse(record.parts) : [],
      date: record.date ? record.date.toISOString().split('T')[0] : null,
      createdAt: record.createdAt ? record.createdAt.toISOString() : null,
      updatedAt: record.updatedAt ? record.updatedAt.toISOString() : null,
    };

    return { success: true, data: formattedData };

  } catch (error) {
    console.error('❌ Error al obtener mantenimiento SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar un registro de mantenimiento
 * @param {string} maintenanceId - ID del mantenimiento
 * @param {Object} updateData - Datos a actualizar
 * @param {Object} userInfo - Información del usuario (opcional)
 * @returns {Promise<Object>} - {success, id, error}
 */
export async function updateMaintenanceRecord(maintenanceId, updateData, userInfo = null) {
  try {
    if (!maintenanceId) {
      return { success: false, error: 'ID es requerido' };
    }

    // Validar datos si se proporcionan
    validateMaintenanceUpdateData(updateData);

    // Preparar datos de actualización
    const updatePayload = {
      ...updateData,
      updatedAt: new Date(),
    };

    if (userInfo) {
      updatePayload.updatedBy = userInfo.email || 'unknown';
    }

    // Recalcular valores si es necesario
    if (updateData.currentHours && updateData.type === MAINTENANCE_TYPES.OIL_CHANGE) {
      updatePayload.nextChangeHours = calculateNextOilChange(updateData.currentHours);
    }

    // Procesar partes como JSON
    if (updatePayload.parts && Array.isArray(updatePayload.parts)) {
      updatePayload.parts = JSON.stringify(updatePayload.parts);
      updatePayload.totalPartsCost = updatePayload.parts.reduce((sum, part) => sum + (part.total || 0), 0);
    }

    // Recalcular costo total
    if (updatePayload.laborCost !== undefined || updatePayload.totalPartsCost !== undefined || updatePayload.cost !== undefined) {
      const laborCost = updatePayload.laborCost || 0;
      const totalPartsCost = updatePayload.totalPartsCost || 0;
      const cost = updatePayload.cost || 0;
      updatePayload.totalCost = laborCost + totalPartsCost + cost;
    }

    // Construir UPDATE
    const setParts = [];
    const params = { id: maintenanceId };

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

    // Actualizar horómetro del vehículo si aplica
    if (updateData.vehicleId && updateData.currentHours) {
      await updateVehicleHourMeter(updateData.vehicleId, updateData.currentHours);
    }

    return {
      success: true,
      id: maintenanceId,
      message: 'Mantenimiento actualizado exitosamente',
      rowsAffected: result.rowsAffected,
    };

  } catch (error) {
    console.error('❌ Error al actualizar mantenimiento SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Eliminar un registro de mantenimiento
 * @param {string} maintenanceId - ID del mantenimiento
 * @returns {Promise<Object>} - {success, message, error}
 */
export async function deleteMaintenanceRecord(maintenanceId) {
  try {
    if (!maintenanceId) {
      return { success: false, error: 'ID es requerido' };
    }

    const deleteQuery = `DELETE FROM ${TABLE_NAME} WHERE id = @id`;
    const result = await sqlConnection.execute(deleteQuery, { id: maintenanceId });

    console.log('✅ Mantenimiento SQL eliminado exitosamente en Functions:', maintenanceId);
    return { success: true, message: 'Mantenimiento eliminado exitosamente' };

  } catch (error) {
    console.error('❌ Error al eliminar mantenimiento SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener mantenimientos por vehículo específico
 * @param {string} vehicleId - ID del vehículo
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getMaintenanceByVehicle(vehicleId) {
  try {
    if (!vehicleId) {
      return { success: false, error: 'ID de vehículo es requerido' };
    }

    const query = `
      SELECT * FROM ${TABLE_NAME}
      WHERE vehicleId = @vehicleId
      ORDER BY date DESC
    `;

    const result = await sqlConnection.query(query, { vehicleId });

    if (result.length > 0) {
      const formattedData = result.map(record => ({
        ...record,
        parts: record.parts ? JSON.parse(record.parts) : [],
        date: record.date ? record.date.toISOString().split('T')[0] : null,
        createdAt: record.createdAt ? record.createdAt.toISOString() : null,
        updatedAt: record.updatedAt ? record.updatedAt.toISOString() : null,
      }));
      return { success: true, data: formattedData, count: formattedData.length };
    }

    return { success: true, data: [], count: 0 };

  } catch (error) {
    console.error('❌ Error al obtener mantenimientos por vehículo SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener próximos mantenimientos programados
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getUpcomingMaintenance() {
  try {
    console.log('🔍 Obteniendo próximos mantenimientos SQL en Functions...');

    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

    const query = `
      SELECT * FROM ${TABLE_NAME}
      WHERE (nextChangeDate >= @today OR nextBatteryChange >= @today)
      AND (nextChangeDate <= @nextMonth OR nextBatteryChange <= @nextMonth)
      ORDER BY nextChangeDate ASC, nextBatteryChange ASC
    `;

    const result = await sqlConnection.query(query, {
      today,
      nextMonth
    });

    if (result.length > 0) {
      const formattedData = result.map(record => ({
        ...record,
        parts: record.parts ? JSON.parse(record.parts) : [],
        date: record.date ? record.date.toISOString().split('T')[0] : null,
        createdAt: record.createdAt ? record.createdAt.toISOString() : null,
        updatedAt: record.updatedAt ? record.updatedAt.toISOString() : null,
      }));
      return { success: true, data: formattedData, count: formattedData.length };
    }

    return { success: true, data: [], count: 0 };

  } catch (error) {
    console.error('❌ Error al obtener próximos mantenimientos SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener estadísticas de mantenimiento
 * @param {Object} filters - Filtros opcionales
 * @returns {Promise<Object>} - {success, data, error}
 */
export async function getMaintenanceStats(filters = {}) {
  try {
    console.log('📊 Obteniendo estadísticas de mantenimiento SQL en Functions...');

    // Construir filtros SQL
    let whereClause = '';
    const params = {};
    const filterConditions = [];

    if (filters.dateFrom) {
      filterConditions.push('date >= @dateFrom');
      params.dateFrom = new Date(filters.dateFrom);
    }

    if (filters.dateTo) {
      filterConditions.push('date <= @dateTo');
      params.dateTo = new Date(filters.dateTo);
    }

    if (filterConditions.length > 0) {
      whereClause = `WHERE ${filterConditions.join(' AND ')}`;
    }

    const query = `
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN type = '${MAINTENANCE_TYPES.OIL_CHANGE}' THEN 1 END) as oilChanges,
        COUNT(CASE WHEN type = '${MAINTENANCE_TYPES.BATTERY_CHANGE}' THEN 1 END) as batteryChanges,
        COUNT(CASE WHEN type = '${MAINTENANCE_TYPES.FILTER_CHANGE}' THEN 1 END) as filterChanges,
        COUNT(CASE WHEN type = '${MAINTENANCE_TYPES.GENERAL_MAINTENANCE}' THEN 1 END) as generalMaintenance,
        SUM(CAST(totalCost as FLOAT)) as totalCost,
        AVG(CAST(totalCost as FLOAT)) as averageCost,
        COUNT(CASE WHEN status = '${MAINTENANCE_STATUS.COMPLETED}' THEN 1 END) as completed,
        COUNT(CASE WHEN status = '${MAINTENANCE_STATUS.PENDING}' THEN 1 END) as pending
      FROM ${TABLE_NAME}
      ${whereClause}
    `;

    const result = await sqlConnection.query(query, params);

    if (result.length > 0) {
      const stats = result[0];
      return {
        success: true,
        data: {
          total: parseInt(stats.total) || 0,
          byType: {
            oilChanges: parseInt(stats.oilChanges) || 0,
            batteryChanges: parseInt(stats.batteryChanges) || 0,
            filterChanges: parseInt(stats.filterChanges) || 0,
            generalMaintenance: parseInt(stats.generalMaintenance) || 0,
          },
          totalCost: parseFloat(stats.totalCost) || 0,
          averageCost: parseFloat(stats.averageCost) || 0,
          byStatus: {
            completed: parseInt(stats.completed) || 0,
            pending: parseInt(stats.pending) || 0,
          }
        }
      };
    }

    return {
      success: true,
      data: {
        total: 0,
        byType: { oilChanges: 0, batteryChanges: 0, filterChanges: 0, generalMaintenance: 0 },
        totalCost: 0,
        averageCost: 0,
        byStatus: { completed: 0, pending: 0 }
      }
    };

  } catch (error) {
    console.error('❌ Error al obtener estadísticas de mantenimiento SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}