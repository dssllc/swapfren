//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.14;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract SwapFren721 {
    error FailedTransfer();

    // Swap struct to store swap details.
    struct Swap {
        address fromFren;
        address fromTokenContract;
        uint256 fromTokenId;
        address forFren;
        address forTokenContract;
        uint256 forTokenId;
    }

    // Mapping of swaps to an address.
    mapping(address => Swap) public frenSwaps;

    /// @notice Make a swap.
    function makeSwap(
        address _fromTokenContract,
        uint256 _fromTokenId,
        address _forFren,
        address _forTokenContract,
        uint256 _forTokenId
    ) external {
        // Create/store swap.
        frenSwaps[msg.sender] = Swap(
            msg.sender,
            _fromTokenContract,
            _fromTokenId,
            _forFren,
            _forTokenContract,
            _forTokenId
        );
    }

    /// @notice Take a swap.
    function takeSwap(address _fromFren) external {
        // Get swap.
        Swap memory frenSwap = frenSwaps[_fromFren];
        // Connect to token contracts.
        IERC721 fromContract = IERC721(frenSwap.fromTokenContract);
        IERC721 forContract = IERC721(frenSwap.forTokenContract);
        // Perform transfers.
        fromContract.transferFrom(
            frenSwap.fromFren,
            frenSwap.forFren,
            frenSwap.fromTokenId
        );
        forContract.transferFrom(
            frenSwap.forFren,
            frenSwap.fromFren,
            frenSwap.forTokenId
        );
        // Check token ownership.
        if (
            fromContract.ownerOf(frenSwap.fromTokenId) != frenSwap.forFren ||
            forContract.ownerOf(frenSwap.forTokenId) != frenSwap.fromFren
        ) revert FailedTransfer();
        // Drop the swap.
        delete frenSwaps[_fromFren];
    }
}
