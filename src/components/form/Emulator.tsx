import React, { useContext, useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { invoke } from "@tauri-apps/api";
import { Box, InputAdornment, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import EmulatorContext, { EmulatorContextType, EmulatorType } from "../../contexts/emulators";

type IFormInput = {
    host: string
    port: number
}

function Emulator({ type, host, port }: EmulatorType): React.ReactElement {
    const [settings, setSettings] = useState<IFormInput>();
    const { control, handleSubmit } = useForm({
        defaultValues: {
            host,
            port,
        },
    })
    const onSubmit: SubmitHandler<IFormInput> = (data): void => {
        setSettings({
            host: data.host, 
            port: parseInt(data.port.toString())
        })
    }
    
    const { emulators, saveEmulator, removeEmulator } = useContext(EmulatorContext) as EmulatorContextType;
    let isConnected = false;

    emulators?.map((emulator: EmulatorType) => {
        if (emulator.type == "pubsub" && emulator.is_connected) {
            isConnected = true;
        }
    });


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
                
                <Button variant="contained" size='small' type="submit">Validate</Button>
                    
                
            </Box>
            { isConnected && <p>The emulator is configured, connection settings is validated.</p>}
        </>
        
    )
}

export default Emulator;
export type { IFormInput };
