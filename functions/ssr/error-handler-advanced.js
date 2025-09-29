/**
 * Advanced Error Handling System - Phase 4
 * Sistema robusto de manejo de errores con categorización inteligente
 */

// Categorías de errores con handling específico
const ERROR_CATEGORIES = {
  TIMEOUT: {
    description: 'Request timeouts and slow responses',
    severity: 'warning',
    autoRetry: true,
    fallback: 'csr_immediate',
    keywords: ['timeout', 'ETIMEDOUT', 'REQUEST_TIMEOUT']
  },
  
  AUTH: {
    description: 'Authentication and authorization errors',
    severity: 'error',
    autoRetry: false,
    fallback: 'login_redirect',
    keywords: ['auth', 'unauthorized', 'forbidden', 'token', 'permission']
  },
  
  DATA_FETCH: {
    description: 'Data fetching and database errors',
    severity: 'warning',
    autoRetry: true,
    fallback: 'cached_data',
    keywords: ['firebase', 'database', 'collection', 'document', 'query']
  },
  
  RENDER: {
    description: 'Server-side rendering errors',
    severity: 'error',
    autoRetry: false,
    fallback: 'csr_fallback',
    keywords: ['render', 'component', 'createElement', 'props', 'jsx']
  },
  
  CACHE: {
    description: 'Caching system errors',
    severity: 'info',
    autoRetry: true,
    fallback: 'skip_cache',
    keywords: ['cache', 'memoryCache', 'redis', 'ttl', 'invalidate']
  },
  
  NETWORK: {
    description: 'Network and connectivity errors',
    severity: 'warning',
    autoRetry: true,
    fallback: 'csr_immediate',
    keywords: ['network', 'connection', 'ECONNRESET', 'ENOTFOUND', 'dns']
  },
  
  VALIDATION: {
    description: 'Input validation and schema errors',
    severity: 'error',
    autoRetry: false,
    fallback: 'error_page',
    keywords: ['validation', 'schema', 'required', 'invalid', 'format']
  },
  
  SYSTEM: {
    description: 'System resource and infrastructure errors',
    severity: 'critical',
    autoRetry: false,
    fallback: 'maintenance_mode',
    keywords: ['memory', 'cpu', 'disk', 'resource', 'limit', 'quota']
  },
  
  UNKNOWN: {
    description: 'Unclassified errors',
    severity: 'error',
    autoRetry: false,
    fallback: 'generic_fallback',
    keywords: []
  }
};

// Error codes específicos de la aplicación
const APP_ERROR_CODES = {
  'SSR001': { category: 'TIMEOUT', description: 'SSR rendering timeout' },
  'SSR002': { category: 'RENDER', description: 'Component rendering failed' },
  'AUTH001': { category: 'AUTH', description: 'Invalid authentication token' },
  'AUTH002': { category: 'AUTH', description: 'User not authorized for route' },
  'DATA001': { category: 'DATA_FETCH', description: 'Database query failed' },
  'DATA002': { category: 'DATA_FETCH', description: 'Collection not found' },
  'CACHE001': { category: 'CACHE', description: 'Cache write failed' },
  'CACHE002': { category: 'CACHE', description: 'Cache corruption detected' },
  'NET001': { category: 'NETWORK', description: 'External API timeout' },
  'NET002': { category: 'NETWORK', description: 'DNS resolution failed' },
  'SYS001': { category: 'SYSTEM', description: 'Memory limit exceeded' },
  'SYS002': { category: 'SYSTEM', description: 'CPU threshold exceeded' }
};

// Configuración de retry con backoff exponencial
const RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelay: 100, // ms
  maxDelay: 2000, // ms
  backoffMultiplier: 2,
  jitter: true
};

// Storage de errores para análisis de patrones
const errorMetrics = new Map();
const errorPatterns = new Map();

/**
 * Clase principal para manejo de errores SSR
 */
