import React, { useContext } from 'react';

import { Box, Typography } from '@mui/material';

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
      <Typography>
        All emulators are provided by Google, except the{' '}
        <a
          href="https://github.com/goccy/bigquery-emulator"
          target="_blank"
          className="underline decoration-solid underline-offset-4 decoration-sky-500"
          rel="noreferrer"
        >
          BigQuery emulator
        </a>
        . You can run all the emulators using Docker, a docker-compose file is
        provided in the repository. You can also run the emulators using the
        <strong> gcloud</strong> command line tool except the BigQuery emulator.
      </Typography>
      <Box>
        <EmulatorSettings
          type="bigquery"
          host={bigqueryEmulator ? bigqueryEmulator.host : 'localhost'}
          port={bigqueryEmulator ? bigqueryEmulator.port : 8087}
          project_id={bigqueryEmulator ? bigqueryEmulator.project_id : 'fake'}
        />
        <Typography className="pl-5 max-w-[85%]">
          <strong>Note:</strong> The default project_id value is{' '}
          <strong>fake</strong> and provided by the command that launches the
          emulator. Using Docker, you can easily change the project_id by
          overriding the docker-compose file.
        </Typography>
      </Box>
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
