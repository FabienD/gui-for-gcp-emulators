import React from "react";

import { Alert } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { TopicType } from "./Topic";


type TopicListProps = {
    topics: TopicType[],
    deleteTopic: Function
}

function TopicList({ topics, deleteTopic }: TopicListProps): React.ReactElement {
    
    const handleDeleteClick = (id: GridRowId) => () => {
        deleteTopic(id.toString());
    };

    const shortTopicName = (name: string): string => {
        return name.replace(/projects\/fake\/topics\//i, '');
    }
    
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

    const rows = topics.map((topic: TopicType) => {
        return {
            id: topic.name,
            name: shortTopicName(topic.name),
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
                    pageSizeOptions={[10]}
                />
            </div>
        )}
        </>
    )
}

export default TopicList;