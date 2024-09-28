import React, { useContext } from "react";
import TopicList from "./TopicList";
import TopicCreate from "./TopicCreate";
import Alert from "@mui/material/Alert";
import EmulatorContext, { EmulatorContextType } from "../../contexts/emulators";

type TopicNameType = {
    readonly name: string
}

type TopicType = TopicNameType & {
    readonly labels?: {
        [key: string]: string
    },
}

type TopicProps = {
    topics: TopicType[],
    setTopics: React.Dispatch<React.SetStateAction<TopicType[]>>
    getTopicsCallback: any,
}

function Topic({ topics, setTopics, getTopicsCallback }: TopicProps ): React.ReactElement{
    const { getEmulatorByType } = useContext(EmulatorContext) as EmulatorContextType;
    
    let emulator = getEmulatorByType("pubsub");
    const isConnected = emulator?.is_connected;    

    return (
        isConnected ? (
            <>
                <TopicCreate topics={topics} setTopics={setTopics} />
                <TopicList topics={topics}  setTopics={setTopics} getTopicsCallback={getTopicsCallback} />
            </>
        ) : (
            <Alert severity={ isConnected ? "info" : "warning" }>
                The emulator is not configured or the connection is not validated.
            </Alert>
        )
    );
}

export default Topic;
export type { TopicNameType, TopicType };