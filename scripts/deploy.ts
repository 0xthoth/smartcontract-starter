// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const NostoToken = await ethers.getContractFactory("NostoToken");
  const nostoToken = await NostoToken.deploy();
  await nostoToken.deployed();

  const Whitelist = await ethers.getContractFactory("Whitelist");
  const whitelist = await Whitelist.deploy(10);
  await whitelist.deployed();

  const NostoNFT = await ethers.getContractFactory("NostoNFT");
  const nostoNFT = await NostoNFT.deploy(whitelist.address, nostoToken.address);
  await nostoNFT.deployed();

  console.log(
    "[Token, Whitelist, NFT] deployed to:",
    nostoToken.address,
    whitelist.address,
    nostoNFT.address
  );
  // 0xe5b16a6E1DeF11c74c4F379F4D3c390f1571EcE4 
  // 0x3ac226a1a9ddcbEE9169B1B381a103BB38dDbe40
  // 0x58a478C7c9B3b00746736e331C76a2D468cC9B72
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
