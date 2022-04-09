import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ethers } from "ethers";
import SwapFren721
  from "./artifacts/contracts/SwapFren721.sol/SwapFren721.json";
import MockERC721
  from "./artifacts/contracts/MockERC721.sol/MockERC721.json";
import Config from "./config";

interface Swap {
  fromFren: string;
  fromTokenContract: string;
  fromTokenId: number;
  forFren: string;
  forTokenContract: string;
  forTokenId: number;
}

function TakeSwap() {
  const [userConnected, setUserConnected] = useState(false);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>();
  const [fromFren, setFromFren] = useState("");
  const [swapChecked, setSwapChecked] = useState(false);
  const [swapPending, setSwapPending] = useState(false);
  const [swapInfo, setSwapInfo] = useState<Swap>();
  const [forTokenChecked, setForTokenChecked] = useState(false);
  const [forTokenApproved, setForTokenApproved] = useState(false);
  const [swapTxn, setSwapTxn] = useState("");

  async function toggleUserConnection() {
    if (!!(window as any).ethereum) {
      if (!userConnected) {
        setSwapTxn("");
        const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        await provider.send("eth_requestAccounts", []);
        setSigner(await provider.getSigner());
        const tokenContract = new ethers.Contract(
          Config.swapFrenContract,
          SwapFren721.abi,
          provider
        );
      } else {
        clearForm();
      }
      setUserConnected(!userConnected);
    }
  }

  function clearForm() {
    setFromFren("");
    setUserConnected(false);
    setSwapChecked(false);
    setSwapPending(false);
    setSwapInfo(undefined);
    setSigner(undefined);
    setForTokenChecked(false);
    setForTokenApproved(false);
    setSwapTxn("");
  }

  async function checkForSwap() {
    const tokenContract = new ethers.Contract(
      Config.swapFrenContract,
      SwapFren721.abi,
      signer
    );
    let info: any = await tokenContract.getSwapForFren(fromFren);
    setSwapInfo(info);
    setSwapPending(info?.forFren == await signer?.getAddress());
    setSwapChecked(true);
  }

  async function takeSwap() {
    const tokenContract = new ethers.Contract(
      Config.swapFrenContract,
      SwapFren721.abi,
      signer
    );
    let txn: any = await tokenContract.takeSwap(fromFren);
    clearForm();
    setSwapTxn(txn.hash);
  }

  async function checkForTokenApproval() {
    if (swapInfo?.forTokenContract) {
      const tokenContract = new ethers.Contract(
        swapInfo?.forTokenContract,
        MockERC721.abi,
        signer
      );
      setForTokenChecked(true);
      setForTokenApproved(
        ethers.utils.getAddress(await tokenContract.getApproved(swapInfo?.forTokenId)) == ethers.utils.getAddress(Config.swapFrenContract)
      );
    }
  }

  async function approveForToken() {
    if (swapInfo?.forTokenContract) {
      const tokenContract = new ethers.Contract(
        swapInfo?.forTokenContract,
        MockERC721.abi,
        signer
      );
      let txn: any = await tokenContract.approve(Config.swapFrenContract, swapInfo?.forTokenId);
      setForTokenChecked(false);
      setForTokenApproved(
        ethers.utils.getAddress(await tokenContract.getApproved(swapInfo?.forTokenId)) == ethers.utils.getAddress(Config.swapFrenContract)
      );
    }
  }

  async function cancelSwapFrenApproval() {
    if (swapInfo?.forTokenContract) {
      const tokenContract = new ethers.Contract(
        swapInfo?.forTokenContract,
        MockERC721.abi,
        signer
      );
      let txn: any = await tokenContract.approve(ethers.constants.AddressZero, swapInfo?.forTokenId);
      setForTokenApproved(false);
    }
  }

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>TakeSwap</Typography>
      <Typography gutterBottom>Please connect your wallet.</Typography>
      <Button
        sx={{ mb: 1 }}
        variant={userConnected ? "outlined" : "contained"}
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
      {userConnected && swapChecked && swapPending &&
        <>
          <Alert severity="success" sx={{ mb: 1 }}>You swap is ready to go!</Alert>
          <Typography gutterBottom>
            <strong>From: </strong>
            <Link
              href={`${Config.etherScanUrl}/address/${swapInfo?.fromFren}`}
              underline="always"
              target="_blank"
              rel="noreferrer noopener"
            >
              {swapInfo?.fromFren}
            </Link>
          </Typography>
          <Typography gutterBottom>
            <strong>From Token:</strong>
            <Link
              href={`${Config.etherScanUrl}/token/${swapInfo?.fromTokenContract}`}
              underline="always"
              target="_blank"
              rel="noreferrer noopener"
            >
              {swapInfo?.fromTokenContract}
            </Link>
          </Typography>
          <Typography gutterBottom>
            <strong>From Token ID:</strong>
            <Link
              href={`${Config.etherScanUrl}/token/${swapInfo?.fromTokenContract}?a=${swapInfo?.fromTokenId.toString()}#inventory`}
              underline="always"
              target="_blank"
              rel="noreferrer noopener"
            >
              {swapInfo?.fromTokenId.toString()}
            </Link>
          </Typography>
          <Typography gutterBottom>
            <strong>For Token:</strong>
            <Link
              href={`${Config.etherScanUrl}/token/${swapInfo?.forTokenContract}`}
              underline="always"
              target="_blank"
              rel="noreferrer noopener"
            >
              {swapInfo?.forTokenContract}
            </Link>
          </Typography>
          <Typography gutterBottom>
            <strong>For Token ID:</strong><Link
              href={`${Config.etherScanUrl}/address/${swapInfo?.forTokenContract}?a=${swapInfo?.forTokenId.toString()}#inventory`}
              underline="always"
              target="_blank"
              rel="noreferrer noopener"
            >
              {swapInfo?.forTokenId.toString()}
            </Link>
          </Typography>


          <Typography gutterBottom>Please approve SwapFren to transfer your NFT.</Typography>

        {!forTokenChecked &&
        <Button
          variant="contained"
          onClick={() => checkForTokenApproval()}
          disabled={!userConnected}
          sx={{ mb: 1 }}
        >
            Check Approval
        </Button>
        }

        {forTokenChecked && !forTokenApproved  &&
          <>
            <Alert severity="warning" sx={{ mb: 1 }} >Token NOT approved!</Alert>
            <Button
              variant="contained"
              onClick={() => approveForToken()}
              disabled={!userConnected}
              sx={{ mb: 1 }}
            >
                Approve SwapFren
            </Button>
          </>
        }

        {forTokenChecked && forTokenApproved &&
          <>
            <Alert severity="success" sx={{ mb: 1 }}>Token approved!</Alert>
            <Button
              variant="outlined"
              onClick={() => cancelSwapFrenApproval()}
              disabled={!forTokenApproved}
              sx={{ mb: 1 }}
            >
                Cancel SwapFren Approval
            </Button>
          </>
        }

        {forTokenChecked && forTokenApproved &&
          <>
            <hr />
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
      }
      {userConnected && swapChecked && !swapPending &&
        <>
          <Alert severity="warning" sx={{ mb: 1 }}>No swap found</Alert>
        </>
      }
      {swapTxn &&
        <Alert severity="info" sx={{ mb: 1 }}>
          Swap made!<br />
          <Link
            href={`${Config.etherScanUrl}/tx/${swapTxn}`}
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

export default TakeSwap;
