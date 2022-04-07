import React from "react";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { TextFieldProps } from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ethers } from "ethers";
import SwapFren
  from "./artifacts/contracts/SwapFren.sol/SwapFren.json";
import MockERC721
  from "./artifacts/contracts/MockERC721.sol/MockERC721.json";

function MakeSwap() {

  const swapFrenTokenContract = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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

  async function toggleUserConnection() {
    if (!!(window as any).ethereum) {
      if (!userConnected) {
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        await provider.send("eth_requestAccounts", []);
        setSigner(provider.getSigner());
        const tokenContract = new ethers.Contract(
          swapFrenTokenContract,
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
    setFromTokenApproved((await tokenContract.getApproved(fromTokenId)) == swapFrenTokenContract);
  }

  async function approveFromToken() {
    const tokenContract = new ethers.Contract(
      fromTokenContract,
      MockERC721.abi,
      signer
    );
    await tokenContract.approve(swapFrenTokenContract, fromTokenId);
    setFromTokenApproved((await tokenContract.getApproved(fromTokenId)) == swapFrenTokenContract);
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
      swapFrenTokenContract,
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
    clearForm();
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
        />

        <Typography gutterBottom>Please approve SwapFren to transfer your NFT.</Typography>

        {!fromTokenChecked &&
        <Button
          variant="contained"
          onClick={() => checkFromTokenApproval()}
          disabled={!userConnected}
        >
            Check Approval
        </Button>
        }

        {fromTokenChecked && !fromTokenApproved  &&
          <>
            <Alert severity="warning">Token NOT approved!</Alert>
            <Button
              variant="contained"
              onClick={() => approveFromToken()}
              disabled={!userConnected}
            >
                Approve SwapFren
            </Button>
          </>
        }

        {fromTokenChecked && fromTokenApproved  &&
          <Alert severity="success">Token approved!</Alert>
        }

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
      }
      {userConnected && !swapChecked &&
      <>
        <Alert severity="info">Checking for existing swap...</Alert>
      </>
      }
      {userConnected && swapChecked && swapPending &&
      <>
        <Alert severity="info">You already have an open swap</Alert>
      </>
      }
    </>

  );
}

export default MakeSwap;
