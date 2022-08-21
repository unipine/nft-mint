import mongoose, { Schema } from "mongoose";

export interface INft {
  user: [{ type: Schema.Types.ObjectId; ref: "user" }];
  wallet: [{ type: Schema.Types.ObjectId; ref: "wallet" }];
  metadata: Object;
  cid: string;
  createdAt: Date;
}

export interface INftResponse extends Omit<INft, "email" | "public_key"> {}

export interface NftDocument extends INft, mongoose.Document {}

const nftSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId },
    wallet: { type: Schema.Types.ObjectId },
    metadata: { type: Object },
    cid: { type: String },
  },
  {
    timestamps: true,
  }
);

const nftModel = mongoose.model<NftDocument>("Nft", nftSchema);

export default nftModel;
