import React, { useCallback, useContext, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  Collapse,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';
import { TopicType } from './Topic';
import { createTopic } from '../../api/pubsub.topic';
import { SchemaType } from './Schema';
import { shortName } from '../../utils/pubsub';
import HelpLink from '../ui/HelpLink';

type TopicCreateProps = {
  topics: TopicType[];
  setTopics: React.Dispatch<React.SetStateAction<TopicType[]>>;
  schemas: SchemaType[];
};

type TopicFormType = {
  name: string;
  labels?: string;
  messageRetentionDuration?: string;
  schemaName?: string;
  schemaEncoding?: string;
};

function TopicCreate({
  topics,
  setTopics,
  schemas,
}: TopicCreateProps): Promise<React.ReactElement> {
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const [SubmitError, setSubmitError] = useState<string | undefined>(undefined);
  const [IsCreated, setIsCreated] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false);

  const emulator = getEmulator();
  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      labels: '',
      messageRetentionDuration: '',
      schemaName: '',
      schemaEncoding: '',
    },
  });

  const createTopicCallback = useCallback(
    async (settings: SettingsType, topic: TopicFormType) => {
      try {
        const createdTopic = await createTopic(settings, topic);

        if (createdTopic) {
          setIsCreated(true);
          setTopics([...topics, createdTopic]);
          reset();
        }
      } catch (error) {
        setSubmitError('Error creating topic');
        console.error(error);
      }

      setTimeout(resetAlerts, 3000);
    },
    [topics],
  );

  const onSubmit: SubmitHandler<TopicFormType> = (Formdata): void => {
    resetAlerts();

    if (emulator != undefined) {
      createTopicCallback(emulator, Formdata).catch(console.error);
    }
  };

  const resetAlerts = () => {
    setIsCreated(false);
    setSubmitError(undefined);
  };

  const schemaItems = schemas.map(function (schema: SchemaType) {
    return (
      <MenuItem key={schema.name} value={schema.name}>
        {shortName(schema.name)}
      </MenuItem>
    );
  });

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
          <HelpLink linkUrl="https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.topics" />
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Tooltip title="Topic name" placement="top-start">
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
            name="labels"
            control={control}
            render={({ field }) => (
              <Tooltip
                title="Labels list, format: label:value separate by comma. Example t1:v1, t2:v2"
                placement="top-start"
              >
                <TextField
                  {...field}
                  id="labels"
                  label="Labels"
                  size="small"
                  variant="filled"
                  helperText=""
                />
              </Tooltip>
            )}
          />

          <Button variant="contained" size="small" type="submit">
            Create
          </Button>

          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsAdvanced(prev => !prev)} // Toggle the advanced mode
          >
            {isAdvanced ? 'Hide Advanced' : 'Show Advanced'}
          </Button>

          {SubmitError != undefined && (
            <Alert severity="error">{SubmitError}</Alert>
          )}
          {IsCreated && <Alert severity="success">Topic is created</Alert>}
        </Stack>

        <Collapse in={isAdvanced}>
          <Stack className="gap-2">
            <Controller
              name="messageRetentionDuration"
              control={control}
              render={({ field }) => (
                <Tooltip
                  title="Duration in seconds. Between 10 min & 31 days. Example: 600s"
                  placement="top-start"
                >
                  <TextField
                    {...field}
                    id="messageRetentionDuration"
                    label="Message retention duration in seconds"
                    size="small"
                    variant="filled"
                  />
                </Tooltip>
              )}
            />
            <Controller
              name="schemaName"
              control={control}
              rules={{
                validate: {
                  checkSchemaEncoding: async (
                    schemaName,
                    { schemaEncoding },
                  ) => {
                    if (schemaName === '' && schemaEncoding !== '') {
                      return 'Schema is required';
                    }
                  },
                },
              }}
              render={({ field }) => (
                <>
                  <Typography className="p-1">Associate as schema:</Typography>
                  <FormControl variant="filled" sx={{ minWidth: 120 }}>
                    <InputLabel
                      id="schema-name-label"
                      error={errors.schemaName ? true : false}
                    >
                      Schema name
                    </InputLabel>
                    <Tooltip title="Schema" placement="top-start">
                      <Select
                        {...field}
                        id="scheme"
                        labelId="schema-name-label"
                        size="small"
                        variant="filled"
                        error={errors.schemaName ? true : false}
                      >
                        <MenuItem key="schema-name-none" value="">
                          <em>None</em>
                        </MenuItem>
                        {schemaItems}
                      </Select>
                    </Tooltip>
                  </FormControl>
                </>
              )}
            />

            <Controller
              name="schemaEncoding"
              control={control}
              rules={{
                validate: {
                  checkSchemaEncoding: async (
                    schemaEncoding,
                    { schemaName },
                  ) => {
                    if (schemaName !== '' && schemaEncoding === '') {
                      return 'Schema encoding is required';
                    }
                  },
                },
              }}
              render={({ field }) => (
                <FormControl variant="filled" sx={{ minWidth: 120 }}>
                  <InputLabel
                    id="schema-encoding-label"
                    error={errors.schemaEncoding ? true : false}
                  >
                    Schema Encoding
                  </InputLabel>
                  <Tooltip title="Schema Encoding" placement="top-start">
                    <Select
                      {...field}
                      id="schema-encoding"
                      label="Schema Encoding"
                      size="small"
                      variant="filled"
                      error={errors.schemaEncoding ? true : false}
                    >
                      <MenuItem key="schema-encoding-none" value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem key="schema-encoding-json" value="JSON">
                        Json
                      </MenuItem>
                      <MenuItem key="schema-encoding-binary" value="BINARY">
                        Binary
                      </MenuItem>
                    </Select>
                  </Tooltip>
                </FormControl>
              )}
            />
          </Stack>
        </Collapse>
      </Box>
    </>
  );
}

export default TopicCreate;
export type { TopicFormType };
