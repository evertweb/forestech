// Test script para verificar la carga de imagen de fondo
import { getBackgroundImageUrl, preloadBackgroundImage } from './src/services/backgroundImageService.js';

// Función de prueba
async function testBackgroundImage() {
  console.log('🧪 Iniciando prueba de imagen de fondo...');
  
  try {
    // Intentar obtener la URL de la imagen
    const imageUrl = await getBackgroundImageUrl();
    console.log('✅ URL obtenida:', imageUrl);
    
    // Intentar precargar la imagen
    const loaded = await preloadBackgroundImage(imageUrl);
    console.log('✅ Imagen precargada:', loaded);
    
    return { success: true, url: imageUrl, loaded };
  } catch (error) {
    console.error('❌ Error en prueba:', error);
    return { success: false, error: error.message };
  }
}

// Ejecutar prueba
testBackgroundImage().then(result => {
  console.log('🏁 Resultado final:', result);
});
