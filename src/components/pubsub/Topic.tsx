import React, { useContext } from 'react';
import Alert from '@mui/material/Alert';
import EmulatorsContext, { EmulatorsContextType } from '../../contexts/emulators';
import TopicCreate from './TopicCreate';
import TopicsList from './TopicsList';
import { SchemaType } from './Schema';
import { SettingsType } from '../emulator/Settings';

type TopicNameType = {
  readonly name: string;
};

type TopicType = TopicNameType & {
  readonly labels?: {
    [key: string]: string;
  };
  readonly messageRetentionDuration?: string;
  readonly messageStoragePolicy?: messageStoragePolicy;
  readonly schemaSettings?: schemaSettings;
};

type messageStoragePolicy = {
  readonly allowedPersistenceRegions: Array<string>;
  readonly enforceInTransit: boolean;
};

type schemaSettings = {
  readonly schema: string;
  encoding: string;
  firstRevisionId: string;
  lastRevisionId: string;
};

type TopicProps = {
  topics: TopicType[];
  setTopics: React.Dispatch<React.SetStateAction<TopicType[]>>;
  getTopicsCallback: (settings: SettingsType) => Promise<void>;
  schemas: SchemaType[];
};

function Topic({
  topics,
  setTopics,
  getTopicsCallback,
  schemas,
}: TopicProps): React.ReactElement {
  const { isConnected } = useContext(EmulatorsContext) as EmulatorsContextType;
  const isPubSubConnected = isConnected('pubsub');

  return isPubSubConnected ? (
    <>
      <TopicCreate topics={topics} setTopics={setTopics} schemas={schemas} />
      <TopicsList
        topics={topics}
        setTopics={setTopics}
        getTopicsCallback={getTopicsCallback}
      />
    </>
  ) : (
    <Alert severity={isPubSubConnected ? 'info' : 'warning'}>
      The emulator is not configured or the connection is not validated.
    </Alert>
  );
}

export default Topic;
export type { TopicNameType, TopicType };
