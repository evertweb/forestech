import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { ssrHandler, healthHandler } from './ssr/server.js';
import { sitemapHandler, robotsHandler } from './ssr/sitemap.js';
import { abTestingHandler } from './ssr/ab-testing-phase1.js';
import { errorStatsHandler } from './ssr/error-handler-advanced.js';
import { applyErrorMiddlewares } from './ssr/error-middleware.js';
import { ensureEnv } from './ssr/env.js';

ensureEnv();

const app = express();

// Aplicar middlewares de error handling avanzado - Fase 4
applyErrorMiddlewares(app, {
  timeout: 5000, // 5 segundos timeout
  rateLimit: 60, // 60 requests por minuto
  validRoutes: ['/combustibles/*', '/sitemap*', '/robots.txt', '/health', '/ab-testing', '/error-stats'],
  enableLogging: process.env.NODE_ENV !== 'test' // Disable en tests
});

// SEO endpoints - sitemap y robots.txt
app.get('/sitemap.xml', sitemapHandler);
app.get('/sitemap-combustibles.xml', sitemapHandler);
app.get('/sitemap-index.xml', sitemapHandler);
app.get('/robots.txt', robotsHandler);

// SSR handler para todas las rutas de combustibles (incluye health check)
app.get('/combustibles/*', ssrHandler);

// Health endpoint simple para validar deploy
app.get('/health', healthHandler);

// A/B Testing control endpoint (desarrollo)
app.get('/ab-testing', abTestingHandler);

// Error statistics endpoint (monitoreo)
app.get('/error-stats', errorStatsHandler);

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
