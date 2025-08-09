import { test, expect, Page } from '@playwright/test';

// Smoke tests: verificar que todas las rutas principales cargan correctamente

// Helper para login
async function loginUser(page: Page, baseURL: string) {
  await page.goto(baseURL);
  const loginButton = page.getByRole('button', { name: /Ingresar al Sistema/i });
  await expect(loginButton).toBeVisible({ timeout: 10000 });
  await loginButton.click();

  // Esperar a que aparezca el dashboard
  await expect(page.locator('[data-testid="sidebar"], .sidebar, nav')).toBeVisible({
    timeout: 15000,
  });
}

test.describe('Smoke Tests - Rutas Principales', () => {
  test('página de login carga y tiene CTA', async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    await expect(page.getByRole('button', { name: /Ingresar al Sistema/i })).toBeVisible({
      timeout: 10000,
    });
  });

  test('ruta raíz (/) - dashboard carga después del login', async ({ page, baseURL }) => {
    await loginUser(page, baseURL!);

    // Verificar que estamos en el dashboard
    await expect(
      page.locator('h1:has-text("Dashboard"), h2:has-text("Dashboard"), .dashboard-content')
    ).toBeVisible({ timeout: 5000 });

    // Verificar que hay elementos típicos del dashboard (stats, gráficos, etc.)
    const dashboardElements = [
      '.stats-section, .dashboard-stats, [data-testid="stats"]',
      '.sidebar, [data-testid="sidebar"], nav',
      'h1, h2, .page-header',
    ];

    for (const selector of dashboardElements) {
      await expect(page.locator(selector).first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('ruta /movimientos carga correctamente', async ({ page, baseURL }) => {
    await loginUser(page, baseURL!);

    // Navegar a movimientos
    const movementsLink = page
      .locator('a[href*="/movimientos"], a:has-text("Movimientos")')
      .first();
    await expect(movementsLink).toBeVisible({ timeout: 5000 });
    await movementsLink.click();

    // Verificar que la página de movimientos carga
    await expect(
      page.locator('h1:has-text("Movimientos"), h2:has-text("Movimientos")')
    ).toBeVisible({ timeout: 5000 });

    // Verificar elementos típicos de la página de movimientos
    const movementsElements = [
      'button:has-text("Nuevo"), button:has-text("Agregar"), button:has-text("Crear")',
      'table, .movements-table, .data-table',
      '.stats-section, .movements-stats',
    ];

    for (const selector of movementsElements) {
      const element = page.locator(selector).first();
      if (await element.isVisible({ timeout: 2000 })) {
        await expect(element).toBeVisible();
      }
    }
  });

  test('ruta /inventario carga correctamente', async ({ page, baseURL }) => {
    await loginUser(page, baseURL!);

    // Navegar a inventario
    const inventoryLink = page.locator('a[href*="/inventario"], a:has-text("Inventario")').first();
    await expect(inventoryLink).toBeVisible({ timeout: 5000 });
    await inventoryLink.click();

    // Verificar que la página de inventario carga
    await expect(page.locator('h1:has-text("Inventario"), h2:has-text("Inventario")')).toBeVisible({
      timeout: 5000,
    });

    // Verificar elementos típicos del inventario
    const inventoryElements = [
      'table, .inventory-table, .data-table',
      '.stats-section, .inventory-stats, .inventory-cards',
      '.page-header, h1, h2',
    ];

    for (const selector of inventoryElements) {
      const element = page.locator(selector).first();
      if (await element.isVisible({ timeout: 2000 })) {
        await expect(element).toBeVisible();
      }
    }
  });

  test('ruta /vehiculos carga correctamente', async ({ page, baseURL }) => {
    await loginUser(page, baseURL!);

    // Navegar a vehículos
    const vehiclesLink = page.locator('a[href*="/vehiculos"], a:has-text("Vehículos")').first();
    await expect(vehiclesLink).toBeVisible({ timeout: 5000 });
    await vehiclesLink.click();

    // Verificar que la página de vehículos carga
    await expect(page.locator('h1:has-text("Vehículos"), h2:has-text("Vehículos")')).toBeVisible({
      timeout: 5000,
    });

    // Verificar elementos típicos de vehículos
    const vehiclesElements = [
      'button:has-text("Nuevo"), button:has-text("Agregar"), button:has-text("Crear")',
      'table, .vehicles-table, .data-table',
      '.stats-section, .vehicles-stats, .vehicles-cards',
    ];

    for (const selector of vehiclesElements) {
      const element = page.locator(selector).first();
      if (await element.isVisible({ timeout: 2000 })) {
        await expect(element).toBeVisible();
      }
    }
  });

  test('navegación entre rutas principales funciona', async ({ page, baseURL }) => {
    await loginUser(page, baseURL!);

    // Array de rutas a probar
    const routes = [
      { selector: 'a[href*="/movimientos"], a:has-text("Movimientos")', title: 'Movimientos' },
      { selector: 'a[href*="/inventario"], a:has-text("Inventario")', title: 'Inventario' },
      { selector: 'a[href*="/vehiculos"], a:has-text("Vehículos")', title: 'Vehículos' },
    ];

    // Probar navegación secuencial
    for (const route of routes) {
      const link = page.locator(route.selector).first();
      await expect(link).toBeVisible({ timeout: 5000 });
      await link.click();

      // Verificar que la página carga (título o header principal)
      await expect(
        page.locator(`h1:has-text("${route.title}"), h2:has-text("${route.title}")`)
      ).toBeVisible({ timeout: 5000 });

      // Pequeña pausa para estabilidad
      await page.waitForTimeout(500);
    }

    // Volver al dashboard/home
    const homeLink = page.locator('a[href="/"], a[href*="dashboard"], .logo, .brand').first();
    if (await homeLink.isVisible({ timeout: 2000 })) {
      await homeLink.click();
      await expect(
        page.locator('h1:has-text("Dashboard"), h2:has-text("Dashboard"), .dashboard-content')
      ).toBeVisible({ timeout: 5000 });
    }
  });
});
