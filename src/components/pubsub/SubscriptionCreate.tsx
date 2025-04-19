import React, { useCallback, useContext, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import {
  Alert,
  Box,
  Button,
  Collapse,
  FormControl,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';

import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';
import { SubscriptionType } from './Subscription';
import { TopicType } from './Topic';
import { createSubscription } from '../../api/pubsub.subscription';
import HelpLink from '../ui/HelpLink';

type SubscriptionCreateProps = {
  topics: TopicType[];
  subscriptions: SubscriptionType[];
  setSubscriptions: React.Dispatch<React.SetStateAction<SubscriptionType[]>>;
};

type SubscriptionFormType = {
  name: string;
  topic: string;
  pushConfig: boolean;
  pushEndpoint?: string;
};

function SubscriptionCreate({
  topics,
  subscriptions,
  setSubscriptions,
}: SubscriptionCreateProps): React.ReactElement {
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const emulator = getEmulator();
  const [SubmitError, setSubmitError] = useState<string | undefined>(undefined);
  const [IsCreated, setIsCreated] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      topic: '',
      pushConfig: false,
      pushEndpoint: '',
    },
  });

  const createSubscriptionCallback = useCallback(
    async (settings: SettingsType, subscription: SubscriptionFormType) => {
      try {
        const createdSubscription = await createSubscription(
          settings,
          subscription,
        );

        if (createdSubscription) {
          setIsCreated(true);
          setSubscriptions([...subscriptions, createdSubscription]);
          reset();
        }
      } catch (error) {
        setSubmitError('Error creating subscription');
        console.error(error);
      }
    },
    [subscriptions],
  );

  const onSubmit: SubmitHandler<SubscriptionFormType> = (Formdata): void => {
    resetAlerts();

    if (emulator != undefined) {
      createSubscriptionCallback(emulator, Formdata).catch(console.error);
      reset();
    }
  };

  const resetAlerts = () => {
    setIsCreated(false);
    setSubmitError(undefined);
  };

  return (
    <>
      <Box
        component="form"
        id="subscription_create"
        name="subscription_create"
        noValidate
        autoComplete="off"
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack direction="row" className="gap-2">
          <HelpLink linkUrl="https://cloud.google.com/pubsub/docs/reference/rest/v1/projects.subscriptions" />
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
                }
              },
              required: true
            }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                id="name"
                label="Name"
                size="small"
                variant="filled"
                error={errors.name ? true : false}
              />
            )}
          />

          <Controller
            name="topic"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel
                  id="subscription-topic-select-label"
                  size="small"
                  variant="filled"
                  error={errors.topic ? true : false}
                >
                  Topic name
                </InputLabel>
                <Select
                  {...field}
                  required
                  id="topic"
                  labelId="subscription-topic-select-label"
                  label="Topic"
                  size="small"
                  variant="filled"
                  error={errors.topic ? true : false}
                >
                  {topics.map(topic => (
                    <MenuItem value={topic.name} key={topic.name}>
                      {topic.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          <Button variant="contained" type="submit" size="small">
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
          {IsCreated && (
            <Alert severity="success">Subscription is created</Alert>
          )}
        </Stack>

        <Collapse in={isAdvanced}>
          <Stack className="gap-2">
            <Controller
              name="pushEndpoint"
              control={control}
              rules={{
                validate: {
                  checkUrlFormat: async pushEndpoint => {
                    try {
                      if (pushEndpoint !== '') {
                        new URL(pushEndpoint);
                      }
                    } catch (error) {
                      console.error(error);
                      return 'Enpoint URL is not valid';
                    }
                  },
                },
              }}
              render={({ field }) => (
                <FormControl component="fieldset" className="col-span-2">
                  <FormLabel component="legend">Push config</FormLabel>
                  <FormGroup>
                    <TextField
                      {...field}
                      id="pushEndpoint"
                      label="Endpoint"
                      size="small"
                      variant="filled"
                      error={errors.pushEndpoint ? true : false}
                    />
                  </FormGroup>
                </FormControl>
              )}
            />
          </Stack>
        </Collapse>
      </Box>
    </>
  );
}

export default SubscriptionCreate;
export type { SubscriptionFormType };
