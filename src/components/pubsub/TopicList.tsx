import React from "react";

import { Alert } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { TopicType } from "./Topic";


const handleDeleteClick = (id: GridRowId) => () => {
    console.log(`Delete ${id}`);
  };


const columns: GridColDef[] = [
    { 
        field: 'name', 
        headerName: 'Topic ID', 
        width: 300 
    },
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          
          return [
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        },
      },
];

type TopicListProps = {
    topics: TopicType[]
}

function TopicList({ topics }: TopicListProps): React.ReactElement {
    
    console.log('Call TopicList');
    console.log(topics)

    const rows = topics.map((topic: TopicType) => {
        return {
            id: topic.name,
            name: topic.name.replace(/projects\/fake\/topics\//i, ''),
        }
    })

    return (
        <>
        {topics.length == 0 ? (
            <Alert className="info my-2">No topics</Alert>
        ) : (
            <div className="mt-10">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                />
            </div>
        )}
        </>
    )
}

export default TopicList;