/**
 * SqlVehiclesService - Servicio de vehículos usando Azure SQL Server
 * Adaptación del vehiclesService original para usar SQL Server
 * Forestech Combustibles App
 */

import SqlCrudService from './base/SqlCrudService.js';
import sqlConnection from './base/SqlConnection.js';
import { VEHICLE_STATUS, FUEL_TYPES } from '../data/vehicleCategories.js';

const TABLE_NAME = 'combustibles_vehicles';
const MOVEMENTS_TABLE = 'combustibles_movements';

// Re-exportar constantes para compatibilidad
export { VEHICLE_STATUS, FUEL_TYPES } from '../data/vehicleCategories.js';

export const FUEL_COMPATIBILITY = {
  DIESEL: 'DIESEL',
  GASOLINE: 'GASOLINE',
  MIXED: 'MIXED',
};

class SqlVehiclesService extends SqlCrudService {
  constructor() {
    super(TABLE_NAME, {
      enableTimestamps: true,
      defaultOrderBy: 'vehicleId',
      defaultOrderDirection: 'ASC',
      primaryKey: 'id',
    });
  }

  /**
   * Validar datos de vehículo (mismo que original)
   * @param {Object} vehicleData - Datos a validar
   */
  validateVehicleData(vehicleData) {
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
  }

  /**
   * Calcular consumo estimado por hora (mismo que original)
   * @param {Object} vehicleData - Datos del vehículo
   * @returns {number} - Consumo estimado
   */
  calculateEstimatedConsumption(vehicleData) {
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
  }

