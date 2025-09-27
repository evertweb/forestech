#!/usr/bin/env node

/**
 * Script simple para auto-reparación con servidor local
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import fetch from 'node-fetch';
import * as readline from 'readline';

const firebaseConfig = {
  apiKey: "AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4",
  authDomain: "liquidacionapp-62962.firebaseapp.com",
  projectId: "liquidacionapp-62962",
  storageBucket: "liquidacionapp-62962.firebasestorage.app",
  messagingSenderId: "851382130132",
  appId: "1:851382130132:web:eaba38fab449f14fb5b241",
  measurementId: "G-TPNSX0EGB0",
};

async function promptCredentials() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('📧 Email: ', (email) => {
      rl.question('🔐 Password: ', (password) => {
        rl.close();
        resolve({ email, password });
      });
    });
  });
}

async function main() {
  try {
    console.log('🚀 Auto-reparación de base de datos Forestech');
    console.log('══════════════════════════════════════════════');
    
    // 1. Verificar estado inicial
    console.log('\n🔍 Verificando estado inicial...');
    const healthResponse = await fetch('http://localhost:8080/health/database');
    const healthData = await healthResponse.json();
    
    console.log('📊 Conexión DB:', healthData.connection?.status);
    console.log('📊 Sistema:', healthData.system?.status);
    console.log('📊 Score:', healthData.system?.score);
    
    if (healthData.system?.issues?.length > 0) {
      console.log('⚠️  Issues:');
      healthData.system.issues.forEach(issue => console.log(`   - ${issue.description}`));
    }
    
    // 2. Obtener credenciales
    console.log('\n🔐 Ingresa tus credenciales Firebase:');
    const { email, password } = await promptCredentials();
    
    // 3. Autenticar con Firebase
    console.log('\n🔥 Autenticando con Firebase...');
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    
    console.log('✅ Token obtenido:', token.substring(0, 50) + '...');
    
    // 4. Ejecutar auto-reparación
    console.log('\n🔧 Ejecutando auto-reparación...');
    const repairResponse = await fetch('http://localhost:8080/system/autorepair', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const repairData = await repairResponse.json();
    
    if (repairResponse.ok && repairData.success) {
      console.log('✅ Auto-reparación exitosa!');
      console.log('📋 Detalles:', JSON.stringify(repairData, null, 2));
    } else {
      console.log('❌ Auto-reparación falló');
      console.log('📋 Error:', JSON.stringify(repairData, null, 2));
    }
    
    // 5. Verificar estado final
    console.log('\n🔍 Verificando estado final...');
    const finalHealthResponse = await fetch('http://localhost:8080/health/database');
    const finalHealthData = await finalHealthResponse.json();
    
    console.log('📊 Conexión DB:', finalHealthData.connection?.status);
    console.log('📊 Sistema:', finalHealthData.system?.status);
    console.log('📊 Score:', finalHealthData.system?.score);
    
    console.log('\n🎉 ¡Proceso completado!');
    console.log('💡 Ahora puedes verificar la UI en http://localhost:5174/');
    
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    console.error('🔍 Detalles:', error);
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});