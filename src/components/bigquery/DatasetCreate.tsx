import React from 'react';
import { DatasetType } from './Dataset';

type DatasetCreateProps = {
  datasets: DatasetType[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>;
};

function DatasetCreate({
    //datasets,
    //setDatasets,
}: DatasetCreateProps): React.ReactElement {

    return (
        <div>
            <h1>Create Dataset</h1>
        </div>
    );
}
export default DatasetCreate;