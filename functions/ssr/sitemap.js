/**
 * Generador de sitemap.xml dinámico para SEO
 * Compatible con Firebase Hosting + Functions SSR
 */

/**
 * Rutas públicas incluidas en sitemap
 */
const PUBLIC_ROUTES = [
  {
    url: '/combustibles/',
    priority: 0.9,
    changefreq: 'daily',
    lastmod: null // Se calculará dinámicamente
  }
];

/**
 * Rutas privadas para usuarios autenticados
 * No se incluyen en sitemap público por seguridad
 * Actualizadas con rutas reales de React Router
 */
const PRIVATE_ROUTES = [
  '/combustibles/movimientos',
  '/combustibles/inventario', 
  '/combustibles/vehiculos',
  '/combustibles/mantenimiento',
  '/combustibles/productos',
  '/combustibles/proveedores',
  '/combustibles/reportes',
  '/combustibles/admin'
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
    baseUrl = 'https://forestech.web.app',
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
export function generateSitemapIndex(baseUrl = 'https://forestech.web.app') {
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
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Detectar tipo de sitemap solicitado
    const path = req.path;
    let xml;
    
    if (path === '/sitemap.xml') {
      xml = generateSitemap({ baseUrl });
    } else if (path === '/sitemap-combustibles.xml') {
      // Sitemap específico de combustibles con más detalle
      const dynamicRoutes = generateDynamicCombustiblesRoutes();
      xml = generateSitemap({ 
        baseUrl, 
        includePrivate: false, // Mantener privacidad
        dynamicRoutes 
      });
    } else if (path === '/sitemap-index.xml') {
      xml = generateSitemapIndex(baseUrl);
    } else {
      res.status(404).send('Sitemap not found');
      return;
    }

    res.set({
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache 1 hora
      'X-Robots-Tag': 'noindex' // El sitemap en sí no debe indexarse
    });
    
    res.status(200).send(xml);
    
    console.info(`Sitemap served: ${path} | Size: ${xml.length} bytes`);
    
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
  
  // Ejemplo: Si tuviéramos páginas públicas de estadísticas
  const publicStatsRoutes = [
    {
      url: '/combustibles/public/stats',
      priority: 0.5,
      changefreq: 'weekly',
      lastmod: new Date().toISOString()
    }
  ];
  
  // Solo agregar si las rutas realmente existen
  // routes.push(...publicStatsRoutes);
  
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
export function generateRobotsTxt(baseUrl = 'https://forestech.web.app') {
  return `# Robots.txt para Forestech - Sistema Combustibles
# Generado automáticamente - Fase 3 SSR

User-agent: *

# Permitir acceso a páginas públicas
Allow: /combustibles/$

# Bloquear rutas privadas y de administración (rutas reales de React Router)
Disallow: /combustibles/movimientos
Disallow: /combustibles/inventario
Disallow: /combustibles/vehiculos
Disallow: /combustibles/mantenimiento
Disallow: /combustibles/productos
Disallow: /combustibles/proveedores
Disallow: /combustibles/reportes
Disallow: /combustibles/admin
Disallow: /combustibles/api/

# Bloquear archivos y directorios técnicos
Disallow: /combustibles/assets/
Disallow: /combustibles/src/
Disallow: /combustibles/*.json
Disallow: /combustibles/*.js
Disallow: /combustibles/*.css
Disallow: /combustibles/*.map

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-combustibles.xml

# Crawl delay para ser respetuosos
Crawl-delay: 1

# User agents específicos
User-agent: Googlebot
Allow: /combustibles/$
Crawl-delay: 0

User-agent: Bingbot
Allow: /combustibles/$
Crawl-delay: 2
`;
}

/**
 * Handler para servir robots.txt
 * @param {Object} req - Request object  
 * @param {Object} res - Response object
 */
export function robotsHandler(req, res) {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const robotsTxt = generateRobotsTxt(baseUrl);
    
    res.set({
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400' // Cache 24 horas
    });
    
    res.status(200).send(robotsTxt);
    
    console.info(`Robots.txt served | Size: ${robotsTxt.length} bytes`);
    
  } catch (error) {
    console.error('Robots.txt generation error:', error);
    res.status(500).send('# Robots.txt generation failed\nUser-agent: *\nDisallow: /');
  }
}