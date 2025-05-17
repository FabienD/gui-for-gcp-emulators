import { buildEndpoint } from './bigquery';
import apiCall from './common';
import { DatasetType, TableType } from '../components/bigquery/Models';
import { SettingsType } from '../components/emulator/Settings';

export async function getTables(
  settings: SettingsType,
  dataset: DatasetType,
): Promise<TableType[]> {
  const content = await apiCall<{ tables: TableType[] }>(
    buildEndpoint(settings, `/datasets/${dataset.id}/tables`),
  );
  return content?.tables || [];
}

