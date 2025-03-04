import React from 'react';
import { SchemaNameType } from './Schema';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import CloseButton from '../ui/CloseButton';

type SchemaDefinitionProps = {
  open: boolean;
  shemaName: SchemaNameType | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SchemaDefinition({
  open,
  schemaName,
  setOpen,
}: SchemaDefinitionProps): React.ReactElement {
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <DialogTitle color="primary">Topic Definition</DialogTitle>
      <DialogContent>{renderContent()}</DialogContent>
      <DialogActions>
        <Box className="absolute right-5 top-3">
          <CloseButton onClick={handleClose} />
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default SchemaDefinition;
