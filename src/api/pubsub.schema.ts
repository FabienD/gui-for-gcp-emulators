import { SettingsType } from '../components/emulator/Settings';
import { SchemaNameType, SchemaType } from '../components/pubsub/Schema';
import { SchemaFormType } from '../components/pubsub/SchemaCreate';
import apiCall from './common';

export async function getSchemas(
  settings: SettingsType,
): Promise<SchemaType[]> {
  const content = await apiCall<{ schemas: SchemaType[] }>(
    settings,
    '/schemas',
  );
  return content?.schemas || [];
}

export async function getSchema(
  settings: SettingsType,
  schema: SchemaType,
): Promise<SchemaType> {
  return await apiCall<SchemaType>(settings, `/schemas/${schema.name}`);
}

export async function createSchema(
  settings: SettingsType,
  schema: SchemaFormType,
): Promise<SchemaType> {
  const body = {
    type: schema.type,
    definition: schema.definition,
  };

  return await apiCall<SchemaType>(
    settings,
    `/schemas?schemaId=${schema.name}`,
    'POST',
    body,
  );
}

export async function deleteSchema(
  settings: SettingsType,
  schemaName: SchemaNameType,
): Promise<boolean> {
  await apiCall<void>(settings, `/schemas/${schemaName.name}`, 'DELETE');
  return true;
}
