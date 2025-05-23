import { test, expect } from '@playwright/test';

test('I should see the home page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/GUI for GCP emulator/);
});
