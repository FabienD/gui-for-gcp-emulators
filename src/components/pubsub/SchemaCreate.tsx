import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';

import { SchemaTypes } from './Schema';
import HelpLink from '../ui/HelpLink';
import { useCreateSchema } from '../../hooks/usePubsub';

type SchemaFormType = {
  name: string;
  type: string;
  definition: string;
};

function SchemaCreate(): React.ReactElement {
  const createSchemaMutation = useCreateSchema();

  const [Error, setError] = useState<string | undefined>(undefined);
  const [IsCreated, setIsCreated] = useState(false);

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: '',
      type: '',
      definition: '',
    },
  });

  const resetAlerts = () => {
    setIsCreated(false);
    setError(undefined);
  };

  const onSubmit: SubmitHandler<SchemaFormType> = (formData): void => {
    resetAlerts();

    createSchemaMutation.mutate(formData, {
      onSuccess: () => {
        setIsCreated(true);
        reset();
        setTimeout(resetAlerts, 3000);
      },
      onError: error => {
        setError('Error creating schema');
        console.error(error);
        setTimeout(resetAlerts, 3000);
      },
    });
  };

  return (
    <>
      <Box
        component="form"
        name="schema_create"
        id="schema_create"
        noValidate
        autoComplete="off"
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack direction="row" className="gap-2">
          <HelpLink linkUrl="https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.schemas" />
          <Controller
            name="name"
            control={control}
            rules={{
              validate: {
                checkFormat: (name: string) => {
                  const regex = /^[a-zA-Z]{1}[a-zA-Z0-9\-_%+~]{2,254}$/i;
                  if (!regex.test(name)) {
                    return 'Subscription name format is not correct';
                  }
                },
                checkName: (name: string) => {
                  if (name.toLowerCase().includes('goog')) {
                    return 'Subscription name cannot contain "goog"';
                  }
                },
              },
              required: true,
            }}
            render={({ field }) => (
              <Tooltip title="Schema name" placement="top-start">
                <TextField
                  {...field}
                  required
                  id="name"
                  label="Name"
                  size="small"
                  variant="filled"
                  error={errors.name ? true : false}
                />
              </Tooltip>
            )}
          />

          <Controller
            name="type"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl variant="filled" sx={{ minWidth: 120 }}>
                <InputLabel
                  id="schema-type-label"
                  error={errors.type ? true : false}
                >
                  Type *
                </InputLabel>
                <Tooltip title="Schema type" placement="top-start">
                  <Select
                    {...field}
                    required
                    id="type"
                    labelId="schema-type-label"
                    size="small"
                    variant="filled"
                    error={errors.type ? true : false}
                  >
                    <MenuItem value="AVRO">{SchemaTypes.AVRO}</MenuItem>
                    <MenuItem value="PROTOCOL_BUFFER">
                      {SchemaTypes.PROTOCOL_BUFFER}
                      <em>(Not supported by emulator)</em>
                    </MenuItem>
                  </Select>
                </Tooltip>
              </FormControl>
            )}
          />

          <Button variant="contained" size="small" type="submit">
            Create
          </Button>

          {Error != undefined && <Alert severity="error">{Error}</Alert>}
          {IsCreated && <Alert severity="success">Schema created</Alert>}
        </Stack>

        <Controller
          name="definition"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Tooltip title="Schema definition" placement="top-start">
              <TextField
                {...field}
                required
                id="definition"
                label="Definition"
                size="small"
                variant="filled"
                error={errors.definition ? true : false}
                rows={20}
                multiline
              />
            </Tooltip>
          )}
        />
      </Box>
    </>
  );
}

export default SchemaCreate;
export type { SchemaFormType };
