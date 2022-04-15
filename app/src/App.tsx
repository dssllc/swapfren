import { Routes, Route, Link } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Hero from "./components/Hero";
import Copyright from "./components/Copyright";

const theme = createTheme({
  palette: {
    primary: {
      main: "#363636"
    },
    background: {
      default: "#FFD3D3"
    },
    text: {
      primary: "#363636"
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Hero />
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}

export default App;
