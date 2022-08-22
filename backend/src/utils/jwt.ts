import jwt from "jsonwebtoken";

import settings from "../config/settings";
import { UserDocument } from "../models/user.model";
import TokenData from "../interfaces/tokenData";
import DataStoredInToken from "../interfaces/dataStoredInToken";

export function createToken(user: UserDocument): TokenData {
  const expiresIn = Number(settings.EXPIRES);
  const secret = settings.JWT_SECRET;
  const dataStoredInToken: DataStoredInToken = {
    _id: user._id,
  };
  return {
    expiresIn,
    token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
  };
}
