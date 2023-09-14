import NavItem from './NavItem';

interface NavProps {
    title: string;
}

const items = [
    { href: "/pubsub", icon: "/icons/pubsub.svg", name: "Pubsub" },
    { href: "/firestore", icon: "/icons/firestore.svg", name: "Firestore" },
];

function Nav({ title }: NavProps): React.ReactElement {
    const navItems = items.map(item => 
        <NavItem href={item.href} icon={item.icon} name={item.name} />
    );

    return (
        <nav>
            <h2 className="py-4 pl-4 font-bold text-violet-400">{title}</h2>
            <ul className="pl-5 text-blue-300">{navItems}</ul>
        </nav>
    );
}

export default Nav;
