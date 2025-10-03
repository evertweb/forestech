/**
 * vehiclesService.js - Servicio de vehículos usando Cloud SQL Server Server en Firebase Functions
 * Migrado desde combustibles/src/services/SqlVehiclesService.js
 * Forestech Combustibles App - TASK-004
 */

import sqlConnection from '../cloudsql/oil-connection.js';

const TABLE_NAME = 'combustibles_vehicles';
const MOVEMENTS_TABLE = 'combustibles_movements';

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
    const vehiclesTableExists = await checkTableExists(TABLE_NAME);
    const movementsTableExists = await checkTableExists(MOVEMENTS_TABLE);
    
    const missingTables = [];
    if (!vehiclesTableExists) missingTables.push(TABLE_NAME);
    if (!movementsTableExists) missingTables.push(MOVEMENTS_TABLE);
    
    return {
      success: missingTables.length === 0,
      vehiclesTableExists,
      movementsTableExists,
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

// Estados de vehículos (copiados de vehicleCategories.js para Functions)
export const VEHICLE_STATUS = {
  ACTIVO: 'activo',
  MANTENIMIENTO: 'mantenimiento',
  INACTIVO: 'inactivo',
  REPARACION: 'reparacion',
  FUERA_DE_SERVICIO: 'fuera_de_servicio',
};

// Tipos de combustible (copiados de combustibleTypes.js para Functions)
export const FUEL_TYPES = {
  DIESEL: 'DIESEL',
  GASOLINE: 'GASOLINE',
  MIXED: 'MIXED',
};

export const FUEL_COMPATIBILITY = {
  DIESEL: 'DIESEL',
  GASOLINE: 'GASOLINE',
  MIXED: 'MIXED',
};

/**
 * Validar datos de vehículo
 * @param {Object} vehicleData - Datos a validar
 * @throws {Error} Si validación falla
 */
const validateVehicleData = (vehicleData) => {
  const required = ['vehicleId', 'name', 'type', 'fuelType'];

  for (const field of required) {
    if (!vehicleData[field]) {
      throw new Error(`Campo requerido: ${field}`);
    }
  }

  if (!vehicleData.type || vehicleData.type.trim().length === 0) {
    throw new Error('Tipo de vehículo requerido');
  }

  if (!Object.values(FUEL_COMPATIBILITY).includes(vehicleData.fuelType)) {
    throw new Error('Tipo de combustible inválido');
  }

  if (vehicleData.status && !Object.values(VEHICLE_STATUS).includes(vehicleData.status)) {
    throw new Error('Estado de vehículo inválido');
  }

  if (vehicleData.enginePower && vehicleData.enginePower <= 0) {
    throw new Error('La potencia del motor debe ser mayor a cero');
  }

  if (vehicleData.fuelCapacity && vehicleData.fuelCapacity <= 0) {
    throw new Error('La capacidad de combustible debe ser mayor a cero');
  }
};

/**
 * Calcular consumo estimado por hora
 * @param {Object} vehicleData - Datos del vehículo
 * @returns {number} - Consumo estimado
 */
const calculateEstimatedConsumption = (vehicleData) => {
  const { type, enginePower, fuelType } = vehicleData;

  const consumptionFactors = {
    excavadora: 0.04,
    bulldozer: 0.05,
    cargador: 0.035,
    camion: 0.03,
    camioneta: 0.03,
    grua: 0.045,
    motosierra: 0.02,
    tractor: 0.025,
    volqueta: 0.035,
    motobomba: 0.035,
    fumigadora: 0.025,
    guadana: 0.02,
    motocicleta: 0.015,
    planta_electrica: 0.08,
    otros: 0.03,
  };

  const fuelFactors = {
    [FUEL_COMPATIBILITY.DIESEL]: 1.0,
    [FUEL_COMPATIBILITY.GASOLINE]: 1.2,
    [FUEL_COMPATIBILITY.MIXED]: 1.1,
  };

  const baseFactor = consumptionFactors[type] || 0.03;
  const fuelFactor = fuelFactors[fuelType] || 1.0;
  const power = enginePower || 100;

  return baseFactor * power * fuelFactor;
};

/**
 * Crear un nuevo vehículo
 * @param {Object} vehicleData - Datos del vehículo
 * @param {Object} userInfo - Información del usuario (opcional)
 * @returns {Promise<Object>} - Resultado
 */
export async function createVehicle(vehicleData, userInfo = null) {
  try {
    console.log('🚗 Iniciando creación de vehículo SQL en Functions:', vehicleData);

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

    // Normalizar fuelType
    if (vehicleData.fuelType) {
      vehicleData.fuelType = vehicleData.fuelType.toUpperCase();
    }

    // Validar
    validateVehicleData(vehicleData);

    // Verificar duplicado por vehicleId
    const existing = await getVehicleByCode(vehicleData.vehicleId);
    if (existing.success && existing.data) {
      throw new Error(`El código de vehículo '${vehicleData.vehicleId}' ya existe`);
    }

    // Preparar datos de horómetro
    const hourMeterData = {};
    if (vehicleData.hasHourMeter && vehicleData.initialHourMeter !== undefined) {
      const initialReading = Number(vehicleData.initialHourMeter);
      if (isNaN(initialReading) || initialReading < 0) {
        throw new Error('La lectura inicial del horómetro debe ser un número válido mayor o igual a 0');
      }

      hourMeterData.hasHourMeter = true;
      hourMeterData.initialHourMeter = initialReading;
      hourMeterData.currentHourMeter = initialReading;
      hourMeterData.totalHoursWorked = 0;
      hourMeterData.averageHoursPerDay = 0;
      hourMeterData.fuelConsumptionPerHour = 0;
      hourMeterData.lastHourMeterUpdate = new Date();
      hourMeterData.hourMeterHistory = JSON.stringify([
        {
          id: Date.now().toString(36) + Math.random().toString(36).substr(2),
          reading: initialReading,
          date: new Date(),
          movementId: null,
          previousReading: null,
          hoursWorked: 0,
          recordedBy: vehicleData.createdBy || 'sistema',
          note: 'Lectura inicial al registrar vehículo',
          timestamp: new Date(),
        },
      ]);
    } else if (vehicleData.hasHourMeter) {
      hourMeterData.hasHourMeter = true;
      hourMeterData.initialHourMeter = null;
      hourMeterData.currentHourMeter = null;
      hourMeterData.totalHoursWorked = 0;
      hourMeterData.hourMeterHistory = JSON.stringify([]);
    }

    // Preparar datos completos
    const vehicle = {
      vehicleId: vehicleData.vehicleId,
      name: vehicleData.name,
      type: vehicleData.type,
      fuelType: vehicleData.fuelType,
      brand: vehicleData.brand || '',
      model: vehicleData.model || '',
      year: vehicleData.year || null,
      plateNumber: vehicleData.plateNumber || '',
      enginePower: vehicleData.enginePower || null,
      fuelCapacity: vehicleData.fuelCapacity || null,
      currentLocation: vehicleData.currentLocation || '',
      operationalStatus: vehicleData.status || VEHICLE_STATUS.ACTIVO,
      ...hourMeterData,
      totalFuelConsumed: 0,
      totalMovements: 0,
      lastMovementDate: null,
      estimatedConsumptionPerHour: calculateEstimatedConsumption(vehicleData),
      maintenanceHistory: JSON.stringify([]),
      searchTags: JSON.stringify([
        vehicleData.vehicleId?.toLowerCase(),
        vehicleData.name?.toLowerCase(),
        vehicleData.brand?.toLowerCase(),
        vehicleData.model?.toLowerCase(),
        vehicleData.type?.toLowerCase(),
      ].filter(Boolean)),
      createdBy: userInfo?.email || 'unknown',
      updatedBy: userInfo?.email || 'unknown',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Crear el vehículo
    const columns = Object.keys(vehicle).filter(key => key !== 'id');
    const values = columns.map((_, index) => `@param${index}`);
    const insertQuery = `
      INSERT INTO ${TABLE_NAME} (${columns.join(', ')})
      OUTPUT INSERTED.*
      VALUES (${values.join(', ')});
    `;

    const params = {};
    columns.forEach((col, index) => {
      params[`param${index}`] = vehicle[col];
    });
    const createResult = await sqlConnection.query(insertQuery, params);
    const vehicleId = createResult[0]?.id;

    if (!vehicleId) {
      throw new Error('No se pudo crear el vehículo');
    }

    console.log('✅ Vehículo SQL creado exitosamente en Functions:', vehicleId);
    if (vehicle.hasHourMeter && vehicle.initialHourMeter !== null) {
      console.log(`⏰ Horómetro inicializado en ${vehicle.initialHourMeter} horas`);
    }

    return { success: true, id: vehicleId, data: { ...vehicle, id: vehicleId } };

  } catch (error) {
    console.error('❌ Error al crear vehículo SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener todos los vehículos
 * @param {Object} filters - Filtros
 * @returns {Promise<Array>} - Lista de vehículos
 */
export async function getAllVehicles(filters = {}) {
  try {
    console.log('🚗 Obteniendo vehículos SQL en Functions con filtros:', filters);

    // Verificar que la tabla de vehículos exista
    const vehiclesTableExists = await checkTableExists(TABLE_NAME);
    if (!vehiclesTableExists) {
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

    // Normalizar fuelType
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
      filterConditions.push('operationalStatus = @status');
      params.status = filters.status;
    }
    if (filters.fuelType) {
      filterConditions.push('fuelType = @fuelType');
      params.fuelType = filters.fuelType;
    }
    if (filters.currentLocation) {
      filterConditions.push('currentLocation = @currentLocation');
      params.currentLocation = filters.currentLocation;
    }

    if (filterConditions.length > 0) {
      whereClause = `WHERE ${filterConditions.join(' AND ')}`;
    }

    // Paginación: limit y offset
    const limit = filters.limit || 200; // Default 200 vehículos (son menos que movimientos)
    const offset = filters.offset || 0;

    const query = `
      SELECT * FROM ${TABLE_NAME}
      ${whereClause}
      ORDER BY vehicleId ASC
      OFFSET ${offset} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    const result = await sqlConnection.query(query, params);

    if (result.length > 0) {
      // Procesar datos para compatibilidad (convertir JSON fields)
      const processedData = result.map(vehicle => ({
        id: vehicle.id,
        vehicleId: vehicle.vehicleId,
        name: vehicle.name,
        type: vehicle.type,
        fuelType: vehicle.fuelType?.toUpperCase() || vehicle.fuelType,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        plateNumber: vehicle.plateNumber,
        enginePower: vehicle.enginePower,
        fuelCapacity: vehicle.fuelCapacity,
        currentLocation: vehicle.currentLocation,
        operationalStatus: vehicle.operationalStatus,
        hasHourMeter: vehicle.hasHourMeter,
        initialHourMeter: vehicle.initialHourMeter,
        currentHourMeter: vehicle.currentHourMeter,
        totalHoursWorked: vehicle.totalHoursWorked,
        averageHoursPerDay: vehicle.averageHoursPerDay,
        fuelConsumptionPerHour: vehicle.fuelConsumptionPerHour,
        lastHourMeterUpdate: vehicle.lastHourMeterUpdate,
        hourMeterHistory: vehicle.hourMeterHistory ? JSON.parse(vehicle.hourMeterHistory) : [],
        totalFuelConsumed: vehicle.totalFuelConsumed,
        totalMovements: vehicle.totalMovements,
        lastMovementDate: vehicle.lastMovementDate,
        estimatedConsumptionPerHour: vehicle.estimatedConsumptionPerHour,
        maintenanceHistory: vehicle.maintenanceHistory ? JSON.parse(vehicle.maintenanceHistory) : [],
        searchTags: vehicle.searchTags ? JSON.parse(vehicle.searchTags) : [],
        createdBy: vehicle.createdBy,
        updatedBy: vehicle.updatedBy,
        createdAt: vehicle.createdAt ? vehicle.createdAt.toISOString() : null,
        updatedAt: vehicle.updatedAt ? vehicle.updatedAt.toISOString() : null,
      }));

      return { success: true, data: processedData, count: processedData.length };
    }

    return { success: true, data: [], count: 0 };

  } catch (error) {
    console.error('❌ Error al obtener vehículos SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener vehículo por ID
 * @param {string} vehicleId - ID
 * @returns {Promise<Object|null>} - Vehículo
 */
export async function getVehicleById(vehicleId) {
  try {
    if (!vehicleId) {
      return { success: false, error: 'ID de vehículo requerido' };
    }

    const query = `SELECT * FROM ${TABLE_NAME} WHERE id = @id`;
    const result = await sqlConnection.query(query, { id: vehicleId });

    if (result.length === 0) {
      return { success: false, error: 'Vehículo no encontrado' };
    }

    const vehicle = result[0];

    // Procesar datos para compatibilidad
    const processedData = {
      id: vehicle.id,
      vehicleId: vehicle.vehicleId,
      name: vehicle.name,
      type: vehicle.type,
      fuelType: vehicle.fuelType?.toUpperCase() || vehicle.fuelType,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      plateNumber: vehicle.plateNumber,
      enginePower: vehicle.enginePower,
      fuelCapacity: vehicle.fuelCapacity,
      currentLocation: vehicle.currentLocation,
      operationalStatus: vehicle.operationalStatus,
      hasHourMeter: vehicle.hasHourMeter,
      initialHourMeter: vehicle.initialHourMeter,
      currentHourMeter: vehicle.currentHourMeter,
      totalHoursWorked: vehicle.totalHoursWorked,
      averageHoursPerDay: vehicle.averageHoursPerDay,
      fuelConsumptionPerHour: vehicle.fuelConsumptionPerHour,
      lastHourMeterUpdate: vehicle.lastHourMeterUpdate,
      hourMeterHistory: vehicle.hourMeterHistory ? JSON.parse(vehicle.hourMeterHistory) : [],
      totalFuelConsumed: vehicle.totalFuelConsumed,
      totalMovements: vehicle.totalMovements,
      lastMovementDate: vehicle.lastMovementDate,
      estimatedConsumptionPerHour: vehicle.estimatedConsumptionPerHour,
      maintenanceHistory: vehicle.maintenanceHistory ? JSON.parse(vehicle.maintenanceHistory) : [],
      searchTags: vehicle.searchTags ? JSON.parse(vehicle.searchTags) : [],
      createdBy: vehicle.createdBy,
      updatedBy: vehicle.updatedBy,
      createdAt: vehicle.createdAt ? vehicle.createdAt.toISOString() : null,
      updatedAt: vehicle.updatedAt ? vehicle.updatedAt.toISOString() : null,
    };

    return { success: true, data: processedData };

  } catch (error) {
    console.error('❌ Error al obtener vehículo SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener vehículo por código
 * @param {string} vehicleCode - Código
 * @returns {Promise<Object|null>} - Vehículo
 */
export async function getVehicleByCode(vehicleCode) {
  try {
    if (!vehicleCode) {
      return { success: false, error: 'Código de vehículo requerido' };
    }

    const query = `SELECT * FROM ${TABLE_NAME} WHERE vehicleId = @vehicleId`;
    const result = await sqlConnection.query(query, { vehicleId: vehicleCode });

    if (result.length === 0) {
      return { success: false, error: 'Vehículo no encontrado' };
    }

    const vehicle = result[0];

    // Procesar datos para compatibilidad
    const processedData = {
      id: vehicle.id,
      vehicleId: vehicle.vehicleId,
      name: vehicle.name,
      type: vehicle.type,
      fuelType: vehicle.fuelType?.toUpperCase() || vehicle.fuelType,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      plateNumber: vehicle.plateNumber,
      enginePower: vehicle.enginePower,
      fuelCapacity: vehicle.fuelCapacity,
      currentLocation: vehicle.currentLocation,
      operationalStatus: vehicle.operationalStatus,
      hasHourMeter: vehicle.hasHourMeter,
      initialHourMeter: vehicle.initialHourMeter,
      currentHourMeter: vehicle.currentHourMeter,
      totalHoursWorked: vehicle.totalHoursWorked,
      averageHoursPerDay: vehicle.averageHoursPerDay,
      fuelConsumptionPerHour: vehicle.fuelConsumptionPerHour,
      lastHourMeterUpdate: vehicle.lastHourMeterUpdate,
      hourMeterHistory: vehicle.hourMeterHistory ? JSON.parse(vehicle.hourMeterHistory) : [],
      totalFuelConsumed: vehicle.totalFuelConsumed,
      totalMovements: vehicle.totalMovements,
      lastMovementDate: vehicle.lastMovementDate,
      estimatedConsumptionPerHour: vehicle.estimatedConsumptionPerHour,
      maintenanceHistory: vehicle.maintenanceHistory ? JSON.parse(vehicle.maintenanceHistory) : [],
      searchTags: vehicle.searchTags ? JSON.parse(vehicle.searchTags) : [],
      createdBy: vehicle.createdBy,
      updatedBy: vehicle.updatedBy,
      createdAt: vehicle.createdAt ? vehicle.createdAt.toISOString() : null,
      updatedAt: vehicle.updatedAt ? vehicle.updatedAt.toISOString() : null,
    };

    return { success: true, data: processedData };

  } catch (error) {
    console.error('❌ Error al buscar vehículo por código SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualizar vehículo
 * @param {string} vehicleId - ID
 * @param {Object} updateData - Datos a actualizar
 * @param {Object} userInfo - Información del usuario (opcional)
 * @returns {Promise<Object>} - Resultado
 */
export async function updateVehicle(vehicleId, updateData, userInfo = null) {
  try {
    if (!vehicleId) {
      return { success: false, error: 'ID de vehículo requerido' };
    }

    console.log('🚗 Actualizando vehículo SQL en Functions:', vehicleId, updateData);

    // Normalizar fuelType
    if (updateData.fuelType) {
      updateData.fuelType = updateData.fuelType.toUpperCase();
    }

    // Verificar duplicado si cambia vehicleId
    if (updateData.vehicleId) {
      const existing = await getVehicleByCode(updateData.vehicleId);
      if (existing.success && existing.data && existing.data.id !== vehicleId) {
        return { success: false, error: `El código de vehículo '${updateData.vehicleId}' ya existe` };
      }
    }

    // Obtener vehículo actual
    const currentResult = await getVehicleById(vehicleId);
    if (!currentResult.success) {
      return currentResult;
    }

    const currentVehicle = currentResult.data;

    // Preparar datos
    const updatedData = {
      ...updateData,
      updatedBy: userInfo?.email || 'unknown',
      updatedAt: new Date(),
      // Recalcular si cambian specs
      ...(updateData.enginePower || updateData.type ? {
        estimatedConsumptionPerHour: calculateEstimatedConsumption({
          ...currentVehicle,
          ...updateData,
        }),
      } : {}),
      // Actualizar searchTags si cambian campos relevantes
      ...(updateData.vehicleId || updateData.name || updateData.brand || updateData.model || updateData.type ? {
        searchTags: JSON.stringify([
          (updateData.vehicleId || currentVehicle.vehicleId)?.toLowerCase(),
          (updateData.name || currentVehicle.name)?.toLowerCase(),
          (updateData.brand || currentVehicle.brand)?.toLowerCase(),
          (updateData.model || currentVehicle.model)?.toLowerCase(),
          (updateData.type || currentVehicle.type)?.toLowerCase(),
        ].filter(Boolean)),
      } : {}),
    };

    // Construir UPDATE
    const setParts = [];
    const params = { id: vehicleId };

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
      id: vehicleId,
      message: 'Vehículo actualizado exitosamente',
      rowsAffected: result.rowsAffected,
    };

  } catch (error) {
    console.error('❌ Error al actualizar vehículo SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Eliminar vehículo
 * @param {string} vehicleId - ID
 * @returns {Promise<Object>} - Resultado
 */
export async function deleteVehicle(vehicleId) {
  try {
    if (!vehicleId) {
      return { success: false, error: 'ID de vehículo requerido' };
    }

    console.log('🚗 Eliminando vehículo SQL en Functions:', vehicleId);

    // Verificar movimientos recientes
    const movementsQuery = `
      SELECT TOP 1 id FROM ${MOVEMENTS_TABLE}
      WHERE vehicleId = @vehicleId
      ORDER BY createdAt DESC
    `;

    const movementsResult = await sqlConnection.query(movementsQuery, { vehicleId });
    if (movementsResult.length > 0) {
      return {
        success: false,
        error: 'No se puede eliminar un vehículo con movimientos asociados. Cambie el estado a inactivo en su lugar.'
      };
    }

    // Eliminar el vehículo
    const deleteQuery = `DELETE FROM ${TABLE_NAME} WHERE id = @id`;
    const result = await sqlConnection.execute(deleteQuery, { id: vehicleId });

    console.log('✅ Vehículo SQL eliminado exitosamente en Functions');
    return { success: true, message: 'Vehículo eliminado exitosamente', rowsAffected: result.rowsAffected };

  } catch (error) {
    console.error('❌ Error al eliminar vehículo SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtener estadísticas de vehículos
 * @param {Object} filters - Filtros
 * @returns {Promise<Object>} - Stats
 */
export async function getVehiclesStats(filters = {}) {
  try {
    console.log('📊 Obteniendo estadísticas de vehículos SQL en Functions');

    const vehiclesResult = await getAllVehicles(filters);
    if (!vehiclesResult.success) {
      return vehiclesResult;
    }

    const vehicles = vehiclesResult.data;

    const stats = {
      totalVehicles: vehicles.length,
      byType: {},
      byStatus: {},
      byFuelType: {},
      totalFuelConsumed: 0,
      totalHoursWorked: 0,
      averageConsumption: 0,
      mostActiveVehicle: null,
      leastActiveVehicle: null,
    };

    let maxMovements = 0;
    let minMovements = Infinity;

    vehicles.forEach((vehicle) => {
      stats.byType[vehicle.type] = (stats.byType[vehicle.type] || 0) + 1;
      stats.byStatus[vehicle.operationalStatus] = (stats.byStatus[vehicle.operationalStatus] || 0) + 1;
      stats.byFuelType[vehicle.fuelType] = (stats.byFuelType[vehicle.fuelType] || 0) + 1;

      stats.totalFuelConsumed += vehicle.totalFuelConsumed || 0;
      stats.totalHoursWorked += vehicle.totalHoursWorked || 0;

      const movements = vehicle.totalMovements || 0;
      if (movements > maxMovements) {
        maxMovements = movements;
        stats.mostActiveVehicle = vehicle;
      }
      if (movements < minMovements && movements > 0) {
        minMovements = movements;
        stats.leastActiveVehicle = vehicle;
      }
    });

    if (stats.totalHoursWorked > 0) {
      stats.averageConsumption = stats.totalFuelConsumed / stats.totalHoursWorked;
    }

    return { success: true, data: stats };

  } catch (error) {
    console.error('❌ Error al calcular stats SQL en Functions:', error);
    return { success: false, error: error.message };
  }
}