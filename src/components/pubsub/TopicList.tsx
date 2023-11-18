import React, { useCallback, useContext } from "react";

import { Alert } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { TopicType } from "./Topic";
import { deleteTopic } from "../../api/gcp.pubsub";
import { IFormSettings } from "../emulator/Settings";
import EmulatorContext, { EmulatorContextType } from "../../contexts/emulators";

type TopicListProps = {
    topics: TopicType[],
    setTopics: React.Dispatch<React.SetStateAction<TopicType[]>>
}

function TopicList({ topics, setTopics }: TopicListProps): React.ReactElement {
    const { getEmulatorByType } = useContext(EmulatorContext) as EmulatorContextType;
    let emulator = getEmulatorByType("pubsub");
    
    const handleDeleteClick = (id: GridRowId) => () => {
        deleteTopicAction(id.toString());
    };

    const shortTopicName = (name: string): string => {
        return name.replace(/projects\/fake\/topics\//i, '');
    }
    
    const deleteTopicCallback = useCallback(async (
        settings: IFormSettings, 
        topic: TopicType,
    ) => {
        const response = await deleteTopic(settings, topic);
        const status = await response.status;
        
        if (status == 200) {
            const filteredTopics = topics.filter((t: TopicType) => t.name !== topic.name);
            setTopics(filteredTopics);
        }
    }, [topics])

    const deleteTopicAction = useCallback(async (
        id: string,
    ) => {
        if (emulator != undefined) {
            deleteTopicCallback({
                host: emulator.host, 
                port: emulator.port
            }, {
                name: id
            }).catch(console.error);
        }
    }, [emulator, deleteTopicCallback])

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