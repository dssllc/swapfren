//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

contract SwapFren721 {
    // ERC165Checker attachment for address type.
    using ERC165Checker for address;

    // ERC721 interface ID, set on deploy.
    bytes4 private immutable _erc721InterfaceId;

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
    mapping(address => Swap) private _frenSwaps;

    // Constructor, set ERC721 interface ID.
    constructor() {
        _erc721InterfaceId = type(IERC721).interfaceId;
    }

    /// @notice Make a swap.
    function makeSwap(
        address _fromTokenContract,
        uint256 _fromTokenId,
        address _forFren,
        address _forTokenContract,
        uint256 _forTokenId
    ) external {
        // Check for existing swap.
        require(
            _frenSwaps[msg.sender].fromFren == address(0),
            "Swap in progress fren"
        );
        // Check for ERC-721 interface on both tokens.
        require(
            _fromTokenContract.supportsInterface(_erc721InterfaceId),
            "Your token does not support IERC721"
        );
        require(
            _forTokenContract.supportsInterface(_erc721InterfaceId),
            "Their token does not support IERC721"
        );
        // Connect to offered token contract.
        IERC721 fromContract = IERC721(_fromTokenContract);
        IERC721 forContract = IERC721(_forTokenContract);
        // Check token ownership.
        require(
            fromContract.ownerOf(_fromTokenId) == msg.sender,
            "Not your token fren"
        );
        require(
            forContract.ownerOf(_forTokenId) == _forFren,
            "Not their token fren"
        );
        // Check offered token approval.
        require(
            fromContract.getApproved(_fromTokenId) == address(this),
            "Not approved to transfer your token fren"
        );
        // Create/store swap.
        _frenSwaps[msg.sender] = Swap(
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
        Swap memory frenSwap = _frenSwaps[_fromFren];
        // Check for existing swap.
        require(frenSwap.forFren == msg.sender, "No swap ready fren");
        // Connect to token contracts.
        IERC721 fromContract = IERC721(frenSwap.fromTokenContract);
        IERC721 forContract = IERC721(frenSwap.forTokenContract);
        // Check token ownership.
        require(
            fromContract.ownerOf(frenSwap.fromTokenId) == frenSwap.fromFren,
            "Not their token fren"
        );
        require(
            forContract.ownerOf(frenSwap.forTokenId) == frenSwap.forFren,
            "Not your token fren"
        );
        // Check token approvals.
        require(
            fromContract.getApproved(frenSwap.fromTokenId) == address(this),
            "Not approved to transfer their token fren"
        );
        require(
            forContract.getApproved(frenSwap.forTokenId) == address(this),
            "Not approved to transfer your token fren"
        );
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
        // Drop the swap.
        delete _frenSwaps[_fromFren];
    }

    /// @notice Get swap for fren by address.
    function getSwapForFren(address _fromFren)
        external
        view
        returns (Swap memory _frenSwap)
    {
        return _frenSwaps[_fromFren];
    }

    /// @notice Cancel existing swap for sender.
    function cancelSwapMySwaps() external {
        delete _frenSwaps[msg.sender];
    }
}
