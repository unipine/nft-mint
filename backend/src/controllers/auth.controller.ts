import { Request, Response, NextFunction, Router } from "express";

import Controller from "../interfaces/controller";
import RequestWithUser from "../interfaces/requestWithUser";
import validationMiddleware from "../middlewares/validation.middleware";
import authMiddleware from "../middlewares/auth.middleware";
import AuthenticationService from "../services/auth.service";
import {
  emailLoginSchema,
  EmailLoginInput,
} from "../schemas/auth.schema";
import { createUserSchema, CreateUserInput } from "../schemas/user.schema";

class AuthController implements Controller {
  public path = "/auth";
  public router = Router();
  public authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(createUserSchema),
      this.registration
    );
    this.router.post(
      `${this.path}/loginWithEmail`,
      validationMiddleware(emailLoginSchema),
      this.loggingIn
    );
    this.router.post(
      `${this.path}/refreshToken`,
      authMiddleware,
      this.refreshToken
    );
  }

  private registration = async (
    request: Request<{}, {}, CreateUserInput["body"]>,
    response: Response,
    next: NextFunction
  ) => {
    const userData = request.body;

    try {
      const tokenData = await this.authenticationService.register(
        userData,
        request.headers.origin
      );

      response.send(tokenData);
    } catch (error) {
      next(error);
    }
  };

  private loggingIn = async (
    request: Request<{}, {}, EmailLoginInput["body"]>,
    response: Response,
    next: NextFunction
  ) => {
    const logInData = request.body;

    try {
      const tokenData = await this.authenticationService.login(
        logInData.email,
        logInData.password
      );

      response.send(tokenData);
    } catch (error) {
      next(error);
    }
  };

  private refreshToken = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    const user = request.user;

    try {
      const tokenData = await this.authenticationService.refreshToken(user);

      response.send(tokenData);
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
