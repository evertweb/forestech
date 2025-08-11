// Configuración específica para testing SSR
// Override temporal para forzar SSR habilitado en tests

/**
 * Verificar si SSR está habilitado para una ruta específica
 * En modo test: siempre true para rutas de combustibles
 * @param {string} route - Ruta a verificar
 * @param {Object} user - Usuario autenticado (opcional)
 * @returns {Promise<boolean>} - true si SSR está habilitado
 */
export async function isSSREnabled(route, user = null) {
  // Para testing: habilitar SSR en todas las rutas de combustibles
  if (process.env.NODE_ENV === 'test' || process.env.FIREBASE_CONFIG) {
    return route.includes('/combustibles/');
  }
  
  // En modo emulador, usar configuración por defecto
  const defaultEnabledRoutes = [
    '/combustibles/login',
    '/combustibles/movements',
    '/combustibles/inventory',
    '/combustibles/vehicles',
    '/combustibles/dashboard'
  ];
  
  return defaultEnabledRoutes.some(enabledRoute => {
    return route === enabledRoute || route.startsWith(enabledRoute);
  });
}

/**
 * Obtener configuración por defecto para emulador
 */
export async function getRemoteConfig() {
  return {
    ssrEnabledRoutes: [
      '/combustibles/login',
      '/combustibles/movements', 
      '/combustibles/inventory',
      '/combustibles/vehicles',
      '/combustibles/dashboard'
    ],
    ssrEnabled: true,
    ssrUserSampling: 100,
    maxDataFetchTime: 800,
    enableCaching: true,
  };
}

/**
 * Invalidar cache de Remote Config (útil para testing)
 */
export function invalidateConfigCache() {
  // No-op en versión test
}
