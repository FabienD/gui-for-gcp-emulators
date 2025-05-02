import { SettingsType } from '../components/emulator/Settings';

export function buildEndpoint(
    settings: SettingsType,
    endpoint: string,
  ): string {
  
    return `http://${settings.host}:${settings.port}/v1/${settings.project_id}${endpoint}`;
  }