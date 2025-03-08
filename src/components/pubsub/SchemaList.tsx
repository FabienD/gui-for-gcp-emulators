import React, { useCallback, useContext, useMemo, useState } from 'react';

import { Alert, Button, CircularProgress, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import InfoIcon from '@mui/icons-material/Info';
import Refresh from '@mui/icons-material/Refresh';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
} from '@mui/x-data-grid';

import EmulatorContext, { EmulatorContextType } from '../../contexts/emulators';
import { SettingsType } from '../emulator/Settings';
import { SchemaNameType, SchemaType } from './Schema';
import { shortName } from '../../utils/pubsub';
import { deleteSchema } from '../../api/pubsub.schema';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import SchemaDefinition from './SchemaDefinition';

type SchemaListProps = {
  schemas: SchemaType[];
  setSchemas: React.Dispatch<React.SetStateAction<SchemaType[]>>;
  getSchemasCallback: (settings: SettingsType) => Promise<void>;
};

function SchemaList({
  schemas,
  setSchemas,
  getSchemasCallback,
}: SchemaListProps): React.ReactElement {
  const [loading, setLoading] = useState(false);
  const [openSchemaDefinition, setOpenSchemaDefinition] = useState(false);
  const [schemaName, setSchemaName] = useState<SchemaNameType>();
  const [schemaToDelete, setSchemaToDelete] = useState<SchemaNameType | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
  const emulator = getEmulator();

  const handleActionClick = (
    action: 'delete' | 'definition',
    id: GridRowId,
  ) => {
    const name = id.toString();
    setSchemaName({ name });

    if (action === 'delete') {
      setSchemaToDelete({ name });
      setConfirmOpen(true);
    } else if (action === 'definition') {
      setOpenSchemaDefinition(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (schemaToDelete) {
      deleteSchemaAction(schemaToDelete);
      setSchemaToDelete(null);
      setConfirmOpen(false);
    }
  };

  const handleSchemasRefresh = () => {
    if (emulator != undefined) {
      setLoading(true);
      getSchemasCallback({
        host: emulator.host,
        port: emulator.port,
        project_id: emulator.project_id,
      }).finally(() => {
        setLoading(false);
      });
    }
  };

  const deleteSchemaCallback = useCallback(
    async (settings: SettingsType, schemaName: SchemaNameType) => {
      const isDeleted = await deleteSchema(settings, schemaName);

      if (isDeleted) {
        const filteredSchemas = schemas.filter(
          (t: SchemaType) => shortName(t.name) !== schemaName.name,
        );
        setSchemas(filteredSchemas);
      }
    },
    [schemas],
  );

  const deleteSchemaAction = useCallback(
    async (schemaName: SchemaNameType) => {
      if (emulator != undefined) {
        deleteSchemaCallback(
          {
            host: emulator.host,
            port: emulator.port,
            project_id: emulator.project_id,
          },
          {
            name: schemaName.name,
          },
        ).catch(console.error);
      }
    },
    [emulator, deleteSchemaCallback],
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        headerName: 'ID',
        field: 'id',
        minWidth: 150,
      },
      {
        headerName: 'Name',
        field: 'name',
        flex: 1,
      },
      {
        headerName: 'Labels',
        field: 'labels',
        minWidth: 200,
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        minWidth: 150,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          return [
            <Tooltip title="Information" key="information">
              <GridActionsCellItem
                icon={<InfoIcon />}
                label="Information"
                onClick={() => handleActionClick('definition', id)}
                color="inherit"
              />
            </Tooltip>,
            <Tooltip title="Delete" key="delete">
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => handleActionClick('delete', id)}
                color="inherit"
              />
            </Tooltip>,
          ];
        },
      },
    ],
    [handleActionClick],
  );

  const rows = useMemo(
    () =>
      schemas.map((schema: SchemaType) => ({
        id: shortName(schema.name),
        name: schema.name,
      })),
    [schemas],
  );

  return (
    <>
      {loading ? (
        <div className="flex justify-center mt-10">
          <CircularProgress />
        </div>
      ) : schemas.length === 0 ? (
        <Alert severity="info" className="my-5">
          No Schemas
        </Alert>
      ) : (
        <>
          <div className="mt-10 w-full">
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[10]}
            />
          </div>
          <Button onClick={handleSchemasRefresh} startIcon={<Refresh />}>
            schema list
          </Button>

          <SchemaDefinition
            open={openSchemaDefinition}
            setOpen={setOpenSchemaDefinition}
            schemaName={schemaName}
          />

          <ConfirmationDialog
            open={confirmOpen}
            title="Confirm Deletion"
            description="Are you sure you want to delete this schema?"
            onConfirm={handleDeleteConfirm}
            onCancel={() => setConfirmOpen(false)}
          />
        </>
      )}
    </>
  );
}

export default SchemaList;
