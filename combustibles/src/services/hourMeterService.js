/**
 * ⚠️ DEPRECATED - HourMeterService Legacy
 * 
 * Este servicio está DEPRECADO desde la refactorización del 30/09/2025.
 * 
 * ✅ USAR EN SU LUGAR:
 * - FirebaseHourMeterService (src/services/FirebaseHourMeterService.js)
 * - useHourMeter hook (src/hooks/useHourMeter.js)
 * 
 * Este archivo se mantiene solo para:
 * - Referencia temporal durante migración
 * - Rollback de emergencia
 * - Comparación de lógica legacy
 * 
 * ❌ NO IMPORTAR este servicio en nuevos componentes.
 * ❌ NO agregar nuevas funcionalidades aquí.
 * 
 * Ver: MIGRACION_SERVICIOS_LEGACY.md
 * 
 * ---
 * 
 * HourMeterService - Servicio para gestión de horómetros de vehículos
 * Maneja lecturas, validaciones, historial y métricas de horómetros
 */

import { doc, getDoc, updateDoc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getVehicle } from './vehiclesService';

const COLLECTION_NAME = 'combustibles_vehicles';

/**
 * Generar ID único para registros de historial
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Registrar nueva lectura de horómetro
 * @param {string} vehicleId - ID del vehículo
 * @param {number} newReading - Nueva lectura del horómetro
 * @param {string} movementId - ID del movimiento asociado (opcional)
 * @param {string} userId - Usuario que registra la lectura
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const recordHourMeterReading = async (vehicleId, newReading, movementId = null, userId) => {
  try {
    return await runTransaction(db, async (transaction) => {
      const vehicleRef = doc(db, COLLECTION_NAME, vehicleId);
      const vehicleSnap = await transaction.get(vehicleRef);

      if (!vehicleSnap.exists()) {
        throw new Error('Vehículo no encontrado');
      }

      const vehicleData = vehicleSnap.data();

      if (!vehicleData.hasHourMeter) {
        throw new Error('El vehículo no tiene horómetro configurado');
      }

      // Obtener lectura actual
      const currentReading = vehicleData.currentHourMeter || vehicleData.initialHourMeter || 0;

      // 🔒 VALIDACIONES CRÍTICAS
      if (newReading < currentReading) {
        throw new Error(
          `Nueva lectura (${newReading}) no puede ser menor que la actual (${currentReading})`
        );
      }

      const hoursWorked = newReading - currentReading;

      if (hoursWorked > 24) {
        throw new Error(
          `Incremento muy alto (${hoursWorked} horas). Máximo permitido: 24 horas por movimiento`
        );
      }

      const totalHoursWorked = (vehicleData.totalHoursWorked || 0) + hoursWorked;

      // 📝 CREAR REGISTRO EN HISTORIAL
      const historyEntry = {
        id: generateId(),
        reading: newReading,
        date: new Date(),
        movementId,
        previousReading: currentReading,
        hoursWorked,
        recordedBy: userId,
        timestamp: serverTimestamp(),
      };

      const updatedHistory = [...(vehicleData.hourMeterHistory || []), historyEntry];

      // 📊 CALCULAR MÉTRICAS ACTUALIZADAS
      const averageHoursPerDay = calculateAverageHoursPerDay(vehicleData, totalHoursWorked);
      const fuelConsumptionPerHour = calculateFuelConsumptionPerHour(vehicleData, totalHoursWorked);

      // 🔄 ACTUALIZAR VEHÍCULO
      transaction.update(vehicleRef, {
        currentHourMeter: newReading,
        totalHoursWorked,
        lastHourMeterUpdate: serverTimestamp(),
        hourMeterHistory: updatedHistory,
        averageHoursPerDay,
        fuelConsumptionPerHour,
        updatedAt: serverTimestamp(),
      });

      return {
        success: true,
        hoursWorked,
        totalHoursWorked,
        newReading,
        previousReading: currentReading,
        averageHoursPerDay,
        fuelConsumptionPerHour,
      };
    });
  } catch (error) {
    console.error('❌ Error al registrar lectura de horómetro:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Validar lectura de horómetro antes de movimiento
 * @param {string} vehicleId - ID del vehículo
 * @param {number} requiredReading - Lectura requerida
 * @returns {Promise<Object>} - Resultado de la validación
 */
