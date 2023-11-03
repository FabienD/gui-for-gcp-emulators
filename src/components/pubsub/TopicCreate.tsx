import React, { useCallback, useContext } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Alert, Box, Button, TextField } from "@mui/material";


import EmulatorContext, { EmulatorContextType } from "../../contexts/emulators";
import { IFormSettings } from "../emulator/Settings";
import { TopicType } from "./Topic";
import { createTopic } from "../../api/gcp.pubsub";


type IFormPubsubTopic = {
    name: string
}

type TopicCreateProps = {
    topics: TopicType[],
    setTopics: React.Dispatch<React.SetStateAction<TopicType[]>>
}

function TopicCreate({ topics, setTopics}: TopicCreateProps): React.ReactElement {
    const { getEmulatorByType } = useContext(EmulatorContext) as EmulatorContextType;
    const [Error, setError] = React.useState<string|undefined>(undefined);
    const [IsCreated, setIsCreated] = React.useState(false);

    const emulator = getEmulatorByType("pubsub");
    const { control, handleSubmit } = useForm({
        defaultValues: {
            name: '',
        },
    })

    const createTopicCallback = useCallback(async (
            settings: IFormSettings, 
            topic: IFormPubsubTopic
        ) => {
            const response = await createTopic(settings, topic);
            const status = await response.status;
            const content = await response.json();
            
            if (status === 200 
                && content != undefined
                && content.name != undefined
            ) {
                setIsCreated(true);
                setTopics([...topics, content]);
            } else {
                if (content.error != undefined 
                    && content.error.message != undefined
                ) {
                    setError(content.error.message);
                } else {
                    setError("Unknown error");
                }
            }
    }, [topics])

    const onSubmit: SubmitHandler<IFormPubsubTopic> = (data): void => {
        const topic: TopicType = {
            name: data.name
        }
        
        resetAlerts()

        if (topic.name === undefined || topic.name === "") {
            setError("Name is required");
            return;
        }
        if (emulator != undefined) {
            createTopicCallback(emulator, topic).catch(console.error)    
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
                name="topic_create"
                noValidate
                autoComplete="off"
                className='flex gap-2'
                onSubmit={handleSubmit(onSubmit)}
            >
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => <TextField
                        {...field}
                        required
                        id="name"
                        label="New topic name"
                        size='small'
                    />}
                />
                                
                <Button variant="contained" size='small' type="submit">Create</Button>   
                
                {Error != undefined && <Alert severity="error">{Error}</Alert>}
                {IsCreated && <Alert severity="success">Topic is created</Alert>}
            </Box>
        </>
    );
}

export default TopicCreate;
export type { IFormPubsubTopic };