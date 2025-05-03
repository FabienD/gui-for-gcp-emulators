import React from 'react';
import { DatabaseType } from './Database';

type DatabaseCreateProps = {
  databases: DatabaseType[];
  setDatabases: React.Dispatch<React.SetStateAction<DatabaseType[]>>;
};

function DatabaseCreate({
    databases,
    setDatabases,
}: DatabaseCreateProps): React.ReactElement {

    return (
        <div>
            <h1>Create Database</h1>
        </div>
    );
}
export default DatabaseCreate;