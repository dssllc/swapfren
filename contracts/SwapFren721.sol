//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

contract SwapFren721 {
    using ERC165Checker for address;
    bytes4 private immutable _erc721InterfaceId;

    struct Swap {
        address fromFren;
        address fromTokenContract;
        uint256 fromTokenId;
        address forFren;
        address forTokenContract;
        uint256 forTokenId;
    }

    mapping(address => Swap) private _frenSwaps;

    constructor() {
        _erc721InterfaceId = type(IERC721).interfaceId;
    }

    function makeSwap(
        address _fromTokenContract,
        uint256 _fromTokenId,
        address _forFren,
        address _forTokenContract,
        uint256 _forTokenId
    ) external {
        require(
            _frenSwaps[msg.sender].fromFren == address(0),
            "Swap in progress fren"
        );
        require(
            _fromTokenContract.supportsInterface(_erc721InterfaceId),
            "Swap maker token contract does not support IERC721"
        );
        require(
            _forTokenContract.supportsInterface(_erc721InterfaceId),
            "Swap taker token contract does not support IERC721"
        );
        IERC721 fromContract = IERC721(_fromTokenContract);
        require(
            fromContract.getApproved(_fromTokenId) == address(this),
            "Not approved to transfer your token fren"
        );
        _frenSwaps[msg.sender] = Swap(
            msg.sender,
            _fromTokenContract,
            _fromTokenId,
            _forFren,
            _forTokenContract,
            _forTokenId
        );
    }

    function takeSwap(
        address _fromFren
    ) external {
        Swap memory frenSwap = _frenSwaps[_fromFren];
        require(frenSwap.forFren == msg.sender, "No swap ready fren");
        require(
            frenSwap.fromTokenContract.supportsInterface(_erc721InterfaceId),
            "Swap maker token contract does not support IERC721"
        );
        require(
            frenSwap.forTokenContract.supportsInterface(_erc721InterfaceId),
            "Swap taker token contract does not support IERC721"
        );
        IERC721 fromContract = IERC721(frenSwap.fromTokenContract);
        IERC721 forContract = IERC721(frenSwap.forTokenContract);
        require(
            fromContract.getApproved(frenSwap.fromTokenId) == address(this),
            "Not approved to transfer their token fren"
        );
        require(
            forContract.getApproved(frenSwap.forTokenId) == address(this),
            "Not approved to transfer your token fren"
        );
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
        delete _frenSwaps[_fromFren];
    }

    function getSwapForFren(address _fromFren)
        external
        view
        returns (Swap memory _frenSwap)
    {
        return _frenSwaps[_fromFren];
    }

    function cancelSwapMySwaps()
        external
    {
        delete _frenSwaps[msg.sender];
    }
}
