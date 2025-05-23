import React, { useContext } from 'react';

import Alert from '@mui/material/Alert';

import DatabaseCreate from './DatabaseCreate';
import DatabaseList from './DatabasesList';
import { DatabaseType } from './Models';
import EmulatorsContext, {
  EmulatorsContextType,
} from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';

type DatabasesProps = {
  databases: DatabaseType[];
  setDatabases: React.Dispatch<React.SetStateAction<DatabaseType[]>>;
  getDatabasesCallback: (settings: SettingsType) => Promise<void>;
};

function Dataset({
  databases,
  setDatabases,
  getDatabasesCallback,
}: DatabasesProps): React.ReactElement {
  const { isConnected } = useContext(EmulatorsContext) as EmulatorsContextType;
  const isFirestoreConnected = isConnected('firestore');

  return isFirestoreConnected ? (
    <>
      <DatabaseCreate databases={databases} setDatabases={setDatabases} />
      <DatabaseList
        databases={databases}
        setDatabases={setDatabases}
        getDatabasesCallback={getDatabasesCallback}
      />
    </>
  ) : (
    <Alert severity={isFirestoreConnected ? 'info' : 'warning'}>
      The emulator is not configured or the connection is not validated.
    </Alert>
  );
}

export default Dataset;
export type { DatabaseType };
