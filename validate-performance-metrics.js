#!/usr/bin/env node

/**
 * Validator de métricas de performance para Fase 1
 * Valida que los objetivos de la Fase 1 se cumplan
 */

import https from 'https';
import { performance } from 'perf_hooks';

const BASE_URL = 'https://forestechdecolombia.com.co';

// Targets Fase 1 del roadmap
const PERFORMANCE_TARGETS = {
  TTFB: 1500,        // ms - Time To First Byte
  TOTAL_TIME: 2800,  // ms - Total request time 
  SUCCESS_RATE: 95,  // % - Mínimo éxito
  MIN_REQUESTS: 10   // Mínimo requests para estadísticas válidas
};

const ROUTES_TO_TEST = [
  {
    path: '/combustibles/',
    name: 'Landing Page',
    expected: 'SSR con metadatos',
    critical: true
  },
  {
    path: '/combustibles/dashboard',
    name: 'Dashboard (sin auth)',
    expected: 'Fallback a login',
    critical: true
  },
  {
    path: '/combustibles/ssr-health',
    name: 'Health Check',
    expected: 'SSR Health Check',
    critical: false
  }
];

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Performance Validator)',
        'Accept': 'text/html,application/xhtml+xml'
      }
    }, (res) => {
      let data = '';
      const firstByteTime = performance.now();
      const ttfb = firstByteTime - startTime;
      
      res.on('data', (chunk) => {
        if (data.length === 0) {
          // First chunk received
        }
        data += chunk;
      });
      
      res.on('end', () => {
        const totalTime = performance.now() - startTime;
        
        resolve({
          statusCode: res.statusCode,
          ttfb: Math.round(ttfb),
          totalTime: Math.round(totalTime),
          contentLength: data.length,
          headers: res.headers,
          body: data.substring(0, 500) // First 500 chars
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function validateRoute(route) {
  const url = BASE_URL + route.path;
  console.log(`\n🧪 Testing: ${route.name} (${route.path})`);
  console.log('─'.repeat(50));
  
  const results = [];
  const errors = [];
  
  // Hacer múltiples requests para obtener estadísticas
  for (let i = 1; i <= PERFORMANCE_TARGETS.MIN_REQUESTS; i++) {
    try {
      process.stdout.write(`Request ${i}/${PERFORMANCE_TARGETS.MIN_REQUESTS}... `);
      const result = await makeRequest(url);
      results.push(result);
      
      // Validar status code
      if (result.statusCode === 200) {
        process.stdout.write(`✅ ${result.totalTime}ms\n`);
      } else {
        process.stdout.write(`⚠️  Status ${result.statusCode} (${result.totalTime}ms)\n`);
      }
      
      // Pequeña pausa entre requests
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      errors.push(error);
      process.stdout.write(`❌ Error: ${error.message}\n`);
    }
  }
  
  // Analizar resultados
  if (results.length === 0) {
    return {
      route: route.name,
      success: false,
      error: 'No successful requests',
      critical: route.critical
    };
  }
  
  const successRate = (results.length / PERFORMANCE_TARGETS.MIN_REQUESTS) * 100;
  const avgTTFB = results.reduce((sum, r) => sum + r.ttfb, 0) / results.length;
  const avgTotal = results.reduce((sum, r) => sum + r.totalTime, 0) / results.length;
  const maxTime = Math.max(...results.map(r => r.totalTime));
  const minTime = Math.min(...results.map(r => r.totalTime));
  
  // P95 (95th percentile)
  const sortedTimes = results.map(r => r.totalTime).sort((a, b) => a - b);
  const p95Index = Math.floor(sortedTimes.length * 0.95);
  const p95Time = sortedTimes[p95Index] || sortedTimes[sortedTimes.length - 1];
  
  // Verificar contenido esperado
  const firstResult = results[0];
  const hasExpectedContent = firstResult.body.includes(route.expected.split(' ')[0]);
  
  // Verificar headers SSR
  const hasServerTiming = firstResult.headers['server-timing'];
  const hasSSRHeaders = hasServerTiming && hasServerTiming.includes('ssr_');
  
  console.log(`\n📊 Resultados:`);
  console.log(`   Success Rate: ${successRate.toFixed(1)}% (target: ${PERFORMANCE_TARGETS.SUCCESS_RATE}%)`);
  console.log(`   Avg TTFB: ${Math.round(avgTTFB)}ms (target: <${PERFORMANCE_TARGETS.TTFB}ms)`);
  console.log(`   Avg Total: ${Math.round(avgTotal)}ms (target: <${PERFORMANCE_TARGETS.TOTAL_TIME}ms)`);
  console.log(`   P95: ${p95Time}ms`);
  console.log(`   Range: ${minTime}ms - ${maxTime}ms`);
  console.log(`   SSR Headers: ${hasSSRHeaders ? '✅' : '❌'}`);
  console.log(`   Expected Content: ${hasExpectedContent ? '✅' : '⚠️'}`);
  
  // Evaluación final
  const ttfbPass = avgTTFB <= PERFORMANCE_TARGETS.TTFB;
  const totalPass = avgTotal <= PERFORMANCE_TARGETS.TOTAL_TIME;
  const successRatePass = successRate >= PERFORMANCE_TARGETS.SUCCESS_RATE;
  
  const passed = ttfbPass && totalPass && successRatePass;
  
  console.log(`\n🎯 Evaluación: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  if (!ttfbPass) console.log(`   ❌ TTFB too high: ${Math.round(avgTTFB)}ms > ${PERFORMANCE_TARGETS.TTFB}ms`);
  if (!totalPass) console.log(`   ❌ Total time too high: ${Math.round(avgTotal)}ms > ${PERFORMANCE_TARGETS.TOTAL_TIME}ms`);
  if (!successRatePass) console.log(`   ❌ Success rate too low: ${successRate}% < ${PERFORMANCE_TARGETS.SUCCESS_RATE}%`);
  
  return {
    route: route.name,
    path: route.path,
    success: passed,
    critical: route.critical,
    metrics: {
      successRate,
      avgTTFB: Math.round(avgTTFB),
      avgTotal: Math.round(avgTotal),
      p95Time,
      minTime,
      maxTime,
      hasSSRHeaders,
      hasExpectedContent
    },
    issues: {
      ttfbHigh: !ttfbPass,
      totalTimeHigh: !totalPass,
      lowSuccessRate: !successRatePass
    }
  };
}

async function main() {
  console.log('🚀 Validador de Performance - Fase 1 SSR');
  console.log('==========================================');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Targets: TTFB <${PERFORMANCE_TARGETS.TTFB}ms, Total <${PERFORMANCE_TARGETS.TOTAL_TIME}ms, Success >${PERFORMANCE_TARGETS.SUCCESS_RATE}%`);
  
  const results = [];
  
  for (const route of ROUTES_TO_TEST) {
    const result = await validateRoute(route);
    results.push(result);
  }
  
  // Reporte final
  console.log('\n🎯 REPORTE FINAL');
  console.log('================');
  
  const passedRoutes = results.filter(r => r.success);
  const failedRoutes = results.filter(r => !r.success);
  const criticalFailed = failedRoutes.filter(r => r.critical);
  
  console.log(`✅ Passed: ${passedRoutes.length}/${results.length} routes`);
  console.log(`❌ Failed: ${failedRoutes.length}/${results.length} routes`);
  if (criticalFailed.length > 0) {
    console.log(`🚨 Critical failures: ${criticalFailed.length}`);
  }
  
  console.log('\n📋 Summary:');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    const critical = result.critical ? '🔴' : '🟡';
    console.log(`  ${status} ${critical} ${result.route}: ${result.metrics?.avgTotal || 'N/A'}ms`);
    
    if (!result.success && result.issues) {
      if (result.issues.ttfbHigh) console.log(`       ⚠️  High TTFB: ${result.metrics.avgTTFB}ms`);
      if (result.issues.totalTimeHigh) console.log(`       ⚠️  High total time: ${result.metrics.avgTotal}ms`);
      if (result.issues.lowSuccessRate) console.log(`       ⚠️  Low success rate: ${result.metrics.successRate}%`);
    }
  });
  
  // Recomendaciones
  console.log('\n💡 Recomendaciones:');
  if (criticalFailed.length > 0) {
    console.log('  🚨 HAY FALLOS CRÍTICOS - NO PROCEDER CON ROLLOUT');
    console.log('     Resolver issues críticos antes del rollout de producción');
  } else if (failedRoutes.length > 0) {
    console.log('  ⚠️  Hay issues no críticos - Monitorear de cerca');
    console.log('     Considerar optimizaciones antes de escalar');
  } else {
    console.log('  🎉 TODOS LOS TESTS PASAN - READY PARA ROLLOUT');
    console.log('     Fase 1 cumple objetivos de performance');
  }
  
  // Exit code para CI/CD
  process.exit(criticalFailed.length > 0 ? 1 : 0);
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });
}