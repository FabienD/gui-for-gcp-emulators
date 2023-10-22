import React from "react";
import { MenuList, Typography } from '@mui/material';
import NavItem, { NavItemProps } from './NavItem';
import pubsub from "../../assets/icons/pubsub.svg";
import firestore from "../../assets/icons/firestore.svg";

interface NavProps {
    title: string;
}

const items: Array<NavItemProps> = [
    { href: "/pubsub", icon: pubsub, name: "Pubsub" },
    { href: "/firestore", icon: firestore, name: "Firestore" },
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
