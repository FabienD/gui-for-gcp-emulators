import React, { useCallback, useContext, useEffect, useState } from 'react';

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { TopicNameType, TopicType } from './Topic';
import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';
import { labelsToString, shortName } from '../../utils/pubsub';
import { getTopic } from '../../api/pubsub.topic';

type TopicDefinitionProps = {
  open: boolean;
  topicName: TopicNameType | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function TopicDefinition({
  open,
  topicName,
  setOpen,
}: TopicDefinitionProps): React.ReactElement {
  const handleClose = () => setOpen(false);
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = React.useState<TopicType | undefined>(undefined);
  const emulator = getEmulator();

  const getTopicCallback = useCallback(
    async (settings: SettingsType, topicName: TopicNameType) => {
      setLoading(true);
      setError(null);
      try {
        const fetchedTopic = await getTopic(settings, topicName);
        setTopic(fetchedTopic);
      } catch (err) {
        setError('Error fetching topic details.');
        console.error('Error fetching topic details:', err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (emulator && topicName) {
      const settings: SettingsType = {
        host: emulator.host,
        port: emulator.port,
        project_id: emulator.project_id,
      };
      getTopicCallback(settings, topicName);
    }
  }, [topicName, emulator, getTopicCallback]);

  const renderContent = () => {
    if (loading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <CircularProgress />
        </div>
      );
    }

    if (error) {
      return (
        <Typography color="error" align="center" variant="body1">
          {error}
        </Typography>
      );
    }

    if (topic) {
      return (
        <>
          <Box padding={2} border={1} borderRadius={2}>
            <Typography variant="h6">
              Name: <em>{shortName(topic.name)}</em>
            </Typography>
            <Typography variant="body1">
              <em>{topic.name}</em>
            </Typography>
            <Typography variant="h6">Labels</Typography>
            <Typography variant="body1">
              {topic.labels === undefined ? '--' : labelsToString(topic)}
            </Typography>
            <Typography variant="h6">Message Retention Duration (s)</Typography>
            <Typography variant="body1">
              {topic.messageRetentionDuration === undefined
                ? '--'
                : topic.messageRetentionDuration}
            </Typography>
            <Typography variant="h6">Schema</Typography>
            <Typography variant="body1">
              {topic.schemaSettings === undefined
                ? '--'
                : topic.schemaSettings.schema +
                  ' / ' +
                  topic.schemaSettings.encoding}
            </Typography>
          </Box>
        </>
      );
    }

    return null;
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle color="primary">Topic Definition</DialogTitle>
      <DialogContent>{renderContent()}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TopicDefinition;
