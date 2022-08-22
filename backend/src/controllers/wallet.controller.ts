import { Request, Response, NextFunction, Router } from "express";
import * as ethers from "ethers";
import crypto from "crypto";
import { omit } from "lodash";

import Controller from "../interfaces/controller";
import authMiddleware from "../middlewares/auth.middleware";
import walletModel from "../models/wallet.model";
import { IUser } from "../models/user.model";
import WalletAlreadyExistsException from "../exceptions/WalletAlreadyExistsException";
import WalletNotExistException from "../exceptions/WalletNotExistException";

class WalletController implements Controller {
  public path = "/wallet";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware, this.generate);
    this.router.get(`${this.path}`, authMiddleware, this.getByUser);
  }

  /**
   * Private Function that generate Ethereum wallet address
   */
  private generate = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const user = request.user as IUser;

    try {
      const wallet = await walletModel.findOne({ user });
      if (wallet) {
        throw new WalletAlreadyExistsException(user.email);
      }

      // Generate a random hex number and use it as a private key
      const id = crypto.randomBytes(32).toString("hex");
      const privateKey = "0x" + id;
      // Create wallet using generated private key
      const ethWallet = new ethers.Wallet(privateKey);
      // Get public key
      const publicKey = ethWallet.address;

      const newWallet = await walletModel.create({
        user,
        publicKey,
        privateKey,
      });

      const walletObj = omit(newWallet.toJSON(), ["user", "_id"]);

      response.send(walletObj);
    } catch (error) {
      next(error);
    }
  };

  private getByUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const user = request.user as IUser;

    try {
      const wallet = await walletModel.findOne({ user });
      if (!wallet) {
        throw new WalletNotExistException(user.email);
      }

      const walletObj = omit(wallet.toJSON(), ["user", "_id"]);

      response.send(walletObj);
    } catch (error) {
      next(error);
    }
  };
}

export default WalletController;
