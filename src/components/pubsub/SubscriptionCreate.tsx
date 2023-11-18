import React, { useCallback, useContext } from "react";
import { SubscriptionType } from "./Subscription";
import { Alert, Box, Button, TextField, Select, MenuItem } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import EmulatorContext, { EmulatorContextType } from "../../contexts/emulators";
import { IFormSettings } from "../emulator/Settings";
import { createSubscription } from "../../api/gcp.pubsub";
import { TopicType } from "./Topic";


type IFormPubsubSubscription = {
    subscriptionName: string
    topicName: object
}

type SubscriptionCreateProps = {
    topics: TopicType[]
    subscriptions: SubscriptionType[],
    setSubscriptions: React.Dispatch<React.SetStateAction<SubscriptionType[]>>
}

function SubscriptionCreate({topics, subscriptions, setSubscriptions}: SubscriptionCreateProps): React.ReactElement {
    const { getEmulatorByType } = useContext(EmulatorContext) as EmulatorContextType;
    const emulator = getEmulatorByType("pubsub");
    
    const [Error, setError] = React.useState<string|undefined>(undefined);
    const [IsCreated, setIsCreated] = React.useState(false);

    const { control, handleSubmit } = useForm({
        defaultValues: {
            subscriptionName: "",
            topicName: topics,
        }
    })  

    const createSubscriptionCallback = useCallback(async (
        settings: IFormSettings, 
        subscription: IFormPubsubSubscription
    ) => {
        const response = await createSubscription(settings, subscription);
        const status = await response.status;
        const content = await response.json();
        
        if (status === 200 
            && content != undefined
            && content.name != undefined
        ) {
            setIsCreated(true);
            setSubscriptions([...subscriptions, content]);
        } else {
            if (content.error != undefined 
                && content.error.message != undefined
            ) {
                setError(content.error.message);
            } else {
                setError("Unknown error");
            }
        }
}, [subscriptions])

    const onSubmit: SubmitHandler<IFormPubsubSubscription> = (Formdata): void => {
        resetAlerts()

        if (Formdata.subscriptionName === undefined || Formdata.subscriptionName === "") {
            setError("Subscription name is required");
            return;
        }
        if (emulator != undefined) {
            createSubscriptionCallback(emulator, Formdata).catch(console.error)    
        }
    }  

    const resetAlerts = () => {
        setIsCreated(false);
        setError(undefined);
    }

    return (
        <>
            <Box
                component="form"
                name="subscition_create"
                noValidate
                autoComplete="off"
                className='flex gap-2'
                onSubmit={handleSubmit(onSubmit)}
            >
                <Controller
                    name="subscriptionName"
                    control={control}
                    render={({ field }) => <TextField
                        {...field}
                        required
                        id="subscriptionName"
                        label="Subscription name"
                        size='small'
                    />}
                />

                <Controller
                    name="topicName"
                    control={control}
                    render={({ field }) => 
                        <Select
                            {...field}
                            required
                            id="topicName"
                            labelId="subscription-topic-select-label"
                            label="Topic name"
                            size="small"
                        >
                            <MenuItem value="">
                                <em>Choose a topic</em>
                            </MenuItem>
                            {(
                                topics.map((topic) => (
                                    <MenuItem value={topic.name}>{topic.name}</MenuItem>
                                ))
                            )}
                        </Select>
                    }
                />
                                
                <Button variant="contained" size='small' type="submit">Create</Button>   
                
                {Error != undefined && <Alert severity="error">{Error}</Alert>}
                {IsCreated && <Alert severity="success">Subscription is created</Alert>}
            </Box>
        </>
    )
}

export default SubscriptionCreate;
export type { IFormPubsubSubscription };