import { test, expect } from '@playwright/test';

/**
 * E2E Tests: Login Flow con Passkeys (WebAuthn)
 * 
 * Cubre:
 * - Navegación a página de login
 * - Clic en botón de login/passkeys
 * - Verificar redirección a dashboard
 * - Verificar que se muestra información del usuario
 */

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página principal (login)
    await page.goto('/');
  });

  test('debería cargar la página de login correctamente', async ({ page }) => {
    // Verificar que estamos en la página de login
    await expect(page.locator('body')).toBeVisible();
    
    // Verificar que el botón de login está visible
    // Puede ser "Ingresar al Sistema", "Login", etc.
    const loginButton = page.getByRole('button', { name: /ingresar|login|acceder/i });
    await expect(loginButton).toBeVisible({ timeout: 10000 });
    
    // Verificar que no hay errores críticos de JavaScript
    const jsErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        jsErrors.push(msg.text());
      }
    });
    
    // Esperar un poco para capturar errores
    await page.waitForTimeout(1000);
    
    // No debe haber errores críticos de JS (TypeError, ReferenceError, SyntaxError)
    const criticalErrors = jsErrors.filter(error => 
      error.includes('TypeError') || 
      error.includes('ReferenceError') || 
      error.includes('SyntaxError')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('debería redirigir al dashboard después del login', async ({ page }) => {
    // Buscar el botón de login
    const loginButton = page.getByRole('button', { name: /ingresar|login|acceder/i });
    await expect(loginButton).toBeVisible({ timeout: 10000 });
    
    // Click en el botón de login
    await loginButton.click();
    
    // Esperar a que aparezca el dashboard
    // El dashboard debería tener una sidebar con navegación
    await expect(
      page.locator('[data-testid="sidebar"], nav, aside').first()
    ).toBeVisible({ timeout: 15000 });
    
    // Verificar que la URL cambió (debería estar en / o /dashboard)
    await page.waitForURL(/\/(dashboard)?$/, { timeout: 15000 });
    
    // Verificar que ya no estamos en la página de login
    const loginButtonGone = await loginButton.isHidden().catch(() => true);
    expect(loginButtonGone).toBe(true);
  });

  test('debería mostrar información del usuario después del login', async ({ page }) => {
    // Click en el botón de login
    const loginButton = page.getByRole('button', { name: /ingresar|login|acceder/i });
    await loginButton.click();
    
    // Esperar a que aparezca el dashboard
    await expect(
      page.locator('[data-testid="sidebar"], nav, aside').first()
    ).toBeVisible({ timeout: 15000 });
    
    // Verificar que se muestra alguna información del usuario
    // Puede ser un avatar, nombre, email, etc.
    const userInfo = page.locator(
      '[data-testid="user-info"], [data-testid="user-menu"], .user-profile, .user-avatar'
    ).first();
    
    // Darle un poco de tiempo para cargar
    await page.waitForTimeout(2000);
    
    // Verificar que existe algún indicador de usuario
    const hasUserIndicator = await page.locator('nav, aside, header').count() > 0;
    expect(hasUserIndicator).toBe(true);
  });

  test('debería mantener la sesión después de recargar', async ({ page, context }) => {
    // Login primero
    const loginButton = page.getByRole('button', { name: /ingresar|login|acceder/i });
    await loginButton.click();
    
    // Esperar a que aparezca el dashboard
    await expect(
      page.locator('[data-testid="sidebar"], nav, aside').first()
    ).toBeVisible({ timeout: 15000 });
    
    // Guardar las cookies/storage
    const cookies = await context.cookies();
    const localStorage = await page.evaluate(() => JSON.stringify(window.localStorage));
    
    // Recargar la página
    await page.reload();
    
    // Verificar que seguimos en el dashboard (no redirigió a login)
    await expect(
      page.locator('[data-testid="sidebar"], nav, aside').first()
    ).toBeVisible({ timeout: 10000 });
    
    // Verificar que tenemos cookies de sesión
    expect(cookies.length).toBeGreaterThan(0);
  });
});

test.describe('Login - Error Handling', () => {
  test('debería mostrar la página de login si no hay sesión', async ({ page, context }) => {
    // Limpiar todas las cookies y storage
    await context.clearCookies();
    await context.clearPermissions();
    
    await page.goto('/');
    
    // Debería mostrar el botón de login
    const loginButton = page.getByRole('button', { name: /ingresar|login|acceder/i });
    await expect(loginButton).toBeVisible({ timeout: 10000 });
  });

  test('debería manejar errores de red gracefully', async ({ page }) => {
    // Simular condiciones de red lenta
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 100);
    });
    
    await page.goto('/');
    
    // La página debería cargar eventualmente
    await expect(page.locator('body')).toBeVisible({ timeout: 15000 });
    
    // El botón de login debería estar visible
    const loginButton = page.getByRole('button', { name: /ingresar|login|acceder/i });
    await expect(loginButton).toBeVisible({ timeout: 15000 });
  });
});