export const validateHourMeterForMovement = async (vehicleId, requiredReading) => {
  try {
    const vehicle = await getVehicle(vehicleId);

    if (!vehicle) {
      return { valid: false, message: 'Vehículo no encontrado' };
    }

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
    console.error('❌ Error al validar horómetro:', error);
    return { valid: false, message: error.message };
  }
};

/**
 * Obtener historial de horómetro de un vehículo
 * @param {string} vehicleId - ID del vehículo
 * @param {number} limit - Límite de registros (default: 50)
 * @returns {Promise<Array>} - Historial de lecturas
 */
export const getHourMeterHistory = async (vehicleId, limit = 50) => {
  try {
    const vehicle = await getVehicle(vehicleId);

    if (!vehicle?.hourMeterHistory) {
      return [];
    }

    return vehicle.hourMeterHistory
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit)
      .map((entry) => ({
        ...entry,
        date: entry.date instanceof Date ? entry.date : new Date(entry.date),
        formattedDate:
          entry.date instanceof Date
            ? entry.date.toLocaleDateString('es-CO')
            : new Date(entry.date).toLocaleDateString('es-CO'),
      }));
  } catch (error) {
    console.error('❌ Error al obtener historial de horómetro:', error);
    return [];
  }
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
  return Number((totalFuelConsumed / totalHoursWorked).toFixed(3));
};

/**
 * Calcular promedio de horas por día
 * @param {Object} vehicleData - Datos del vehículo
 * @param {number} totalHoursWorked - Total de horas trabajadas
 * @returns {number} - Promedio de horas por día
 */
const calculateAverageHoursPerDay = (vehicleData, totalHoursWorked) => {
  if (!vehicleData.createdAt || !totalHoursWorked || totalHoursWorked === 0) return 0;

  const createdDate =
    vehicleData.createdAt instanceof Date ? vehicleData.createdAt : vehicleData.createdAt.toDate();

  const daysActive = Math.max(1, (new Date() - createdDate) / (1000 * 60 * 60 * 24));
  return Number((totalHoursWorked / daysActive).toFixed(2));
};

/**
 * Inicializar horómetro para vehículo existente
 * @param {string} vehicleId - ID del vehículo
 * @param {number} initialReading - Lectura inicial
 * @param {string} userId - Usuario que inicializa
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const initializeHourMeter = async (vehicleId, initialReading, userId) => {
  try {
    const vehicleRef = doc(db, COLLECTION_NAME, vehicleId);
    const vehicle = await getDoc(vehicleRef);

    if (!vehicle.exists()) {
      throw new Error('Vehículo no encontrado');
    }

    const vehicleData = vehicle.data();

    if (vehicleData.initialHourMeter !== undefined) {
      throw new Error('El horómetro ya ha sido inicializado');
    }

    const historyEntry = {
      id: generateId(),
      reading: initialReading,
      date: new Date(),
      movementId: null,
      previousReading: null,
      hoursWorked: 0,
      recordedBy: userId,
      note: 'Lectura inicial al configurar horómetro',
      timestamp: serverTimestamp(),
    };

    await updateDoc(vehicleRef, {
      hasHourMeter: true,
      initialHourMeter: initialReading,
      currentHourMeter: initialReading,
      totalHoursWorked: 0,
      hourMeterHistory: [historyEntry],
      averageHoursPerDay: 0,
      fuelConsumptionPerHour: 0,
      lastHourMeterUpdate: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      message: `Horómetro inicializado en ${initialReading} horas`,
      initialReading,
    };
  } catch (error) {
    console.error('❌ Error al inicializar horómetro:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Obtener resumen de eficiencia de horómetro
 * @param {string} vehicleId - ID del vehículo
 * @returns {Promise<Object>} - Resumen de eficiencia
 */
export const getHourMeterSummary = async (vehicleId) => {
  try {
    const vehicle = await getVehicle(vehicleId);

    if (!vehicle?.hasHourMeter) {
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
      efficiency: Number((efficiency * 100).toFixed(1)),
      efficiencyRating: getEfficiencyRating(efficiency),
      lastUpdate: vehicle.lastHourMeterUpdate,
      historyCount: vehicle.hourMeterHistory?.length || 0,
    };
  } catch (error) {
    console.error('❌ Error al obtener resumen de horómetro:', error);
    return {
      hasHourMeter: false,
      error: error.message,
    };
  }
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

// Exportar funciones de utilidad
export { calculateFuelConsumptionPerHour, calculateAverageHoursPerDay, getEfficiencyRating };
