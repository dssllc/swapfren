import Avatar from "@mui/material/Avatar";
import Badge, { BadgeProps } from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#7DD1FD",
  },
}));

function Hero() {
  return (
    <Container maxWidth="sm">
      <Grid container spacing={0} direction="column" alignItems="center">
        <Grid item>
          <Link
            href="https://opensea.io/assets/0x123b30e25973fecd8354dd5f41cc45a3065ef88c/4090"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={<StyledBadge badgeContent={"i"} />}
            >
              <Avatar
                alt="alien fren #4090"
                src="/alien-fren-4090-full.png"
                sx={{ width: 128, height: 128 }}
              />
            </Badge>
          </Link>
        </Grid>
        <Grid item>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontFamily: "'Pacifico', cursive",
              fontSize: 64,
              letterSpacing: "-0.25rem",
            }}
          >
            swapfren
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            a digital fren to help swap tokens
          </Typography>
        </Grid>
        <Grid item>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" disabled={true}>
              Coming soon
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Hero;
