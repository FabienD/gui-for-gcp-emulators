import { SettingsType } from '../components/emulator/Settings';
import { DatasetType } from '../components/bigquery/Dataset';
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