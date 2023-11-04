import React from "react";
import { SubscriptionType } from "./Subscription";

type SubscriptionCreateProps = {
    subscriptions: SubscriptionType[],
    setSubscriptions: React.Dispatch<React.SetStateAction<SubscriptionType[]>>
}

function SubscriptionCreate({subscriptions, setSubscriptions}: SubscriptionCreateProps): React.ReactElement {
    return (
        <>
        // Subscription Create
        </>
    )
}

export default SubscriptionCreate;