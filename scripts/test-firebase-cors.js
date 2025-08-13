// Test CORS de Firebase Storage
// combustibles/scripts/test-firebase-cors.js

import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

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
const storage = getStorage(app);

console.log('🔧 Probando CORS en Firebase Storage...');
console.log('📍 Bucket:', firebaseConfig.storageBucket);
console.log('📍 Origen:', window?.location?.origin || 'Node.js');

// Test básico de descarga
async function testDownload() {
  try {
    const imageRef = ref(storage, 'auth/login-background.jpg');
    console.log('📥 Intentando obtener URL de descarga...');
    
    const url = await getDownloadURL(imageRef);
    console.log('✅ URL obtenida exitosamente:', url.substring(0, 100) + '...');
    
    // Test de fetch directo para verificar CORS
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'cors' 
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Headers disponibles:');
    
    for (const [key, value] of response.headers.entries()) {
      if (key.toLowerCase().includes('access-control')) {
        console.log(`   ${key}: ${value}`);
      }
    }
    
    if (response.ok) {
      console.log('✅ CORS funcionando correctamente!');
      return true;
    } else {
      console.log('❌ Error HTTP:', response.status);
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error en test CORS:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    
    if (error.message.includes('CORS')) {
      console.log('💡 Solución: Ejecutar scripts/setup-firebase-cors.sh');
    }
    
    return false;
  }
}

// Test de subida (si se ejecuta en navegador)
async function testUpload() {
  if (typeof window === 'undefined') {
    console.log('⏭️  Test de subida omitido (requiere navegador)');
    return true;
  }
  
  try {
    // Crear blob de prueba
    const testBlob = new Blob(['test-cors'], { type: 'text/plain' });
    const testFile = new File([testBlob], 'cors-test.txt');
    
    const testRef = ref(storage, 'test/cors-test.txt');
    
    console.log('📤 Probando subida de archivo...');
    
    // Esta operación fallará si CORS no está bien configurado
    const uploadTask = uploadBytes(testRef, testFile);
    await uploadTask;
    
    console.log('✅ Subida exitosa!');
    
    // Limpiar archivo de prueba
    await deleteObject(testRef);
    console.log('🗑️  Archivo de prueba eliminado');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error en subida:', error.message);
    return false;
  }
}

// Ejecutar tests
async function runTests() {
  console.log('🚀 Iniciando tests de CORS...\n');
  
  const downloadOk = await testDownload();
  console.log('');
  
  const uploadOk = await testUpload();
  console.log('');
  
  if (downloadOk && uploadOk) {
    console.log('🎉 Todos los tests de CORS pasaron exitosamente!');
  } else {
    console.log('⚠️  Algunos tests fallaron. Revisar configuración CORS.');
    console.log('💡 Ejecutar: scripts/setup-firebase-cors.sh');
  }
}

// Exportar para uso en módulos
export { testDownload, testUpload, runTests };

// Ejecutar si se llama directamente
if (typeof window !== 'undefined') {
  runTests();
}