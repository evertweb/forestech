/**
 * MaintenanceService - Servicio refactorizado para gestión de mantenimientos de vehículos
 * Utiliza BaseService y CRUDService para operaciones optimizadas
 * Maneja cambios de aceite, filtros, baterías y mantenimientos preventivos
 * Integra con sistema de horómetro de tractores TR1, TR2, TR3
 */
import { CRUDService } from './base/CRUDService.js';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Tipos de mantenimiento
export const MAINTENANCE_TYPES = {
  OIL_CHANGE: 'oil_change',
  BATTERY_CHANGE: 'battery_change',
  FILTER_CHANGE: 'filter_change',
  GENERAL_MAINTENANCE: 'general_maintenance',
};

// Estados de mantenimiento
export const MAINTENANCE_STATUS = {
  COMPLETED: 'completado',
  PENDING: 'pendiente',
  CANCELLED: 'cancelado',
};

// Estados de baterías
export const BATTERY_STATUS = {
  NEW: 'nueva',
  USED: 'usada',
  REPAIRED: 'reparada',
};

// Constantes de mantenimiento
export const MAINTENANCE_CONSTANTS = {
  OIL_CHANGE_HOURS: 250, // Cambio de aceite cada 250 horas
  FILTER_CHANGE_HOURS: 500, // Cambio de filtros cada 500 horas
  BATTERY_LIFETIME_MONTHS: 24, // Vida útil batería 24 meses
};

const VEHICLES_COLLECTION = 'combustibles_vehicles';

class MaintenanceService extends CRUDService {
  constructor() {
    super('combustibles_maintenance', {
      enableTimestamps: true,
      enableSoftDelete: false,
      defaultOrderBy: 'date',
      defaultOrderDirection: 'desc',
    });
  }

  validateData(data) {
    const baseValidation = super.validateData(data);
    if (!baseValidation.isValid) return baseValidation;

    const errors = [];

    // Campos obligatorios
    if (!data.type) {
      errors.push('El tipo de mantenimiento es obligatorio');
    }

    if (!data.vehicleId) {
      errors.push('El vehículo es obligatorio');
    }

    if (!data.date) {
      errors.push('La fecha es obligatoria');
    }

    // Validar tipo de mantenimiento
    if (data.type && !Object.values(MAINTENANCE_TYPES).includes(data.type)) {
      errors.push('Tipo de mantenimiento inválido');
    }

    // Validar estado
    if (data.status && !Object.values(MAINTENANCE_STATUS).includes(data.status)) {
      errors.push('Estado de mantenimiento inválido');
    }

    // Validaciones específicas por tipo
    if (data.type === MAINTENANCE_TYPES.OIL_CHANGE) {
      if (!data.quantity || Number(data.quantity) <= 0) {
        errors.push('La cantidad de aceite es obligatoria y debe ser mayor a 0');
      }
      if (data.currentHours !== undefined && Number(data.currentHours) < 0) {
        errors.push('La lectura del horómetro no puede ser negativa');
      }
    }

    if (data.type === MAINTENANCE_TYPES.BATTERY_CHANGE) {
      if (!data.batteryType) {
        errors.push('El tipo de batería es obligatorio');
      }
      if (data.cost !== undefined && Number(data.cost) <= 0) {
        errors.push('El costo de la batería debe ser mayor a 0');
      }
    }

    // Validar estado de batería
    if (data.batteryStatus && !Object.values(BATTERY_STATUS).includes(data.batteryStatus)) {
      errors.push('Estado de batería inválido');
    }

    return { isValid: errors.length === 0, errors };
  }

  processData(data, isUpdate = false) {
    const baseProcessed = super.processData(data, isUpdate);

    // Procesar números
    if (data.quantity !== undefined) {
      baseProcessed.quantity = Number(data.quantity);
    }
    if (data.currentHours !== undefined) {
      baseProcessed.currentHours = Number(data.currentHours);
    }
    if (data.cost !== undefined) {
      baseProcessed.cost = Number(data.cost);
    }

    // Estado por defecto
    if (!isUpdate && !data.status) {
      baseProcessed.status = MAINTENANCE_STATUS.COMPLETED;
    }

    // Usuario por defecto
    if (!isUpdate && !data.createdBy) {
      baseProcessed.createdBy = 'system';
    }

    // Calcular próximo cambio de aceite
    if (data.type === MAINTENANCE_TYPES.OIL_CHANGE && data.currentHours) {
      baseProcessed.nextChangeHours = this.calculateNextOilChange(data.currentHours);
    }

    // Calcular próximo cambio de batería
    if (data.type === MAINTENANCE_TYPES.BATTERY_CHANGE && data.date) {
      baseProcessed.nextBatteryChange = this.calculateNextBatteryChange(data.date);
    }

    return baseProcessed;
  }

