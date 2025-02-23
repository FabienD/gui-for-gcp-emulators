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

  if (subscription.pushConfig === true) {
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

export function pullSubscription(
  settings: SettingsType,
  subscriptionName: SubscriptionNameType,
  maxMessages: number = 1,
): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/subscriptions/${subscriptionName.name}:pull`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        returnImmediately: true,
        maxMessages: maxMessages,
      }),
    },
  );
}

export function ackSubscription(
  settings: SettingsType,
  subscriptionName: SubscriptionNameType,
  ackId: string,
): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/subscriptions/${subscriptionName.name}:acknowledge`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ackIds: [ackId],
      }),
    },
  );
}
