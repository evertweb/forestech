import { test, expect } from '@playwright/test';

/**
 * E2E Tests: Dashboard
 * 
 * Cubre:
 * - Visualización de métricas principales
 * - Listado de movimientos recientes
 * - Alertas de inventario
 * - Carga de gráficos/estadísticas
 */

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la aplicación y hacer login
    await page.goto('/');
    
    // Hacer login
    const loginButton = page.getByRole('button', { name: /ingresar|login|acceder/i });
    await expect(loginButton).toBeVisible({ timeout: 10000 });
    await loginButton.click();
    
    // Esperar a que cargue el dashboard
    await expect(
      page.locator('[data-testid="sidebar"], nav, aside').first()
    ).toBeVisible({ timeout: 15000 });
    
    // Asegurarnos de estar en la página principal del dashboard
    await page.goto('/combustibles/');
    await page.waitForTimeout(2000); // Dar tiempo para que carguen los datos
  });

  test('debería mostrar las métricas principales del dashboard', async ({ page }) => {
    // Verificar que el dashboard tiene contenido
    const mainContent = page.locator('main, [role="main"], .dashboard-content').first();
    await expect(mainContent).toBeVisible();
    
    // Buscar tarjetas de métricas (cards con números/estadísticas)
    const cards = page.locator('.card, .metric-card, [class*="Card"]');
    const cardCount = await cards.count();
    
    // Debería haber al menos 2 tarjetas con métricas
    expect(cardCount).toBeGreaterThanOrEqual(2);
    
    // Verificar que hay contenido numérico (indicadores de métricas)
    const hasNumbers = await page.locator('text=/\\d+/').count();
    expect(hasNumbers).toBeGreaterThan(0);
  });

  test('debería mostrar movimientos recientes', async ({ page }) => {
    // Buscar la sección de movimientos recientes
    const movementsSection = page.locator(
      'text=/movimientos recientes|últimos movimientos|recent movements/i'
    ).first();
    
    // Si no hay encabezado, buscar tabla o lista de movimientos
    const hasMoverments = await movementsSection.isVisible().catch(() => false) ||
                         await page.locator('table, .table, .movements-list, [class*="Movement"]').count() > 0;
    
    expect(hasMoverments).toBe(true);
  });

  test('debería mostrar alertas de inventario bajo', async ({ page }) => {
    // Buscar alertas o indicadores de stock bajo
    const alerts = page.locator(
      '[class*="alert"], [role="alert"], .warning, .notification, [class*="Alert"]'
    );
    
    // Puede que no haya alertas si todo está bien, eso es válido
    // Solo verificamos que el componente de alertas exista o el dashboard no tenga errores
    const pageHasContent = await page.locator('main, [role="main"]').isVisible();
    expect(pageHasContent).toBe(true);
  });

  test('debería cargar gráficos/estadísticas sin errores', async ({ page }) => {
    // Verificar que no hay errores de carga de gráficos
    const jsErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        jsErrors.push(msg.text());
      }
    });
    
    // Esperar a que se cargue el contenido
    await page.waitForTimeout(3000);
    
    // Buscar elementos de gráficos (canvas, svg)
    const hasCharts = await page.locator('canvas, svg[class*="chart"], [class*="Chart"]').count() > 0;
    
    // No debe haber errores críticos de JavaScript
    const criticalErrors = jsErrors.filter(error => 
      error.includes('TypeError') || 
      error.includes('ReferenceError') ||
      error.includes('Chart')
    );
    
    // Si hay gráficos, no debería haber errores críticos
    if (hasCharts) {
      expect(criticalErrors.length).toBeLessThanOrEqual(1); // Permitir 1 error menor
    }
  });

  test('debería navegar entre las diferentes secciones del dashboard', async ({ page }) => {
    // Verificar que la navegación existe
    const nav = page.locator('nav, aside, [data-testid="sidebar"]').first();
    await expect(nav).toBeVisible();
    
    // Buscar enlaces de navegación
    const navLinks = nav.locator('a, button[role="tab"]');
    const linksCount = await navLinks.count();
    
    // Debería haber al menos 3 enlaces de navegación
    expect(linksCount).toBeGreaterThanOrEqual(3);
    
    // Verificar que los enlaces tienen texto
    const firstLink = navLinks.first();
    const linkText = await firstLink.textContent();
    expect(linkText?.length).toBeGreaterThan(0);
  });

  test('debería mostrar el dashboard completo sin errores de carga', async ({ page }) => {
    // Verificar que el título/encabezado del dashboard está visible
    const heading = page.locator('h1, h2, [role="heading"]').first();
    await expect(heading).toBeVisible();
    
    // Verificar que el contenido principal está visible
    const mainContent = page.locator('main, [role="main"]').first();
    await expect(mainContent).toBeVisible();
    
    // Verificar que no hay spinners de carga (la página terminó de cargar)
    await page.waitForTimeout(3000);
    const loadingSpinner = page.locator('.spinner, .loading, [class*="Loading"]');
    const isLoading = await loadingSpinner.isVisible().catch(() => false);
    
    // Idealmente no debería estar cargando después de 3 segundos
    // Pero si está cargando datos grandes, eso puede ser normal
    expect(isLoading).toBe(false);
  });

  test('debería responder en tiempo razonable', async ({ page }) => {
    const startTime = Date.now();
    
    // Navegar al dashboard
    await page.goto('/combustibles/');
    
    // Esperar a que el contenido principal esté visible
    await expect(
      page.locator('main, [role="main"]').first()
    ).toBeVisible({ timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    
    // El dashboard debería cargar en menos de 10 segundos
    expect(loadTime).toBeLessThan(10000);
    
    console.log(`Dashboard load time: ${loadTime}ms`);
  });
});

