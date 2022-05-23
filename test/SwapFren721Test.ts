import { expect } from "chai";
import { ethers } from "hardhat";

describe("SwapFren721Test", function () {
  let owner: any,
    secondAddress: any,
    thirdAddress: any,
    fourthAddress: any,
    MockDogERC721Contract: any,
    MockDogERC721: any,
    MockCatERC721Contract: any,
    MockCatERC721: any,
    SwapFren721Contract: any,
    SwapFren721: any;

  before(async () => {
    // Get addresses.
    [
      owner,
      secondAddress,
      thirdAddress,
      fourthAddress,
    ] = await ethers.getSigners();
    // Deploy an "dog" NFT contract for use in testing.
    MockDogERC721Contract = await ethers.getContractFactory("MockERC721");
    MockDogERC721 = await MockDogERC721Contract.deploy();
    await MockDogERC721.deployed();
    // Mint a few dog NFTs.
    await MockDogERC721.mint(owner.address);
    await MockDogERC721.mint(secondAddress.address);
    await MockDogERC721.mint(thirdAddress.address);
    // Deploy an "cat" NFT contract for use in testing.
    MockCatERC721Contract = await ethers.getContractFactory("MockERC721");
    MockCatERC721 = await MockCatERC721Contract.deploy();
    await MockCatERC721.deployed();
    // Mint a few cat NFTs.
    await MockCatERC721.mint(owner.address);
    await MockCatERC721.mint(secondAddress.address);
    await MockCatERC721.mint(thirdAddress.address);
    // Deploy SwapFren721 contract for testing.
    SwapFren721Contract = await ethers.getContractFactory("SwapFren721");
    SwapFren721 = await SwapFren721Contract.deploy();
    await SwapFren721.deployed();
  });

  it("should swap with a fren", async () => {
    // Verify initial empty approvals.
    expect(await MockDogERC721.getApproved(1)).to.equal(
      ethers.constants.AddressZero
    );
    expect(await MockCatERC721.getApproved(2)).to.equal(
      ethers.constants.AddressZero
    );

    // Verify initial ownership.
    expect(await MockDogERC721.ownerOf(1)).to.equal(secondAddress.address);
    expect(await MockCatERC721.ownerOf(2)).to.equal(thirdAddress.address);

    // Party A approval.
    await MockDogERC721.connect(secondAddress).approve(SwapFren721.address, 1);

    // Party B approval.
    await MockCatERC721.connect(thirdAddress).approve(SwapFren721.address, 2);

    // Verify approvals for SwapFren721
    expect(await MockDogERC721.getApproved(1)).to.equal(SwapFren721.address);
    expect(await MockCatERC721.getApproved(2)).to.equal(SwapFren721.address);

    // Party A create swap
    await SwapFren721.connect(secondAddress).makeSwap(
      MockDogERC721.address,
      1,
      thirdAddress.address,
      MockCatERC721.address,
      2
    );

    // Get active swap for fren.
    let swap = await SwapFren721.frenSwaps(secondAddress.address);

    // Verify swap details.
    expect(swap.fromFren).to.equal(secondAddress.address);
    expect(swap.fromTokenContract).to.equal(MockDogERC721.address);
    expect(swap.fromTokenId).to.equal(1);
    expect(swap.forFren).to.equal(thirdAddress.address);
    expect(swap.forTokenContract).to.equal(MockCatERC721.address);
    expect(swap.forTokenId).to.equal(2);

    // Party B accept swap.
    await SwapFren721.connect(thirdAddress).takeSwap(secondAddress.address);

    // Verify emptied approvals.
    expect(await MockDogERC721.getApproved(1)).to.equal(
      ethers.constants.AddressZero
    );
    expect(await MockCatERC721.getApproved(2)).to.equal(
      ethers.constants.AddressZero
    );

    // Verify new ownership.
    expect(await MockDogERC721.ownerOf(1)).to.equal(thirdAddress.address);
    expect(await MockCatERC721.ownerOf(2)).to.equal(secondAddress.address);

    // Get active swap for fren.
    swap = await SwapFren721.frenSwaps(secondAddress.address);

    // Verify emptied swap details.
    expect(swap.fromFren).to.equal(ethers.constants.AddressZero);
    expect(swap.fromTokenContract).to.equal(ethers.constants.AddressZero);
    expect(swap.fromTokenId).to.equal(0);
    expect(swap.forFren).to.equal(ethers.constants.AddressZero);
    expect(swap.forTokenContract).to.equal(ethers.constants.AddressZero);
    expect(swap.forTokenId).to.equal(0);
  });

  it("should explode when maker transfers token before swap is taken", async () => {
    // Verify initial empty approvals.
    expect(await MockDogERC721.getApproved(1)).to.equal(
      ethers.constants.AddressZero
    );
    expect(await MockCatERC721.getApproved(2)).to.equal(
      ethers.constants.AddressZero
    );

    // Verify initial ownership.
    expect(await MockDogERC721.ownerOf(1)).to.equal(thirdAddress.address);
    expect(await MockCatERC721.ownerOf(2)).to.equal(secondAddress.address);

    // Party A approval.
    await MockDogERC721.connect(thirdAddress).approve(SwapFren721.address, 1);

    // Party B approval.
    await MockCatERC721.connect(secondAddress).approve(SwapFren721.address, 2);

    // Verify approvals for SwapFren721
    expect(await MockDogERC721.getApproved(1)).to.equal(SwapFren721.address);
    expect(await MockCatERC721.getApproved(2)).to.equal(SwapFren721.address);

    // Party A create swap
    await SwapFren721.connect(thirdAddress).makeSwap(
      MockDogERC721.address,
      1,
      secondAddress.address,
      MockCatERC721.address,
      2
    );

    // Change maker token owner after creating swap.
    await MockDogERC721.connect(thirdAddress).transferFrom(
      thirdAddress.address,
      owner.address,
      1
    );

    // Attempt to take the swap.
    await expect(
      SwapFren721.connect(secondAddress).takeSwap(thirdAddress.address)
    ).to.be.reverted;
  });

  it("should explode when taker transfers token before swap is taken", async () => {

    // Verify initial empty approvals.
    expect(await MockDogERC721.getApproved(1)).to.equal(
      ethers.constants.AddressZero
    );

    // Verify initial ownership.
    expect(await MockDogERC721.ownerOf(1)).to.equal(owner.address);
    expect(await MockCatERC721.ownerOf(2)).to.equal(secondAddress.address);

    // Party A approval.
    await MockDogERC721.approve(SwapFren721.address, 1);

    // Verify approvals for SwapFren721
    expect(await MockDogERC721.getApproved(1)).to.equal(SwapFren721.address);
    expect(await MockCatERC721.getApproved(2)).to.equal(SwapFren721.address);

    // Party A create swap
    await SwapFren721.makeSwap(
      MockDogERC721.address,
      1,
      secondAddress.address,
      MockCatERC721.address,
      2
    );

    // Change taker token owner after creating swap.
    await MockCatERC721.connect(secondAddress).transferFrom(
      secondAddress.address,
      thirdAddress.address,
      2
    );

    // Attempt to take the swap.
    await expect(
      SwapFren721.connect(secondAddress).takeSwap(owner.address)
    ).to.be.reverted;
  });
});
