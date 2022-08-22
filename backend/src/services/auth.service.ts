import bcrypt from "bcrypt";
import { omit } from "lodash";

import userModel, { IUserResponse, UserDocument } from "../models/user.model";
import TokenDataWithUser from "../interfaces/tokenDataWithUser";
import { CreateUserInput } from "../schemas/user.schema";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import { createToken } from "../utils/jwt";

class AuthenticationService {
  public user = userModel;

  public async register(
    userData: CreateUserInput["body"],
    host: string
  ): Promise<TokenDataWithUser> {
    let user = await this.user.findOne({ email: userData.email });
    if (user) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    user = await this.user.create({
      ...userData,
      email_verified: false,
      password: hashedPassword,
    });

    const userObj = omit(user.toJSON(), ["password", "code"]);

    return {
      ...createToken(user),
      user: userObj as IUserResponse,
    };
  }

  public async login(
    email: string,
    password: string
  ): Promise<TokenDataWithUser> {
    const user = await userModel.findOne({ email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        password,
        user.get("password", null, { getters: false })
      );
      if (isPasswordMatching) {
        return {
          ...createToken(user),
          user: omit(user.toJSON(), ["password", "code"]) as IUserResponse,
        };
      } else {
        throw new WrongCredentialsException();
      }
    } else {
      throw new WrongCredentialsException();
    }
  }

  public async refreshToken(user: UserDocument) {
    return {
      ...createToken(user),
      user: omit(user.toJSON(), ["password", "code"]) as IUserResponse,
    };
  }
}

export default AuthenticationService;
