import { test, expect } from './pubsub.fixture';

test.describe('PubSub Topic', () => {
  test('I should see the PubSub Topic page', async ({ page }) => {
    await page.goto('/pubsub');
    const heading = page.locator('main h1');
    await expect(heading).toHaveText('Pub/Sub');
  });

  test('I should see an alert if the emulator is not connected', async ({
    page,
  }) => {
    await page.goto('/pubsub');
    const alert = page.getByRole('alert');
    const alertText = alert.locator('.MuiAlert-message');

    await expect(alertText).toHaveText(
      'The emulator is not configured or the connection is not validated.',
    );
  });

  test('I can create a topic, then see it in the list', async ({
    page,
    pubsubConnection,
  }) => {
    await pubsubConnection.connect('/', 'localhost', '8085', 'test-project');
    await page.locator('#PubSub a').click();

    const topicName = 'topic-1';
    await page.locator('form #name').fill(topicName);

    await page.getByRole('button', { name: 'Create', exact: true }).click();
  });
});
