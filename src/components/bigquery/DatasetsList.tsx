import React from 'react';
import { DatasetType } from './Dataset';
import { SettingsType } from '../emulator/Settings';

type DatasetsListProps = {
    datasets: DatasetType[];
    setDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>;
    getDatasetsCallback: (settings: SettingsType) => Promise<void>;
  };

  
function DatasetsList({
    // datasets,
    // setDatasets,
    // getDatasetsCallback,
}: DatasetsListProps): React.ReactElement {

    return (
        <div>
            <h1>Dataset list</h1>
       </div>
    );
}
/* tslint:enable */
export default DatasetsList;