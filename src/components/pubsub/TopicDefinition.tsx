import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { TopicNameType } from './Topic';

type TopicDefinitionProps = {
  open: boolean;
  topicName: TopicNameType;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function TopicDefinition({
  open,
  topicName,
  setOpen,
}: TopicDefinitionProps): React.ReactElement {
  const handleClose = () => setOpen(false);

  return (
    <>
      <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>Topic definition for {topicName.name}</DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TopicDefinition;
