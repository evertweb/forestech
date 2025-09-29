/**
 * Configuración avanzada de SEO para Forestech Colombia
 * Incluye meta tags dinámicos, Open Graph, y configuración JSON-LD
 */

export const SEO_CONFIG = {
  // Configuración base del sitio
  site: {
    name: 'Forestech Colombia',
    description: 'Sistema de gestión integral para operaciones forestales y combustibles',
    url: 'https://oilforestech.web.app',
    logo: 'https://oilforestech.web.app/assets/logo.png',
    social: {
      twitter: '@forestechcol',
      facebook: 'forestechcolombia',
      linkedin: 'company/forestech-colombia'
    }
  },

  // Configuración por aplicación
  apps: {
    combustibles: {
      title: 'Gestión de Combustibles - Forestech Colombia',
      description: 'Sistema especializado para control de inventario y movimientos de combustibles en operaciones forestales',
      keywords: ['gestión combustibles', 'inventario forestal', 'control combustible', 'logística forestal'],
      image: 'https://oilforestech.web.app/assets/combustibles-og.jpg',
      type: 'website',
      locale: 'es_CO'
    },
    alimentacion: {
      title: 'Liquidación de Alimentación - Forestech Colombia',
      description: 'Sistema de cálculos y liquidación para servicios de alimentación en operaciones forestales',
      keywords: ['liquidación alimentación', 'cálculos forestales', 'servicios alimentación'],
      image: 'https://oilforestech.web.app/assets/alimentacion-og.jpg',
      type: 'website',
      locale: 'es_CO'
    }
  },

  // Meta tags por ruta
  routes: {
    '/': {
      title: 'Forestech Colombia - Tecnología para Operaciones Forestales',
      description: 'Soluciones tecnológicas especializadas para la gestión integral de operaciones forestales en Colombia',
      keywords: ['forestech', 'tecnología forestal', 'operaciones forestales', 'colombia']
    },
    '/combustibles/': {
      title: 'Sistema de Gestión de Combustibles',
      description: 'Control completo de inventario, movimientos y reportes de combustibles para operaciones forestales',
      keywords: ['gestión combustibles', 'inventario', 'reportes', 'control operacional']
    },
    '/alimentacion/': {
      title: 'Sistema de Liquidación de Alimentación',
      description: 'Cálculos automatizados y liquidación de servicios de alimentación para trabajadores forestales',
      keywords: ['liquidación', 'alimentación', 'cálculos', 'trabajadores forestales']
    }
  }
};

/**
 * Generar meta tags para una ruta específica
 * @param {string} route - Ruta actual
 * @param {string} app - Aplicación (combustibles/alimentacion)
 * @returns {Object} - Meta tags estructurados
 */
export function generateMetaTags(route = '/', app = null) {
  const baseConfig = SEO_CONFIG.site;
  const routeConfig = SEO_CONFIG.routes[route] || SEO_CONFIG.routes['/'];
  const appConfig = app ? SEO_CONFIG.apps[app] : null;

  const title = appConfig?.title || routeConfig.title;
  const description = appConfig?.description || routeConfig.description;
  const keywords = appConfig?.keywords || routeConfig.keywords;
  const image = appConfig?.image || `${baseConfig.url}/assets/og-default.jpg`;

  return {
    // Meta tags básicos
    title,
    description,
    keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
    
    // Open Graph
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': `${baseConfig.url}${route}`,
    'og:type': appConfig?.type || 'website',
    'og:site_name': baseConfig.name,
    'og:locale': appConfig?.locale || 'es_CO',

    // Twitter Cards
    'twitter:card': 'summary_large_image',
    'twitter:site': baseConfig.social.twitter,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,

    // Meta adicionales
    'viewport': 'width=device-width, initial-scale=1.0',
    'charset': 'utf-8',
    'robots': route.includes('/admin') || route.includes('/api') ? 'noindex,nofollow' : 'index,follow',
    'canonical': `${baseConfig.url}${route}`
  };
}

/**
 * Generar JSON-LD schema para SEO estructurado
 * @param {string} route - Ruta actual
 * @param {string} app - Aplicación
 * @returns {Object} - Schema JSON-LD
 */
export function generateJsonLD(_route = '/', app = null) {
  const baseConfig = SEO_CONFIG.site;
  const appConfig = app ? SEO_CONFIG.apps[app] : null;

  // Schema base de la organización
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: baseConfig.name,
    url: baseConfig.url,
    logo: baseConfig.logo,
    description: baseConfig.description,
    sameAs: [
      `https://twitter.com/${baseConfig.social.twitter}`,
      `https://facebook.com/${baseConfig.social.facebook}`,
      `https://linkedin.com/company/${baseConfig.social.linkedin}`
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CO',
      addressLocality: 'Colombia'
    }
  };

  // Schema para aplicaciones específicas
  if (app === 'combustibles') {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: appConfig.title,
      description: appConfig.description,
      url: `${baseConfig.url}/`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'COP'
      },
      author: organizationSchema
    };
  }

  if (app === 'alimentacion') {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: appConfig.title,
      description: appConfig.description,
      url: `${baseConfig.url}/alimentacion/`,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'COP'
      },
      author: organizationSchema
    };
  }

  // Schema por defecto para página principal
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: baseConfig.name,
    url: baseConfig.url,
    description: baseConfig.description,
    publisher: organizationSchema,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };
}

/**
 * Generar meta tags como string HTML
 * @param {Object} metaTags - Meta tags object
 * @returns {string} - HTML meta tags
 */
export function generateMetaTagsHTML(metaTags) {
  let html = '';
  
  for (const [key, value] of Object.entries(metaTags)) {
    if (key === 'title') {
      html += `<title>${value}</title>\n`;
    } else if (key === 'charset') {
      html += `<meta charset="${value}">\n`;
    } else if (key.startsWith('og:') || key.startsWith('twitter:')) {
      html += `<meta property="${key}" content="${value}">\n`;
    } else if (key === 'canonical') {
      html += `<link rel="canonical" href="${value}">\n`;
    } else {
      html += `<meta name="${key}" content="${value}">\n`;
    }
  }
  
  return html;
}

/**
 * Configuración de headers de seguridad para SEO
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};
