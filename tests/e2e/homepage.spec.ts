import { test, expect } from '@playwright/test';

test('I should see the home page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/GUI for GCP emulator/);
});


test('I should be able to connect to the Pub/Sub emulator', async ({ page }) => {
  await page.goto('/');

  // Fill in the emulator connection form
  await page.fill('#host', 'localhost');
  await page.fill('#port', '8085');
  await page.fill('#project_id', 'test-project');

  // Click the "Connect" button
  await page.click('button:has-text("Connect")');

  // Verify the success alert is displayed
  const alert = await page.getByRole('alert');
  const alertText = await alert.locator('.MuiAlert-message');
  await expect(alertText).toHaveText('Emulator is connected.');
});


test('I should be able to see error when the emulator connection failed', async ({ page }) => {
  await page.goto('/');

  // Fill in the emulator connection form
  await page.fill('#host', 'localhost');
  await page.fill('#port', '8088');
  await page.fill('#project_id', 'test-project');

  // Click the "Connect" button
  await page.click('button:has-text("Connect")');

  // Verify the success alert is displayed
  const alert = await page.getByRole('alert');
  const alertText = await alert.locator('.MuiAlert-message');
  await expect(alertText).toHaveText('Unable to connect.');
});
