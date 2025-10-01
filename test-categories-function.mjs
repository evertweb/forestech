/**
 * Test rápido para la función combustiblesCategories
 * Para verificar que la migración funciona correctamente
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Configuración de Firebase (copiada directamente)
const firebaseConfig = {
  apiKey: "AIzaSyBbRJLXvGNO5ABZ4FaMlAOIfNzJlJWjk7k",
  authDomain: "liquidacionapp-62962.firebaseapp.com",
  projectId: "liquidacionapp-62962",
  storageBucket: "liquidacionapp-62962.appspot.com",
  messagingSenderId: "851382130132",
  appId: "1:851382130132:web:ba9d23de02e2ba18da01f1",
  measurementId: "G-CL8ZR4JWJF"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

async function testCombustiblesCategories() {
  try {
    console.log('🚀 Iniciando test de combustiblesCategories...');
    
    // Obtener la función
    const combustiblesCategoriesFunction = httpsCallable(functions, 'combustiblesCategories');
    
    console.log('✅ Función combustiblesCategories obtenida');
    
    // Test 1: Obtener todas las categorías (sin autenticación)
    console.log('\n📋 Test 1: Obtener todas las categorías...');
    const getAllResult = await combustiblesCategoriesFunction({
      action: 'getAll'
    });
    
    console.log('✅ Resultado getAllCategories:', getAllResult.data);
    
    console.log('\n🎉 ¡Test básico pasó exitosamente!');
    console.log('🔥 La Firebase Function combustiblesCategories está funcionando');
    
  } catch (error) {
    console.error('❌ Error en el test:', error);
    console.error('📋 Stack trace:', error.stack);
  }
}

// Ejecutar test
testCombustiblesCategories();