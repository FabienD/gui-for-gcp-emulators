import { buildEndpoint } from './bigquery';
import apiCall from './common';
import { DatasetType, TableType, DatasetIdType, TableIdType } from '../components/bigquery/Models';
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

export async function getTable(
  settings: SettingsType,
  datasetId: DatasetIdType,
  tableId: TableIdType,
): Promise<TableType | null> {
  const content = await apiCall<TableType>(
    buildEndpoint(settings, `/datasets/${datasetId.id}/tables/${tableId.id}`),
  );
  return content ? content : null;
}

