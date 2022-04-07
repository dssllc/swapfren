import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MakeSwap from "./MakeSwap";
import TakeSwap from "./TakeSwap";

import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: "60px",
}));

function Hero() {
  return (
    <Box sx={{ flexGrow: 1, mb: 5 }}>
      <h1>SwapFren</h1>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <MakeSwap />
        </Grid>
        <Grid item xs={6}>
          <TakeSwap />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Hero;
