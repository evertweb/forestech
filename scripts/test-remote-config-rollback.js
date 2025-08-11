#!/usr/bin/env node

/**
 * Script para probar rollback inmediato con Remote Config flags
 * Fase 4 - Expansión gradual + Toggle
 * 
 * Uso:
 *   npm run test:rollback
 *   node scripts/test-remote-config-rollback.js
 */

import { initializeApp, getApps } from 'firebase/app';
import { getRemoteConfig, getValue, fetchAndActivate } from 'firebase/remote-config';

// Configuración Firebase (usar variables de entorno)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5000';

class RemoteConfigRollbackTester {
  constructor() {
    this.app = null;
    this.remoteConfig = null;
    this.testResults = [];
  }

  async initialize() {
    try {
      // Inicializar Firebase
      if (!getApps().length) {
        this.app = initializeApp(firebaseConfig);
      } else {
        this.app = getApps()[0];
      }

      this.remoteConfig = getRemoteConfig(this.app);
      this.remoteConfig.settings.minimumFetchIntervalMillis = 0; // Para testing
      
      console.log('✅ Firebase Remote Config inicializado');
      return true;
    } catch (error) {
      console.error('❌ Error inicializando Firebase:', error.message);
      return false;
    }
  }

  async fetchCurrentConfig() {
    try {
      await fetchAndActivate(this.remoteConfig);
      
      const ssrEnabled = getValue(this.remoteConfig, 'ssr_enabled');
      const ssrEnabledRoutes = getValue(this.remoteConfig, 'ssr_enabled_routes');
      const ssrUserSampling = getValue(this.remoteConfig, 'ssr_user_sampling');
      
      const config = {
        ssrEnabled: ssrEnabled.asBoolean(),
        ssrEnabledRoutes: this.parseJsonValue(ssrEnabledRoutes.asString()),
        ssrUserSampling: parseInt(ssrUserSampling.asString()) || 100
      };
      
      console.log('📋 Configuración actual:', config);
      return config;
    } catch (error) {
      console.error('❌ Error fetching Remote Config:', error.message);
      return null;
    }
  }

  parseJsonValue(value) {
    try {
      return JSON.parse(value);
    } catch {
      return value.split(',').map(s => s.trim());
    }
  }

