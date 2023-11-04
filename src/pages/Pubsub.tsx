import React, { useContext } from "react";

import { Box, Tab} from "@mui/material";
import { TabPanel, TabContext, TabList } from "@mui/lab";

import Emulator from "../components/emulator/Settings";
import Title from "../components/ui/Title";
import Topic from "../components/pubsub/Topic";
import EmulatorContext, { EmulatorContextType } from "../contexts/emulators";
import Subscription from "../components/pubsub/Subscription";


function Pubsub(): React.ReactElement{
    const { isEmulatorTypeConnected } = useContext(EmulatorContext) as EmulatorContextType;
    const isConnected = isEmulatorTypeConnected("pubsub");
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
                        <Tab label="Subscription" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <Emulator type="pubsub" host="localhost" port={8085} />
                </TabPanel >
                <TabPanel value="2">
                    <Topic />
                </TabPanel >
                <TabPanel value="3">
                    <Subscription />
                </TabPanel >
            </TabContext>
        </>
    );
}

export default Pubsub;
