// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";

contract ABC is ERC721Upgradeable {
    function initialize(string memory name, string memory symbol)
        public
        virtual
        initializer
    {
        __ERC721_init(name, symbol);
    }

    function _safeMint(address to, uint256 tokenId)
        internal
        virtual
        override(ERC721Upgradeable)
    {
        super._safeMint(to, tokenId);
    }
}
