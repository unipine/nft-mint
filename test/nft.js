const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { BigNumber } = require("ethers");

describe("NFT contract", function () {
  const dummyCid = "dummy cid";
  // 1024 ascii codes for 1kb
  const textNft =
    "abcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwxyz !@#$%ABCDEF\nabcdefghijklmnopqrstuvwx";

  async function deployNftFixture() {
    // Get the ContractFactory and Signers here.
    const Nft = await ethers.getContractFactory("TestNFT");
    const [owner, alice, bob] = await ethers.getSigners();

    // To deploy our contract, we just have to call Nft.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    const NftContract = await Nft.deploy();

    await NftContract.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { Nft, NftContract, owner, alice, bob };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      // We use loadFixture to setup our environment, and then assert that
      // things went well
      const { NftContract, owner } = await loadFixture(deployNftFixture);

      // This test expects the owner variable stored in the contract to be
      // equal to our Signer's owner.
      expect(await NftContract.owner()).to.equal(owner.address);
    });

    it("Should return the correct counter", async () => {
      const { NftContract } = await loadFixture(deployNftFixture);

      // This test expects the counter variable stored in the contract to be 0.
      expect(await NftContract.currentCounter()).to.equal(0);
    });
  });

  describe("Transactions", function () {
    it("Should return correct counter and alice should be the owner of NFT", async () => {
      const { NftContract, alice } = await loadFixture(deployNftFixture);

      // Mint dummy NFT to Alice.
      await NftContract.safeMintImage(alice.address, textNft);

      // This test expects the counter variable stored in the contract to be 1
      // after NFT mint.
      expect(await NftContract.currentCounter()).to.equal(1);
      // This test expects the owner of NFT to be Alice.
      expect(await NftContract.ownerOf(0)).to.equal(alice.address);
      // This test expects the uri of NFT to be "dummy cid".
      expect(await NftContract.tokenURI(0)).to.equal(textNft);
    });

    it("Should return the Text NFT", async () => {
      const { NftContract, alice } = await loadFixture(deployNftFixture);

      // Mint dummy text NFT to Alice.
      await NftContract.safeMintText(alice.address, textNft);

      // This test expects the counter variable stored in the contract to be 1
      // after nft mint.
      expect(await NftContract.currentCounter()).to.equal(1);
      // This test expects the owner of NFT to be Alice.
      expect(await NftContract.ownerOf(0)).to.equal(alice.address);
      // // This test expects the text NFT to be "dummy cid".
      expect(await NftContract.readText(0)).to.equal(textNft);
    });
  });
});
