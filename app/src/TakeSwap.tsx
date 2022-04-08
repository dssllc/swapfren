import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ethers } from "ethers";
import SwapFren
  from "./artifacts/contracts/SwapFren.sol/SwapFren.json";
import MockERC721
  from "./artifacts/contracts/MockERC721.sol/MockERC721.json";

interface Swap {
  fromFren: string;
  fromTokenContract: string;
  fromTokenId: number;
  forFren: string;
  forTokenContract: string;
  forTokenId: number;
}

function TakeSwap() {
  const swapFrenTokenContract = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";

  const [userConnected, setUserConnected] = useState(false);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>();
  const [fromFren, setFromFren] = useState("");
  const [swapPending, setSwapPending] = useState(false);
  const [swapInfo, setSwapInfo] = useState<Swap>();

  async function toggleUserConnection() {
    if (!!(window as any).ethereum) {
      if (!userConnected) {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
        setSigner(await provider.getSigner());
        const tokenContract = new ethers.Contract(
          swapFrenTokenContract,
          SwapFren.abi,
          provider
        );
      } else {
        clearForm();
      }
      setUserConnected(!userConnected);
    }
  }

  function clearForm() {
    setUserConnected(false);
    setSwapPending(false);
  }

  async function checkForSwap() {
    const tokenContract = new ethers.Contract(
      swapFrenTokenContract,
      SwapFren.abi,
      signer
    );
    setSwapInfo(await tokenContract.getSwapForFren(fromFren));
    setSwapPending(swapInfo?.forFren == await signer?.getAddress());
  }

  async function takeSwap() {
    const tokenContract = new ethers.Contract(
      swapFrenTokenContract,
      SwapFren.abi,
      signer
    );
    let txn: any = await tokenContract.takeSwap(fromFren);
    await txn.wait();
  }

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>TakeSwap</Typography>
      <Typography gutterBottom>Please connect your wallet.</Typography>
      <Button
        sx={{ mb: 1 }}
        variant="contained"
        onClick={toggleUserConnection}
      >
          {userConnected ? "Disconnect" : "Connect"}
      </Button>
      {userConnected && !swapPending &&
      <>
        <Typography gutterBottom>Please enter the address of the wallet that created the swap.</Typography>
        <TextField
          label="Fren address"
          variant="outlined"
          onChange={(e) => setFromFren(e.target.value)}
          error={false}
          helperText={"Please use full address 0xAABB..."}
          fullWidth
          sx={{ mb: 1 }}
        />
        <Button
          variant="contained"
          onClick={() => checkForSwap()}
          sx={{ mb: 1 }}
        >
            Check For Swap
        </Button>
      </>
      }
      {userConnected && swapPending &&
        <>
          <Alert severity="success" sx={{ mb: 1 }}>You swap is ready to go!</Alert>
          <Typography gutterBottom><strong>From:</strong> {swapInfo?.fromFren}</Typography>
          <Typography gutterBottom><strong>From Token:</strong> {swapInfo?.fromTokenContract}</Typography>
          <Typography gutterBottom><strong>From Token ID:</strong> {swapInfo?.fromTokenId.toString()}</Typography>
          <Typography gutterBottom><strong>For Token:</strong> {swapInfo?.forTokenContract}</Typography>
          <Typography gutterBottom><strong>For Token ID:</strong> {swapInfo?.forTokenId.toString()}</Typography>
          <Button
            variant="contained"
            onClick={() => takeSwap()}
            disabled={!userConnected}
          >
              Take The Swap
          </Button>
        </>
        }
    </>
  );
}

export default TakeSwap;
