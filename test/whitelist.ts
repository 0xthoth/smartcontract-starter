import { expect } from "chai";
import { ethers } from "hardhat";

describe("Whitelist", function () {
  before(async function () {
    this.Whitelist = await ethers.getContractFactory("Whitelist");
    this.whitelist = await this.Whitelist.deploy(10);

    this.signers = await ethers.getSigners();
    this.alice = this.signers[0];
    this.bob = this.signers[1];
    this.carol = this.signers[2];
  });

  beforeEach(async function () {
    await this.whitelist.deployed();
  });

  it("Should return the number of max whitelist address", async function () {
    expect(await this.whitelist.maxWhiteListAddress()).to.equal(10);
    expect(await this.whitelist.whitelistLength()).to.equal(0);

    const addWhitelistgTx = await this.whitelist.addAddressToWhitelist();

    // wait until the transaction is mined
    await addWhitelistgTx.wait();
    expect(await this.whitelist.whitelistLength()).to.equal(1);
  });

  it("Should be added in whitelist", async function () {
    const addWhitelistgTx = await this.whitelist.spacialAdd(this.carol.address);
    await addWhitelistgTx.wait();
    expect(await this.whitelist.whitelistLength()).to.equal(2);

    const isWhitelisted = await this.whitelist.whitelistedAddresses(
      this.carol.address
    );
    // eslint-disable-next-line no-unused-expressions
    expect(isWhitelisted).to.be.true;
  });
});
