import React, { useContext, useEffect, useState } from 'react';

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Tooltip,
  Box,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';

import { SubscriptionNameType } from './Subscription';
import {
  ReceivedMessage,
  pullAckSubscription,
} from '../../api/pubsub.subscription';
import EmulatorsContext, {
  EmulatorsContextType,
} from '../../contexts/emulators';
import CloseButton from '../ui/CloseButton';
import CopyableSyntaxHighlighter from '../ui/CopyableSyntaxHighlighter';

type PullMessagesProps = {
  open: boolean;
  subscriptionName: SubscriptionNameType | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function PullMessages({
  open,
  subscriptionName,
  setOpen,
}: PullMessagesProps): React.ReactElement {
  const { getEmulator } = useContext(EmulatorsContext) as EmulatorsContextType;
  const [error, setError] = useState<string | undefined>(undefined);
  const [messages, setMessages] = useState<ReceivedMessage[] | undefined>(
    undefined,
  );
  const [hoveredMessage, setHoveredMessage] = useState<ReceivedMessage | null>(
    null,
  );
  const emulator = getEmulator('pubsub');

  const handlePullSubscription = async () => {
    resetAlerts();

    if (subscriptionName !== undefined && emulator !== undefined) {
      try {
        const receivedMessages: ReceivedMessage[] = await pullAckSubscription(
          emulator,
          subscriptionName,
          10,
        );

        if (Array.isArray(receivedMessages) && receivedMessages.length >= 1) {
          setMessages(receivedMessages);
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred.');
      }
    }
  };

  useEffect(() => {
    if (open) {
      handlePullSubscription();
    }
  }, [open]);

  const resetAlerts = () => {
    setHoveredMessage(null);
    setMessages(undefined);
    setError(undefined);
  };

  const handleClose = () => {
    resetAlerts();
    setOpen(false);
  };

  const handleRowClick = (params: GridRowParams) => {
    const message = messages?.find(msg => msg.ackId === params.id);
    setHoveredMessage(message || null);
  };

  const decodeAndFOrmatMessage = (message: string) => {
    try {
      return JSON.stringify(JSON.parse(atob(message)), null, 2);
    } catch {
      return atob(message);
    }
  };

  const columns: GridColDef[] = [
    { field: 'messageId', headerName: 'Message ID', width: 100 },
    {
      field: 'message',
      headerName: 'Message',
      flex: 1,
      renderCell: params => (
        <Tooltip title={atob(params.value)}>
          <span>
            {atob(params.value).length > 100
              ? atob(params.value).substring(0, 100) + '...'
              : atob(params.value)}
          </span>
        </Tooltip>
      ),
    },
  ];

  const rows = messages?.map(msg => ({
    id: msg.ackId,
    messageId: msg.message.messageId,
    message: msg.message.data,
  }));

  return (
    <>
      <Dialog fullScreen open={open} onClose={handleClose}>
        <DialogTitle color="primary">Pull & Ack messages</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="subtitle1" marginBottom={2}>
              Messages from the subscription
              <em>
                <strong> {subscriptionName?.short_name}</strong>
              </em>
              .
              <br />
              <br />
              To see the full content of a message, click on the row.
            </Typography>
          </DialogContentText>
          {error && <Alert severity="error">{error}</Alert>}
          {messages && (
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1, maxWidth: '50%' }}>
                <DataGrid
                  rows={rows || []}
                  columns={columns}
                  onRowClick={handleRowClick}
                />
              </div>
              {hoveredMessage && (
                <div style={{ flex: 1, marginLeft: '20px', maxWidth: '50%' }}>
                  <Typography
                    variant="subtitle2"
                    marginBottom={2}
                    marginTop={-4}
                  >
                    Full message:
                  </Typography>
                  <CopyableSyntaxHighlighter
                    language="json"
                    value={JSON.stringify(hoveredMessage, null, 2)}
                  />
                  <Typography
                    variant="subtitle2"
                    marginBottom={2}
                    marginTop={2}
                  >
                    Decoded data:
                  </Typography>
                  <CopyableSyntaxHighlighter
                    language="json"
                    value={decodeAndFOrmatMessage(hoveredMessage.message.data)}
                  />
                </div>
              )}
            </div>
          )}
          {messages === undefined && (
            <div style={{ display: 'flex' }}>
              <Alert severity="warning">No messages in the subscription</Alert>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          {messages && messages.length === 10 && (
            <Button
              variant="contained"
              size="small"
              onClick={handlePullSubscription}
            >
              Next 10 messages
            </Button>
          )}
        </DialogActions>

        <Box className="absolute right-5 top-3">
          <CloseButton onClick={handleClose} />
        </Box>
      </Dialog>
    </>
  );
}

export default PullMessages;
