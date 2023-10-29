import React from "react";

import { Box, Tab} from "@mui/material";
import Emulator from "../components/emulator/Settings";
import Title from "../components/ui/Title";
import { TabPanel, TabContext, TabList } from "@mui/lab";
import Topic from "../components/pubsub/Topic";
import { isEmuluatorTypeConnected } from "../utils/emulator";


function Pubsub(): React.ReactElement{
    const isConnected = isEmuluatorTypeConnected("pubsub");
    const [value, setValue] = React.useState(isConnected ? "2" : "1");

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
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Emulator type="pubsub" host="localhost" port={8085} />
                </TabPanel >
                <TabPanel value="2">
                    <Topic />
                </TabPanel >
            </TabContext>
        </>
    );
}

export default Pubsub;
