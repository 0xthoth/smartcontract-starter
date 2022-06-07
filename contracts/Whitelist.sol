//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";

contract Whitelist is Ownable {
    uint256 public maxWhiteListAddress;
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _ids;

    mapping(address => bool) public whitelistAddress;

    constructor(uint256 _maxWhiteListAddress) {
        console.log("Deploying a max whitelist address:", _maxWhiteListAddress);
        maxWhiteListAddress = _maxWhiteListAddress;
    }

    function addAddressToWhitelist() public {
        // check if the user has already in whitelist
        require(
            !whitelistAddress[msg.sender],
            "Sender has already been whitelisted."
        );
        // check if account more than max whitelist address
        require(
            maxWhiteListAddress > _ids.current(),
            "Account more than the max whitelist address."
        );
        whitelistAddress[msg.sender] = true;
        _ids.increment();
    }

    function whitelistedAddresses(address a) public view returns (bool) {
        return whitelistAddress[a] == true;
    }

    function whitelistLength() public view returns (uint256) {
        return _ids.current();
    }

    function maxWhiteList() public view returns (uint256) {
        return maxWhiteListAddress;
    }

    function spacialAdd(address a) public onlyOwner {
        // check if the user has already in whitelist
        require(
            !whitelistAddress[a],
            "User Address has already been whitelisted."
        );
        // check if account more than max whitelist address
        require(
            maxWhiteListAddress > _ids.current(),
            "Account more than the max whitelist address."
        );
        whitelistAddress[a] = true;
        _ids.increment();
    }
}
