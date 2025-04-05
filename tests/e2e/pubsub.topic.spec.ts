import { test, expect } from './pubsub.fixtures';


test.describe('PubSub Topic - homepage', () => {

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
      'The emulator is not configured or the connection is not validated.'
    );
  });
});


test.describe('PubSub Topic - create', () => {

  test.beforeEach(async ({ deletePubSubResources }) => {
    await deletePubSubResources.delete();
  });

  test('I can\'t create a topic with an invalid name', async ({
    page,
    pubsubConnection,
  }) => {
    await pubsubConnection.connect('/', 'localhost', '8085', 'project_test');
    await page.locator('#PubSub a').click();

    const invaluidNames = [
      '',
      'topic 2',
      '0topic',
      'topic-2!',
      'topic-2@',
      'topic-2#',
      'topic-2$',
      'topic-2^',
      'topic2&q',
      'topic2*',
      'topic2(',
      'topic-2)',
      'goog3'
    ]; // Non Exhaustive list of invalid names

    for (const name of invaluidNames) {
      await page.locator('form #name').fill(name);
      await page.getByRole('button', { name: 'Create', exact: true }).click();
      await expect(page.locator('form #name-label')).toHaveClass(/Mui-error/);
    }
  });

  test('I can see no topics message for an empty topic list', async ({
    page,
    pubsubConnection,
  }) => {
    await pubsubConnection.connect('/', 'localhost', '8085', 'project_test');
    await page.locator('#PubSub a').click();

    const alert = page.getByRole('alert');
    const alertText = alert.locator('.MuiAlert-message');

    await expect(alertText).toHaveText(
      'No topics'
    );
  });

  test('I can create topics, then I see them in the list', async ({
    page,
    pubsubConnection,
  }) => {
    await pubsubConnection.connect('/', 'localhost', '8085', 'project_test');
    await page.locator('#PubSub a').click();

    await page.locator('form #name').fill('topic-1');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByRole('row', { name: 'topic-1 projects/project_test' })).toHaveCount(1);

    await page.locator('form #name').fill('topic-2');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByRole('row', { name: 'topic-2 projects/project_test' })).toHaveCount(1);

    await expect(page.getByRole('row', { name: 'projects/project_test' })).toHaveCount(2);
  });
});