#!/usr/bin/env node

/**
 * Script para verificar la consistencia de fuelType en Firebase
 * Detecta inconsistencias entre mayúsculas y minúsculas
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAnlr0zdC8UJV9hD9D_C2-FjdnM1nBfnlM",
  authDomain: "liquidacionapp-62962.firebaseapp.com",
  projectId: "liquidacionapp-62962",
  storageBucket: "liquidacionapp-62962.appspot.com",
  messagingSenderId: "584027503251",
  appId: "1:584027503251:web:f2b1be8ea6c97e9c67ab5e"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔧 Conectar al emulador de Firestore solo si está disponible
const { connectFirestoreEmulator } = require('firebase/firestore');
const useEmulator = process.env.USE_EMULATOR === 'true';

if (useEmulator) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('🔧 Conectado al emulador de Firestore en localhost:8080\n');
  } catch (error) {
    console.log('⚠️ No se pudo conectar al emulador, usando base de datos de producción\n');
  }
} else {
  console.log('🔧 Conectado a Firebase en producción (modo solo lectura)\n');
}

async function checkFuelTypeConsistency() {
  console.log('🔍 Verificando consistencia de fuelType en Firebase...\n');

  try {
    // Verificar vehículos
    console.log('📋 VEHÍCULOS:');
    const vehiclesSnapshot = await getDocs(collection(db, 'vehicles'));
    const vehicleFuelTypes = new Set();
    
    vehiclesSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.fuelType) {
        vehicleFuelTypes.add(data.fuelType);
        console.log(`  ${data.vehicleId || doc.id}: fuelType = "${data.fuelType}"`);
      }
    });

    console.log('\n🔍 Tipos de combustible únicos en vehículos:');
    Array.from(vehicleFuelTypes).sort().forEach(type => {
      console.log(`  - "${type}"`);
    });

    // Verificar movimientos
    console.log('\n📋 MOVIMIENTOS (últimos 10):');
    const movementsSnapshot = await getDocs(collection(db, 'movements'));
    const movementFuelTypes = new Set();
    let movementCount = 0;
    
    movementsSnapshot.forEach((doc) => {
      if (movementCount >= 10) return;
      const data = doc.data();
      if (data.fuelType) {
        movementFuelTypes.add(data.fuelType);
        console.log(`  ${doc.id}: fuelType = "${data.fuelType}", type = "${data.type}"`);
        movementCount++;
      }
    });

    console.log('\n🔍 Tipos de combustible únicos en movimientos:');
    Array.from(movementFuelTypes).sort().forEach(type => {
      console.log(`  - "${type}"`);
    });

    // Verificar inventario
    console.log('\n📋 INVENTARIO:');
    const inventorySnapshot = await getDocs(collection(db, 'inventory'));
    const inventoryFuelTypes = new Set();
    
    inventorySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.fuelType) {
        inventoryFuelTypes.add(data.fuelType);
        console.log(`  ${doc.id}: fuelType = "${data.fuelType}", location = "${data.location}"`);
      }
    });

    console.log('\n🔍 Tipos de combustible únicos en inventario:');
    Array.from(inventoryFuelTypes).sort().forEach(type => {
      console.log(`  - "${type}"`);
    });

    // Análisis de inconsistencias
    console.log('\n🚨 ANÁLISIS DE INCONSISTENCIAS:');
    const allFuelTypes = new Set([...vehicleFuelTypes, ...movementFuelTypes, ...inventoryFuelTypes]);
    
    const dieselVariants = Array.from(allFuelTypes).filter(type => 
      type.toLowerCase().includes('diesel') || type.toLowerCase().includes('acpm')
    );
    
    const gasolineVariants = Array.from(allFuelTypes).filter(type => 
      type.toLowerCase().includes('gasolin') || type.toLowerCase().includes('gasolin')
    );

    if (dieselVariants.length > 1) {
      console.log('❌ DIESEL tiene inconsistencias:');
      dieselVariants.forEach(variant => console.log(`  - "${variant}"`));
    } else {
      console.log('✅ DIESEL consistente:', dieselVariants[0] || 'No encontrado');
    }

    if (gasolineVariants.length > 1) {
      console.log('❌ GASOLINE tiene inconsistencias:');
      gasolineVariants.forEach(variant => console.log(`  - "${variant}"`));
    } else {
      console.log('✅ GASOLINE consistente:', gasolineVariants[0] || 'No encontrado');
    }

    console.log('\n🎯 RESUMEN:');
    console.log(`Total tipos únicos encontrados: ${allFuelTypes.size}`);
    console.log(`Vehículos analizados: ${vehiclesSnapshot.size}`);
    console.log(`Movimientos analizados: ${Math.min(10, movementsSnapshot.size)}`);
    console.log(`Items de inventario analizados: ${inventorySnapshot.size}`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Ejecutar el análisis
checkFuelTypeConsistency().then(() => {
  console.log('\n✅ Análisis completado');
  process.exit(0);
}).catch(error => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});
