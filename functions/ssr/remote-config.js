import admin from 'firebase-admin';

// Cache en memoria para Remote Config (TTL 5 minutos)
let configCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos en ms

/**
 * Obtener configuración de Remote Config con cache
 * @returns {Promise<Object>} - Configuración parseada
 */
export async function getRemoteConfig() {
  const now = Date.now();
  
  // Usar cache si está vigente
  if (configCache && (now - cacheTimestamp) < CACHE_TTL) {
    return configCache;
  }
  
  try {
    // Inicializar Admin SDK si no está inicializado
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: 'liquidacionapp-62962',
      });
    }
    
    // TEMPORAL: Configuración conservadora hasta que Remote Config se sincronice
    const config = {
      ssrEnabledRoutes: [
        '/combustibles/', 
        '/combustibles/movimientos', 
        '/combustibles/inventario', 
        '/combustibles/vehiculos'
      ],
      ssrEnabled: true,
      ssrUserSampling: 100,
      maxDataFetchTime: 800,
      enableCaching: true,
    };
    
    console.log('🎯 Using hardcoded config until Remote Config syncs:', config);
    
    // Actualizar cache
    configCache = config;
    cacheTimestamp = now;
    
    return config;
    
    /* COMENTADO TEMPORALMENTE - Remote Config con problemas de sync
    const remoteConfig = admin.remoteConfig();
    const template = await remoteConfig.getTemplate();
    
    // Parsear parámetros relevantes
    const config = {
      ssrEnabledRoutes: parseRemoteConfigParam(template.parameters?.ssr_enabled_routes),
      ssrEnabled: parseRemoteConfigParam(template.parameters?.ssr_enabled, true), // default true
      ssrUserSampling: parseRemoteConfigParam(template.parameters?.ssr_user_sampling, 100), // default 100%
      maxDataFetchTime: parseRemoteConfigParam(template.parameters?.max_data_fetch_time, 800), // default 800ms
      enableCaching: parseRemoteConfigParam(template.parameters?.enable_caching, true),
    };
    
    // Actualizar cache
    configCache = config;
    cacheTimestamp = now;
    
    return config;
    */
  } catch (error) {
    console.error('Error fetching Remote Config:', error);
    
    // Fallback a configuración por defecto si Remote Config falla
    const fallbackConfig = {
      ssrEnabledRoutes: ['/combustibles/', '/combustibles/inventario', '/combustibles/movimientos', '/combustibles/vehiculos', '/combustibles/mantenimiento'],
      ssrEnabled: true,
      ssrUserSampling: 100,
      maxDataFetchTime: 800,
      enableCaching: true,
    };
    
    // Cache fallback por menos tiempo (1 minuto)
    configCache = fallbackConfig;
    cacheTimestamp = now - (CACHE_TTL - 60000);
    
    return fallbackConfig;
  }
}

/**
 * Parsear parámetro de Remote Config con valor por defecto
 * @param {Object} parameter - Parámetro de Remote Config
 * @param {any} defaultValue - Valor por defecto
 * @returns {any} - Valor parseado
 */
function parseRemoteConfigParam(parameter, defaultValue = null) {
  if (!parameter?.defaultValue?.value) {
    return defaultValue;
  }
  
  const value = parameter.defaultValue.value;
  
  try {
    // Intentar parsear como JSON si el valor empieza con [ o {
    if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
      return JSON.parse(value);
    }
    
    // Parsear booleans
    if (value === 'true') return true;
    if (value === 'false') return false;
    
    // Parsear números
    if (!isNaN(value) && !isNaN(parseFloat(value))) {
      return parseFloat(value);
    }
    
    // Retornar string tal como está
    return value;
  } catch (error) {
    console.warn(`Error parsing Remote Config parameter:`, error);
    return defaultValue;
  }
}

/**
 * Verificar si SSR está habilitado para una ruta específica
 * @param {string} route - Ruta a verificar
 * @param {Object} user - Usuario autenticado (opcional, para sampling)
 * @returns {Promise<boolean>} - true si SSR está habilitado
 */
export async function isSSREnabled(route, user = null) {
  try {
    const config = await getRemoteConfig();
    
    // Verificar si SSR está globalmente deshabilitado
    if (!config.ssrEnabled) {
      return false;
    }
    
    // Verificar si la ruta específica está en la lista habilitada
    const enabledRoutes = config.ssrEnabledRoutes || [];
    const isRouteEnabled = enabledRoutes.some(enabledRoute => {
      // Exact match
      if (route === enabledRoute) return true;
      
      // Para la ruta raíz /combustibles/, solo permitir exacta (sin sub-rutas)
      if (enabledRoute === '/combustibles/') {
        return route === '/combustibles/' || route === '/combustibles';
      }
      
      // Para rutas específicas, permitir sub-rutas con /
      return route.startsWith(enabledRoute + '/');
    });
    
    if (!isRouteEnabled) {
      return false;
    }
    
    // Aplicar sampling de usuarios (para rollouts graduales)
    const sampling = config.ssrUserSampling || 100;
    if (sampling < 100 && user?.uid) {
      // Hash simple del UID para sampling consistente
      const hash = simpleHash(user.uid);
      const userBucket = hash % 100;
      return userBucket < sampling;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking SSR enablement:', error);
    // Fallback muy específico solo para rutas críticas exactas
    const criticalRoutes = ['/combustibles/', '/combustibles/movimientos', '/combustibles/inventario'];
    return criticalRoutes.includes(route);
  }
}

/**
 * Hash simple para sampling consistente
 * @param {string} str - String a hashear
 * @returns {number} - Hash numérico
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Invalidar cache de Remote Config (útil para testing)
 */
export function invalidateConfigCache() {
  configCache = null;
  cacheTimestamp = 0;
}