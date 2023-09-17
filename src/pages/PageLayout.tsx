import { Outlet } from "react-router-dom";
import Nav from "../components/navigation/Nav";
import PageLogo from "./PageLogo";

function PageLayout(): React.ReactElement {

    return (
        <div className="flex">
            <div className="flex flex-col w-60 h-screen bg-blue-950">
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
