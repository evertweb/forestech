/**
 * VehiclesService - Servicio para gestión de vehículos y maquinaria forestal
 * Maneja catálogo, consumo, rendimiento y mantenimientos
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
  limit,
  onSnapshot,
  serverTimestamp,
  runTransaction
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { getPredefinedVehicles } from '../data/predefinedVehicles';

const COLLECTION_NAME = 'combustibles_vehicles';
const MOVEMENTS_COLLECTION = 'combustibles_movements';

// Tipos de vehículos forestales
export const VEHICLE_TYPES = {
  EXCAVADORA: 'excavadora',
  BULLDOZER: 'bulldozer',
  CARGADOR: 'cargador',
  CAMION: 'camion',
  GRUA: 'grua',
  MOTOSIERRA: 'motosierra',
  TRACTOR: 'tractor',
  VOLQUETA: 'volqueta',
  OTROS: 'otros'
};

// Estados de vehículos
export const VEHICLE_STATUS = {
  ACTIVO: 'activo',
  MANTENIMIENTO: 'mantenimiento', 
  INACTIVO: 'inactivo',
  REPARACION: 'reparacion'
};

// Tipos de combustible compatibles
export const FUEL_COMPATIBILITY = {
  DIESEL: 'Diesel',
  GASOLINA: 'Gasolina',
  ACPM: 'ACPM',
  MIXTO: 'Mixto' // Para equipos que usan múltiples combustibles
};

/**
 * Crear un nuevo vehículo
 * @param {Object} vehicleData - Datos del vehículo
 * @returns {Promise<string>} - ID del vehículo creado
 */
export const createVehicle = async (vehicleData) => {
  try {
    // Validar datos requeridos
    validateVehicleData(vehicleData);

    // Verificar que el ID no esté duplicado
    const existingVehicle = await getVehicleByCode(vehicleData.vehicleId);
    if (existingVehicle) {
      throw new Error(`El código de vehículo '${vehicleData.vehicleId}' ya existe`);
    }

    // Preparar datos del vehículo
    const vehicle = {
      ...vehicleData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: vehicleData.status || VEHICLE_STATUS.ACTIVO,
      // Inicializar métricas
      totalFuelConsumed: 0,
      totalHoursWorked: 0,
      totalMovements: 0,
      lastMovementDate: null,
      // Calcular consumo estimado por hora
      estimatedConsumptionPerHour: calculateEstimatedConsumption(vehicleData)
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), vehicle);
    
    console.log('✅ Vehículo creado exitosamente:', docRef.id);
    return docRef.id;

  } catch (error) {
    console.error('❌ Error al crear vehículo:', error);
    throw new Error(`Error al crear vehículo: ${error.message}`);
  }
};

/**
 * Obtener todos los vehículos con filtros opcionales
 * @param {Object} filters - Filtros de búsqueda
 * @returns {Promise<Array>} - Lista de vehículos
 */
export const getAllVehicles = async (filters = {}) => {
  try {
    let q = collection(db, COLLECTION_NAME);

    // Aplicar filtros
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.fuelType) {
      q = query(q, where('fuelType', '==', filters.fuelType));
    }
    if (filters.location) {
      q = query(q, where('currentLocation', '==', filters.location));
    }

    // Ordenar por nombre
    q = query(q, orderBy('vehicleId', 'asc'));

    const querySnapshot = await getDocs(q);
    const vehicles = [];

    querySnapshot.forEach((doc) => {
      vehicles.push({
        id: doc.id,
        ...doc.data(),
        // Convertir timestamps
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
        lastMovementDate: doc.data().lastMovementDate?.toDate?.() || doc.data().lastMovementDate,
        lastMaintenanceDate: doc.data().lastMaintenanceDate?.toDate?.() || doc.data().lastMaintenanceDate
      });
    });

    return vehicles;

  } catch (error) {
    console.error('❌ Error al obtener vehículos:', error);
    throw new Error(`Error al obtener vehículos: ${error.message}`);
  }
};

