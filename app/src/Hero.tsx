import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MakeSwap from "./MakeSwap";
import TakeSwap from "./TakeSwap";

function Hero() {
  return (
    <Box sx={{ flexGrow: 1, mb: 5 }}>
      <h1>SwapFren</h1>
      <Grid container spacing={6}>
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
