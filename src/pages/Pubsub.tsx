import React from "react";

import { Box, Tab} from "@mui/material";
import Emulator from "../components/form/Emulator";
import Title from "../components/ui/Title";
import { TabPanel, TabContext, TabList } from "@mui/lab";


function Pubsub(): React.ReactElement{
    const [isConnected, setIsConnected] = React.useState<boolean>(false);

    const [value, setValue] = React.useState('1');

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <>
            <Title title="Pubsub" />
            <Emulator name="pubsub" />
            {isConnected ? (
            <TabContext value={value} >
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label="Pubsub resources">
                        <Tab label="Topic" value="1" />
                        <Tab label="Subscription" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                // Todo Topic
                </TabPanel >
                <TabPanel  value="2">
                // Todo Subscription
                </TabPanel >
            </TabContext>
        ) : (
            <></>
        )}
        </>
    );
}

export default Pubsub;
