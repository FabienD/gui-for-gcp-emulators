import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

type PublishMessageProps = {
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface PubSubMessageForm {
    Message: string
  }

function PublishMessage({ open, setOpen }: PublishMessageProps): React.ReactElement {
    
    const { handleSubmit, control, reset } = useForm<PubSubMessageForm>({
        defaultValues: {
            Message: ""
        },
      })

    const onSubmit: SubmitHandler<PubSubMessageForm> = (data) => {
        console.log("Publish Message", data);
        setOpen(false)
        reset()
    }

    const handleClose = () => setOpen(false)

    return (
        <Dialog 
            fullWidth={true}
            maxWidth="sm"
            open={open} 
            onClose={handleClose}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogTitle>Publish message</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography variant="subtitle1" gutterBottom>
                            Define the raw value of the message. Data string must be base64 encoded.
                        </Typography>
                        <Controller
                            name="Message"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <TextField
                                    {...field}
                                    id="pubsub-message"
                                    label="Raw message"
                                    multiline
                                    rows={15}
                                    fullWidth={true}
                                />
                            }
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" size='small' type="submit" onClick={handleSubmit(onSubmit)}>Publish</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}

export default PublishMessage
