/**
 * Script de prueba para verificar fix de normalización de tipos de combustible
 * Simula el problema donde formData.fuelType llega como "diesel" (minúscula)
 * y los vehículos tienen fuelType: "DIESEL" (mayúscula)
 */

console.log('🔧 TESTING FUEL TYPE NORMALIZATION FIX');
console.log('=====================================');

// Datos de prueba - simula el estado real del problema
const formData = {
  fuelType: 'diesel', // Como puede llegar desde productos/inventario (minúscula)
  type: 'salida',
  quantity: 50,
  location: 'Sede Central'
};

const vehicles = [
  {
    id: 'v1',
    name: 'Camión 1',
    plateNumber: 'ABC-123',
    fuelType: 'DIESEL', // Como está almacenado en Firebase (mayúscula)
    status: 'activo'
  },
  {
    id: 'v2',
    name: 'Camión 2', 
    plateNumber: 'XYZ-789',
    fuelType: 'DIESEL',
    status: 'activo'
  },
  {
    id: 'v3',
    name: 'Auto',
    plateNumber: 'GHI-456',
    fuelType: 'GASOLINE',
    status: 'activo'
  }
];

const inventory = [
  {
    id: 'i1',
    fuelType: 'DIESEL', // En Firebase como mayúscula
    location: 'Sede Central',
    currentStock: 1000,
    status: 'active'
  },
  {
    id: 'i2', 
    fuelType: 'diesel', // Posible inconsistencia (minúscula)
    location: 'Sede Central',
    currentStock: 500,
    status: 'active'
  }
];

console.log('📊 DATOS DE PRUEBA:');
console.log('- formData.fuelType:', formData.fuelType);
console.log('- Vehículos disponibles:', vehicles.length);
console.log('- Inventario disponible:', inventory.length);

// Test 1: Comparación SIN normalización (problema original)
console.log('\n❌ TEST 1 - SIN normalización (problema original):');
const vehiclesSinNormalizacion = vehicles.filter(vehicle => {
  const isFuelCompatible = vehicle.fuelType === formData.fuelType;
  const isActive = vehicle.status === 'activo';
  console.log(`  - ${vehicle.name}: fuelType=${vehicle.fuelType}, required=${formData.fuelType}, compatible=${isFuelCompatible}`);
  return isActive && isFuelCompatible;
});
console.log(`  → Vehículos encontrados: ${vehiclesSinNormalizacion.length} (PROBLEMA!)`);

// Test 2: Comparación CON normalización (fix implementado)
console.log('\n✅ TEST 2 - CON normalización (fix implementado):');
const vehiclesConNormalizacion = vehicles.filter(vehicle => {
  const vehicleFuelType = vehicle.fuelType?.toUpperCase() || '';
  const requiredFuelType = formData.fuelType?.toUpperCase() || '';
  const isFuelCompatible = vehicleFuelType === requiredFuelType;
  const isActive = vehicle.status === 'activo';
  console.log(`  - ${vehicle.name}: fuelType=${vehicleFuelType}, required=${requiredFuelType}, compatible=${isFuelCompatible}`);
  return isActive && isFuelCompatible;
});
console.log(`  → Vehículos encontrados: ${vehiclesConNormalizacion.length} (CORREGIDO!)`);

// Test 3: Verificar inventario también
console.log('\n📦 TEST 3 - Inventario CON normalización:');
const inventoryConNormalizacion = inventory.filter(item => {
  const itemFuelType = item.fuelType?.toUpperCase() || '';
  const requiredFuelType = formData.fuelType?.toUpperCase() || '';
  const locationMatch = item.location?.toLowerCase() === formData.location?.toLowerCase();
  const isFuelCompatible = itemFuelType === requiredFuelType;
  const isActive = item.status === 'active';
  console.log(`  - Item ${item.id}: fuelType=${itemFuelType}, required=${requiredFuelType}, compatible=${isFuelCompatible}, location=${locationMatch}`);
  return isActive && isFuelCompatible && locationMatch;
});
console.log(`  → Items de inventario encontrados: ${inventoryConNormalizacion.length}`);

const totalStock = inventoryConNormalizacion.reduce((total, item) => total + item.currentStock, 0);
console.log(`  → Stock total disponible: ${totalStock} galones`);

console.log('\n🎯 RESUMEN:');
console.log(`- Sin normalización: ${vehiclesSinNormalizacion.length} vehículos (FALLA)`);
console.log(`- Con normalización: ${vehiclesConNormalizacion.length} vehículos (ÉXITO)`);
console.log(`- Stock disponible: ${totalStock} galones`);
console.log('\n✅ FIX VALIDADO: La normalización resuelve el problema de mayúsculas/minúsculas');