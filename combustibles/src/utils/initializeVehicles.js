/**
 * Script para inicializar vehículos predefinidos en Firebase
 * Ejecutar una sola vez para cargar los 23 vehículos de TAREA 3
 */

import { createVehicle, getAllVehicles } from '../services/vehiclesService';
import { getPredefinedVehicles } from '../data/predefinedVehicles';

/**
 * Inicializar vehículos predefinidos en Firebase
 * @returns {Promise<Object>} - Resultado de la inicialización
 */
export const initializePredefinedVehicles = async () => {
  console.log('🚀 Iniciando carga de vehículos predefinidos...');
  
  try {
    // Verificar vehículos existentes
    const existingVehicles = await getAllVehicles();
    const existingIds = existingVehicles.map(v => v.vehicleId);
    
    console.log(`📊 Vehículos existentes: ${existingVehicles.length}`);
    
    // Obtener vehículos predefinidos
    const predefinedVehicles = getPredefinedVehicles();
    
    // Filtrar vehículos que no existen
    const vehiclesToCreate = predefinedVehicles.filter(
      vehicle => !existingIds.includes(vehicle.vehicleId)
    );
    
    console.log(`📦 Vehículos para crear: ${vehiclesToCreate.length}`);
    
    if (vehiclesToCreate.length === 0) {
      console.log('✅ Todos los vehículos predefinidos ya están cargados');
      return {
        success: true,
        message: 'Todos los vehículos ya existen',
        existing: existingVehicles.length,
        created: 0,
        errors: 0
      };
    }
    
    // Crear vehículos uno por uno
    const results = {
      success: true,
      created: 0,
      errors: 0,
      errorDetails: []
    };
    
    console.log('📝 Creando vehículos...');
    
    for (const vehicle of vehiclesToCreate) {
      try {
        await createVehicle(vehicle);
        results.created++;
        console.log(`✅ Creado: ${vehicle.vehicleId} - ${vehicle.name}`);
        
        // Pequeña pausa para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        results.errors++;
        results.errorDetails.push({
          vehicleId: vehicle.vehicleId,
          error: error.message
        });
        console.error(`❌ Error creando ${vehicle.vehicleId}:`, error.message);
      }
    }
    
    // Resumen final
    console.log('\n📊 RESUMEN DE INICIALIZACIÓN:');
    console.log(`✅ Vehículos creados exitosamente: ${results.created}`);
    console.log(`❌ Errores: ${results.errors}`);
    console.log(`📈 Total en base de datos: ${existingVehicles.length + results.created}`);
    
    if (results.errors > 0) {
      console.log('\n🔍 DETALLES DE ERRORES:');
      results.errorDetails.forEach(error => {
        console.log(`   • ${error.vehicleId}: ${error.error}`);
      });
    }
    
    // Verificar resultados especiales
    const tractorsCreated = vehiclesToCreate.filter(v => 
      ['TR1', 'TR2', 'TR3'].includes(v.vehicleId)
    );
    
    if (tractorsCreated.length > 0) {
      console.log('\n🚜 TRACTORES CON HORÓMETRO CREADOS:');
      tractorsCreated.forEach(tractor => {
        console.log(`   • ${tractor.vehicleId}: ${tractor.currentHours}h iniciales`);
      });
    }
    
    return {
      success: results.errors === 0,
      message: `Creados ${results.created} vehículos${results.errors > 0 ? ` con ${results.errors} errores` : ''}`,
      existing: existingVehicles.length,
      created: results.created,
      errors: results.errors,
      errorDetails: results.errorDetails,
      total: existingVehicles.length + results.created
    };
    
  } catch (error) {
    console.error('❌ Error fatal en inicialización:', error);
    
    return {
      success: false,
      message: `Error fatal: ${error.message}`,
      existing: 0,
      created: 0,
      errors: 1,
      errorDetails: [{ general: error.message }]
    };
  }
};

/**
 * Función para verificar estado de vehículos con horómetro
 * @returns {Promise<Array>} - Lista de tractores con horómetro
 */
export const checkTractorsWithHourMeter = async () => {
  try {
    const vehicles = await getAllVehicles();
    const tractorsWithHourMeter = vehicles.filter(v => v.hasHourMeter);
    
    console.log('\n🚜 TRACTORES CON HORÓMETRO:');
    tractorsWithHourMeter.forEach(tractor => {
      console.log(`   • ${tractor.vehicleId} - ${tractor.name}`);
      console.log(`     Lectura actual: ${tractor.currentHours || 0}h`);
      console.log(`     Horas trabajadas: ${tractor.totalHoursWorked || 0}h`);
      console.log(`     Próximo mantenimiento: ${250 - ((tractor.currentHours || 0) % 250)}h`);
      console.log('');
    });
    
    return tractorsWithHourMeter;
    
  } catch (error) {
    console.error('❌ Error verificando tractores:', error);
    return [];
  }
};

/**
 * Función para limpiar vehículos (solo para desarrollo)
 * USAR CON CUIDADO - Elimina TODOS los vehículos
 */
export const clearAllVehicles = async () => {
  console.warn('⚠️ ADVERTENCIA: Esta función eliminará TODOS los vehículos');
  console.warn('Solo debe usarse en desarrollo para limpiar datos de prueba');
  
  // Implementación comentada por seguridad
  // const vehicles = await getAllVehicles();
  // for (const vehicle of vehicles) {
  //   await deleteVehicle(vehicle.id);
  // }
  
  throw new Error('Función deshabilitada por seguridad. Descomentar si es necesario.');
};

export default {
  initializePredefinedVehicles,
  checkTractorsWithHourMeter,
  clearAllVehicles
};