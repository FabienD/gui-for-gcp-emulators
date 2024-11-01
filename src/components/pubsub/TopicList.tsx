import React, { useCallback, useContext, useState } from "react";

import { Alert, Button, Tooltip } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import MessageIcon from '@mui/icons-material/Message';
import InfoIcon from '@mui/icons-material/Info';
import { TopicNameType, TopicType } from "./Topic";
import { deleteTopic } from "../../api/gcp.pubsub";
import { SettingsType } from "../emulator/Settings";
import EmulatorContext, { EmulatorContextType } from "../../contexts/emulators";
import { shortId } from "../../utils/pubsub";
import PublishMessage from "./PublishMessage";
import { Refresh } from "@mui/icons-material";
import TopicDefinition from "./TopicDefinition";

type TopicListProps = {
    topics: TopicType[],
    setTopics: React.Dispatch<React.SetStateAction<TopicType[]>>
    getTopicsCallback: any,
}

function TopicList({ topics, setTopics, getTopicsCallback }: TopicListProps): React.ReactElement {
    const [openPublishMessage, setOpenPublishMessage]  = useState(false)
    const [openTopicDefinition, setOpenTopicDefinition]  = useState(false)
    const [topic, setTopic]  = useState<TopicType>()
    const { getEmulator } = useContext(EmulatorContext) as EmulatorContextType;
    let emulator = getEmulator();
    
    const handleDeleteClick = (id: GridRowId) => () => {
        deleteTopicAction(id.toString());
    };    

    const handleMessageClick = (id: GridRowId) => () => {
        setOpenPublishMessage(true)
        setTopic({ name: shortId(id.toString()) })
    };    

    const handleDefinitionClick = (id: GridRowId) => () => {
        setOpenTopicDefinition(true)
        setTopic({ name: shortId(id.toString()) })
    };
    
    const handleTopicsRefresh = () => {
        if (emulator != undefined) {
            getTopicsCallback({
                host: emulator.host, 
                port: emulator.port,
                project_id: emulator.project_id,
            })
        }
    }

    const deleteTopicCallback = useCallback(async (
        settings: SettingsType, 
        topicName: TopicNameType,
    ) => {
        const response = await deleteTopic(settings, topicName);
        const status = response.status;
        
        if (status == 200) {
            const filteredTopics = topics.filter((t: TopicType) => t.name !== topicName.name);
            setTopics(filteredTopics);
        }
    }, [topics])
    
    const deleteTopicAction = useCallback(async (
        id: string,
    ) => {
        if (emulator != undefined) {
            deleteTopicCallback({
                host: emulator.host, 
                port: emulator.port,
                project_id: emulator.project_id,
            }, {
                name: id
            }).catch(console.error);
        }
    }, [emulator, deleteTopicCallback])

    const columns: GridColDef[] = [
        { 
            field: 'short_name', 
            headerName: 'Short ID',
            minWidth: 150 
        },  
        { 
            field: 'name', 
            headerName: 'ID',
            flex: 1
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            minWidth: 150,
            cellClassName: 'actions',
            getActions: ({ id }) => {
              
              return [
                <Tooltip title="Information">
                    <GridActionsCellItem
                    icon={<InfoIcon />}
                    label="Information"
                    onClick={handleDefinitionClick(id)}
                    color="inherit"
                    />
                </Tooltip>,
                <Tooltip title="Publish a message">
                    <GridActionsCellItem
                    icon={<MessageIcon />}
                    label="Publish a message"
                    onClick={handleMessageClick(id)}
                    color="inherit"
                    />
                </Tooltip>,
                <Tooltip title="Delete">
                <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={handleDeleteClick(id)}
                color="inherit"
                />
            </Tooltip>,
              ];
            },
          },
    ];

    const rows = topics.map((topic: TopicType) => {
        return {
            id: topic.name,
            short_name: shortId(topic.name),
            name: topic.name,
        }
    })

    return (
        <>
        {topics.length == 0 ? (
            <Alert severity="info" className="my-5">No topics</Alert>
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
                    <Button onClick={handleTopicsRefresh} startIcon={<Refresh />}>topics list</Button>
                </div>

                <PublishMessage open={openPublishMessage} setOpen={setOpenPublishMessage} topic={topic} />
                <TopicDefinition open={openTopicDefinition} setOpen={setOpenTopicDefinition} topic={topic} />
            </>
        )}
        </>
    )
}

export default TopicList;
