import React, { useContext, useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import { Alert, Box, InputAdornment, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import BoltIcon from '@mui/icons-material/Bolt';

import EmulatorsContext, { checkEmulatorConnection, EmulatorsContextType, EmulatorType } from '../../contexts/emulators';

type SettingsType = {
  type: EmulatorType;
  host: string;
  port: number;
  project_id: string;
};

function EmulatorSettings({
  type,
  host,
  port,
  project_id,
}: SettingsType): React.ReactElement {
  const { upsertEmulator } = useContext(EmulatorsContext) as EmulatorsContextType;
  const [settings, setSettings] = useState<SettingsType>();
  const [checkConnection, setIsCheckConnection] = useState<boolean | undefined>(
    undefined,
  );

  const { control, handleSubmit } = useForm({
    defaultValues: {
      type,
      host,
      port,
      project_id,
    },
  });
  const onSubmit: SubmitHandler<SettingsType> = (data): void => {
    setSettings({
      type: data.type,
      host: data.host,
      port: parseInt(data.port.toString()),
      project_id: data.project_id,
    });
  };

  useEffect(() => {
    resetAlerts();
    if (settings != undefined) {
      checkEmulatorConnection(settings.type, settings.host, settings.port).then(
        (res): void => {
          if (res) {
            upsertEmulator({
              type: settings.type,
              host: settings.host,
              port: settings.port,
              project_id: settings.project_id,
              is_connected: true,
            });
            setIsCheckConnection(true);
          } else {
            setIsCheckConnection(false);
          }
        },
      );
    }
  }, [settings]);

  const resetAlerts = () => {
    setIsCheckConnection(undefined);
  };

  return (
    <>
      <Typography variant="h6" component="h2" color='primary' fontWeight={600} className="p-2">
          {type.charAt(0).toUpperCase() + type.slice(1)}
      </Typography>
      <Box
        component="form"
        name="settings-{type}"
        noValidate
        autoComplete="off"
        className="flex gap-2 p-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        
         <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              required
              id="type"
              label="Type"
              size="small"
              variant="filled"
              hidden={true}
            />
          )}
        />

        <Controller
          name="host"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              required
              id="host"
              label="Host"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">http://</InputAdornment>
                  ),
                },
              }}
              size="small"
              variant="filled"
            />
          )}
        />

        <Controller
          name="port"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              required
              id="port"
              type="number"
              label="port"
              size="small"
              variant="filled"
            />
          )}
        />

        <Controller
          name="project_id"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              required
              id="project_id"
              label="Project id"
              size="small"
              variant="filled"
            />
          )}
        />

        <Button
          variant="contained"
          size="small"
          type="submit"
          startIcon={<BoltIcon />}
        >
          Set
        </Button>

        {checkConnection === false && (
          <Alert severity="error">Unable to connect.</Alert>
        )}
        {checkConnection === true && (
          <Alert severity="success">Emulator is connected.</Alert>
        )}
      </Box>
    </>
  );
}

export default EmulatorSettings;
export type { SettingsType };
