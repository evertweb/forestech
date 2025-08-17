/**
 * Script para verificar qué ubicaciones reales se han usado en movimientos de Firebase
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, limit } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4",
  authDomain: "liquidacionapp-62962.firebaseapp.com",
  projectId: "liquidacionapp-62962",
  storageBucket: "liquidacionapp-62962.firebasestorage.app",
  messagingSenderId: "851382130132",
  appId: "1:851382130132:web:eaba38fab449f14fb5b241"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const checkRealLocations = async () => {
  try {
    console.log('🔍 VERIFICANDO UBICACIONES REALES EN MOVIMIENTOS Y INVENTARIO');
    console.log('==========================================================\n');

    // 1. Verificar ubicaciones en movimientos
    console.log('📊 MOVIMIENTOS:');
    try {
      const movementsRef = collection(db, 'combustibles_movements');
      const movementsSnapshot = await getDocs(query(movementsRef, limit(100)));
      
      if (movementsSnapshot.size > 0) {
        const locationsInMovements = new Set();
        const supplierNamesInMovements = new Set();
        const destinationLocationsInMovements = new Set();
        
        console.log(`  Total movimientos: ${movementsSnapshot.size}`);
        
        movementsSnapshot.forEach(doc => {
          const data = doc.data();
          
          // Ubicaciones de origen
          if (data.location) {
            locationsInMovements.add(data.location);
          }
          
          // Ubicaciones de destino
          if (data.destinationLocation) {
            destinationLocationsInMovements.add(data.destinationLocation);
          }
          
          // Nombres de proveedores (para entradas)
          if (data.supplierName) {
            supplierNamesInMovements.add(data.supplierName);
          }
        });
        
        console.log(`\n  🗂️ UBICACIONES DE ORIGEN encontradas: ${locationsInMovements.size}`);
        Array.from(locationsInMovements).forEach(loc => {
          console.log(`     - "${loc}"`);
        });
        
        console.log(`\n  🗂️ UBICACIONES DE DESTINO encontradas: ${destinationLocationsInMovements.size}`);
        Array.from(destinationLocationsInMovements).forEach(loc => {
          console.log(`     - "${loc}"`);
        });
        
        console.log(`\n  🏪 PROVEEDORES encontrados: ${supplierNamesInMovements.size}`);
        Array.from(supplierNamesInMovements).forEach(sup => {
          console.log(`     - "${sup}"`);
        });
        
      } else {
        console.log('  ❌ No se encontraron movimientos');
      }
    } catch (error) {
      console.log(`  ❌ Error accediendo a movimientos: ${error.message}`);
    }

    // 2. Verificar ubicaciones en inventario
    console.log('\n📊 INVENTARIO:');
    try {
      const inventoryRef = collection(db, 'combustibles_inventory');
      const inventorySnapshot = await getDocs(inventoryRef);
      
      if (inventorySnapshot.size > 0) {
        const locationsInInventory = new Set();
        
        console.log(`  Total items inventario: ${inventorySnapshot.size}`);
        
        inventorySnapshot.forEach(doc => {
          const data = doc.data();
          if (data.location) {
            locationsInInventory.add(data.location);
          }
        });
        
        console.log(`\n  🗂️ UBICACIONES EN INVENTARIO: ${locationsInInventory.size}`);
        Array.from(locationsInInventory).forEach(loc => {
          console.log(`     - "${loc}"`);
        });
        
      } else {
        console.log('  ❌ No se encontró inventario');
      }
    } catch (error) {
      console.log(`  ❌ Error accediendo a inventario: ${error.message}`);
    }

    // 3. Comparar con ubicaciones hardcodeadas
    console.log('\n📊 COMPARACIÓN CON UBICACIONES HARDCODEADAS:');
    const OPERATIONAL_LOCATIONS = [
      'principal',
      'bodega austria', 
      'bodega ilusion',
      'campo operativo',
      'estación móvil',
    ];
    
    const STORAGE_LOCATIONS = [
      'bodega austria',
      'bodega ilusion'
    ];
    
    console.log('\n  🔧 UBICACIONES OPERATIVAS HARDCODEADAS:');
    OPERATIONAL_LOCATIONS.forEach(loc => {
      console.log(`     - "${loc}"`);
    });
    
    console.log('\n  🏭 UBICACIONES DE ALMACENAMIENTO HARDCODEADAS:');
    STORAGE_LOCATIONS.forEach(loc => {
      console.log(`     - "${loc}"`);
    });

  } catch (error) {
    console.error('❌ Error general:', error);
  }
};

// Ejecutar la verificación
checkRealLocations().then(() => {
  console.log('\n✅ Verificación de ubicaciones reales completada');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});