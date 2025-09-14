#!/usr/bin/env node

/**
 * Script de validación SEO y Performance - Fase 3 SSR
 * Valida metadatos, Open Graph, estructuras de datos y métricas Core Web Vitals
 */

/* eslint-env node */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de validación
const VALIDATION_CONFIG = {
  baseUrl: 'https://oilforestech.web.app', // Producción
  routes: [
    '/',
    '/movimientos',
    '/inventario',
    '/vehiculos',
    '/mantenimiento',
  ],
  seoChecks: {
    title: { minLength: 10, maxLength: 60 },
    description: { minLength: 50, maxLength: 160 },
    keywords: { maxLength: 255 },
    ogImage: { required: false },
  },
  performanceTargets: {
    serverTiming: { maxMs: 1200 }, // p95 < 1200ms según roadmap
    ttfb: { maxMs: 800 },
    contentLength: { maxKb: 100 }, // Initial state < 100KB
  },
};

/**
 * Validar SEO de una ruta específica
 * @param {string} route - Ruta a validar
 * @returns {Promise<Object>} - Resultado de validación
 */
async function validateRouteSEO(route) {
  const url = `${VALIDATION_CONFIG.baseUrl}${route}`;
  const result = {
    route,
    url,
    passed: true,
    errors: [],
    warnings: [],
    metrics: {},
  };

  try {
    console.log(`🔍 Validando SEO: ${route}`);

    const startTime = Date.now();
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SEO-Validator/1.0 (SSR Phase 3)',
      },
    });

    const ttfb = Date.now() - startTime;
    result.metrics.ttfb = ttfb;

    if (!response.ok) {
      result.errors.push(`HTTP ${response.status}: ${response.statusText}`);
      result.passed = false;
      return result;
    }

    const html = await response.text();
    const headers = Object.fromEntries(response.headers.entries());

    // Validar headers de performance
    if (headers['server-timing']) {
      result.metrics.serverTiming = parseServerTiming(headers['server-timing']);
    }

    result.metrics.contentLength = html.length;
    result.metrics.contentLengthKb = Math.round(html.length / 1024);

    // Validar SEO básico
    const seoValidation = validateSEOContent(html, route);
    result.errors.push(...seoValidation.errors);
    result.warnings.push(...seoValidation.warnings);
    result.seo = seoValidation.data;

    // Validar Open Graph
    const ogValidation = validateOpenGraph(html);
    result.errors.push(...ogValidation.errors);
    result.warnings.push(...ogValidation.warnings);
    result.openGraph = ogValidation.data;

    // Validar structured data
    const structuredValidation = validateStructuredData(html);
    result.warnings.push(...structuredValidation.warnings);
    result.structuredData = structuredValidation.data;

    // Validar performance
    const perfValidation = validatePerformance(result.metrics);
    result.errors.push(...perfValidation.errors);
    result.warnings.push(...perfValidation.warnings);

    // Validar que el SSR funciona
    const ssrValidation = validateSSRContent(html);
    result.errors.push(...ssrValidation.errors);
    result.isSSR = ssrValidation.isSSR;

    result.passed = result.errors.length === 0;
  } catch (error) {
    result.errors.push(`Request failed: ${error.message}`);
    result.passed = false;
  }

  return result;
}

/**
 * Validar contenido SEO básico
 */
function validateSEOContent(html, route) {
  const errors = [];
  const warnings = [];
  const data = {};

  // Extraer title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    data.title = titleMatch[1].trim();
    const titleLength = data.title.length;

    if (titleLength < VALIDATION_CONFIG.seoChecks.title.minLength) {
      errors.push(
        `Title too short: ${titleLength} chars (min: ${VALIDATION_CONFIG.seoChecks.title.minLength})`
      );
    }
    if (titleLength > VALIDATION_CONFIG.seoChecks.title.maxLength) {
      warnings.push(
        `Title too long: ${titleLength} chars (max: ${VALIDATION_CONFIG.seoChecks.title.maxLength})`
      );
    }
  } else {
    errors.push('Missing <title> tag');
  }

  // Extraer meta description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
  if (descMatch) {
    data.description = descMatch[1].trim();
    const descLength = data.description.length;

    if (descLength < VALIDATION_CONFIG.seoChecks.description.minLength) {
      warnings.push(
        `Description too short: ${descLength} chars (min: ${VALIDATION_CONFIG.seoChecks.description.minLength})`
      );
    }
    if (descLength > VALIDATION_CONFIG.seoChecks.description.maxLength) {
      warnings.push(
        `Description too long: ${descLength} chars (max: ${VALIDATION_CONFIG.seoChecks.description.maxLength})`
      );
    }
  } else {
    errors.push('Missing meta description');
  }

  // Extraer keywords
  const keywordsMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["']/i);
  if (keywordsMatch) {
    data.keywords = keywordsMatch[1].trim();
  }

  // Validar canonical
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (canonicalMatch) {
    data.canonical = canonicalMatch[1];
  } else if (!route.includes('/login')) {
    warnings.push('Missing canonical URL');
  }

  // Validar robots
  const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']+)["']/i);
  if (robotsMatch) {
    data.robots = robotsMatch[1];
  }

  return { errors, warnings, data };
}

