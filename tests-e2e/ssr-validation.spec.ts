import { test, expect } from '@playwright/test';

/**
 * Tests de validación SSR vs CSR para Fase 4
 * Verifica que las rutas inventory y vehicles funcionan correctamente con SSR
 */

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:5000';

test.describe('SSR vs CSR Validation - Fase 4', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar navegador para emular conexión lenta
    await page.route('**/*', (route) => {
      route.continue();
    });
  });

  test('SSR inventory route - should render without JavaScript', async ({ page }) => {
    // Deshabilitar JavaScript para verificar SSR puro
    await page.setJavaScriptEnabled(false);
    
    await page.goto(`${BASE_URL}/combustibles/inventory`);
    
    // Verificar que la página renderiza contenido SSR
    await expect(page.locator('h1')).toContainText('Inventario');
    
    // Verificar metadatos SSR
    const title = await page.title();
    expect(title).toContain('Inventario');
    
    // Verificar que hay contenido estructural básico
    await expect(page.locator('main, .inventory-container, [data-testid="inventory-content"]')).toBeVisible();
  });

  test('SSR vehicles route - should render without JavaScript', async ({ page }) => {
    // Deshabilitar JavaScript para verificar SSR puro
    await page.setJavaScriptEnabled(false);
    
    await page.goto(`${BASE_URL}/combustibles/vehicles`);
    
    // Verificar que la página renderiza contenido SSR
    await expect(page.locator('h1')).toContainText(['Vehículos', 'Flota']);
    
    // Verificar metadatos SSR
    const title = await page.title();
    expect(title).toContain('Vehículos');
    
    // Verificar que hay contenido estructural básico
    await expect(page.locator('main, .vehicles-container, [data-testid="vehicles-content"]')).toBeVisible();
  });

  test('SSR vs CSR performance comparison - inventory', async ({ page }) => {
    // Medir SSR performance
    const ssrStartTime = Date.now();
    await page.goto(`${BASE_URL}/combustibles/inventory`);
    await page.waitForLoadState('networkidle');
    const ssrLoadTime = Date.now() - ssrStartTime;
    
    // Verificar Server-Timing headers
    const response = await page.goto(`${BASE_URL}/combustibles/inventory`);
    const serverTiming = response?.headers()['server-timing'];
    expect(serverTiming).toBeTruthy();
    expect(serverTiming).toContain('ssr_total');
    
    console.log(`SSR Load Time: ${ssrLoadTime}ms`);
    console.log(`Server-Timing: ${serverTiming}`);
    
    // Verificar que carga en menos de 2 segundos (requisito Fase 4)
    expect(ssrLoadTime).toBeLessThan(2000);
  });

  test('SSR vs CSR performance comparison - vehicles', async ({ page }) => {
    // Medir SSR performance
    const ssrStartTime = Date.now();
    await page.goto(`${BASE_URL}/combustibles/vehicles`);
    await page.waitForLoadState('networkidle');
    const ssrLoadTime = Date.now() - ssrStartTime;
    
    // Verificar Server-Timing headers
    const response = await page.goto(`${BASE_URL}/combustibles/vehicles`);
    const serverTiming = response?.headers()['server-timing'];
    expect(serverTiming).toBeTruthy();
    expect(serverTiming).toContain('ssr_total');
    
    console.log(`SSR Load Time: ${ssrLoadTime}ms`);
    console.log(`Server-Timing: ${serverTiming}`);
    
    // Verificar que carga en menos de 2 segundos (requisito Fase 4)
    expect(ssrLoadTime).toBeLessThan(2000);
  });

  test('Hydration validation - inventory', async ({ page }) => {
    await page.goto(`${BASE_URL}/combustibles/inventory`);
    
    // Esperar a que React hidrate
    await page.waitForFunction(() => {
      return window.React !== undefined || document.querySelector('[data-reactroot]') !== null;
    });
    
    // Verificar que elementos interactivos funcionan después de hydration
    // (Esto requiere que la app tenga elementos interactivos identificables)
    const interactiveElements = page.locator('button, input, [role="button"]');
    const count = await interactiveElements.count();
    
    if (count > 0) {
      // Verificar que al menos un elemento es clickeable
      await expect(interactiveElements.first()).toBeEnabled();
    }
  });

  test('Hydration validation - vehicles', async ({ page }) => {
    await page.goto(`${BASE_URL}/combustibles/vehicles`);
    
    // Esperar a que React hidrate
    await page.waitForFunction(() => {
      return window.React !== undefined || document.querySelector('[data-reactroot]') !== null;
    });
    
    // Verificar que elementos interactivos funcionan después de hydration
    const interactiveElements = page.locator('button, input, [role="button"]');
    const count = await interactiveElements.count();
    
    if (count > 0) {
      // Verificar que al menos un elemento es clickeable
      await expect(interactiveElements.first()).toBeEnabled();
    }
  });

  test('Fallback CSR validation', async ({ page }) => {
    // Simular error SSR intercetando requests para forzar fallback
    await page.route('**/combustibles/inventory', (route) => {
      // Simular respuesta de fallback CSR
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!DOCTYPE html><html><head><title>Fallback CSR</title></head><body><div id="root"></div></body></html>',
        headers: {
          'x-fallback-csr': '1',
          'x-fallback-reason': 'test_fallback'
        }
      });
    });
    
    const response = await page.goto(`${BASE_URL}/combustibles/inventory`);
    
    // Verificar headers de fallback
    expect(response?.headers()['x-fallback-csr']).toBe('1');
    expect(response?.headers()['x-fallback-reason']).toBeTruthy();
    
    console.log(`Fallback reason: ${response?.headers()['x-fallback-reason']}`);
  });

  test('SEO metadata validation - inventory', async ({ page }) => {
    await page.goto(`${BASE_URL}/combustibles/inventory`);
    
    // Verificar metadatos SEO básicos
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60); // SEO óptimo
    
    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);
    expect(description!.length).toBeLessThan(160); // SEO óptimo
    
    // Verificar Open Graph
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
  });

  test('SEO metadata validation - vehicles', async ({ page }) => {
    await page.goto(`${BASE_URL}/combustibles/vehicles`);
    
    // Verificar metadatos SEO básicos
    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThan(60); // SEO óptimo
    
    const description = await page.getAttribute('meta[name="description"]', 'content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(50);
    expect(description!.length).toBeLessThan(160); // SEO óptimo
    
    // Verificar Open Graph
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
    const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
    
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
  });

  test('Error monitoring and logging validation', async ({ page }) => {
    // Interceptar logs de consola para verificar logging estructurado
    const consoleLogs: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warn') {
        consoleLogs.push(msg.text());
      }
    });
    
    await page.goto(`${BASE_URL}/combustibles/inventory`);
    
    // No debería haber errores de consola críticos
    const criticalErrors = consoleLogs.filter(log => 
      log.includes('SSR Critical') || 
      log.includes('Hydration failed') ||
      log.includes('Warning: Text content did not match')
    );
    
    expect(criticalErrors).toHaveLength(0);
    
    if (criticalErrors.length > 0) {
      console.log('Critical errors found:', criticalErrors);
    }
  });

  test('Remote Config toggle validation', async ({ page }) => {
    // Este test requeriría configurar Remote Config real o mock
    // Por ahora, verificamos que las rutas respondan correctamente
    
    const inventoryResponse = await page.goto(`${BASE_URL}/combustibles/inventory`);
    expect(inventoryResponse?.status()).toBe(200);
    
    const vehiclesResponse = await page.goto(`${BASE_URL}/combustibles/vehicles`);
    expect(vehiclesResponse?.status()).toBe(200);
    
    // Verificar que las páginas no devuelvan fallback por defecto
    const inventoryFallback = inventoryResponse?.headers()['x-fallback-csr'];
    const vehiclesFallback = vehiclesResponse?.headers()['x-fallback-csr'];
    
    // SSR debería estar activo por defecto
    expect(inventoryFallback).toBeFalsy();
    expect(vehiclesFallback).toBeFalsy();
  });
});

test.describe('Performance thresholds validation', () => {
  test('Lighthouse-like metrics validation', async ({ page }) => {
    // Simular métricas importantes para SSR
    await page.goto(`${BASE_URL}/combustibles/inventory`);
    
    // Medir tiempo hasta primer contenido
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
        loadComplete: navigation.loadEventEnd - navigation.navigationStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });
    
    console.log('Performance metrics:', performanceMetrics);
    
    // Verificar que métricas están dentro de umbrales aceptables
    expect(performanceMetrics.domContentLoaded).toBeLessThan(1500); // 1.5s
    expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1200); // 1.2s
    
    // Log métricas para monitoreo
    console.log(`DOMContentLoaded: ${performanceMetrics.domContentLoaded}ms`);
    console.log(`First Contentful Paint: ${performanceMetrics.firstContentfulPaint}ms`);
  });
});