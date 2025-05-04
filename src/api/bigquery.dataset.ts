import { SettingsType } from '../components/emulator/Settings';
import { DatasetType } from '../components/bigquery/Dataset';
import { DatasetFormType } from '../components/bigquery/DatasetCreate';
import { buildEndpoint } from './bigquery';
import apiCall from './common';

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
