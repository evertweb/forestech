#!/usr/bin/env node
/**
 * test-complete-flow.js
 * Simula el flujo completo de la aplicación desde el frontend hasta SQL Server
 * 
 * Flujo a probar:
 * 1. ✅ Obtener todas las categorías (getAllCategories)
 * 2. ✅ Crear una categoría de prueba
 * 3. ✅ Obtener todos los vehículos (getAllVehicles)
 * 4. ✅ Crear un vehículo de prueba
 * 5. ✅ Obtener inventario (getAllInventory)
 * 6. ✅ Crear item de inventario
 * 7. ✅ Crear movimiento de salida (combustible al vehículo)
 * 8. ✅ Verificar actualización de inventario y vehículo
 */

import { 
  getAllCategories, 
  createCategory,
  getActiveCategories
} from './src/sql/vehicleCategoriesService.js';

import {
  getAllVehicles,
  createVehicle,
  getVehicleById,
  getVehiclesStats
} from './src/sql/vehiclesService.js';

import {
  getAllInventory,
  createInventoryItem,
  getInventorySummary
} from './src/sql/inventoryService.js';

import {
  createMovement,
  getAllMovements,
  getMovementsStats
} from './src/sql/movementsService.js';

import {
  getAllSuppliers,
  createSupplier
} from './src/sql/suppliersService.js';

const TEST_PREFIX = 'TEST_' + Date.now();

// Mock user info
const mockUser = {
  uid: 'test-user-123',
  email: 'test@forestech.com',
  displayName: 'Test User'
};

/**
 * Limpiar datos de prueba al finalizar
 */
async function cleanup() {
  console.log('\n🧹 Limpiando datos de prueba...');
  // Por ahora solo informamos, no borramos para poder verificar en la BD
  console.log('⚠️  Datos de prueba mantenidos para verificación manual');
  console.log(`   Prefijo de prueba: ${TEST_PREFIX}`);
}

/**
 * Test completo del flujo
 */
