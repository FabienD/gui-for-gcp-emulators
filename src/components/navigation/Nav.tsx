import React from 'react';

import { MenuList, Typography } from '@mui/material';

import NavItem, { NavItemProps } from './NavItem';
import bigquery from '../../assets/icons/bigquery.svg';
import bigtable from '../../assets/icons/bigtable.svg';
import spanner from '../../assets/icons/cloud_spanner.svg';
import datastore from '../../assets/icons/datastore.svg';
import firestore from '../../assets/icons/firestore.svg';
import pubsub from '../../assets/icons/pubsub.svg';

interface NavProps {
  title: string;
}

const items: Array<NavItemProps> = [
  { href: '/bigtable', icon: bigtable, name: 'Bigtable', disabled: true },
  { href: '/bigquery', icon: bigquery, name: 'BigQuery', disabled: false },
  { href: '/datastore', icon: datastore, name: 'Datastore', disabled: true },
  { href: '/firestore', icon: firestore, name: 'Firestore', disabled: false },
  { href: '/pubsub', icon: pubsub, name: 'PubSub', disabled: false },
  { href: '/spanner', icon: spanner, name: 'Spanner', disabled: true },
];

function Nav({ title }: NavProps): React.ReactElement {
  const activeItems = items.filter(item => !item.disabled);
  const navItems = activeItems.map((item, index) => (
    <NavItem key={index} {...item} />
  ));

  return (
    <>
      <Typography className="py-4 pl-4 font-bold text-white">
        {title}
      </Typography>
      <MenuList>{navItems}</MenuList>
    </>
  );
}

export default Nav;
