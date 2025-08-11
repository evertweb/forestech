import admin from 'firebase-admin';

// Script para configurar Remote Config permanentemente
async function configureSSRProduction() {
  try {
    // Inicializar Firebase Admin
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: 'liquidacionapp-62962',
      });
    }

    const remoteConfig = admin.remoteConfig();
    
    const template = {
      parameters: {
        ssr_enabled: {
          defaultValue: {
            value: 'true'
          },
          description: 'Habilita Server-Side Rendering globalmente - PRODUCCIÓN'
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
              '/combustibles/reports'
            ])
          },
          description: 'Rutas donde SSR está activo - TODAS las rutas de combustibles'
        },
        ssr_user_sampling: {
          defaultValue: {
            value: '100'
          },
          description: 'Porcentaje de usuarios que reciben SSR (100 = todos)'
        },
        max_data_fetch_time: {
          defaultValue: {
            value: '800'
          },
          description: 'Tiempo máximo para fetch de datos SSR en ms'
        },
        enable_caching: {
          defaultValue: {
            value: 'true'
          },
          description: 'Cache de respuestas SSR habilitado'
        },
        ssr_production_mode: {
          defaultValue: {
            value: 'true'
          },
          description: 'Modo producción SSR - optimizaciones completas'
        }
      },
      parameterGroups: {},
      version: {
        description: 'SSR Permanente Activado - Configuración Producción v1.0'
      }
    };

    // Validar y publicar template
    const validatedTemplate = await remoteConfig.validateTemplate(template);
    const publishedTemplate = await remoteConfig.publishTemplate(validatedTemplate);
    
    console.log('✅ Remote Config configurado exitosamente!');
    console.log(`📊 Version: ${publishedTemplate.version.versionNumber}`);
    console.log('🎉 SSR está ahora PERMANENTEMENTE ACTIVO en producción!');
    
    return true;
  } catch (error) {
    console.error('❌ Error configurando Remote Config:', error);
    return false;
  }
}

configureSSRProduction();
