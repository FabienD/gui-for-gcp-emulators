import { test, expect } from './pubsub.fixtures';

test.use({ projectId: 'project_schema' });

test.describe('PubSub Schema', () => {
  // Connect and navigate before each test
  test.beforeEach(async ({ page, pubsubConnection, deletePubSubResources }) => {
    await deletePubSubResources.delete();
    await pubsubConnection.connect('/');
    await page.locator('#PubSub a').click();
    // Go to the Schema page
    await page.locator('button[role="tab"]:has-text("Schema")').click();
  });

  test('I should see the PubSub Schema page', async ({ page }) => {
    const heading = page.locator('main h1');
    await expect(heading).toHaveText('Pub/Sub');
    // Check if the Schema tab is selected
    await expect(page.locator('button[role="tab"][aria-selected="true"]:has-text("Schema")')).toBeVisible();
  });

  test('I can create a schema', async ({ page }) => {
    await page.locator('form #name').fill('test-schema');
    await page.locator('form #type').click();
    await page.getByRole('option', { name: 'AVRO' }).click();
    await page.locator('form #definition').fill('{"type": "record", "name": "test", "fields": [{"name": "field1", "type": "string"}]}');
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    // Verify the schema is created
    const alert = page.getByRole('alert');
    await expect(alert).toHaveText('Schema created');
    // Should see the new schema in the list
    const schemaRow = page.getByRole('row', { name: 'test-schema projects/project_schema' });
    await expect(schemaRow).toHaveCount(1);
  });

  test('I can\'t create a schema with an invalid name', async ({ page }) => {
    // Define invalid schema names
    const invalidNames = [
      '',
      'schema 2',
      '0schema',
      'schema-2!',
      'goog3'
    ];

    for (const name of invalidNames) {
      await page.locator('form #name').fill(name);
      await page.getByRole('button', { name: 'Create', exact: true }).click();

      await expect(page.locator('form #name-label')).toHaveClass(/Mui-error/);
    }
  });

  test('I can delete a schema', async ({ page }) => {
    // Create a schema first
    await page.locator('form #name').fill('schema-to-delete');
    await page.locator('form #type').click();
    await page.getByRole('option', { name: 'AVRO' }).click();
    await page.locator('form #definition').fill('{"type": "record", "name": "test", "fields": [{"name": "field1", "type": "string"}]}');
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    // Delete the schema
    const deleteButton = page.getByRole('row', { name: 'schema-to-delete projects/project_schema' }).getByRole('menuitem', { name: 'Delete' });
    await deleteButton.click();

    // Confirm deletion
    const confirmButton = page.getByRole('button', { name: 'Confirm' });
    await confirmButton.click();

    // Should not see the deleted schema in the list
    const schemaRow = page.getByRole('row', { name: 'schema-to-delete projects/project_schema' });
    await expect(schemaRow).toHaveCount(0);
  });

  test('I can view schema definition', async ({ page }) => {
    // Create a schema first
    await page.locator('form #name').fill('schema-info');
    await page.locator('form #type').click();
    await page.getByRole('option', { name: 'AVRO' }).click();
    await page.locator('form #definition').fill('{"type": "record", "name": "test", "fields": [{"name": "field1", "type": "string"}]}');
    await page.getByRole('button', { name: 'Create', exact: true }).click();

    // Verify the schema is in the list
    await expect(page.getByRole('row', { name: 'schema-info projects/project_schema' })).toHaveCount(1);

    // Click the info action
    const schemaRow = page.getByRole('row', { name: 'schema-info projects/project_schema' });
    await schemaRow.getByRole('menuitem', { name: 'Information' }).click();

    // Verify the definition dialog shows schema details
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('PubSub / Schema Definition')).toBeVisible();
    await expect(dialog.getByText('projects/project_schema/schemas/schema-info')).toBeVisible();
    await expect(dialog.getByText('AVRO')).toBeVisible();

    // Close the dialog
    await page.getByRole('button', { name: 'close' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
