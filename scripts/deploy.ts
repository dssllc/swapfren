import { ethers } from "hardhat";

async function main() {
  const contractVersion = "SwapFren721vAlpha1";
  const contract = await ethers.getContractFactory(contractVersion);
  const SwapFren = await contract.deploy();

  await SwapFren.deployed();

  console.log(`${contractVersion} deployed to:`, SwapFren.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
