/**
 * Error Middleware - Fase 4
 * Middleware para interceptar y manejar errores de manera consistente
 */

import { SSRError, handleSSRError } from './error-handler-advanced.js';

/**
 * Middleware para capturar errores no manejados
 */
export function errorMiddleware(error, req, res, _next) {
  // Si ya es un SSRError, mantenerlo
  if (error instanceof SSRError) {
    return handleSSRError(error, req, res);
  }
  
  // Convertir error genérico a SSRError
  const ssrError = new SSRError(error.message, {
    code: error.code || 'MIDDLEWARE001',
    category: categorizeMiddlewareError(error),
    route: req.path,
    user: req.user,
    context: {
      originalError: error.name,
      middleware: true,
      stack: error.stack?.substring(0, 500)
    }
  });
  
  return handleSSRError(ssrError, req, res);
}

/**
 * Middleware para timeouts
 */
export function timeoutMiddleware(timeoutMs = 5000) {
  return (req, res, next) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        const timeoutError = new SSRError('Request timeout', {
          code: 'TIMEOUT001',
          category: 'TIMEOUT',
          route: req.path,
          user: req.user,
          context: {
            timeoutMs,
            middleware: 'timeout'
          }
        });
        
        handleSSRError(timeoutError, req, res);
      }
    }, timeoutMs);
    
    // Limpiar timeout si la respuesta se completa
    res.on('finish', () => clearTimeout(timeout));
    res.on('close', () => clearTimeout(timeout));
    
    next();
  };
}

/**
 * Middleware para rate limiting básico
 */
export function rateLimitMiddleware(requestsPerMinute = 60) {
  const requests = new Map();
  
  return (req, res, next) => {
    // Excluir assets estáticos del rate limiting
    if (req.path.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf|eot|json)$/i)) {
      return next();
    }
    
    // Excluir rutas de health check
    if (req.path === '/health' || req.path === '/_ah/health') {
      return next();
    }
    
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    const windowStart = now - 60000; // 1 minuto
    
    // Limpiar requests antiguos
    if (requests.has(clientId)) {
      const clientRequests = requests.get(clientId);
      const recentRequests = clientRequests.filter(time => time > windowStart);
      requests.set(clientId, recentRequests);
    } else {
      requests.set(clientId, []);
    }
    
    const clientRequestCount = requests.get(clientId).length;
    
    if (clientRequestCount >= requestsPerMinute) {
      const rateLimitError = new SSRError('Rate limit exceeded', {
        code: 'RATE001',
        category: 'VALIDATION',
        route: req.path,
        user: req.user,
        context: {
          clientId: clientId.substring(0, 10) + '...',
          requestCount: clientRequestCount,
          limit: requestsPerMinute,
          middleware: 'rateLimit'
        }
      });
      
      return handleSSRError(rateLimitError, req, res);
    }
    
    // Registrar request
    requests.get(clientId).push(now);
    next();
  };
}

/**
 * Middleware para validar rutas
 */
export function routeValidationMiddleware(validRoutes = []) {
  return (req, res, next) => {
    if (validRoutes.length === 0) {
      return next(); // Sin validación si no hay rutas especificadas
    }
    
    const isValidRoute = validRoutes.some(route => {
      if (route.endsWith('*')) {
        return req.path.startsWith(route.slice(0, -1));
      }
      return req.path === route;
    });
    
    if (!isValidRoute) {
      const validationError = new SSRError('Invalid route', {
        code: 'ROUTE001',
        category: 'VALIDATION',
        route: req.path,
        user: req.user,
        context: {
          validRoutes: validRoutes.slice(0, 5), // Solo primeras 5 para logging
          middleware: 'routeValidation'
        }
      });
      
      return handleSSRError(validationError, req, res);
    }
    
    next();
  };
}

/**
 * Middleware para logging de requests
 */
export function requestLoggingMiddleware() {
  return (req, res, next) => {
    const startTime = Date.now();
    
    // Log request inicial
    console.info('SSR_REQUEST:', JSON.stringify({
      method: req.method,
      path: req.path,
      userAgent: req.get('User-Agent')?.substring(0, 100),
      ip: anonymizeIP(req.ip),
      timestamp: new Date().toISOString()
    }));
    
    // Log response cuando termine
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      console.info('SSR_RESPONSE:', JSON.stringify({
        path: req.path,
        statusCode: res.statusCode,
        duration,
        success: res.statusCode < 400,
        timestamp: new Date().toISOString()
      }));
    });
    
    next();
  };
}

/**
 * Categorizar errores de middleware
 */
function categorizeMiddlewareError(error) {
  const message = error.message.toLowerCase();
  
  if (message.includes('timeout')) return 'TIMEOUT';
  if (message.includes('auth') || message.includes('unauthorized')) return 'AUTH';
  if (message.includes('rate') || message.includes('limit')) return 'VALIDATION';
  if (message.includes('network') || message.includes('connection')) return 'NETWORK';
  if (message.includes('memory') || message.includes('cpu')) return 'SYSTEM';
  
  return 'UNKNOWN';
}

/**
 * Anonymizar IP
 */
function anonymizeIP(ip) {
  if (!ip) return 'unknown';
  return ip.replace(/\d+$/, 'xxx');
}

/**
 * Aplicar todos los middlewares recomendados
 */
export function applyErrorMiddlewares(app, options = {}) {
  const config = {
    timeout: 5000,
    rateLimit: 200, // Aumentado de 60 a 200 para soportar popups que hacen múltiples requests
    validRoutes: [
      '/combustibles/*',
      '/movement-wizard-popup',
      '/vehicle-wizard-popup',
      '/product-wizard-popup',
      '/sitemap*',
      '/robots.txt',
      '/health',
      '/ab-testing',
      '/_ah/health' // Health check de App Engine
    ],
    enableLogging: true,
    ...options
  };
  
  // Middleware de logging (si está habilitado)
  if (config.enableLogging) {
    app.use(requestLoggingMiddleware());
  }
  
  // Middleware de timeout
  app.use(timeoutMiddleware(config.timeout));
  
  // Middleware de rate limiting
  app.use(rateLimitMiddleware(config.rateLimit));
  
  // Middleware de validación de rutas
  if (config.validRoutes.length > 0) {
    app.use(routeValidationMiddleware(config.validRoutes));
  }
  
  // Middleware de error handling (debe ir al final)
  app.use(errorMiddleware);
  
  console.info('✅ Error middlewares aplicados:', {
    timeout: config.timeout,
    rateLimit: config.rateLimit,
    routeValidation: config.validRoutes.length > 0,
    logging: config.enableLogging
  });
}

export default {
  errorMiddleware,
  timeoutMiddleware,
  rateLimitMiddleware,
  routeValidationMiddleware,
  requestLoggingMiddleware,
  applyErrorMiddlewares
};
