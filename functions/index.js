import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { ssrHandler, healthHandler } from './ssr/server.js';
import { sitemapHandler, robotsHandler } from './ssr/sitemap.js';
import { ensureEnv } from './ssr/env.js';

ensureEnv();

const app = express();

// SEO endpoints - sitemap y robots.txt
app.get('/sitemap.xml', sitemapHandler);
app.get('/sitemap-combustibles.xml', sitemapHandler);
app.get('/sitemap-index.xml', sitemapHandler);
app.get('/robots.txt', robotsHandler);

// Health endpoint para validar emulador/deploy
app.get('/combustibles/ssr-health', healthHandler);

// SSR handler para todas las rutas de combustibles
app.get('/combustibles/*', ssrHandler);

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
