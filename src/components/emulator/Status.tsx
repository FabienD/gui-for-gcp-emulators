import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import BoltIcon from '@mui/icons-material/Bolt';
import { Tooltip } from '@mui/material';
import { green, grey } from '@mui/material/colors';

import EmulatorsContext, { EmulatorsContextType } from '../../contexts/emulators';

function Status(): React.ReactElement {
  const { getEmulator } = useContext(EmulatorsContext) as EmulatorsContextType;
  const emulator = getEmulator('pubsub');

  const color = emulator?.is_connected ? green[500] : grey[500];
  const alt = emulator?.is_connected
    ? 'connected to http://' +
      emulator?.host +
      ':' +
      emulator?.port +
      '/' +
      emulator?.project_id
    : 'not connected';

  return (
    <div className="absolute top-5 right-5">
      <NavLink to="/">
        <Tooltip title={alt} placement="left">
          <BoltIcon sx={{ color }} />
        </Tooltip>
      </NavLink>
    </div>
  );
}

export default Status;
