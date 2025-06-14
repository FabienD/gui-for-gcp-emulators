import { test as base, Page } from './common.fixtures';
import { getSubscriptions, deleteSubscription } from '../../src/api/pubsub.subscription';
import { SettingsType } from '../../src/components/emulator/Settings';
import { shortName } from '../../src/utils/pubsub';
import { deleteTopic, getTopics, createTopic } from '../../src/api/pubsub.topic';
import { createSchema, deleteSchema, getSchemas } from '../../src/api/pubsub.schema';
import { SchemaFormType } from '../../src/components/pubsub/SchemaCreate';

const settings: SettingsType = {
  type: 'pubsub',
  host: 'localhost',
  port: 8085,
  project_id: 'project_test',
}

class DeletePubSubResources {
  constructor(private page: Page) {}
  async delete() {

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

class PubSubUtils {
  constructor(private page: Page) {}

  async createTopic(topicName: string): Promise<void> {
    await createTopic(settings, { name: topicName });   
  }

  async createSchema(schema: SchemaFormType): Promise<void> {
    await createSchema(settings, schema);
  }
}

export const test = base.extend<{
  deletePubSubResources: DeletePubSubResources;
  pubsubUtils: PubSubUtils;
}>({
  deletePubSubResources: async ({ page }, use) => {
    await use(new DeletePubSubResources(page));
  },
  pubsubUtils: async ({ page }, use) => {
    await use(new PubSubUtils(page));
  },
});

export { expect } from '@playwright/test';