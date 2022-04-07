import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ethers } from "ethers";
import SwapFren
  from "./artifacts/contracts/SwapFren.sol/SwapFren.json";

function MakeSwap() {

  const [userConnected, setUserConnected] = useState(false);
  const [fromTokenContract, setFromTokenContract] = useState("");
  const [fromTokenId, setFromTokenId] = useState(0);
  const [forFren, setForFren] = useState("");
  const [forTokenContract, setforTokenContract] = useState("");
  const [forTokenId, setForTokenId] = useState(0);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>();

  async function toggleUserConnection() {
    if (!!(window as any).ethereum) {
      if (!userConnected) {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        await provider.send("eth_requestAccounts", []);
        setSigner(provider.getSigner());
      } else {
        // clear stuff out
      }
      setUserConnected(!userConnected);
    }
  }

  async function makeSwap() {
    // console.log(
    //   (await signer?.getAddress()),
    //   fromTokenContract,"fromTokenContract",
    //   fromTokenId,"fromTokenId",
    //   forFren,"forFren",
    //   forTokenContract,"forTokenContract",
    //   forTokenId,"forTokenId"
    // )
    const tokenContract = new ethers.Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      SwapFren.abi,
      signer
    );
    // console.log(
    //   await tokenContract.takeSwap(
    //     "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    //   )
    // );
    await tokenContract.makeSwap(
      fromTokenContract,
      fromTokenId,
      forFren,
      forTokenContract,
      forTokenId
    );
  }

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        MakeSwap
      </Typography>
      <Typography gutterBottom>Please connect your wallet.</Typography>
      <Button
        variant="contained"
        onClick={toggleUserConnection}
      >
          {userConnected ? "Disconnect" : "Connect"}
      </Button>
      <Typography gutterBottom>Please enter the contract address of the NFT you want to trade.</Typography>
      <TextField
        label="Your NFT address"
        variant="outlined"
        helperText={"Enter a full address 0xAABB..."}
        fullWidth
        disabled={!userConnected}
        onChange={(e) => setFromTokenContract(e.target.value)}
      />
      <Typography gutterBottom>Please enter the ID of the NFT you want to trade.</Typography>
      <TextField
        label="Your NFT ID"
        variant="outlined"
        helperText={"Enter a number"}
        fullWidth
        disabled={!userConnected}
        onChange={(e) => setFromTokenId(parseInt(e.target.value))}
      />
      <Typography gutterBottom>Please enter the owner wallet address of the NFT you want to trade for.</Typography>
      <TextField
        label="Fren address"
        variant="outlined"
        helperText={"Enter a full address 0xAABB..."}
        fullWidth
        disabled={!userConnected}
        onChange={(e) => setForFren(e.target.value)}
      />
      <Typography gutterBottom>Please enter the contract address of the NFT you want to trade for.</Typography>
      <TextField
        label="Fren NFT address"
        variant="outlined"
        helperText={"Enter a full address 0xAABB..."}
        fullWidth
        disabled={!userConnected}
        onChange={(e) => setforTokenContract(e.target.value)}
      />
      <Typography gutterBottom>Please enter the ID of the NFT you want to trade for.</Typography>
      <TextField
        label="Fren NFT ID"
        variant="outlined"
        helperText={"Enter a number"}
        fullWidth
        disabled={!userConnected}
        onChange={(e) => setForTokenId(parseInt(e.target.value))}
      />
      <Button
        variant="contained"
        onClick={() => makeSwap()}
        disabled={!userConnected}
      >
          Submit
      </Button>
    </>

  );
}

export default MakeSwap;
