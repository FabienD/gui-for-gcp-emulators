import React, { useContext, useState } from "react";
import { Alert } from "@mui/material";

import EmulatorContext, { EmulatorContextType } from "../../contexts/emulators";
import SubscriptionCreate from "./SubscriptionCreate";
import SubscriptionList from "./SubscriptionList";

type SubscriptionType = {
    name: string
}

function Subscription(): React.ReactElement {
    const { getEmulatorByType } = useContext(EmulatorContext) as EmulatorContextType;
    const [subscriptions, setSubscription] = useState<SubscriptionType[]>([]);   

    let emulator = getEmulatorByType("pubsub");
    const isConnected = emulator?.is_connected;

    return (
        isConnected ? (
            <>
                <SubscriptionCreate />
                <SubscriptionList />
            </>    
        ) : (
            <Alert severity={ isConnected ? "info" : "warning" } className="ml-5">
                The emulator is not configured or the connection is not validated.
            </Alert>
        )
    );
}

export default Subscription;