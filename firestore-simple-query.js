#!/usr/bin/env node

/**
 * Script simplificado para consultas Firestore usando Firebase CLI tokens
 * No requiere Service Account, usa las credenciales del CLI
 */

import admin from 'firebase-admin';

// Configurar aplicación con solo el projectId
// Firebase Admin usará automáticamente las credenciales del CLI si están disponibles
admin.initializeApp({
  projectId: 'liquidacionapp-62962'
});

const db = admin.firestore();

async function queryCollection(collectionName, limitCount = 10) {
  try {
    console.log(`\n🔍 Consultando colección: ${collectionName}`);
    console.log(`📊 Límite: ${limitCount} documentos\n`);

    const snapshot = await db.collection(collectionName).limit(limitCount).get();

    if (snapshot.empty) {
      console.log(`❌ La colección '${collectionName}' está vacía o no existe.`);
      return;
    }

    console.log(`✅ Encontrados ${snapshot.size} documentos:\n`);
    
    snapshot.forEach((doc) => {
      console.log(`📄 Documento ID: ${doc.id}`);
      console.log('📋 Datos:', JSON.stringify(doc.data(), null, 2));
      console.log('─'.repeat(60));
    });

  } catch (error) {
    console.error('❌ Error al consultar Firestore:', error.message);
    
    if (error.message.includes('permission') || error.message.includes('authentication')) {
      console.log('\n💡 Posibles soluciones:');
      console.log('   1. firebase login');
      console.log('   2. Verificar permisos en Firebase Console');
      console.log('   3. Usar Service Account Key');
    }
  }
}

async function listCollections() {
  try {
    const collections = await db.listCollections();
    
    console.log('\n🗂️  Colecciones encontradas:');
    collections.forEach(col => console.log(`   • ${col.id}`));
    
    console.log('\n🎯 Colecciones esperadas para combustibles:');
    ['combustibles_inventory', 'combustibles_vehicles', 'combustibles_movements', 
     'combustibles_suppliers', 'combustibles_products'].forEach(col => {
      const exists = collections.find(c => c.id === col);
      console.log(`   ${exists ? '✅' : '❌'} ${col}`);
    });
    
    console.log('\n💡 Uso: node firestore-simple-query.js [coleccion] [limite]\n');
    
  } catch (error) {
    console.error('❌ Error al listar colecciones:', error.message);
  }
}

async function createSampleInventory() {
  try {
    console.log('🚀 Creando datos de ejemplo en inventario...\n');

    const sampleData = [
      {
        id: 'diesel_tanque_1',
        name: 'Diesel Tanque Principal',
        fuelType: 'DIESEL',
        currentStock: 1500,
        maxCapacity: 2000,
        minStock: 300,
        pricePerUnit: 12500,
        location: 'Tanque Principal',
        status: 'active',
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }
    ];

    for (const item of sampleData) {
      await db.collection('combustibles_inventory').doc(item.id).set(item);
      console.log(`✅ Creado: ${item.name}`);
    }

    console.log('\n🎉 Datos de ejemplo creados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error al crear datos:', error.message);
  }
}

// Ejecutar script
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    await listCollections();
  } else if (args[0] === 'create') {
    await createSampleInventory();
  } else {
    const collectionName = args[0];
    const limitCount = parseInt(args[1]) || 10;
    await queryCollection(collectionName, limitCount);
  }
}

main().then(() => process.exit(0)).catch(console.error);