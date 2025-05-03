import React, { useCallback, useContext, useEffect, useState } from 'react';

import { Box, Tab } from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import Title from '../components/ui/Title';

import EmulatorsContext, { EmulatorsContextType } from '../contexts/emulators';
import { SettingsType } from '../components/emulator/Settings';

import icon from '../assets/icons/firestore.svg';
import Database, { DatabaseType } from '../components/firestore/Database';
import { getDatabases } from '../api/firestore.database';
import { ApiError } from '../api/common';


function Firestore(): React.ReactElement {
  const { getEmulator } = useContext(EmulatorsContext) as EmulatorsContextType;
  const emulator = getEmulator('bigquery');

  const [tabIndex, setTabIndex] = React.useState('1');
  const [databases, setDatabases] = useState<DatabaseType[]>([]);
  
  const getDatabasesCallback = useCallback(async (settings: SettingsType) => {
    try {
      const fetchedDatabases = await getDatabases(settings);
      setDatabases(fetchedDatabases);
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
      getDatabasesCallback(settings);
    }
  }, [emulator, getDatabasesCallback]);

  return (
    <>
      <Title title="Firestore" icon={icon} />

      <TabContext value={tabIndex}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="Firestore resources">
            <Tab label="Databases" value="1" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Database
            databases={databases}
            setDatabases={setDatabases}
            getDatabasesCallback={getDatabasesCallback}
          />
        </TabPanel>
      </TabContext>
    </>
  );
}

export default Firestore;
