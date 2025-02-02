import { SettingsType } from '../components/emulator/Settings';
import {
  SubscriptionNameType,
  SubscriptionType,
} from '../components/pubsub/Subscription';
import { TopicNameType } from '../components/pubsub/Topic';

export function getTopicSubscriptions(
  settings: SettingsType,
  topicName: TopicNameType,
): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/${topicName.name}/subscriptions`,
    {
      method: 'GET',
    },
  );
}

export function getSubscriptions(settings: SettingsType): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/subscriptions`,
  );
}

export function createSubscription(
  settings: SettingsType,
  subscription: SubscriptionType,
): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/projects/${settings.project_id}/subscriptions/${subscription.name}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic: subscription.topic,
        pushConfig: {
          pushEndpoint: subscription.pushConfig?.pushEndpoint,
        },
      }),
    },
  );
}

export function deleteSubscription(
  settings: SettingsType,
  subscriptionName: SubscriptionNameType,
): Promise<Response> {
  return fetch(
    `http://${settings.host}:${settings.port}/v1/${subscriptionName.name}`,
    {
      method: 'DELETE',
    },
  );
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
