import React, { useCallback, useContext, useEffect, useState } from 'react';

import { Alert } from '@mui/material';

import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';
import { TopicType } from './Topic';
import SubscriptionCreate from './SubscriptionCreate';
import SubscriptionList from './SubscriptionList';
import { getSubscriptions } from '../../api/pubsub.subscription';
import { ApiError } from '../../api/common';

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

type SubscriptionProps = {
  topics: TopicType[];
};

function Subscription({ topics }: SubscriptionProps): React.ReactElement {
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);

  const emulator = getEmulator();
  const isConnected = emulator?.is_connected;

  const getSubscriptionsCallback = useCallback(
    async (settings: SettingsType) => {
      try {
        const fetchedSubscriptions = await getSubscriptions(settings);
        setSubscriptions(fetchedSubscriptions);
      } catch (error) {
        if (error instanceof ApiError) {
          console.error(
            `API Error: ${error.message} (Status: ${error.statusCode})`,
          );
        } else {
          console.error('Unexpected error', error);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (emulator != undefined) {
      getSubscriptionsCallback({
        host: emulator.host,
        port: emulator.port,
        project_id: emulator.project_id,
      }).catch(console.error);
    }
  }, [emulator, getSubscriptionsCallback]);

  return isConnected && topics.length > 0 ? (
    <>
      <SubscriptionCreate
        topics={topics}
        subscriptions={subscriptions}
        setSubscriptions={setSubscriptions}
      />
      <SubscriptionList
        subscriptions={subscriptions}
        setSubscriptions={setSubscriptions}
        getSubscriptionsCallback={getSubscriptionsCallback}
      />
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