/**
 * Obtener un vehículo específico por ID
 * @param {string} vehicleId - ID del vehículo
 * @returns {Promise<Object|null>} - Datos del vehículo
 */
export const getVehicle = async (vehicleId) => {
  try {
    if (!vehicleId) {
      throw new Error('ID de vehículo requerido');
    }

    const docRef = doc(db, COLLECTION_NAME, vehicleId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.() || docSnap.data().createdAt,
      updatedAt: docSnap.data().updatedAt?.toDate?.() || docSnap.data().updatedAt,
      lastMovementDate: docSnap.data().lastMovementDate?.toDate?.() || docSnap.data().lastMovementDate,
      lastMaintenanceDate: docSnap.data().lastMaintenanceDate?.toDate?.() || docSnap.data().lastMaintenanceDate
    };

  } catch (error) {
    console.error('❌ Error al obtener vehículo:', error);
    throw new Error(`Error al obtener vehículo: ${error.message}`);
  }
};

/**
 * Obtener vehículo por código/ID único
 * @param {string} vehicleCode - Código único del vehículo
 * @returns {Promise<Object|null>} - Datos del vehículo
 */
export const getVehicleByCode = async (vehicleCode) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('vehicleId', '==', vehicleCode)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      lastMovementDate: doc.data().lastMovementDate?.toDate?.() || doc.data().lastMovementDate,
      lastMaintenanceDate: doc.data().lastMaintenanceDate?.toDate?.() || doc.data().lastMaintenanceDate
    };

  } catch (error) {
    console.error('❌ Error al buscar vehículo por código:', error);
    throw new Error(`Error al buscar vehículo: ${error.message}`);
  }
};

/**
 * Actualizar un vehículo existente
 * @param {string} vehicleId - ID del vehículo
 * @param {Object} updateData - Datos a actualizar
 * @returns {Promise<void>}
 */
export const updateVehicle = async (vehicleId, updateData) => {
  try {
    if (!vehicleId) {
      throw new Error('ID de vehículo requerido');
    }

    // Si se está cambiando el vehicleId, verificar que no esté duplicado
    if (updateData.vehicleId) {
      const existingVehicle = await getVehicleByCode(updateData.vehicleId);
      if (existingVehicle && existingVehicle.id !== vehicleId) {
        throw new Error(`El código de vehículo '${updateData.vehicleId}' ya existe`);
      }
    }

    // Preparar datos de actualización
    const updatedData = {
      ...updateData,
      updatedAt: serverTimestamp(),
      // Recalcular consumo estimado si cambian especificaciones
      ...(updateData.enginePower || updateData.type ? {
        estimatedConsumptionPerHour: calculateEstimatedConsumption(updateData)
      } : {})
    };

    const docRef = doc(db, COLLECTION_NAME, vehicleId);
    await updateDoc(docRef, updatedData);

    console.log('✅ Vehículo actualizado exitosamente');

  } catch (error) {
    console.error('❌ Error al actualizar vehículo:', error);
    throw new Error(`Error al actualizar vehículo: ${error.message}`);
  }
};

/**
 * Eliminar un vehículo
 * @param {string} vehicleId - ID del vehículo
 * @returns {Promise<void>}
 */
export const deleteVehicle = async (vehicleId) => {
  try {
    if (!vehicleId) {
      throw new Error('ID de vehículo requerido');
    }

    // Verificar que no tenga movimientos asociados recientes
    const recentMovements = await getVehicleMovements(vehicleId, { limit: 1 });
    if (recentMovements.length > 0) {
      throw new Error('No se puede eliminar un vehículo con movimientos asociados. Cambie el estado a inactivo en su lugar.');
    }

    await deleteDoc(doc(db, COLLECTION_NAME, vehicleId));
    console.log('✅ Vehículo eliminado exitosamente');

  } catch (error) {
    console.error('❌ Error al eliminar vehículo:', error);
    throw new Error(`Error al eliminar vehículo: ${error.message}`);
  }
};

