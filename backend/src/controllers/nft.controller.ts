import { Request, Response, NextFunction, Router } from "express";
import { NFTStorage, File } from "nft.storage";
import { Contract, Wallet, providers, BigNumber } from "ethers";
import { omit } from "lodash";
import { v4 as uuidv4 } from "uuid";

import settings from "../config/settings";
import Controller from "../interfaces/controller";
import UploadedFile from "../interfaces/uploadedFile";
import nftModel from "../models/nft.model";
import { IUser } from "../models/user.model";
import walletModel from "../models/wallet.model";
import validationMiddleware from "../middlewares/validation.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { createNftSchema, CreateNftData } from "../schemas/nft.schema";
import WalletNotExistException from "../exceptions/WalletNotExistException";
import NotEnoughWalletBalanceException from "../exceptions/NotEnoughWalletBalanceException";
import WrongParamsException from "../exceptions/WrongParamsException";
import WrongFileException from "../exceptions/WrongFileException";

import contract from "../contracts/TestNFT.json";
import contractAddress from "../contracts/contract-address.json";

class NftController implements Controller {
  public path = "/nftmint";
  public router = Router();
  private client = new NFTStorage({ token: settings.NFT_STORAGE_KEY });
  private wallet: Wallet;
  private TestNft: Contract;

  constructor() {
    this.initializeRoutes();
    this.initializeAdminWallet();
    this.initializeContract();
  }

  private initializeAdminWallet() {
    // Create wallet provider with admin's wallet private key
    const provider = new providers.AlchemyProvider(
      settings.NETWORK,
      settings.ALCHEMY_API_KEY
    );
    this.wallet = new Wallet(settings.ADMIN_WALLET, provider);
  }

  private initializeContract() {
    // Create contract instance
    this.TestNft = new Contract(contractAddress.Nft, contract.abi, this.wallet);
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      validationMiddleware(createNftSchema),
      authMiddleware,
      this.mint
    );
    this.router.get(`${this.path}`, this.getAllNfts);
    this.router.get(`${this.path}/:nftId`, this.getById);
  }

  /**
   * Private Function that mint NFT
   */
  private mint = async (
    request: Request<{}, {}, CreateNftData["body"]>,
    response: Response,
    next: NextFunction
  ) => {
    const { name, description } = request.body;
    const file: UploadedFile = request.files.file as unknown as UploadedFile;
    const user = request.user as IUser;

    try {
      const userWallet = await walletModel.findOne({ user });
      if (!userWallet) {
        throw new WalletNotExistException(user.email);
      }

      const balance = await this.wallet.getBalance();

      // Require at least 3000000 gwei to mint NFT
      if (balance.lt(BigNumber.from(3000000))) {
        throw new NotEnoughWalletBalanceException(settings.ADMIN_WALLET);
      }

      // Create an instance of the contract
      const nftId = await this.TestNft.currentCounter();
      let data, type;

      if (file.mimetype.startsWith("image")) {
        // Upload nft metadata to ipfs using nft.storage
        const uuid = uuidv4();
        data = await this.client.store({
          name,
          description,
          image: new File([file.data as BlobPart], uuid, {
            type: file.mimetype,
          }),
        });
        type = "image";

        // Mint Image NFT belonging to user
        await this.TestNft.safeMintImage(userWallet.publicKey, data.ipnft);
      } else if (file.mimetype.startsWith("text") && file.size <= 1024) {
        data = {
          name,
          description,
          data: file.data.toString(),
        };
        type = "text";

        // Mint Text NFT belonging to user using mapping
        // await this.TestNft.safeMintImage(userWallet.publicKey, data.data);

        // Mint Text NFT belonging to user using TextStorage
        await this.TestNft.safeMintText(userWallet.publicKey, data.data);
      } else {
        throw new WrongFileException();
      }

      const nft = await nftModel.create({
        user,
        wallet: userWallet,
        data: {
          ...data,
          type,
        },
        nftId,
      });
      const nftObj = omit(nft.toJSON(), ["_id", "user", "wallet"]);

      response.send(nftObj);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Private Function that get all NFTs from database
   */
  private getAllNfts = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      // Get all NFTs from database for better UX than get from Smart Contract
      const nfts = await nftModel.find();
      const nftArrs = nfts.map((nft) =>
        omit(nft.toJSON(), ["user", "wallet", "_id"])
      );

      response.send(nftArrs);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Private Function that get NFT from Smart Contract using NFT ID
   */
  private getById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { nftId } = request.params;

    try {
      const counter = await this.TestNft.currentCounter();

      if (counter.gt(BigNumber.from(nftId))) {
        const nft = await nftModel.findOne({ nftId: nftId });

        if (nft.type === "image") {
          // Get NFT cid if nft type is image
          const cid = await this.TestNft.tokenURI(nftId);
          response.send({ cid });
        } else {
          // Get NFT text if nft type is text when using TextStroage
          const text = await this.TestNft.readText(nftId);
          response.send({ text });
        }
      } else {
        throw new WrongParamsException();
      }
    } catch (error) {
      next(error);
    }
  };
}

export default NftController;
