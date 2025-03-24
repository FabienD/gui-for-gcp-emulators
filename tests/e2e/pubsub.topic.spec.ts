import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/pubsub');
});


test.describe('PubSub Topic', () => {

  test('I should see the PubSub Topic page', async ({ page }) => {
    
    const heading = await page.locator('main h1');
    await expect(heading).toHaveText('Pub/Sub');
  });
  
  test('I should see an alert if the emulator is not connected', async ({ page }) => {
    
    const alert = await page.getByRole('alert');
    const alertText = await alert.locator('.MuiAlert-message');
    
    await expect(alertText).toHaveText('The emulator is not configured or the connection is not validated.');
  });

  test('I should see an empty list of topic if the emulator is connected', async ({ page }) => {
    

    const alert = await page.getByRole('alert');
    const alertText = await alert.locator('.MuiAlert-message');
    
    await expect(alertText).toHaveText('No Topics');
  });
});

