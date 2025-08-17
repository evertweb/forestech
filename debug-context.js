#!/usr/bin/env node

/**
 * Script para debuggear qué datos está recibiendo el contexto
 */

import admin from 'firebase-admin';

admin.initializeApp({
  projectId: 'liquidacionapp-62962'
});

const db = admin.firestore();

async function debugInventoryData() {
  try {
    console.log('🔍 Debugging datos de inventario...\n');

    const snapshot = await db.collection('combustibles_inventory').get();
    const inventory = [];

    snapshot.forEach((doc) => {
      inventory.push({ id: doc.id, ...doc.data() });
    });

    console.log('📦 Datos de inventario encontrados:', inventory.length);
    
    // Debuggear cada item
    inventory.forEach((item, index) => {
      console.log(`\n--- Item ${index + 1} ---`);
      console.log('ID:', item.id);
      console.log('Status:', item.status, typeof item.status);
      console.log('CurrentStock:', item.currentStock, typeof item.currentStock);
      console.log('PricePerUnit:', item.pricePerUnit, typeof item.pricePerUnit);
      console.log('MaxCapacity:', item.maxCapacity, typeof item.maxCapacity);
      console.log('MinStock/MinThreshold:', item.minStock || item.minThreshold);
      
      // Test cálculos
      const quantity = parseFloat(item.currentStock) || 0;
      const price = parseFloat(item.pricePerUnit) || 0;
      const value = quantity * price;
      
      console.log('🧮 Valor calculado:', value);
      console.log('✅ Item activo?', item.status === 'active');
    });

    // Test aggregate calculations
    console.log('\n🔬 CÁLCULOS AGREGADOS:');
    
    const totalValue = inventory.reduce((total, item) => {
      const quantity = parseFloat(item.currentStock) || 0;
      const price = parseFloat(item.pricePerUnit) || 0;
      return total + (quantity * price);
    }, 0);
    
    const activeItems = inventory.filter(item => item.status === 'active');
    const totalFuel = activeItems.reduce((sum, item) => sum + (parseFloat(item.currentStock) || 0), 0);
    
    console.log('💰 Valor Total Inventario:', totalValue);
    console.log('🛢️ Combustible Total:', totalFuel, 'galones');
    console.log('📊 Items Activos:', activeItems.length);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function debugVehiclesData() {
  try {
    console.log('\n🚜 Debugging datos de vehículos...\n');

    const snapshot = await db.collection('combustibles_vehicles').get();
    const vehicles = [];

    snapshot.forEach((doc) => {
      vehicles.push({ id: doc.id, ...doc.data() });
    });

    console.log('🚜 Vehículos encontrados:', vehicles.length);
    
    vehicles.forEach((vehicle, index) => {
      console.log(`\n--- Vehículo ${index + 1} ---`);
      console.log('ID:', vehicle.id);
      console.log('Status:', vehicle.status, typeof vehicle.status);
      console.log('TotalHoursWorked:', vehicle.totalHoursWorked, typeof vehicle.totalHoursWorked);
      console.log('✅ Vehículo activo?', vehicle.status === 'activo');
    });

    const activeVehicles = vehicles.filter(v => v.status === 'activo').length;
    const totalHours = vehicles.reduce((sum, v) => sum + (parseFloat(v.totalHoursWorked) || 0), 0);
    
    console.log('🔬 CÁLCULOS:');
    console.log('🚜 Vehículos Activos:', activeVehicles);
    console.log('⏱️ Horas Totales:', totalHours);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

await debugInventoryData();
await debugVehiclesData();
process.exit(0);