import React, { useCallback, useContext, useState } from 'react';
import { DatasetType } from './Dataset';
import { Alert, Box, Button, Stack, TextField, Tooltip } from '@mui/material';
import EmulatorsContext, {
  EmulatorsContextType,
} from '../../contexts/emulators';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import HelpLink from '../ui/HelpLink';
import { SettingsType } from '../emulator/Settings';
import { createDataset } from '../../api/bigquery.dataset';

type DatasetCreateProps = {
  datasets: DatasetType[];
  setDatasets: React.Dispatch<React.SetStateAction<DatasetType[]>>;
};

type DatasetFormType = {
  id: string;
};

function DatasetCreate({
  datasets,
  setDatasets,
}: DatasetCreateProps): React.ReactElement {
  const { getEmulator } = useContext(EmulatorsContext) as EmulatorsContextType;
  const [SubmitError, setSubmitError] = useState<string | undefined>(undefined);
  const [IsCreated, setIsCreated] = useState(false);

  const emulator = getEmulator('bigquery');
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: '',
    },
  });

  const createDatasetCallback = useCallback(
    async (settings: SettingsType, dataset: DatasetFormType) => {
      try {
        const createdDataset = await createDataset(settings, dataset);

        if (createdDataset) {
          setIsCreated(true);
          setDatasets([...datasets, createdDataset]);
          reset();
        }
      } catch (error) {
        setSubmitError('Error creating topic');
        console.error(error);
      }

      setTimeout(resetAlerts, 3000);
    },
    [datasets],
  );

  const onSubmit: SubmitHandler<DatasetFormType> = (Formdata): void => {
    resetAlerts();

    if (emulator != undefined) {
      createDatasetCallback(emulator, Formdata).catch(console.error);
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
        id="dataset_create"
        name="dataset_create"
        noValidate
        autoComplete="off"
        className="flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack direction="row" className="gap-2">
          <HelpLink linkUrl="https://cloud.google.com/bigquery/docs/reference/rest/v2/datasets" />
          <Controller
            name="id"
            control={control}
            rules={{
              validate: {
                checkFormat: (id: string) => {
                  const regex = /^[a-zA-Z0-9\_]{1,1024}$/i;
                  if (!regex.test(id)) {
                    return 'Dataset id format is not correct';
                  }
                },
                checkName: (name: string) => {
                  if (name.toLowerCase().includes('goog')) {
                    return 'Dataset id cannot contain "goog"';
                  }
                },
              },
              required: true,
            }}
            render={({ field }) => (
              <Tooltip title="Dataset Id" placement="top-start">
                <TextField
                  {...field}
                  required
                  id="id"
                  label="Id"
                  size="small"
                  variant="filled"
                  error={errors.id ? true : false}
                  helperText={errors.id?.message}
                />
              </Tooltip>
            )}
          />

          <Button variant="contained" size="small" type="submit">
            Create
          </Button>

          {SubmitError != undefined && (
            <Alert severity="error">{SubmitError}</Alert>
          )}
          {IsCreated && <Alert severity="success">Dataset created</Alert>}
        </Stack>
      </Box>
    </>
  );
}

export default DatasetCreate;
export type { DatasetFormType };
