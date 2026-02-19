import React, { useContext } from 'react';

import { Alert } from '@mui/material';

import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import SubscriptionCreate from './SubscriptionCreate';
import SubscriptionList from './SubscriptionList';
import { useTopics } from '../../hooks/usePubsub';

type SubscriptionNameType = {
  readonly name: string;
  readonly short_name: string;
};

type SubscriptionType = SubscriptionNameType & {
  readonly topic: string;
  readonly labels?: {
    [key: string]: string;
  };
  readonly pushConfig?: {
    pushEndpoint: string;
    attributes?: {
      [key: string]: string;
    };
  };
};

function Subscription(): React.ReactElement {
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const { data: topics = [] } = useTopics();

  const emulator = getEmulator();
  const isConnected = emulator?.is_connected;

  return isConnected && topics.length > 0 ? (
    <>
      <SubscriptionCreate />
      <SubscriptionList />
    </>
  ) : (
    <Alert severity={isConnected ? 'info' : 'warning'}>
      {isConnected
        ? 'At least one topic is needed to create a subscription.'
        : 'The emulator is not configured or the connection is not validated.'}
    </Alert>
  );
}

export default Subscription;
export type { SubscriptionNameType, SubscriptionType };
