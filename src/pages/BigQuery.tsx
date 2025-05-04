import React, { useCallback, useContext, useEffect, useState } from 'react';

import { Box, Tab } from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import Title from '../components/ui/Title';

import EmulatorsContext, { EmulatorsContextType } from '../contexts/emulators';
import { SettingsType } from '../components/emulator/Settings';

import icon from '../assets/icons/bigquery.svg';
import Dataset, { DatasetType } from '../components/bigquery/Dataset';
import { getDatasets } from '../api/bigquery.dataset';
import { ApiError } from '../api/common';

function BigQuery(): React.ReactElement {
  const { getEmulator } = useContext(EmulatorsContext) as EmulatorsContextType;
  const emulator = getEmulator('bigquery');

  const [tabIndex, setTabIndex] = React.useState('1');
  const [datasets, setDatasets] = useState<DatasetType[]>([]);
  
  const getDatasetsCallback = useCallback(async (settings: SettingsType) => {
    try {
      const fetchedDatasets = await getDatasets(settings);
      setDatasets(fetchedDatasets);
    } catch (error) {
      if (error instanceof ApiError) {
        console.error(
          `API Error: ${error.message} (Status: ${error.statusCode})`,
        );
      } else {
        console.error('Unexpected error', error);
      }
    }
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };
  
  useEffect(() => {
    if (emulator) {
      const settings: SettingsType = {
        type: emulator.type,
        host: emulator.host,
        port: emulator.port,
        project_id: emulator.project_id,
      };
      getDatasetsCallback(settings);
    }
  }, [emulator, getDatasetsCallback]);

  return (
    <>
      <Title title="BigQuery" icon={icon} />

      <TabContext value={tabIndex}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="Bigquery resources">
            <Tab label="Datasets" value="1" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Dataset
            datasets={datasets}
            setDatasets={setDatasets}
            getDatasetsCallback={getDatasetsCallback}
          />
        </TabPanel>
      </TabContext>
    </>
  );
}

export default BigQuery;
