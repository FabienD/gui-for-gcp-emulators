import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { invoke } from "@tauri-apps/api";
import { Box, InputAdornment, TextField } from '@mui/material';
import Button from '@mui/material/Button';

interface EmulatorProps {
    name: string;
    connectionHandler: React.Dispatch<React.SetStateAction<boolean>>;
}

type IFormInput = {
    host: string
    port: number
  }

function Emulator({ name, connectionHandler }: EmulatorProps): React.ReactElement {
    const [settings, setSettings] = useState<IFormInput>();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            host: "localhost",
            port: 8085,
        },
    })

    const onSubmit: SubmitHandler<IFormInput> = (data): void => {
        // Force port to be a number
        setSettings({host: data.host, port: parseInt(data.port.toString())})
    }

    useEffect(() => {
        if (settings != undefined) {
            invoke<boolean>('check_connection', {...settings}).then((res): void => {
                console.log(res)
                connectionHandler(res)
            });
        }
    }, [settings])

    return (
        <Box
            component="form"
            name={name}
            noValidate
            autoComplete="off"
            className='p-4 flex gap-2'
            onSubmit={handleSubmit(onSubmit)}
        >
            <Controller
                name="host"
                control={control}
                render={({ field }) => <TextField
                    {...field}
                    required
                    id="host"
                    label="Host"
                    size='small'
                    InputProps={{
                        startAdornment: <InputAdornment position="start">http://</InputAdornment>,
                    }}
                />}
            />
            
            <Controller
                name="port"
                control={control}
                render={({ field }) => <TextField
                    {...field}
                    required
                    id="port"
                    type="number"
                    label="port"
                    size='small'
                />}
            />            
            
            <Button variant="contained" size='small' type="submit">Connect</Button>
            
        </Box>
    )
}

export default Emulator;
export type { IFormInput };