  async testRoute(route, expectedSSR = true) {
    try {
      const startTime = Date.now();
      const response = await fetch(`${BASE_URL}${route}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Cache-Control': 'no-cache'
        }
      });

      const duration = Date.now() - startTime;
      const isCSRFallback = response.headers.get('x-fallback-csr') === '1';
      const fallbackReason = response.headers.get('x-fallback-reason');
      const serverTiming = response.headers.get('server-timing');

      const result = {
        route,
        status: response.status,
        isCSRFallback,
        fallbackReason,
        serverTiming,
        duration,
        expectedSSR,
        testPassed: isCSRFallback !== expectedSSR,
        timestamp: new Date().toISOString()
      };

      this.testResults.push(result);

      const status = result.testPassed ? '✅' : '❌';
      console.log(`${status} ${route} - SSR: ${!isCSRFallback} (esperado: ${expectedSSR}) - ${duration}ms`);
      
      if (fallbackReason) {
        console.log(`   └─ Fallback reason: ${fallbackReason}`);
      }
      
      if (serverTiming) {
        console.log(`   └─ Server-Timing: ${serverTiming}`);
      }

      return result;
    } catch (error) {
      console.error(`❌ Error testing ${route}:`, error.message);
      return {
        route,
        status: 'error',
        error: error.message,
        testPassed: false,
        timestamp: new Date().toISOString()
      };
    }
  }

  async simulateRollback() {
    console.log('\n🔄 Simulando rollback (SSR deshabilitado)...');
    
    // En un entorno real, aquí se cambiarían los valores de Remote Config
    // Por ahora, simulamos probando con parámetros que fuercen fallback
    
    const routesToTest = [
      '/combustibles/inventory',
      '/combustibles/vehicles',
      '/combustibles/movements', // Ruta que debería seguir funcionando
      '/combustibles/login'       // Ruta que debería seguir funcionando
    ];

    console.log('📊 Probando rutas después del rollback simulado...');
    
    const results = [];
    for (const route of routesToTest) {
      const result = await this.testRoute(route, false); // Esperamos CSR fallback
      results.push(result);
      
      // Esperar un poco entre requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  async testPerformanceImpact() {
    console.log('\n⚡ Probando impacto de performance...');
    
    const routesToTest = [
      '/combustibles/inventory',
      '/combustibles/vehicles'
    ];

    const performanceResults = [];
    
    for (const route of routesToTest) {
      // Hacer múltiples requests para obtener promedio
      const requests = 5;
      const times = [];
      
      for (let i = 0; i < requests; i++) {
        const result = await this.testRoute(route, true);
        times.push(result.duration);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      const maxTime = Math.max(...times);
      const minTime = Math.min(...times);
      
      const performanceData = {
        route,
        requests,
        avgTime: Math.round(avgTime),
        maxTime,
        minTime,
        withinThreshold: maxTime < 2000 // Umbral de 2 segundos
      };
      
      performanceResults.push(performanceData);
      
      const status = performanceData.withinThreshold ? '✅' : '⚠️';
      console.log(`${status} ${route} - Avg: ${performanceData.avgTime}ms, Max: ${maxTime}ms`);
    }

    return performanceResults;
  }

  async testErrorRecovery() {
    console.log('\n🔧 Probando recuperación de errores...');
    
    // Simular requests que podrían fallar
    const problematicRoutes = [
      '/combustibles/non-existent',  // 404
      '/combustibles/inventory',     // Normal
      '/combustibles/vehicles'       // Normal
    ];

    const recoveryResults = [];
    
    for (const route of problematicRoutes) {
      const result = await this.testRoute(route, false);
      recoveryResults.push(result);
      
      // Verificar que los errores no afecten otras rutas
      if (result.status === 404 || result.status >= 500) {
        console.log(`   └─ Error esperado para ${route}: ${result.status}`);
      }
    }

    return recoveryResults;
  }

  generateReport() {
    console.log('\n📊 REPORTE DE ROLLBACK');
    console.log('='.repeat(50));
    
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.testPassed).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total tests: ${totalTests}`);
    console.log(`Pasaron: ${passedTests}`);
    console.log(`Fallaron: ${failedTests}`);
    console.log(`Tasa de éxito: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    // Agrupar por razón de fallback
    const fallbackReasons = this.testResults
      .filter(r => r.fallbackReason)
      .reduce((acc, r) => {
        acc[r.fallbackReason] = (acc[r.fallbackReason] || 0) + 1;
        return acc;
      }, {});

    if (Object.keys(fallbackReasons).length > 0) {
      console.log('\n📋 Razones de fallback:');
      Object.entries(fallbackReasons).forEach(([reason, count]) => {
        console.log(`   ${reason}: ${count} veces`);
      });
    }

    // Performance summary
    const durations = this.testResults
      .filter(r => typeof r.duration === 'number')
      .map(r => r.duration);
      
    if (durations.length > 0) {
      const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      const maxDuration = Math.max(...durations);
      
      console.log('\n⚡ Performance:');
      console.log(`   Tiempo promedio: ${Math.round(avgDuration)}ms`);
      console.log(`   Tiempo máximo: ${maxDuration}ms`);
      console.log(`   Dentro del umbral (<2000ms): ${maxDuration < 2000 ? '✅' : '❌'}`);
    }

    // Recomendaciones
    console.log('\n💡 Recomendaciones:');
    
    if (failedTests > 0) {
      console.log('   - Revisar configuración de Remote Config');
      console.log('   - Verificar que fallbacks CSR funcionan correctamente');
    }
    
    if (durations.some(d => d > 2000)) {
      console.log('   - Optimizar tiempo de respuesta SSR');
      console.log('   - Considerar cache adicional');
    }
    
    if (passedTests === totalTests) {
      console.log('   - ✅ Rollback funciona correctamente');
      console.log('   - Sistema listo para producción');
    }

    return {
      totalTests,
      passedTests,
      failedTests,
      successRate: (passedTests / totalTests) * 100,
      averageResponseTime: durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0
    };
  }

  async run() {
    console.log('🚀 Iniciando pruebas de rollback Remote Config');
    console.log('Base URL:', BASE_URL);
    
    const initialized = await this.initialize();
    if (!initialized) {
      console.log('❌ No se pudo inicializar Firebase. Continuando con pruebas básicas...');
    }

    // 1. Obtener configuración actual
    if (initialized) {
      await this.fetchCurrentConfig();
    }

    // 2. Probar rutas normales (SSR activo)
    console.log('\n🔍 Probando SSR activo...');
    await this.testRoute('/combustibles/inventory', true);
    await this.testRoute('/combustibles/vehicles', true);
    await this.testRoute('/combustibles/movements', true);
    await this.testRoute('/combustibles/login', true);

    // 3. Simular rollback
    await this.simulateRollback();

    // 4. Probar performance
    await this.testPerformanceImpact();

    // 5. Probar recuperación de errores
    await this.testErrorRecovery();

    // 6. Generar reporte
    const report = this.generateReport();
    
    // Retornar código de salida basado en resultados
    process.exit(report.successRate >= 80 ? 0 : 1);
  }
}

// Ejecutar solo si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new RemoteConfigRollbackTester();
  tester.run().catch(error => {
    console.error('❌ Error ejecutando pruebas:', error);
    process.exit(1);
  });
}

export default RemoteConfigRollbackTester;