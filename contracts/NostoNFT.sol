//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

import "./interfaces/IWhitelist.sol";

contract NostoNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    Counters.Counter private _tokenIds;

    IWhitelist whitelist;
    IERC20 erc20;

    // max number of Notto NFT
    uint256 maxTokenIds = 15;
    uint256 maxSpacialTokenIds = 5;

    // _price is the price of the Notto NFT
    uint256 _price = 0.01 ether;

    constructor(address whitelistContract, address erc20Address)
        ERC721("Notto NFT", "NT")
    {
        whitelist = IWhitelist(whitelistContract);
        erc20 = IERC20(erc20Address);
    }

    function mint(string memory metadataURI) public payable returns (uint256) {
        require(
            _tokenIds.current() < maxTokenIds,
            "Exceed maximum Notto NFT supply."
        );
        require(_price < msg.value, "Ether sendt is not correct.");

        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, metadataURI);
        _tokenIds.increment();

        return newItemId;
    }

    function spacialMint(string memory metadataURI)
        public
        payable
        returns (uint256)
    {
        require(
            whitelist.whitelistedAddresses(msg.sender),
            "You are not whitelisted."
        );
        require(
            _tokenIds.current() < maxTokenIds,
            "Exceed maximum Notto NFT supply."
        );
        require(_price < msg.value, "Ether send is not correct.");

        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, metadataURI);
        _tokenIds.increment();

        return newItemId;
    }

    function mintByIERC20(string memory metadataURI, uint256 _amount)
        public
        payable
        returns (uint256)
    {
        require(
            _amount < erc20.balanceOf(msg.sender),
            "Amount send is not correct."
        );
        require(
            _tokenIds.current() < maxTokenIds,
            "Exceed maximum Notto NFT supply."
        );
        erc20.safeTransferFrom(msg.sender, address(this), _amount);

        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, metadataURI);
        _tokenIds.increment();

        return newItemId;
    }

    function _maxTokenIds() public view returns (uint256) {
        return maxTokenIds.add(maxSpacialTokenIds);
    }

    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool send, ) = _owner.call{value: amount}("");

        require(send, "Failed to send ETH");
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
