import { test, expect } from '@playwright/test';

// Minimal smoke test: login shell renders and routes exist

test('login page renders and has CTA', async ({ page, baseURL }) => {
  await page.goto(baseURL!);
  await expect(page.getByRole('button', { name: /Ingresar al Sistema/i })).toBeVisible({ timeout: 10000 });
});
