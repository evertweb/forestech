// Test temporal: aplicar solo la imagen sin gradiente
// Ejecutar en la consola del navegador

function testImageOnly() {
  const authContainer = document.querySelector('.auth-container');
  if (authContainer) {
    const currentStyle = window.getComputedStyle(authContainer);
    const currentBg = currentStyle.backgroundImage;
    
    console.log('🔍 Background actual:', currentBg);
    
    // Extraer solo la URL de la imagen (quitar gradientes)
    const urlMatch = currentBg.match(/url\("([^"]+)"\)/);
    if (urlMatch) {
      const imageUrl = urlMatch[1];
      console.log('🖼️ URL de imagen extraída:', imageUrl);
      
      // Aplicar solo la imagen sin gradiente
      authContainer.style.backgroundImage = `url("${imageUrl}")`;
      authContainer.style.backgroundSize = 'cover';
      authContainer.style.backgroundPosition = 'center';
      authContainer.style.backgroundRepeat = 'no-repeat';
      
      console.log('✅ Imagen aplicada sin gradiente. ¿Se ve ahora?');
    } else {
      console.log('❌ No se encontró URL de imagen en el background');
    }
  } else {
    console.log('❌ No se encontró el contenedor auth-container');
  }
}

// Auto-ejecutar
testImageOnly();
