import { createTheme } from "@mui/material";
import { indigo } from "@mui/material/colors";

const primary = indigo[500]
const secondary = indigo[900]

const theme = createTheme({
    palette: {
      primary: {
        main: primary,
      },
      secondary: {
        main: secondary,
      },
      text: {
        primary: primary,
      }
    },
    typography: {
      fontSize: 12,
      
      h1 : {
        fontSize: "2em",
        fontWeight: 500,
        margin: "0 0 0.6em 0",
        color: primary,
      },
      h2 : {
        fontSize: "1.6em",
        fontWeight: 500,
        margin: "1em 0 1em 0",
        color: primary,
      },
      h3 : {
        fontSize: "1.2em",
        fontWeight: 400,
        margin: "1em 0 1em 0",
        color: primary,
      },
      body1: {
        color: secondary,
      },
      body2: {
        color: secondary,
        fontSize: "0.8em",
      }
    },
  });

  export { theme };