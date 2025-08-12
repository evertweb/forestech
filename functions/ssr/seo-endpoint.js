/**
 * Endpoint de validación y monitoreo SEO
 * Proporciona análisis completo de SEO para rutas específicas
 */

import { seoValidator, seoPerformanceChecker, seoReporter } from './seo-monitoring.js';
import { generateMetaTags, generateJsonLD } from './seo-config.js';

/**
 * Rutas principales de la aplicación para validación automática
 */
const MAIN_ROUTES = [
  { route: '/', app: null, name: 'Página Principal' },
  { route: '/combustibles/', app: 'combustibles', name: 'App Combustibles - Principal' },
  { route: '/alimentacion/', app: 'alimentacion', name: 'App Alimentación - Principal' },
  { route: '/combustibles/movimientos', app: 'combustibles', name: 'Movimientos de Combustibles' },
  { route: '/combustibles/inventario', app: 'combustibles', name: 'Inventario de Combustibles' },
  { route: '/combustibles/vehiculos', app: 'combustibles', name: 'Gestión de Vehículos' },
  { route: '/combustibles/reportes', app: 'combustibles', name: 'Reportes y Analytics' }
];

/**
 * Handler para endpoint de validación SEO
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export async function seoValidationHandler(req, res) {
  try {
    const startTime = Date.now();
    
    if (req.method === 'GET') {
      return handleSEOValidationGet(req, res, startTime);
    } else if (req.method === 'POST') {
      return handleSEOValidationPost(req, res, startTime);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('SEO Validation error:', error);
    res.status(500).json({ 
      error: 'SEO validation failed',
      message: error.message 
    });
  }
}

/**
 * Manejar requests GET - validación de ruta específica o reporte completo
 */
async function handleSEOValidationGet(req, res, startTime) {
  const { route, app, format = 'json', includePerformance = 'false' } = req.query;
  
  let validationResults = [];
  
  if (route) {
    // Validar ruta específica
    const result = seoValidator.validate(route, app);
    validationResults = [{
      route,
      app,
      name: `Ruta: ${route}`,
      ...result
    }];
  } else {
    // Validar todas las rutas principales
    validationResults = MAIN_ROUTES.map(({ route, app, name }) => ({
      route,
      app,
      name,
      ...seoValidator.validate(route, app)
    }));
  }
  
  // Agregar datos de performance si se solicita
  let performanceData = {};
  if (includePerformance === 'true') {
    performanceData = await gatherPerformanceData();
  }
  
  const report = seoReporter.generateReport(validationResults, performanceData);
  
  // Agregar métricas del endpoint
  report.meta = {
    executionTime: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    requestedRoute: route || 'all',
    requestedApp: app || 'all'
  };
  
  if (format === 'html') {
    return sendHTMLReport(res, report);
  }
  
  res.set({
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300' // Cache 5 minutos
  });
  
  res.json(report);
}

/**
 * Manejar requests POST - validación personalizada
 */
async function handleSEOValidationPost(req, res, startTime) {
  const { routes = [], includePerformance = false, customMetrics = {} } = req.body;
  
  if (!Array.isArray(routes) || routes.length === 0) {
    return res.status(400).json({
      error: 'Routes array is required',
      example: {
        routes: [{ route: '/combustibles/', app: 'combustibles' }]
      }
    });
  }
  
  const validationResults = routes.map(({ route, app, name }) => ({
    route,
    app,
    name: name || `Custom: ${route}`,
    ...seoValidator.validate(route, app)
  }));
  
  let performanceData = {};
  if (includePerformance) {
    performanceData = await gatherPerformanceData(customMetrics);
  }
  
  const report = seoReporter.generateReport(validationResults, performanceData);
  
  report.meta = {
    executionTime: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    customValidation: true,
    routesCount: routes.length
  };
  
  res.json(report);
}

/**
 * Recopilar datos de performance para el reporte
 */
