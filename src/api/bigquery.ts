import { SettingsType } from '../components/emulator/Settings';

export function buildEndpoint(
    settings: SettingsType,
    endpoint: string,
  ): string {
  
    return `http://${settings.host}:${settings.port}/bigquery/v2/projects/${settings.project_id}${endpoint}`;
  }