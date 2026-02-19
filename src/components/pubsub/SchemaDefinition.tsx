import React from 'react';
import { SchemaNameType } from './Schema';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import CloseButton from '../ui/CloseButton';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { solarizedLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { shortName } from '../../utils/pubsub';
import { useSchema } from '../../hooks/usePubsub';

type SchemaDefinitionProps = {
  open: boolean;
  schemaName: SchemaNameType | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function SchemaDefinition({
  open,
  schemaName,
  setOpen,
}: SchemaDefinitionProps): React.ReactElement {
  const handleClose = () => setOpen(false);
  const { data: schema, isLoading, error } = useSchema(schemaName, open);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <CircularProgress />
        </div>
      );
    }

    if (error) {
      return (
        <Typography color="error" align="center" variant="body1">
          Error fetching schema details.
        </Typography>
      );
    }

    if (schema) {
      return (
        <>
          <Typography variant="h6" className="py-2">
            Name: <em>{shortName(schema.name)}</em>
          </Typography>
          <Typography variant="body1">
            <em>{schema.name}</em>
          </Typography>
          <Typography variant="h6" className="py-2">
            Type
          </Typography>
          <Typography variant="body1">{schema.type}</Typography>
          <Typography variant="h6" className="py-2">
            Definition
          </Typography>
          <SyntaxHighlighter
            language="json"
            style={solarizedLight}
            wrapLines={true}
            wrapLongLines={true}
            codeTagProps={{ className: 'text-sm' }}
          >
            {schema.definition}
          </SyntaxHighlighter>
        </>
      );
    }

    return null;
  };

  return (
    <Dialog fullScreen open={open} onClose={handleClose}>
      <DialogTitle color="primary">PubSub / Schema Definition</DialogTitle>
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
