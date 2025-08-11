import admin from 'firebase-admin';

// Script para configurar Remote Config permanentemente - Versión mejorada
async function configureSSRProduction() {
  try {
    // Inicializar Firebase Admin con credenciales por defecto
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: 'liquidacionapp-62962',
      });
    }

    const remoteConfig = admin.remoteConfig();
    
    console.log('📡 Obteniendo template actual...');
    
    // Obtener template actual para obtener ETag
    const currentTemplate = await remoteConfig.getTemplate();
    console.log(`📋 Template actual version: ${currentTemplate.version.versionNumber}`);
    
    // Modificar template existente
    const updatedTemplate = {
      ...currentTemplate,
      parameters: {
        ...currentTemplate.parameters,
        ssr_enabled: {
          defaultValue: { value: 'true' },
          description: 'Habilita Server-Side Rendering globalmente - PRODUCCIÓN PERMANENTE'
        },
        ssr_enabled_routes: {
          defaultValue: {
            value: JSON.stringify([
              '/combustibles/login',
              '/combustibles/movements', 
              '/combustibles/inventory',
              '/combustibles/vehicles',
              '/combustibles/dashboard',
              '/combustibles/maintenance',
              '/combustibles/reports',
              '/combustibles'
            ])
          },
          description: 'Rutas donde SSR está activo - TODAS las rutas de combustibles'
        },
        ssr_user_sampling: {
          defaultValue: { value: '100' },
          description: 'Porcentaje de usuarios que reciben SSR (100 = todos) - PRODUCCIÓN'
        },
        max_data_fetch_time: {
          defaultValue: { value: '800' },
          description: 'Tiempo máximo para fetch de datos SSR en ms'
        },
        enable_caching: {
          defaultValue: { value: 'true' },
          description: 'Cache de respuestas SSR habilitado'
        },
        ssr_production_mode: {
          defaultValue: { value: 'true' },
          description: 'Modo producción SSR - optimizaciones completas'
        }
      },
      version: {
        description: `SSR PERMANENTE ACTIVADO - Configuración Producción ${new Date().toISOString()}`
      }
    };

    console.log('🔄 Validando template...');
    const validatedTemplate = await remoteConfig.validateTemplate(updatedTemplate);
    
    console.log('📤 Publicando configuración...');
    const publishedTemplate = await remoteConfig.publishTemplate(validatedTemplate);
    
    console.log('✅ ¡Remote Config configurado exitosamente!');
    console.log(`📊 Nueva versión: ${publishedTemplate.version.versionNumber}`);
    console.log('🎉 SSR está ahora PERMANENTEMENTE ACTIVO en producción!');
    console.log('');
    console.log('📋 Configuración aplicada:');
    console.log('   - ssr_enabled: true');
    console.log('   - ssr_user_sampling: 100%');
    console.log('   - ssr_production_mode: true');
    console.log('   - Rutas SSR: /combustibles/*');
    console.log('');
    console.log('🚀 Esto significa que:');
    console.log('   ✓ SSR permanece activo entre deploys');
    console.log('   ✓ No necesitas reactivar SSR manualmente');
    console.log('   ✓ Todos los usuarios reciben SSR');
    console.log('   ✓ Optimizado para producción');
    
    return true;
  } catch (error) {
    console.error('❌ Error configurando Remote Config:', error.message);
    console.error('🔍 Detalles:', error);
    return false;
  }
}

configureSSRProduction();