export class SSRError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'SSRError';
    this.code = options.code || 'UNKNOWN';
    this.category = options.category || this.categorizeError(message);
    this.severity = options.severity || ERROR_CATEGORIES[this.category]?.severity || 'error';
    this.route = options.route;
    this.user = options.user;
    this.context = options.context || {};
    this.timestamp = new Date().toISOString();
    this.retryable = options.retryable ?? ERROR_CATEGORIES[this.category]?.autoRetry ?? false;
    this.fallbackStrategy = options.fallbackStrategy || ERROR_CATEGORIES[this.category]?.fallback || 'generic_fallback';
    
    // Stack trace analysis
    this.stackAnalysis = this.analyzeStack();
  }
  
  /**
   * Categorizar error automáticamente
   */
  categorizeError(message) {
    const lowerMessage = message.toLowerCase();
    
    // Buscar por código de error específico
    const errorCode = Object.keys(APP_ERROR_CODES).find(code => 
      message.includes(code)
    );
    if (errorCode) {
      return APP_ERROR_CODES[errorCode].category;
    }
    
    // Buscar por keywords
    for (const [category, config] of Object.entries(ERROR_CATEGORIES)) {
      if (config.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return category;
      }
    }
    
    return 'UNKNOWN';
  }
  
  /**
   * Analizar stack trace para información adicional
   */
  analyzeStack() {
    if (!this.stack) return null;
    
    const stackLines = this.stack.split('\n').slice(1, 6); // Top 5 stack frames
    const analysis = {
      sourceFiles: [],
      functions: [],
      lineNumbers: [],
      isInternalError: false
    };
    
    stackLines.forEach(line => {
      // Extract function name
      const funcMatch = line.match(/at\s+([^(]+)/);
      if (funcMatch) {
        analysis.functions.push(funcMatch[1].trim());
      }
      
      // Extract file path and line number
      const fileMatch = line.match(/\(([^:]+):(\d+):\d+\)/);
      if (fileMatch) {
        analysis.sourceFiles.push(fileMatch[1]);
        analysis.lineNumbers.push(parseInt(fileMatch[2]));
        
        // Check if error is in our SSR code
        if (fileMatch[1].includes('/ssr/')) {
          analysis.isInternalError = true;
        }
      }
    });
    
    return analysis;
  }
  
  /**
   * Convertir a objeto serializable para logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      category: this.category,
      severity: this.severity,
      route: this.route,
      user: this.user ? {
        id: this.user.uid?.substring(0, 8) + '...' || 'anonymous',
        authenticated: !!this.user.uid
      } : null,
      context: this.context,
      timestamp: this.timestamp,
      retryable: this.retryable,
      fallbackStrategy: this.fallbackStrategy,
      stackAnalysis: this.stackAnalysis
    };
  }
}

/**
 * Manejador principal de errores SSR
 */
export async function handleSSRError(error, req, res, options = {}) {
  const ssrError = error instanceof SSRError ? error : new SSRError(error.message, {
    code: error.code,
    route: req.path,
    user: req.user,
    context: {
      userAgent: req.get('User-Agent')?.substring(0, 100),
      ip: anonymizeIP(req.ip),
      method: req.method,
      query: Object.keys(req.query || {}).length > 0 ? req.query : undefined
    }
  });
  
  // Registrar error para análisis
  await recordError(ssrError, req);
  
  // Verificar si necesita retry
  const retryResult = await handleRetry(ssrError, req, options);
  if (retryResult.shouldRetry) {
    return retryResult;
  }
  
  // Ejecutar fallback strategy
  const fallbackResult = await executeFallbackStrategy(ssrError, req, res);
  
  // Log error estructurado
  logStructuredError(ssrError, fallbackResult);
  
  // Verificar patrones de error para alertas
  await checkErrorPatterns(ssrError);
  
  return fallbackResult;
}

/**
 * Registrar error para análisis de patrones
 */
async function recordError(ssrError, req) {
  const errorKey = `${ssrError.route}_${Date.now()}`;
  
  errorMetrics.set(errorKey, {
    ...ssrError.toJSON(),
    requestId: req.id || generateRequestId(),
    sessionId: req.sessionId || 'unknown'
  });
  
  // Mantener solo los últimos 1000 errores
  if (errorMetrics.size > 1000) {
    const oldestKey = errorMetrics.keys().next().value;
    errorMetrics.delete(oldestKey);
  }
  
  // Actualizar patrones de error
  await updateErrorPatterns(ssrError);
}

/**
 * Actualizar patrones de error para detección temprana
 */
async function updateErrorPatterns(ssrError) {
  const patternKey = `${ssrError.route}_${ssrError.category}`;
  const timeWindow = 5 * 60 * 1000; // 5 minutos
  const now = Date.now();
  
  if (!errorPatterns.has(patternKey)) {
    errorPatterns.set(patternKey, {
      occurrences: [],
      firstSeen: now,
      lastSeen: now,
      count: 0
    });
  }
  
  const pattern = errorPatterns.get(patternKey);
  pattern.occurrences.push(now);
  pattern.lastSeen = now;
  pattern.count++;
  
  // Mantener solo occurrencias recientes
  pattern.occurrences = pattern.occurrences.filter(timestamp => 
    now - timestamp < timeWindow
  );
  
  errorPatterns.set(patternKey, pattern);
}

/**
 * Manejar retry con backoff exponencial
 */
async function handleRetry(ssrError, req, options) {
  if (!ssrError.retryable || options.noRetry) {
    return { shouldRetry: false };
  }
  
  const attemptCount = options.attemptCount || 0;
  
  if (attemptCount >= RETRY_CONFIG.maxAttempts) {
    return { shouldRetry: false, reason: 'max_attempts_exceeded' };
  }
  
  // Calcular delay con backoff exponencial y jitter
  let delay = Math.min(
    RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffMultiplier, attemptCount),
    RETRY_CONFIG.maxDelay
  );
  
  if (RETRY_CONFIG.jitter) {
    delay = delay * (0.5 + Math.random() * 0.5); // Add 50% jitter
  }
  
  console.warn('SSR_RETRY:', JSON.stringify({
    error: ssrError.code,
    route: ssrError.route,
    attempt: attemptCount + 1,
    delay: Math.round(delay),
    timestamp: new Date().toISOString()
  }));
  
  // Wait for retry delay
  await new Promise(resolve => setTimeout(resolve, delay));
  
  return { 
    shouldRetry: true, 
    delay,
    nextAttemptCount: attemptCount + 1
  };
}

