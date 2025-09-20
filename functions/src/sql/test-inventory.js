import { getAllInventory, createInventoryItem } from './inventoryService.js';

async function testInventoryFunctions() {
  console.log('🧪 Testing Inventory Functions...');

  try {
    // Test 1: Obtener todo el inventario (debería estar vacío inicialmente)
    console.log('📦 Test 1: Obtener inventario vacío...');
    const getResult = await getAllInventory();
    console.log('✅ Resultado getAllInventory:', getResult);

    // Test 2: Crear un item de inventario de prueba
    console.log('📦 Test 2: Crear item de inventario de prueba...');
    const testInventoryData = {
      fuelType: 'ACPM',
      location: 'test-location',
      currentStock: 100,
      maxCapacity: 1000,
      minThreshold: 50,
      name: 'Test ACPM',
      description: 'Item de prueba para testing',
      unit: 'galones',
      pricePerUnit: 3.50,
      supplier: 'Test Supplier',
      status: 'active'
    };

    const createResult = await createInventoryItem(testInventoryData, { email: 'test@example.com' });
    console.log('✅ Resultado createInventoryItem:', createResult);

    if (createResult.success) {
      console.log('🎉 ¡Funciones de inventario funcionando correctamente!');
    } else {
      console.log('❌ Error en funciones de inventario:', createResult.error);
    }

  } catch (error) {
    console.error('❌ Error en testing:', error);
  }
}

testInventoryFunctions().catch(console.error);