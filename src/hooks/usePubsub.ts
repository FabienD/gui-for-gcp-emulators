import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import EmulatorContext, { EmulatorContextType } from '../contexts/emulators';
import { SettingsType } from '../components/emulator/Settings';

import {
  getTopics,
  getTopic,
  createTopic,
  deleteTopic,
  publishMessage,
} from '../api/pubsub.topic';
import {
  getSchemas,
  getSchema,
  createSchema,
  deleteSchema,
} from '../api/pubsub.schema';
import {
  getSubscriptions,
  createSubscription,
  deleteSubscription,
  purgeSubscription,
} from '../api/pubsub.subscription';

import { TopicNameType } from '../components/pubsub/Topic';
import { TopicFormType } from '../components/pubsub/TopicCreate';
import { SchemaNameType } from '../components/pubsub/Schema';
import { SchemaFormType } from '../components/pubsub/SchemaCreate';
import { SubscriptionNameType } from '../components/pubsub/Subscription';
import { SubscriptionFormType } from '../components/pubsub/SubscriptionCreate';
import { PubSubMessageType } from '../components/pubsub/PublishMessage';

// --- Utility hook ---

export function useEmulatorSettings(): SettingsType | undefined {
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const emulator = getEmulator();
  if (!emulator) return undefined;
  return {
    host: emulator.host,
    port: emulator.port,
    project_id: emulator.project_id,
  };
}

// --- Query key factory ---

export const pubsubKeys = {
  all: (s: SettingsType) => ['pubsub', s.host, s.port, s.project_id] as const,
  topics: (s: SettingsType) => [...pubsubKeys.all(s), 'topics'] as const,
  topic: (s: SettingsType, name: string) =>
    [...pubsubKeys.topics(s), name] as const,
  schemas: (s: SettingsType) => [...pubsubKeys.all(s), 'schemas'] as const,
  schema: (s: SettingsType, name: string) =>
    [...pubsubKeys.schemas(s), name] as const,
  subscriptions: (s: SettingsType) =>
    [...pubsubKeys.all(s), 'subscriptions'] as const,
};

// --- Query hooks ---

export function useTopics() {
  const settings = useEmulatorSettings();
  return useQuery({
    queryKey: settings ? pubsubKeys.topics(settings) : ['pubsub', 'topics'],
    queryFn: () => getTopics(settings!),
    enabled: !!settings,
  });
}

export function useTopic(
  topicName: TopicNameType | undefined,
  enabled: boolean,
) {
  const settings = useEmulatorSettings();
  return useQuery({
    queryKey:
      settings && topicName
        ? pubsubKeys.topic(settings, topicName.name)
        : ['pubsub', 'topic'],
    queryFn: () => getTopic(settings!, topicName!),
    enabled: !!settings && !!topicName && enabled,
  });
}

export function useSchemas() {
  const settings = useEmulatorSettings();
  return useQuery({
    queryKey: settings ? pubsubKeys.schemas(settings) : ['pubsub', 'schemas'],
    queryFn: () => getSchemas(settings!),
    enabled: !!settings,
  });
}

export function useSchema(
  schemaName: SchemaNameType | undefined,
  enabled: boolean,
) {
  const settings = useEmulatorSettings();
  return useQuery({
    queryKey:
      settings && schemaName
        ? pubsubKeys.schema(settings, schemaName.name)
        : ['pubsub', 'schema'],
    queryFn: () => getSchema(settings!, schemaName!),
    enabled: !!settings && !!schemaName && enabled,
  });
}

export function useSubscriptions() {
  const settings = useEmulatorSettings();
  return useQuery({
    queryKey: settings
      ? pubsubKeys.subscriptions(settings)
      : ['pubsub', 'subscriptions'],
    queryFn: () => getSubscriptions(settings!),
    enabled: !!settings,
  });
}

// --- Mutation hooks ---

export function useCreateTopic() {
  const settings = useEmulatorSettings();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topic: TopicFormType) => createTopic(settings!, topic),
    onSuccess: () => {
      if (settings) {
        queryClient.invalidateQueries({
          queryKey: pubsubKeys.topics(settings),
        });
      }
    },
  });
}

export function useDeleteTopic() {
  const settings = useEmulatorSettings();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (topicName: TopicNameType) => deleteTopic(settings!, topicName),
    onSuccess: () => {
      if (settings) {
        queryClient.invalidateQueries({
          queryKey: pubsubKeys.topics(settings),
        });
      }
    },
  });
}

export function useCreateSchema() {
  const settings = useEmulatorSettings();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schema: SchemaFormType) => createSchema(settings!, schema),
    onSuccess: () => {
      if (settings) {
        queryClient.invalidateQueries({
          queryKey: pubsubKeys.schemas(settings),
        });
      }
    },
  });
}

export function useDeleteSchema() {
  const settings = useEmulatorSettings();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schemaName: SchemaNameType) =>
      deleteSchema(settings!, schemaName),
    onSuccess: () => {
      if (settings) {
        queryClient.invalidateQueries({
          queryKey: pubsubKeys.schemas(settings),
        });
      }
    },
  });
}

export function useCreateSubscription() {
  const settings = useEmulatorSettings();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscription: SubscriptionFormType) =>
      createSubscription(settings!, subscription),
    onSuccess: () => {
      if (settings) {
        queryClient.invalidateQueries({
          queryKey: pubsubKeys.subscriptions(settings),
        });
      }
    },
  });
}

export function useDeleteSubscription() {
  const settings = useEmulatorSettings();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionName: SubscriptionNameType) =>
      deleteSubscription(settings!, subscriptionName),
    onSuccess: () => {
      if (settings) {
        queryClient.invalidateQueries({
          queryKey: pubsubKeys.subscriptions(settings),
        });
      }
    },
  });
}

export function usePurgeSubscription() {
  const settings = useEmulatorSettings();

  return useMutation({
    mutationFn: (subscriptionName: SubscriptionNameType) =>
      purgeSubscription(settings!, subscriptionName),
  });
}

export function usePublishMessage() {
  const settings = useEmulatorSettings();

  return useMutation({
    mutationFn: ({
      topicName,
      message,
    }: {
      topicName: TopicNameType;
      message: PubSubMessageType;
    }) => publishMessage(settings!, topicName, message),
  });
}
