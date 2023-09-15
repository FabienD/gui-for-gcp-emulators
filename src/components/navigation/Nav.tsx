import NavItem, { NavItemProps } from './NavItem';

interface NavProps {
    title: string;
}

const items: Array<NavItemProps> = [
    { href: "/pubsub", icon: "/icons/pubsub.svg", name: "Pubsub" },
    { href: "/firestore", icon: "/icons/firestore.svg", name: "Firestore" },
];

function Nav({ title }: NavProps): React.ReactElement {
    const navItems = items.map(item => 
        <NavItem {...item} />
    );

    return (
        <nav>
            <h2 className="py-4 pl-4 font-bold text-violet-400">{title}</h2>
            <ul className="pl-5 text-blue-300">{navItems}</ul>
        </nav>
    );
}

export default Nav;