  enrichData(item) {
    return {
      ...item,
      // Convertir timestamps si es necesario
      createdAt: item.createdAt?.toDate?.() || item.createdAt,
      updatedAt: item.updatedAt?.toDate?.() || item.updatedAt,
      date: item.date?.toDate?.() || item.date,
      nextBatteryChange: item.nextBatteryChange?.toDate?.() || item.nextBatteryChange,
    };
  }

  calculateNextOilChange(currentHours) {
    return parseInt(currentHours) + MAINTENANCE_CONSTANTS.OIL_CHANGE_HOURS;
  }

  calculateNextBatteryChange(lastChangeDate) {
    const date = new Date(lastChangeDate);
    date.setMonth(date.getMonth() + MAINTENANCE_CONSTANTS.BATTERY_LIFETIME_MONTHS);
    return date;
  }

  async createMaintenance(data, user) {
    try {
      const result = await this.create(data, user);

      // Actualizar horómetro del vehículo si es necesario
      if (result.success && data.vehicleId && data.currentHours) {
        await this.updateVehicleHourMeter(data.vehicleId, data.currentHours);
      }

      return result;
    } catch (error) {
      this.logError('createMaintenance', error, data);
      return { success: false, error: error.message };
    }
  }

  async getAllMaintenance(filters = {}) {
    try {
      // Construir filtros para CRUDService
      const crudFilters = [];

      if (filters.type) {
        crudFilters.push({ field: 'type', operator: '==', value: filters.type });
      }
      if (filters.vehicleId) {
        crudFilters.push({ field: 'vehicleId', operator: '==', value: filters.vehicleId });
      }
      if (filters.status) {
        crudFilters.push({ field: 'status', operator: '==', value: filters.status });
      }
      if (filters.dateFrom) {
        crudFilters.push({ field: 'date', operator: '>=', value: new Date(filters.dateFrom) });
      }
      if (filters.dateTo) {
        crudFilters.push({ field: 'date', operator: '<=', value: new Date(filters.dateTo) });
      }

      const result = await this.getAll(crudFilters, {
        orderBy: 'date',
        orderDirection: 'desc',
      });

      if (!result.success) return result;

      // Enriquecer datos
      const enrichedData = result.data.map((item) => this.enrichData(item));

      return { ...result, data: enrichedData };
    } catch (error) {
      this.logError('getAllMaintenance', error, filters);
      return { success: false, error: error.message };
    }
  }

  async getMaintenanceById(id) {
    const result = await this.getById(id);
    if (!result.success) return result;

    // Enriquecer datos
    const enrichedData = this.enrichData(result.data);

    return { ...result, data: enrichedData };
  }

  async updateMaintenance(id, data, user) {
    try {
      const result = await this.update(id, data, user);

      // Actualizar horómetro del vehículo si es necesario
      if (result.success && data.vehicleId && data.currentHours) {
        await this.updateVehicleHourMeter(data.vehicleId, data.currentHours);
      }

      return result;
    } catch (error) {
      this.logError('updateMaintenance', error, { id, data });
      return { success: false, error: error.message };
    }
  }

  async deleteMaintenance(id) {
    return await this.delete(id);
  }

  async getMaintenanceByVehicle(vehicleId) {
    try {
      const filters = [{ field: 'vehicleId', operator: '==', value: vehicleId }];
      const result = await this.getAll(filters, {
        orderBy: 'date',
        orderDirection: 'desc',
      });

      if (!result.success) return result;

      // Enriquecer datos
      const enrichedData = result.data.map((item) => this.enrichData(item));

      return { ...result, data: enrichedData };
    } catch (error) {
      this.logError('getMaintenanceByVehicle', error, { vehicleId });
      return { success: false, error: error.message };
    }
  }

  async getUpcomingMaintenance() {
    try {
      const today = new Date();
      const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

      const filters = [
        { field: 'nextChangeDate', operator: '>=', value: today },
        { field: 'nextChangeDate', operator: '<=', value: nextMonth },
      ];

      const result = await this.getAll(filters, {
        orderBy: 'nextChangeDate',
        orderDirection: 'asc',
      });

      if (!result.success) return result;

      // Enriquecer datos
      const enrichedData = result.data.map((item) => this.enrichData(item));

      return { ...result, data: enrichedData };
    } catch (error) {
      this.logError('getUpcomingMaintenance', error);
      return { success: false, error: error.message };
    }
  }

