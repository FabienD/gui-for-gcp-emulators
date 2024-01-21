import React, { useCallback, useContext, useEffect, useState } from "react";

import { Box, Tab} from "@mui/material";
import { TabPanel, TabContext, TabList } from "@mui/lab";

import Emulator, { SettingsType } from "../components/emulator/Settings";
import Title from "../components/ui/Title";
import Topic, { TopicType } from "../components/pubsub/Topic";
import EmulatorContext, { EmulatorContextType } from "../contexts/emulators";
import Subscription from "../components/pubsub/Subscription";
import icon from "../assets/icons/pubsub.svg";
import { getTopics } from "../api/gcp.pubsub";

function Pubsub(): React.ReactElement{
    const { getEmulatorByType, isEmulatorTypeConnected } = useContext(EmulatorContext) as EmulatorContextType;

    let emulator = getEmulatorByType("pubsub");
    const isConnected = isEmulatorTypeConnected("pubsub");

    const [tabIndex, setTabIndex] = React.useState(isConnected ? "2" : "1");
    const [topics, setTopics] = useState<TopicType[]>([]);
    
    const getTopicsCallback = useCallback(async (
        settings: SettingsType,
    ) => {
        const response = await getTopics(settings);
        const content = await response.json();

        if (content != undefined 
            && content.topics != undefined
            && content.topics.length > 0
        ) {
            setTopics([...content.topics]);   
        } else {
            setTopics([]);   
        }
    }, [])

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setTabIndex(newValue);
    };

    useEffect(() => {
        if (emulator != undefined) {
            getTopicsCallback({
                host: emulator.host, 
                port: emulator.port,
                project_id: emulator.project_id,
            }).catch(console.error);
        }
    }, [emulator, getTopicsCallback])

    return (
        <>
            <Title title="Pub/Sub" icon={icon} />
            
            <TabContext value={tabIndex} >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label="Pubsub resources">
                        <Tab label="Settings" value="1" />
                        <Tab label="Topic" value="2" />
                        <Tab label="Subscription" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Emulator type="pubsub" host={emulator? emulator.host : "localhost"} port={emulator? emulator.port : 8085} project_id={emulator? emulator.project_id : "fake"} />
                </TabPanel >
                <TabPanel value="2">
                    <Topic topics={topics} setTopics={setTopics} />
                </TabPanel >
                <TabPanel value="3">
                    <Subscription topics={topics} />
                </TabPanel >
            </TabContext>
        </>
    );
}

export default Pubsub;
