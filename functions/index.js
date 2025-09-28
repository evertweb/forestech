// ====================================================================
// FIREBASE FUNCTIONS LIMPIEZA COMPLETA
// Solo SSR, sin funciones SQL (están en Cloud Run)
// ====================================================================

import express from 'express';
import { https } from 'firebase-functions/v1';
import { initializeApp, getApps } from 'firebase-admin/app';
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

// Inicializar Firebase Admin si no está ya inicializado
if (getApps().length === 0) {
  initializeApp();
}

ensureEnv();

// Inicializar sistema de alertas automáticas - Fase 4 (Updated)
if (process.env.NODE_ENV === 'production') {
  startAlertingSystem();
  console.info('SSR Alerting System initialized for production');
}

const app = express();

// Aplicar middlewares de error handling avanzado - Fase 4
// CONFIGURACIÓN PARA SUBDOMAIN: Permitir rutas raíz y subpath
applyErrorMiddlewares(app, {
  timeout: 5000, // 5 segundos timeout
  rateLimit: 60, // 60 requests por minuto
  validRoutes: [
    '/combustibles/*',     // Subpath: forestechdecolombia.com.co/combustibles/
    '/',                   // Root: combustibles.forestechdecolombia.com.co/
    '/*',                  // Subdomain routes: combustibles.forestechdecolombia.com.co/dashboard
    '/dashboard',          // Dashboard específico
    '/inventario',         // Inventario específico
    '/movimientos',        // Movimientos específico
    '/vehiculos',          // Vehículos específico
    '/movement-wizard-popup', 
    '/vehicle-wizard-popup',
    '/sitemap*', 
    '/robots.txt',
    '/seo-robots',
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
app.get('/robots.txt', robotsHandler);
app.get('/seo-robots', robotsHandler);
app.get('/test-robots-hosting', robotsHandler);

// SSR main handler - Fase 1 con optimizaciones hasta Fase 4
app.get('*', ssrHandler);
app.post('*', ssrHandler);

// Health check endpoint
app.get('/health', healthHandler);

// A/B Testing endpoint - Control de experimentos SSR
app.get('/ab-testing', abTestingHandler);
app.post('/ab-testing', abTestingHandler);

// Error Stats endpoint - Métricas y diagnóstico de errores SSR
app.get('/error-stats', errorStatsHandler);
app.post('/error-stats', errorStatsHandler);

// SSR Reports endpoint - Reportes y análisis de performance SSR
app.get('/ssr-reports', reportingHandler);
app.post('/ssr-reports', reportingHandler);

// SSR Alerts endpoint - Sistema de alertas y notificaciones SSR
app.get('/ssr-alerts', alertsHandler);
app.post('/ssr-alerts', alertsHandler);

// SSR Performance Optimization endpoint - Optimización automática
app.get('/ssr-optimization', performanceOptimizationHandler);
app.post('/ssr-optimization', performanceOptimizationHandler);

// SSR Coverage Monitoring endpoint - Fase 4 (monitoreo de cobertura 45%)
app.get('/ssr-coverage', coverageMonitoringHandler);
app.post('/ssr-coverage', coverageMonitoringHandler);

// SEO Validation endpoint - Validación y monitoreo SEO
app.get('/seo-validation', seoValidationHandler);
app.post('/seo-validation', seoValidationHandler);

// ====================================================================
// FUNCIONES EXPORTADAS: SSR + Funciones web esenciales (Gen 1)
// ====================================================================

// SSR Function - Principal (Gen 1)
export const ssrCombustibles = https.onRequest(app);

// ====================================================================
// FUNCIONES MÍNIMAS PARA EVITAR 404s (Gen 1 - redireccionan a Cloud Run)
// ====================================================================

// Webhook redirector - redirige a Cloud Run (Gen 1)
export const combustiblesWebhookReceiver = https.onRequest((req, res) => {
  const cloudRunURL = 'https://forestech-sql-service-851382130132.us-central1.run.app';
  
  if (req.method === 'GET') {
    res.status(200).json({
      message: 'Webhook receiver moved to Cloud Run',
      cloudRunURL: `${cloudRunURL}/webhook`,
      status: 'redirected'
    });
  } else {
    // Redirect POST/PUT/DELETE to Cloud Run
    res.status(307).json({
      message: 'Webhook moved to Cloud Run - please update your endpoint',
      newURL: `${cloudRunURL}/webhook`,
      method: req.method
    });
  }
});

// Telegram link redirector - redirige a Cloud Run (Gen 1)
export const linkTelegramAccount = https.onRequest((req, res) => {
  const cloudRunURL = 'https://forestech-sql-service-851382130132.us-central1.run.app';
  
  res.status(307).json({
    message: 'Telegram integration moved to Cloud Run',
    newURL: `${cloudRunURL}/telegram/link`,
    redirect: true
  });
});

// Passkey functions redirectors - redirigen a extensión Firebase (Gen 1)
const passkeyRedirect = (functionName) => https.onRequest((req, res) => {
  res.status(200).json({
    message: `${functionName} handled by Firebase Web Authn Extension`,
    extension: 'ext-firebase-web-authn-api',
    status: 'extension_handled'
  });
});

export const checkUserPasskeys = passkeyRedirect('checkUserPasskeys');
export const generatePasskeyToken = passkeyRedirect('generatePasskeyToken');

// Face recognition redirectors - redirigen a Cloud Run (Gen 1)
const faceRedirect = (functionName) => https.onRequest((req, res) => {
  const cloudRunURL = 'https://forestech-sql-service-851382130132.us-central1.run.app';
  
  res.status(200).json({
    message: `${functionName} moved to Cloud Run for better performance`,
    newURL: `${cloudRunURL}/face/${functionName.replace('Face', '').toLowerCase()}`,
    redirect: true
  });
});

export const loginFace = faceRedirect('loginFace');
export const registerFace = faceRedirect('registerFace');

// ====================================================================
// NOTA: Funciones SQL ELIMINADAS de Firebase Functions
// 
// ✅ TODAS las funciones SQL ahora están en Cloud Run:
// - https://forestech-sql-service-851382130132.us-central1.run.app/
// - Mejor performance, sin limitaciones de cuota
// - Conexión directa con Azure SQL
// 
// ❌ ELIMINADAS de Firebase Functions:
// - sqlCreateMovement, sqlGetAllMovements, sqlUpdateMovement, etc.
// - combustiblesWebhookReceiver (ahora en Cloud Run)
// - passkey functions (mover a Cloud Run si necesario)
//
// ✅ MANTENIDAS en Firebase Functions:
// - ssrCombustibles (SSR para subpath)
// - ssrSubdomain (SSR para subdomain) 
// - linkTelegramAccount (integración web)
// ====================================================================