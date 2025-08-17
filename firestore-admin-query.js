#!/usr/bin/env node

/**
 * Script de consultas Firestore usando Firebase Admin SDK
 * Bypasa reglas de seguridad y permite acceso completo
 * Uso: node firestore-admin-query.js [coleccion] [limite?]
 */

import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración del Admin SDK
const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');

let db;

async function initializeAdmin() {
  try {
    // Opción 1: Service Account Key (más seguro)
    if (existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'liquidacionapp-62962'
      });
      
      console.log('✅ Inicializado con Service Account Key');
    } 
    // Opción 2: Variables de entorno (Firebase CLI)
    else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        projectId: 'liquidacionapp-62962'
      });
      
      console.log('✅ Inicializado con GOOGLE_APPLICATION_CREDENTIALS');
    }
    // Opción 3: Firebase CLI login (automático)
    else {
      admin.initializeApp({
        projectId: 'liquidacionapp-62962'
      });
      
      console.log('✅ Inicializado con credenciales predeterminadas');
    }

    db = admin.firestore();
    return true;
    
  } catch (error) {
    console.error('❌ Error al inicializar Admin SDK:', error.message);
    console.log('\n💡 Opciones para configurar acceso:');
    console.log('   1. Descargar Service Account Key de Firebase Console');
    console.log('   2. firebase login && export GOOGLE_APPLICATION_CREDENTIALS');
    console.log('   3. gcloud auth application-default login');
    return false;
  }
}

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
    
    console.log('\n💡 Uso: node firestore-admin-query.js [coleccion] [limite]\n');
    
  } catch (error) {
    console.error('❌ Error al listar colecciones:', error.message);
  }
}

async function countDocuments(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).count().get();
    console.log(`📊 Total documentos en '${collectionName}': ${snapshot.data().count}`);
  } catch (error) {
    console.error('❌ Error al contar documentos:', error.message);
  }
}

// Ejecutar script
async function main() {
  const initialized = await initializeAdmin();
  if (!initialized) return;

  const args = process.argv.slice(2);

  if (args.length === 0) {
    await listCollections();
  } else if (args[0] === 'count') {
    const collectionName = args[1];
    if (collectionName) {
      await countDocuments(collectionName);
    } else {
      console.log('💡 Uso: node firestore-admin-query.js count [coleccion]');
    }
  } else {
    const collectionName = args[0];
    const limitCount = parseInt(args[1]) || 10;
    await queryCollection(collectionName, limitCount);
  }
}

main().then(() => process.exit(0)).catch(console.error);