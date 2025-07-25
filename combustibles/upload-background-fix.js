/**
 * Script para subir imagen de fondo con configuración pública
 * Ejecutar desde la consola del navegador en la app de combustibles
 */

async function uploadPublicBackgroundImage() {
  console.log('🔧 Iniciando subida de imagen de fondo...');
  
  try {
    // Verificar que Firebase está disponible
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase no está disponible');
      return;
    }
    
    // Usar una imagen de prueba conocida primero
    const testImageUrl = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
    
    console.log('📥 Descargando imagen de prueba...');
    const response = await fetch(testImageUrl);
    const blob = await response.blob();
    
    console.log('📊 Imagen descargada:', {
      size: (blob.size / 1024 / 1024).toFixed(2) + 'MB',
      type: blob.type
    });
    
    // Configurar Storage
    const storage = firebase.storage();
    const storageRef = storage.ref();
    const imageRef = storageRef.child('auth/login-background.jpg');
    
    console.log('⬆️ Subiendo imagen a Firebase Storage...');
    
    // Configurar metadata para que sea pública
    const metadata = {
      contentType: blob.type,
      cacheControl: 'public, max-age=31536000', // 1 año de cache
      customMetadata: {
        'uploaded': new Date().toISOString(),
        'purpose': 'login-background'
      }
    };
    
    // Subir imagen
    const uploadTask = imageRef.put(blob, metadata);
    
    // Monitorear progreso
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('📊 Progreso de subida:', progress.toFixed(1) + '%');
      },
      (error) => {
        console.error('❌ Error en subida:', error);
      },
      async () => {
        console.log('✅ Subida completada');
        
        // Obtener URL de descarga
        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
        console.log('🔗 URL de descarga:', downloadURL);
        
        // Probar la URL directamente
        console.log('🧪 Probando acceso directo a la URL...');
        try {
          const testResponse = await fetch(downloadURL, { method: 'HEAD' });
          console.log('✅ URL accesible:', testResponse.ok);
          console.log('📋 Headers:', Object.fromEntries(testResponse.headers));
        } catch (testError) {
          console.error('❌ Error probando URL:', testError);
        }
        
        // Aplicar la imagen al fondo inmediatamente
        console.log('🎨 Aplicando imagen al fondo...');
        document.querySelector('.auth-container').style.backgroundImage = `
          linear-gradient(135deg, rgba(27, 67, 50, 0.3) 0%, rgba(45, 80, 22, 0.2) 50%, rgba(27, 67, 50, 0.3) 100%), 
          url("${downloadURL}")
        `;
        
        console.log('🎉 ¡Proceso completado exitosamente!');
        return downloadURL;
      }
    );
    
  } catch (error) {
    console.error('❌ Error en el proceso:', error);
  }
}

// Función alternativa para probar con imagen local
function createFileInput() {
  console.log('📁 Creando selector de archivos...');
  
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    console.log('📄 Archivo seleccionado:', {
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + 'MB',
      type: file.type
    });
    
    // Subir archivo seleccionado
    try {
      const storage = firebase.storage();
      const imageRef = storage.ref('auth/login-background.jpg');
      
      const metadata = {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000',
        customMetadata: {
          'uploaded': new Date().toISOString(),
          'originalName': file.name
        }
      };
      
      console.log('⬆️ Subiendo archivo...');
      const uploadTask = await imageRef.put(file, metadata);
      const downloadURL = await uploadTask.ref.getDownloadURL();
      
      console.log('✅ Archivo subido exitosamente');
      console.log('🔗 URL:', downloadURL);
      
      // Aplicar inmediatamente
      document.querySelector('.auth-container').style.backgroundImage = `
        linear-gradient(135deg, rgba(27, 67, 50, 0.3) 0%, rgba(45, 80, 22, 0.2) 50%, rgba(27, 67, 50, 0.3) 100%), 
        url("${downloadURL}")
      `;
      
    } catch (error) {
      console.error('❌ Error subiendo archivo:', error);
    }
  };
  
  input.click();
}

console.log('🚀 Funciones disponibles:');
console.log('- uploadPublicBackgroundImage(): Subir imagen de prueba automáticamente');
console.log('- createFileInput(): Seleccionar imagen desde tu computadora');
