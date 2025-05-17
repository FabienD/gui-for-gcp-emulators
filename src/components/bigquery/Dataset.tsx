import React, { useContext } from 'react';

import Alert from '@mui/material/Alert';

import DatasetCreate from './DatasetCreate';
import DatasetsList from './DatasetsList';
import { DatasetType } from './Models';
import EmulatorsContext, {
  EmulatorsContextType,
} from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';

type DatasetsProps = {
  datasets: DatasetType[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>;
  getDatasetsCallback: (settings: SettingsType) => Promise<void>;
};

function Dataset({
  datasets,
  setDatasets,
  getDatasetsCallback,
}: DatasetsProps): React.ReactElement {
  const { isConnected } = useContext(EmulatorsContext) as EmulatorsContextType;
  const isBigqueryConnected = isConnected('bigquery');

  return isBigqueryConnected ? (
    <>
      <DatasetCreate datasets={datasets} setDatasets={setDatasets} />
      <DatasetsList
        datasets={datasets}
        setDatasets={setDatasets}
        getDatasetsCallback={getDatasetsCallback}
      />
    </>
  ) : (
    <Alert severity={isBigqueryConnected ? 'info' : 'warning'}>
      The emulator is not configured or the connection is not validated.
    </Alert>
  );
}

export default Dataset;
