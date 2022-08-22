import { Request, Response, NextFunction, Router } from "express";
import { NFTStorage, File } from "nft.storage";
import { Contract, Wallet, providers, BigNumber } from "ethers";
import { omit } from "lodash";

import settings from "../config/settings";
import Controller from "../interfaces/controller";
import UploadedFile from "../interfaces/uploadedFile";
import nftModel from "../models/nft.model";
import { UserDocument } from "../models/user.model";
import walletModel from "../models/wallet.model";
import validationMiddleware from "../middlewares/validation.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import { createNftSchema, CreateNftData } from "../schemas/nft.schema";
import WalletNotExistException from "../exceptions/WalletNotExistException";
import NotEnoughWalletBalanceException from "../exceptions/NotEnoughWalletBalanceException";
import WrongParamsException from "../exceptions/WrongParamsException";

import contract from "../contracts/TestNFT.json";
import contractAddress from "../contracts/contract-address.json";

class NftController implements Controller {
  public path = "/nftmint";
  public router = Router();
  private client = new NFTStorage({ token: settings.NFT_STORAGE_KEY });

  constructor() {
    this.initializeRoutes();
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
    const user = request.user as UserDocument;

    try {
      const userWallet = await walletModel.findOne({ user });
      if (!userWallet) {
        throw new WalletNotExistException(user.email);
      }

      // Create wallet provider with admin's wallet private key
      const provider = new providers.AlchemyProvider(
        settings.NETWORK,
        settings.ALCHEMY_API_KEY
      );
      const wallet = new Wallet(settings.ADMIN_WALLET, provider);
      const balance = await wallet.getBalance();

      // Require at least 3000000 gwei to mint NFT
      if (balance.lt(BigNumber.from(3000000))) {
        throw new NotEnoughWalletBalanceException(settings.ADMIN_WALLET);
      }

      // Create an instance of the contract
      const TestNft = new Contract(contractAddress.Nft, contract.abi, wallet);
      const nftId = await TestNft.currentCounter();
      let data;

      if (file.mimetype.startsWith("image")) {
        // Upload nft metadata to ipfs using nft.storage
        data = await this.client.store({
          name,
          description,
          image: new File(file.data, name, {
            type: file.mimetype,
          }),
        });

        // Mint Image NFT belonging to user
        await TestNft.connect(wallet).safeMintImage(
          userWallet.publicKey,
          data.ipnft
        );
      } else {
        // Mint Text NFT belonging to user
        data = file.data.toString();
        await TestNft.connect(wallet).safeMintImage(userWallet.publicKey, data);
      }

      const nft = await nftModel.create({
        user,
        wallet: userWallet,
        data,
        nftId,
      });
      const nftObj = omit(nft.toJSON(), ["user", "_id"]);

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
      if (typeof nftId === "number") {
        const TestNft = new Contract(contractAddress.Nft, contract.abi);
        const counter = await TestNft.currentCounter();

        if (nftId > counter) {
          const cid = await TestNft.tokenUri(nftId);

          response.send({ cid });
        } else {
          throw new WrongParamsException();
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
