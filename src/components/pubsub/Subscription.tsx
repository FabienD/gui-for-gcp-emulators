import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert } from "@mui/material";

import EmulatorContext, { EmulatorContextType } from "../../contexts/emulators";
import SubscriptionCreate from "./SubscriptionCreate";
import SubscriptionList from "./SubscriptionList";
import { IFormSettings } from "../emulator/Settings";
import { getSubscriptions } from "../../api/gcp.pubsub";

type SubscriptionType = {
    name: string
}

function Subscription(): React.ReactElement {
    const { getEmulatorByType } = useContext(EmulatorContext) as EmulatorContextType;
    const [subscriptions, setSubscription] = useState<SubscriptionType[]>([]);   

    let emulator = getEmulatorByType("pubsub");
    const isConnected = emulator?.is_connected;

    const getSubscriptionsCallback = useCallback(async (
        settings: IFormSettings,
    ) => {
        const response = await getSubscriptions(settings);
        const content = await response.json();
        
        if (content != undefined 
            && content.topics != undefined
            && content.topics.length > 0
        ) {
            setSubscription([...subscriptions, ...content.subscriptions]);   
        }
    }, [])

    useEffect(() => {
        if (emulator != undefined) {
            getSubscriptionsCallback({
                host: emulator.host, 
                port: emulator.port
            }).catch(console.error);
        }
    }, [emulator, getSubscriptionsCallback])

    return (
        isConnected ? (
            <>
                <SubscriptionCreate subscriptions={subscriptions} setSubscriptions={setSubscriptions} />
                <SubscriptionList subscriptions={subscriptions} />
            </>    
        ) : (
            <Alert severity={ isConnected ? "info" : "warning" } className="ml-5">
                The emulator is not configured or the connection is not validated.
            </Alert>
        )
    );
}

export default Subscription;
export type { SubscriptionType };