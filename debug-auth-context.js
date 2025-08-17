#!/usr/bin/env node

/**
 * Debug del estado de autenticación en la aplicación
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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
const auth = getAuth(app);

async function testAuthState() {
  try {
    console.log('🔐 Verificando estado de autenticación...\n');

    // Verificar usuario actual
    console.log('👤 Usuario actual:', auth.currentUser?.email || 'No autenticado');
    console.log('🆔 UID:', auth.currentUser?.uid || 'N/A');
    console.log('🔑 Token válido:', !!auth.currentUser?.accessToken);

    if (!auth.currentUser) {
      console.log('\n⚠️  No hay usuario autenticado en el navegador');
      console.log('💡 Esto explicaría por qué el contexto no carga datos\n');
      
      // Mostrar cómo el contexto React evaluaría auth?.user
      console.log('🔍 Evaluación del contexto:');
      console.log('   auth?.user =', auth.currentUser);
      console.log('   !auth?.user =', !auth.currentUser);
      console.log('   → El contexto reseteará datos a arrays vacíos');
    } else {
      console.log('\n✅ Usuario autenticado correctamente');
      console.log('📧 Email:', auth.currentUser.email);
      console.log('🎭 Roles/Claims:', await auth.currentUser.getIdTokenResult());
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

await testAuthState();
process.exit(0);