/**
 * Ejecutar estrategia de fallback
 */
async function executeFallbackStrategy(ssrError, req, res) {
  const strategy = ssrError.fallbackStrategy;
  const route = ssrError.route;
  
  console.info('SSR_FALLBACK:', JSON.stringify({
    strategy,
    route,
    error: ssrError.code,
    category: ssrError.category,
    timestamp: new Date().toISOString()
  }));
  
  switch (strategy) {
    case 'csr_immediate':
      return sendCSRFallback(res, {
        reason: 'ssr_error_csr_fallback',
        errorCode: ssrError.code,
        fallbackType: 'immediate'
      });
      
    case 'csr_fallback':
      return sendCSRFallback(res, {
        reason: 'ssr_error_render_failed',
        errorCode: ssrError.code,
        fallbackType: 'standard'
      });
      
    case 'cached_data': {
      const cachedResult = await tryFallbackToCache(route, req.user);
      if (cachedResult) {
        return sendSSRResponse(res, cachedResult, {
          fallback: true,
          cacheHit: true,
          errorCode: ssrError.code
        });
      }
      return sendCSRFallback(res, {
        reason: 'no_cached_data_available',
        errorCode: ssrError.code
      });
    }
      
    case 'login_redirect':
      return sendLoginRedirect(res, {
        originalUrl: req.originalUrl,
        reason: 'authentication_required',
        errorCode: ssrError.code
      });
      
    case 'error_page':
      return sendErrorPage(res, ssrError);
      
    case 'maintenance_mode':
      return sendMaintenanceMode(res, ssrError);
      
    case 'skip_cache':
      // Try again without cache
      return sendCSRFallback(res, {
        reason: 'cache_error_skip',
        errorCode: ssrError.code,
        skipCache: true
      });
      
    default:
      return sendGenericFallback(res, ssrError);
  }
}

/**
 * Enviar fallback CSR
 */
function sendCSRFallback(res, metadata) {
  const html = generateCSRFallbackHTML(metadata);
  
  res.status(200)
     .set('Content-Type', 'text/html')
     .set('X-SSR-Fallback', 'CSR')
     .set('X-Fallback-Reason', metadata.reason)
     .send(html);
  
  return {
    type: 'csr_fallback',
    success: true,
    metadata
  };
}

/**
 * Enviar respuesta SSR
 */
function sendSSRResponse(res, data, metadata) {
  res.status(200)
     .set('Content-Type', 'text/html')
     .set('X-SSR-Fallback', metadata.fallback ? 'true' : 'false')
     .send(data.html || data);
  
  return {
    type: 'ssr_response',
    success: true,
    metadata,
    data
  };
}

/**
 * Enviar página de login (HTML en lugar de redirect)
 */
