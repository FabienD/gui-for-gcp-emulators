import React, { useCallback, useContext, useMemo, useState } from 'react';

import { Refresh } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import InfoIcon from '@mui/icons-material/Info';
import MessageIcon from '@mui/icons-material/Message';
import { Alert, Button, CircularProgress, Tooltip } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid';

import { deleteTopic } from '../../api/pubsub.topic';
import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import { labelsToString, shortName } from '../../utils/pubsub';
import { SettingsType } from '../emulator/Settings';
import PublishMessage from './PublishMessage';
import { TopicNameType, TopicType } from './Topic';
import TopicDefinition from './TopicDefinition';

type TopicListProps = {
  topics: TopicType[];
  setTopics: React.Dispatch<React.SetStateAction<TopicType[]>>;
  getTopicsCallback: any;
};

function TopicList({
  topics,
  setTopics,
  getTopicsCallback,
}: TopicListProps): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [openPublishMessage, setOpenPublishMessage] = useState(false);
  const [openTopicDefinition, setOpenTopicDefinition] = useState(false);
  const [topicName, setTopicName] = useState<TopicNameType>();
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const emulator = getEmulator();

  const handleActionClick = (
    action: 'delete' | 'message' | 'definition',
    id: GridRowId,
  ) => {
    const name = id.toString();
    setTopicName({ name });

    if (action === 'delete') {
      deleteTopicAction({ name });
    } else if (action === 'message') {
      setOpenPublishMessage(true);
    } else if (action === 'definition') {
      setOpenTopicDefinition(true);
    }
  };

  const handleTopicsRefresh = () => {
    if (emulator != undefined) {
      setLoading(true);
      getTopicsCallback({
        host: emulator.host,
        port: emulator.port,
        project_id: emulator.project_id,
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  const deleteTopicCallback = useCallback(
    async (settings: SettingsType, topicName: TopicNameType) => {
      const isDeleted = await deleteTopic(settings, topicName);

      if (isDeleted) {
        const filteredTopics = topics.filter(
          (t: TopicType) => shortName(t.name) !== topicName.name,
        );
        setTopics(filteredTopics);
      }
    },
    [topics],
  );

  const deleteTopicAction = useCallback(
    async (topicName: TopicNameType) => {
      if (emulator != undefined) {
        deleteTopicCallback(
          {
            host: emulator.host,
            port: emulator.port,
            project_id: emulator.project_id,
          },
          {
            name: topicName.name,
          },
        ).catch(console.error);
      }
    },
    [emulator, deleteTopicCallback],
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        headerName: 'ID',
        field: 'id',
        minWidth: 150,
      },
      {
        headerName: 'Name',
        field: 'name',
        flex: 1,
      },
      {
        headerName: 'Labels',
        field: 'labels',
        minWidth: 200,
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        minWidth: 150,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          return [
            <Tooltip title="Information" key="information">
              <GridActionsCellItem
                icon={<InfoIcon />}
                label="Information"
                onClick={() => handleActionClick('definition', id)}
                color="inherit"
              />
            </Tooltip>,
            <Tooltip title="Publish a message" key="publish">
              <GridActionsCellItem
                icon={<MessageIcon />}
                label="Publish a message"
                onClick={() => handleActionClick('message', id)}
                color="inherit"
              />
            </Tooltip>,
            <Tooltip title="Delete" key="delete">
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => handleActionClick('delete', id)}
                color="inherit"
              />
            </Tooltip>,
          ];
        },
      },
    ],
    [handleActionClick],
  );

  const rows = useMemo(
    () =>
      topics.map((topic: TopicType) => ({
        id: shortName(topic.name),
        name: topic.name,
        labels: labelsToString(topic),
      })),
    [topics],
  );

  return (
    <>
      {loading ? (
        <div className="flex justify-center mt-10">
          <CircularProgress />
        </div>
      ) : topics.length === 0 ? (
        <Alert severity="info" className="my-5">
          No topics
        </Alert>
      ) : (
        <>
          <div className="mt-10 w-full">
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10]}
            />
            <Button onClick={handleTopicsRefresh} startIcon={<Refresh />}>
              topics list
            </Button>
          </div>

          <PublishMessage
            open={openPublishMessage}
            setOpen={setOpenPublishMessage}
            topicName={topicName}
          />
          <TopicDefinition
            open={openTopicDefinition}
            setOpen={setOpenTopicDefinition}
            topicName={topicName}
          />
        </>
      )}
    </>
  );
}

export default TopicList;
