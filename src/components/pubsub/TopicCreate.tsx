import React, { useCallback } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Box, Button, TextField } from "@mui/material";
import { getEmulatorByType } from "../../utils/emulator";
import { createTopic } from "../../utils/pubsub";
import { IFormSettings } from "../emulator/Settings";
import { TopicType } from "./Topic";

type IFormPubsubTopic = {
    name: string
}

type TopicCreateProps = {
    topics: TopicType[],
    setTopics: React.Dispatch<React.SetStateAction<TopicType[]>>
}

function TopicCreate({ topics, setTopics}: TopicCreateProps): React.ReactElement {
    const emulator = getEmulatorByType("pubsub");
    const { control, handleSubmit } = useForm({
        defaultValues: {
            name: '',
        },
    })

    const createTopicCallback = useCallback(async (settings: IFormSettings, topic: IFormPubsubTopic) => {
        const response = await createTopic(settings, topic);
        const content = await response.json();
        console.log(content);

    }, [emulator])


    const onSubmit: SubmitHandler<IFormPubsubTopic> = (data): void => {
        const topic: TopicType = {
            name: data.name
        }
        if (emulator != undefined && topic != undefined) {
            setTopics([...topics, topic]);
            createTopicCallback(emulator, topic).catch(console.error)
        }
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
                        label="Topic name"
                        size='small'
                    />}
                />
                                
                <Button variant="contained" size='small' type="submit">Create</Button>   
                
            </Box>
        </>
    );
}

export default TopicCreate;
export type { IFormPubsubTopic };