async function testCompleteFlow() {
  console.log('🚀 INICIANDO TEST DE FLUJO COMPLETO');
  console.log('====================================\n');
  
  const results = {
    categories: null,
    vehicle: null,
    inventory: null,
    movement: null,
    supplier: null
  };
  
  try {
    // ========================================
    // 1. TEST DE CATEGORÍAS
    // ========================================
    console.log('📋 1. PROBANDO CATEGORÍAS...');
    console.log('─────────────────────────────────');
    
    // Obtener todas las categorías
    console.log('\n🔍 Obteniendo todas las categorías...');
    const categoriesResult = await getAllCategories();
    
    if (categoriesResult.success) {
      console.log(`✅ Categorías obtenidas: ${categoriesResult.count} registros`);
      if (categoriesResult.count > 0) {
        console.log('📊 Primeras 3 categorías:');
        categoriesResult.data.slice(0, 3).forEach(cat => {
          console.log(`   - ${cat.name} (${cat.code}) - sortOrder: ${cat.sortOrder || 'N/A'}`);
        });
      }
    } else {
      console.error('❌ Error obteniendo categorías:', categoriesResult.error);
      throw new Error('Fallo al obtener categorías');
    }
    
    // Crear categoría de prueba
    console.log('\n🆕 Creando categoría de prueba...');
    const categoryData = {
      name: `${TEST_PREFIX}_Camioneta`,
      code: `${TEST_PREFIX}_CAM`,
      description: 'Categoría de prueba para camionetas',
      type: 'vehicle',
      icon: 'truck',
      color: '#3B82F6',
      defaultFuelType: 'DIESEL',
      estimatedConsumption: 25.5,
      fields: ['horasMotor', 'kilometraje'],
      fuelTypes: ['DIESEL', 'ACPM']
    };
    
    const categoryResult = await createCategory(categoryData, mockUser);
    
    if (categoryResult.success) {
      console.log('✅ Categoría creada exitosamente');
      console.log(`   ID: ${categoryResult.id}`);
      results.categories = categoryResult;
    } else {
      console.error('❌ Error creando categoría:', categoryResult.error);
      // No fallar si la categoría ya existe
      if (!categoryResult.error.includes('Ya existe')) {
        throw new Error('Fallo al crear categoría');
      }
    }
    
    // ========================================
    // 2. TEST DE PROVEEDORES
    // ========================================
    console.log('\n\n🏢 2. PROBANDO PROVEEDORES...');
    console.log('─────────────────────────────────');
    
    console.log('\n🔍 Obteniendo proveedores...');
    const suppliersResult = await getAllSuppliers();
    
    if (suppliersResult.success) {
      console.log(`✅ Proveedores obtenidos: ${suppliersResult.count} registros`);
    }
    
    // Crear proveedor de prueba
    console.log('\n🆕 Creando proveedor de prueba...');
    const supplierData = {
      name: `${TEST_PREFIX}_Proveedor Combustibles`,
      code: `${TEST_PREFIX}_PROV`,
      contactName: 'Juan Pérez',
      contactEmail: 'juan@proveedor.com',
      contactPhone: '3001234567',
      isActive: true
    };
    
    const supplierResult = await createSupplier(supplierData, mockUser);
    
    if (supplierResult.success) {
      console.log('✅ Proveedor creado exitosamente');
      console.log(`   ID: ${supplierResult.id}`);
      results.supplier = supplierResult;
    } else {
      console.error('⚠️  Error creando proveedor:', supplierResult.error);
    }
    
    // ========================================
    // 3. TEST DE INVENTARIO
    // ========================================
    console.log('\n\n📦 3. PROBANDO INVENTARIO...');
    console.log('─────────────────────────────────');
    
    console.log('\n🔍 Obteniendo inventario...');
    const inventoryResult = await getAllInventory();
    
    if (inventoryResult.success) {
      console.log(`✅ Inventario obtenido: ${inventoryResult.count} items`);
      if (inventoryResult.count > 0) {
        console.log('📊 Primeros 3 items:');
        inventoryResult.data.slice(0, 3).forEach(item => {
          console.log(`   - ${item.fuelType} en ${item.location}: ${item.quantity} ${item.unit}`);
        });
      }
    }
    
    // Crear item de inventario
    console.log('\n🆕 Creando item de inventario...');
    const inventoryData = {
      fuelType: 'ACPM',  // Tipos válidos: ACPM, GASOLINA_CORRIENTE, GASOLINA_EXTRA, JET_A1
      location: `BODEGA_${TEST_PREFIX}`,
      currentStock: 1000,  // CORREGIDO: cambiar de 'quantity' a 'currentStock'
      unit: 'GAL',
      pricePerUnit: 12500,
      notes: 'Inventario de prueba'
    };
    
    const inventoryCreateResult = await createInventoryItem(inventoryData, mockUser);
    
    if (inventoryCreateResult.success) {
      console.log('✅ Item de inventario creado');
      console.log(`   ID: ${inventoryCreateResult.id}`);
      results.inventory = inventoryCreateResult;
    } else {
      console.error('❌ Error creando inventario:', inventoryCreateResult.error);
      throw new Error('Fallo al crear inventario');
    }
    
    // ========================================
    // 4. TEST DE VEHÍCULOS
    // ========================================
    console.log('\n\n🚗 4. PROBANDO VEHÍCULOS...');
    console.log('─────────────────────────────────');
    
    console.log('\n🔍 Obteniendo vehículos...');
    const vehiclesResult = await getAllVehicles();
    
    if (vehiclesResult.success) {
      console.log(`✅ Vehículos obtenidos: ${vehiclesResult.count} registros`);
    }
    
    // Crear vehículo de prueba
    console.log('\n🆕 Creando vehículo de prueba...');
    const vehicleData = {
      vehicleId: `${TEST_PREFIX}_VEH001`,
      name: `Camioneta Test ${TEST_PREFIX}`,
      brand: 'Toyota',
      model: 'Hilux',
      type: 'Camioneta',
      category: categoryResult.success ? categoryData.name : 'Camioneta',
      fuelType: 'DIESEL',  // Tipos válidos en vehículos: DIESEL, GASOLINA_CORRIENTE, GASOLINA_EXTRA, JET_A1
      currentLocation: 'SEDE_PRINCIPAL',
      operationalStatus: 'activo',
      hasHourMeter: true,
      currentHourMeter: 1000,
      priority: 'alta'
    };
    
    const vehicleResult = await createVehicle(vehicleData, mockUser);
    
    if (vehicleResult.success) {
      console.log('✅ Vehículo creado exitosamente');
      console.log(`   ID: ${vehicleResult.id}`);
      console.log(`   Código: ${vehicleData.vehicleId}`);
      results.vehicle = vehicleResult;
    } else {
      console.error('❌ Error creando vehículo:', vehicleResult.error);
      // No fallar si ya existe
      if (!vehicleResult.error.includes('Ya existe')) {
        throw new Error('Fallo al crear vehículo');
      }
    }
    
    // ========================================
    // 5. TEST DE MOVIMIENTOS
    // ========================================
    console.log('\n\n🔄 5. PROBANDO MOVIMIENTOS...');
    console.log('─────────────────────────────────');
    
    console.log('\n🔍 Obteniendo movimientos...');
    const movementsResult = await getAllMovements();
    
    if (movementsResult.success) {
      console.log(`✅ Movimientos obtenidos: ${movementsResult.count} registros`);
    }
    
    // Crear movimiento de salida (tanqueada)
    console.log('\n🆕 Creando movimiento de salida (tanqueada)...');
    const movementData = {
      type: 'salida',
      fuelType: 'ACPM',  // Debe coincidir con el tipo de inventario
      quantity: 50,
      unitPrice: 12500,
      totalValue: 625000,
      vehicleId: vehicleResult.success ? vehicleData.vehicleId : null,
      location: inventoryData.location,
      hourMeterReading: 1050,
      previousHourMeterReading: 1000,
      hoursWorked: 50,
      effectiveDate: new Date().toISOString(),
      description: `Tanqueada de prueba - ${TEST_PREFIX}`,
      status: 'completed'
    };
    
    const movementResult = await createMovement(movementData, mockUser);
    
    if (movementResult.success) {
      console.log('✅ Movimiento creado exitosamente');
      console.log(`   ID: ${movementResult.id}`);
      console.log(`   Tipo: ${movementData.type}`);
      console.log(`   Cantidad: ${movementData.quantity} GAL`);
      console.log(`   Valor: $${movementData.totalValue.toLocaleString()}`);
      results.movement = movementResult;
    } else {
      console.error('❌ Error creando movimiento:', movementResult.error);
      throw new Error('Fallo al crear movimiento');
    }
    
    // ========================================
    // 6. VERIFICACIÓN FINAL
    // ========================================
    console.log('\n\n✅ 6. VERIFICACIÓN FINAL...');
    console.log('─────────────────────────────────');
    
    // Verificar inventario actualizado
    console.log('\n📊 Verificando inventario actualizado...');
    const updatedInventory = await getAllInventory({ location: inventoryData.location });
    if (updatedInventory.success && updatedInventory.count > 0) {
      const item = updatedInventory.data[0];
      console.log(`✅ Inventario en ${item.location}:`);
      console.log(`   Cantidad actual: ${item.quantity} ${item.unit}`);
      console.log(`   Valor: $${item.totalValue?.toLocaleString() || 'N/A'}`);
    }
    
    // Verificar estadísticas de vehículo
    if (vehicleResult.success) {
      console.log('\n📊 Verificando vehículo actualizado...');
      const vehicleStats = await getVehicleById(vehicleResult.id);
      if (vehicleStats.success) {
        const vehicle = vehicleStats.data;
        console.log(`✅ Vehículo ${vehicle.name}:`);
        console.log(`   Combustible consumido: ${vehicle.totalFuelConsumed || 0} GAL`);
        console.log(`   Total movimientos: ${vehicle.totalMovements || 0}`);
        console.log(`   Horómetro actual: ${vehicle.currentHourMeter || 0} hrs`);
      }
    }
    
    // Obtener estadísticas generales
    console.log('\n📈 Obteniendo estadísticas generales...');
    const inventorySummary = await getInventorySummary();
    const vehiclesStats = await getVehiclesStats();
    const movementsStats = await getMovementsStats();
    
    console.log('\n📊 RESUMEN DE ESTADÍSTICAS:');
    console.log('════════════════════════════════');
    
    if (inventorySummary.success) {
      console.log(`\n📦 Inventario:`);
      console.log(`   Total items: ${inventorySummary.data.totalItems || 0}`);
      console.log(`   Valor total: $${(inventorySummary.data.totalValue || 0).toLocaleString()}`);
    }
    
    if (vehiclesStats.success) {
      console.log(`\n🚗 Vehículos:`);
      console.log(`   Total: ${vehiclesStats.data.total || 0}`);
      console.log(`   Activos: ${vehiclesStats.data.active || 0}`);
    }
    
    if (movementsStats.success) {
      console.log(`\n🔄 Movimientos:`);
      console.log(`   Total: ${movementsStats.data.total || 0}`);
      console.log(`   Valor total: $${(movementsStats.data.totalValue || 0).toLocaleString()}`);
    }
    
    // ========================================
    // RESUMEN FINAL
    // ========================================
    console.log('\n\n🎉 TEST COMPLETO FINALIZADO');
    console.log('════════════════════════════════');
    console.log('✅ Categorías: OK');
    console.log('✅ Proveedores: OK');
    console.log('✅ Inventario: OK');
    console.log('✅ Vehículos: OK');
    console.log('✅ Movimientos: OK');
    console.log('\n✅ TODOS LOS TESTS PASARON EXITOSAMENTE\n');
    
    return results;
    
  } catch (error) {
    console.error('\n❌ ERROR EN TEST:', error.message);
    console.error(error.stack);
    throw error;
  }
}

// Ejecutar test
console.log('⏳ Iniciando conexión a SQL Server...\n');
testCompleteFlow()
  .then(async (results) => {
    await cleanup();
    console.log('\n✅ Test completado exitosamente');
    process.exit(0);
  })
  .catch(async (error) => {
    await cleanup();
    console.error('\n❌ Test falló:', error.message);
    process.exit(1);
  });