  /**
   * Crear un nuevo vehículo
   * @param {Object} vehicleData - Datos del vehículo
   * @returns {Promise<Object>} - Resultado
   */
  async createVehicle(vehicleData) {
    try {
      console.log('🚀 Iniciando creación de vehículo SQL:', vehicleData);

      // Normalizar fuelType
      if (vehicleData.fuelType) {
        vehicleData.fuelType = vehicleData.fuelType.toUpperCase();
      }

      // Validar
      this.validateVehicleData(vehicleData);

      // Verificar duplicado por vehicleId
      const existing = await this.getByField('vehicleId', vehicleData.vehicleId);
      if (existing.success && existing.data.length > 0) {
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
        ...vehicleData,
        ...hourMeterData,
        status: vehicleData.status || VEHICLE_STATUS.ACTIVO,
        totalFuelConsumed: 0,
        totalMovements: 0,
        lastMovementDate: null,
        estimatedConsumptionPerHour: this.calculateEstimatedConsumption(vehicleData),
        maintenanceHistory: JSON.stringify([]),
        searchTags: JSON.stringify([
          vehicleData.vehicleId?.toLowerCase(),
          vehicleData.name?.toLowerCase(),
          vehicleData.brand?.toLowerCase(),
          vehicleData.model?.toLowerCase(),
          vehicleData.type?.toLowerCase(),
        ].filter(Boolean)),
      };

      const result = await this.create(vehicle, { duplicateField: 'vehicleId' });

      if (result.success) {
        console.log('✅ Vehículo SQL creado exitosamente:', result.id);
        if (vehicle.hasHourMeter && vehicle.initialHourMeter !== null) {
          console.log(`⏰ Horómetro inicializado en ${vehicle.initialHourMeter} horas`);
        }
      }

      return result;
    } catch (error) {
      console.error('❌ Error al crear vehículo SQL:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener todos los vehículos
   * @param {Object} filters - Filtros
   * @returns {Promise<Array>} - Lista de vehículos
   */
  async getAllVehicles(filters = {}) {
    try {
      // Normalizar fuelType
      if (filters.fuelType) {
        filters.fuelType = filters.fuelType.toUpperCase();
      }

      const sqlFilters = [];
      if (filters.type) sqlFilters.push({ field: 'type', value: filters.type });
      if (filters.status) sqlFilters.push({ field: 'operationalStatus', value: filters.status });
      if (filters.fuelType) sqlFilters.push({ field: 'fuelType', value: filters.fuelType });
      if (filters.currentLocation) sqlFilters.push({ field: 'currentLocation', value: filters.currentLocation });

      const result = await this.getAll({
        filters: sqlFilters,
        orderBy: 'vehicleId',
        orderDirection: 'ASC',
      });

      if (result.success) {
        // Procesar datos para compatibilidad (convertir JSON fields)
        result.data = result.data.map(vehicle => ({
          ...vehicle,
          fuelType: vehicle.fuelType?.toUpperCase() || vehicle.fuelType,
          hourMeterHistory: vehicle.hourMeterHistory ? JSON.parse(vehicle.hourMeterHistory) : [],
          maintenanceHistory: vehicle.maintenanceHistory ? JSON.parse(vehicle.maintenanceHistory) : [],
          searchTags: vehicle.searchTags ? JSON.parse(vehicle.searchTags) : [],
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
          lastMovementDate: vehicle.lastMovementDate,
          lastMaintenanceDate: vehicle.lastMaintenanceDate,
          lastHourMeterUpdate: vehicle.lastHourMeterUpdate,
        }));
      }

      return result.success ? result.data : [];
    } catch (error) {
      console.error('❌ Error al obtener vehículos SQL:', error);
      throw new Error(`Error al obtener vehículos: ${error.message}`);
    }
  }

  /**
   * Obtener vehículo por ID
   * @param {string} vehicleId - ID
   * @returns {Promise<Object|null>} - Vehículo
   */
  async getVehicle(vehicleId) {
    try {
      if (!vehicleId) {
        throw new Error('ID de vehículo requerido');
      }

      const result = await this.getById(vehicleId);

      if (result.success) {
        const vehicle = result.data;
        return {
          id: vehicle.id,
          ...vehicle,
          fuelType: vehicle.fuelType?.toUpperCase() || vehicle.fuelType,
          hourMeterHistory: vehicle.hourMeterHistory ? JSON.parse(vehicle.hourMeterHistory) : [],
          maintenanceHistory: vehicle.maintenanceHistory ? JSON.parse(vehicle.maintenanceHistory) : [],
          searchTags: vehicle.searchTags ? JSON.parse(vehicle.searchTags) : [],
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
          lastMovementDate: vehicle.lastMovementDate,
          lastMaintenanceDate: vehicle.lastMaintenanceDate,
          lastHourMeterUpdate: vehicle.lastHourMeterUpdate,
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Error al obtener vehículo SQL:', error);
      throw new Error(`Error al obtener vehículo: ${error.message}`);
    }
  }

  /**
   * Obtener vehículo por código
   * @param {string} vehicleCode - Código
   * @returns {Promise<Object|null>} - Vehículo
   */
  async getVehicleByCode(vehicleCode) {
    try {
      const result = await this.getByField('vehicleId', vehicleCode);

      if (result.success && result.data.length > 0) {
        const vehicle = result.data[0];
        return {
          id: vehicle.id,
          ...vehicle,
          fuelType: vehicle.fuelType?.toUpperCase() || vehicle.fuelType,
          hourMeterHistory: vehicle.hourMeterHistory ? JSON.parse(vehicle.hourMeterHistory) : [],
          maintenanceHistory: vehicle.maintenanceHistory ? JSON.parse(vehicle.maintenanceHistory) : [],
          searchTags: vehicle.searchTags ? JSON.parse(vehicle.searchTags) : [],
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
          lastMovementDate: vehicle.lastMovementDate,
          lastMaintenanceDate: vehicle.lastMaintenanceDate,
          lastHourMeterUpdate: vehicle.lastHourMeterUpdate,
        };
      }

      return null;
    } catch (error) {
      console.error('❌ Error al buscar vehículo por código SQL:', error);
      throw new Error(`Error al buscar vehículo: ${error.message}`);
    }
  }

  /**
   * Actualizar vehículo
   * @param {string} vehicleId - ID
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise<Object>} - Resultado
   */
  async updateVehicle(vehicleId, updateData) {
    try {
      if (!vehicleId) {
        throw new Error('ID de vehículo requerido');
      }

      // Normalizar fuelType
      if (updateData.fuelType) {
        updateData.fuelType = updateData.fuelType.toUpperCase();
      }

      // Verificar duplicado si cambia vehicleId
      if (updateData.vehicleId) {
        const existing = await this.getByField('vehicleId', updateData.vehicleId);
        if (existing.success && existing.data.length > 0 && existing.data[0].id !== vehicleId) {
          throw new Error(`El código de vehículo '${updateData.vehicleId}' ya existe`);
        }
      }

      const currentVehicle = await this.getVehicle(vehicleId);
      if (!currentVehicle) {
        throw new Error('Vehículo no encontrado');
      }

      // Preparar datos
      const updatedData = {
        ...updateData,
        // Recalcular si cambian specs
        ...(updateData.enginePower || updateData.type ? {
          estimatedConsumptionPerHour: this.calculateEstimatedConsumption({
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

      const result = await this.update(vehicleId, updatedData, { duplicateField: 'vehicleId' });

      if (result.success) {
        console.log('✅ Vehículo SQL actualizado exitosamente');
        return { success: true, data: { ...currentVehicle, ...updatedData } };
      }

      return result;
    } catch (error) {
      console.error('❌ Error al actualizar vehículo SQL:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Eliminar vehículo
   * @param {string} vehicleId - ID
   * @returns {Promise<void>}
   */
  async deleteVehicle(vehicleId) {
    try {
      if (!vehicleId) {
        throw new Error('ID de vehículo requerido');
      }

      // Verificar movimientos recientes
      const movementsResult = await this.getMovementsForVehicle(vehicleId, { limit: 1 });
      if (movementsResult.length > 0) {
        throw new Error('No se puede eliminar un vehículo con movimientos asociados. Cambie el estado a inactivo en su lugar.');
      }

      const result = await this.delete(vehicleId);

      if (result.success) {
        console.log('✅ Vehículo SQL eliminado exitosamente');
      }

      return result;
    } catch (error) {
      console.error('❌ Error al eliminar vehículo SQL:', error);
      throw new Error(`Error al eliminar vehículo: ${error.message}`);
    }
  }

  /**
   * Suscribirse a vehículos (polling para simular real-time, ya que SQL no tiene snapshots)
   * @param {Function} callback - Callback
   * @param {Object} filters - Filtros
   * @returns {Function} - Unsubscribe
   */
  subscribeToVehicles(callback, filters = {}) {
    // Implementación simple con polling cada 5s (para compatibilidad; ideal usar WebSockets)
    const interval = setInterval(async () => {
      const vehicles = await this.getAllVehicles(filters);
      callback(vehicles, null, { added: [], modified: [], removed: [] }); // Mock changes
    }, 5000);

    // Llamada inicial
    this.getAllVehicles(filters).then(vehicles => callback(vehicles, null, { added: [], modified: [], removed: [] }));

    return () => clearInterval(interval);
  }

  /**
   * Suscribirse a stats (polling)
   * @param {Function} callback - Callback
   * @param {Object} filters - Filtros
   * @returns {Function} - Unsubscribe
   */
  subscribeToVehiclesStats(callback, filters = {}) {
    const interval = setInterval(async () => {
      const stats = await this.getVehiclesStats(filters);
      callback(stats);
    }, 10000);

    this.getVehiclesStats(filters).then(stats => callback(stats));

    return () => clearInterval(interval);
  }

  /**
   * Obtener movimientos del vehículo
   * @param {string} vehicleCode - Código
   * @param {Object} options - Opciones
   * @returns {Promise<Array>} - Movimientos
   */
  async getVehicleMovements(vehicleCode, options = {}) {
    try {
      // Asumir conexión a movimientos service o query directo
      const movementsService = new SqlMovementsService(); // Importar si necesario
      return await movementsService.getMovementsByVehicle(vehicleCode, options); // Implementar si no existe
    } catch (error) {
      console.error('❌ Error al obtener movimientos SQL:', error);
      throw new Error(`Error al obtener movimientos: ${error.message}`);
    }
  }

  /**
   * Actualizar métricas del vehículo
   * @param {string} vehicleCode - Código
   * @param {Object} movementData - Datos movimiento
   * @returns {Promise<void>}
   */
  async updateVehicleMetrics(vehicleCode, movementData) {
    try {
      const vehicle = await this.getVehicleByCode(vehicleCode);
      if (!vehicle) {
        console.warn(`Vehículo ${vehicleCode} no encontrado para actualizar métricas`);
        return;
      }

      const newTotalFuel = (vehicle.totalFuelConsumed || 0) + movementData.quantity;
      const newTotalMovements = (vehicle.totalMovements || 0) + 1;

      const updateData = {
        totalFuelConsumed: newTotalFuel,
        totalMovements: newTotalMovements,
        lastMovementDate: new Date(),
        ...(vehicle.totalHoursWorked > 0 ? {
          actualConsumptionPerHour: newTotalFuel / vehicle.totalHoursWorked,
        } : {}),
      };

      await this.updateVehicle(vehicle.id, updateData);

      console.log(`✅ Métricas del vehículo ${vehicleCode} actualizadas`);
    } catch (error) {
      console.error('❌ Error al actualizar métricas SQL:', error);
    }
  }

  /**
   * Actualizar horómetro
   * @param {string} vehicleCode - Código
   * @param {number} newHours - Nuevas horas
   * @param {string} notes - Notas
   * @returns {Promise<void>}
   */
  async updateHourMeter(vehicleCode, newHours, notes = '') {
    try {
      const vehicle = await this.getVehicleByCode(vehicleCode);
      if (!vehicle) {
        throw new Error(`Vehículo ${vehicleCode} no encontrado`);
      }

      if (!vehicle.hasHourMeter) {
        throw new Error(`El vehículo ${vehicleCode} no tiene sistema de horómetro`);
      }

      const currentHours = vehicle.currentHourMeter || 0;
      if (newHours < currentHours) {
        throw new Error(`La nueva lectura (${newHours}h) no puede ser menor a la actual (${currentHours}h)`);
      }

      const hoursWorked = newHours - currentHours;
      const history = vehicle.hourMeterHistory || [];
      history.push({
        previousReading: currentHours,
        newReading: newHours,
        hoursWorked,
        date: new Date(),
        notes,
        registeredBy: 'system',
      });

      const updateData = {
        currentHourMeter: newHours,
        lastHourMeterUpdate: new Date(),
        totalHoursWorked: (vehicle.totalHoursWorked || 0) + hoursWorked,
        hourMeterHistory: JSON.stringify(history),
        ...(vehicle.totalFuelConsumed > 0 ? {
          actualConsumptionPerHour: vehicle.totalFuelConsumed / ((vehicle.totalHoursWorked || 0) + hoursWorked),
        } : {}),
      };

      await this.updateVehicle(vehicle.id, updateData);

      console.log(`✅ Horómetro del vehículo ${vehicleCode} actualizado: ${currentHours}h → ${newHours}h (+${hoursWorked}h)`);
    } catch (error) {
      console.error('❌ Error al actualizar horómetro SQL:', error);
      throw new Error(`Error al actualizar horómetro: ${error.message}`);
    }
  }

  /**
   * Obtener historial de horómetro
   * @param {string} vehicleCode - Código
   * @param {number} limit - Límite
   * @returns {Promise<Array>} - Historial
   */
  async getHourMeterHistory(vehicleCode, limit = 50) {
    try {
      const vehicle = await this.getVehicleByCode(vehicleCode);
      if (!vehicle) {
        throw new Error(`Vehículo ${vehicleCode} no encontrado`);
      }

      if (!vehicle.hasHourMeter) {
        return [];
      }

      const history = vehicle.hourMeterHistory || [];
      return history
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit)
        .map(record => ({
          ...record,
          date: record.date,
        }));
    } catch (error) {
      console.error('❌ Error al obtener historial SQL:', error);
      throw new Error(`Error al obtener historial: ${error.message}`);
    }
  }

  /**
   * Calcular consumo de tractor
   * @param {string} vehicleCode - Código
   * @returns {Promise<Object>} - Métricas
   */
  async calculateTractorConsumption(vehicleCode) {
    try {
      const vehicle = await this.getVehicleByCode(vehicleCode);
      if (!vehicle) {
        throw new Error(`Vehículo ${vehicleCode} no encontrado`);
      }

      if (!vehicle.hasHourMeter) {
        throw new Error(`El vehículo ${vehicleCode} no tiene sistema de horómetro`);
      }

      const totalFuel = vehicle.totalFuelConsumed || 0;
      const totalHours = vehicle.totalHoursWorked || 0;
      const currentHours = vehicle.currentHourMeter || 0;
      const estimatedConsumption = vehicle.estimatedConsumptionPerHour || 0;

      const metrics = {
        vehicleCode,
        totalFuelConsumed: totalFuel,
        totalHoursWorked: totalHours,
        currentHoursReading: currentHours,
        estimatedConsumptionPerHour: estimatedConsumption,
        actualConsumptionPerHour: totalHours > 0 ? totalFuel / totalHours : 0,
        efficiencyPercentage: 0,
        fuelSaved: 0,
        projectedNextMaintenance: null,
      };

      if (estimatedConsumption > 0 && metrics.actualConsumptionPerHour > 0) {
        metrics.efficiencyPercentage = ((estimatedConsumption - metrics.actualConsumptionPerHour) / estimatedConsumption) * 100;
        metrics.fuelSaved = (estimatedConsumption - metrics.actualConsumptionPerHour) * totalHours;
      }

      const hoursUntilMaintenance = 250 - (currentHours % 250);
      metrics.projectedNextMaintenance = {
        hoursRemaining: hoursUntilMaintenance,
        projectedHours: currentHours + hoursUntilMaintenance,
      };

      return metrics;
    } catch (error) {
      console.error('❌ Error al calcular consumo SQL:', error);
      throw new Error(`Error al calcular métricas: ${error.message}`);
    }
  }

  /**
   * Obtener stats de vehículos
   * @param {Object} filters - Filtros
   * @returns {Promise<Object>} - Stats
   */
  async getVehiclesStats(filters = {}) {
    try {
      const vehicles = await this.getAllVehicles(filters);

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

      return stats;
    } catch (error) {
      console.error('❌ Error al calcular stats SQL:', error);
      throw new Error(`Error al calcular estadísticas: ${error.message}`);
    }
  }

  /**
   * Registrar mantenimiento
   * @param {string} vehicleId - ID
   * @param {Object} maintenanceData - Datos
   * @returns {Promise<void>}
   */
  async registerMaintenance(vehicleId, maintenanceData) {
    try {
      const vehicle = await this.getVehicle(vehicleId);
      if (!vehicle) {
        throw new Error('Vehículo no encontrado');
      }

      const maintenanceHistory = vehicle.maintenanceHistory || [];
      maintenanceHistory.push({
        ...maintenanceData,
        date: new Date(),
        registeredAt: new Date(),
      });

      const updateData = {
        maintenanceHistory: JSON.stringify(maintenanceHistory),
        lastMaintenanceDate: new Date(),
        ...(maintenanceData.type === 'major' ? {
          operationalStatus: VEHICLE_STATUS.MANTENIMIENTO,
        } : {}),
      };

      await this.updateVehicle(vehicleId, updateData);

      console.log('✅ Mantenimiento SQL registrado exitosamente');
    } catch (error) {
      console.error('❌ Error al registrar mantenimiento SQL:', error);
      throw new Error(`Error al registrar mantenimiento: ${error.message}`);
    }
  }

  /**
   * Contar vehículos por categoría
   * @param {string} categoryId - ID categoría
   * @returns {Promise<number>} - Conteo
   */
  async countVehiclesByCategory(categoryId) {
    try {
      console.log('🔍 Contando vehículos para categoría SQL:', categoryId);

      const result = await this.count({ category: categoryId });

      if (result.success) {
        console.log('📊 Vehículos encontrados:', result.count);
        return result.count;
      }

      return 0;
    } catch (error) {
      console.error('❌ Error al contar vehículos por categoría SQL:', error);
      return 0;
    }
  }

  // Método auxiliar para getByField (no en base, pero útil)
  async getByField(field, value) {
    try {
      const { whereClause, params } = this.buildWhereClause({ [field]: value });
      const query = `SELECT * FROM ${this.tableName} ${whereClause}`;
      const result = await this.executeQuery(query, params);
      return { success: true, data: result };
    } catch (error) {
      return this.handleError(error, 'GET_BY_FIELD');
    }
  }

  // Placeholder para getMovementsForVehicle (integrar con SqlMovementsService si existe)
  async getMovementsForVehicle(vehicleId, options) {
    // Implementar query a combustibles_movements WHERE vehicleId = @vehicleId
    const query = `
      SELECT * FROM ${MOVEMENTS_TABLE} 
      WHERE vehicleId = @vehicleId 
      ORDER BY createdAt DESC
      ${options.limit ? `TOP ${options.limit}` : ''}
    `;
    const result = await this.executeQuery(query, { vehicleId });
    return result.map(m => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));
  }
}

// Instancia singleton
const sqlVehiclesService = new SqlVehiclesService();

export default sqlVehiclesService;