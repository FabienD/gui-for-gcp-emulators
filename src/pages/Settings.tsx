import React, { useContext } from 'react';

import Title from '../components/ui/Title';
import icon from '../assets/icons/settings.svg';

import EmulatorSettings from '../components/emulator/Settings';
import EmulatorContext, { EmulatorContextType } from '../contexts/emulators';

function Settings(): React.ReactElement {
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  
  const emulator = getEmulator();

  return (
      <>
        <Title title="Settings" icon={icon} />
        <EmulatorSettings
          host={emulator ? emulator.host : 'localhost'}
          port={emulator ? emulator.port : 8085}
          project_id={emulator ? emulator.project_id : 'project_id'}
        />
      </>
    );
}

export default Settings;