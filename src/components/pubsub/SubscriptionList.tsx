import React, { useState } from 'react';

import { Alert, Button, CircularProgress, Tooltip } from '@mui/material';
import { Email, MailLockOutlined, Refresh } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid';

import { SubscriptionNameType, SubscriptionType } from './Subscription';
import PullMessage from './PullMessage';
import { shortName } from '../../utils/pubsub';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import {
  useSubscriptions,
  useDeleteSubscription,
  usePurgeSubscription,
} from '../../hooks/usePubsub';

function SubscriptionList(): React.ReactElement {
  const { data: subscriptions = [], isLoading, refetch } = useSubscriptions();
  const deleteSubscriptionMutation = useDeleteSubscription();
  const purgeSubscriptionMutation = usePurgeSubscription();

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
      deleteSubscriptionMutation.mutate({
        name: subscriptionToDelete,
        short_name: shortName(subscriptionToDelete),
      });
      setSubscriptionToDelete(null);
      setConfirmOpen(false);
    }
  };

  const handlePurgeConfirm = () => {
    if (subscriptionToPurge) {
      purgeSubscriptionMutation.mutate({
        name: subscriptionToPurge,
        short_name: shortName(subscriptionToPurge),
      });
      setSubscriptionToPurge(null);
      setConfirmPurgeOpen(false);
    }
  };

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
      {isLoading ? (
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
          <Button onClick={() => refetch()} startIcon={<Refresh />}>
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
