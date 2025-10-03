/**
 * hourMeterService.js - Servicio de horómetros usando Cloud SQL Server Server en Firebase Functions
 * Migrado desde combustibles/src/services/hourMeterService.js
 * Forestech Combustibles App - TASK-006
 */

import sqlConnection from '../cloudsql/oil-connection.js';

const VEHICLES_TABLE = 'combustibles_vehicles';

// Funciones de utilidad para cálculos precisos
const preciseRound = (value, decimals = 2) => {
  const num = parseFloat(value) || 0;
  return parseFloat(num.toFixed(decimals));
};

/**
 * Generar ID único para registros de historial
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Calcular consumo real por hora
 * @param {Object} vehicleData - Datos del vehículo
 * @param {number} totalHoursWorked - Total de horas trabajadas
 * @returns {number} - Consumo en galones/hora
 */
const calculateFuelConsumptionPerHour = (vehicleData, totalHoursWorked) => {
  if (!totalHoursWorked || totalHoursWorked === 0) return 0;

  const totalFuelConsumed = vehicleData.totalFuelConsumed || 0;
  return preciseRound(totalFuelConsumed / totalHoursWorked, 3);
};

/**
 * Calcular promedio de horas por día
 * @param {Object} vehicleData - Datos del vehículo
 * @param {number} totalHoursWorked - Total de horas trabajadas
 * @returns {number} - Promedio de horas por día
 */
const calculateAverageHoursPerDay = (vehicleData, totalHoursWorked) => {
  if (!vehicleData.createdAt || !totalHoursWorked || totalHoursWorked === 0) return 0;

  const createdDate = new Date(vehicleData.createdAt);
  const daysActive = Math.max(1, (new Date() - createdDate) / (1000 * 60 * 60 * 24));
  return preciseRound(totalHoursWorked / daysActive, 2);
};

/**
 * Obtener rating de eficiencia
 * @param {number} efficiency - Ratio de eficiencia
 * @returns {string} - Rating (A, B, C, D)
 */
const getEfficiencyRating = (efficiency) => {
  if (efficiency <= 0.8) return 'A'; // Muy eficiente (consume menos de lo estimado)
  if (efficiency <= 1.0) return 'B'; // Eficiente (consume según lo estimado)
  if (efficiency <= 1.2) return 'C'; // Normal (consume un poco más)
  return 'D'; // Ineficiente (consume mucho más)
};

