import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { invoke } from "@tauri-apps/api/core";
import { Alert, Box, InputAdornment, TextField } from '@mui/material';
import Button from '@mui/material/Button';

import EmulatorContext, { EmulatorContextType, EmulatorType } from "../../contexts/emulators";

type SettingsType = {
    host: string
    port: number
    project_id: string
}

function Emulator({ type, host, port, project_id }: EmulatorType): React.ReactElement {
    const { isEmulatorTypeConnected,  saveEmulator, removeEmulator } = useContext(EmulatorContext) as EmulatorContextType; 
    const [settings, setSettings] = useState<SettingsType>();
    const { control, handleSubmit } = useForm({
        defaultValues: {
            host,
            port,
            project_id,
        },
    })
    const onSubmit: SubmitHandler<SettingsType> = (data): void => {
        setSettings({
            host: data.host, 
            port: parseInt(data.port.toString()),
            project_id: data.project_id,
        })
    } 
    
    const isConnected = isEmulatorTypeConnected("pubsub");

    useEffect(() => {
        if (settings != undefined) {
            invoke<boolean>('check_connection', {...settings}).then((res): void => {
                if (res) {
                    saveEmulator({...settings, is_connected: true, type: type});
                    console.log(`Connected to emulator ${type}`);
                } else {
                    removeEmulator(type);
                    console.log('Connected failed');
                }
            });
        }
    }, [settings])

    return (
        <>
            <Box
                component="form"
                name={type}
                noValidate
                autoComplete="off"
                className='flex gap-2'
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
                        InputProps={{
                            startAdornment: <InputAdornment position="start">http://</InputAdornment>,
                        }}
                        size='small'
                        variant="filled"
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
                        variant="filled"
                    />}
                />

                <Controller
                    name="project_id"
                    control={control}
                    render={({ field }) => <TextField
                        {...field}
                        required
                        id="project_id"
                        label="Project id"
                        size='small'
                        variant="filled"
                    />}
                />
                
                <Button variant="contained" size='small' type="submit">Validate</Button>   
                
            </Box>
            <Alert severity={ isConnected ? "success" : "warning" } className="mt-5">
            { isConnected ? (
                <>The emulator is configured, connection is validated.</>
            ) : (
                <>The emulator is not configured or the connection is not validated.</>
            )}
            </Alert>
        </>
    )
}

export default Emulator;
export type { SettingsType };
