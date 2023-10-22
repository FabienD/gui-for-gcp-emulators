import React from "react";

import { Box, Tab} from "@mui/material";
import Emulator from "../components/form/Emulator";
import Title from "../components/ui/Title";
import { TabPanel, TabContext, TabList } from "@mui/lab";
import TopicList from "../components/pubsub/TopicList";


function Pubsub(): React.ReactElement{
    const [value, setValue] = React.useState('1');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    
    return (
        <>
            <Title title="Pubsub" />
            
            <TabContext value={value} >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label="Pubsub resources">
                        <Tab label="Settings" value="1" />
                        <Tab label="Topic" value="2" />
                        <Tab label="Subscription" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Emulator type="pubsub" host="localhost" port={8085} />
                </TabPanel >
                <TabPanel value="2">
                    <TopicList />
                </TabPanel >
                <TabPanel  value="3">
                // Todo Subscription
                </TabPanel >
            </TabContext>
        </>
    );
}

export default Pubsub;
