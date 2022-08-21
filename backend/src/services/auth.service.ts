import * as bcrypt from "bcrypt";
import * as cryptoRandomString from "crypto-random-string";
import { omit } from "lodash";

import settings from "../config/settings";
import userModel, { IUserResponse } from "../models/user.model";
import verifyModel from "../models/verify.model";
import TokenDataWithUser from "../interfaces/tokenDataWithUser";
import { CreateUserInput } from "../schemas/user.schema";
import TokenExpiredException from "../exceptions/TokenExpired";
import TokenNotExistException from "../exceptions/TokenNotExistException";
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

    const code = await cryptoRandomString({ length: 4, type: "numeric" });
    const token = await cryptoRandomString({ length: 16, type: "url-safe" });

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    user = await this.user.create({
      code,
      ...userData,
      email_verified: false,
      password: hashedPassword,
    });

    await verifyModel.create({
      email: userData.email,
      token,
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

  public async verifyToken(token: string) {
    const verify = await verifyModel.findOne({ token });

    if (!verify) throw new TokenNotExistException(token);
    const diff =
      (new Date(verify.createdAt).getTime() - new Date().getTime()) / 1000;

    if (diff > Number(settings.EXPIRES)) {
      throw new TokenExpiredException(verify.email, verify.token);
    }
    await this.user.findOneAndUpdate(
      { email: verify.email },
      { email_verified: true }
    );
    await verify.delete();
  }
}

export default AuthenticationService;
