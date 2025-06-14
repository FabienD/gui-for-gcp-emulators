import React, { useCallback, useContext, useMemo, useState } from 'react';

import {
  AddCircleRounded,
  ChevronRight,
  ExpandCircleDownRounded,
  Refresh,
} from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

import { DatasetType, TableType } from './Models';
import EmulatorsContext, {
  EmulatorsContextType,
} from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';
import { getTable } from '../../api/bigquery.table';

type DatasetsListProps = {
  datasets: DatasetType[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>;
  getDatasetsCallback: (settings: SettingsType) => Promise<void>;
};

function DatasetsList({
  datasets,
  //setDatasets,
  getDatasetsCallback,
}: DatasetsListProps): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
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

  // On table click, set the selected table id, dataset id
  // and get the table schema
  const handleTableClick = (tableId: string, datasetId: string) => {
    // Call API to get table information
    // Display table information in the right panel
    const table = getTableAction(datasetId, tableId);
    console.log('Table clicked:', table);
  };

  const getTableAction = useCallback(
    async (datasetId: string, tableId: string) => {
      if (emulator != undefined) {
        getTable(
          {
            type: emulator.type,
            host: emulator.host,
            port: emulator.port,
            project_id: emulator.project_id,
          }, 
          {
            id: datasetId
          }, 
          {
            id: tableId
          } 
        ).then(table => {         
          setSelectedTable(table);
        }).catch(console.error);
      }
    },
    [emulator],
  );

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
                            handleTableClick(table.name, row.id);
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
            <Box className="flex-1 ml-10">
              <div className="flex flex-col gap-2">
                {selectedTable ? (
                  <div>
                    <p>Table ID: {selectedTable.id}</p>
                    <p>Schema: {JSON.stringify(selectedTable.schema)}</p>
                  </div>
                ) : (
                  <Alert severity="info">Select a table to view details</Alert>
                )}
              </div>
            </Box>
          </div>
        </>
      )}
    </>
  );
}
/* tslint:enable */
export default DatasetsList;
