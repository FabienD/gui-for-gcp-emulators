import { test as base, Page } from '@playwright/test';
import { getSubscriptions, deleteSubscription } from '../../src/api/pubsub.subscription';
import { SettingsType } from '../../src/components/emulator/Settings';
import { shortName } from '../../src/utils/pubsub';
import { deleteTopic, getTopics } from '../../src/api/pubsub.topic';
import { deleteSchema, getSchemas } from '../../src/api/pubsub.schema';

export class PubSubConnectionPage {
  constructor(private page: Page) {}
  async connect(connectionUrl: string, host: string, port: string, projectId: string) {
    await this.page.goto(connectionUrl);
    await this.page.getByRole('link', { name: 'Emulators', exact: true }).click();

    await this.page.fill('#host', host);
    await this.page.fill('#port', port);
    await this.page.fill('#project_id', projectId);

    await this.page.click('button:has-text("Connect")');
  }
}

export class DeletePubSubResources {
  constructor(private page: Page) {}
  async delete() {
    const settings: SettingsType = {
      host: 'localhost',
      port: 8085,
      project_id: 'project_test',
    }  
    
    const subscriptions = await getSubscriptions(settings);
    if (subscriptions.length !== 0) {
      for (const subscription of subscriptions) {
          deleteSubscription(settings, { name: subscription.name, short_name: shortName(subscription.name) });
      }
    }
    
    const topics = await getTopics(settings);
    if (topics.length !== 0) {
      for (const topic of topics) {
          deleteTopic(settings, { name: shortName(topic.name) });
      }
    }
    
    const schemas = await getSchemas(settings);
    if (schemas.length !== 0) {
      for (const schema of schemas) {
        deleteSchema(settings, { name: shortName(schema.name) });
      }
    }  
  }
}

export const test = base.extend<{
  pubsubConnection: PubSubConnectionPage;
  deletePubSubResources: DeletePubSubResources;
}>({
  pubsubConnection: async ({ page }, use) => {
    await use(new PubSubConnectionPage(page));
  },
  deletePubSubResources: async ({ page }, use) => {
    await use(new DeletePubSubResources(page));
  },
});

export { expect } from '@playwright/test';