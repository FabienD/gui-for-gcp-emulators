import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/navigation/Nav";
import PageLogo from "./PageLogo";
import { getVersion } from "@tauri-apps/api/app";

function PageLayout(): React.ReactElement {
    const [version, setVersion] = useState('');

    useEffect(() => {
        async function getAppVersion() {
            const appVersion = await getVersion();    
            setVersion(appVersion);
        }

        if (version === '') {
            getAppVersion();
        }
    });

    return (
        <div className="flex">
            <nav className="flex flex-col w-48 h-screen bg-gradient-to-b from-blue-950 to-blue-800">
                <PageLogo />
                <Nav title="Products" />
            </nav>
            <main className="flex flex-col flex-1 h-screen p-4">
                <Outlet />
            </main>
            <footer className="absolute bottom-2 left-2 text-xs	text-blue-300">version {version}</footer>
        </div>
    );
}

export default PageLayout;
