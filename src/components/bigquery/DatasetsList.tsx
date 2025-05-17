import React, { useContext, useMemo, useState } from 'react';

import {
  AddCircleRounded,
  ChevronRight,
  ExpandCircleDownRounded,
  Refresh,
} from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

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

type TableIdType = {
  tableId: string;
};

function DatasetsList({
  datasets,
  //setDatasets,
  getDatasetsCallback,
}: DatasetsListProps): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [datasetId, setDatasetId] = useState<DatasetIdType | null>(null);
  const [tableId, setTableId] = useState<TableIdType | null>(null);

  const { getEmulator } = useContext(EmulatorsContext) as EmulatorsContextType;
  const emulator = getEmulator('bigquery');

  console.debug('DatasetId:', datasetId); // To remove
  console.debug('tableId:', tableId); // To remove

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

  // On table click, set the selected table id, dataset id
  // and get the table schema
  const handleTableClick = (tableId: string, datasetId: string) => {
    setTableId({ tableId });
    setDatasetId({ datasetId });
    console.log('Selected table:', tableId);
  };

  const rows = useMemo(
    () =>
      datasets.map((dataset: DatasetType) => ({
        id: dataset.id,
        name: dataset.id,
        tables: dataset.tables?.map(table => ({
          id: table.id,
          name: table.tableReference.tableId,
        })),
      })),
    [datasets],
  );

  function ExpandIcon(
    props: React.PropsWithoutRef<typeof ExpandCircleDownRounded>,
  ) {
    return (
      <AddCircleRounded {...props} sx={{ opacity: 0.8 }} color="primary" />
    );
  }

  function CollapseIcon(props: React.PropsWithoutRef<typeof AddCircleRounded>) {
    return (
      <ExpandCircleDownRounded
        {...props}
        sx={{ opacity: 0.8 }}
        color="primary"
      />
    );
  }

  function EndIcon(props: React.PropsWithoutRef<typeof AddCircleRounded>) {
    return <ChevronRight {...props} sx={{ opacity: 0.8 }} color="primary" />;
  }

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
          <div className="mt-10 w-full flex">
            <Box sx={{ maxWidth: 250 }} className="flex-1">
              <SimpleTreeView
                defaultExpandedItems={['root']}
                slots={{
                  expandIcon: ExpandIcon,
                  collapseIcon: CollapseIcon,
                  endIcon: EndIcon,
                }}
              >
                {rows.map(row => {
                  return (
                    // List datasets, for each dataset, list tables
                    <TreeItem key={row.id} label={row.name} itemId={row.id}>
                      {row.tables?.map(table => (
                        <TreeItem
                          key={table.id}
                          label={table.name}
                          itemId={table.id}
                          onClick={() => {
                            handleTableClick(table.id, row.id);
                          }}
                        />
                      ))}
                    </TreeItem>
                  );
                })}
              </SimpleTreeView>
              <Box className="mt-5">
                <Button onClick={handleDatasetsRefresh} startIcon={<Refresh />}>
                  Datasets list
                </Button>
              </Box>
            </Box>
            <Box className="flex-1 ml-10"></Box>
          </div>
        </>
      )}
    </>
  );
}
/* tslint:enable */
export default DatasetsList;
