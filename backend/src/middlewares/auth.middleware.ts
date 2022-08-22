import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import AuthenticationTokenMissingException from "../exceptions/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";
import DataStoredInToken from "../interfaces/dataStoredInToken";
import RequestWithUser from "../interfaces/requestWithUser";
import settings from "../config/settings";
import userModel from "../models/user.model";

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  let token = request.headers["authorization"];
  if (token && token.startsWith("Bearer ")) token = token.substring(7);

  if (token) {
    const secret = settings.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(
        token,
        secret
      ) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await userModel.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}

export default authMiddleware;