/**
 * Registrar nueva lectura de horómetro
 * @param {string} vehicleId - ID del vehículo
 * @param {number} newReading - Nueva lectura del horómetro
 * @param {string} movementId - ID del movimiento asociado (opcional)
 * @param {Object} userInfo - Información del usuario
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function recordHourMeterReading(vehicleId, newReading, movementId = null, userInfo = null) {
  try {
    console.log('🚀 Registrando lectura de horómetro SQL en Functions:', { vehicleId, newReading, movementId });

    if (!vehicleId) {
      return { success: false, error: 'ID de vehículo es requerido' };
    }

    if (newReading === undefined || newReading === null) {
      return { success: false, error: 'Lectura del horómetro es requerida' };
    }

    // Obtener vehículo actual
    const vehicleQuery = `SELECT * FROM ${VEHICLES_TABLE} WHERE vehicleId = @vehicleId`;
    const vehicleResult = await sqlConnection.query(vehicleQuery, { vehicleId });

    if (vehicleResult.length === 0) {
      return { success: false, error: 'Vehículo no encontrado' };
    }

    const vehicleData = vehicleResult[0];

    if (!vehicleData.hasHourMeter) {
      return { success: false, error: 'El vehículo no tiene horómetro configurado' };
    }

    // Obtener lectura actual
    const currentReading = vehicleData.currentHourMeter || vehicleData.initialHourMeter || 0;
    const newReadingNum = parseFloat(newReading);

    if (isNaN(newReadingNum) || newReadingNum < 0) {
      return { success: false, error: 'La lectura debe ser un número válido mayor o igual a 0' };
    }

    // 🔒 VALIDACIONES CRÍTICAS
    if (newReadingNum < currentReading) {
      return {
        success: false,
        error: `Nueva lectura (${newReadingNum}) no puede ser menor que la actual (${currentReading})`
      };
    }

    const hoursWorked = newReadingNum - currentReading;

    if (hoursWorked > 24) {
      return {
        success: false,
        error: `Incremento muy alto (${hoursWorked} horas). Máximo permitido: 24 horas por movimiento`
      };
    }

    const totalHoursWorked = (vehicleData.totalHoursWorked || 0) + hoursWorked;

    // 📝 CREAR REGISTRO EN HISTORIAL
    const historyEntry = {
      id: generateId(),
      reading: newReadingNum,
      date: new Date(),
      movementId,
      previousReading: currentReading,
      hoursWorked,
      recordedBy: userInfo?.email || 'unknown',
      recordedByUid: userInfo?.uid || null,
      timestamp: new Date(),
    };

    // Parsear historial existente
    let hourMeterHistory = [];
    try {
      hourMeterHistory = vehicleData.hourMeterHistory ? JSON.parse(vehicleData.hourMeterHistory) : [];
    } catch (error) {
      console.warn('Error parseando historial de horómetro:', error);
      hourMeterHistory = [];
    }

    const updatedHistory = [...hourMeterHistory, historyEntry];

    // 📊 CALCULAR MÉTRICAS ACTUALIZADAS
    const averageHoursPerDay = calculateAverageHoursPerDay(vehicleData, totalHoursWorked);
    const fuelConsumptionPerHour = calculateFuelConsumptionPerHour(vehicleData, totalHoursWorked);

    // 🔄 ACTUALIZAR VEHÍCULO
    const updateQuery = `
      UPDATE ${VEHICLES_TABLE}
      SET currentHourMeter = @newReadingNum,
          totalHoursWorked = @totalHoursWorked,
          lastHourMeterUpdate = @lastHourMeterUpdate,
          hourMeterHistory = @updatedHistory,
          averageHoursPerDay = @averageHoursPerDay,
          fuelConsumptionPerHour = @fuelConsumptionPerHour,
          updatedAt = @updatedAt
      WHERE vehicleId = @vehicleId
    `;

    await sqlConnection.execute(updateQuery, {
      newReadingNum,
      totalHoursWorked,
      lastHourMeterUpdate: new Date(),
      updatedHistory: JSON.stringify(updatedHistory),
      averageHoursPerDay,
      fuelConsumptionPerHour,
      updatedAt: new Date(),
      vehicleId
    });

    console.log('✅ Lectura de horómetro registrada exitosamente en Functions');

    return {
      success: true,
      hoursWorked,
      totalHoursWorked,
      newReading: newReadingNum,
      previousReading: currentReading,
      averageHoursPerDay,
      fuelConsumptionPerHour,
    };

  } catch (error) {
    console.error('❌ Error al registrar lectura de horómetro SQL en Functions:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Validar lectura de horómetro antes de movimiento
 * @param {string} vehicleId - ID del vehículo
 * @param {number} requiredReading - Lectura requerida
 * @returns {Promise<Object>} - Resultado de la validación
 */
export async function validateHourMeterForMovement(vehicleId, requiredReading) {
  try {
    if (!vehicleId) {
      return { valid: false, message: 'ID de vehículo es requerido' };
    }

    // Obtener vehículo
    const vehicleQuery = `SELECT * FROM ${VEHICLES_TABLE} WHERE vehicleId = @vehicleId`;
    const vehicleResult = await sqlConnection.query(vehicleQuery, { vehicleId });

    if (vehicleResult.length === 0) {
      return { valid: false, message: 'Vehículo no encontrado' };
    }

    const vehicle = vehicleResult[0];

    if (!vehicle.hasHourMeter) {
      return { valid: true, message: 'Vehículo sin horómetro' };
    }

    const currentReading = vehicle.currentHourMeter || vehicle.initialHourMeter || 0;

    if (!requiredReading && requiredReading !== 0) {
      return {
        valid: false,
        message: 'Debe proporcionar lectura actual del horómetro',
        currentReading,
        required: true,
      };
    }

    const numericReading = Number(requiredReading);

    if (isNaN(numericReading) || numericReading < 0) {
      return {
        valid: false,
        message: 'La lectura debe ser un número válido mayor o igual a 0',
      };
    }

    if (numericReading < currentReading) {
      return {
        valid: false,
        message: `Lectura (${numericReading}) no puede ser menor que la actual (${currentReading})`,
        currentReading,
      };
    }

    const hoursWorked = numericReading - currentReading;

    if (hoursWorked > 24) {
      return {
        valid: false,
        message: `Incremento muy alto (${hoursWorked} horas). Máximo permitido: 24 horas`,
        currentReading,
        hoursWorked,
      };
    }

    return {
      valid: true,
      hoursWorked,
      currentReading,
      newReading: numericReading,
    };

  } catch (error) {
    console.error('❌ Error al validar horómetro SQL en Functions:', error);
    return { valid: false, message: error.message };
  }
}

