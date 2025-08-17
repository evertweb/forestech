/**
 * Script para crear la colección de ubicaciones en Firebase
 * Solo dejamos "bodega austria" como ubicación permanente
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

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

const createLocationsCollection = async () => {
  try {
    console.log('🏗️  CREANDO COLECCIÓN DE UBICACIONES EN FIREBASE');
    console.log('===============================================\n');

    // Definir solo bodega austria como ubicación permanente
    const locations = [
      {
        id: "bodega-austria",
        name: "Bodega Austria",
        displayName: "Bodega Austria", // Para mostrar en UI
        type: "storage", // Tipo de ubicación: storage (almacenamiento)
        active: true,
        isPermanent: true, // Ubicación permanente, no se puede eliminar
        description: "Bodega principal de almacenamiento de combustibles",
        capacity: {
          diesel: 10000, // galones
          gasolina: 5000 // galones
        },
        features: [
          "almacenamiento",
          "recepcion_proveedores", 
          "salida_vehiculos"
        ],
        metadata: {
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: "system_admin"
        }
      }
    ];

    console.log('📍 Ubicaciones a crear:');
    locations.forEach(location => {
      console.log(`  - ${location.name} (${location.type})`);
    });

    console.log('\n🔄 Creando documentos en Firebase...');

    // Crear cada ubicación en la colección
    for (const location of locations) {
      const locationRef = doc(db, 'combustibles_locations', location.id);
      
      // Preparar datos para Firebase
      const locationData = {
        name: location.name,
        displayName: location.displayName,
        type: location.type,
        active: location.active,
        isPermanent: location.isPermanent,
        description: location.description,
        capacity: location.capacity,
        features: location.features,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: "system_admin"
      };

      await setDoc(locationRef, locationData);
      console.log(`✅ Creada ubicación: ${location.name}`);
    }

    console.log('\n🎉 ¡COLECCIÓN DE UBICACIONES CREADA EXITOSAMENTE!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Modificar Step3_Location para usar Firebase en lugar de constants');
    console.log('2. Crear servicio locationsService.js');
    console.log('3. Actualizar contexto para incluir ubicaciones dinámicas');
    console.log('4. Verificar que movimientos existentes funcionen correctamente');

  } catch (error) {
    console.error('❌ Error al crear ubicaciones:', error);
    throw error;
  }
};

// Ejecutar la creación
createLocationsCollection().then(() => {
  console.log('\n✅ Script completado exitosamente');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error en el script:', error);
  process.exit(1);
});