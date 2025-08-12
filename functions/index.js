import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { ssrHandler, healthHandler } from './ssr/server.js';
import { sitemapHandler, robotsHandler } from './ssr/sitemap.js';
import { abTestingHandler } from './ssr/ab-testing-phase1.js';
import { errorStatsHandler } from './ssr/error-handler-advanced.js';
import { applyErrorMiddlewares } from './ssr/error-middleware.js';
import { reportingHandler } from './ssr/reporting-system.js';
import { alertsHandler, startAlertingSystem } from './ssr/alerting-system.js';
import { performanceOptimizationHandler } from './ssr/performance-optimization.js';
import { coverageMonitoringHandler } from './ssr/coverage-monitoring.js';
import { seoValidationHandler } from './ssr/seo-endpoint.js';
import { ensureEnv } from './ssr/env.js';

ensureEnv();

// Inicializar sistema de alertas automáticas - Fase 4
if (process.env.NODE_ENV === 'production') {
  startAlertingSystem();
  console.info('SSR Alerting System initialized for production');
}

const app = express();

// Aplicar middlewares de error handling avanzado - Fase 4
applyErrorMiddlewares(app, {
  timeout: 5000, // 5 segundos timeout
  rateLimit: 60, // 60 requests por minuto
  validRoutes: [
    '/combustibles/*', 
    '/movement-wizard-popup', 
    '/vehicle-wizard-popup',
    '/sitemap*', 
    '/robots.txt',
    '/test-robots-hosting',
    '/health', 
    '/ab-testing', 
    '/error-stats', 
    '/ssr-reports', 
    '/ssr-alerts', 
    '/ssr-optimization', 
    '/ssr-coverage', 
    '/seo-validation'
  ],
  enableLogging: process.env.NODE_ENV !== 'test' // Disable en tests
});

// SEO endpoints - sitemap y robots.txt
app.get('/sitemap.xml', sitemapHandler);
app.get('/sitemap-combustibles.xml', sitemapHandler);
app.get('/sitemap-index.xml', sitemapHandler);
app.get('/robots.txt', (req, res) => {
  console.log('🤖 ROBOTS.TXT REQUEST RECEIVED:', req.path);
  return robotsHandler(req, res);
});

// Ruta temporal para debug hosting
app.get('/test-robots-hosting', (req, res) => {
  console.log('🏠 TEST ROBOTS HOSTING REQUEST:', req.path);
  return robotsHandler(req, res);
});

// SSR handler para todas las rutas de combustibles (incluye health check)
app.get('/combustibles/*', ssrHandler);

// Health endpoint simple para validar deploy
app.get('/health', healthHandler);

// A/B Testing control endpoint (desarrollo)
app.get('/ab-testing', abTestingHandler);

// Error statistics endpoint (monitoreo)
app.get('/error-stats', errorStatsHandler);

// SSR Reports endpoint - Fase 4 (sistema de reportes avanzado)
app.get('/ssr-reports', reportingHandler);
app.post('/ssr-reports', reportingHandler);

// SSR Alerts endpoint - Fase 4 (sistema de alertas automáticas)
app.get('/ssr-alerts', alertsHandler);
app.post('/ssr-alerts', alertsHandler);

// SSR Performance Optimization endpoint - Fase 4 (optimización de performance)
app.get('/ssr-optimization', performanceOptimizationHandler);
app.post('/ssr-optimization', performanceOptimizationHandler);

// SSR Coverage Monitoring endpoint - Fase 4 (monitoreo de cobertura 45%)
app.get('/ssr-coverage', coverageMonitoringHandler);
app.post('/ssr-coverage', coverageMonitoringHandler);

// SEO Validation endpoint - Validación y monitoreo SEO
app.get('/seo-validation', seoValidationHandler);
app.post('/seo-validation', seoValidationHandler);

export const ssrCombustibles = onRequest(
  {
    region: process.env.FIREBASE_DEFAULT_REGION || 'us-central1',
    timeoutSeconds: 60,
    memory: '512MiB',
    maxInstances: 10,
    concurrency: 80,
  },
  app
);
