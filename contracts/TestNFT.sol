//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./lib/TextStorage.sol";

contract TestNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, TextStorage {
    using Counters for Counters.Counter;

    Counters.Counter private tokenIdCounter;

    constructor() ERC721("TestNFT", "TNFT") {}

    function safeMintImage(address to, string memory uri) public onlyOwner {
        _safeMint(to, tokenIdCounter.current());
        _setTokenURI(tokenIdCounter.current(), uri);
        tokenIdCounter.increment();
    }

    function safeMintText(address to, string memory text) public onlyOwner {
        _safeMint(to, tokenIdCounter.current());
        _storeText(tokenIdCounter.current(), text);
        tokenIdCounter.increment();
    }

    function currentCounter() public view returns (uint256) {
        return tokenIdCounter.current();
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
