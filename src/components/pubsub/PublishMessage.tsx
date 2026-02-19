import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';

import { TopicNameType } from './Topic';
import CloseButton from '../ui/CloseButton';
import { useTopic, usePublishMessage } from '../../hooks/usePubsub';

type PublishMessageProps = {
  open: boolean;
  topicName: TopicNameType | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

interface PubSubMessageAttributeType {
  [key: string]: string;
}

interface PubSubMessageType {
  attributes: PubSubMessageAttributeType[] | undefined;
  data: string;
}

interface PubSubMessageForm {
  messageData: string;
}

function PublishMessage({
  open,
  topicName,
  setOpen,
}: PublishMessageProps): React.ReactElement {
  const {
    data: topic,
    isLoading,
    error: fetchError,
  } = useTopic(topicName, open);
  const publishMessageMutation = usePublishMessage();

  const [Error, setError] = useState<string | undefined>(undefined);
  const [IsPublished, setIsPublished] = useState(false);

  const { handleSubmit, control, reset } = useForm<PubSubMessageForm>({
    defaultValues: {
      messageData: '',
    },
  });

  const onSubmit: SubmitHandler<PubSubMessageForm> = async data => {
    resetAlerts();

    if (topicName !== undefined) {
      publishMessageMutation.mutate(
        {
          topicName,
          message: {
            attributes: undefined,
            data: data.messageData,
          },
        },
        {
          onSuccess: result => {
            if (result.messageIds !== undefined) {
              setIsPublished(true);
              reset();
            } else {
              setError('Error, message is not published');
            }
            setTimeout(resetStates, 5000);
          },
          onError: error => {
            console.error(error);
            setError('An error occurred, message is not published');
            setTimeout(resetStates, 5000);
          },
        },
      );
    }
  };

  const resetAlerts = () => {
    setIsPublished(false);
    setError(undefined);
  };

  const resetStates = () => {
    resetAlerts();
  };

  const handleClose = () => {
    resetStates();
    setOpen(false);
  };

  return (
    <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
      {isLoading ? (
        <CircularProgress />
      ) : fetchError ? (
        <Alert severity="error">Failed to load topic information.</Alert>
      ) : topic ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle color="primary">Publish message</DialogTitle>
          <DialogContent>
            {topic.schemaSettings !== undefined ? (
              <Alert severity="warning">
                Publishing a message for a topic linked with a schema is not yet
                supported.
              </Alert>
            ) : (
              <DialogContentText>
                <Typography variant="subtitle1" marginBottom={2}>
                  Define the <strong>raw value</strong> of the pubsub{' '}
                  <strong>data message attribute only</strong>. The raw content
                  will be base64 encoded by the application.
                </Typography>
                <Controller
                  name="messageData"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="pubsub-message-data"
                      label="Raw data attribute value"
                      multiline
                      rows={15}
                      fullWidth={true}
                    />
                  )}
                />
              </DialogContentText>
            )}
            {Error != undefined && <Alert severity="error">{Error}</Alert>}
            {IsPublished && (
              <Alert severity="success">Message is published</Alert>
            )}
          </DialogContent>
          <DialogActions>
            {topic.schemaSettings === undefined && (
              <Button
                variant="contained"
                size="small"
                type="submit"
                onClick={handleSubmit(onSubmit)}
              >
                Publish
              </Button>
            )}
            <Box className="absolute right-5 top-3">
              <CloseButton onClick={handleClose} />
            </Box>
          </DialogActions>
        </form>
      ) : (
        <Alert severity="error">Failed to load topic information.</Alert>
      )}
    </Dialog>
  );
}

export default PublishMessage;
export type { PubSubMessageType };