/**
 * Suscribirse a cambios en tiempo real de vehículos
 * @param {Function} callback - Función a ejecutar cuando hay cambios
 * @param {Object} filters - Filtros opcionales
 * @returns {Function} - Función para cancelar la suscripción
 */
export const subscribeToVehicles = (callback, filters = {}) => {
  try {
    let q = collection(db, COLLECTION_NAME);

    // Aplicar filtros
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }

    // Ordenar por vehicleId
    q = query(q, orderBy('vehicleId', 'asc'));

    return onSnapshot(q, (querySnapshot) => {
      const vehicles = [];
      querySnapshot.forEach((doc) => {
        vehicles.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
          updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
          lastMovementDate: doc.data().lastMovementDate?.toDate?.() || doc.data().lastMovementDate,
          lastMaintenanceDate: doc.data().lastMaintenanceDate?.toDate?.() || doc.data().lastMaintenanceDate
        });
      });
      callback(vehicles);
    }, (error) => {
      console.error('❌ Error en suscripción de vehículos:', error);
      callback([], error);
    });

  } catch (error) {
    console.error('❌ Error al configurar suscripción:', error);
    throw new Error(`Error en suscripción: ${error.message}`);
  }
};

/**
 * Obtener movimientos de un vehículo específico
 * @param {string} vehicleCode - Código del vehículo
 * @param {Object} options - Opciones de consulta
 * @returns {Promise<Array>} - Lista de movimientos
 */
export const getVehicleMovements = async (vehicleCode, options = {}) => {
  try {
    let q = query(
      collection(db, MOVEMENTS_COLLECTION),
      where('vehicleId', '==', vehicleCode)
    );

    // Ordenar por fecha (más recientes primero)
    q = query(q, orderBy('createdAt', 'desc'));

    // Limitar resultados si se especifica
    if (options.limit) {
      q = query(q, limit(options.limit));
    }

    const querySnapshot = await getDocs(q);
    const movements = [];

    querySnapshot.forEach((doc) => {
      movements.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
      });
    });

    return movements;

  } catch (error) {
    console.error('❌ Error al obtener movimientos del vehículo:', error);
    throw new Error(`Error al obtener movimientos: ${error.message}`);
  }
};

/**
 * Actualizar métricas de consumo de un vehículo
 * @param {string} vehicleCode - Código del vehículo  
 * @param {Object} movementData - Datos del movimiento
 * @returns {Promise<void>}
 */
export const updateVehicleMetrics = async (vehicleCode, movementData) => {
  try {
    const vehicle = await getVehicleByCode(vehicleCode);
    if (!vehicle) {
      console.warn(`Vehículo ${vehicleCode} no encontrado para actualizar métricas`);
      return;
    }

    await runTransaction(db, async (transaction) => {
      const vehicleRef = doc(db, COLLECTION_NAME, vehicle.id);
      
      // Calcular nuevas métricas
      const newTotalFuel = (vehicle.totalFuelConsumed || 0) + movementData.quantity;
      const newTotalMovements = (vehicle.totalMovements || 0) + 1;
      
      // Actualizar métricas
      transaction.update(vehicleRef, {
        totalFuelConsumed: newTotalFuel,
        totalMovements: newTotalMovements,
        lastMovementDate: serverTimestamp(),
        // Calcular eficiencia real si hay horas trabajadas
        ...(vehicle.totalHoursWorked > 0 ? {
          actualConsumptionPerHour: newTotalFuel / vehicle.totalHoursWorked
        } : {}),
        updatedAt: serverTimestamp()
      });
    });

    console.log(`✅ Métricas del vehículo ${vehicleCode} actualizadas`);

  } catch (error) {
    console.error('❌ Error al actualizar métricas del vehículo:', error);
    // No lanzar error para no afectar el flujo principal
  }
};

