import React, { useState } from "react";
import TopicList from "./TopicList";
import TopicCreate from "./TopicCreate";
import Alert from "@mui/material/Alert";
import { isEmuluatorTypeConnected } from "../../utils/emulator";

type TopicType = {
    name: string
}

function Topic(): React.ReactElement{
    const isConnected = isEmuluatorTypeConnected("pubsub");
    const [topics, setTopics] = useState<TopicType[]>([]);
    
    return (
        isConnected ? (
            <>
                <TopicCreate topics={topics} setTopics={setTopics} />
                <TopicList topics={topics} setTopics={setTopics} />
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