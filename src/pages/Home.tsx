import React from "react";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink } from "react-router-dom";
import { Box, CardContent, Typography } from "@mui/material";

function Home(): React.ReactElement {
    return (
        <>
            <Typography variant="h1">
                GUI for GCP Emulators
            </Typography>
            
            <Typography variant="body1">
                This application provides a basic UI to deal with <a href="https://cloud.google.com/sdk/gcloud/reference/beta/emulators" target="_blank" className="underline decoration-solid underline-offset-4 decoration-pink-500">Google Cloud Platform™ Emulators</a>. 
                This application is <span className="underline decoration-solid underline-offset-4 decoration-pink-500">not an official</span> Google application.
            </Typography>
            <Typography variant="body1" className="mt-4">
            The application is <strong>under heavy development</strong> and doesn't cover all emulator products API.
                This project start as simple test and isn't cover by tests. 
            </Typography>

            <Typography variant="h2">
                The state of the project
            </Typography>

            <Box className="flex">
                <CardContent className="bg-indigo-100 rounded-xl p-4 mx-4 w-1/2">
                    <Typography variant="h3" className="text-sm font-semibold text-indigo-900 uppercase">
                        Partially supported
                    </Typography>
                    <ul className="my-4 text-indigo-800">
                        <li><NavLink to="/pubsub">Pub/Sub </NavLink><CheckBoxIcon className="text-indigo-800" /></li>
                    </ul>
                </CardContent>

                <CardContent className="bg-pink-100 rounded-xl p-4 mx-4  w-1/2">
                    <Typography variant="h3" className="text-sm font-semibold text-pink-900 uppercase">
                        Not implemented
                    </Typography>
                    <ul className="my-4 text-pink-800">
                        <li>Bigtable <CloseIcon className="text-pink-800" /></li>
                        <li>Datastore <CloseIcon className="text-pink-800" /></li>
                        <li>Firestore <CloseIcon className="text-pink-800" /></li>
                        <li>Spanner <CloseIcon className="text-pink-800" /></li>
                    </ul>
                </CardContent>
            </Box>
            <Typography variant="body1" className="my-4">
                <strong>As an Open Source project</strong>, <a href="https://github.com/FabienD/gui-for-gcp-emulator" target="_blank" className="underline decoration-solid underline-offset-4 decoration-sky-500">feel free to contribute</a>.
            </Typography>
        </>
    );
}

export default Home;
