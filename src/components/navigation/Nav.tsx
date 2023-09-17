import { MenuList, Typography } from '@mui/material';
import NavItem, { NavItemProps } from './NavItem';

interface NavProps {
    title: string;
}

const items: Array<NavItemProps> = [
    { href: "/pubsub", icon: "/icons/pubsub.svg", name: "Pubsub" },
    { href: "/firestore", icon: "/icons/firestore.svg", name: "Firestore" },
];

function Nav({ title }: NavProps): React.ReactElement {
    const navItems = items.map((item, index) =>
            <NavItem key={index} {...item} />
    );

    return (
        <>
            <Typography className="py-4 pl-4 font-bold" color="secondary">{title}</Typography>
            <MenuList>
                {navItems}
            </MenuList>
        </>
    );
}

export default Nav;
