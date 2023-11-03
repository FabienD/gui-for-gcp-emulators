import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import TopicList from "./TopicList";
import TopicCreate from "./TopicCreate";
import Alert from "@mui/material/Alert";
import EmulatorContext, { EmulatorContextType } from "../../contexts/emulators";
import { IFormSettings } from "../emulator/Settings";
import { getTopics, deleteTopic } from "../../api/gcp.pubsub";

type TopicType = {
    name: string
}

function Topic(): React.ReactElement{
    const { getEmulatorByType } = useContext(EmulatorContext) as EmulatorContextType;
    const [topics, setTopics] = useState<TopicType[]>([]);   

    let emulator = getEmulatorByType("pubsub");
    const isConnected = emulator?.is_connected;
    
    const getTopicsCallback = useCallback(async (
        settings: IFormSettings,
    ) => {
        const response = await getTopics(settings);
        const content = await response.json();
        
        if (content != undefined 
            && content.topics != undefined
            && content.topics.length > 0
        ) {
            setTopics([...topics, ...content.topics]);   
        }
    }, [])

    const deleteTopicCallback = useCallback(async (
        settings: IFormSettings, 
        topic: TopicType,
    ) => {
        const response = await deleteTopic(settings, topic);
        const status = await response.status;
        
        if (status == 200) {
            const filteredTopics = topics.filter((t: TopicType) => t.name !== topic.name);
            setTopics(filteredTopics);
        }
    }, [topics])

    const deleteTopicAction = useCallback(async (
        id: string,
    ) => {
        if (emulator != undefined) {
            deleteTopicCallback({
                host: emulator.host, 
                port: emulator.port
            }, {
                name: id
            }).catch(console.error);
        }
    }, [emulator, deleteTopicCallback])

    useEffect(() => {
        if (emulator != undefined) {
            getTopicsCallback({
                host: emulator.host, 
                port: emulator.port
            }).catch(console.error);
        }
    }, [emulator, getTopicsCallback])

    return (
        isConnected ? (
            <>
                <TopicCreate topics={topics} setTopics={setTopics} />
                <TopicList topics={topics} deleteTopic={deleteTopicAction} />
            </>    
        ) : (
            <Alert severity={ isConnected ? "info" : "warning" } className="ml-5">
                The emulator is not configured or the connection is not validated.
            </Alert>
        )
    );
}

export default Topic;
export type { TopicType };