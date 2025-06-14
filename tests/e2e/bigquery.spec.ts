import { test, expect } from '@playwright/test';

test.describe('Bigquery - homepage', () => {

  test('I should see the Bigquery homepage', async ({ page }) => {
    await page.goto('/bigquery');
    const heading = page.locator('main h1');
    await expect(heading).toHaveText('BigQuery');
  });

  test('I should see an alert if the emulator is not connected', async ({
    page,
  }) => {
    await page.goto('/bigquery');
    const alert = page.getByRole('alert');
    const alertText = alert.locator('.MuiAlert-message');

    await expect(alertText).toHaveText(
      'The emulator is not configured or the connection is not validated.'
    );
  });
});
