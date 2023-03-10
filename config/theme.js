import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

// create theme instance
const theme = createTheme({
    primary: {
        main: "#556cd6",
    },
    secondary: {
        main: "#19857b",
    },
    error: {
        main: red.A400,
    },
});

export default theme;
