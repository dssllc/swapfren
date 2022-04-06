import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

function Hero() {
  return (
    <div>
      <h1>HERO</h1>
      <Button to="/make" variant="contained" component={Link}>Make Swap</Button>
      <Button to="/take" variant="contained" component={Link}>Take Swap</Button>
    </div>
  );
}

export default Hero;
