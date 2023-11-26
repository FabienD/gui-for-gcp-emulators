import React, { useCallback, useContext } from "react";

import { Alert } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import { SubscriptionNameType, SubscriptionType } from "./Subscription";
import { SettingsType } from "../emulator/Settings";
import { deleteSubscription } from "../../api/gcp.pubsub";
import EmulatorContext, { EmulatorContextType } from "../../contexts/emulators";

type SubscriptionsListProps = {
    subscriptions: SubscriptionType[],
    setSubscriptions: React.Dispatch<React.SetStateAction<SubscriptionType[]>>
}

function SubscriptionList({subscriptions, setSubscriptions}: SubscriptionsListProps): React.ReactElement {
    const { getEmulatorByType } = useContext(EmulatorContext) as EmulatorContextType;
    let emulator = getEmulatorByType("pubsub");
    
    const handleDeleteClick = (id: GridRowId) => () => {
        deleteSubscriptionAction(id.toString());
    };

    const deleteSubscriptionCallback = useCallback(async (
        settings: SettingsType, 
        subscriptionName: SubscriptionNameType,
    ) => {
        const response = await deleteSubscription(settings, subscriptionName);
        const status = await response.status;
        
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
            width: 300 
        },
        { 
            field: 'type', 
            headerName: 'Type', 
            width: 100 
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
              
              return [
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={handleDeleteClick(id)}
                  color="inherit"
                />,
              ];
            },
          },
    ];

    const rows = subscriptions.map((subscription: SubscriptionType) => {
        return {
            id: subscription.name,
            name: subscription.name,
            type: subscription.pushConfig?.pushEndpoint ? 'push' : 'pull'
        }
    })

    console.log(subscriptions)

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
            </div>
        )}
        </>
    )
}

export default SubscriptionList;