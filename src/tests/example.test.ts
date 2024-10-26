import { expect, test } from '@playwright/test';

test.use({ baseURL: 'http://localhost:6344' });

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Pet Store/);
});
