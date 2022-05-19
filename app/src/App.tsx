import { Routes, Route, Link } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import TopBar from "./components/TopBar";
import Hero from "./components/Hero";
import Copyright from "./components/Copyright";
import About from "./pages/About";

const theme = createTheme({
  palette: {
    primary: {
      main: "#363636",
    },
    background: {
      default: "#FFD3D3",
    },
    text: {
      primary: "#363636",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar />
      <Container component="main" maxWidth="md">
        <Routes>
          <Route index element={<Hero />} />
          <Route path="about" element={<About />} />
        </Routes>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}

export default App;
