import { Request, Response, NextFunction, Router } from "express";
import { NFTStorage, File } from "nft.storage";
import { Wallet, providers } from "ethers";
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
    // this.router.get(
    //   `${this.path}`,
    //   this.getAll
    // );
    // this.router.post(
    //   `${this.path}/verifyToken`,
    //   this.getById
    // );
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
      const wallet = await walletModel.findOne({ user });
      if (!wallet) {
        throw new WalletNotExistException(user.email);
      }

      // upload nft metadata to ipfs using nft.storage
      const metadata = await this.client.store({
        name,
        description,
        image: new File(file.data, name, {
          type: file.mimetype,
        }),
      });

      // create wallet provider with user's wallet private key
      const provider = new providers.AlchemyProvider(
        settings.NETWORK,
        settings.ALCHEMY_API_KEY
      );
      const ethWallet = new Wallet(wallet.private_key, provider);

      const nft = await nftModel.create({
        user,
        metadata: metadata,
      });

      response.send(metadata);
    } catch (error) {
      next(error);
    }
  };
}

export default NftController;
