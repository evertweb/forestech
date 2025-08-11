import admin from 'firebase-admin';
import fs from 'node:fs/promises';

/**
 * Script para publicar Remote Config programáticamente
 * desde el archivo JSON exportado
 */

// Inicializar Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'liquidacionapp-62962',
    credential: admin.credential.applicationDefault()
  });
}

async function publishRemoteConfig() {
  try {
    console.log('🔧 Iniciando publicación de Remote Config...');
    
    // Leer el archivo JSON exportado
    const template = JSON.parse(
      await fs.readFile('/home/hp/Documents/forestech/remote_config_liquidacionapp_1.json', 'utf8')
    );
    
    console.log('📋 Template leído:', JSON.stringify(template, null, 2));
    
    // Obtener Remote Config service
    const remoteConfig = admin.remoteConfig();
    
    // Obtener template actual para obtener ETag
    const currentTemplate = await remoteConfig.getTemplate();
    
    // Crear nuevo template con ETag correcto
    const newTemplate = {
      parameters: template.parameters,
      etag: currentTemplate.etag
    };
    
    // Publicar template
    const publishedTemplate = await remoteConfig.publishTemplate(newTemplate);
    
    console.log('✅ Remote Config publicado exitosamente!');
    console.log('📊 Version:', publishedTemplate.version.versionNumber);
    console.log('🕐 Update time:', publishedTemplate.version.updateTime);
    
    // Verificar que se puede leer
    console.log('🔍 Verificando lectura...');
    const verifyTemplate = await remoteConfig.getTemplate();
    console.log('📖 Template actual:', JSON.stringify(verifyTemplate.parameters, null, 2));
    
    return true;
  } catch (error) {
    console.error('❌ Error publicando Remote Config:', error);
    
    // Verificar específicamente permisos
    if (error.code === 'PERMISSION_DENIED') {
      console.error('🚫 Error de permisos. Verificar:');
      console.error('   - Service Account: 851382130132-compute@developer.gserviceaccount.com');
      console.error('   - Rol: roles/firebase.admin');
      console.error('   - API: firebaseremoteconfig.googleapis.com habilitada');
    }
    
    return false;
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  publishRemoteConfig()
    .then(success => {
      if (success) {
        console.log('🎉 Remote Config configurado correctamente!');
        process.exit(0);
      } else {
        console.error('💥 Falló la configuración de Remote Config');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export { publishRemoteConfig };