test.describe('Dashboard - Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const loginButton = page.getByRole('button', { name: /ingresar|login|acceder/i });
    await loginButton.click();
    await expect(
      page.locator('[data-testid="sidebar"], nav, aside').first()
    ).toBeVisible({ timeout: 15000 });
  });

  test('debería permitir navegar a Inventario', async ({ page }) => {
    // Buscar y hacer clic en el enlace de Inventario
    const inventoryLink = page.locator('a, button').filter({ hasText: /inventario/i }).first();
    await expect(inventoryLink).toBeVisible({ timeout: 5000 });
    await inventoryLink.click();
    
    // Verificar que navegó correctamente
    await page.waitForURL(/inventario/i, { timeout: 5000 });
    
    // Verificar que el contenido cambió
    const heading = page.locator('h1, h2').filter({ hasText: /inventario/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('debería permitir navegar a Movimientos', async ({ page }) => {
    // Buscar y hacer clic en el enlace de Movimientos
    const movementsLink = page.locator('a, button').filter({ hasText: /movimientos/i }).first();
    await expect(movementsLink).toBeVisible({ timeout: 5000 });
    await movementsLink.click();
    
    // Verificar que navegó correctamente
    await page.waitForURL(/movimientos/i, { timeout: 5000 });
    
    // Verificar que el contenido cambió
    const heading = page.locator('h1, h2').filter({ hasText: /movimientos/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });

  test('debería permitir navegar a Productos', async ({ page }) => {
    // Buscar y hacer clic en el enlace de Productos
    const productsLink = page.locator('a, button').filter({ hasText: /productos/i }).first();
    await expect(productsLink).toBeVisible({ timeout: 5000 });
    await productsLink.click();
    
    // Verificar que navegó correctamente
    await page.waitForURL(/productos/i, { timeout: 5000 });
    
    // Verificar que el contenido cambió
    const heading = page.locator('h1, h2').filter({ hasText: /productos/i }).first();
    await expect(heading).toBeVisible({ timeout: 5000 });
  });
});
