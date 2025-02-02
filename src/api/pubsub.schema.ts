import { SettingsType } from '../components/emulator/Settings';
import { SchemaType } from '../components/pubsub/Schema';
import apiCall from './common';

export async function getSchemas(
  settings: SettingsType,
): Promise<SchemaType[]> {
  const content = await apiCall<{ schemas: SchemaType[] }>(
    settings,
    '?feedbackSchemaView=FULL',
  );
  return content?.schemas || [];
}

export async function getSchema(
  settings: SettingsType,
  schema: SchemaType,
): Promise<SchemaType> {
  return await apiCall<SchemaType>(settings, `/schemas/${schema.name}`);
}
