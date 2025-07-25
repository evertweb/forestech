/**
 * Script de debug para probar la carga de imagen de fondo
 * Ejecutar en la consola del navegador para diagnosticar problemas
 */

async function testBackgroundImage() {
  console.log('🔧 Iniciando test de imagen de fondo...');
  
  try {
    // Importar el servicio (esto funciona si el módulo está disponible en el contexto)
    const { getBackgroundImageUrl, preloadBackgroundImage } = window;
    
    if (!getBackgroundImageUrl) {
      console.error('❌ Servicio backgroundImageService no disponible en window');
      return;
    }
    
    // Paso 1: Obtener URL
    console.log('📥 Obteniendo URL de imagen...');
    const url = await getBackgroundImageUrl();
    console.log('✅ URL obtenida:', url);
    
    // Paso 2: Verificar que la URL es accesible
    console.log('🔍 Verificando accesibilidad de la URL...');
    
    const response = await fetch(url, { method: 'HEAD' });
    console.log('📊 Estado de la respuesta:', response.status);
    console.log('📋 Headers de respuesta:', Object.fromEntries(response.headers));
    
    if (!response.ok) {
      console.error('❌ URL no accesible:', response.status, response.statusText);
      return;
    }
    
    // Paso 3: Precargar imagen
    console.log('🔄 Precargando imagen...');
    const loaded = await preloadBackgroundImage(url);
    console.log('✅ Resultado de precarga:', loaded);
    
    // Paso 4: Aplicar imagen de fondo al body para test visual
    console.log('🎨 Aplicando imagen de test al body...');
    const originalBackground = document.body.style.background;
    
    document.body.style.background = `
      linear-gradient(135deg, rgba(27, 67, 50, 0.8) 0%, rgba(45, 80, 22, 0.8) 50%, rgba(27, 67, 50, 0.8) 100%), 
      url('${url}')
    `;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    
    console.log('✅ Test completado. Verificar visualmente si la imagen se muestra.');
    console.log('💡 Para revertir el cambio, ejecuta: document.body.style.background = ""');
    
    return {
      url,
      loaded,
      responsive: response.ok,
      applied: true
    };
    
  } catch (error) {
    console.error('❌ Error en el test:', error);
    return { error: error.message };
  }
}

// Test alternativo usando Firebase directamente
async function testFirebaseImage() {
  console.log('🔥 Test directo con Firebase...');
  
  try {
    // Esto asume que Firebase está disponible globalmente
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase no disponible globalmente');
      return;
    }
    
    const storage = firebase.storage();
    const imageRef = storage.ref('auth/login-background.jpg');
    
    const url = await imageRef.getDownloadURL();
    console.log('✅ URL desde Firebase:', url);
    
    // Test de carga directa
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    const loadPromise = new Promise((resolve, reject) => {
      img.onload = () => {
        console.log('✅ Imagen cargada exitosamente');
        console.log('📐 Dimensiones:', `${img.naturalWidth}x${img.naturalHeight}px`);
        resolve(true);
      };
      
      img.onerror = (error) => {
        console.error('❌ Error cargando imagen:', error);
        reject(error);
      };
    });
    
    img.src = url;
    await loadPromise;
    
    return { url, success: true };
    
  } catch (error) {
    console.error('❌ Error en test Firebase:', error);
    return { error: error.message };
  }
}

console.log('🚀 Scripts de debug disponibles:');
console.log('- testBackgroundImage(): Test completo del servicio');
console.log('- testFirebaseImage(): Test directo con Firebase');
