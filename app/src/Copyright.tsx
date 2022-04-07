import { Typography, Link } from '@mui/material';

export default function Copyright() {
  return (
    <footer>
      <Typography variant="subtitle2" align="center" component="p">
      made with ❤️ by
      <br />
      <Link href="mailto:info@decentralizedsoftware.systems">Decentralized Software Systems, LLC</Link>
      <br />
      &copy; {new Date().getFullYear()}
      </Typography>
    </footer>
  );
}
