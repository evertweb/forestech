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
  // En modo test: siempre true para rutas de combustibles
  if (process.env.NODE_ENV === 'test') {
    return route.includes('/combustibles/');
  }
  
  // En modo emulador, usar configuración conservadora
  const defaultEnabledRoutes = [
    '/combustibles/',
    '/combustibles/movimientos',
    '/combustibles/inventario',
    '/combustibles/vehiculos'
  ];
  
  return defaultEnabledRoutes.some(enabledRoute => {
    // Exact match
    if (route === enabledRoute) return true;
    
    // Para la ruta raíz /combustibles/, solo permitir exacta (sin sub-rutas)
    if (enabledRoute === '/combustibles/') {
      return route === '/combustibles/' || route === '/combustibles';
    }
    
    // Para rutas específicas, permitir sub-rutas con /
    return route.startsWith(enabledRoute + '/');
  });
}

/**
 * Obtener configuración por defecto para emulador
 */
export async function getRemoteConfig() {
  return {
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
}

/**
 * Invalidar cache de Remote Config (útil para testing)
 */
export function invalidateConfigCache() {
  // No-op en versión test
}
