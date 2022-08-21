import mongoose, { Schema } from "mongoose";

export interface IWallet {
  user: [{ type: Schema.Types.ObjectId; ref: "user" }];
  public_key: string;
  private_key: string;
  createdAt: Date;
}

export interface IWalletResponse
  extends Omit<IWallet, "email" | "public_key"> {}

export interface WalletDocument extends IWallet, mongoose.Document {}

const walletSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId },
    public_key: { type: String },
    private_key: { type: String },
  },
  {
    timestamps: true,
  }
);

const walletModel = mongoose.model<WalletDocument>("Wallet", walletSchema);

export default walletModel;
