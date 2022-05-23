//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.14;

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
