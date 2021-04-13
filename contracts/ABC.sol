// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/presets/ERC721PresetMinterPauserAutoIdUpgradeable.sol";

contract ABC is ERC721PresetMinterPauserAutoIdUpgradeable {
    function initialize(
        string memory name,
        string memory symbol,
        string memory baseURI
    ) public virtual override initializer {
        __ERC721PresetMinterPauserAutoId_init(name, symbol, baseURI);
    }

}
