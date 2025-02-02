import { SettingsType } from '../components/emulator/Settings';
import { PubSubMessageType } from '../components/pubsub/PublishMessage';
import { TopicType, TopicNameType } from '../components/pubsub/Topic';
import { TopicFormType } from '../components/pubsub/TopicCreate';
import { stringToLabels } from '../utils/pubsub';
import apiCall from './common';

export async function getTopics(settings: SettingsType): Promise<TopicType[]> {
  const content = await apiCall<{ topics: TopicType[] }>(settings, '/topics');
  return content?.topics || [];
}

export async function getTopic(
  settings: SettingsType,
  topicName: TopicNameType,
): Promise<TopicType> {
  return await apiCall<TopicType>(settings, `/topics/${topicName.name}`);
}

export async function createTopic(
  settings: SettingsType,
  topic: TopicFormType,
): Promise<TopicType> {
  const body = {
    labels: stringToLabels(topic.labels),
    messageRetentionDuration: topic.messageRetentionDuration || undefined,
  };
  return await apiCall<TopicType>(
    settings,
    `/topics/${topic.name}`,
    'PUT',
    body,
  );
}

export async function deleteTopic(
  settings: SettingsType,
  topicName: TopicNameType,
): Promise<boolean> {
  await apiCall<void>(settings, `/topics/${topicName.name}`, 'DELETE');
  return true;
}

export async function publishMessage(
  settings: SettingsType,
  topicName: TopicNameType,
  pubSubMessage: PubSubMessageType,
): Promise<boolean> {
  const body = {
    messages: [
      {
        attributes: pubSubMessage.attributes,
        data: pubSubMessage.data,
      },
    ],
  };

  await apiCall<void>(
    settings,
    `/topics/${topicName.name}:publish`,
    'POST',
    body,
  );
  return true;
}
