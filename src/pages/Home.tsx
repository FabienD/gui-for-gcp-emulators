import React from "react";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';
import { NavLink } from "react-router-dom";

function Home(): React.ReactElement {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-blue-900">
                GUI for GCP Emulators
            </h1>
            <p className="mt-6 text-sm leading-6">
                This application provides a basic UI to deal with <a href="https://cloud.google.com/sdk/gcloud/reference/beta/emulators" target="_blank" className="underline decoration-solid underline-offset-4 decoration-pink-500">Google Cloud Platform™ Emulators</a>. 
                This application is <span className="underline decoration-solid underline-offset-4 decoration-pink-500">not an official</span> Google application.
            </p>
            <p className="mt-6 text-sm leading-6">
                The application is <strong>under heavy development</strong> and doesn't cover all emulator products API.
                This project start as simple test and isn't cover by tests. 
            </p>
            <p className="mt-6 text-sm leading-6">
                The state of the project :
                <ul className="my-4 ml-10 list-disc">
                    <li><NavLink to="/pubsub">Pubsub partially supported <CheckBoxIcon className="text-blue-500"/></NavLink></li>
                </ul>

                <ul className="my-4 ml-10 list-disc">
                    <li>Bigtable not yet supported <CloseIcon className="text-pink-500" /></li>
                    <li>Datastore not yet supported <CloseIcon className="text-pink-500" /></li>
                    <li>Firestore not yet supported <CloseIcon className="text-pink-500" /></li>
                    <li>Spanner not yet supported <CloseIcon className="text-pink-500" /></li>
                </ul>
            </p>
            <p className="mt-6 text-sm leading-6">
                <strong>As an Open Source project</strong>, feel free to contribute :
                <br />
                <a href="https://github.com/FabienD/gui-for-gcp-emulator" target="_blank" className="underline decoration-solid underline-offset-4 decoration-sky-500">https://github.com/FabienD/gui-for-gcp-emulator</a>.
            </p>
        </div>
    );
}

export default Home;
