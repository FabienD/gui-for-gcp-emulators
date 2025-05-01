import React, { useCallback, useContext, useEffect, useState } from 'react';

import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { TopicNameType, TopicType } from './Topic';
import EmulatorsContext, { EmulatorsContextType } from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';
import { labelsToString, shortName } from '../../utils/pubsub';
import { getTopic } from '../../api/pubsub.topic';
import CloseButton from '../ui/CloseButton';

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
  const { getEmulator } = useContext(EmulatorsContext) as EmulatorsContextType;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = React.useState<TopicType | undefined>(undefined);
  const emulator = getEmulator('pubsub');

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
    if (emulator && topicName && open) {
      const settings: SettingsType = {
        type: emulator.type,
        host: emulator.host,
        port: emulator.port,
        project_id: emulator.project_id,
      };
      getTopicCallback(settings, topicName);
    }
  }, [open, topicName, emulator, getTopicCallback]);

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
          <Typography variant="h6" className="py-2">
            Name: <em>{shortName(topic.name)}</em>
          </Typography>
          <Typography variant="body1">
            <em>{topic.name}</em>
          </Typography>
          <Typography variant="h6" className="py-2">
            Labels
          </Typography>
          <Typography variant="body1">
            {topic.labels === undefined ? '--' : labelsToString(topic)}
          </Typography>
          <Typography variant="h6" className="py-2">
            Message Retention Duration (s)
          </Typography>
          <Typography variant="body1">
            {topic.messageRetentionDuration === undefined
              ? '--'
              : topic.messageRetentionDuration}
          </Typography>
          <Typography variant="h6" className="py-2">
            Schema
          </Typography>
          <Typography variant="body1">
            {topic.schemaSettings === undefined ? (
              <span>--</span>
            ) : (
              <div>
                Schema: <em>{topic.schemaSettings.schema}</em>
                <br />
                Encoding: <em>{topic.schemaSettings.encoding}</em>
              </div>
            )}
          </Typography>
        </>
      );
    }

    return null;
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <DialogTitle color="primary">PubSub / Topic Definition</DialogTitle>
      <DialogContent>{renderContent()}</DialogContent>
      <DialogActions>
        <Box className="absolute right-5 top-3">
          <CloseButton onClick={handleClose} />
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default TopicDefinition;