/**
 * Actualizar horómetro de un vehículo (para tractores TR1, TR2, TR3)
 * @param {string} vehicleCode - Código del vehículo
 * @param {number} newHours - Nueva lectura del horómetro
 * @param {string} notes - Notas adicionales
 * @returns {Promise<void>}
 */
export const updateHourMeter = async (vehicleCode, newHours, notes = '') => {
  try {
    const vehicle = await getVehicleByCode(vehicleCode);
    if (!vehicle) {
      throw new Error(`Vehículo ${vehicleCode} no encontrado`);
    }

    if (!vehicle.hasHourMeter) {
      throw new Error(`El vehículo ${vehicleCode} no tiene sistema de horómetro`);
    }

    const currentHours = vehicle.currentHours || 0;
    if (newHours < currentHours) {
      throw new Error(`La nueva lectura (${newHours}h) no puede ser menor a la actual (${currentHours}h)`);
    }

    const hoursWorked = newHours - currentHours;

    await runTransaction(db, async (transaction) => {
      const vehicleRef = doc(db, COLLECTION_NAME, vehicle.id);
      
      // Crear registro en el historial de horómetro
      const hourMeterHistory = vehicle.hourMeterHistory || [];
      hourMeterHistory.push({
        previousReading: currentHours,
        newReading: newHours,
        hoursWorked: hoursWorked,
        date: serverTimestamp(),
        notes: notes,
        registeredBy: 'system' // Puede personalizarse con el usuario actual
      });

      // Actualizar vehículo
      transaction.update(vehicleRef, {
        currentHours: newHours,
        lastHourMeterReading: newHours,
        lastHourMeterDate: serverTimestamp(),
        totalHoursWorked: (vehicle.totalHoursWorked || 0) + hoursWorked,
        hourMeterHistory: hourMeterHistory,
        // Recalcular eficiencia si hay combustible consumido
        ...(vehicle.totalFuelConsumed > 0 ? {
          actualConsumptionPerHour: vehicle.totalFuelConsumed / ((vehicle.totalHoursWorked || 0) + hoursWorked)
        } : {}),
        updatedAt: serverTimestamp()
      });
    });

    console.log(`✅ Horómetro del tractor ${vehicleCode} actualizado: ${currentHours}h → ${newHours}h (+${hoursWorked}h)`);

  } catch (error) {
    console.error('❌ Error al actualizar horómetro:', error);
    throw new Error(`Error al actualizar horómetro: ${error.message}`);
  }
};

/**
 * Obtener historial de horómetro de un vehículo
 * @param {string} vehicleCode - Código del vehículo
 * @param {number} limit - Límite de registros (opcional)
 * @returns {Promise<Array>} - Historial del horómetro
 */
export const getHourMeterHistory = async (vehicleCode, limit = 50) => {
  try {
    const vehicle = await getVehicleByCode(vehicleCode);
    if (!vehicle) {
      throw new Error(`Vehículo ${vehicleCode} no encontrado`);
    }

    if (!vehicle.hasHourMeter) {
      return [];
    }

    const history = vehicle.hourMeterHistory || [];
    
    // Ordenar por fecha (más recientes primero) y limitar
    return history
      .sort((a, b) => {
        const dateA = a.date?.toDate?.() || a.date || new Date(0);
        const dateB = b.date?.toDate?.() || b.date || new Date(0);
        return dateB - dateA;
      })
      .slice(0, limit)
      .map(record => ({
        ...record,
        date: record.date?.toDate?.() || record.date
      }));

  } catch (error) {
    console.error('❌ Error al obtener historial de horómetro:', error);
    throw new Error(`Error al obtener historial: ${error.message}`);
  }
};

/**
 * Calcular consumo por hora en tiempo real para tractores
 * @param {string} vehicleCode - Código del tractor
 * @returns {Promise<Object>} - Métricas de consumo por hora
 */
