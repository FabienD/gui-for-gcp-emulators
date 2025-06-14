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
      'The emulator is not configured or the connection is not validated.',
    );
  });
});

test.describe('PubSub Topic - create', () => {
  test.beforeEach(
    async ({ page, deletePubSubResources, emulatorConnection }) => {
      await deletePubSubResources.delete();
      await emulatorConnection.connect(
        'pubsub',
        'localhost',
        '8085',
        'project_test',
      );
      await page.locator('#PubSub a').click();
    },
  );

  test("I can't create a topic with an invalid name", async ({ page }) => {
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
      'goog3',
    ]; // Non Exhaustive list of invalid names

    for (const name of invaluidNames) {
      await page.locator('form#topic_create #name').fill(name);
      await page.getByRole('button', { name: 'Create', exact: true }).click();
      await expect(page.locator('form #name-label')).toHaveClass(/Mui-error/);
    }
  });

  test('I can see no topics message for an empty topic list', async ({
    page,
  }) => {
    const alert = page.getByRole('alert');
    const alertText = alert.locator('.MuiAlert-message');

    await expect(alertText).toHaveText('No topics');
  });

  test('I can create topics, then I see them in the list', async ({ page }) => {
    // Create a first topic
    await page.locator('form#topic_create #name').fill('topic-1');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(
      page.getByRole('row', { name: 'topic-1 projects/project_test' }),
    ).toHaveCount(1);
    // Create a second topic
    await page.locator('form#topic_create #name').fill('topic-2');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(
      page.getByRole('row', { name: 'topic-2 projects/project_test' }),
    ).toHaveCount(1);
    // Count all topics in the list
    await expect(
      page.getByRole('row', { name: 'projects/project_test' }),
    ).toHaveCount(2);
  });

  test('I can create a topic with labels', async ({ page }) => {
    // Create a topic with labels
    await page.locator('form#topic_create #name').fill('topic-1');
    await page
      .locator('form#topic_create #labels')
      .fill('key1:value1, key2:value2');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(
      page.getByRole('row', { name: 'topic-1 projects/project_test' }),
    ).toHaveCount(1);
    // Check that the labels are displayed
    const row = page.getByRole('row', {
      name: 'topic-1 projects/project_test',
    });
    await expect(
      row.getByRole('gridcell', { name: 'key1:value1, key2:value2' }),
    ).toHaveCount(1);
  });

  test('I can create a topic with schema using the advanced form setting', async ({
    page,
    pubsubUtils,
  }) => {
    await pubsubUtils.createSchema({
      name: 'schema-1',
      type: 'AVRO',
      definition:
        '{"fields":[{"default":"","name":"ProductName","type":"string"},{"default":0,"name":"SKU","type":"int"},{"default":false,"name":"InStock","type":"boolean"}],"name":"Avro","type":"record"}',
    });

    await page.locator('form#topic_create #name').fill('topic-1');
    // Open the advanced form
    expect(page.locator('form#topic_create #schema-name')).not.toBeVisible();
    expect(
      page.locator('form#topic_create #schema-encoding'),
    ).not.toBeVisible();
    await page.getByRole('button', { name: 'Show advanced' }).click();
    expect(page.locator('form#topic_create #schema-name')).toBeVisible();
    expect(page.locator('form#topic_create #schema-encoding')).toBeVisible();

    // Select the schema from the dropdown
    await page.locator('#schema-name').click();
    await page.getByRole('option', { name: 'schema-1' }).click();
    await page.locator('#schema-encoding').click();
    await page.getByRole('option', { name: 'binary' }).click();

    await page.getByRole('button', { name: 'Create', exact: true }).click();

    await expect(
      page.getByRole('row', { name: 'topic-1 projects/project_test' }),
    ).toHaveCount(1);
  });
});