async function sendLoginRedirect(res, metadata) {
  try {
    // Leer el HTML base de combustibles que contiene la página de login
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    const { fileURLToPath } = await import('node:url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const root = path.resolve(__dirname, '../');
    const filePath = path.resolve(root, 'public/combustibles/index.html');
    
    const loginHTML = await fs.readFile(filePath, 'utf8');
    
    // Modificar el HTML para incluir información de redirección
    const modifiedHTML = loginHTML.replace(
      '<head>',
      `<head>
        <meta name="redirect-after-login" content="${metadata.originalUrl || ''}" />
        <meta name="auth-required" content="true" />`
    );
    
    res.status(200)
       .set('Content-Type', 'text/html')
       .set('X-SSR-Fallback', 'LOGIN_PAGE')
       .set('Cache-Control', 'no-cache, no-store, must-revalidate')
       .send(modifiedHTML);
    
    return {
      type: 'login_redirect',
      success: true,
      metadata
    };
  } catch (error) {
    console.error('Error serving login page:', error);
    
    // Fallback a redirección si falla la lectura del archivo
    const redirectUrl = `/combustibles/?redirect=${encodeURIComponent(metadata.originalUrl)}`;
    
    res.status(302)
       .set('Location', redirectUrl)
       .set('X-SSR-Fallback', 'LOGIN_REDIRECT_FALLBACK')
       .send();
    
    return {
      type: 'login_redirect',
      success: true,
      metadata,
      fallback: true
    };
  }
}

/**
 * Enviar página de error
 */
function sendErrorPage(res, ssrError) {
  const errorPageHTML = generateErrorPageHTML(ssrError);
  
  res.status(500)
     .set('Content-Type', 'text/html')
     .set('X-SSR-Error', ssrError.code)
     .send(errorPageHTML);
  
  return {
    type: 'error_page',
    success: false,
    error: ssrError.toJSON()
  };
}

/**
 * Enviar modo mantenimiento
 */
function sendMaintenanceMode(res, ssrError) {
  const maintenanceHTML = generateMaintenanceHTML(ssrError);
  
  res.status(503)
     .set('Content-Type', 'text/html')
     .set('X-SSR-Maintenance', 'true')
     .set('Retry-After', '300') // 5 minutes
     .send(maintenanceHTML);
  
  return {
    type: 'maintenance_mode',
    success: false,
    error: ssrError.toJSON()
  };
}

/**
 * Enviar fallback genérico
 */
function sendGenericFallback(res, ssrError) {
  const fallbackHTML = generateGenericFallbackHTML(ssrError);
  
  res.status(200)
     .set('Content-Type', 'text/html')
     .set('X-SSR-Fallback', 'GENERIC')
     .send(fallbackHTML);
  
  return {
    type: 'generic_fallback',
    success: true,
    error: ssrError.toJSON()
  };
}

/**
 * Intentar fallback a cache
 */
async function tryFallbackToCache(route, user) {
  try {
    // Importar cache strategy
    const { getCachedOrFetch } = await import('./cache-strategy.js');
    
    // Intentar obtener datos desde cache (sin fetcher para forzar cache hit)
    const cachedData = await getCachedOrFetch(route, user?.uid || 'anonymous', null);
    
    return cachedData;
  } catch (error) {
    console.warn('Cache fallback failed:', error.message);
    return null;
  }
}

/**
 * Generar HTML de fallback CSR
 */
function generateCSRFallbackHTML(metadata) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Forestech - Cargando...</title>
  <style>
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      background: #f9fafb;
    }
    .loading-content {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e5e7eb;
      border-top: 4px solid #2d5a27;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loading-container">
    <div class="loading-content">
      <div class="spinner"></div>
      <h2>Cargando aplicación...</h2>
      <p>Por favor espera mientras cargamos el contenido.</p>
    </div>
  </div>
  
  <script>
    // Redirigir a la aplicación principal
    window.location.href = '/combustibles/';
  </script>
  
  <!-- Error metadata for debugging -->
  <script type="application/json" id="ssr-fallback-metadata">
    ${JSON.stringify(metadata)}
  </script>
</body>
</html>`;
}

/**
 * Generar HTML de página de error
 */
function generateErrorPageHTML(ssrError) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error - Forestech</title>
  <style>
    .error-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      background: #fef2f2;
    }
    .error-content {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: 1px solid #fecaca;
    }
    .error-icon {
      color: #dc2626;
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    .error-code {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 1rem;
    }
    .retry-btn {
      background: #2d5a27;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="error-container">
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <h2>Algo salió mal</h2>
      <p>Lo sentimos, ocurrió un error al cargar la página.</p>
      <button class="retry-btn" onclick="window.location.reload()">
        Intentar de nuevo
      </button>
      <div class="error-code">Error: ${ssrError.code}</div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generar HTML de modo mantenimiento
 */
function generateMaintenanceHTML(_ssrError) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mantenimiento - Forestech</title>
  <style>
    .maintenance-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: Arial, sans-serif;
      background: #fffbeb;
    }
    .maintenance-content {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: 1px solid #fed7aa;
    }
    .maintenance-icon {
      color: #d97706;
      font-size: 3rem;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="maintenance-container">
    <div class="maintenance-content">
      <div class="maintenance-icon">🔧</div>
      <h2>Mantenimiento programado</h2>
      <p>Estamos mejorando nuestros servidores.</p>
      <p>Intenta nuevamente en unos minutos.</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generar HTML de fallback genérico
 */
function generateGenericFallbackHTML(ssrError) {
  return generateCSRFallbackHTML({
    reason: 'generic_fallback',
    errorCode: ssrError.code,
    fallbackType: 'generic'
  });
}

/**
 * Log error estructurado
 */
function logStructuredError(ssrError, fallbackResult) {
  const logData = {
    type: 'ssr_error',
    error: ssrError.toJSON(),
    fallback: fallbackResult.type,
    success: fallbackResult.success,
    timestamp: new Date().toISOString()
  };
  
  const logLevel = ssrError.severity === 'critical' ? 'error' : 
                   ssrError.severity === 'error' ? 'error' : 'warn';
  
  console[logLevel]('SSR_ERROR:', JSON.stringify(logData));
}

/**
 * Verificar patrones de error para alertas
 */
async function checkErrorPatterns(ssrError) {
  const patternKey = `${ssrError.route}_${ssrError.category}`;
  const pattern = errorPatterns.get(patternKey);
  
  if (!pattern) return;
  
  const timeWindow = 5 * 60 * 1000; // 5 minutos
  const recentErrors = pattern.occurrences.length;
  
  // Alertar si hay muchos errores del mismo tipo en poco tiempo
  if (recentErrors >= 5) {
    await sendErrorPatternAlert({
      route: ssrError.route,
      category: ssrError.category,
      count: recentErrors,
      timeWindow: timeWindow / 1000 / 60, // en minutos
      severity: ssrError.severity,
      pattern: patternKey
    });
  }
}

/**
 * Enviar alerta de patrón de errores
 */
async function sendErrorPatternAlert(alertData) {
  console.error('ERROR_PATTERN_ALERT:', JSON.stringify({
    ...alertData,
    timestamp: new Date().toISOString()
  }));
  
  // En producción: webhook, Slack, PagerDuty, etc.
  if (process.env.ERROR_WEBHOOK_URL) {
    try {
      await fetch(process.env.ERROR_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 Error Pattern Alert: ${alertData.count} ${alertData.category} errors in ${alertData.timeWindow}min on ${alertData.route}`,
          ...alertData
        })
      });
    } catch (error) {
      console.error('Failed to send error pattern alert:', error.message);
    }
  }
}