/**
 * Obtener historial de horómetro de un vehículo
 * @param {string} vehicleId - ID del vehículo
 * @param {number} limit - Límite de registros (default: 50)
 * @returns {Promise<Array>} - Historial de lecturas
 */
export async function getHourMeterHistory(vehicleId, limit = 50) {
  try {
    if (!vehicleId) {
      return [];
    }

    // Obtener vehículo con historial
    const vehicleQuery = `SELECT * FROM ${VEHICLES_TABLE} WHERE vehicleId = @vehicleId`;
    const vehicleResult = await sqlConnection.query(vehicleQuery, { vehicleId });

    if (vehicleResult.length === 0 || !vehicleResult[0].hourMeterHistory) {
      return [];
    }

    const vehicle = vehicleResult[0];

    // Parsear historial
    let history = [];
    try {
      history = JSON.parse(vehicle.hourMeterHistory);
    } catch (error) {
      console.warn('Error parseando historial de horómetro:', error);
      return [];
    }

    return history
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
      .map((entry) => ({
        ...entry,
        date: entry.date instanceof Date ? entry.date : new Date(entry.date),
        formattedDate: entry.date instanceof Date
          ? entry.date.toLocaleDateString('es-CO')
          : new Date(entry.date).toLocaleDateString('es-CO'),
      }));

  } catch (error) {
    console.error('❌ Error al obtener historial de horómetro SQL en Functions:', error);
    return [];
  }
}

/**
 * Inicializar horómetro para vehículo existente
 * @param {string} vehicleId - ID del vehículo
 * @param {number} initialReading - Lectura inicial
 * @param {Object} userInfo - Usuario que inicializa
 * @returns {Promise<Object>} - Resultado de la operación
 */
