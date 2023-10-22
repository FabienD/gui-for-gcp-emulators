import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider, ThemeProvider, createTheme } from "@mui/material";
import { blue } from '@mui/material/colors';

import { EmulatorProvider } from "./contexts/emulators";
import App from "./App";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import "./styles.css";
import "./normalize.css";

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);

const theme = createTheme({
  palette: {
    primary: {
      main: blue[900],
    },
    secondary: {
      main: blue[500],
    }
  },
});


root.render(
    <React.StrictMode>
      <BrowserRouter>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <EmulatorProvider>
              <App />
            </EmulatorProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </BrowserRouter>
    </React.StrictMode>
);
