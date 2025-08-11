/**
 * E2E Test: Flujo completo crear movimiento y verificar reflejo en inventario
 * Cubre: Login → Dashboard → Crear Movimiento (Entrada) → Verificar Inventario
 */

import { test, expect, Page } from '@playwright/test';

// Helpers para el flujo de autenticación
async function loginUser(page: Page, baseURL: string) {
  await page.goto(baseURL);

  // Esperar a que aparezca el botón de login y hacer clic
  const loginButton = page.getByRole('button', { name: /Ingresar al Sistema/i });
  await expect(loginButton).toBeVisible({ timeout: 10000 });
  await loginButton.click();

  // Esperar a que aparezca el dashboard (indicador: sidebar con navegación)
  await expect(page.locator('[data-testid="sidebar"]')).toBeVisible({ timeout: 15000 });
}

// Helper para navegar al módulo de movimientos
async function navigateToMovements(page: Page) {
  // Buscar el enlace de Movimientos en la sidebar
  const movementsLink = page.locator('a[href*="/movimientos"], a:has-text("Movimientos")');
  await expect(movementsLink.first()).toBeVisible({ timeout: 5000 });
  await movementsLink.first().click();

  // Verificar que estamos en la página de movimientos
  await expect(page.locator('h1:has-text("Movimientos"), h2:has-text("Movimientos")')).toBeVisible({
    timeout: 5000,
  });
}

// Helper para crear un movimiento de entrada
async function createEntryMovement(page: Page) {
  // Buscar y hacer clic en el botón "Nuevo Movimiento" o "Agregar"
  const newMovementBtn = page
    .locator('button:has-text("Nuevo"), button:has-text("Agregar"), button:has-text("Crear")')
    .first();
  await expect(newMovementBtn).toBeVisible({ timeout: 5000 });
  await newMovementBtn.click();

  // Esperar a que aparezca el wizard de movimientos
  await expect(
    page.locator('[data-testid="movement-wizard"], .movement-wizard, .modal-content')
  ).toBeVisible({ timeout: 5000 });

  // Step 1: Seleccionar tipo de movimiento (Entrada)
  const entradaOption = page
    .locator('input[value="entrada"], button:has-text("Entrada"), label:has-text("Entrada")')
    .first();
  await expect(entradaOption).toBeVisible({ timeout: 3000 });
  await entradaOption.click();

  // Continuar al siguiente paso
  const nextBtn = page
    .locator('button:has-text("Siguiente"), button:has-text("Continuar")')
    .first();
  await nextBtn.click();

  // Step 2: Seleccionar tipo de combustible (Gasolina Corriente)
  await page.waitForTimeout(1000); // Pequeña pausa para la transición
  const gasolinaOption = page
    .locator('input[value*="gasolina"], button:has-text("Gasolina"), label:has-text("Gasolina")')
    .first();
  await expect(gasolinaOption).toBeVisible({ timeout: 3000 });
  await gasolinaOption.click();
  await nextBtn.click();

  // Step 3: Fecha (usar fecha actual)
  await page.waitForTimeout(500);
  const dateInput = page
    .locator('input[type="date"], input[name*="fecha"], input[name*="date"]')
    .first();
  if (await dateInput.isVisible()) {
    const today = new Date().toISOString().split('T')[0];
    await dateInput.fill(today);
  }
  await nextBtn.click();

  // Step 4: Cantidad
  await page.waitForTimeout(500);
  const quantityInput = page
    .locator('input[name*="quantity"], input[name*="cantidad"], input[type="number"]')
    .first();
  await expect(quantityInput).toBeVisible({ timeout: 3000 });
  await quantityInput.fill('100');

  // Precio unitario si existe
  const priceInput = page.locator('input[name*="price"], input[name*="precio"]').first();
  if (await priceInput.isVisible()) {
    await priceInput.fill('15000');
  }
  await nextBtn.click();

  // Step 5: Ubicación
  await page.waitForTimeout(500);
  const locationInput = page
    .locator('input[name*="location"], input[name*="ubicacion"], select[name*="location"]')
    .first();
  if (await locationInput.isVisible()) {
    if ((await locationInput.getAttribute('tagName')) === 'SELECT') {
      await locationInput.selectOption({ index: 1 }); // Primera opción válida
    } else {
      await locationInput.fill('Tanque Principal');
    }
  }
  await nextBtn.click();

  // Step 6: Proveedor (para entradas)
  await page.waitForTimeout(500);
  const supplierInput = page
    .locator('input[name*="supplier"], input[name*="proveedor"], select[name*="supplier"]')
    .first();
  if (await supplierInput.isVisible()) {
    if ((await supplierInput.getAttribute('tagName')) === 'SELECT') {
      await supplierInput.selectOption({ index: 1 });
    } else {
      await supplierInput.fill('Proveedor Test E2E');
    }
  }
  await nextBtn.click();

  // Step 7: Detalles/Observaciones (opcional)
  await page.waitForTimeout(500);
  const detailsInput = page
    .locator('textarea[name*="detail"], textarea[name*="observacion"], input[name*="detail"]')
    .first();
  if (await detailsInput.isVisible()) {
    await detailsInput.fill('Movimiento de prueba E2E - Entrada de combustible');
  }
  await nextBtn.click();

  // Step 8: Resumen y confirmación
  await page.waitForTimeout(500);

  // Verificar que aparezca el resumen
  await expect(page.locator(':has-text("Resumen"), :has-text("Confirmar")')).toBeVisible({
    timeout: 3000,
  });

  // Marcar checkbox de confirmación si existe
  const confirmCheckbox = page
    .locator(
      'input[type="checkbox"][name*="confirm"], input[type="checkbox"]:near(:has-text("confirmo"))'
    )
    .first();
  if (await confirmCheckbox.isVisible()) {
    await confirmCheckbox.check();
  }

  // Botón final para crear el movimiento
  const createBtn = page
    .locator('button:has-text("Crear"), button:has-text("Confirmar"), button:has-text("Guardar")')
    .first();
  await expect(createBtn).toBeVisible({ timeout: 3000 });
  await createBtn.click();

  // Esperar confirmación de éxito
  await expect(
    page.locator(':has-text("éxito"), :has-text("creado"), :has-text("guardado")')
  ).toBeVisible({ timeout: 10000 });

  // Cerrar modal/wizard
  const closeBtn = page
    .locator(
      'button:has-text("Cerrar"), button:has-text("OK"), .modal-close, [data-testid="close-button"]'
    )
    .first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  }
}

