/**
 * authCookies.js - Utilidad para sincronizar auth state con cookies para SSR
 * Establece cookies cuando el usuario se autentica para que SSR pueda leer el estado
 */

/**
 * Establecer cookie de autenticación para SSR
 * @param {Object} user - Usuario autenticado de Firebase
 */
export const setAuthCookie = async (user) => {
  if (!user) {
    clearAuthCookie();
    return;
  }

  try {
    // Obtener ID token del usuario
    const idToken = await user.getIdToken();

    // Establecer cookie con el token
    // Usar '__session' que es el estándar de Firebase Hosting
    document.cookie = `__session=${idToken}; path=/; max-age=3600; secure; samesite=strict`;

    console.log('🍪 Auth cookie establecida para SSR');
  } catch (error) {
    console.error('Error estableciendo auth cookie:', error);
  }
};

/**
 * Limpiar cookie de autenticación
 */
export const clearAuthCookie = () => {
  document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  console.log('🧹 Auth cookie limpiada');
};

/**
 * Actualizar cookie de autenticación (para refresh de tokens)
 * @param {Object} user - Usuario autenticado de Firebase
 */
export const refreshAuthCookie = async (user) => {
  if (!user) return;

  try {
    // Forzar refresh del token
    const idToken = await user.getIdToken(true);

    // Actualizar cookie
    document.cookie = `__session=${idToken}; path=/; max-age=3600; secure; samesite=strict`;

    console.log('🔄 Auth cookie actualizada');
  } catch (error) {
    console.error('Error actualizando auth cookie:', error);
  }
};

/**
 * Configurar refresh automático de cookies (cada 50 minutos)
 * @param {Object} user - Usuario autenticado de Firebase
 * @returns {Function} Función de cleanup
 */
export const setupCookieRefresh = (user) => {
  if (!user) return () => {};

  // Refresh cada 50 minutos (antes de que expire el token de 1 hora)
  const refreshInterval = setInterval(
    async () => {
      try {
        await refreshAuthCookie(user);
      } catch (error) {
        console.error('Error en refresh automático de cookie:', error);
      }
    },
    50 * 60 * 1000
  ); // 50 minutos

  // Función de cleanup
  return () => {
    clearInterval(refreshInterval);
    console.log('🧹 Cookie refresh automático desactivado');
  };
};
