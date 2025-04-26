import React from 'react';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink } from 'react-router-dom';
import { Box, CardContent, Typography } from '@mui/material';


function Home(): React.ReactElement {

  return (
    <>
      <Typography variant="h1" color="primary">
        App for GCP Emulators
      </Typography>

      <Typography variant="body1">
        This application provides a graphical interface for interacting with{' '}
        <a
          href="https://cloud.google.com/sdk/gcloud/reference/beta/emulators"
          target="_blank"
          className="underline decoration-solid underline-offset-4 decoration-sky-500"
          rel="noreferrer"
        >
          Google Cloud Platform™ Emulators
        </a>
        .
        <br />
        It&apos;s{' '}
        <span className="underline decoration-solid underline-offset-4 decoration-sky-500">
          not an official
        </span>{' '}
        Google™ application.
      </Typography>
      <Typography variant="body1" className="pt-2">
          When I began the project, it was just a simple test to experiment with Tauri V2, React.js, and TypeScript. Now, I have implemented the PubSub API and am using the application at work. 
          Because of this, I have decided to continue developing the application, but it requires time and effort.
      </Typography>
     
      <Typography variant="h2" color="primary">
        The state of the project
      </Typography>

      <Box className="flex">
        <CardContent className="bg-green-50 rounded-xl p-4 mx-4 w-1/2">
          <Typography
            variant="h3"
            className="text-sm font-semibold text-green-800 uppercase"
          >
            Good supported
          </Typography>
          <ul className="my-4 text-green-800 text-sm">
            <li>
              <NavLink to="/pubsub">Pub/Sub </NavLink>
              <RocketLaunchIcon className="text-green-800" />
            </li>
          </ul>
        </CardContent>

        <CardContent className="bg-purple-50 rounded-xl p-4 mx-4 w-1/2">
          <Typography
            variant="h3"
            className="text-sm font-semibold text-purple-800 uppercase"
          >
            Under development
          </Typography>
          <ul className="my-4 text-purple-800 text-sm">
            <li>
              <NavLink to="/bigquery">BigQuery </NavLink>
              <DeveloperBoardIcon className="text-purple-800" />
            </li>
            <li>
              <NavLink to="/firestore">Firestore </NavLink>
              <DeveloperBoardIcon className="text-purple-800" />
            </li>
            
          </ul>
        </CardContent>

        <CardContent className="bg-sky-50 rounded-xl p-4 mx-4  w-1/2">
          <Typography
            variant="h3"
            className="text-sm font-semibold uppercase text-sky-800"
          >
            Not implemented
          </Typography>
          <ul className="my-4 text-sky-800 text-sm">
            <li>
              Bigtable <CloseIcon className="text-sky-800" />
            </li>
            <li>
              Datastore <CloseIcon className="text-sky-800" />
            </li>
            <li>
              Spanner <CloseIcon className="text-sky-800" />
            </li>
          </ul>
        </CardContent>
      </Box>
      <Typography variant="body1" className="pt-5">
        <strong>The project is Open Source</strong>,{' '}
        <a
          href="https://github.com/FabienD/gui-for-gcp-emulator"
          target="_blank"
          className="underline decoration-solid underline-offset-4 decoration-sky-500"
          rel="noreferrer"
        >
          feel free to contribute and/or use it
        </a>
        .
      </Typography>
    </>
  );
}

export default Home;
