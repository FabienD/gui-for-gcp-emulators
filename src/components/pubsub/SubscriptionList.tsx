import React, { useCallback, useContext, useState } from "react";

import { Alert, Tooltip } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';

import { SubscriptionNameType, SubscriptionType } from "./Subscription";
import { SettingsType } from "../emulator/Settings";
import { deleteSubscription } from "../../api/gcp.pubsub";
import EmulatorContext, { EmulatorContextType } from "../../contexts/emulators";
import { shortId } from "../../utils/pubsub";
import PullMessage from "./PullMessage";

type SubscriptionsListProps = {
    subscriptions: SubscriptionType[],
    setSubscriptions: React.Dispatch<React.SetStateAction<SubscriptionType[]>>
}

function SubscriptionList({subscriptions, setSubscriptions}: SubscriptionsListProps): React.ReactElement {
    const { getEmulatorByType } = useContext(EmulatorContext) as EmulatorContextType
    let emulator = getEmulatorByType("pubsub")
    const [open, setOpen]  = useState(false)
    const [subscriptionName, setSubscriptionName]  = useState<SubscriptionNameType>()
    
    const handleDeleteClick = (id: GridRowId) => () => {
        deleteSubscriptionAction(id.toString())
    };

    const handlePullMessageClick = (id: GridRowId) => () => {
        setOpen(true)
        setSubscriptionName({ name: shortId(id.toString())})
        console.log("Pull message", id.toString())
    };

    const deleteSubscriptionCallback = useCallback(async (
        settings: SettingsType, 
        subscriptionName: SubscriptionNameType,
    ) => {
        const response = await deleteSubscription(settings, subscriptionName)
        const status = response.status
        
        if (status == 200) {
            const filteredTopics = subscriptions.filter((t: SubscriptionType) => t.name !== subscriptionName.name);
            setSubscriptions(filteredTopics);
        }
    }, [subscriptions])

    const deleteSubscriptionAction = useCallback(async (
        id: string,
    ) => {
        if (emulator != undefined) {
            deleteSubscriptionCallback({
                host: emulator.host, 
                port: emulator.port,
                project_id: emulator.project_id,
            }, {
                name: id
            }).catch(console.error);
        }
    }, [emulator, deleteSubscriptionCallback])

    const columns: GridColDef[] = [
        { 
            field: 'name', 
            headerName: 'Subscription ID', 
            width: 150 
        },
        { 
            field: 'type', 
            headerName: 'Type', 
            width: 100 
        },
        { 
            field: 'topic', 
            headerName: 'Topic', 
            width: 100 
        },
        { 
            field: 'pushEndpoint', 
            headerName: 'Push endpoint', 
            width: 300 
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
              
              return [
                <Tooltip title="Delete">
                    <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={handleDeleteClick(id)}
                    color="inherit"
                    />
                </Tooltip>,
                <Tooltip title="Pull Message">
                    <GridActionsCellItem
                    icon={<MarkChatReadIcon />}
                    label="Pull Message"
                    onClick={handlePullMessageClick(id)}
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
            name: shortId(subscription.name),
            topic: shortId(subscription.topic),
            type: subscription.pushConfig?.pushEndpoint ? 'push' : 'pull',
            pushEndpoint: subscription.pushConfig?.pushEndpoint
        }
    })

    return (
        <>
        {subscriptions.length == 0 ? (
            <Alert severity="info" className="my-5">No subscription</Alert>
        ) : (
            <div className="mt-10">
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
                <PullMessage open={open} setOpen={setOpen} subscriptionName={subscriptionName} />
            </div>
        )}
        </>
    )
}

export default SubscriptionList;
