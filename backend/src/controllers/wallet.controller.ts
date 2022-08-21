import { Request, Response, NextFunction, Router } from "express";
import * as ethers from "ethers";
import * as crypto from "crypto";
import { omit } from "lodash";

import Controller from "../interfaces/controller";
import authMiddleware from "../middlewares/auth.middleware";
import walletModel from "../models/wallet.model";
import { UserDocument } from "../models/user.model";
import WalletAlreadyExistsException from "../exceptions/WalletAlreadyExistsException";

class WalletController implements Controller {
  public path = "/wallet";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware, this.generate);
    this.router.get(`${this.path}`, authMiddleware, this.getByUser);
    // this.router.post(
    //   `${this.path}/verifyToken`,
    //   this.getById
    // );
  }

  private generate = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const user = request.user as UserDocument;

    try {
      const wallet = await walletModel.findOne({ user });
      if (wallet) {
        throw new WalletAlreadyExistsException(user.email);
      }

      const id = crypto.randomBytes(32).toString("hex");
      const private_key = "0x" + id;
      const ethWallet = new ethers.Wallet(private_key);
      const public_key = ethWallet.address;

      const newWallet = await walletModel.create({
        user,
        public_key,
        private_key,
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
    const user = request.user as UserDocument;

    try {
      const wallet = await walletModel.findOne({ user });

      const walletObj = omit(wallet.toJSON(), ["user", "_id"]);

      response.send(walletObj);
    } catch (error) {
      next(error);
    }
  };
}

export default WalletController;
