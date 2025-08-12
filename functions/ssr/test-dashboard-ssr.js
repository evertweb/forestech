/**
 * Test básico para Dashboard SSR - Fase 1
 * Verificar que los componentes se rendericen correctamente
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { fileURLToPath } from 'node:url';
import AppSSRMinimal from './AppSSRMinimal.js';

/**
 * Test básico de renderizado del Dashboard SSR
 */
export function testDashboardSSR() {
  console.log('🧪 Testing Dashboard SSR...');
  
  const testUser = {
    uid: 'test_user_123',
    email: 'test@forestech.com',
    displayName: 'Usuario Test',
    emailVerified: true,
    isAnonymous: false
  };
  
  const testInitialState = {
    route: '/combustibles/dashboard',
    timestamp: Date.now(),
    ssr: true,
    user: testUser,
    data: {
      pageType: 'dashboard',
      requiresAuth: true,
      authenticated: true,
      user: testUser,
      stats: {
        vehicles: 25,
        fuel: 45000,
        movements: 12,
        alerts: 3,
        lastUpdate: new Date().toISOString()
      },
      recentActivity: [
        {
          id: 'act_001',
          type: 'movement',
          description: 'Test movement',
          timestamp: new Date().toISOString(),
          user: 'Test User'
        }
      ]
    }
  };
  
  try {
    // Test 1: Renderizar componente principal
    const html = renderToString(
      React.createElement(AppSSRMinimal, {
        location: '/combustibles/dashboard',
        initialState: testInitialState,
        user: testUser
      })
    );
    
    // Verificaciones básicas
    const tests = [
      {
        name: 'Contains Dashboard Header',
        test: () => html.includes('Dashboard - Forestech'),
        expected: true
      },
      {
        name: 'Contains User Welcome',
        test: () => html.includes('Bienvenido, Usuario Test'),
        expected: true
      },
      {
        name: 'Contains Stats Cards',
        test: () => html.includes('Vehículos Activos') && html.includes('25'),
        expected: true
      },
      {
        name: 'Contains Fuel Stock',
        test: () => html.includes('Litros en Stock') && html.includes('45000'),
        expected: true
      },
      {
        name: 'Contains Quick Actions',
        test: () => html.includes('Acciones Rápidas'),
        expected: true
      },
      {
        name: 'Contains Hydration Notice',
        test: () => html.includes('Cargando componentes interactivos'),
        expected: true
      },
      {
        name: 'Proper CSS Classes',
        test: () => html.includes('dashboard-ssr-container') && html.includes('stat-card'),
        expected: true
      }
    ];
    
    let passed = 0;
    let total = tests.length;
    
    console.log('📋 Running Dashboard SSR Tests:');
    console.log('═'.repeat(50));
    
    tests.forEach((test, index) => {
      const result = test.test();
      const status = result === test.expected ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} Test ${index + 1}: ${test.name}`);
      
      if (result === test.expected) {
        passed++;
      } else {
        console.log(`   Expected: ${test.expected}, Got: ${result}`);
      }
    });
    
    console.log('═'.repeat(50));
    console.log(`📊 Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All Dashboard SSR tests passed!');
      return { success: true, passed, total, html: html.substring(0, 200) + '...' };
    } else {
      console.log('⚠️  Some Dashboard SSR tests failed');
      return { success: false, passed, total, html: html.substring(0, 200) + '...' };
    }
    
  } catch (error) {
    console.error('❌ Dashboard SSR Test Error:', error);
    return { 
      success: false, 
      error: error.message,
      stack: error.stack?.substring(0, 300) 
    };
  }
}

/**
 * Test de fallback cuando no hay usuario autenticado
 */
export function testDashboardFallback() {
  console.log('🧪 Testing Dashboard Fallback (no auth)...');
  
  try {
    const html = renderToString(
      React.createElement(AppSSRMinimal, {
        location: '/combustibles/dashboard',
        initialState: { route: '/combustibles/dashboard' },
        user: null // Sin usuario autenticado
      })
    );
    
    // Debe hacer fallback a LoginSSR
    const shouldContainLogin = html.includes('Sistema de') && 
                              html.includes('Combustibles') &&
                              html.includes('Forestech Colombia');
    
    if (shouldContainLogin) {
      console.log('✅ Dashboard fallback to login works correctly');
      return { success: true, fallbackToLogin: true };
    } else {
      console.log('❌ Dashboard fallback failed');
      return { success: false, fallbackToLogin: false };
    }
    
  } catch (error) {
    console.error('❌ Dashboard Fallback Test Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Test del health check endpoint
 */
export function testHealthCheck() {
  console.log('🧪 Testing SSR Health Check...');
  
  try {
    const html = renderToString(
      React.createElement(AppSSRMinimal, {
        location: '/combustibles/ssr-health',
        initialState: { route: '/combustibles/ssr-health' },
        user: null
      })
    );
    
    const tests = [
      html.includes('SSR Health Check'),
      html.includes('Route: /combustibles/ssr-health'),
      html.includes('User: Anonymous'),
      html.includes('Timestamp:')
    ];
    
    const allPassed = tests.every(test => test);
    
    if (allPassed) {
      console.log('✅ Health check SSR works correctly');
      return { success: true, healthCheck: true };
    } else {
      console.log('❌ Health check SSR failed');
      return { success: false, healthCheck: false };
    }
    
  } catch (error) {
    console.error('❌ Health Check Test Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Ejecutar todos los tests
 */
export function runAllTests() {
  console.log('🚀 Running All Dashboard SSR Tests');
  console.log('='.repeat(60));
  
  const results = {
    dashboard: testDashboardSSR(),
    fallback: testDashboardFallback(),
    healthCheck: testHealthCheck(),
    timestamp: new Date().toISOString()
  };
  
  const allSuccess = Object.values(results)
    .filter(r => typeof r === 'object' && r.success !== undefined)
    .every(r => r.success);
  
  console.log('='.repeat(60));
  if (allSuccess) {
    console.log('🎉 ALL TESTS PASSED - Dashboard SSR is ready for Fase 1!');
  } else {
    console.log('⚠️  Some tests failed - Review before deployment');
  }
  
  return results;
}

// Auto-ejecutar tests si se corre directamente
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAllTests();
}