import { useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import LinearProgress from '@mui/material/LinearProgress';
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ethers } from "ethers";
import SwapFren721
  from "../artifacts/contracts/SwapFren721.sol/SwapFren721.json";
import MockERC721
  from "../artifacts/contracts/MockERC721.sol/MockERC721.json";
import Config from "../config";

function MakeSwap() {
  const [userConnected, setUserConnected] = useState(false);
  const [fromTokenContract, setFromTokenContract] = useState("");
  const [fromTokenId, setFromTokenId] = useState(0);
  const [forFren, setForFren] = useState("");
  const [forTokenContract, setforTokenContract] = useState("");
  const [forTokenId, setForTokenId] = useState(0);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | undefined>();
  const [fromTokenChecked, setFromTokenChecked] = useState(false);
  const [fromTokenChecking, setFromTokenChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fromTokenApproved, setFromTokenApproved] = useState(false);
  const [fromTokenApproving, setFromTokenApproving] = useState(false);
  const [swapChecked, setSwapChecked] = useState(false);
  const [swapPending, setSwapPending] = useState(true);
  const [swapProcessing, setSwapProcessing] = useState(false);
  const [swapTxn, setSwapTxn] = useState("");

  interface ProviderRpcError extends Error {
    reason?: string;
  }

  async function toggleUserConnection() {
    if (!!(window as any).ethereum) {
      if (!userConnected) {
        setSwapTxn("");
        const provider = new ethers.providers.Web3Provider((window as any).ethereum)
        await provider.send("eth_requestAccounts", []);
        setSigner(provider.getSigner());
        const tokenContract = new ethers.Contract(
          Config.swapFrenContract,
          SwapFren721.abi,
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
    setErrorMessage("");
    setFromTokenChecking(true);
    tokenContract
      .getApproved(fromTokenId)
      .then(
        (result: string) => {
          setFromTokenApproved(
            ethers.utils.getAddress(result) == ethers.utils.getAddress(Config.swapFrenContract)
          );
          setFromTokenChecking(false);
          setFromTokenChecked(true);
        },
        (error: ProviderRpcError) => {
          setFromTokenChecking(false);
          setErrorMessage(error.reason ? error.reason : "An error occured, check the console");
          setFromTokenChecked(false);
        }
      );
  }

  async function approveFromToken() {
    const tokenContract = new ethers.Contract(
      fromTokenContract,
      MockERC721.abi,
      signer
    );
    setFromTokenApproving(true);
    tokenContract
      .approve(Config.swapFrenContract, fromTokenId)
      .then(
        (result: any) => {
          result
          .wait()
          .then(
            (result: any) => {
              setFromTokenApproving(false);
              setFromTokenChecked(true);
              setFromTokenApproved(true);
            },
            (error: any) => {
              setFromTokenApproving(false);
              setErrorMessage("An error occured, check the console");
              setFromTokenChecked(false);
              setFromTokenApproved(false);
            }
          );
        },
        (error: ProviderRpcError) => {
          setFromTokenApproving(false);
          setErrorMessage("An error occured, check the console");
          setFromTokenChecked(false);
          setFromTokenApproved(false);
        }
      );
  }

  async function cancelSwapFrenApproval() {
    const tokenContract = new ethers.Contract(
      fromTokenContract,
      MockERC721.abi,
      signer
    );
    setFromTokenApproving(true);
    setFromTokenApproved(false);
    tokenContract
      .approve(ethers.constants.AddressZero, fromTokenId)
      .then(
        (result: any) => {
          result
          .wait()
          .then(
            (result: any) => {
              setFromTokenApproving(false);
              setFromTokenChecked(false);
              setFromTokenApproved(false);
            },
            (error: any) => {
              setFromTokenApproving(false);
              setErrorMessage("An error occured, check the console");
              setFromTokenChecked(false);
              setFromTokenApproved(false);
            }
          );
        },
        (error: ProviderRpcError) => {
          setFromTokenApproving(false);
          setErrorMessage("An error occured, check the console");
          setFromTokenChecked(false);
          setFromTokenApproved(false);
        }
      );
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
    setFromTokenChecking(false);
    setErrorMessage("");
    setFromTokenApproved(false);
    setFromTokenApproving(false);
    setSwapProcessing(false);
    setSwapTxn("");
  }

  async function makeSwap() {
    const tokenContract = new ethers.Contract(
      Config.swapFrenContract,
      SwapFren721.abi,
      signer
    );
    setErrorMessage("");
    setSwapProcessing(true);
    tokenContract
      .makeSwap(
        fromTokenContract,
        fromTokenId,
        forFren,
        forTokenContract,
        forTokenId
      )
      .then(
        (txn: any) => {
          setSwapTxn(txn.hash);
          txn
            .wait()
            .then(
              (result: any) => {
                clearForm();
                setSwapTxn(txn.hash);
              },
              (error: any) => {
                setSwapProcessing(false);
                setErrorMessage("An error occured, check the console");
              }
            );
        },
        (error: any) => {
          setSwapProcessing(false);
          setErrorMessage("An error occured, check the console");
        }
      );
  }

  async function cancelSwap() {
    const tokenContract = new ethers.Contract(
      Config.swapFrenContract,
      SwapFren721.abi,
      signer
    );
    setErrorMessage("");
    setSwapProcessing(true);
    tokenContract
      .cancelSwapMySwaps()
      .then(
        (result: any) => {
          result
            .wait()
            .then(
              (result: any) => {
                setSwapProcessing(false);
                setSwapPending(false);
              },
              (error: any) => {
                setSwapProcessing(false);
                setErrorMessage("An error occured, check the console");
              }
            );
        },
        (error: any) => {
          setSwapProcessing(false);
          setErrorMessage("An error occured, check the console");
        }
      );
  }

  return (
    <>
      <Typography variant="h5" component="h2" gutterBottom>
        MakeSwap
      </Typography>
      <Typography gutterBottom>Please connect your wallet.</Typography>
      <Button
        sx={{ mb: 1 }}
        variant={userConnected ? "outlined" : "contained"}
        onClick={toggleUserConnection}
      >
          {userConnected ? "Disconnect" : "Connect"}
      </Button>

      {userConnected && swapChecked && !swapPending &&
      <>
        <Typography>Please enter the contract address of the NFT you want to trade.</Typography>
        <TextField
          label="Your NFT address"
          variant="outlined"
          fullWidth
          disabled={!userConnected}
          onChange={(e) => setFromTokenContract(e.target.value)}
          sx={{ mb: 1, mt: 2 }}
        />
        <Typography gutterBottom>Please enter the ID of the NFT you want to trade.</Typography>
        <TextField
          label="Your NFT ID"
          variant="outlined"
          fullWidth
          disabled={!userConnected}
          onChange={(e) => {
            setFromTokenChecked(false);
            setFromTokenId(parseInt(e.target.value));
            setErrorMessage("");
          }}
          sx={{ mb: 1 }}
        />

        <Typography gutterBottom>Please approve SwapFren to transfer your NFT.</Typography>

        {!fromTokenChecked && !fromTokenChecking &&
        <Button
          variant="contained"
          onClick={() => checkFromTokenApproval()}
          sx={{ mb: 1 }}
        >
            Check Approval
        </Button>
        }

        {(fromTokenChecking || fromTokenApproving) &&
          <LinearProgress />
        }

        {fromTokenChecked && !fromTokenApproved && !fromTokenApproving &&
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

        {fromTokenChecked && fromTokenApproved &&
          <>
            <Typography gutterBottom>Please enter the owner wallet address of the NFT you want to trade for.</Typography>
            <TextField
              label="Fren address"
              variant="outlined"
              fullWidth
              disabled={!userConnected || !fromTokenApproved}
              onChange={(e) => setForFren(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Typography gutterBottom>Please enter the contract address of the NFT you want to trade for.</Typography>
            <TextField
              label="Fren NFT address"
              variant="outlined"
              fullWidth
              disabled={!userConnected || !fromTokenApproved}
              onChange={(e) => setforTokenContract(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Typography gutterBottom>Please enter the ID of the NFT you want to trade for.</Typography>
            <TextField
              label="Fren NFT ID"
              variant="outlined"
              fullWidth
              disabled={!userConnected || !fromTokenApproved}
              onChange={(e) => setForTokenId(parseInt(e.target.value))}
              sx={{ mb: 1 }}
            />
            {!swapProcessing &&
              <Button
                variant="contained"
                onClick={() => makeSwap()}
                disabled={!userConnected || !fromTokenApproved}
                sx={{ mb: 1 }}
              >
                  Submit
              </Button>
            }
          </>
        }
      </>
      }

      {userConnected && !swapChecked &&
      <>
        <Alert severity="info" sx={{ mb: 1 }}>Checking for existing swap...</Alert>
      </>
      }

      {userConnected && swapChecked && swapPending && !swapProcessing &&
      <>
        <Alert severity="info" sx={{ mb: 1 }}>You already have an open swap</Alert>
        <Button
          variant="outlined"
          onClick={() => cancelSwap()}
          disabled={!userConnected}
          sx={{ mb: 1 }}
        >
            Cancel Open Swap
        </Button>
      </>
      }

      {swapProcessing &&
        <LinearProgress sx={{ mb: 1 }} />
      }

      {swapTxn &&
        <Alert severity="info" sx={{ mb: 1 }}>
          Swap made! Tell your fren so they can accept.<br />
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

      {errorMessage &&
        <Alert severity="error" sx={{ mb: 1 }} >{errorMessage}</Alert>
      }
    </>

  );
}

export default MakeSwap;
