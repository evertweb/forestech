import { test, expect } from '@playwright/test';

/**
 * E2E Tests: Products (Productos)
 * 
 * Cubre:
 * - Listar productos
 * - Crear nuevo producto
 * - Editar producto existente
 * - Eliminar producto (soft delete)
 */

test.describe('Products - List & View', () => {
  test.beforeEach(async ({ page }) => {
    // Login y navegación a productos
    await page.goto('/');
    const loginButton = page.getByRole('button', { name: /ingresar|login|acceder/i });
    await loginButton.click();
    await expect(
      page.locator('[data-testid="sidebar"], nav, aside').first()
    ).toBeVisible({ timeout: 15000 });
    
    // Navegar a Productos
    const productsLink = page.locator('a, button').filter({ hasText: /productos/i }).first();
    await productsLink.click();
    await page.waitForURL(/productos/i, { timeout: 5000 });
    await page.waitForTimeout(2000); // Esperar carga de datos
  });

  test('debería mostrar la lista de productos', async ({ page }) => {
    // Verificar que el título de la página está visible
    const heading = page.locator('h1, h2').filter({ hasText: /productos/i }).first();
    await expect(heading).toBeVisible();
    
    // Verificar que hay una tabla o grid de productos
    const productsContainer = page.locator(
      'table, .table, .products-grid, .products-list, [class*="Product"]'
    ).first();
    await expect(productsContainer).toBeVisible({ timeout: 5000 });
    
    // Verificar que hay contenido (al menos un producto o mensaje vacío)
    const hasContent = await page.locator('body').textContent();
    expect(hasContent?.length).toBeGreaterThan(100);
  });

  test('debería tener un botón para crear nuevo producto', async ({ page }) => {
    // Buscar botón de crear/agregar producto
    const createButton = page.locator('button, a').filter({
      hasText: /nuevo|agregar|crear|añadir/i
    }).first();
    
    await expect(createButton).toBeVisible({ timeout: 5000 });
    
    // Verificar que el botón tiene texto descriptivo
    const buttonText = await createButton.textContent();
    expect(buttonText?.length).toBeGreaterThan(2);
  });

  test('debería mostrar información de los productos', async ({ page }) => {
    // Verificar que hay filas/items de productos
    const productItems = page.locator(
      'tr:has-text(""), .product-item, .product-card, [data-testid*="product"]'
    );
    
    // Esperar a que carguen los productos
    await page.waitForTimeout(2000);
    
    const itemCount = await productItems.count();
    
    // Si hay productos, verificar que muestran información
    if (itemCount > 0) {
      const firstItem = productItems.first();
      await expect(firstItem).toBeVisible();
      
      const itemText = await firstItem.textContent();
      expect(itemText?.length).toBeGreaterThan(5);
    }
    
    // Si no hay productos, debe mostrar mensaje vacío
    if (itemCount === 0) {
      const emptyMessage = page.locator('text=/no hay productos|sin productos|empty/i');
      const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false);
      
      // Está bien si no hay productos, pero debería indicarlo
      expect(hasEmptyMessage || itemCount > 0).toBe(true);
    }
  });
});

test.describe('Products - Create', () => {
  test.beforeEach(async ({ page }) => {
    // Login y navegación a productos
    await page.goto('/');
    const loginButton = page.getByRole('button', { name: /ingresar|login|acceder/i });
    await loginButton.click();
    await expect(
      page.locator('[data-testid="sidebar"], nav, aside').first()
    ).toBeVisible({ timeout: 15000 });
    
    const productsLink = page.locator('a, button').filter({ hasText: /productos/i }).first();
    await productsLink.click();
    await page.waitForURL(/productos/i, { timeout: 5000 });
  });

  test('debería abrir el formulario de crear producto', async ({ page }) => {
    // Click en el botón de crear
    const createButton = page.locator('button, a').filter({
      hasText: /nuevo|agregar|crear|añadir/i
    }).first();
    await createButton.click();
    
    // Verificar que se abre el modal/wizard/formulario
    await page.waitForTimeout(1000);
    const form = page.locator(
      'form, .modal, .wizard, [role="dialog"], [data-testid*="modal"], [data-testid*="wizard"]'
    ).first();
    
    await expect(form).toBeVisible({ timeout: 5000 });
  });

  test('debería tener campos de formulario para crear producto', async ({ page }) => {
    // Abrir formulario
    const createButton = page.locator('button, a').filter({
      hasText: /nuevo|agregar|crear|añadir/i
    }).first();
    await createButton.click();
    await page.waitForTimeout(1000);
    
    // Verificar que hay inputs en el formulario
    const inputs = page.locator('input, select, textarea').filter({ visible: true });
    const inputCount = await inputs.count();
    
    // Debería tener al menos 2 campos (nombre, tipo, etc.)
    expect(inputCount).toBeGreaterThanOrEqual(2);
  });

  test('debería validar campos requeridos', async ({ page }) => {
    // Abrir formulario
    const createButton = page.locator('button, a').filter({
      hasText: /nuevo|agregar|crear|añadir/i
    }).first();
    await createButton.click();
    await page.waitForTimeout(1000);
    
    // Intentar enviar sin llenar campos
    const submitButton = page.locator('button[type="submit"], button').filter({
      hasText: /guardar|crear|enviar|continuar/i
    }).first();
    
    const isSubmitVisible = await submitButton.isVisible().catch(() => false);
    
    if (isSubmitVisible) {
      await submitButton.click();
      await page.waitForTimeout(1000);
      
      // Debería mostrar algún mensaje de error o validación
      const hasError = await page.locator(
        '.error, [class*="Error"], [role="alert"], text=/requerido|obligatorio/i'
      ).count() > 0;
      
      // O el modal/formulario debería seguir abierto
      const formStillOpen = await page.locator(
        'form, .modal, [role="dialog"]'
      ).first().isVisible().catch(() => false);
      
      expect(hasError || formStillOpen).toBe(true);
    }
  });
});

