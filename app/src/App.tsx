import { Routes, Route, Link } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from '@mui/material/Container';
import Hero from "./Hero";
import Copyright from "./Copyright";

const themeLight = createTheme();

function App() {
  return (
    <ThemeProvider theme={themeLight}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Hero />
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}

export default App;
