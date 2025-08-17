/**
 * Script simple para verificar vehículos en Firebase
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

// Configuración de Firebase (from combustibles/.env.local)
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

const checkVehiclesInFirebase = async () => {
  try {
    console.log('🔍 VERIFICANDO VEHÍCULOS EN FIREBASE');
    console.log('===================================\n');

    // 1. Consultar todos los vehículos
    console.log('📊 1. Consultando TODOS los vehículos...');
    const allVehiclesRef = collection(db, 'combustibles_vehicles');
    const allSnapshot = await getDocs(allVehiclesRef);
    
    console.log(`   Total documentos en combustibles_vehicles: ${allSnapshot.size}`);
    
    if (allSnapshot.empty) {
      console.log('❌ NO HAY VEHÍCULOS EN FIREBASE - Esta es la causa del problema!');
      return;
    }

    // 2. Analizar los datos
    const vehicles = [];
    const statusCount = {};
    const fuelTypeCount = {};
    
    allSnapshot.forEach((doc) => {
      const data = doc.data();
      vehicles.push({ id: doc.id, ...data });
      
      // Contar por estado
      const status = data.status || 'sin_estado';
      statusCount[status] = (statusCount[status] || 0) + 1;
      
      // Contar por tipo de combustible
      const fuelType = data.fuelType || 'sin_fuelType';
      fuelTypeCount[fuelType] = (fuelTypeCount[fuelType] || 0) + 1;
    });

    console.log('\n📈 2. RESUMEN POR ESTADO:');
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`   - ${status}: ${count} vehículo(s)`);
    });

    console.log('\n⛽ 3. RESUMEN POR TIPO DE COMBUSTIBLE:');
    Object.entries(fuelTypeCount).forEach(([fuelType, count]) => {
      console.log(`   - "${fuelType}": ${count} vehículo(s)`);
    });

    // 3. Consultar específicamente vehículos DIESEL activos
    console.log('\n🚛 4. CONSULTANDO VEHÍCULOS DIESEL ACTIVOS...');
    const dieselActiveQuery = query(
      allVehiclesRef,
      where('fuelType', '==', 'DIESEL'),
      where('status', '==', 'activo')
    );
    
    const dieselSnapshot = await getDocs(dieselActiveQuery);
    console.log(`   Vehículos DIESEL activos encontrados: ${dieselSnapshot.size}`);
    
    if (dieselSnapshot.size > 0) {
      console.log('\n   📋 Detalles de vehículos DIESEL activos:');
      dieselSnapshot.forEach((doc, index) => {
        const vehicle = doc.data();
        console.log(`   ${index + 1}. ${vehicle.name || vehicle.plateNumber || 'Sin nombre'}`);
        console.log(`      - ID: ${doc.id}`);
        console.log(`      - Placa: ${vehicle.plateNumber || 'No especificada'}`);
        console.log(`      - Estado: ${vehicle.status}`);
        console.log(`      - Tipo Combustible: "${vehicle.fuelType}"`);
        console.log(`      - Categoría: ${vehicle.category || 'No especificada'}`);
      });
    } else {
      console.log('❌ NO HAY VEHÍCULOS DIESEL ACTIVOS - Esta es la causa del problema!');
    }

    // 4. Verificar vehículos con problemas potenciales
    console.log('\n🔍 5. ANÁLISIS DE PROBLEMAS POTENCIALES:');
    
    const inactiveVehicles = vehicles.filter(v => v.status !== 'activo');
    if (inactiveVehicles.length > 0) {
      console.log(`   ⚠️  Vehículos inactivos: ${inactiveVehicles.length}`);
      inactiveVehicles.slice(0, 3).forEach(v => {
        console.log(`      - ${v.name || v.plateNumber}: estado="${v.status}"`);
      });
    }

    const noFuelTypeVehicles = vehicles.filter(v => !v.fuelType);
    if (noFuelTypeVehicles.length > 0) {
      console.log(`   ⚠️  Vehículos sin fuelType: ${noFuelTypeVehicles.length}`);
    }

    const dieselVariants = vehicles.filter(v => 
      v.fuelType && v.fuelType.toLowerCase().includes('diesel') && v.fuelType !== 'DIESEL'
    );
    if (dieselVariants.length > 0) {
      console.log(`   ⚠️  Vehículos con DIESEL en formato incorrecto: ${dieselVariants.length}`);
      dieselVariants.forEach(v => {
        console.log(`      - ${v.name || v.plateNumber}: fuelType="${v.fuelType}" (debería ser "DIESEL")`);
      });
    }

    // 5. Consultar con diferentes variantes para debug
    console.log('\n🧪 6. PRUEBAS DE CONSULTA CON VARIANTES:');
    
    const variants = ['DIESEL', 'diesel', 'Diesel', 'ACPM', 'acpm'];
    for (const variant of variants) {
      const variantQuery = query(
        allVehiclesRef,
        where('fuelType', '==', variant),
        where('status', '==', 'activo')
      );
      const variantSnapshot = await getDocs(variantQuery);
      console.log(`   - fuelType="${variant}" + status="activo": ${variantSnapshot.size} vehículos`);
    }

  } catch (error) {
    console.error('❌ Error al consultar Firebase:', error);
    console.error('   Error name:', error.name);
    console.error('   Error message:', error.message);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
  }
};

// Ejecutar la verificación
checkVehiclesInFirebase().then(() => {
  console.log('\n✅ Verificación completada');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error fatal:', error);
  process.exit(1);
});