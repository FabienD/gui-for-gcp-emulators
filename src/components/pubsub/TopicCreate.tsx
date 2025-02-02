import React, { useCallback, useContext, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  Collapse,
  Stack,
  TextareaAutosize,
  TextField,
  Tooltip,
} from '@mui/material';

import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';
import { TopicType } from './Topic';
import { createTopic } from '../../api/pubsub.topic';

type TopicCreateProps = {
  topics: TopicType[];
  setTopics: React.Dispatch<React.SetStateAction<TopicType[]>>;
};

type TopicFormType = {
  name: string;
  labels?: string;
  messageRetentionDuration?: string;
};

function TopicCreate({
  topics,
  setTopics,
}: TopicCreateProps): React.ReactElement {
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const [Error, setError] = useState<string | undefined>(undefined);
  const [IsCreated, setIsCreated] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false);

  const emulator = getEmulator();
  const { control, reset, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      labels: '',
      messageRetentionDuration: '',
    },
  });

  const createTopicCallback = useCallback(
    async (settings: SettingsType, topic: TopicFormType) => {
      const createdTopic = await createTopic(settings, topic);

      if (createdTopic) {
        setIsCreated(true);
        setTopics([...topics, createdTopic]);
        reset();
      } else {
        setError('Error creating topic');
      }

      setTimeout(resetAlerts, 3000);
    },
    [topics],
  );

  const onSubmit: SubmitHandler<TopicFormType> = (Formdata): void => {
    resetAlerts();

    if (Formdata.name === undefined || Formdata.name === '') {
      setError('Name is required');
      return;
    }
    if (emulator != undefined) {
      createTopicCallback(emulator, Formdata).catch(console.error);
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
              <Tooltip title="Topic name" placement="top-start">
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

          {Error != undefined && <Alert severity="error">{Error}</Alert>}
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
          </Stack>
        </Collapse>
      </Box>
    </>
  );
}

export default TopicCreate;
export type { TopicFormType };