/**
 * Obtener estadísticas de errores
 */
export function getErrorStatistics(timeWindow = 60 * 60 * 1000) {
  const cutoff = Date.now() - timeWindow;
  const recentErrors = Array.from(errorMetrics.values())
    .filter(error => new Date(error.timestamp).getTime() > cutoff);
  
  const stats = {
    totalErrors: recentErrors.length,
    byCategory: {},
    bySeverity: {},
    byRoute: {},
    byCode: {},
    patterns: Array.from(errorPatterns.entries()).map(([key, pattern]) => ({
      key,
      count: pattern.count,
      recentOccurrences: pattern.occurrences.length,
      lastSeen: new Date(pattern.lastSeen).toISOString()
    })),
    timeWindow: timeWindow / (60 * 1000), // en minutos
    timestamp: new Date().toISOString()
  };
  
  recentErrors.forEach(error => {
    // Por categoría
    stats.byCategory[error.category] = (stats.byCategory[error.category] || 0) + 1;
    
    // Por severidad
    stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
    
    // Por ruta
    stats.byRoute[error.route] = (stats.byRoute[error.route] || 0) + 1;
    
    // Por código
    stats.byCode[error.code] = (stats.byCode[error.code] || 0) + 1;
  });
  
  return stats;
}

/**
 * Limpiar métricas de error
 */
export function clearErrorMetrics() {
  errorMetrics.clear();
  errorPatterns.clear();
  return { cleared: true, timestamp: new Date().toISOString() };
}

/**
 * Anonymizar IP
 */
function anonymizeIP(ip) {
  if (!ip) return 'unknown';
  return ip.replace(/\d+$/, 'xxx');
}

/**
 * Generar ID de request único
 */
function generateRequestId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Endpoint para estadísticas de errores
 */
export function errorStatsHandler(req, res) {
  try {
    const timeWindow = parseInt(req.query.window) || 60 * 60 * 1000;
    const stats = getErrorStatistics(timeWindow);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting error statistics:', error);
    res.status(500).json({ error: 'Failed to get error statistics' });
  }
}

export default {
  SSRError,
  handleSSRError,
  getErrorStatistics,
  errorStatsHandler,
  clearErrorMetrics
};