export const calculateTractorConsumption = async (vehicleCode) => {
  try {
    const vehicle = await getVehicleByCode(vehicleCode);
    if (!vehicle) {
      throw new Error(`Vehículo ${vehicleCode} no encontrado`);
    }

    if (!vehicle.hasHourMeter) {
      throw new Error(`El vehículo ${vehicleCode} no tiene sistema de horómetro`);
    }

    const totalFuel = vehicle.totalFuelConsumed || 0;
    const totalHours = vehicle.totalHoursWorked || 0;
    const currentHours = vehicle.currentHours || 0;
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
      projectedNextMaintenance: null
    };

    // Calcular eficiencia vs estimado
    if (estimatedConsumption > 0 && metrics.actualConsumptionPerHour > 0) {
      metrics.efficiencyPercentage = ((estimatedConsumption - metrics.actualConsumptionPerHour) / estimatedConsumption) * 100;
      metrics.fuelSaved = (estimatedConsumption - metrics.actualConsumptionPerHour) * totalHours;
    }

    // Proyectar próximo mantenimiento (cada 250 horas)
    const hoursUntilMaintenance = 250 - (currentHours % 250);
    metrics.projectedNextMaintenance = {
      hoursRemaining: hoursUntilMaintenance,
      projectedHours: currentHours + hoursUntilMaintenance
    };

    return metrics;

  } catch (error) {
    console.error('❌ Error al calcular consumo del tractor:', error);
    throw new Error(`Error al calcular métricas: ${error.message}`);
  }
};

/**
 * Obtener estadísticas de vehículos
 * @param {Object} filters - Filtros de período
 * @returns {Promise<Object>} - Estadísticas calculadas
 */
