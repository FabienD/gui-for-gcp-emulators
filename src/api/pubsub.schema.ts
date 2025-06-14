import apiCall from './common';
import { buildEndpoint } from './pubsub';
import { SettingsType } from '../components/emulator/Settings';
import { SchemaNameType, SchemaType } from '../components/pubsub/Schema';
import { SchemaFormType } from '../components/pubsub/SchemaCreate';

export async function getSchemas(
  settings: SettingsType,
): Promise<SchemaType[]> {
  const content = await apiCall<{ schemas: SchemaType[] }>(
    buildEndpoint(settings, '/schemas'),
  );
  return content?.schemas || [];
}

export async function getSchema(
  settings: SettingsType,
  schema: SchemaNameType,
): Promise<SchemaType> {
  return await apiCall<SchemaType>(
    buildEndpoint(settings, `/schemas/${schema.name}`),
  );
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
    buildEndpoint(settings, `/schemas?schemaId=${schema.name}`),
    'POST',
    body,
  );
}

export async function deleteSchema(
  settings: SettingsType,
  schemaName: SchemaNameType,
): Promise<boolean> {
  await apiCall<void>(
    buildEndpoint(settings, `/schemas/${schemaName.name}`),
    'DELETE',
  );
  return true;
}
