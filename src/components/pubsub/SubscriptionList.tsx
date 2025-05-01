import React, { useCallback, useContext, useState } from 'react';

import { Alert, Button, CircularProgress, Tooltip } from '@mui/material';
import { Email, MailLockOutlined, Refresh } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid';

import EmulatorsContext, { EmulatorsContextType } from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';
import { SubscriptionNameType, SubscriptionType } from './Subscription';
import PullMessage from './PullMessage';
import {
  deleteSubscription,
  purgeSubscription,
} from '../../api/pubsub.subscription';
import { shortName } from '../../utils/pubsub';
import ConfirmationDialog from '../ui/ConfirmationDialog';

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
  const { getEmulator } = useContext(EmulatorsContext) as EmulatorsContextType;
  const emulator = getEmulator('pubsub');
  const [open, setOpen] = useState(false);
  const [subscriptionName, setSubscriptionName] =
    useState<SubscriptionNameType>();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<
    string | null
  >(null);
  const [confirmPurgeOpen, setConfirmPurgeOpen] = useState(false);
  const [subscriptionToPurge, setSubscriptionToPurge] = useState<string | null>(
    null,
  );

  const handleActionClick = (
    action: 'delete' | 'pull' | 'purge',
    id: GridRowId,
  ) => {
    const name = id.toString();
    setSubscriptionName({ name: name, short_name: shortName(name) });

    if (action === 'delete') {
      setSubscriptionToDelete(name);
      setConfirmOpen(true);
    }
    if (action === 'pull') {
      setOpen(true);
      setSubscriptionName({ name: name, short_name: shortName(name) });
    }
    if (action === 'purge') {
      setSubscriptionToPurge(name);
      setConfirmPurgeOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (subscriptionToDelete) {
      deleteSubscriptionAction(subscriptionToDelete);
      setSubscriptionToDelete(null);
      setConfirmOpen(false);
    }
  };

  const handlePurgeConfirm = () => {
    if (subscriptionToPurge) {
      purgeSubscriptionAction(subscriptionToPurge);
      setSubscriptionToPurge(null);
      setConfirmPurgeOpen(false);
    }
  };

  const handleSubscriptionsRefresh = () => {
    if (emulator != undefined) {
      setLoading(true);
      getSubscriptionsCallback({
        type: emulator.type,
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
            type: emulator.type,
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

  const purgeSubscriptionCallback = useCallback(
    async (settings: SettingsType, subscriptionName: SubscriptionNameType) => {
      await purgeSubscription(settings, subscriptionName);
    },
    [],
  );

  const purgeSubscriptionAction = useCallback(
    async (id: string) => {
      if (emulator != undefined) {
        purgeSubscriptionCallback(
          {
            type: emulator.type,
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
    [emulator, purgeSubscriptionCallback],
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Subscription ID',
      minWidth: 150,
    },
    {
      field: 'type',
      headerName: 'Type',
      minWidth: 100,
    },
    {
      field: 'topic',
      headerName: 'Topic',
      width: 100,
    },
    {
      field: 'pushEndpoint',
      headerName: 'Push endpoint',
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      minWidth: 150,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <Tooltip title="Pull Message" key={`pull-${id}`}>
            <GridActionsCellItem
              icon={<Email />}
              label="Pull Message"
              onClick={() => handleActionClick('pull', id)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip title="Purge Message" key={`purge-${id}`}>
            <GridActionsCellItem
              icon={<MailLockOutlined />}
              label="Purge Message"
              onClick={() => handleActionClick('purge', id)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip title="Delete" key={`delete-${id}`}>
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
      <ConfirmationDialog
        open={confirmOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this subscription?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
      <ConfirmationDialog
        open={confirmPurgeOpen}
        title="Confirm Purge"
        description="Are you sure you want to purge all messages from this subscription?"
        onConfirm={handlePurgeConfirm}
        onCancel={() => setConfirmPurgeOpen(false)}
      />
    </>
  );
}

export default SubscriptionList;
