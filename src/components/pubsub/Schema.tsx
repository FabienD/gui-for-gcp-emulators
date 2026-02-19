import React, { useContext } from 'react';

import Alert from '@mui/material/Alert';

import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
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

function Schema(): React.ReactElement {
  const { isConnected } = useContext(EmulatorContext) as EmulatorContextType;

  return isConnected() ? (
    <>
      <SchemaCreate />
      <SchemaList />
    </>
  ) : (
    <Alert severity="warning">
      The emulator is not configured or the connection is not validated.
    </Alert>
  );
}

export default Schema;
export type { SchemaType, SchemaNameType };
export { SchemaTypes };
