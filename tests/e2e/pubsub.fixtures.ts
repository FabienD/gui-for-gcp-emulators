import { test as base, Page } from '@playwright/test';
import { createSubscription, getSubscriptions, deleteSubscription } from '../../src/api/pubsub.subscription';
import { SettingsType } from '../../src/components/emulator/Settings';
import { shortName } from '../../src/utils/pubsub';
import { deleteTopic, getTopics, createTopic, publishMessage } from '../../src/api/pubsub.topic';
import { createSchema, deleteSchema, getSchemas } from '../../src/api/pubsub.schema';
import { SchemaFormType } from '../../src/components/pubsub/SchemaCreate';

const defaultHost = 'localhost';
const defaultPort = 8085;

function makeSettings(projectId: string): SettingsType {
  return { host: defaultHost, port: defaultPort, project_id: projectId };
}

class PubSubConnectionPage {
  constructor(private page: Page, private projectId: string) {}
  async connect(connectionUrl: string) {
    await this.page.goto(connectionUrl);
    await this.page.getByRole('link', { name: 'Emulators', exact: true }).click();

    await this.page.fill('#host', defaultHost);
    await this.page.fill('#port', String(defaultPort));
    await this.page.fill('#project_id', this.projectId);

    await this.page.click('button:has-text("Connect")');
  }
}

class DeletePubSubResources {
  constructor(private settings: SettingsType) {}
  async delete() {

    const subscriptions = await getSubscriptions(this.settings);
    for (const subscription of subscriptions) {
      try {
        await deleteSubscription(this.settings, { name: subscription.name, short_name: shortName(subscription.name) });
      } catch {
        // Resource may already be deleted by another parallel worker
      }
    }

    const topics = await getTopics(this.settings);
    for (const topic of topics) {
      try {
        await deleteTopic(this.settings, { name: shortName(topic.name) });
      } catch {
        // Resource may already be deleted by another parallel worker
      }
    }

    const schemas = await getSchemas(this.settings);
    for (const schema of schemas) {
      try {
        await deleteSchema(this.settings, { name: shortName(schema.name) });
      } catch {
        // Resource may already be deleted by another parallel worker
      }
    }
  }
}

class PubSubUtils {
  constructor(private settings: SettingsType) {}

  async createTopic(topicName: string): Promise<void> {
    await createTopic(this.settings, { name: topicName });
  }

  async createSchema(schema: SchemaFormType): Promise<void> {
    await createSchema(this.settings, schema);
  }

  async createSubscription(subscriptionName: string, topicFullName: string): Promise<void> {
    await createSubscription(this.settings, { name: subscriptionName, topic: topicFullName, pushConfig: false });
  }

  async publishMessage(topicName: string, data: string): Promise<void> {
    await publishMessage(this.settings, { name: topicName }, { attributes: undefined, data });
  }
}

export const test = base.extend<{
  projectId: string;
  pubsubConnection: PubSubConnectionPage;
  deletePubSubResources: DeletePubSubResources;
  pubsubUtils: PubSubUtils;
}>({
  projectId: ['project_test', { option: true }],
  pubsubConnection: async ({ page, projectId }, use) => {
    await use(new PubSubConnectionPage(page, projectId));
  },
  deletePubSubResources: async ({ projectId }, use) => {
    await use(new DeletePubSubResources(makeSettings(projectId)));
  },
  pubsubUtils: async ({ projectId }, use) => {
    await use(new PubSubUtils(makeSettings(projectId)));
  },
});

export { expect } from '@playwright/test';
