import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.getContractFactory("SwapFren");
  const SwapFren = await contract.deploy();

  await SwapFren.deployed();

  console.log("SwapFren deployed to:", SwapFren.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
