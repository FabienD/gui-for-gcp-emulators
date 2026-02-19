import React from 'react';

import { Box, Tab } from '@mui/material';
import { TabPanel, TabContext, TabList } from '@mui/lab';
import Title from '../components/ui/Title';

import Topic from '../components/pubsub/Topic';
import Subscription from '../components/pubsub/Subscription';
import Schema from '../components/pubsub/Schema';
import icon from '../assets/icons/pubsub.svg';

function Pubsub(): React.ReactElement {
  const [tabIndex, setTabIndex] = React.useState('1');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
  };

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
          <Topic />
        </TabPanel>
        <TabPanel value="2">
          <Subscription />
        </TabPanel>
        <TabPanel value="3">
          <Schema />
        </TabPanel>
      </TabContext>
    </>
  );
}

export default Pubsub;
