import { test, expect } from './pubsub.fixture';

test.describe('PubSub Topic', () => {

  test('I should see the PubSub Topic page', async ({ page }) => {
    await page.goto('/pubsub');
    const heading = page.locator('main h1');
    await expect(heading).toHaveText('Pub/Sub');
  });
  
  test('I should see an alert if the emulator is not connected', async ({ page }) => {
    await page.goto('/pubsub');
    const alert = page.getByRole('alert');
    const alertText = alert.locator('.MuiAlert-message');
    
    await expect(alertText).toHaveText('The emulator is not configured or the connection is not validated.');
  });

  test('I should see an empty list of topic if the emulator is connected', async ({ page, pubsubConnection }) => {
    await pubsubConnection.connect('/', 'localhost', '8085', 'test-project');
    await page.locator('#PubSub a').click();
    
    const alertText = page.getByRole('alert').locator('.MuiAlert-message');
    
    await expect(alertText).toHaveText('No topics');
  });
});

