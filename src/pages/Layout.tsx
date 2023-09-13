import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Nav from "../components/navigation/Nav";

function Layout() {

    return (
        <div className="container flex">

            <div className="flex-none w-48 h-screen bg-violet-900">
                <Header />
                <Nav title="Products" />
            </div>

            <div className="flex-auto p-5 text-blue-900">
                <Outlet />
            </div>

        </div>
    );
}

export default Layout;