export const getVehiclesStats = async (filters = {}) => {
  try {
    const vehicles = await getAllVehicles(filters);

    // Calcular estadísticas
    const stats = {
      totalVehicles: vehicles.length,
      byType: {},
      byStatus: {},
      byFuelType: {},
      totalFuelConsumed: 0,
      totalHoursWorked: 0,
      averageConsumption: 0,
      mostActiveVehicle: null,
      leastActiveVehicle: null
    };

    let maxMovements = 0;
    let minMovements = Infinity;

    vehicles.forEach(vehicle => {
      // Por tipo
      stats.byType[vehicle.type] = (stats.byType[vehicle.type] || 0) + 1;
      
      // Por estado
      stats.byStatus[vehicle.status] = (stats.byStatus[vehicle.status] || 0) + 1;
      
      // Por tipo de combustible
      stats.byFuelType[vehicle.fuelType] = (stats.byFuelType[vehicle.fuelType] || 0) + 1;
      
      // Totales
      stats.totalFuelConsumed += vehicle.totalFuelConsumed || 0;
      stats.totalHoursWorked += vehicle.totalHoursWorked || 0;

      // Vehículo más/menos activo
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

    // Calcular consumo promedio
    if (stats.totalHoursWorked > 0) {
      stats.averageConsumption = stats.totalFuelConsumed / stats.totalHoursWorked;
    }

    return stats;

  } catch (error) {
    console.error('❌ Error al calcular estadísticas:', error);
    throw new Error(`Error al calcular estadísticas: ${error.message}`);
  }
};

/**
 * Registrar mantenimiento de vehículo
 * @param {string} vehicleId - ID del vehículo
 * @param {Object} maintenanceData - Datos del mantenimiento
 * @returns {Promise<void>}
 */
export const registerMaintenance = async (vehicleId, maintenanceData) => {
  try {
    const vehicle = await getVehicle(vehicleId);
    if (!vehicle) {
      throw new Error('Vehículo no encontrado');
    }

    // Agregar mantenimiento al historial
    const maintenanceHistory = vehicle.maintenanceHistory || [];
    maintenanceHistory.push({
      ...maintenanceData,
      date: serverTimestamp(),
      registeredAt: serverTimestamp()
    });

    // Actualizar vehículo
    await updateVehicle(vehicleId, {
      maintenanceHistory,
      lastMaintenanceDate: serverTimestamp(),
      // Cambiar estado si es mantenimiento mayor
      ...(maintenanceData.type === 'major' ? {
        status: VEHICLE_STATUS.MANTENIMIENTO
      } : {})
    });

    console.log('✅ Mantenimiento registrado exitosamente');

  } catch (error) {
    console.error('❌ Error al registrar mantenimiento:', error);
    throw new Error(`Error al registrar mantenimiento: ${error.message}`);
  }
};

// ============ FUNCIONES AUXILIARES ============

/**
 * Validar datos de vehículo
 * @param {Object} vehicleData - Datos a validar
 */
const validateVehicleData = (vehicleData) => {
  const required = ['vehicleId', 'name', 'type', 'fuelType'];
  
  for (const field of required) {
    if (!vehicleData[field]) {
      throw new Error(`Campo requerido: ${field}`);
    }
  }

  // Validar tipo de vehículo (permitir tipos personalizados)
  if (!vehicleData.type || vehicleData.type.trim().length === 0) {
    throw new Error('Tipo de vehículo requerido');
  }

  // Validar tipo de combustible
  if (!Object.values(FUEL_COMPATIBILITY).includes(vehicleData.fuelType)) {
    throw new Error('Tipo de combustible inválido');
  }

  // Validar estado si se proporciona
  if (vehicleData.status && !Object.values(VEHICLE_STATUS).includes(vehicleData.status)) {
    throw new Error('Estado de vehículo inválido');
  }

  // Validar campos numéricos
  if (vehicleData.enginePower && (vehicleData.enginePower <= 0)) {
    throw new Error('La potencia del motor debe ser mayor a cero');
  }

  if (vehicleData.fuelCapacity && (vehicleData.fuelCapacity <= 0)) {
    throw new Error('La capacidad de combustible debe ser mayor a cero');
  }
};

/**
 * Calcular consumo estimado por hora basado en especificaciones
 * @param {Object} vehicleData - Datos del vehículo
 * @returns {number} - Consumo estimado en galones/hora
 */
const calculateEstimatedConsumption = (vehicleData) => {
  const { type, enginePower, fuelType } = vehicleData;

  // Factores base por tipo de vehículo (galones/hora por HP)
  const consumptionFactors = {
    [VEHICLE_TYPES.EXCAVADORA]: 0.04,
    [VEHICLE_TYPES.BULLDOZER]: 0.05,
    [VEHICLE_TYPES.CARGADOR]: 0.035,
    [VEHICLE_TYPES.CAMION]: 0.03,
    [VEHICLE_TYPES.GRUA]: 0.045,
    [VEHICLE_TYPES.MOTOSIERRA]: 0.02,
    [VEHICLE_TYPES.TRACTOR]: 0.025,
    [VEHICLE_TYPES.VOLQUETA]: 0.035,
    [VEHICLE_TYPES.OTROS]: 0.03
  };

  // Factores de ajuste por tipo de combustible
  const fuelFactors = {
    [FUEL_COMPATIBILITY.DIESEL]: 1.0,
    [FUEL_COMPATIBILITY.GASOLINA]: 1.2,
    [FUEL_COMPATIBILITY.ACPM]: 0.95,
    [FUEL_COMPATIBILITY.MIXTO]: 1.1
  };

  const baseFactor = consumptionFactors[type] || 0.03;
  const fuelFactor = fuelFactors[fuelType] || 1.0;
  const power = enginePower || 100; // HP por defecto

  return (baseFactor * power * fuelFactor);
};

/**
 * Inicializar vehículos predefinidos en Firebase (FUNCIÓN MANUAL)
 * Esta función debe ejecutarse manualmente cuando sea necesario
 * @returns {Promise<Object>} - Resultado de la inicialización
 */
export const initializePredefinedVehicles = async () => {
  try {
    console.log('🚀 Iniciando verificación de vehículos predefinidos...');
    
    // Obtener vehículos predefinidos
    const predefinedVehicles = getPredefinedVehicles();
    console.log(`📋 ${predefinedVehicles.length} vehículos predefinidos encontrados`);
    
    // Obtener todos los vehículos existentes
    const existingVehicles = await getAllVehicles();
    const existingIds = existingVehicles.map(v => v.vehicleId);
    
    console.log(`📊 ${existingVehicles.length} vehículos existentes en Firebase`);
    
    // Filtrar vehículos que no existen (verificación por vehicleId único)
    const vehiclesToCreate = predefinedVehicles.filter(
      vehicle => !existingIds.includes(vehicle.vehicleId)
    );
    
    console.log(`🆕 ${vehiclesToCreate.length} vehículos nuevos para crear`);
    
    if (vehiclesToCreate.length === 0) {
      console.log('✅ Todos los vehículos predefinidos ya están en Firebase');
      return {
        success: true,
        created: 0,
        errors: 0,
        existing: existingVehicles.length,
        message: 'Todos los vehículos predefinidos ya existen'
      };
    }
    
    let created = 0;
    let errors = 0;
    const errorDetails = [];
    
    // Crear solo los vehículos que no existen
    for (const vehicleData of vehiclesToCreate) {
      try {
        // Verificación adicional por si hay concurrencia
        const existingVehicle = await getVehicleByCode(vehicleData.vehicleId);
        if (existingVehicle) {
          console.log(`⚠️ Vehículo ${vehicleData.vehicleId} ya existe (verificación concurrente)`);
          continue;
        }
        
        // Preparar datos del vehículo
        const vehicle = {
          ...vehicleData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          // Inicializar métricas
          totalFuelConsumed: 0,
          totalHoursWorked: vehicleData.hasHourMeter ? vehicleData.currentHours : 0,
          totalMovements: 0,
          lastMovementDate: null
        };
        
        await addDoc(collection(db, COLLECTION_NAME), vehicle);
        created++;
        console.log(`✅ Creado: ${vehicleData.vehicleId} - ${vehicleData.name}`);
        
        // Pequeña pausa para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (error) {
        errors++;
        const errorMsg = error.message;
        errorDetails.push({ vehicleId: vehicleData.vehicleId, error: errorMsg });
        console.error(`❌ Error creando ${vehicleData.vehicleId}:`, errorMsg);
      }
    }
    
    console.log(`🎉 Inicialización completada:`);
    console.log(`   ✅ Creados: ${created}`);
    console.log(`   ❌ Errores: ${errors}`);
    console.log(`   📊 Total en Firebase: ${existingVehicles.length + created}`);
    
    if (errors > 0) {
      console.log('🔍 Detalles de errores:');
      errorDetails.forEach(detail => {
        console.log(`   • ${detail.vehicleId}: ${detail.error}`);
      });
    }
    
    return {
      success: errors === 0,
      created,
      errors,
      errorDetails,
      existing: existingVehicles.length,
      total: existingVehicles.length + created,
      predefinedTotal: predefinedVehicles.length,
      message: `Proceso completado: ${created} creados, ${errors} errores`
    };
    
  } catch (error) {
    console.error('❌ Error crítico en inicialización de vehículos:', error);
    return { 
      success: false, 
      created: 0,
      errors: 1,
      error: error.message,
      message: `Error crítico: ${error.message}`
    };
  }
};

export default {
  createVehicle,
  getAllVehicles,
  getVehicle,
  getVehicleByCode,
  updateVehicle,
  deleteVehicle,
  subscribeToVehicles,
  getVehicleMovements,
  updateVehicleMetrics,
  updateHourMeter,
  getHourMeterHistory,
  calculateTractorConsumption,
  getVehiclesStats,
  registerMaintenance,
  initializePredefinedVehicles,
  VEHICLE_TYPES,
  VEHICLE_STATUS,
  FUEL_COMPATIBILITY
};