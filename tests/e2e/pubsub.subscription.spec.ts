import { test, expect } from './pubsub.fixtures';

// Helper function to create a topic via UI
async function createTopic(page: any, topicName: string) {
  await page.locator('button[role="tab"]:has-text("Topic")').click();
  await page.locator('form #name').fill(topicName);
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByRole('row', { name: `${topicName} projects/project_test` })).toHaveCount(1);
  await page.locator('button[role="tab"]:has-text("Subscription")').click(); // Go back to subscription tab
}

test.describe('PubSub Subscription', () => {
  // Connect and navigate before each test
  test.beforeEach(async ({ page, pubsubConnection, deletePubSubResources }) => {
    await deletePubSubResources.delete();
    await pubsubConnection.connect('/', 'localhost', '8085', 'project_test');
    await page.locator('#PubSub a').click();
    // Go to the Subscription page
    await page.locator('button[role="tab"]:has-text("Subscription")').click();
  });

  test('I should see the PubSub Subscription page', async ({ page }) => {
    const heading = page.locator('main h1');
    await expect(heading).toHaveText('Pub/Sub');
    await expect(page.locator('button[role="tab"][aria-selected="true"]:has-text("Subscription")')).toBeVisible();
  });

  test('I should see a warning if no topics exist', async ({ page }) => {
    // Ensure no topics exist (deletePubSubResources should handle this)
    const alert = page.getByRole('alert');
    await expect(alert).toHaveText(
      'At least one topic is needed to create a subscription.'
    );
  });

  test('I should see no subscriptions message when a topic exists but no subscriptions', async ({ page }) => {
    // Create a topic first
    await createTopic(page, 'topic-for-sub-test');

    // Check for the "No subscriptions" message
    const alert = page.getByRole('alert');
    await expect(alert).toHaveText('No subscriptions');
  });

  test('I can\'t create a subscription with an invalid name', async ({ page }) => {
    await createTopic(page, 'topic-for-sub-test');

    // Select a topic from the dropdown
    await page.locator('#topic').click();
    await page.getByRole('option', { name: 'projects/project_test/topics/topic-for-sub-test' }).click();

    // Define invalid subscription names
    const invalidNames = [
      '',
      'sub 2',
      '0sub',
      'sub-2!',
      'goog3'
      // Add other invalid patterns as needed
    ];

    for (const name of invalidNames) {
      await page.locator('form#subscription_create input#name').fill(name);
      await page.locator('form#subscription_create button:has-text("Create")').click();
      // Check for error state on the input field
      await expect(page.locator('form#subscription_create label[for="name"]')).toHaveClass(/Mui-error/);
    }
  });

   test('I can create a subscription, then I see it in the list', async ({ page }) => {
    const topicName = 'my-topic-for-subs';
    const subName = 'my-subscription-1';
    await createTopic(page, topicName);

    // Fill the subscription form
    await page.locator('form#subscription_create input#name').fill(subName);
    await page.locator('#topic').click(); // Click to open the dropdown
    await page.getByRole('option', { name: `projects/project_test/topics/${topicName}` }).click();
    await page.locator('form#subscription_create button:has-text("Create")').click();

    // Verify the subscription appears in the list
    await expect(page.getByRole('row', { name: subName })).toBeVisible();
    await expect(page.getByRole('row', { name: subName })).toContainText(topicName); // Check topic association
    await expect(page.getByRole('row')).toHaveCount(2); // Header row + 1 subscription row
  });

  test('I can delete a subscription', async ({ page }) => {
    const topicName = 'topic-to-delete-sub';
    const subName = 'sub-to-delete';
    await createTopic(page, topicName);

    // Create a subscription
    await page.locator('form#subscription_create input#name').fill(subName);
    await page.locator('#topic').click();
    await page.getByRole('option', { name: `projects/project_test/topics/${topicName}` }).click();
    await page.locator('form#subscription_create button:has-text("Create")').click();
    await expect(page.getByRole('row', { name: subName })).toBeVisible();

    // Delete the subscription
    const subRow = page.locator('[data-id="projects/project_test/subscriptions/' + subName + '"]');
    await subRow.getByRole('menuitem', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click(); // Adjust button text if needed

    // Verify the subscription is removed from the list
    await expect(page.getByRole('row', { name: `projects/project_test/subscriptions/${subName}` })).not.toBeVisible();
    await expect(page.locator('.MuiAlert-standardInfo')).toHaveText('No subscriptions');
  });

  // Add more tests for pull, purge, push config etc. as needed
});

