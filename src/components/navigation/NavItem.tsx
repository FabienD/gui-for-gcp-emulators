import { NavLink } from "react-router-dom";

interface NavItemProps {
    href: string;
    icon: string;
    name: string;
}

function NavItem({ href, icon, name }: NavItemProps): React.ReactElement {
    return (
        <li className="py-1 cursor-pointer">
            <NavLink to={href} className="hover:text-violet-100">
                <img src={icon} className="w-4 h-4 inline mb-1" alt={name} />
                <span className="pl-2">{name}</span>
            </NavLink>
        </li>
    );
}

export default NavItem;
export type { NavItemProps };