  async getMaintenanceStats(filters = {}) {
    try {
      const result = await this.getAllMaintenance(filters);
      if (!result.success) return result;

      const maintenanceRecords = result.data;

      const stats = {
        total: maintenanceRecords.length,
        byType: {},
        byStatus: {},
        byVehicle: {},
        totalCost: 0,
        averageCost: 0,
        upcomingCount: 0,
        overdueCount: 0,
      };

      let totalCost = 0;

      maintenanceRecords.forEach((record) => {
        // Por tipo
        stats.byType[record.type] = (stats.byType[record.type] || 0) + 1;

        // Por estado
        stats.byStatus[record.status] = (stats.byStatus[record.status] || 0) + 1;

        // Por vehículo
        stats.byVehicle[record.vehicleId] = (stats.byVehicle[record.vehicleId] || 0) + 1;

        // Costo total
        if (record.cost) {
          totalCost += parseFloat(record.cost);
        }

        // Próximos y vencidos
        if (record.nextChangeDate) {
          const nextDate = new Date(record.nextChangeDate);
          const today = new Date();

          if (nextDate > today) {
            stats.upcomingCount++;
          } else {
            stats.overdueCount++;
          }
        }
      });

      stats.totalCost = totalCost;
      stats.averageCost = stats.total > 0 ? totalCost / stats.total : 0;

      return { success: true, data: stats };
    } catch (error) {
      this.logError('getMaintenanceStats', error, filters);
      return { success: false, error: error.message };
    }
  }

  async getVehiclesForMaintenance() {
    try {
      const q = query(
        collection(db, VEHICLES_COLLECTION),
        where('status', 'in', ['activo', 'mantenimiento']),
        orderBy('name', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const vehicles = [];

      querySnapshot.forEach((doc) => {
        vehicles.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return { success: true, data: vehicles };
    } catch (error) {
      this.logError('getVehiclesForMaintenance', error);
      return { success: false, error: error.message };
    }
  }

  subscribeToMaintenance(callback, filters = {}) {
    // Construir filtros para el método base
    const subscribeFilters = [];

    if (filters.type) {
      subscribeFilters.push({ field: 'type', operator: '==', value: filters.type });
    }
    if (filters.vehicleId) {
      subscribeFilters.push({ field: 'vehicleId', operator: '==', value: filters.vehicleId });
    }
    if (filters.status) {
      subscribeFilters.push({ field: 'status', operator: '==', value: filters.status });
    }

    // Wrapper para enriquecer datos en tiempo real
    return this.subscribeToChanges(
      (maintenanceRecords, error) => {
        if (error) {
          callback([], error);
          return;
        }

        const enrichedRecords = maintenanceRecords.map((record) => this.enrichData(record));
        callback(enrichedRecords, null);
      },
      {
        filters: subscribeFilters,
        orderBy: 'date',
        orderDirection: 'desc',
      }
    );
  }

  async updateVehicleHourMeter(vehicleId, newHours) {
    try {
      const vehiclesQuery = query(
        collection(db, VEHICLES_COLLECTION),
        where('vehicleId', '==', vehicleId)
      );

      const vehicleSnapshot = await getDocs(vehiclesQuery);

      if (!vehicleSnapshot.empty) {
        const vehicleDoc = vehicleSnapshot.docs[0];
        const vehicleData = vehicleDoc.data();

        if (vehicleData.hasHourMeter && vehicleData.type === 'tractor') {
          const currentHours = parseInt(vehicleData.currentHours) || 0;
          const newHoursInt = parseInt(newHours) || 0;

          if (newHoursInt > currentHours) {
            await updateDoc(vehicleDoc.ref, {
              currentHours: newHoursInt,
              lastHourMeterDate: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });

            this.logInfo(
              'updateVehicleHourMeter',
              `Horómetro actualizado: ${vehicleId} - ${currentHours}h → ${newHoursInt}h`
            );
          }
        }
      }
    } catch (error) {
      this.logError('updateVehicleHourMeter', error, { vehicleId, newHours });
      // No hacer throw para no afectar el mantenimiento principal
    }
  }
}

// Singleton
const maintenanceService = new MaintenanceService();

// Exports para compatibilidad con código existente
export const createMaintenanceRecord = (data) => maintenanceService.createMaintenance(data);
export const getAllMaintenanceRecords = (filters) => maintenanceService.getAllMaintenance(filters);
export const getMaintenanceRecord = (id) => maintenanceService.getMaintenanceById(id);
export const updateMaintenanceRecord = (id, data) => maintenanceService.updateMaintenance(id, data);
export const deleteMaintenanceRecord = (id) => maintenanceService.deleteMaintenance(id);
export const getMaintenanceByVehicle = (vehicleId) =>
  maintenanceService.getMaintenanceByVehicle(vehicleId);
export const getUpcomingMaintenance = () => maintenanceService.getUpcomingMaintenance();
export const getMaintenanceStats = (filters) => maintenanceService.getMaintenanceStats(filters);
export const subscribeToMaintenance = (callback, filters) =>
  maintenanceService.subscribeToMaintenance(callback, filters);
export const getVehiclesForMaintenance = () => maintenanceService.getVehiclesForMaintenance();
export const calculateNextOilChange = (currentHours) =>
  maintenanceService.calculateNextOilChange(currentHours);
export const calculateNextBatteryChange = (lastChangeDate) =>
  maintenanceService.calculateNextBatteryChange(lastChangeDate);

export default maintenanceService;
