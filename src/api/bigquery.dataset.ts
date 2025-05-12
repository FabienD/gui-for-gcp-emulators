import { buildEndpoint } from './bigquery';
import apiCall from './common';
import { DatasetFormType } from '../components/bigquery/DatasetCreate';
import { DatasetType } from '../components/bigquery/Models';
import { SettingsType } from '../components/emulator/Settings';
import { getTables } from './bigquery.table';

export async function getDatasets(
  settings: SettingsType,
): Promise<DatasetType[]> {
  const content = await apiCall<{ datasets: DatasetType[] }>(
    buildEndpoint(settings, '/datasets'),
  );
  return content?.datasets || [];
}

export async function createDataset(
  settings: SettingsType,
  dataset: DatasetFormType,
): Promise<DatasetType> {
  const body = {
    datasetReference: {
      datasetId: dataset.id,
      projectId: settings.project_id,
    },
  };

  return await apiCall<DatasetType>(
    buildEndpoint(settings, `/datasets`),
    'POST',
    body,
  );
}

export async function getDatasetsWithTables(
  settings: SettingsType,
): Promise<DatasetType[]> {
  const datasets = await getDatasets(settings);
  const datasetsWithTables = await Promise.all(
    datasets.map(async (dataset) => {
      const tables = await getTables(settings, dataset);
      return { ...dataset, tables };
    }),
  );

  console.debug('Datasets with tables:', datasetsWithTables);

  return datasetsWithTables;
}