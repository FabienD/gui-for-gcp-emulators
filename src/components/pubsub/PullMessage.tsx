import React, { useContext } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierSulphurpoolLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';

import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import {
  ackSubscription,
  pullSubscription,
  ReceivedMessage,
} from '../../api/pubsub.subscription';
import { SubscriptionNameType } from './Subscription';

type PullMessageProps = {
  open: boolean;
  subscriptionName: SubscriptionNameType | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function PullMessage({
  open,
  subscriptionName,
  setOpen,
}: PullMessageProps): React.ReactElement {
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [message, setMessage] = React.useState<string | undefined>(undefined);
  const [rawMessage, setRawMessage] = React.useState<
    ReceivedMessage | undefined
  >(undefined);
  const emulator = getEmulator();

  const handlePull = () => handlePullSubscription(false);
  const handlePullAndAck = () => handlePullSubscription(true);

  const handlePullSubscription = async (ack: boolean) => {
    resetAlerts();

    if (subscriptionName !== undefined && emulator !== undefined) {
      try {
        const { receivedMessages }: { receivedMessages: ReceivedMessage[] } =
          await pullSubscription(emulator, subscriptionName);

        if (receivedMessages.length === 1) {
          setRawMessage(receivedMessages[0]);
          setMessage(atob(receivedMessages[0].message.data));

          if (ack == true) {
            await ackMessage(receivedMessages[0].ackId);
          }
        } else {
          setError('No message to pull');
        }
      } catch (error) {
        console.error(error);
        setError('An error occurred.');
      }
    }
  };

  const ackMessage = async (ackId: string) => {
    if (subscriptionName !== undefined && emulator !== undefined) {
      try {
        if (
          (await ackSubscription(emulator, subscriptionName, [ackId])) === false
        ) {
          console.error('Message not acked');
        }
      } catch {
        setError('An error occurred');
      }
    }
  };

  const resetAlerts = () => {
    setMessage(undefined);
    setError(undefined);
  };

  const handleClose = () => {
    resetAlerts();
    setOpen(false);
  };

  return (
    <>
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>Pull message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="subtitle1" marginBottom={2}>
              Pull 1 message from the subscription {subscriptionName?.name}.
            </Typography>
          </DialogContentText>
          {error != undefined && <Alert severity="error">{error}</Alert>}
          {message != undefined && (
            <>
              <Typography variant="subtitle2" marginBottom={2} marginTop={2}>
                Data attribute decoded value
              </Typography>
              <SyntaxHighlighter
                language="json"
                style={atelierSulphurpoolLight}
              >
                {message}
              </SyntaxHighlighter>
              <Typography variant="subtitle2" marginBottom={2} marginTop={2}>
                Raw message
              </Typography>
              <SyntaxHighlighter
                language="json"
                style={atelierSulphurpoolLight}
              >
                {JSON.stringify(rawMessage, null, 2)}
              </SyntaxHighlighter>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button variant="contained" size="small" onClick={handlePull}>
            Pull
          </Button>
          <Button variant="contained" size="small" onClick={handlePullAndAck}>
            Pull & Ack
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PullMessage;
