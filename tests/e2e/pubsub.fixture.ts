import { test as base, Page } from '@playwright/test';

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

export const test = base.extend<{
  pubsubConnection: PubSubConnectionPage
}>({
  pubsubConnection: async ({ page }, use) => {
    await use(new PubSubConnectionPage(page));
  },
});

export { expect } from '@playwright/test';