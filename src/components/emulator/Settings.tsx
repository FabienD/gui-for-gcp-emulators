import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { invoke } from "@tauri-apps/api";
import { Alert, Box, InputAdornment, TextField } from '@mui/material';
import Button from '@mui/material/Button';

import EmulatorContext, { EmulatorContextType, EmulatorType } from "../../contexts/emulators";

type IFormSettings = {
    host: string
    port: number
}

function Emulator({ type, host, port }: EmulatorType): React.ReactElement {
    const { isEmulatorTypeConnected,  saveEmulator, removeEmulator } = useContext(EmulatorContext) as EmulatorContextType; 
    const [settings, setSettings] = useState<IFormSettings>();
    const { control, handleSubmit } = useForm({
        defaultValues: {
            host,
            port,
        },
    })
    const onSubmit: SubmitHandler<IFormSettings> = (data): void => {
        setSettings({
            host: data.host, 
            port: parseInt(data.port.toString())
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
                
                <Button variant="contained" size='small' type="submit">Validate</Button>   
                
            </Box>
            <Alert severity={ isConnected ? "info" : "warning" } className="m-2">
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
export type { IFormSettings };
