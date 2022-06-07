import { expect } from "chai";
import { ethers } from "hardhat";

describe("Nosto NFT", function () {
  before(async function () {
    this.NOSTAToken = await ethers.getContractFactory("NostoToken");
    this.nostoToken = await this.NOSTAToken.deploy();
    await this.nostoToken.deployed();

    this.Whitelist = await ethers.getContractFactory("Whitelist");
    this.whitelist = await this.Whitelist.deploy(10);
    await this.whitelist.deployed();

    this.NostoNFT = await ethers.getContractFactory("NostoNFT");
    this.nosto = await this.NostoNFT.deploy(
      this.whitelist.address,
      this.nostoToken.address
    );
    await this.nosto.deployed();

    this.signers = await ethers.getSigners();
    this.alice = this.signers[0];
    this.bob = this.signers[1];
    this.carol = this.signers[2];

    console.log(
      "Whitelist owner: ",
      await this.whitelist.owner(),
      " NFT owner: ",
      await this.nosto.owner(),
      " Nosto token owner: ",
      await this.nostoToken.owner()
    );
  });

  it("Init data", async function () {
    expect(await this.nosto._maxTokenIds()).to.be.equal(20);
  });

  it("Should public mint work", async function () {
    await this.whitelist.spacialAdd(this.carol.address);

    const metaUri = "/123/123";
    await this.nosto.mint(metaUri, {
      value: ethers.utils.parseEther("0.1"),
    });

    expect(await this.nosto.balanceOf(this.alice.address)).to.be.equal(1);
    expect(await this.nosto.tokenURI(0)).to.be.equal(metaUri);
  });

  it("Should not mint by spacialMint function", async function () {
    await expect(
      this.nosto.connect(this.bob).spacialMint("/spacial/add", {
        value: ethers.utils.parseEther("0.1"),
      })
    ).to.be.revertedWith("You are not whitelisted.");
  });

  it("Should spacial mint work", async function () {
    await this.whitelist.spacialAdd(this.bob.address);

    const metaUri = "/spacial/add";
    await this.nosto.connect(this.bob).spacialMint(metaUri, {
      value: ethers.utils.parseEther("0.2"),
    });

    expect(ethers.utils.formatEther(await this.nosto.getBalance())).to.be.equal(
      "0.3"
    );
  });

  it("Should erc20 mint work", async function () {
    await this.nostoToken
      .connect(this.alice)
      .approve(
        this.nosto.address,
        ethers.utils.parseEther("1000000000000").toString()
      );

    const metaUri = "/erc20/add";
    await this.nosto
      .connect(this.alice)
      .mintByIERC20(metaUri, ethers.utils.parseEther("20"));

    expect(await this.nostoToken.balanceOf(this.nosto.address)).to.be.equal(
      ethers.utils.parseEther("20")
    );
  });
});
