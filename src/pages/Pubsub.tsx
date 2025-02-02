import React, { useCallback, useContext, useEffect, useState } from 'react';

import { Box, Tab } from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import Title from '../components/ui/Title';

import EmulatorContext, { EmulatorContextType } from '../contexts/emulators';
import { SettingsType } from '../components/emulator/Settings';
import Topic, { TopicType } from '../components/pubsub/Topic';
import Subscription from '../components/pubsub/Subscription';
import icon from '../assets/icons/pubsub.svg';
import { getTopics } from '../api/pubsub.topic';
import { ApiError } from '../api/common';
import Schema from '../components/pubsub/Schema';

function Pubsub(): React.ReactElement {
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const emulator = getEmulator();

  const [tabIndex, setTabIndex] = React.useState('1');
  const [topics, setTopics] = useState<TopicType[]>([]);

  const getTopicsCallback = useCallback(async (settings: SettingsType) => {
    try {
      const fetchedTopics = await getTopics(settings);
      setTopics(fetchedTopics);
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
        host: emulator.host,
        port: emulator.port,
        project_id: emulator.project_id,
      };
      getTopicsCallback(settings);
    }
  }, [emulator, getTopicsCallback]);

  return (
    <>
      <Title title="Pub/Sub" icon={icon} />

      <TabContext value={tabIndex}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="Pubsub resources">
            <Tab label="Topic" value="1" />
            <Tab label="Subscription" value="2" />
            <Tab label="Schema" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Topic
            topics={topics}
            setTopics={setTopics}
            getTopicsCallback={getTopicsCallback}
          />
        </TabPanel>
        <TabPanel value="2">
          <Subscription topics={topics} />
        </TabPanel>
        <TabPanel value="3">
          <Schema />
        </TabPanel>
      </TabContext>
    </>
  );
}

export default Pubsub;
