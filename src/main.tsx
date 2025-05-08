import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import ReactDOM from 'react-dom/client';

import App from './App';
import { EmulatorsProvider } from './contexts/emulators';
import './styles.css';
import { theme } from './theme';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <EmulatorsProvider>
            <App />
          </EmulatorsProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
