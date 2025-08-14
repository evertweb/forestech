/**
 * Migración para asignar iconos por defecto a vehículos existentes
 * Esta función se puede ejecutar una vez para actualizar vehículos sin iconId
 */

import { getAllVehicles, updateVehicle } from '../services/vehiclesService';
import { DEFAULT_VEHICLE_ICON, VEHICLE_ICONS } from '../constants/vehicleIcons';

// Mapeo de tipos de vehículos a iconos apropiados
const TYPE_TO_ICON_MAPPING = {
  tractor: VEHICLE_ICONS.TRACTOR_GREEN.id,
  excavadora: VEHICLE_ICONS.EXCAVATOR_YELLOW.id,
  bulldozer: VEHICLE_ICONS.BULLDOZER.id,
  cargador: VEHICLE_ICONS.LOADER.id,
  camion: VEHICLE_ICONS.TRUCK_GREEN.id,
  camioneta: VEHICLE_ICONS.PICKUP_TRUCK.id,
  grua: VEHICLE_ICONS.CRANE.id,
  motosierra: VEHICLE_ICONS.CHAINSAW.id,
  volqueta: VEHICLE_ICONS.DUMP_TRUCK.id,
  motobomba: VEHICLE_ICONS.PUMP.id,
  fumigadora: VEHICLE_ICONS.SPRAYER.id,
  guadaña: VEHICLE_ICONS.MOWER.id,
  motocicleta: VEHICLE_ICONS.MOTORCYCLE.id,
  cuatrimoto: VEHICLE_ICONS.ATV.id,
  'planta electrica': VEHICLE_ICONS.GENERATOR.id,
  auto: VEHICLE_ICONS.CAR_RED.id,
  suv: VEHICLE_ICONS.SUV.id,
};

/**
 * Asignar icono apropiado basado en el tipo de vehículo
 * @param {string} vehicleType - Tipo del vehículo
 * @returns {string} - ID del icono apropiado
 */
export const getAppropriateIcon = (vehicleType) => {
  if (!vehicleType) return DEFAULT_VEHICLE_ICON.id;

  const type = vehicleType.toLowerCase().trim();

  // Buscar coincidencia exacta primero
  if (TYPE_TO_ICON_MAPPING[type]) {
    return TYPE_TO_ICON_MAPPING[type];
  }

  // Buscar coincidencias parciales
  for (const [typeKey, iconId] of Object.entries(TYPE_TO_ICON_MAPPING)) {
    if (type.includes(typeKey) || typeKey.includes(type)) {
      return iconId;
    }
  }

  // Por defecto, usar icono de auto rojo
  return DEFAULT_VEHICLE_ICON.id;
};

/**
 * Migrar vehículos existentes para asignar iconos apropiados
 * Solo actualiza vehículos que no tienen iconId definido
 * @returns {Promise<Object>} - Resultado de la migración
 */
export const migrateVehicleIcons = async () => {
  try {
    console.log('🔄 Iniciando migración de iconos de vehículos...');

    // Obtener todos los vehículos
    const vehicles = await getAllVehicles();

    // Filtrar vehículos que no tienen iconId
    const vehiclesToMigrate = vehicles.filter((vehicle) => !vehicle.iconId);

    if (vehiclesToMigrate.length === 0) {
      console.log('✅ No hay vehículos que requieran migración de iconos');
      return {
        success: true,
        message: 'No hay vehículos que requieran migración',
        updated: 0,
        total: vehicles.length,
      };
    }

    console.log(
      `📋 Encontrados ${vehiclesToMigrate.length} vehículos sin icono de ${vehicles.length} totales`
    );

    let successful = 0;
    let failed = 0;
    const errors = [];

    // Procesar cada vehículo
    for (const vehicle of vehiclesToMigrate) {
      try {
        const appropriateIcon = getAppropriateIcon(vehicle.type);

        const result = await updateVehicle(vehicle.id, {
          iconId: appropriateIcon,
        });

        if (result.success) {
          successful++;
          console.log(`✅ ${vehicle.vehicleId} (${vehicle.type}) → ${appropriateIcon}`);
        } else {
          failed++;
          errors.push({
            vehicleId: vehicle.vehicleId,
            error: result.error,
          });
          console.error(`❌ Error en ${vehicle.vehicleId}: ${result.error}`);
        }
      } catch (error) {
        failed++;
        errors.push({
          vehicleId: vehicle.vehicleId,
          error: error.message,
        });
        console.error(`❌ Error en ${vehicle.vehicleId}:`, error);
      }
    }

    const result = {
      success: failed === 0,
      message: `Migración completada: ${successful} exitosos, ${failed} fallidos`,
      updated: successful,
      failed: failed,
      total: vehiclesToMigrate.length,
      errors: errors,
    };

    console.log('📊 Resultado de migración:', result);
    return result;
  } catch (error) {
    console.error('❌ Error en migración de iconos:', error);
    return {
      success: false,
      message: `Error en migración: ${error.message}`,
      error: error.message,
    };
  }
};

/**
 * Verificar si es necesario ejecutar la migración
 * @returns {Promise<boolean>} - true si hay vehículos sin iconId
 */
export const needsIconMigration = async () => {
  try {
    const vehicles = await getAllVehicles();
    return vehicles.some((vehicle) => !vehicle.iconId);
  } catch (error) {
    console.error('Error verificando necesidad de migración:', error);
    return false;
  }
};

/**
 * Obtener estadísticas de iconos de vehículos
 * @returns {Promise<Object>} - Estadísticas de iconos
 */
export const getIconStats = async () => {
  try {
    const vehicles = await getAllVehicles();

    const stats = {
      total: vehicles.length,
      withIcon: 0,
      withoutIcon: 0,
      iconDistribution: {},
    };

    vehicles.forEach((vehicle) => {
      if (vehicle.iconId) {
        stats.withIcon++;
        stats.iconDistribution[vehicle.iconId] = (stats.iconDistribution[vehicle.iconId] || 0) + 1;
      } else {
        stats.withoutIcon++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error obteniendo estadísticas de iconos:', error);
    return null;
  }
};

export default {
  migrateVehicleIcons,
  needsIconMigration,
  getIconStats,
  getAppropriateIcon,
};
