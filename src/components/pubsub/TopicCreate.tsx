import React, { useCallback, useContext } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Alert, Box, Button, TextField } from "@mui/material";


import EmulatorContext, { EmulatorContextType } from "../../contexts/emulators";
import { SettingsType } from "../emulator/Settings";
import { TopicType } from "./Topic";
import { createTopic } from "../../api/gcp.pubsub";


type TopicCreateProps = {
    topics: TopicType[],
    setTopics: React.Dispatch<React.SetStateAction<TopicType[]>>
}

function TopicCreate({ topics, setTopics}: TopicCreateProps): React.ReactElement {
    const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
    const [Error, setError] = React.useState<string|undefined>(undefined);
    const [IsCreated, setIsCreated] = React.useState(false);

    const emulator = getEmulator();
    const { control, reset, handleSubmit } = useForm({
        defaultValues: {
            name: '',
        },
    })

    const createTopicCallback = useCallback(async (
            settings: SettingsType, 
            topic: TopicType
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
                reset();
            } else {
                if (content.error != undefined 
                    && content.error.message != undefined
                ) {
                    setError(content.error.message);
                } else {
                    setError("Unknown error");
                }
            }

            setTimeout(resetAlerts, 3000)
    }, [topics])

    const onSubmit: SubmitHandler<TopicType> = (Formdata): void => {        
        resetAlerts()
        
        if (Formdata.name === undefined || Formdata.name === "") {
            setError("Name is required");
            return;
        }
        if (emulator != undefined) {
            createTopicCallback(emulator, Formdata).catch(console.error)    
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
                        label="Name"
                        size='small'
                        variant="filled"
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