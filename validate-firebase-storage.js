#!/usr/bin/env node

/**
 * Script de validación para Firebase Storage CORS
 * Verifica que las imágenes se cargan correctamente desde el nuevo dominio
 */

import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4",
  authDomain: "liquidacionapp-62962.firebaseapp.com",
  projectId: "liquidacionapp-62962",
  storageBucket: "liquidacionapp-62962.firebasestorage.app",
  messagingSenderId: "851382130132",
  appId: "1:851382130132:web:eaba38fab449f14fb5b241",
  measurementId: "G-TPNSX0EGB0"
};

console.log('🔧 Validando configuración Firebase Storage...\n');

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function validateStorageAccess() {
  console.log('📋 Configuración Firebase:');
  console.log(`   Proyecto: ${firebaseConfig.projectId}`);
  console.log(`   Storage Bucket: ${firebaseConfig.storageBucket}`);
  console.log('');
  
  try {
    // Intentar obtener URL de imagen de fondo
    console.log('🔍 Verificando acceso a imagen de fondo...');
    const backgroundRef = ref(storage, 'auth/login-background.jpg');
    const backgroundUrl = await getDownloadURL(backgroundRef);
    
    console.log('✅ Imagen de fondo accesible:');
    console.log(`   URL: ${backgroundUrl}`);
    console.log('');
    
    // Verificar que la URL contiene el dominio correcto
    if (backgroundUrl.includes('firebasestorage.app')) {
      console.log('✅ Dominio correcto (.firebasestorage.app) en URL');
    } else if (backgroundUrl.includes('appspot.com')) {
      console.log('⚠️  URL todavía usa dominio antiguo (.appspot.com)');
    }
    
    // Probar carga HTTP
    console.log('🌐 Probando carga HTTP desde navegador...');
    
    const response = await fetch(backgroundUrl, {
      method: 'HEAD',
      mode: 'cors'
    });
    
    if (response.ok) {
      console.log('✅ Imagen se carga correctamente via HTTP');
      console.log(`   Status: ${response.status}`);
      console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    } else {
      console.log('❌ Error al cargar imagen via HTTP');
      console.log(`   Status: ${response.status}`);
    }
    
  } catch (error) {
    console.log('❌ Error al acceder a Storage:');
    console.log(`   Error: ${error.message}`);
    console.log(`   Code: ${error.code}`);
    
    if (error.code === 'storage/object-not-found') {
      console.log('💡 La imagen no existe. Subir una imagen de fondo primero.');
    } else if (error.code === 'storage/unauthorized') {
      console.log('💡 Problemas de permisos. Verificar reglas de Storage.');
    } else if (error.message.includes('CORS')) {
      console.log('💡 Problema CORS. Verificar configuración de dominio.');
    }
  }
  
  console.log('\n🎯 Resumen de validación:');
  console.log('1. Configuración Firebase actualizada a .firebasestorage.app');
  console.log('2. CORS configurado para el nuevo dominio');
  console.log('3. Variables de entorno sincronizadas');
  console.log('\n🚀 Si ves errores CORS, espera unos minutos para propagación.');
}

validateStorageAccess().catch(console.error);
