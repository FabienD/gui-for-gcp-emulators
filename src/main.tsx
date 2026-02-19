import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EmulatorProvider } from './contexts/emulators';

import App from './App';

import './styles.css';
import { theme } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <EmulatorProvider>
              <App />
            </EmulatorProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
