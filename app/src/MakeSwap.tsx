import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ethers } from "ethers";
import SwapFren
  from "./artifacts/contracts/SwapFren.sol/SwapFren.json";
import MockERC721
  from "./artifacts/contracts/MockERC721.sol/MockERC721.json";
import Config from "./config";

function MakeSwap() {
  const [userConnected, setUserConnected] = useState(false);
  const [fromTokenContract, setFromTokenContract] = useState("");
  const [fromTokenId, setFromTokenId] = useState(0);
  const [forFren, setForFren] = useState("");
  const [forTokenContract, setforTokenContract] = useState("");
  const [forTokenId, setForTokenId] = useState(0);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>();
  const [fromTokenChecked, setFromTokenChecked] = useState(false);
  const [fromTokenApproved, setFromTokenApproved] = useState(false);
  const [swapChecked, setSwapChecked] = useState(false);
  const [swapPending, setSwapPending] = useState(true);
  const [swapTxn, setSwapTxn] = useState("");

  async function toggleUserConnection() {
    if (!!(window as any).ethereum) {
      if (!userConnected) {
        setSwapTxn("");
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        await provider.send("eth_requestAccounts", []);
        setSigner(provider.getSigner());
        const tokenContract = new ethers.Contract(
          Config.swapFrenContract,
          SwapFren.abi,
          provider
        );
        let wallet: any = await provider.getSigner().getAddress();
        let pendingSwap: any = await tokenContract.getSwapForFren(wallet);
        setSwapPending(pendingSwap.fromFren != ethers.constants.AddressZero);
        setSwapChecked(true);
      } else {
        clearForm();
      }
      setUserConnected(!userConnected);
    }
  }

  async function checkFromTokenApproval() {
    const tokenContract = new ethers.Contract(
      fromTokenContract,
      MockERC721.abi,
      signer
    );
    setFromTokenChecked(true);
    setFromTokenApproved((await tokenContract.getApproved(fromTokenId)) == Config.swapFrenContract);
  }

  async function approveFromToken() {
    const tokenContract = new ethers.Contract(
      fromTokenContract,
      MockERC721.abi,
      signer
    );
    let txn: any = await tokenContract.approve(Config.swapFrenContract, fromTokenId);
    await txn.wait();
    setFromTokenChecked(false);
    setFromTokenApproved((await tokenContract.getApproved(fromTokenId)) == Config.swapFrenContract);
  }

  async function cancelSwapFrenApproval() {
    const tokenContract = new ethers.Contract(
      fromTokenContract,
      MockERC721.abi,
      signer
    );
    let txn: any = await tokenContract.approve(ethers.constants.AddressZero, fromTokenId);
    await txn.wait();
    setFromTokenApproved(false);
  }

  function clearForm() {
    setUserConnected(false);
    setFromTokenContract("");
    setFromTokenId(0);
    setForFren("");
    setforTokenContract("");
    setForTokenId(0);
    setSigner(undefined);
    setFromTokenChecked(false);
    setFromTokenApproved(false);
    setSwapTxn("");
  }

  async function makeSwap() {
    const tokenContract = new ethers.Contract(
      Config.swapFrenContract,
      SwapFren.abi,
      signer
    );
    let txn: any = await tokenContract.makeSwap(
      fromTokenContract,
      fromTokenId,
      forFren,
      forTokenContract,
      forTokenId
    );
    await txn.wait();
    clearForm();
    setSwapTxn(txn.hash);
  }

  async function cancelSwap() {
    const tokenContract = new ethers.Contract(
      Config.swapFrenContract,
      SwapFren.abi,
      signer
    );
    let txn: any = await tokenContract.cancelSwapMySwaps();
    await txn.wait();
    setSwapPending(false);
  }

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        MakeSwap
      </Typography>
      <Typography gutterBottom>Please connect your wallet.</Typography>
      <Button
        sx={{ mb: 1 }}
        variant="contained"
        onClick={toggleUserConnection}
      >
          {userConnected ? "Disconnect" : "Connect"}
      </Button>
      {userConnected && swapChecked && !swapPending &&
      <>
        <Typography gutterBottom>Please enter the contract address of the NFT you want to trade.</Typography>
        <TextField
          label="Your NFT address"
          variant="outlined"
          helperText={"Enter a full address 0xAABB..."}
          fullWidth
          disabled={!userConnected}
          onChange={(e) => setFromTokenContract(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Typography gutterBottom>Please enter the ID of the NFT you want to trade.</Typography>
        <TextField
          label="Your NFT ID"
          variant="outlined"
          helperText={"Enter a number"}
          fullWidth
          disabled={!userConnected}
          onChange={(e) => {
            setFromTokenChecked(false);
            setFromTokenId(parseInt(e.target.value));
          }}
          sx={{ mb: 1 }}
        />

        <Typography gutterBottom>Please approve SwapFren to transfer your NFT.</Typography>

        {!fromTokenChecked &&
        <Button
          variant="contained"
          onClick={() => checkFromTokenApproval()}
          disabled={!userConnected}
          sx={{ mb: 1 }}
        >
            Check Approval
        </Button>
        }

        {fromTokenChecked && !fromTokenApproved  &&
          <>
            <Alert severity="warning" sx={{ mb: 1 }} >Token NOT approved!</Alert>
            <Button
              variant="contained"
              onClick={() => approveFromToken()}
              disabled={!userConnected}
              sx={{ mb: 1 }}
            >
                Approve SwapFren
            </Button>
          </>
        }

        {fromTokenChecked && fromTokenApproved  &&
          <>
            <Alert severity="success" sx={{ mb: 1 }}>Token approved!</Alert>
            <Button
              variant="outlined"
              onClick={() => cancelSwapFrenApproval()}
              disabled={!fromTokenApproved}
              sx={{ mb: 1 }}
            >
                Cancel SwapFren Approval
            </Button>
          </>
        }

        <Typography gutterBottom>Please enter the owner wallet address of the NFT you want to trade for.</Typography>
        <TextField
          label="Fren address"
          variant="outlined"
          helperText={"Enter a full address 0xAABB..."}
          fullWidth
          disabled={!userConnected || !fromTokenApproved}
          onChange={(e) => setForFren(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Typography gutterBottom>Please enter the contract address of the NFT you want to trade for.</Typography>
        <TextField
          label="Fren NFT address"
          variant="outlined"
          helperText={"Enter a full address 0xAABB..."}
          fullWidth
          disabled={!userConnected || !fromTokenApproved}
          onChange={(e) => setforTokenContract(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Typography gutterBottom>Please enter the ID of the NFT you want to trade for.</Typography>
        <TextField
          label="Fren NFT ID"
          variant="outlined"
          helperText={"Enter a number"}
          fullWidth
          disabled={!userConnected || !fromTokenApproved}
          onChange={(e) => setForTokenId(parseInt(e.target.value))}
          sx={{ mb: 1 }}
        />
        <Button
          variant="contained"
          onClick={() => makeSwap()}
          disabled={!userConnected}
        >
            Submit
        </Button>
      </>
      }
      {userConnected && !swapChecked &&
      <>
        <Alert severity="info" sx={{ mb: 1 }}>Checking for existing swap...</Alert>
      </>
      }
      {userConnected && swapChecked && swapPending &&
      <>
        <Alert severity="info" sx={{ mb: 1 }}>You already have an open swap</Alert>
        <Button
          variant="outlined"
          onClick={() => cancelSwap()}
          disabled={!userConnected}
        >
            Cancel Open Swap
        </Button>
      </>
      }
      {swapTxn &&
        <Alert severity="info" sx={{ mb: 1 }}>
          Swap made!<br />
          <Link
            href={Config.etherScanUrl + swapTxn}
            underline="always"
            target="_blank"
            rel="noreferrer noopener"
          >
            Please check transaction
          </Link>
        </Alert>
      }
    </>

  );
}

export default MakeSwap;
