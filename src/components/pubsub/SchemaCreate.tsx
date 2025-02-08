import React, { useCallback, useContext, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import { Box, InputLabel, MenuItem, Select, Stack, TextField, Tooltip } from '@mui/material';

import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';
import { SchemaType, SchemaTypes } from './Schema';
import { createSchema } from '../../api/pubsub.schema';

type SchemaCreateProps = {
  schemas: SchemaType[];
  setSchemas: React.Dispatch<React.SetStateAction<SchemaType[]>>;
};

type SchemaFormType = {
  name: string;
  type: SchemaTypes;
  definition: string;
};

function SchemaCreate({
  schemas,
  setSchemas,
}: SchemaCreateProps): React.ReactElement {
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const [Error, setError] = useState<string | undefined>(undefined);
  const [IsCreated, setIsCreated] = useState(false);

  const emulator = getEmulator();

  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      type: '',
      definition: '',
    },
  });

  const createSChemaCallback = useCallback(
    async (settings: SettingsType, schema: SchemaFormType) => {
      const createdSchema = await createSchema(settings, schema);

      if (createdSchema) {
        setIsCreated(true);
        setSchemas([...schemas, createdSchema]);
        reset();
      } else {
        setError('Error creating topic');
      }

      setTimeout(resetAlerts, 3000);
    },
    [schemas],
  );

  const onSubmit: SubmitHandler<SchemaFormType> = (Formdata): void => {
    resetAlerts();

    if (Formdata.name === undefined || Formdata.name === '') {
      setError('Name is required');
      return;
    }
    if (emulator != undefined) {
      createSChemaCallback(emulator, Formdata).catch(console.error);
    }
  };

  const resetAlerts = () => {
    setIsCreated(false);
    setError(undefined);
  };

  return (
    <>
      <Box
        component="form"
        name="topic_create"
        noValidate
        autoComplete="off"
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack direction="row" className="gap-2">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Tooltip title="Schema name" placement="top-start">
                <TextField
                  {...field}
                  required
                  id="name"
                  label="Name"
                  size="small"
                  variant="filled"
                />
              </Tooltip>
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
                <Tooltip title="Schema type" placement="top-start">
                    <Select
                      {...field}
                      required
                      id="type"
                      label="Type"
                      size="small"
                      variant="filled"
                    >
                      <MenuItem value={SchemaTypes.TYPE_UNSPECIFIED}>Unspecified</MenuItem>
                      <MenuItem value={SchemaTypes.AVRO}>Avro</MenuItem>
                      <MenuItem value={SchemaTypes.PROTOCOL_BUFFER}>Protocol Buffer</MenuItem>
                    </Select>
              </Tooltip>
            )}
          />

          <Controller
            name="definition"
            control={control}
            render={({ field }) => (
              <Tooltip title="Schema definition" placement="top-start">
                <TextField
                  {...field}
                  required
                  id="definition"
                  label="Definition"
                  size="small"
                  variant="filled"
                />
              </Tooltip>
            )}
          />

        </Stack>
      </Box>
    </>
  );
}

export default SchemaCreate;
export type { SchemaFormType };
