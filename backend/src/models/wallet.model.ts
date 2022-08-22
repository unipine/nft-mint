import mongoose, { Schema } from "mongoose";

export interface IWallet {
  user: [{ type: Schema.Types.ObjectId; ref: "user" }];
  publicKey: string;
  privateKey: string;
  createdAt: Date;
}

export interface IWalletResponse
  extends Omit<IWallet, "email" | "publicKey"> {}

export interface WalletDocument extends IWallet, mongoose.Document {}

const walletSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId },
    publicKey: { type: String },
    privateKey: { type: String },
  },
  {
    timestamps: true,
  }
);

const walletModel = mongoose.model<WalletDocument>("Wallet", walletSchema);

export default walletModel;
