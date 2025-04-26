import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { getVersion } from '@tauri-apps/api/app';
import TuneIcon from '@mui/icons-material/Tune';
import { Tooltip } from '@mui/material';

import Nav from '../components/navigation/Nav';
import PageLogo from './PageLogo';

function PageLayout(): React.ReactElement {
  const [version, setVersion] = useState('');

  useEffect(() => {
    async function getAppVersion() {
      const appVersion = await getVersion();
      setVersion(appVersion);
    }

    if (version === '') {
      getAppVersion();
    }
  });

  return (
    <>
      <div className="fixed inset-y-0 z-50 flex w-48 flex-col">
        <nav className="h-full bg-gradient-to-b from-blue-950 to-blue-900">
          <PageLogo />
          <Nav title="Products" />
        </nav>
        <footer className="absolute bottom-3 left-3 text-xs	text-blue-300">
          version {version}
        </footer>
      </div>
      <main className="pl-48 py-5">
        <div className="mx-auto px-4">
          <Outlet />
          <NavLink to="/settings" className="absolute top-5 right-5">
            <Tooltip title="Settings" placement="left">
              <TuneIcon />
            </Tooltip>
          </NavLink>
        </div>
      </main>
    </>
  );
}

export default PageLayout;
