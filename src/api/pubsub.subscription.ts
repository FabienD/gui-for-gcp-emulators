import { SettingsType } from '../components/emulator/Settings';
import {
  SubscriptionNameType,
  SubscriptionType,
} from '../components/pubsub/Subscription';
import { SubscriptionFormType } from '../components/pubsub/SubscriptionCreate';
import { TopicNameType } from '../components/pubsub/Topic';
import apiCall from './common';

export async function getTopicSubscriptions(
  settings: SettingsType,
  topicName: TopicNameType,
): Promise<SubscriptionType[]> {
  const content = await apiCall<{ subscriptions: SubscriptionType[] }>(
    settings,
    `${topicName.name}/subscriptions/subscriptions`,
  );
  return content?.subscriptions || [];
}

export async function getSubscriptions(
  settings: SettingsType,
): Promise<SubscriptionType[]> {
  const content = await apiCall<{ subscriptions: SubscriptionType[] }>(
    settings,
    '/subscriptions',
  );
  return content?.subscriptions || [];
}

export async function createSubscription(
  settings: SettingsType,
  subscription: SubscriptionFormType,
): Promise<SubscriptionType> {
  let body = {};
  const common = {
    topic: subscription.topic,
  };

  if (subscription.pushEndpoint !== '') {
    body = {
      ...common,
      pushConfig: {
        pushEndpoint: subscription.pushEndpoint,
      },
    };
  } else {
    body = common;
  }

  return await apiCall<SubscriptionType>(
    settings,
    `/subscriptions/${subscription.name}`,
    'PUT',
    body,
  );
}

export async function deleteSubscription(
  settings: SettingsType,
  subscriptionName: SubscriptionNameType,
): Promise<boolean> {
  await apiCall<void>(
    settings,
    `/subscriptions/${subscriptionName.short_name}`,
    'DELETE',
  );
  return true;
}

export type ReceivedMessage = {
  ackId: string;
  message: {
    data: string;
    messageId: string;
    publishTime: string;
    attributes?: { [key: string]: string };
  };
};

export async function pullSubscription(
  settings: SettingsType,
  subscriptionName: SubscriptionNameType,
  maxMessages: number = 1,
): Promise<{ receivedMessages: ReceivedMessage[] }> {
  return await apiCall<{ receivedMessages: ReceivedMessage[] }>(
    settings,
    `/subscriptions/${subscriptionName.short_name}:pull`,
    'POST',
    {
      returnImmediately: true,
      maxMessages: maxMessages,
    },
  );
}

export async function ackSubscription(
  settings: SettingsType,
  subscriptionName: SubscriptionNameType,
  ackIds: string[],
): Promise<boolean> {
  const content = await apiCall<string>(
    settings,
    `/subscriptions/${subscriptionName.short_name}:acknowledge`,
    'POST',
    {
      ackIds: ackIds,
    },
  );

  if (content === '') {
    return true;
  }

  return false;
}

export async function pullAckSubscription(
  settings: SettingsType,
  subscriptionName: SubscriptionNameType,
  maxMessages: number = 1,
): Promise<ReceivedMessage[]> {
  const { receivedMessages } = await pullSubscription(
    settings,
    subscriptionName,
    maxMessages,
  );

  if (receivedMessages && receivedMessages.length > 0) {
    const ackIds = receivedMessages.map((msg: ReceivedMessage) => msg.ackId);
    await ackSubscription(settings, subscriptionName, ackIds);
  }

  return receivedMessages;
}

export async function purgeSubscription(
  settings: SettingsType,
  subscriptionName: SubscriptionNameType,
): Promise<void> {
  let hasMessages = true;
  const maxMessages = 100;

  while (hasMessages) {
    const { receivedMessages } = await pullSubscription(
      settings,
      subscriptionName,
      maxMessages,
    );

    if (receivedMessages && receivedMessages.length > 0) {
      const ackIds = receivedMessages.map((msg: ReceivedMessage) => msg.ackId);
      await ackSubscription(settings, subscriptionName, ackIds);
    } else {
      hasMessages = false;
    }
  }
}