export async function initializeHourMeter(vehicleId, initialReading, userInfo = null) {
  try {
    console.log('🚀 Inicializando horómetro SQL en Functions:', { vehicleId, initialReading });

    if (!vehicleId) {
      return { success: false, error: 'ID de vehículo es requerido' };
    }

    if (initialReading === undefined || initialReading === null) {
      return { success: false, error: 'Lectura inicial es requerida' };
    }

    const initialReadingNum = parseFloat(initialReading);

    if (isNaN(initialReadingNum) || initialReadingNum < 0) {
      return { success: false, error: 'La lectura inicial debe ser un número válido mayor o igual a 0' };
    }

    // Obtener vehículo
    const vehicleQuery = `SELECT * FROM ${VEHICLES_TABLE} WHERE vehicleId = @vehicleId`;
    const vehicleResult = await sqlConnection.query(vehicleQuery, { vehicleId });

    if (vehicleResult.length === 0) {
      return { success: false, error: 'Vehículo no encontrado' };
    }

    const vehicle = vehicleResult[0];

    if (vehicle.initialHourMeter !== undefined && vehicle.initialHourMeter !== null) {
      return { success: false, error: 'El horómetro ya ha sido inicializado' };
    }

    const historyEntry = {
      id: generateId(),
      reading: initialReadingNum,
      date: new Date(),
      movementId: null,
      previousReading: null,
      hoursWorked: 0,
      recordedBy: userInfo?.email || 'unknown',
      recordedByUid: userInfo?.uid || null,
      note: 'Lectura inicial al configurar horómetro',
      timestamp: new Date(),
    };

    const updateQuery = `
      UPDATE ${VEHICLES_TABLE}
      SET hasHourMeter = @hasHourMeter,
          initialHourMeter = @initialReadingNum,
          currentHourMeter = @initialReadingNum,
          totalHoursWorked = @totalHoursWorked,
          hourMeterHistory = @hourMeterHistory,
          averageHoursPerDay = @averageHoursPerDay,
          fuelConsumptionPerHour = @fuelConsumptionPerHour,
          lastHourMeterUpdate = @lastHourMeterUpdate,
          updatedAt = @updatedAt
      WHERE vehicleId = @vehicleId
    `;

    await sqlConnection.execute(updateQuery, {
      hasHourMeter: true,
      initialReadingNum,
      totalHoursWorked: 0,
      hourMeterHistory: JSON.stringify([historyEntry]),
      averageHoursPerDay: 0,
      fuelConsumptionPerHour: 0,
      lastHourMeterUpdate: new Date(),
      updatedAt: new Date(),
      vehicleId
    });

    console.log('✅ Horómetro inicializado exitosamente en Functions');

    return {
      success: true,
      message: `Horómetro inicializado en ${initialReadingNum} horas`,
      initialReading: initialReadingNum,
    };

  } catch (error) {
    console.error('❌ Error al inicializar horómetro SQL en Functions:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Obtener resumen de eficiencia de horómetro
 * @param {string} vehicleId - ID del vehículo
 * @returns {Promise<Object>} - Resumen de eficiencia
 */
export async function getHourMeterSummary(vehicleId) {
  try {
    if (!vehicleId) {
      return { hasHourMeter: false, error: 'ID de vehículo es requerido' };
    }

    // Obtener vehículo
    const vehicleQuery = `SELECT * FROM ${VEHICLES_TABLE} WHERE vehicleId = @vehicleId`;
    const vehicleResult = await sqlConnection.query(vehicleQuery, { vehicleId });

    if (vehicleResult.length === 0) {
      return { hasHourMeter: false, error: 'Vehículo no encontrado' };
    }

    const vehicle = vehicleResult[0];

    if (!vehicle.hasHourMeter) {
      return {
        hasHourMeter: false,
        message: 'Vehículo sin horómetro',
      };
    }

    const estimatedConsumption = vehicle.estimatedConsumptionPerHour || 0;
    const actualConsumption = vehicle.fuelConsumptionPerHour || 0;
    const efficiency = estimatedConsumption > 0 ? actualConsumption / estimatedConsumption : 0;

    return {
      hasHourMeter: true,
      initialReading: vehicle.initialHourMeter || 0,
      currentReading: vehicle.currentHourMeter || 0,
      totalHoursWorked: vehicle.totalHoursWorked || 0,
      averageHoursPerDay: vehicle.averageHoursPerDay || 0,
      estimatedConsumption,
      actualConsumption,
      efficiency: preciseRound(efficiency * 100, 1),
      efficiencyRating: getEfficiencyRating(efficiency),
      lastUpdate: vehicle.lastHourMeterUpdate,
      historyCount: vehicle.hourMeterHistory ? JSON.parse(vehicle.hourMeterHistory).length : 0,
    };

  } catch (error) {
    console.error('❌ Error al obtener resumen de horómetro SQL en Functions:', error);
    return {
      hasHourMeter: false,
      error: error.message,
    };
  }
}

/**
 * Obtener estadísticas de horómetros
 * @param {Object} filters - Filtros opcionales
 * @returns {Promise<Object>} - Estadísticas de horómetros
 */
export async function getHourMeterStats(filters = {}) {
  try {
    console.log('📊 Obteniendo estadísticas de horómetros SQL en Functions...');

    let whereClause = 'WHERE hasHourMeter = 1';
    const params = {};

    if (filters.type) {
      whereClause += ' AND type = @type';
      params.type = filters.type;
    }

    const query = `
      SELECT
        COUNT(*) as totalVehiclesWithHourMeter,
        AVG(CAST(currentHourMeter as FLOAT)) as averageCurrentReading,
        AVG(CAST(totalHoursWorked as FLOAT)) as averageTotalHours,
        AVG(CAST(averageHoursPerDay as FLOAT)) as averageHoursPerDay,
        AVG(CAST(fuelConsumptionPerHour as FLOAT)) as averageFuelConsumption,
        MIN(currentHourMeter) as minReading,
        MAX(currentHourMeter) as maxReading
      FROM ${VEHICLES_TABLE}
      ${whereClause}
    `;

    const result = await sqlConnection.query(query, params);

    if (result.length > 0) {
      const stats = result[0];
      return {
        success: true,
        data: {
          totalVehiclesWithHourMeter: parseInt(stats.totalVehiclesWithHourMeter) || 0,
          averageCurrentReading: preciseRound(stats.averageCurrentReading, 2),
          averageTotalHours: preciseRound(stats.averageTotalHours, 2),
          averageHoursPerDay: preciseRound(stats.averageHoursPerDay, 2),
          averageFuelConsumption: preciseRound(stats.averageFuelConsumption, 3),
          minReading: preciseRound(stats.minReading, 2),
          maxReading: preciseRound(stats.maxReading, 2),
        }
      };
    }

    return {
      success: true,
      data: {
        totalVehiclesWithHourMeter: 0,
        averageCurrentReading: 0,
        averageTotalHours: 0,
        averageHoursPerDay: 0,
        averageFuelConsumption: 0,
        minReading: 0,
        maxReading: 0,
      }
    };

  } catch (error) {
    console.error('❌ Error al obtener estadísticas de horómetros SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}