async function gatherPerformanceData(customMetrics = {}) {
  // En una implementación real, esto podría consultar:
  // - Core Web Vitals de Real User Monitoring
  // - Métricas de Lighthouse CI
  // - Datos de Google PageSpeed Insights API
  
  const mockMetrics = {
    lcp: 1800, // Largest Contentful Paint (ms)
    fid: 50,   // First Input Delay (ms)
    cls: 0.05, // Cumulative Layout Shift
    ttfb: 200, // Time to First Byte (ms)
    ...customMetrics
  };
  
  return {
    coreWebVitals: mockMetrics,
    analysis: seoPerformanceChecker.checkCoreWebVitals(mockMetrics),
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Enviar reporte en formato HTML
 */
function sendHTMLReport(res, report) {
  const html = generateSEOReportHTML(report);
  
  res.set({
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=300'
  });
  
  res.send(html);
}

/**
 * Generar HTML del reporte SEO
 */
function generateSEOReportHTML(report) {
  const { summary, issues, routes } = report;
  
  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte SEO - Forestech Colombia</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 30px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .title { color: #1e293b; margin: 0 0 10px 0; font-size: 28px; }
        .subtitle { color: #64748b; margin: 0; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .metric-value { font-size: 32px; font-weight: bold; color: #2563eb; margin-bottom: 5px; }
        .metric-label { color: #64748b; font-size: 14px; }
        .section { background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .section h2 { margin: 0 0 20px 0; color: #1e293b; }
        .route-item { border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-bottom: 15px; }
        .route-header { display: flex; justify-content: between; align-items: center; margin-bottom: 10px; }
        .route-name { font-weight: 600; color: #1e293b; }
        .score { padding: 4px 12px; border-radius: 20px; font-weight: 600; font-size: 14px; }
        .score.good { background: #dcfce7; color: #166534; }
        .score.warning { background: #fef3c7; color: #92400e; }
        .score.error { background: #fecaca; color: #991b1b; }
        .issues { margin-top: 10px; }
        .issue { padding: 8px 12px; margin: 5px 0; border-radius: 4px; font-size: 14px; }
        .issue.error { background: #fef2f2; color: #991b1b; border-left: 4px solid #ef4444; }
        .issue.warning { background: #fffbeb; color: #92400e; border-left: 4px solid #f59e0b; }
        .issue.recommendation { background: #f0f9ff; color: #1e40af; border-left: 4px solid #3b82f6; }
        .timestamp { text-align: center; color: #64748b; font-size: 14px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">Reporte SEO - Forestech Colombia</h1>
            <p class="subtitle">Análisis completo de optimización para motores de búsqueda</p>
        </div>
        
        <div class="metrics">
            <div class="metric">
                <div class="metric-value">${summary.averageScore}%</div>
                <div class="metric-label">Score Promedio SEO</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.validRoutes}/${summary.totalRoutes}</div>
                <div class="metric-label">Rutas Válidas</div>
            </div>
            <div class="metric">
                <div class="metric-value">${summary.validationRate}%</div>
                <div class="metric-label">Tasa de Validación</div>
            </div>
            <div class="metric">
                <div class="metric-value">${issues.errors.length}</div>
                <div class="metric-label">Errores Críticos</div>
            </div>
        </div>
        
        <div class="section">
            <h2>Rutas Analizadas</h2>
            ${routes.map(route => `
                <div class="route-item">
                    <div class="route-header">
                        <span class="route-name">${route.name}</span>
                        <span class="score ${getScoreClass(route.score)}">${route.score}%</span>
                    </div>
                    <div class="route-path"><code>${route.route}</code></div>
                    ${route.errors.length > 0 || route.warnings.length > 0 || route.recommendations.length > 0 ? `
                        <div class="issues">
                            ${route.errors.map(error => `<div class="issue error">❌ ${error}</div>`).join('')}
                            ${route.warnings.map(warning => `<div class="issue warning">⚠️ ${warning}</div>`).join('')}
                            ${route.recommendations.map(rec => `<div class="issue recommendation">💡 ${rec}</div>`).join('')}
                        </div>
                    ` : '<div style="color: #16a34a; font-weight: 500;">✅ Sin problemas detectados</div>'}
                </div>
            `).join('')}
        </div>
        
        <div class="timestamp">
            Generado el ${new Date(summary.timestamp).toLocaleString('es-CO')}
        </div>
    </div>
</body>
</html>`;
}

function getScoreClass(score) {
  if (score >= 80) return 'good';
  if (score >= 60) return 'warning';
  return 'error';
}
