import mongoose, { Schema } from "mongoose";

export interface INft {
  user: [{ type: Schema.Types.ObjectId; ref: "user" }];
  wallet: [{ type: Schema.Types.ObjectId; ref: "wallet" }];
  data: any;
  type: string;
  nftId: number;
}

export interface INftResponse extends Omit<INft, "email" | "publicKey"> {}

export interface NftDocument extends INft, mongoose.Document {}

const nftSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId },
    wallet: { type: Schema.Types.ObjectId },
    data: { type: Object },
    type: { type: String },
    nftId: { type: Number },
  },
  {
    timestamps: true,
  }
);

const nftModel = mongoose.model<NftDocument>("Nft", nftSchema);

export default nftModel;
