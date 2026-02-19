import React from 'react';

import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { TopicNameType } from './Topic';
import { labelsToString, shortName } from '../../utils/pubsub';
import CloseButton from '../ui/CloseButton';
import { useTopic } from '../../hooks/usePubsub';

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
  const { data: topic, isLoading, error } = useTopic(topicName, open);

  const renderContent = () => {
    if (isLoading) {
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
          Error fetching topic details.
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
