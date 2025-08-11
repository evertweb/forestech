/**
 * Template HTML para SSR con metadatos dinámicos y SEO optimizado
 * @param {Object} options
 * @param {Object} options.metadata - Metadatos completos de la ruta
 * @param {Object} options.initialState - Estado inicial para hydration
 * @param {string} options.appHtml - HTML renderizado de la app
 * @param {string} options.serverTiming - Header Server-Timing
 * @param {string} options.currentUrl - URL actual para canonical
 * @returns {string} HTML completo
 */
export function createHtmlTemplate({ 
  metadata = {},
  initialState = {},
  appHtml = '',
  serverTiming = '',
  currentUrl = ''
}) {
  // Destructuring con defaults seguros
  const {
    title = 'Combustibles - Gestión de Inventario',
    description = 'Sistema de gestión de inventario de combustibles',
    keywords = 'combustibles, gestión, inventario',
    canonical = '',
    robots = 'index,follow',
    ogImage = null,
    siteName = 'Forestech - Sistema Combustibles',
    locale = 'es_CO',
    type = 'website',
    author = 'Forestech Development Team',
    themeColor = '#2563eb',
    structuredData = null
  } = metadata;
  // Escapar JSON para prevenir XSS
  const escapedInitialState = JSON.stringify(initialState)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  // URL completa para canonical y OG
  const fullUrl = currentUrl ? `https://forestech.web.app${currentUrl}` : '';
  const canonicalUrl = canonical ? `https://forestech.web.app${canonical}` : fullUrl;
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="${themeColor}" />
    <meta name="author" content="${escapeHtml(author)}" />
    <meta name="robots" content="${robots}" />
    ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}" />` : ''}
    
    <!-- SEO Principal -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    ${canonicalUrl ? `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />` : ''}
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="${escapeHtml(siteName)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:locale" content="${locale}" />
    ${fullUrl ? `<meta property="og:url" content="${escapeHtml(fullUrl)}" />` : ''}
    ${ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage.startsWith('/') ? `https://forestech.web.app${ogImage}` : ogImage)}" />` : ''}
    ${ogImage ? `<meta property="og:image:width" content="1200" />` : ''}
    ${ogImage ? `<meta property="og:image:height" content="630" />` : ''}
    ${ogImage ? `<meta property="og:image:type" content="image/webp" />` : ''}
    
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@forestech_co" />
    <meta name="twitter:creator" content="@forestech_co" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${ogImage ? `<meta name="twitter:image" content="${escapeHtml(ogImage.startsWith('/') ? `https://forestech.web.app${ogImage}` : ogImage)}" />` : ''}
    
    <!-- iOS Safari -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Combustibles" />
    
    <!-- Android Chrome -->
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="application-name" content="Combustibles" />
    
    <!-- Preload critical resources para mejor performance -->
    <link rel="preload" href="/combustibles/assets/index.css" as="style" />
    <link rel="preload" href="/combustibles/src/entry-client-ssr.jsx" as="script" />
    <link rel="dns-prefetch" href="//fonts.googleapis.com" />
    <link rel="dns-prefetch" href="//firebaseapp.com" />
    
    <!-- Favicon y iconos -->
    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="icon" href="/icon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.json" />
    
    <!-- CSS crítico inline para evitar FOUC y mejorar LCP -->
    <style>
        body { 
            margin: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f8fafc;
        }
        .loading-container { 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            background: #f8fafc; 
        }
        .loader { 
            text-align: center; 
            color: #475569;
        }
        .spinner { 
            width: 32px; 
            height: 32px; 
            border: 3px solid #e2e8f0; 
            border-top: 3px solid #2563eb; 
            border-radius: 50%; 
            animation: spin 1s linear infinite; 
            margin: 0 auto 16px;
        }
        @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
        }
        /* Prevenir FOUC */
        #root { min-height: 100vh; }
        .hydration-ready #root { opacity: 1; transition: opacity 0.2s; }
    </style>
    
    ${structuredData ? `<!-- JSON-LD Structured Data --><script type="application/ld+json">${JSON.stringify(structuredData)}</script>` : ''}
</head>
<body>
    <div id="root">${appHtml || '<div class="loading-container"><div class="loader"><div class="spinner"></div>Cargando aplicación...</div></div>'}</div>
    
    <!-- Initial state para hydration -->
    <script id="__INITIAL_STATE__" type="application/json">${escapedInitialState}</script>
    
    <!-- Performance mark para medición -->
    <script>
        if (typeof performance !== 'undefined') {
            performance.mark('ssr-html-ready');
        }
    </script>
    
    <!-- Hydration script - lazy load después del HTML inicial -->
    <script type="module">
        // Lazy load del bundle principal para mejor TTI
        import('/combustibles/src/entry-client-ssr.jsx').catch(err => {
            console.error('Failed to load hydration bundle:', err);
            // Fallback: reload page
            setTimeout(() => window.location.reload(), 2000);
        });
    </script>
    
    <!-- Server timing para debugging y métricas -->
    ${serverTiming ? `<script>
        if (typeof performance !== 'undefined' && performance.getEntriesByType) {
            const serverTime = '${serverTiming}';
            console.log('Server-Timing:', serverTime);
            // Enviar métrica a Analytics si está disponible
            if (typeof gtag !== 'undefined') {
                gtag('event', 'ssr_performance', {
                    'server_timing': serverTime,
                    'route': '${escapeHtml(currentUrl)}'
                });
            }
        }
    </script>` : ''}
</body>
</html>`;
}

/**
 * Escapar HTML para prevenir XSS
 * @param {string} str 
 * @returns {string}
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
