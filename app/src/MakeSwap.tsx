import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

function MakeSwap() {
  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        MakeSwap
      </Typography>
      <Typography gutterBottom>Please enter the contract address of the NFT you want to trade.</Typography>
      <TextField
        label="Your NFT address"
        variant="outlined"
        onChange={(e) => console.log(e.target.value)}
        error={false}
        helperText={"Enter a full address 0xAABB..."}
        fullWidth
      />
      <Typography gutterBottom>Please enter the ID of the NFT you want to trade.</Typography>
      <TextField
        label="Your NFT ID"
        variant="outlined"
        onChange={(e) => console.log(e.target.value)}
        error={false}
        helperText={"Enter a number"}
        fullWidth
      />
      <Typography gutterBottom>Please enter the owner wallet address of the NFT you want to trade for.</Typography>
      <TextField
        label="Fren address"
        variant="outlined"
        onChange={(e) => console.log(e.target.value)}
        error={false}
        helperText={"Enter a full address 0xAABB..."}
        fullWidth
      />
      <Typography gutterBottom>Please enter the contract address of the NFT you want to trade for.</Typography>
      <TextField
        label="Fren NFT address"
        variant="outlined"
        onChange={(e) => console.log(e.target.value)}
        error={false}
        helperText={"Enter a full address 0xAABB..."}
        fullWidth
      />
      <Typography gutterBottom>Please enter the ID of the NFT you want to trade for.</Typography>
      <TextField
        label="Fren NFT ID"
        variant="outlined"
        onChange={(e) => console.log(e.target.value)}
        error={false}
        helperText={"Enter a number"}
        fullWidth
      />
    </>

  );
}

export default MakeSwap;