/**
 * Validar Open Graph tags
 */
function validateOpenGraph(html) {
  const errors = [];
  const warnings = [];
  const data = {};

  const ogProps = [
    'og:type',
    'og:title',
    'og:description',
    'og:url',
    'og:image',
    'og:site_name',
    'og:locale',
  ];

  ogProps.forEach((prop) => {
    const regex = new RegExp(`<meta\\s+property=["']${prop}["']\\s+content=["']([^"']+)["']`, 'i');
    const match = html.match(regex);
    if (match) {
      data[prop] = match[1];
    }
  });

  // Validaciones específicas
  if (!data['og:type']) {
    warnings.push('Missing og:type');
  }
  if (!data['og:title']) {
    errors.push('Missing og:title');
  }
  if (!data['og:description']) {
    errors.push('Missing og:description');
  }

  // Validar Twitter Cards
  const twitterCards = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
  twitterCards.forEach((card) => {
    const regex = new RegExp(`<meta\\s+name=["']${card}["']\\s+content=["']([^"']+)["']`, 'i');
    const match = html.match(regex);
    if (match) {
      data[card] = match[1];
    }
  });

  if (!data['twitter:card']) {
    warnings.push('Missing Twitter Card');
  }

  return { errors, warnings, data };
}

/**
 * Validar structured data (JSON-LD)
 */
