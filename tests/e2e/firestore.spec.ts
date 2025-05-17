import { test, expect } from '@playwright/test';

test.describe('Firestore - homepage', () => {

  test('I should see the Firestore homepage', async ({ page }) => {
    await page.goto('/firestore');
    const heading = page.locator('main h1');
    await expect(heading).toHaveText('Firestore');
  });

  test('I should see an alert if the emulator is not connected', async ({
    page,
  }) => {
    await page.goto('/firestore');
    const alert = page.getByRole('alert');
    const alertText = alert.locator('.MuiAlert-message');

    await expect(alertText).toHaveText(
      'The emulator is not configured or the connection is not validated.'
    );
  });
});
