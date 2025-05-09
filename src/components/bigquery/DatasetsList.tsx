import React, { useContext, useMemo, useState } from 'react';

import { AddCircleRounded, ExpandCircleDownRounded, Refresh } from '@mui/icons-material';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { styled, alpha } from '@mui/material/styles';

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

  const rows = useMemo(
    () =>
      datasets.map((dataset: DatasetType) => ({
        id: dataset.id,
        name: dataset.id,
      })),
    [datasets],
  );

  function ExpandIcon(props: React.PropsWithoutRef<typeof ExpandCircleDownRounded>) {
    return <ExpandCircleDownRounded {...props} sx={{ opacity: 0.8 }} color='primary'/>;
  }
  
  function CollapseIcon(props: React.PropsWithoutRef<typeof AddCircleRounded>,
  ) {
    return <AddCircleRounded {...props} sx={{ opacity: 0.8 }} color='primary' />;
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
          <div className="mt-10 w-full flex" >
            <Box sx={{ maxWidth: 250 }} className="flex-1">
              <SimpleTreeView 
                defaultExpandedItems={['root']}
                slots={{
                  expandIcon: ExpandIcon,
                  collapseIcon: CollapseIcon,
                  endIcon: CollapseIcon,
                }}
              >
                {rows.map((row) => { 
                  return (
                    <TreeItem
                      key={row.id}
                      label={row.name} 
                      itemId={row.id} 
                      onClick={() => {
                        console.log('Selected dataset:', row.id);
                        setDatasetId({ datasetId: row.id });
                      }}
                    />
                  );
                }
                )}
              </SimpleTreeView>
              <Box className="mt-5">
                <Button onClick={handleDatasetsRefresh} startIcon={<Refresh />}>
                  Datasets list
                </Button>
              </Box>
            </Box>
            <Box className="flex-1 ml-10">
              // On Dataset selection, list tables 
            </Box>
          </div>
        </>
      )}
    </>
  );
}
/* tslint:enable */
export default DatasetsList;