function validateStructuredData(html) {
  const warnings = [];
  const data = {};

  const jsonLdMatch = html.match(/<script type=["']application\/ld\+json["']>([^<]+)<\/script>/i);
  if (jsonLdMatch) {
    try {
      data.jsonLd = JSON.parse(jsonLdMatch[1]);
    } catch {
      warnings.push('Invalid JSON-LD structure');
    }
  } else {
    warnings.push('No structured data (JSON-LD) found');
  }

  return { warnings, data };
}

/**
 * Validar métricas de performance
 */
function validatePerformance(metrics) {
  const errors = [];
  const warnings = [];

  // TTFB validation
  if (metrics.ttfb > VALIDATION_CONFIG.performanceTargets.ttfb.maxMs) {
    warnings.push(
      `TTFB too high: ${metrics.ttfb}ms (target: <${VALIDATION_CONFIG.performanceTargets.ttfb.maxMs}ms)`
    );
  }

  // Server timing validation
  if (metrics.serverTiming) {
    const ssrTotal = metrics.serverTiming.ssr_total;
    if (ssrTotal > VALIDATION_CONFIG.performanceTargets.serverTiming.maxMs) {
      errors.push(
        `SSR time too high: ${ssrTotal}ms (target: <${VALIDATION_CONFIG.performanceTargets.serverTiming.maxMs}ms)`
      );
    }
  }

  // Content length validation
  if (metrics.contentLengthKb > VALIDATION_CONFIG.performanceTargets.contentLength.maxKb) {
    warnings.push(
      `Content too large: ${metrics.contentLengthKb}KB (target: <${VALIDATION_CONFIG.performanceTargets.contentLength.maxKb}KB)`
    );
  }

  return { errors, warnings };
}

/**
 * Validar que el contenido es realmente SSR
 */
function validateSSRContent(html) {
  const errors = [];

  // Verificar que hay contenido renderizado (no solo loading spinner)
  const hasRoot = html.includes('<div id="root">');
  const hasLoadingOnly =
    html.includes('loading-container') &&
    !html.includes('class="') &&
    html.split('<div').length < 5;

  const isSSR = hasRoot && !hasLoadingOnly;

  if (!isSSR) {
    errors.push('Content appears to be CSR fallback, not SSR');
  }

  // Verificar initial state
  if (!html.includes('__INITIAL_STATE__')) {
    errors.push('Missing initial state for hydration');
  }

  return { errors, isSSR };
}

/**
 * Parsear Server-Timing header
 */
function parseServerTiming(serverTimingHeader) {
  const metrics = {};
  const entries = serverTimingHeader.split(',');

  entries.forEach((entry) => {
    const match = entry.trim().match(/([^;]+);dur=([0-9.]+)/);
    if (match) {
      metrics[match[1]] = parseFloat(match[2]);
    }
  });

  return metrics;
}

/**
 * Generar reporte de validación
 */
function generateReport(results) {
  const totalRoutes = results.length;
  const passedRoutes = results.filter((r) => r.passed).length;
  const failedRoutes = totalRoutes - passedRoutes;

  let report = `
# 🔍 SEO & Performance Validation Report - Fase 3 SSR
**Generated:** ${new Date().toISOString()}
**Routes tested:** ${totalRoutes}
**Passed:** ${passedRoutes} ✅
**Failed:** ${failedRoutes} ❌

`;

  results.forEach((result) => {
    const status = result.passed ? '✅ PASSED' : '❌ FAILED';
    report += `## ${result.route} - ${status}\n`;
    report += `**URL:** ${result.url}\n`;

    if (result.metrics) {
      report += `**Performance:**\n`;
      report += `- TTFB: ${result.metrics.ttfb}ms\n`;
      report += `- Content: ${result.metrics.contentLengthKb}KB\n`;
      if (result.metrics.serverTiming) {
        Object.entries(result.metrics.serverTiming).forEach(([key, value]) => {
          report += `- ${key}: ${value}ms\n`;
        });
      }
    }

    if (result.seo) {
      report += `**SEO:**\n`;
      report += `- Title: "${result.seo.title}" (${result.seo.title?.length || 0} chars)\n`;
      report += `- Description: "${result.seo.description}" (${result.seo.description?.length || 0} chars)\n`;
      if (result.seo.canonical) report += `- Canonical: ${result.seo.canonical}\n`;
    }

    if (result.errors.length > 0) {
      report += `**❌ Errors:**\n`;
      result.errors.forEach((error) => {
        report += `- ${error}\n`;
      });
    }

    if (result.warnings.length > 0) {
      report += `**⚠️  Warnings:**\n`;
      result.warnings.forEach((warning) => {
        report += `- ${warning}\n`;
      });
    }

    report += `\n---\n\n`;
  });

  // Resumen final
  report += `## 📊 Summary\n\n`;
  if (passedRoutes === totalRoutes) {
    report += `🎉 **All routes passed validation!** Ready for Fase 4.\n\n`;
  } else {
    report += `⚠️  **${failedRoutes} routes failed validation.** Fix errors before proceeding.\n\n`;
  }

  // Recomendaciones
  report += `## 🚀 Next Steps\n`;
  report += `- Run \`npm run lighthouse\` for detailed performance analysis\n`;
  report += `- Test with \`npm run dev:ssr\` and verify all routes\n`;
  report += `- Check \`/sitemap.xml\` and \`/robots.txt\` endpoints\n`;
  report += `- Proceed to Fase 4 if all validations pass\n`;

  return report;
}

/**
 * Función principal
 */
async function main() {
  console.log('🔍 Starting SEO & Performance validation...\n');

  const results = [];

  for (const route of VALIDATION_CONFIG.routes) {
    const result = await validateRouteSEO(route);
    results.push(result);

    const status = result.passed ? '✅' : '❌';
    const errors = result.errors.length;
    const warnings = result.warnings.length;
    console.log(`${status} ${route} (${errors} errors, ${warnings} warnings)`);
  }

  console.log('\n📝 Generating report...');

  const report = generateReport(results);
  const reportPath = path.join(__dirname, '../logs/seo-validation-report.md');

  // Asegurar que el directorio logs existe
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, report);

  console.log(`✅ Report saved: ${reportPath}`);

  const passedAll = results.every((r) => r.passed);
  if (passedAll) {
    console.log('\n🎉 All SEO validations passed! Fase 3 complete.');
    globalThis.process?.exit(0);
  } else {
    console.log('\n❌ Some validations failed. Check report for details.');
    globalThis.process?.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${globalThis.process?.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ Validation failed:', error);
    globalThis.process?.exit(1);
  });
}

export { validateRouteSEO, generateReport };
