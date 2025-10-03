/**
 * Meta tags dinámicos para SEO por ruta
 * Configuración centralizada para SSR
 * Actualizado para subdomain combustibles.forestechdecolombia.com.co
 */

export const routeMetadata = {
  // Página principal - Login
  '/': {
    title: 'Combustibles - Sistema de Gestión',
    description:
      'Sistema integral de gestión de inventario de combustibles. Acceso seguro para control de movimientos, vehículos y mantenimiento.',
    keywords: 'combustibles, gestión inventario, login, sistema',
    canonical: '/',
    robots: 'index,follow',
    type: 'website',
    ogImage: '/assets/images/og-login.webp',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Sistema Combustibles',
      description: 'Sistema de gestión de inventario de combustibles',
      url: 'https://combustibles.forestechdecolombia.com.co',
      applicationCategory: 'BusinessApplication',
    },
  },

  // Movimientos
  '/movimientos': {
    title: 'Movimientos - Control de Combustibles',
    description:
      'Registro y seguimiento de movimientos de combustibles. Control de entradas, salidas y transferencias con historial completo.',
    keywords: 'movimientos combustibles, registro, entradas, salidas, historial',
    canonical: '/movimientos',
    robots: 'noindex,nofollow',
    type: 'website',
    ogImage: '/assets/images/og-movements.webp',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Control de Movimientos',
      description: 'Sistema de registro de movimientos de combustibles',
      isPartOf: {
        '@type': 'WebApplication',
        name: 'Sistema Combustibles',
      },
    },
  },

  // Inventario
  '/inventario': {
    title: 'Inventario - Stock de Combustibles',
    description:
      'Gestión completa de inventario de combustibles. Control de stock, niveles críticos y reposición automática.',
    keywords: 'inventario combustibles, stock, control, reposición',
    canonical: '/inventario',
    robots: 'noindex,nofollow',
    type: 'website',
    ogImage: '/assets/images/og-inventory.webp',
  },

  // Vehículos
  '/vehiculos': {
    title: 'Vehículos - Gestión de Flota',
    description:
      'Control completo de la flota vehicular. Seguimiento de consumo, mantenimiento y horómetros.',
    keywords: 'vehículos, flota, consumo combustible, mantenimiento',
    canonical: '/vehiculos',
    robots: 'noindex,nofollow',
    type: 'website',
    ogImage: '/assets/images/og-vehicles.webp',
  },

  // Mantenimiento  
  '/mantenimiento': {
    title: 'Mantenimiento - Control Preventivo',
    description: 'Sistema de mantenimiento preventivo y correctivo.',
    keywords: 'mantenimiento, preventivo, horómetros',
    canonical: '/mantenimiento',
    robots: 'noindex,nofollow',
    type: 'website',
    ogImage: '/assets/images/og-maintenance.webp',
  },

  // Admin
  '/admin': {
    title: 'Administración - Configuración Sistema',
    description: 'Panel de administración para configuración avanzada del sistema de combustibles.',
    keywords: 'administración, configuración, sistema, admin',
    canonical: '/admin',
    robots: 'noindex,nofollow,noarchive,nosnippet',
    type: 'website',
  },
  
  '/administracion': {
    title: 'Administración - Configuración Sistema',
    description: 'Panel de administración para configuración avanzada del sistema de combustibles.',
    keywords: 'administración, configuración, sistema, admin',
    canonical: '/administracion',
    robots: 'noindex,nofollow,noarchive,nosnippet',
    type: 'website',
  },
};

/**
 * Obtener metadatos para una ruta específica
 * @param {string} route - Ruta actual
 * @param {Object} dynamicData - Datos dinámicos para enriquecer metadatos
 * @returns {Object} Metadatos completos para la ruta
 */
