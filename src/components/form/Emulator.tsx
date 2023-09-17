import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Box, InputAdornment, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { getTopics } from "../../hooks/Pubsub";
import { useEffect, useState } from "react";

interface EmulatorProps {
    name: string;
}

type IFormInput = {
    host: string
    port: number
  }

function Emulator({ name }: EmulatorProps): React.ReactElement {
    const [settings, setSettings] = useState<IFormInput>();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            host: "localhost",
            port: 8085,
        },
    })

    const onSubmit: SubmitHandler<IFormInput> = (data) => {
        console.log(data)
        setSettings(data)
    }

    useEffect(() => {
        if (settings != undefined) {
            console.log('Call getTopics');
            getTopics(settings).then(data => console.log(data));
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
