import mongoose from "mongoose";

export interface IUser {
  email: string;
  name: string;
  password: string;
  createAt: Date;
  updatedAt: Date;
}

export interface IUserResponse extends Omit<IUser, "password" | "code"> {}

export interface UserDocument extends IUser, mongoose.Document {}

const userSchema = new mongoose.Schema(
  {
    email: { type: String },
    name: { type: String },
    password: { type: String },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model<UserDocument>("User", userSchema);

export default userModel;
