import React, { useContext } from "react";
import EmulatorContext, { EmulatorContextType } from "../../contexts/emulators";
import BoltIcon from '@mui/icons-material/Bolt';
import { green } from "@mui/material/colors";

function Status(): React.ReactElement {
    const { isConnected } = useContext(EmulatorContext) as EmulatorContextType; 

    if (isConnected()) {
        return <BoltIcon sx={{ color: green[500] }} titleAccess="connected" />
    } else {
        return <></>
    }
}

export default Status