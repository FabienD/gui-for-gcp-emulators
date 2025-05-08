import React, { useContext, useMemo, useState } from 'react';

import { Refresh } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import InfoIcon from '@mui/icons-material/Info';
import { Alert, Button, CircularProgress, Tooltip } from '@mui/material';
import {
  GridColDef,
  GridActionsCellItem,
  GridRowId,
  DataGrid,
} from '@mui/x-data-grid';

import { DatasetType } from './Models';
import EmulatorsContext, {
  EmulatorsContextType,
} from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';

type DatasetsListProps = {
  datasets: DatasetType[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>;
  getDatasetsCallback: (settings: SettingsType) => Promise<void>;
};

type DatasetIdType = {
  datasetId: string;
};

function DatasetsList({
  datasets,
  //setDatasets,
  getDatasetsCallback,
}: DatasetsListProps): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [datasetId, setDatasetId] = useState<DatasetIdType | null>(null);

  const { getEmulator } = useContext(EmulatorsContext) as EmulatorsContextType;
  const emulator = getEmulator('bigquery');

  const handleDatasetsRefresh = () => {
    if (emulator != undefined) {
      setLoading(true);
      getDatasetsCallback({
        type: emulator.type,
        host: emulator.host,
        port: emulator.port,
        project_id: emulator.project_id,
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  const handleActionClick = (
    action: 'delete' | 'definition',
    id: GridRowId,
  ) => {
    setDatasetId({
      datasetId: id.toString(),
    });

    console.debug(datasetId);

    if (action === 'delete') {
      //setDatasetToDelete({ datasetId });
      //setConfirmOpen(true);
    } else if (action === 'definition') {
      //setOpenTopicDefinition(true);
    }
  };

  const columns: GridColDef[] = useMemo(
    () => [
      {
        headerName: 'ID',
        field: 'id',
        minWidth: 50,
      },
      {
        headerName: 'Name',
        field: 'name',
        flex: 1,
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        minWidth: 150,
        cellClassName: 'actions',
        getActions: ({ id }) => [
          <Tooltip title="Information" key={`information-${id}`}>
            <GridActionsCellItem
              icon={<InfoIcon />}
              label="Information"
              onClick={() => handleActionClick('definition', id)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip title="Delete" key={`delete-${id}`}>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleActionClick('delete', id)}
              color="inherit"
            />
          </Tooltip>,
        ],
      },
    ],
    [handleActionClick],
  );

  const rows = useMemo(
    () =>
      datasets.map((dataset: DatasetType) => ({
        id: dataset.id,
        name: dataset.id,
      })),
    [datasets],
  );

  return (
    <>
      {loading ? (
        <div className="flex justify-center mt-10">
          <CircularProgress />
        </div>
      ) : datasets.length === 0 ? (
        <Alert severity="info" className="my-5">
          No Datasets
        </Alert>
      ) : (
        <>
          <div className="mt-10 w-full">
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10]}
            />
            <Button onClick={handleDatasetsRefresh} startIcon={<Refresh />}>
              Datasets list
            </Button>
          </div>
        </>
      )}
    </>
  );
}
/* tslint:enable */
export default DatasetsList;
