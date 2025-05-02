import React from 'react';
import { DatasetType } from './Dataset';
import { SettingsType } from '../emulator/Settings';

type DatasetListProps = {
    datasets: DatasetType[];
    setDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>;
    getDatasetCallback: (settings: SettingsType) => Promise<void>;
  };

function DatasetList({
    datasets,
    setDatasets,
    getDatasetCallback,
}: DatasetListProps): React.ReactElement {

    return (
        <div>
            <h1>Dataset list</h1>
       </div>
    );
}
export default DatasetList;