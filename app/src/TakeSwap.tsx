import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

function TakeSwap() {
  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>TakeSwap</Typography>
      <Typography gutterBottom>Please enter the address of the wallet that created the swap.</Typography>
      <TextField
        label="Fren address"
        variant="outlined"
        onChange={(e) => console.log(e.target.value)}
        error={false}
        helperText={"Please use full address 0xAABB..."}
        fullWidth
      />
    </>
  );
}

export default TakeSwap;
