import React, { useContext } from 'react';

import Alert from '@mui/material/Alert';

import EmulatorsContext, { EmulatorsContextType } from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';
import SchemaCreate from './SchemaCreate';
import SchemaList from './SchemaList';

enum SchemaTypes {
  PROTOCOL_BUFFER = 'Protocol Buffer',
  AVRO = 'Avro',
}

type SchemaNameType = {
  name: string;
};

type SchemaType = SchemaNameType & {
  readonly type: SchemaTypes;
  readonly definition: string;
  readonly revisionId: string;
  readonly revisionCreateTime: string;
};

type SchemasProps = {
  schemas: SchemaType[];
  setSchemas: React.Dispatch<React.SetStateAction<SchemaType[]>>;
  getSchemasCallback: (settings: SettingsType) => Promise<void>;
};

function Schema({
  schemas,
  setSchemas,
  getSchemasCallback,
}: SchemasProps): React.ReactElement {
  const { isConnected } = useContext(EmulatorsContext) as EmulatorsContextType;
  const isPubSubConnected = isConnected('pubsub');
  
  return isPubSubConnected ? (
    <>
      <SchemaCreate schemas={schemas} setSchemas={setSchemas} />
      <SchemaList
        schemas={schemas}
        setSchemas={setSchemas}
        getSchemasCallback={getSchemasCallback}
      />
    </>
  ) : (
    <Alert severity={isPubSubConnected ? 'info' : 'warning'}>
      The emulator is not configured or the connection is not validated.
    </Alert>
  );
}

export default Schema;
export type { SchemaType, SchemaNameType };
export { SchemaTypes };
