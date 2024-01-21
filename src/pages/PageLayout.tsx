import React from "react";
import { Outlet } from "react-router-dom";

import Nav from "../components/navigation/Nav";
import PageLogo from "./PageLogo";

function PageLayout(): React.ReactElement {

    return (
        <div className="flex">
            <div className="flex flex-col w-48 h-screen bg-gradient-to-b from-blue-950 to-blue-800">
                <PageLogo />
                <Nav title="Products" />
            </div>
            <div className="flex flex-col flex-1 h-screen p-4">
                <Outlet />   
            </div>
        </div>
    );
}

export default PageLayout;
