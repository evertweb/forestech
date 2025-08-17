#!/usr/bin/env node

/**
 * Probar si las reglas de Firestore están bloqueando el acceso desde el cliente web
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCbU834quCY8hjSffRwljJLgZrcxK8i2F4",
  authDomain: "liquidacionapp-62962.firebaseapp.com",
  projectId: "liquidacionapp-62962",
  storageBucket: "liquidacionapp-62962.firebasestorage.app",
  messagingSenderId: "851382130132",
  appId: "1:851382130132:web:eaba38fab449f14fb5b241",
  measurementId: "G-TPNSX0EGB0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function testFirebaseAccess() {
  try {
    console.log('🔐 Probando acceso a Firestore con cliente web...\n');

    // Test 1: Sin autenticación
    console.log('📋 Test 1: Acceso sin autenticación');
    try {
      const snapshot = await getDocs(collection(db, 'combustibles_inventory'));
      console.log('✅ Acceso exitoso sin auth:', snapshot.size, 'documentos');
    } catch (error) {
      console.log('❌ Error sin auth:', error.code, error.message);
      
      // Test 2: Con autenticación anónima
      console.log('\n📋 Test 2: Probando con autenticación anónima');
      try {
        await signInAnonymously(auth);
        console.log('✅ Login anónimo exitoso');
        
        const snapshot2 = await getDocs(collection(db, 'combustibles_inventory'));
        console.log('✅ Acceso exitoso con auth:', snapshot2.size, 'documentos');
      } catch (authError) {
        console.log('❌ Error con auth:', authError.code, authError.message);
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

await testFirebaseAccess();
process.exit(0);