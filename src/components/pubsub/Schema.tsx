import React, { useContext } from 'react';
import Alert from '@mui/material/Alert';
import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';

function Schema(): React.ReactElement {
  const { isConnected } = useContext(EmulatorContext) as EmulatorContextType;

  return isConnected() ? (
    <>Todo: implement Schema</>
  ) : (
    <Alert severity={isConnected() ? 'info' : 'warning'}>
      The emulator is not configured or the connection is not validated.
    </Alert>
  );
}

export default Schema;