export function getRouteMetadata(route, dynamicData = {}) {
  // Normalizar ruta
  const normalizedRoute = route.endsWith('/') && route !== '/' ? route.slice(0, -1) : route;

  // Buscar metadatos exactos o usar fallback
  let metadata = routeMetadata[normalizedRoute] || routeMetadata['/'];

  // Enriquecer con datos dinámicos
  if (dynamicData) {
    metadata = enhanceMetadataWithDynamicData(metadata, dynamicData, normalizedRoute);
  }

  // Añadir metadatos por defecto
  return {
    ...metadata,
    siteName: 'Forestech - Sistema Combustibles',
    locale: 'es_CO',
    author: 'Forestech Development Team',
    viewport: 'width=device-width, initial-scale=1.0',
    charset: 'UTF-8',
    themeColor: '#2563eb',
    // Metadatos técnicos
    generator: 'Forestech SSR v3.0',
    lastModified: new Date().toISOString().split('T')[0],
  };
}

/**
 * Enriquecer metadatos con datos dinámicos específicos de la ruta
 * @param {Object} baseMetadata - Metadatos base
 * @param {Object} dynamicData - Datos dinámicos
 * @param {string} route - Ruta actual
 * @returns {Object} Metadatos enriquecidos
 */
function enhanceMetadataWithDynamicData(baseMetadata, dynamicData, route) {
  const enhanced = { ...baseMetadata };

  // Movements: agregar stats de movimientos
  if (route === '/movimientos' && dynamicData.movementsStats) {
    const stats = dynamicData.movementsStats;
    enhanced.description = `${enhanced.description} Total registros: ${stats.total || 0}, Movimientos hoy: ${stats.today || 0}.`;

    if (stats.total > 0) {
      enhanced.structuredData = {
        ...enhanced.structuredData,
        mainEntity: {
          '@type': 'DataSet',
          name: 'Registro de Movimientos',
          description: `${stats.total} movimientos registrados`,
          dateModified: new Date().toISOString(),
        },
      };
    }
  }

  // Inventory: agregar info de stock
  if (route === '/inventario' && dynamicData.inventoryStats) {
    const stats = dynamicData.inventoryStats;
    enhanced.description = `${enhanced.description} Productos activos: ${stats.activeProducts || 0}, Stock total: ${stats.totalStock || 0} L.`;
  }

  // Vehicles: agregar info de flota
  if (route === '/vehiculos' && dynamicData.vehiclesStats) {
    const stats = dynamicData.vehiclesStats;
    enhanced.description = `${enhanced.description} Vehículos registrados: ${stats.totalVehicles || 0}, Categorías: ${stats.categories || 0}.`;
  }

  // Dashboard: personalizar con datos del usuario
  if (route === '/dashboard' && dynamicData.userStats) {
    const stats = dynamicData.userStats;
    enhanced.title = `Dashboard - ${stats.userName || 'Usuario'}`;
    enhanced.description = `Panel personalizado con métricas de ${stats.userName || 'usuario'}. ${enhanced.description}`;
  }

  return enhanced;
}

/**
 * Generar JSON-LD para datos estructurados
 * @param {Object} metadata - Metadatos de la ruta
 * @returns {string} JSON-LD string
 */
export function generateStructuredData(metadata) {
  if (!metadata.structuredData) return '';

  try {
    return JSON.stringify(metadata.structuredData, null, 0);
  } catch (error) {
    console.warn('Error generating structured data:', error);
    return '';
  }
}

/**
 * Validar y sanitizar metadatos antes de renderizar
 * @param {Object} metadata - Metadatos a validar
 * @returns {Object} Metadatos validados
 */
export function validateMetadata(metadata) {
  const sanitized = { ...metadata };

  // Límites de longitud para SEO
  const limits = {
    title: 60,
    description: 160,
    keywords: 255,
  };

  Object.keys(limits).forEach((key) => {
    if (sanitized[key] && sanitized[key].length > limits[key]) {
      sanitized[key] = sanitized[key].substring(0, limits[key] - 3) + '...';
      console.warn(`Metadata ${key} truncated for SEO optimization`);
    }
  });

  // Validar URLs
  if (
    sanitized.ogImage &&
    !sanitized.ogImage.startsWith('/') &&
    !sanitized.ogImage.startsWith('http')
  ) {
    delete sanitized.ogImage;
  }

  return sanitized;
}
