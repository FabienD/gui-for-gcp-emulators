import React, { useContext } from 'react';

import icon from '../assets/icons/settings.svg';
import EmulatorSettings from '../components/emulator/Settings';
import Title from '../components/ui/Title';
import EmulatorsContext, { EmulatorsContextType } from '../contexts/emulators';

function Settings(): React.ReactElement {
  const { getEmulator } = useContext(EmulatorsContext) as EmulatorsContextType;

  const bigqueryEmulator = getEmulator('bigquery');
  const firestoreEmulator = getEmulator('firestore');
  const pubsubEmulator = getEmulator('pubsub');

  return (
    <>
      <Title title="Settings" icon={icon} />
      <EmulatorSettings
        type="bigquery"
        host={bigqueryEmulator ? bigqueryEmulator.host : 'localhost'}
        port={bigqueryEmulator ? bigqueryEmulator.port : 8087}
        project_id={bigqueryEmulator ? bigqueryEmulator.project_id : 'fake'}
      />
      <EmulatorSettings
        type="firestore"
        host={firestoreEmulator ? firestoreEmulator.host : 'localhost'}
        port={firestoreEmulator ? firestoreEmulator.port : 8086}
        project_id={firestoreEmulator ? firestoreEmulator.project_id : 'fake'}
      />
      <EmulatorSettings
        type="pubsub"
        host={pubsubEmulator ? pubsubEmulator.host : 'localhost'}
        port={pubsubEmulator ? pubsubEmulator.port : 8085}
        project_id={pubsubEmulator ? pubsubEmulator.project_id : 'fake'}
      />
    </>
  );
}

export default Settings;
