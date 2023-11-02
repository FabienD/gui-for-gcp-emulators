import React, { useCallback, useContext, useEffect, useState } from "react";
import TopicList from "./TopicList";
import TopicCreate from "./TopicCreate";
import Alert from "@mui/material/Alert";
import EmulatorContext, { EmulatorContextType } from "../../contexts/emulators";
import { IFormSettings } from "../emulator/Settings";
import { getTopics } from "../../api/gcp.pubsub";

type TopicType = {
    name: string
}

function Topic(): React.ReactElement{
    const { getEmulatorByType } = useContext(EmulatorContext) as EmulatorContextType;
    const [topics, setTopics] = useState<TopicType[]>([]);   

    let emulator = getEmulatorByType("pubsub");
    const isConnected = emulator?.is_connected;
    
    const getTopicsCallback = useCallback(async (settings: IFormSettings) => {
        const response = await getTopics(settings);
        const content = await response.json();
        
        if (content != undefined 
            && content.topics != undefined
            && content.topics.length > 0
        ) {
            setTopics([...topics, ...content.topics]);   
        }
    }, [])

    useEffect(() => {
        if (emulator != undefined) {
            getTopicsCallback({
                host: emulator.host, 
                port: emulator.port
            }).catch(console.error);
        }
    }, [emulator])


    return (
        isConnected ? (
            <>
                <TopicCreate topics={topics} setTopics={setTopics} />
                <TopicList topics={topics} />
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