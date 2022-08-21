import TokenData from './tokenData';
import { IUserResponse } from "../models/user.model";

interface TokenDataWithUser extends TokenData {
  user: IUserResponse
}

export default TokenDataWithUser;
