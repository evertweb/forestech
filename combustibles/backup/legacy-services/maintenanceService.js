/**
 * MaintenanceService - Servicio para gestión de mantenimientos de vehículos
 * Maneja cambios de aceite, filtros, baterías y mantenimientos preventivos
 * Integra con sistema de horómetro de tractores TR1, TR2, TR3
 */

import { 
  collection, 
  addDoc,
  updateDoc, 
  deleteDoc,
  doc, 
  getDocs, 
  getDoc,
  query, 
  orderBy, 
  where,
  // limit,
  onSnapshot,
  serverTimestamp,
  // runTransaction
} from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'combustibles_maintenance';
const VEHICLES_COLLECTION = 'combustibles_vehicles';

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
 * Crear un nuevo registro de mantenimiento
 */
export const createMaintenanceRecord = async (maintenanceData) => {
  try {
    validateMaintenanceData(maintenanceData);

    const maintenance = {
      ...maintenanceData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: maintenanceData.status || MAINTENANCE_STATUS.COMPLETED,
      createdBy: maintenanceData.createdBy || 'system'
    };

    if (maintenanceData.type === MAINTENANCE_TYPES.OIL_CHANGE) {
      maintenance.nextChangeHours = calculateNextOilChange(maintenanceData.currentHours);
    }

    if (maintenanceData.type === MAINTENANCE_TYPES.BATTERY_CHANGE) {
      maintenance.nextBatteryChange = calculateNextBatteryChange(maintenanceData.date);
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), maintenance);
    
    if (maintenanceData.vehicleId && maintenanceData.currentHours) {
      await updateVehicleHourMeter(maintenanceData.vehicleId, maintenanceData.currentHours);
    }

    console.log('✅ Mantenimiento creado exitosamente:', docRef.id);
    return docRef.id;

  } catch (error) {
    console.error('❌ Error al crear mantenimiento:', error);
    throw new Error(`Error al crear mantenimiento: ${error.message}`);
  }
};

/**
 * Obtener todos los registros de mantenimiento con filtros opcionales
 */
export const getAllMaintenanceRecords = async (filters = {}) => {
  try {
    let q = collection(db, COLLECTION_NAME);

    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.vehicleId) {
      q = query(q, where('vehicleId', '==', filters.vehicleId));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.dateFrom) {
      q = query(q, where('date', '>=', new Date(filters.dateFrom)));
    }
    if (filters.dateTo) {
      q = query(q, where('date', '<=', new Date(filters.dateTo)));
    }

    q = query(q, orderBy('date', 'desc'));

    const querySnapshot = await getDocs(q);
    const maintenanceRecords = [];

    querySnapshot.forEach((doc) => {
      maintenanceRecords.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return maintenanceRecords;

  } catch (error) {
    console.error('❌ Error al obtener mantenimientos:', error);
    throw new Error(`Error al obtener mantenimientos: ${error.message}`);
  }
};

/**
 * Obtener un registro de mantenimiento por ID
 */
export const getMaintenanceRecord = async (maintenanceId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, maintenanceId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      throw new Error('Mantenimiento no encontrado');
    }

  } catch (error) {
    console.error('❌ Error al obtener mantenimiento:', error);
    throw new Error(`Error al obtener mantenimiento: ${error.message}`);
  }
};

/**
 * Actualizar un registro de mantenimiento
 */
export const updateMaintenanceRecord = async (maintenanceId, updateData) => {
  try {
    validateMaintenanceUpdateData(updateData);

    const docRef = doc(db, COLLECTION_NAME, maintenanceId);
    
    const updatePayload = {
      ...updateData,
      updatedAt: serverTimestamp()
    };

    if (updateData.currentHours && updateData.type === MAINTENANCE_TYPES.OIL_CHANGE) {
      updatePayload.nextChangeHours = calculateNextOilChange(updateData.currentHours);
    }

    await updateDoc(docRef, updatePayload);

    if (updateData.vehicleId && updateData.currentHours) {
      await updateVehicleHourMeter(updateData.vehicleId, updateData.currentHours);
    }

    console.log('✅ Mantenimiento actualizado exitosamente:', maintenanceId);

  } catch (error) {
    console.error('❌ Error al actualizar mantenimiento:', error);
    throw new Error(`Error al actualizar mantenimiento: ${error.message}`);
  }
};

/**
 * Eliminar un registro de mantenimiento
 */
export const deleteMaintenanceRecord = async (maintenanceId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, maintenanceId);
    await deleteDoc(docRef);
    
    console.log('✅ Mantenimiento eliminado exitosamente:', maintenanceId);

  } catch (error) {
    console.error('❌ Error al eliminar mantenimiento:', error);
    throw new Error(`Error al eliminar mantenimiento: ${error.message}`);
  }
};

/**
 * Obtener mantenimientos por vehículo específico
 */
