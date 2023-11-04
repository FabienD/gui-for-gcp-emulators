import React from "react";

function Home(): React.ReactElement {
    return (
        <div className="text-center mt-10">
            <h1 className="text-3xl font-bold tracking-tight text-blue-900">
                GUI for GCP Emulators
            </h1>
            <p className="mt-6 text-sm leading-6">
                This application provides a basic UI to deal with <a href="https://cloud.google.com/sdk/gcloud/reference/beta/emulators" target="_blank" className="underline decoration-solid underline-offset-2 decoration-red-500">Google Cloud Platform™ Emulators</a>. 
                This application is <span className="underline decoration-solid underline-offset-2 decoration-red-500">not an official</span> Google application.
            </p>
            <p className="mt-6 text-sm leading-6">
                The application is under heavy development and doesn't cover all emulator products API.
                This project start as simple test and isn't cover by tests. As Open source project, feel free to participate :
                <br />
                <a href="https://github.com/FabienD/gui-for-gcp-emulator" target="_blank" className="underline decoration-solid underline-offset-2 decoration-sky-500">https://github.com/FabienD/gui-for-gcp-emulator</a>.
            </p>
        </div>
    );
}

export default Home;
