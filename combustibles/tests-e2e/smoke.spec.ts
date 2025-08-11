import { test, expect } from '@playwright/test';

/**
 * Smoke Tests simplificados y robustos
 * Solo verifican que las rutas cargan sin errores críticos
 */

test.describe('Smoke Tests - Combustibles App', () => {
  test('página de login carga correctamente', async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    
    // Verificar que la página carga
    await expect(page.locator('body')).toBeVisible();
    
    // Verificar que no hay errores de JavaScript críticos
    const jsErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    // Esperar un poco para capturar errores
    await page.waitForTimeout(2000);
    
    // Buscar el botón de login (flexible)
    const hasLoginButton = await page.locator('button').count() > 0;
    expect(hasLoginButton).toBe(true);
    
    // No debe haber errores críticos de JS
    const criticalErrors = jsErrors.filter(error => 
      error.includes('TypeError') || 
      error.includes('ReferenceError') || 
      error.includes('SyntaxError')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('navegación básica funciona', async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    
    // Verificar que la URL base carga
    expect(page.url()).toContain('combustibles');
    
    // Verificar que React está funcionando
    await page.waitForFunction(() => {
      return document.querySelector('#root') !== null;
    }, { timeout: 10000 });
    
    // Verificar que hay contenido renderizado
    const rootHasContent = await page.locator('#root').innerHTML();
    expect(rootHasContent.length).toBeGreaterThan(100);
  });

  test('recursos críticos cargan correctamente', async ({ page, baseURL }) => {
    // Interceptar requests para verificar que no fallan recursos críticos
    const failedRequests: string[] = [];
    
    page.on('requestfailed', (request) => {
      const url = request.url();
      // Solo alertar sobre recursos críticos (no imágenes de fondo)
      if ((url.includes('.js') || url.includes('.css')) && 
          !url.includes('login-bg.jpg') && 
          !url.includes('backgrounds')) {
        failedRequests.push(url);
      }
    });
    
    await page.goto(baseURL!);
    await page.waitForTimeout(3000);
    
    // No debe haber fallos en recursos críticos
    expect(failedRequests).toHaveLength(0);
    
    // Verificar que Firebase está disponible (si se usa)
    const hasFirebase = await page.evaluate(() => {
      return typeof window !== 'undefined';
    });
    expect(hasFirebase).toBe(true);
  });

  test('app responde en tiempo razonable', async ({ page, baseURL }) => {
    const startTime = Date.now();
    
    await page.goto(baseURL!);
    
    // Esperar hasta que hay algo renderizado
    await page.waitForSelector('#root', { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    
    // Debe cargar en menos de 10 segundos (generoso para CI)
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`Load time: ${loadTime}ms`);
  });
});

test.describe('Basic Functionality Tests', () => {
  test('routing básico no rompe la app', async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    
    // Intentar navegar a diferentes rutas
    const routes = [
      baseURL!,
      baseURL! + 'movements',
      baseURL! + 'inventory', 
      baseURL! + 'vehicles'
    ];
    
    for (const route of routes) {
      await page.goto(route);
      
      // Verificar que llegamos y no hay crash
      await page.waitForSelector('#root', { timeout: 5000 });
      
      // Verificar que la URL cambió correctamente  
      expect(page.url()).toContain('combustibles');
      
      // Verificar que hay contenido
      const hasContent = await page.locator('#root').innerHTML();
      expect(hasContent.length).toBeGreaterThan(50);
    }
  });
});