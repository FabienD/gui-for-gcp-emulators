import React from 'react';
import { NavLink } from 'react-router-dom';

import { MenuItem } from '@mui/material';

interface NavItemProps {
  href: string;
  icon: string;
  name: string;
  disabled?: boolean;
}

function NavItem({ href, icon, name }: NavItemProps): React.ReactElement {
  return (
    <MenuItem className="py-1 cursor-pointer" id={name}>
      <NavLink to={href}>
        <img src={icon} className="w-4 h-4 inline mb-1" alt={name} />
        <span className="pl-2 text-white hover:text-blue-200">{name}</span>
      </NavLink>
    </MenuItem>
  );
}

export default NavItem;
export type { NavItemProps };
