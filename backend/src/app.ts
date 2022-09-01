import bodyParser from "body-parser";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";

import settings from "./config/settings";
import Controller from "./interfaces/controller";
import errorMiddleware from "./middlewares/error.middleware";
import logger from "./utils/logger";

class App {
  public app: express.Express;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.hostClient();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(settings.PORT, () => {
      logger.info(`Server is listening on the port ${settings.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors({ origin: "*" }));
    this.app.use(fileUpload({}));
    this.app.use(express.static(path.resolve(__dirname, "../client")));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(controller.router);
    });
  }

  private hostClient() {
    this.app.get("*", (_, res) => {
      res.sendFile(path.resolve(__dirname, "../client", "index.html"));
    });
  }

  private async connectToTheDatabase() {
    try {
      const { MONGO_HOST, MONGO_USER, MONGO_PASS, MONGO_DB, NODE_ENV } =
        settings;

      await mongoose.connect(
        `${NODE_ENV === "development" ? "mongodb" : "mongodb+srv"}://${
          MONGO_USER ? `${MONGO_USER}:${MONGO_PASS}@` : ""
        }${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`
      );
      logger.info("DB connected");
    } catch (error) {
      logger.error("Could not connect to db");
      process.exit(1);
    }
  }
}

export default App;
