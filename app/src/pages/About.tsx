import { Container, Typography } from "@mui/material";

export default function About() {
  return (
    <Container maxWidth="sm">
      <Typography
        component="h1"
        variant="h2"
        align="center"
        gutterBottom
        sx={{
          fontFamily: "'Pacifico', cursive",
          fontSize: 40,
          letterSpacing: "-0.125rem",
          mt: 3
        }}
      >
        about
      </Typography>
      <Typography align="center" sx={{mb: 3}}>
        swapfren is a free to use web3 application to help perform token swaps.
      </Typography>
      <Typography component="h2" variant="h6" align="center">
        Features include:
      </Typography>
      <Typography>
        <ul>
          <li>Gas ONLY - no fees to use swapfren</li>
          <li>One-for-one ERC-721 swaps on Ethereum</li>
          <li>Approvals only for swapfren smart contracts, just like OpenSea</li>
          <li>All activity handled on-chain between swappers</li>
          <li>Swaps are handled in a single transaction</li>
        </ul>
      </Typography>
    </Container>
  );
}
