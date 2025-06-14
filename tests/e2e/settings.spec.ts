import { test, expect } from '@playwright/test';

test('I should be able to connect to the Pub/Sub emulator', async ({
  page,
}) => {
  await page.goto('/settings');

  // Fill in the emulator connection form
  await page.fill('form#settings-pubsub #host', 'localhost');
  await page.fill('form#settings-pubsub #port', '8085');
  await page.fill('form#settings-pubsub #project_id', 'project_test');

  // Click the "Connect" button
  await page.click('form#settings-pubsub button:has-text("Check & Save")');

  // Verify the success alert is displayed
  const alert = await page.getByRole('alert');
  const alertText = await alert.locator('.MuiAlert-message');
  await expect(alertText).toHaveText('Emulator is connected.');
});

test('I should be able to see error when the PuSub emulator connection failed', async ({
  page,
}) => {
  await page.goto('/settings');

  // Fill in the emulator connection form
  await page.fill('form#settings-pubsub #host', 'fake_host');
  await page.fill('form#settings-pubsub #port', '8085');
  await page.fill('form#settings-pubsub #project_id', 'project_test');

  // Click the "Connect" button
  await page.click('form#settings-pubsub button:has-text("Check & Save")');

  // Verify the success alert is displayed
  const alert = await page.getByRole('alert');
  const alertText = await alert.locator('.MuiAlert-message');
  await expect(alertText).toHaveText('Unable to connect.');
});
