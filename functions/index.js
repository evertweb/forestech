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
import { combustiblesWebhookReceiver } from './webhooks/combustibles-webhooks-http.js';

ensureEnv();

// Inicializar sistema de alertas automáticas - Fase 4 (Updated)
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

// WORKAROUND: Firebase Hosting intercepta /robots.txt - usar rutas alternativas
app.get('/robots.txt', (req, res) => {
  console.log('🤖 ROBOTS.TXT REQUEST RECEIVED:', req.path);
  return robotsHandler(req, res);
});

// Ruta alternativa funcional para robots.txt
app.get('/seo-robots', (req, res) => {
  console.log('🤖 SEO-ROBOTS REQUEST RECEIVED:', req.path);
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

// Webhook endpoint para recibir movimientos desde N8N/Telegram
export { combustiblesWebhookReceiver };

// Endpoint para vincular Telegram con un usuario autenticado en la web
import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

export const linkTelegramAccount = onRequest({ cors: true, region: 'us-central1' }, async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Método no permitido' });
    }
    const { code, userId, username } = req.body || {};
    if (!code || !userId) {
      return res.status(400).json({ success: false, error: 'code y userId son requeridos' });
    }

    const docRef = db.collection('telegram_link_codes').doc(String(code));
    const snap = await docRef.get();
    if (!snap.exists) {
      return res.status(400).json({ success: false, error: 'Código inválido' });
    }
    const data = snap.data();
    if (data.used) {
      return res.status(400).json({ success: false, error: 'Código ya usado' });
    }
    if (new Date(data.expiresAt).getTime() < Date.now()) {
      return res.status(400).json({ success: false, error: 'Código expirado' });
    }

    // Guardar vínculo en perfil del usuario
    await db.collection('users').doc(String(userId)).set({
      telegram: {
        chatId: data.chatId,
        userId: data.telegram?.userId || null,
        username: data.telegram?.username || null,
        linkedAt: new Date().toISOString(),
      }
    }, { merge: true });

    await docRef.set({ used: true }, { merge: true });

    // Notificar por Telegram al chat vinculado (si hay token configurado)
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN || '8220750519:AAEAVznImiHr8MmRmHVsHcJoSfZvC2LIaiQ';
      if (botToken && data.chatId) {
        const msg = '✅ *Vinculación exitosa*\\n\\nYa puedes usar el bot ForeTech Combustibles.\\n\\n*Comandos disponibles:*\\n• `/help` - Ver ayuda\\n• `/entrada` - Registrar entrada\\n• `/salida` - Registrar salida\\n\\n¡Listo para usar! 🚀';
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const body = { chat_id: String(data.chatId), text: msg, parse_mode: 'Markdown' };
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        if (!response.ok) {
          console.warn('Error enviando confirmación Telegram:', await response.text());
        } else {
          console.log('✅ Confirmación enviada a Telegram:', data.chatId);
        }
      }
    } catch (notifyErr) {
      console.warn('No se pudo enviar confirmación a Telegram:', notifyErr?.message);
    }

    return res.json({ success: true, message: 'Cuenta de Telegram vinculada correctamente' });
  } catch (error) {
    console.error('Error en linkTelegramAccount:', error);
    return res.status(500).json({ success: false, error: 'Error interno', message: error.message });
  }
});
