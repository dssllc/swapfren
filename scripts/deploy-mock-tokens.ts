import { ethers } from "hardhat";

async function main() {
  // Get addresses.
  let [owner, secondAddress] = await ethers.getSigners();

  let contract = await ethers.getContractFactory("MockERC721");
  let MockERC721 = await contract.deploy();

  await MockERC721.deployed();

  console.log("MockERC721-A deployed to:", MockERC721.address);

  await MockERC721.mint(owner.address);
  await MockERC721.mint(secondAddress.address);


  contract = await ethers.getContractFactory("MockERC721");
  MockERC721 = await contract.deploy();

  await MockERC721.deployed();

  console.log("MockERC721-B deployed to:", MockERC721.address);

  await MockERC721.mint(owner.address);
  await MockERC721.mint(secondAddress.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