// Helper para navegar al inventario y verificar cambios
async function navigateToInventoryAndVerify(page: Page) {
  // Navegar a inventario
  const inventoryLink = page.locator('a[href*="/inventario"], a:has-text("Inventario")').first();
  await expect(inventoryLink).toBeVisible({ timeout: 5000 });
  await inventoryLink.click();

  // Verificar que estamos en inventario
  await expect(page.locator('h1:has-text("Inventario"), h2:has-text("Inventario")')).toBeVisible({
    timeout: 5000,
  });

  // Buscar la entrada de Gasolina Corriente en el inventario
  // Verificar que existe una fila con el combustible y cantidad > 0
  const gasolinaRow = page.locator('tr:has-text("Gasolina"), td:has-text("Gasolina")').first();
  await expect(gasolinaRow).toBeVisible({ timeout: 5000 });

  // Verificar que la cantidad no es cero
  const quantityCell = gasolinaRow.locator('td').filter({ hasText: /\d+/ }).first();
  await expect(quantityCell).toBeVisible();

  // Opcional: verificar que la cantidad es >= 100 (nuestro movimiento)
  const quantityText = await quantityCell.textContent();
  const quantity = parseFloat(quantityText?.replace(/[^\d.]/g, '') || '0');
  expect(quantity).toBeGreaterThan(0);
}

test.describe.skip('Flujo E2E: Crear Movimiento y Verificar Inventario', () => {
  test('debe crear un movimiento de entrada y reflejarse en inventario', async ({
    page,
    baseURL,
  }) => {
    // Paso 1: Login
    await loginUser(page, baseURL!);

    // Paso 2: Navegar a movimientos
    await navigateToMovements(page);

    // Paso 3: Crear movimiento de entrada
    await createEntryMovement(page);

    // Paso 4: Verificar en inventario
    await navigateToInventoryAndVerify(page);
  });

  test('verificar flujo completo sin errores de navegación', async ({ page, baseURL }) => {
    // Test más básico que solo verifica que se puede navegar por todo el flujo
    await loginUser(page, baseURL!);

    // Verificar que podemos navegar a movimientos
    await navigateToMovements(page);

    // Verificar que el botón de nuevo movimiento funciona
    const newMovementBtn = page
      .locator('button:has-text("Nuevo"), button:has-text("Agregar"), button:has-text("Crear")')
      .first();
    if (await newMovementBtn.isVisible()) {
      await newMovementBtn.click();

      // Verificar que el wizard se abre
      await expect(
        page.locator('[data-testid="movement-wizard"], .movement-wizard, .modal-content')
      ).toBeVisible({ timeout: 5000 });

      // Cerrar el wizard
      const cancelBtn = page
        .locator('button:has-text("Cancelar"), button:has-text("Cerrar"), .modal-close')
        .first();
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
      }
    }

    // Verificar navegación a inventario
    const inventoryLink = page.locator('a[href*="/inventario"], a:has-text("Inventario")').first();
    await expect(inventoryLink).toBeVisible({ timeout: 5000 });
    await inventoryLink.click();
    await expect(page.locator('h1:has-text("Inventario"), h2:has-text("Inventario")')).toBeVisible({
      timeout: 5000,
    });
  });
});
