import React, { useCallback, useEffect } from "react";
import { Alert } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { getEmulatorByType } from "../../utils/emulator";
import { getTopics } from "../../utils/pubsub";
import { IFormSettings } from "../emulator/Settings";
import { TopicType } from "./Topic";


const columns: GridColDef[] = [
    { field: 'name', headerName: 'Topic ID', width: 300 },
];

function TopicList({ topics, setTopics }): React.ReactElement {
    const emulator = getEmulatorByType("pubsub");
    
    const fetchTopics = useCallback(async (settings: IFormSettings) => {
        const response = await getTopics(settings);
        const content = await response.json();
        
        if (content != undefined 
            && content.topics != undefined
            && content.topics.length > 0)
        {
            setTopics(content.topics);   
        }
    }, [emulator])

    useEffect(() => {
        if (emulator != undefined) {
            fetchTopics({
                host: emulator.host, 
                port: emulator.port
            }).catch(console.error);
        }
    }, [topics])
    
    const rows = topics.map((topic: TopicType) => {
        return {
            id: topic.name,
            name: topic.name
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
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                />
            </div>
        )}
        </>
    )
}

export default TopicList;