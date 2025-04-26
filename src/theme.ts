import { createTheme } from '@mui/material';
import { blue, lightGreen } from '@mui/material/colors';

const primary = blue[800];
const secondary = lightGreen[600];

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primary,
    },
    secondary: {
      main: secondary,
    },
  },
  typography: {
    fontSize: 12,
    fontFamily: '"Roboto Variable", sans-serif',

    h1: {
      fontSize: '2em',
      fontWeight: 500,
      margin: '0 0 0.6em 0',
    },
    h2: {
      fontSize: '1.6em',
      fontWeight: 500,
      margin: '1em 0 1em 0',
    },
    h3: {
      fontSize: '1.2em',
      fontWeight: 400,
      margin: '1em 0 1em 0',
    },
    body2: {
      fontSize: '0.8em',
    },
  },
});

export { theme };
