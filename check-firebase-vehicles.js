/**
 * Script para verificar vehículos en Firebase y sus tipos de combustible
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

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

const checkVehicles = async () => {
  try {
    console.log('🔍 REVISANDO VEHÍCULOS EN FIREBASE');
    console.log('================================\n');

    // Obtener todos los vehículos
    const vehiclesRef = collection(db, 'combustibles_vehicles');
    const snapshot = await getDocs(vehiclesRef);
    
    console.log(`📊 Total de documentos encontrados: ${snapshot.size}\n`);

    if (snapshot.empty) {
      console.log('❌ No se encontraron vehículos en la colección combustibles_vehicles');
      return;
    }

    // Analizar cada vehículo
    const vehicles = [];
    const fuelTypeCount = {};
    const statusCount = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      vehicles.push({
        id: doc.id,
        ...data
      });

      // Contar tipos de combustible
      const fuelType = data.fuelType || 'Sin especificar';
      fuelTypeCount[fuelType] = (fuelTypeCount[fuelType] || 0) + 1;

      // Contar estados
      const status = data.status || 'Sin especificar';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    // Mostrar resumen
    console.log('📈 RESUMEN POR TIPO DE COMBUSTIBLE:');
    Object.entries(fuelTypeCount).forEach(([fuelType, count]) => {
      console.log(`  - ${fuelType}: ${count} vehículo(s)`);
    });

    console.log('\n📈 RESUMEN POR ESTADO:');
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`  - ${status}: ${count} vehículo(s)`);
    });

    // Filtrar vehículos DIESEL activos
    const dieselActiveVehicles = vehicles.filter(v => 
      v.fuelType?.toUpperCase() === 'DIESEL' && v.status === 'activo'
    );

    console.log(`\n🚛 VEHÍCULOS DIESEL ACTIVOS: ${dieselActiveVehicles.length}`);
    
    if (dieselActiveVehicles.length > 0) {
      dieselActiveVehicles.forEach((vehicle, index) => {
        console.log(`  ${index + 1}. ${vehicle.name || vehicle.plateNumber || 'Sin nombre'}`);
        console.log(`     - ID: ${vehicle.id}`);
        console.log(`     - Placa: ${vehicle.plateNumber || 'No especificada'}`);
        console.log(`     - Tipo Combustible: "${vehicle.fuelType}"`);
        console.log(`     - Estado: ${vehicle.status}`);
        console.log(`     - Categoría: ${vehicle.category || 'No especificada'}`);
      });
    }

    // Mostrar algunos vehículos de ejemplo con problemas potenciales
    console.log('\n🔍 ANÁLISIS DE POSIBLES PROBLEMAS:');
    
    const problematicVehicles = vehicles.filter(v => {
      const fuelType = v.fuelType;
      return fuelType && fuelType !== fuelType.toUpperCase();
    });

    if (problematicVehicles.length > 0) {
      console.log(`⚠️  Vehículos con tipos de combustible en minúsculas: ${problematicVehicles.length}`);
      problematicVehicles.slice(0, 3).forEach(v => {
        console.log(`     - ${v.name || v.plateNumber}: "${v.fuelType}" (debería ser "${v.fuelType?.toUpperCase()}")`);
      });
    } else {
      console.log('✅ Todos los tipos de combustible están en mayúsculas');
    }

    // Verificar vehículos inactivos con DIESEL
    const dieselInactiveVehicles = vehicles.filter(v => 
      v.fuelType?.toUpperCase() === 'DIESEL' && v.status !== 'activo'
    );

    if (dieselInactiveVehicles.length > 0) {
      console.log(`\n⚠️  VEHÍCULOS DIESEL INACTIVOS: ${dieselInactiveVehicles.length}`);
      dieselInactiveVehicles.slice(0, 3).forEach(v => {
        console.log(`     - ${v.name || v.plateNumber}: estado="${v.status}"`);
      });
    }

  } catch (error) {
    console.error('❌ Error al consultar Firebase:', error);
  }
};

// Ejecutar la verificación
checkVehicles().then(() => {
  console.log('\n✅ Verificación completada');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});