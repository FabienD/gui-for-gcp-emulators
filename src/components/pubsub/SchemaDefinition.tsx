import React, { useCallback, useContext, useEffect, useState } from 'react';
import { SchemaNameType, SchemaType } from './Schema';
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

import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';
import { getSchema } from '../../api/pubsub.schema';
import { shortName } from '../../utils/pubsub';

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
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [schema, setSchema] = React.useState<SchemaType | undefined>(undefined);
  const emulator = getEmulator();

  const getSchemaCallback = useCallback(
    async (settings: SettingsType, schemaName: SchemaNameType) => {
      setLoading(true);
      setError(null);
      try {
        const fetchedSchema = await getSchema(settings, schemaName);
        setSchema(fetchedSchema);
      } catch (err) {
        setError('Error fetching schema details.');
        console.error('Error fetching schema details:', err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (emulator && schemaName && open) {
      const settings: SettingsType = {
        host: emulator.host,
        port: emulator.port,
        project_id: emulator.project_id,
      };
      getSchemaCallback(settings, schemaName);
    }
  }, [open, schemaName, emulator, getSchemaCallback]);

  const renderContent = () => {
    if (loading) {
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
          {error}
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
      <DialogTitle color="primary">Schema Definition</DialogTitle>
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
