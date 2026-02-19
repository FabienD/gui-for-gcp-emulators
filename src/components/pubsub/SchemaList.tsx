import React, { useMemo, useState } from 'react';

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

import { SchemaNameType, SchemaType } from './Schema';
import { shortName } from '../../utils/pubsub';
import ConfirmationDialog from '../ui/ConfirmationDialog';
import SchemaDefinition from './SchemaDefinition';
import { useSchemas, useDeleteSchema } from '../../hooks/usePubsub';

function SchemaList(): React.ReactElement {
  const { data: schemas = [], isLoading, refetch } = useSchemas();
  const deleteSchemaMutation = useDeleteSchema();

  const [openSchemaDefinition, setOpenSchemaDefinition] = useState(false);
  const [schemaName, setSchemaName] = useState<SchemaNameType>();
  const [schemaToDelete, setSchemaToDelete] = useState<SchemaNameType | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      deleteSchemaMutation.mutate(schemaToDelete);
      setSchemaToDelete(null);
      setConfirmOpen(false);
    }
  };

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
      {isLoading ? (
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
          <Button onClick={() => refetch()} startIcon={<Refresh />}>
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
