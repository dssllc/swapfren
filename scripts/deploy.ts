import { ethers } from "hardhat";

async function main() {
  const contractVersion = "SwapFren721vAlpha1";
  const contract = await ethers.getContractFactory(contractVersion);
  const SwapFren721 = await contract.deploy();

  await SwapFren721.deployed();

  console.log(`${contractVersion} deployed to:`, SwapFren721.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
