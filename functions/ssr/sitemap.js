/**
 * Generador de sitemap.xml dinámico para SEO
 * Compatible con Firebase Hosting + Functions SSR
 * Actualizado para combustibles.forestechdecolombia.com.co
 */

/**
 * Rutas públicas incluidas en sitemap
 */
const PUBLIC_ROUTES = [
  {
    url: '/',
    priority: 1.0,
    changefreq: 'daily',
    lastmod: null // Se calculará dinámicamente
  },
  {
    url: '/movimientos',
    priority: 0.8,
    changefreq: 'daily',
    lastmod: null
  },
  {
    url: '/inventario',
    priority: 0.8,
    changefreq: 'daily',
    lastmod: null
  },
  {
    url: '/vehiculos',
    priority: 0.7,
    changefreq: 'weekly',
    lastmod: null
  },
  {
    url: '/mantenimiento',
    priority: 0.6,
    changefreq: 'weekly',
    lastmod: null
  },
  {
    url: '/productos',
    priority: 0.6,
    changefreq: 'weekly',
    lastmod: null
  },
  {
    url: '/proveedores',
    priority: 0.6,
    changefreq: 'weekly',
    lastmod: null
  },
  {
    url: '/reportes',
    priority: 0.5,
    changefreq: 'weekly',
    lastmod: null
  }
];

/**
 * Rutas privadas para usuarios autenticados
 * No se incluyen en sitemap público por seguridad
 * Actualizadas con rutas reales de React Router
 */
const PRIVATE_ROUTES = [
  '/movimientos',
  '/inventario',
  '/vehiculos',
  '/mantenimiento',
  '/productos',
  '/proveedores',
  '/reportes',
  '/admin'
];

/**
 * Generar sitemap.xml completo
 * @param {Object} options - Opciones de configuración
 * @param {string} options.baseUrl - URL base del sitio
 * @param {boolean} options.includePrivate - Incluir rutas privadas (false por defecto)
 * @param {Array} options.dynamicRoutes - Rutas dinámicas adicionales
 * @returns {string} - XML del sitemap
 */
export function generateSitemap(options = {}) {
  const {
    baseUrl = 'https://combustibles.forestechdecolombia.com.co',
    includePrivate = false,
    dynamicRoutes = []
  } = options;

  const now = new Date().toISOString();
  
  // Combinar rutas estáticas
  let routes = [...PUBLIC_ROUTES];
  
  // Agregar rutas privadas si es necesario (para sitemap interno)
  if (includePrivate) {
    const privateRouteObjects = PRIVATE_ROUTES.map(url => ({
      url,
      priority: 0.6,
      changefreq: 'daily',
      lastmod: now
    }));
    routes = routes.concat(privateRouteObjects);
  }
  
  // Agregar rutas dinámicas
  routes = routes.concat(dynamicRoutes);

  // Generar XML
  const urlEntries = routes.map(route => {
    const lastmod = route.lastmod || now;
    return `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * Generar sitemap index si hay múltiples sitemaps
 * @param {string} baseUrl - URL base
 * @returns {string} - XML del sitemap index
 */
export function generateSitemapIndex(baseUrl = 'https://combustibles.forestechdecolombia.com.co') {
  const now = new Date().toISOString();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-combustibles.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;
}

/**
 * Handler HTTP para servir sitemap.xml desde Functions
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export function sitemapHandler(req, res) {
  try {
    res.set({
      'Content-Type': 'application/xml',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow'
    });

    const inactiveXml = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- Sitemap deshabilitado temporalmente: app en reconstrucción -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>`;
    res.status(410).send(inactiveXml);
    console.info(`Sitemap disabled response for ${req.path}`);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Sitemap generation failed');
  }
}

/**
 * Generar rutas dinámicas específicas de combustibles
 * En implementación real, esto consultaría la base de datos
 * @returns {Array} - Array de objetos de ruta
 */
function generateDynamicCombustiblesRoutes() {
  // Por ahora retornamos rutas estáticas
  // En el futuro, esto podría incluir:
  // - Páginas de categorías de vehículos públicas
  // - Documentación de API pública
  // - Páginas de estado del sistema (si son públicas)
  
  const routes = [];
  
  return routes;
}

/**
 * Validar y sanitizar URLs para el sitemap
 * @param {string} url - URL a validar
 * @param {string} baseUrl - URL base
 * @returns {boolean} - true si la URL es válida
 */
export function isValidSitemapUrl(url, baseUrl) {
  try {
    const fullUrl = new URL(url, baseUrl);
    
    // Verificar que sea HTTP/HTTPS
    if (!['http:', 'https:'].includes(fullUrl.protocol)) {
      return false;
    }
    
    // Verificar que el hostname coincida
    const baseHost = new URL(baseUrl).hostname;
    if (fullUrl.hostname !== baseHost) {
      return false;
    }
    
    // Verificar que no contenga caracteres problemáticos
    if (url.includes('<') || url.includes('>') || url.includes('"')) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Generar robots.txt que referencia el sitemap
 * @param {string} baseUrl - URL base
 * @returns {string} - Contenido del robots.txt
 */
export function generateRobotsTxt(baseUrl = 'https://combustibles.forestechdecolombia.com.co') {
  return `# Robots.txt para Forestech - Sistema Combustibles
# Modo mantenimiento activo: bloquear indexación temporal
# Dominio: ${baseUrl}

User-agent: *
Disallow: /

# Sitemap temporal sin rutas activas
Sitemap: ${baseUrl}/sitemap.xml
`;
}

/**
 * Handler para servir robots.txt
 * @param {Object} req - Request object  
 * @param {Object} res - Response object
 */
export function robotsHandler(req, res) {
  try {
    // Usar siempre el dominio correcto
    const baseUrl = 'https://combustibles.forestechdecolombia.com.co';
    const robotsTxt = generateRobotsTxt(baseUrl);
    
    res.set({
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow'
    });
    
    res.status(200).send(robotsTxt);
    
    console.info(`Robots.txt served | Size: ${robotsTxt.length} bytes`);
    
  } catch (error) {
    console.error('Robots.txt generation error:', error);
    res.status(500).send('# Robots.txt generation failed\nUser-agent: *\nDisallow: /');
  }
}