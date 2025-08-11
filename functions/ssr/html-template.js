/**
 * Template HTML para SSR con inyección segura de initial state
 * @param {Object} options
 * @param {string} options.title - Título de la página
 * @param {string} options.description - Meta descripción
 * @param {string} options.ogImage - URL imagen Open Graph (opcional)
 * @param {Object} options.initialState - Estado inicial para hydration
 * @param {string} options.appHtml - HTML renderizado de la app
 * @param {string} options.serverTiming - Header Server-Timing
 * @returns {string} HTML completo
 */
export function createHtmlTemplate({ 
  title = 'Combustibles - Gestión de Inventario', 
  description = 'Sistema de gestión de inventario de combustibles',
  ogImage = null,
  initialState = {},
  appHtml = '',
  serverTiming = ''
}) {
  // Escapar JSON para prevenir XSS
  const escapedInitialState = JSON.stringify(initialState)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    ${ogImage ? `<meta property="og:image" content="${escapeHtml(ogImage)}" />` : ''}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${ogImage ? `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />` : ''}
    
    <!-- Preload critical resources -->
    <link rel="preload" href="/combustibles/assets/index.css" as="style" />
    
    <!-- CSS crítico inline para evitar FOUC -->
    <style>
        .loading-container { 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            height: 100vh; 
            background: #f5f5f5; 
        }
        .loader { text-align: center; }
        .spinner { 
            width: 40px; 
            height: 40px; 
            border: 4px solid #f3f3f3; 
            border-top: 4px solid #3498db; 
            border-radius: 50%; 
            animation: spin 2s linear infinite; 
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>
    <div id="root">${appHtml}</div>
    
    <!-- Initial state para hydration -->
    <script id="__INITIAL_STATE__" type="application/json">${escapedInitialState}</script>
    
    <!-- Hydration script - se cargará después del HTML -->
    <script type="module" src="/combustibles/src/entry-client-ssr.jsx"></script>
    
    <!-- Server timing para debugging -->
    ${serverTiming ? `<script>console.log('Server-Timing: ${serverTiming}');</script>` : ''}
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
