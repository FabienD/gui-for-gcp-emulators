import { open } from '@tauri-apps/plugin-shell';

export async function openDocumentation(link: string) {
  await open(link);
}
