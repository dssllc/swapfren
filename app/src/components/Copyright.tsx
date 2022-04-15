import { Typography, Link } from "@mui/material";

export default function Copyright() {
  return (
    <footer>
      <Typography variant="subtitle2" align="center" component="p">
        {"made with ❤️ by "}
        <Link href="https://dssllc.eth.xyz">

          {"dssllc.eth"}
        </Link>
        {" "} &copy; {new Date().getFullYear()}
      </Typography>
    </footer>
  );
}
