/**
 * Script para verificar ubicaciones en Firebase
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

const checkLocationsInFirebase = async () => {
  try {
    console.log('🔍 BUSCANDO UBICACIONES EN FIREBASE');
    console.log('=================================\n');

    // Intentar buscar en posibles colecciones de ubicaciones
    const possibleCollections = [
      'combustibles_locations',
      'locations', 
      'ubicaciones',
      'combustibles_ubicaciones',
      'storage_locations',
      'operational_locations'
    ];

    let foundCollections = [];

    for (const collectionName of possibleCollections) {
      try {
        console.log(`🔍 Buscando en colección: ${collectionName}`);
        const ref = collection(db, collectionName);
        const snapshot = await getDocs(ref);
        
        if (snapshot.size > 0) {
          console.log(`✅ Encontrada colección "${collectionName}" con ${snapshot.size} documentos`);
          foundCollections.push({
            name: collectionName,
            size: snapshot.size,
            docs: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          });
        } else {
          console.log(`❌ Colección "${collectionName}" existe pero está vacía`);
        }
      } catch (error) {
        console.log(`❌ Colección "${collectionName}" no existe o error: ${error.message}`);
      }
    }

    if (foundCollections.length === 0) {
      console.log('\n❌ NO SE ENCONTRARON COLECCIONES DE UBICACIONES EN FIREBASE');
      console.log('Las ubicaciones parecen estar definidas solo en el código local.\n');
    } else {
      console.log(`\n✅ COLECCIONES DE UBICACIONES ENCONTRADAS: ${foundCollections.length}`);
      
      foundCollections.forEach(col => {
        console.log(`\n📂 Colección: ${col.name}`);
        console.log(`📊 Documentos: ${col.size}`);
        
        col.docs.forEach((doc, index) => {
          console.log(`  ${index + 1}. ID: ${doc.id}`);
          console.log(`     Datos:`, JSON.stringify(doc, null, 6));
        });
      });
    }

    // Verificar en qué otras colecciones se mencionan ubicaciones
    console.log('\n🔍 VERIFICANDO REFERENCIAS A UBICACIONES EN OTRAS COLECCIONES');
    console.log('==============================================================');

    const collectionsToCheck = [
      'combustibles_inventory',
      'combustibles_movements', 
      'combustibles_suppliers'
    ];

    for (const collectionName of collectionsToCheck) {
      try {
        console.log(`\n📂 Analizando colección: ${collectionName}`);
        const ref = collection(db, collectionName);
        const snapshot = await getDocs(ref);
        
        if (snapshot.size > 0) {
          const locationsFound = new Set();
          let documentsWithLocation = 0;
          
          snapshot.forEach(doc => {
            const data = doc.data();
            if (data.location) {
              locationsFound.add(data.location);
              documentsWithLocation++;
            }
          });

          console.log(`  📊 Documentos totales: ${snapshot.size}`);
          console.log(`  📍 Documentos con ubicación: ${documentsWithLocation}`);
          console.log(`  📋 Ubicaciones únicas encontradas: ${locationsFound.size}`);
          
          if (locationsFound.size > 0) {
            console.log(`  📍 Ubicaciones:`);
            Array.from(locationsFound).forEach(loc => {
              console.log(`     - "${loc}"`);
            });
          }
        } else {
          console.log(`  ❌ Colección vacía o no existe`);
        }
      } catch (error) {
        console.log(`  ❌ Error accediendo a "${collectionName}": ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error al consultar Firebase:', error);
  }
};

// Ejecutar la verificación
checkLocationsInFirebase().then(() => {
  console.log('\n✅ Verificación de ubicaciones completada');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});