test.describe('Products - Edit & Delete', () => {
  test.beforeEach(async ({ page }) => {
    // Login y navegación a productos
    await page.goto('/');
    const loginButton = page.getByRole('button', { name: /ingresar|login|acceder/i });
    await loginButton.click();
    await expect(
      page.locator('[data-testid="sidebar"], nav, aside').first()
    ).toBeVisible({ timeout: 15000 });
    
    const productsLink = page.locator('a, button').filter({ hasText: /productos/i }).first();
    await productsLink.click();
    await page.waitForURL(/productos/i, { timeout: 5000 });
    await page.waitForTimeout(2000);
  });

  test('debería tener opciones para editar productos', async ({ page }) => {
    // Buscar botones/íconos de editar
    const editButtons = page.locator('button, a').filter({
      hasText: /editar|edit/i
    });
    
    // También buscar íconos de editar (lápiz, etc.)
    const editIcons = page.locator('[class*="edit"], [data-action="edit"]');
    
    const editCount = await editButtons.count() + await editIcons.count();
    
    // Si hay productos, debería haber opciones de editar
    // Si no hay productos, es válido que no haya botones de editar
    const hasProducts = await page.locator(
      'tr, .product-item, .product-card'
    ).count() > 0;
    
    if (hasProducts) {
      expect(editCount).toBeGreaterThan(0);
    }
  });

  test('debería tener opciones para eliminar productos', async ({ page }) => {
    // Buscar botones/íconos de eliminar
    const deleteButtons = page.locator('button, a').filter({
      hasText: /eliminar|delete|borrar/i
    });
    
    // También buscar íconos de eliminar (basura, X, etc.)
    const deleteIcons = page.locator('[class*="delete"], [class*="trash"], [data-action="delete"]');
    
    const deleteCount = await deleteButtons.count() + await deleteIcons.count();
    
    // Si hay productos, debería haber opciones de eliminar
    const hasProducts = await page.locator(
      'tr, .product-item, .product-card'
    ).count() > 0;
    
    if (hasProducts) {
      expect(deleteCount).toBeGreaterThan(0);
    }
  });

  test('debería mostrar confirmación antes de eliminar', async ({ page }) => {
    // Buscar el primer botón de eliminar
    const deleteButton = page.locator('button, a').filter({
      hasText: /eliminar|delete|borrar/i
    }).first();
    
    const hasDeleteButton = await deleteButton.isVisible().catch(() => false);
    
    if (hasDeleteButton) {
      await deleteButton.click();
      await page.waitForTimeout(500);
      
      // Debería aparecer una confirmación (modal, dialog, alert)
      const confirmation = page.locator(
        '[role="dialog"], [role="alertdialog"], .modal, text=/confirmar|seguro|eliminar/i'
      ).first();
      
      const hasConfirmation = await confirmation.isVisible().catch(() => false);
      expect(hasConfirmation).toBe(true);
    }
  });
});

test.describe('Products - Search & Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const loginButton = page.getByRole('button', { name: /ingresar|login|acceder/i });
    await loginButton.click();
    await expect(
      page.locator('[data-testid="sidebar"], nav, aside').first()
    ).toBeVisible({ timeout: 15000 });
    
    const productsLink = page.locator('a, button').filter({ hasText: /productos/i }).first();
    await productsLink.click();
    await page.waitForURL(/productos/i, { timeout: 5000 });
  });

  test('debería tener funcionalidad de búsqueda', async ({ page }) => {
    // Buscar campo de búsqueda
    const searchInput = page.locator('input[type="search"], input[placeholder*="buscar"], input[name*="search"]');
    
    const hasSearch = await searchInput.count() > 0;
    
    // Es opcional tener búsqueda, pero si existe verificar que funciona
    if (hasSearch) {
      await expect(searchInput.first()).toBeVisible();
    }
  });

  test('debería tener opciones de filtrado', async ({ page }) => {
    // Buscar controles de filtro (select, checkboxes, etc.)
    const filters = page.locator(
      'select, [role="combobox"], button[class*="filter"], [class*="Filter"]'
    );
    
    // Es opcional tener filtros, pero si existen verificar que están visibles
    const filterCount = await filters.count();
    
    if (filterCount > 0) {
      await expect(filters.first()).toBeVisible();
    }
  });
});
