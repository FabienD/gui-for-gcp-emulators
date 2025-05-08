import apiCall from './common';
import { buildEndpoint } from './firestore';
import { SettingsType } from '../components/emulator/Settings';
import { DatabaseType } from '../components/firestore/Database';

export async function getDatabases(
  settings: SettingsType,
): Promise<DatabaseType[]> {
  const content = await apiCall<{ databases: DatabaseType[] }>(
    buildEndpoint(settings, '/schemas'),
  );
  return content?.databases || [];
}
