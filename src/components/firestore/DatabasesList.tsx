import React from 'react';
import { DatabaseType } from './Database';
import { SettingsType } from '../emulator/Settings';

type DatabasesListProps = {
    databases: DatabaseType[];
    setDatabases: React.Dispatch<React.SetStateAction<DatabaseType[]>>;
    getDatabasesCallback: (settings: SettingsType) => Promise<void>;
  };

function DatabasesList({
    //databases,
    //setDatabases,
    //getDatabasesCallback,
}: DatabasesListProps): React.ReactElement {
    
    return (
        <div>
            <h1>Databases list</h1>
       </div>
    );
}
export default DatabasesList;