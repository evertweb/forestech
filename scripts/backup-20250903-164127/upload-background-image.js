// Script para subir la imagen de fondo a Firebase Storage
// forestech/scripts/upload-background-image.js

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtCm5LfEyv-6DzNJrLpJDJUQYh8NmzrZU",
  authDomain: "liquidacionapp-62962.firebaseapp.com",
  projectId: "liquidacionapp-62962",
  storageBucket: "liquidacionapp-62962.firebasestorage.app",
  messagingSenderId: "851382130132",
  appId: "1:851382130132:web:a8c9b5c3d7e2f1g4h5i6j7"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function uploadBackgroundImage() {
  const imagePath = '/tmp/forestech-bg/login-background.jpg';
  const storagePath = 'auth/login-background.jpg';

  try {
    console.log('🔄 Subiendo imagen de fondo a Firebase Storage...');
    
    // Verificar que el archivo existe
    if (!fs.existsSync(imagePath)) {
      throw new Error(`El archivo no existe: ${imagePath}`);
    }

    // Leer el archivo
    const fileBuffer = fs.readFileSync(imagePath);
    console.log(`📁 Archivo leído: ${fileBuffer.length} bytes`);

    // Crear referencia en Storage
    const imageRef = ref(storage, storagePath);

    // Subir archivo
    console.log('⬆️ Subiendo archivo...');
    const uploadResult = await uploadBytes(imageRef, fileBuffer, {
      contentType: 'image/jpeg'
    });

    console.log('✅ Archivo subido exitosamente');

    // Obtener URL de descarga
    console.log('🔗 Obteniendo URL de descarga...');
    const downloadURL = await getDownloadURL(imageRef);

    console.log('🎉 ¡Imagen de fondo subida exitosamente!');
    console.log('📍 Ubicación en Storage:', storagePath);
    console.log('🔗 URL de descarga:', downloadURL);

    return downloadURL;

  } catch (error) {
    console.error('❌ Error subiendo imagen:', error);
    throw error;
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  uploadBackgroundImage()
    .then(url => {
      console.log('\n🌟 Proceso completado exitosamente');
      console.log('💡 Tip: Refresca la página de login para ver la nueva imagen');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Error en el proceso:', error.message);
      process.exit(1);
    });
}
