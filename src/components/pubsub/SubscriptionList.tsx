import React, { useCallback, useContext, useState } from 'react';

import { Alert, Button, CircularProgress, Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid';

import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';
import { SubscriptionNameType, SubscriptionType } from './Subscription';
import PullMessage from './PullMessage';
import { deleteSubscription } from '../../api/pubsub.subscription';
import { shortName } from '../../utils/pubsub';

type SubscriptionsListProps = {
  subscriptions: SubscriptionType[];
  setSubscriptions: React.Dispatch<React.SetStateAction<SubscriptionType[]>>;
  getSubscriptionsCallback: (settings: SettingsType) => Promise<void>;
};

function SubscriptionList({
  subscriptions,
  setSubscriptions,
  getSubscriptionsCallback,
}: SubscriptionsListProps): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const emulator = getEmulator();
  const [open, setOpen] = useState(false);
  const [subscriptionName, setSubscriptionName] =
    useState<SubscriptionNameType>();

  const handleActionClick = (action: 'delete' | 'pull', id: GridRowId) => {
    const name = id.toString();
    setSubscriptionName({ name: name, short_name: shortName(name) });

    if (action === 'delete') {
      setSubscriptionName(undefined);
      deleteSubscriptionAction(id.toString());
    }
    if (action === 'pull') {
      setOpen(true);
      setSubscriptionName({ name: name, short_name: shortName(name) });
    }
  };

  const handleSubscriptionsRefresh = () => {
    if (emulator != undefined) {
      setLoading(true);
      getSubscriptionsCallback({
        host: emulator.host,
        port: emulator.port,
        project_id: emulator.project_id,
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  const deleteSubscriptionCallback = useCallback(
    async (settings: SettingsType, subscriptionName: SubscriptionNameType) => {
      const isDeleted = await deleteSubscription(settings, subscriptionName);

      if (isDeleted) {
        const filteredSubscriptions = subscriptions.filter(
          (t: SubscriptionType) => t.name !== subscriptionName.name,
        );
        setSubscriptions(filteredSubscriptions);
      }
    },
    [subscriptions],
  );

  const deleteSubscriptionAction = useCallback(
    async (id: string) => {
      if (emulator != undefined) {
        deleteSubscriptionCallback(
          {
            host: emulator.host,
            port: emulator.port,
            project_id: emulator.project_id,
          },
          {
            name: id,
            short_name: shortName(id),
          },
        ).catch(console.error);
      }
    },
    [emulator, deleteSubscriptionCallback],
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Subscription ID',
      width: 150,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100,
    },
    {
      field: 'topic',
      headerName: 'Topic',
      width: 100,
    },
    {
      field: 'pushEndpoint',
      headerName: 'Push endpoint',
      width: 300,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <Tooltip title="Delete" key={`delete-${id}`}>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => handleActionClick('delete', id)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip title="Pull Message" key={`pull-${id}`}>
            <GridActionsCellItem
              icon={<MarkChatReadIcon />}
              label="Pull Message"
              onClick={() => handleActionClick('pull', id)}
              color="inherit"
            />
          </Tooltip>,
        ];
      },
    },
  ];

  const rows = subscriptions.map((subscription: SubscriptionType) => {
    return {
      id: subscription.name,
      name: shortName(subscription.name),
      topic: shortName(subscription.topic),
      type: subscription.pushConfig?.pushEndpoint ? 'push' : 'pull',
      pushEndpoint: subscription.pushConfig?.pushEndpoint,
    };
  });

  return (
    <>
      {loading ? (
        <div className="flex justify-center mt-10">
          <CircularProgress />
        </div>
      ) : subscriptions.length === 0 ? (
        <Alert severity="info" className="my-5">
          No subscriptions
        </Alert>
      ) : (
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
          <PullMessage
            open={open}
            setOpen={setOpen}
            subscriptionName={subscriptionName}
          />
          <Button onClick={handleSubscriptionsRefresh} startIcon={<Refresh />}>
            Subscriptions list
          </Button>
        </div>
      )}
    </>
  );
}

export default SubscriptionList;
