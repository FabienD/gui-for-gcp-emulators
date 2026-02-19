import { test, expect } from './pubsub.fixtures';

test.use({ projectId: 'project_topic' });

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

  test.beforeEach(async ({ page, pubsubConnection, deletePubSubResources }) => {
    await deletePubSubResources.delete();
    await pubsubConnection.connect('/');
    await page.locator('#PubSub a').click();
  });

  test('I can\'t create a topic with an invalid name', async ({ page }) => {
    const invalidNames = [
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

    for (const name of invalidNames) {
      await page.locator('form#topic_create #name').fill(name);
      await page.getByRole('button', { name: 'Create', exact: true }).click();
      await expect(page.locator('form #name-label')).toHaveClass(/Mui-error/);
    }
  });

  test('I can see no topics message for an empty topic list', async ({ page }) => {
    const alert = page.getByRole('alert');
    const alertText = alert.locator('.MuiAlert-message');

    await expect(alertText).toHaveText(
      'No topics'
    );
  });

  test('I can create topics, then I see them in the list', async ({ page }) => {
    // Create a first topic
    await page.locator('form#topic_create #name').fill('topic-1');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByRole('row', { name: 'topic-1 projects/project_topic' })).toHaveCount(1);
    // Create a second topic
    await page.locator('form#topic_create #name').fill('topic-2');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByRole('row', { name: 'topic-2 projects/project_topic' })).toHaveCount(1);
    // Count all topics in the list
    await expect(page.getByRole('row', { name: 'projects/project_topic' })).toHaveCount(2);
  });

  test('I can create a topic with labels', async ({ page }) => {
    // Create a topic with labels
    await page.locator('form#topic_create #name').fill('topic-1');
    await page.locator('form#topic_create #labels').fill('key1:value1, key2:value2');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByRole('row', { name: 'topic-1 projects/project_topic' })).toHaveCount(1);
    // Check that the labels are displayed
    const row = page.getByRole('row', { name: 'topic-1 projects/project_topic' });
    await expect(row.getByRole('gridcell', { name: 'key1:value1, key2:value2'})).toHaveCount(1);
  });

  test('I can create a topic with schema using the advanced form setting', async ({
    page,
    pubsubUtils
  }) => {
    await pubsubUtils.createSchema({
      name: 'schema-1',
      type: 'AVRO',
      definition:'{"fields":[{"default":"","name":"ProductName","type":"string"},{"default":0,"name":"SKU","type":"int"},{"default":false,"name":"InStock","type":"boolean"}],"name":"Avro","type":"record"}',
    });

    // Refresh to pick up API-created schema
    await page.locator('button[role="tab"]:has-text("Schema")').click();
    await page.locator('button[role="tab"]:has-text("Topic")').click();

    await page.locator('form#topic_create #name').fill('topic-1');
    // Open the advanced form
    await expect(page.locator('form#topic_create #schema-name')).not.toBeVisible();
    await expect(page.locator('form#topic_create #schema-encoding')).not.toBeVisible();
    await page.getByRole('button', { name: 'Show advanced' }).click();
    await expect(page.locator('form#topic_create #schema-name')).toBeVisible();
    await expect(page.locator('form#topic_create #schema-encoding')).toBeVisible();

    // Select the schema from the dropdown
    await page.locator('#schema-name').click();
    await page.getByRole('option', { name: 'schema-1'}).click();
    await page.locator('#schema-encoding').click();
    await page.getByRole('option', { name: 'binary'}).click();

    await page.getByRole('button', { name: 'Create', exact: true }).click();

    await expect(page.getByRole('row', { name: 'topic-1 projects/project_topic' })).toHaveCount(1);
  });

  test('I can delete a topic', async ({ page }) => {
    // Create a topic
    await page.locator('form#topic_create #name').fill('topic-to-delete');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByRole('row', { name: 'topic-to-delete projects/project_topic' })).toHaveCount(1);

    // Click the delete action on the topic row
    const topicRow = page.locator('[data-id="topic-to-delete"]');
    await topicRow.getByRole('menuitem', { name: 'Delete' }).click();

    // Confirm deletion
    await page.getByRole('button', { name: 'Confirm' }).click();

    // Verify the topic is removed
    await expect(page.getByRole('row', { name: 'topic-to-delete' })).toHaveCount(0);
    await expect(page.locator('.MuiAlert-standardInfo')).toHaveText('No topics');
  });

  test('I can view topic definition', async ({ page }) => {
    // Create a topic with labels
    await page.locator('form#topic_create #name').fill('topic-info');
    await page.locator('form#topic_create #labels').fill('env:test');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByRole('row', { name: 'topic-info projects/project_topic' })).toHaveCount(1);

    // Click the info action
    const topicRow = page.locator('[data-id="topic-info"]');
    await topicRow.getByRole('menuitem', { name: 'Information' }).click();

    // Verify the definition dialog shows topic details
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('PubSub / Topic Definition')).toBeVisible();
    await expect(dialog.getByText('projects/project_topic/topics/topic-info')).toBeVisible();

    // Close the dialog
    await page.getByRole('button', { name: 'close' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('I can publish a message to a topic', async ({ page }) => {
    // Create a topic
    await page.locator('form#topic_create #name').fill('topic-publish');
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByRole('row', { name: 'topic-publish projects/project_topic' })).toHaveCount(1);

    // Click the publish message action
    const topicRow = page.locator('[data-id="topic-publish"]');
    await topicRow.getByRole('menuitem', { name: 'Publish a message' }).click();

    // Verify the publish dialog opens
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Publish message')).toBeVisible();

    // Fill the message and publish
    await page.locator('#pubsub-message-data').fill('{"hello": "world"}');
    await page.getByRole('button', { name: 'Publish' }).click();

    // Verify success
    await expect(page.getByText('Message is published')).toBeVisible();

    // Close the dialog
    await page.getByRole('button', { name: 'close' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