export const getMaintenanceByVehicle = async (vehicleId) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('vehicleId', '==', vehicleId),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const maintenanceRecords = [];

    querySnapshot.forEach((doc) => {
      maintenanceRecords.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return maintenanceRecords;

  } catch (error) {
    console.error('❌ Error al obtener mantenimientos por vehículo:', error);
    throw new Error(`Error al obtener mantenimientos por vehículo: ${error.message}`);
  }
};

/**
 * Obtener próximos mantenimientos programados
 */
export const getUpcomingMaintenance = async () => {
  try {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

    const q = query(
      collection(db, COLLECTION_NAME),
      where('nextChangeDate', '>=', today),
      where('nextChangeDate', '<=', nextMonth),
      orderBy('nextChangeDate', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const upcomingMaintenance = [];

    querySnapshot.forEach((doc) => {
      upcomingMaintenance.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return upcomingMaintenance;

  } catch (error) {
    console.error('❌ Error al obtener próximos mantenimientos:', error);
    throw new Error(`Error al obtener próximos mantenimientos: ${error.message}`);
  }
};

/**
 * Obtener estadísticas de mantenimiento
 */
export const getMaintenanceStats = async (filters = {}) => {
  try {
    const maintenanceRecords = await getAllMaintenanceRecords(filters);
    
    const stats = {
      total: maintenanceRecords.length,
      byType: {},
      byStatus: {},
      byVehicle: {},
      totalCost: 0,
      averageCost: 0,
      upcomingCount: 0,
      overdueCount: 0
    };

    let totalCost = 0;

    maintenanceRecords.forEach(record => {
      stats.byType[record.type] = (stats.byType[record.type] || 0) + 1;
      stats.byStatus[record.status] = (stats.byStatus[record.status] || 0) + 1;
      stats.byVehicle[record.vehicleId] = (stats.byVehicle[record.vehicleId] || 0) + 1;
      
      if (record.cost) {
        totalCost += parseFloat(record.cost);
      }

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

    return stats;

  } catch (error) {
    console.error('❌ Error al obtener estadísticas de mantenimiento:', error);
    throw new Error(`Error al obtener estadísticas de mantenimiento: ${error.message}`);
  }
};

/**
 * Suscribirse a cambios en mantenimientos en tiempo real
 */
export const subscribeToMaintenance = (callback, filters = {}) => {
  try {
    let q = collection(db, COLLECTION_NAME);

    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.vehicleId) {
      q = query(q, where('vehicleId', '==', filters.vehicleId));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    q = query(q, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const maintenanceRecords = [];
      
      querySnapshot.forEach((doc) => {
        maintenanceRecords.push({
          id: doc.id,
          ...doc.data()
        });
      });

      callback(maintenanceRecords, null);
    }, (error) => {
      console.error('❌ Error en suscripción de mantenimientos:', error);
      callback([], error);
    });

    return unsubscribe;

  } catch (error) {
    console.error('❌ Error al suscribirse a mantenimientos:', error);
    callback([], error);
    return () => {};
  }
};

/**
 * Obtener vehículos disponibles para mantenimiento
 */
export const getVehiclesForMaintenance = async () => {
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
        ...doc.data()
      });
    });

    return vehicles;

  } catch (error) {
    console.error('❌ Error al obtener vehículos para mantenimiento:', error);
    throw new Error(`Error al obtener vehículos para mantenimiento: ${error.message}`);
  }
};

/**
 * Calcular próximo cambio de aceite basado en horómetro actual
 */
export const calculateNextOilChange = (currentHours) => {
  return parseInt(currentHours) + MAINTENANCE_CONSTANTS.OIL_CHANGE_HOURS;
};

/**
 * Calcular próxima fecha de cambio de batería
 */
export const calculateNextBatteryChange = (lastChangeDate) => {
  const date = new Date(lastChangeDate);
  date.setMonth(date.getMonth() + MAINTENANCE_CONSTANTS.BATTERY_LIFETIME_MONTHS);
  return date;
};

/**
 * Actualizar horómetro del vehículo (para tractores)
 */
const updateVehicleHourMeter = async (vehicleId, newHours) => {
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
            updatedAt: serverTimestamp()
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
 * Validar datos de mantenimiento
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
 * Validar datos de actualización de mantenimiento
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

export default {
  createMaintenanceRecord,
  getAllMaintenanceRecords,
  getMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  getMaintenanceByVehicle,
  getUpcomingMaintenance,
  getMaintenanceStats,
  subscribeToMaintenance,
  getVehiclesForMaintenance,
  calculateNextOilChange,
  calculateNextBatteryChange,
  MAINTENANCE_TYPES,
  MAINTENANCE_STATUS,
  BATTERY_STATUS,
  MAINTENANCE_CONSTANTS
};
