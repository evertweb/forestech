#!/usr/bin/env node

/**
 * Script para consultas directas a Firestore desde la terminal
 * Uso: node firestore-query.js [coleccion] [limite?]
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, limit, orderBy } from 'firebase/firestore';

// Configuración de Firebase (usando las credenciales correctas del proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4",
  authDomain: "liquidacionapp-62962.firebaseapp.com",
  projectId: "liquidacionapp-62962",
  storageBucket: "liquidacionapp-62962.firebasestorage.app",
  messagingSenderId: "851382130132",
  appId: "1:851382130132:web:eaba38fab449f14fb5b241",
  measurementId: "G-TPNSX0EGB0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function queryCollection(collectionName, limitCount = 10) {
  try {
    console.log(`\n🔍 Consultando colección: ${collectionName}`);
    console.log(`📊 Límite: ${limitCount} documentos\n`);

    const colRef = collection(db, collectionName);
    const q = query(colRef, limit(limitCount));
    const snapshot = await getDocs(q);

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
  }
}

async function listCollections() {
  const collections = [
    'combustibles_inventory',
    'combustibles_vehicles', 
    'combustibles_movements',
    'combustibles_suppliers',
    'combustibles_products'
  ];

  console.log('\n🗂️  Colecciones disponibles:');
  collections.forEach(col => console.log(`   • ${col}`));
  console.log('\n💡 Uso: node firestore-query.js [coleccion] [limite]\n');
}

// Ejecutar script
const args = process.argv.slice(2);

if (args.length === 0) {
  await listCollections();
} else {
  const collectionName = args[0];
  const limitCount = parseInt(args[1]) || 10;
  await queryCollection(collectionName, limitCount);
}

process.exit(0);