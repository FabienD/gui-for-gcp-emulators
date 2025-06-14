import { test as base, Page } from '@playwright/test';

class EmulatorConnectionPage {
  constructor(private page: Page) { }
  async connect(type: string, host: string, port: string, projectId: string) {
    await this.page.goto('/settings');
        
    await this.page.locator('form#settings-' + type + ' #host').fill(host);
    await this.page.locator('form#settings-' + type + ' #port').fill(port);
    await this.page.locator('form#settings-' + type + ' #project_id').fill(projectId);
    await this.page.locator('form#settings-' + type + ' button').click();
  }
}

export const test = base.extend<{
  emulatorConnection: EmulatorConnectionPage;
}>({
    emulatorConnection: async ({ page }, use) => {
    await use(new EmulatorConnectionPage(page));
  },
});

export { expect } from '@playwright/test';