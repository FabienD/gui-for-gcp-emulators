import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import BoltIcon from '@mui/icons-material/Bolt';
import { Tooltip } from "@mui/material";
import { green, grey } from "@mui/material/colors";

import EmulatorContext, { EmulatorContextType } from "../../contexts/emulators";

function Status(): React.ReactElement {
    const { getEmulator, isConnected } = useContext(EmulatorContext) as EmulatorContextType; 

    let emulator = getEmulator();

    let color = isConnected() ? green[500] : grey[500];
    let alt = isConnected() ? "connected to http://" + emulator?.host + ":" + emulator?.port + "/" + emulator?.project_id : "not connected";

    return (
        <div className="absolute top-5 right-5">
            <NavLink to="/">
                <Tooltip title={alt} placement="left">
                    <BoltIcon sx={{color}} />
                </Tooltip>
            </NavLink>    
        </div>
    )
}

export default Status