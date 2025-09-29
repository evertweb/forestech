/**
 * test-vehicles.js - Testing del servicio de vehículos SQL
 * Forestech Combustibles App - TASK-004
 */

import {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  getVehicleByCode,
  updateVehicle,
  deleteVehicle,
  getVehiclesStats,
  FUEL_COMPATIBILITY
} from './vehiclesService.js';

import sqlConnection from './SqlConnection.js';

/**
 * Ejecutar tests completos del servicio de vehículos
 */
export async function testVehiclesService() {
  console.log('🧪 Iniciando tests del servicio de vehículos SQL...');

  try {
    // Test 1: Crear vehículo de prueba
    console.log('\n📝 Test 1: Creando vehículo de prueba...');
    const testVehicle = {
      vehicleId: 'TEST001',
      name: 'Vehículo de Prueba',
      type: 'camion',
      fuelType: FUEL_COMPATIBILITY.DIESEL,
      brand: 'TestBrand',
      model: 'TestModel',
      year: 2023,
      plateNumber: 'TEST123',
      enginePower: 200,
      fuelCapacity: 100,
      currentLocation: 'Taller Principal',
      hasHourMeter: true,
      initialHourMeter: 150.5,
    };

    const createResult = await createVehicle(testVehicle);
    if (!createResult.success) {
      throw new Error(`Error creando vehículo: ${createResult.error}`);
    }

    const vehicleId = createResult.id;
    console.log('✅ Vehículo creado exitosamente:', vehicleId);

    // Test 2: Obtener vehículo por ID
    console.log('\n📝 Test 2: Obteniendo vehículo por ID...');
    const getByIdResult = await getVehicleById(vehicleId);
    if (!getByIdResult.success) {
      throw new Error(`Error obteniendo vehículo por ID: ${getByIdResult.error}`);
    }
    console.log('✅ Vehículo obtenido por ID:', getByIdResult.data.vehicleId);

    // Test 3: Obtener vehículo por código
    console.log('\n📝 Test 3: Obteniendo vehículo por código...');
    const getByCodeResult = await getVehicleByCode('TEST001');
    if (!getByCodeResult.success) {
      throw new Error(`Error obteniendo vehículo por código: ${getByCodeResult.error}`);
    }
    console.log('✅ Vehículo obtenido por código:', getByCodeResult.data.name);

    // Test 4: Obtener todos los vehículos
    console.log('\n📝 Test 4: Obteniendo todos los vehículos...');
    const getAllResult = await getAllVehicles();
    if (!getAllResult.success) {
      throw new Error(`Error obteniendo todos los vehículos: ${getAllResult.error}`);
    }
    console.log(`✅ Vehículos encontrados: ${getAllResult.count}`);

    // Test 5: Actualizar vehículo
    console.log('\n📝 Test 5: Actualizando vehículo...');
    const updateData = {
      name: 'Vehículo de Prueba Actualizado',
      currentLocation: 'Campo Norte',
      enginePower: 250,
    };

    const updateResult = await updateVehicle(vehicleId, updateData);
    if (!updateResult.success) {
      throw new Error(`Error actualizando vehículo: ${updateResult.error}`);
    }
    console.log('✅ Vehículo actualizado exitosamente');

    // Test 6: Obtener estadísticas
    console.log('\n📝 Test 6: Obteniendo estadísticas de vehículos...');
    const statsResult = await getVehiclesStats();
    if (!statsResult.success) {
      throw new Error(`Error obteniendo estadísticas: ${statsResult.error}`);
    }
    console.log('✅ Estadísticas obtenidas:', {
      totalVehicles: statsResult.data.totalVehicles,
      byType: statsResult.data.byType,
      byStatus: statsResult.data.byStatus,
    });

    // Test 7: Intentar eliminar vehículo (debería fallar por movimientos)
    console.log('\n📝 Test 7: Intentando eliminar vehículo (debería fallar)...');
    const deleteResult = await deleteVehicle(vehicleId);
    if (deleteResult.success) {
      console.log('⚠️ Vehículo eliminado (esto no debería pasar si hay movimientos)');
    } else {
      console.log('✅ Eliminación bloqueada correctamente:', deleteResult.error);
    }

    // Test 8: Verificar que el vehículo sigue existiendo
    console.log('\n📝 Test 8: Verificando que el vehículo sigue existiendo...');
    const verifyResult = await getVehicleById(vehicleId);
    if (!verifyResult.success) {
      throw new Error(`Error verificando vehículo: ${verifyResult.error}`);
    }
    console.log('✅ Vehículo verificado:', verifyResult.data.name);

    console.log('\n🎉 Todos los tests del servicio de vehículos pasaron exitosamente!');
    return { success: true, message: 'Todos los tests pasaron' };

  } catch (error) {
    console.error('❌ Error en tests del servicio de vehículos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Test individual de creación de vehículo
 */
export async function testCreateVehicle() {
  console.log('🧪 Test individual: Crear vehículo...');

  try {
    const testVehicle = {
      vehicleId: `TEST${Date.now()}`,
      name: 'Vehículo Test Individual',
      type: 'camioneta',
      fuelType: FUEL_COMPATIBILITY.GASOLINE,
      brand: 'TestBrand',
      model: 'TestModel',
      hasHourMeter: false,
    };

    const result = await createVehicle(testVehicle);
    if (result.success) {
      console.log('✅ Vehículo creado:', result.id);
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('❌ Error en test de creación:', error);
    throw error;
  }
}

/**
 * Test individual de consulta de vehículos
 */
export async function testQueryVehicles() {
  console.log('🧪 Test individual: Consultar vehículos...');

  try {
    const result = await getAllVehicles();
    if (result.success) {
      console.log(`✅ Vehículos encontrados: ${result.count}`);
      return result;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('❌ Error en test de consulta:', error);
    throw error;
  }
}

// Ejecutar tests si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Ejecutando tests del servicio de vehículos...');

  // Conectar a la base de datos
  await sqlConnection.connect();

  try {
    const testResult = await testVehiclesService();
    console.log('📊 Resultado final:', testResult);

    if (testResult.success) {
      console.log('🎉 ¡Todos los tests pasaron exitosamente!');
      process.exit(0);
    } else {
      console.error('💥 Algunos tests fallaron:', testResult.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Error fatal en tests:', error);
    process.exit(1);
  } finally {
    // Cerrar conexión
    await sqlConnection.disconnect();
  }
}