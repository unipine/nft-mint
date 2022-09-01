import dotenv from "dotenv";
import "module-alias/register";

dotenv.config();

import App from "./app";
import AuthController from "./controllers/auth.controller";
import NftController from "./controllers/nft.controller";
import WalletController from "./controllers/wallet.controller";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([
  new AuthController(),
  new NftController(),
  new WalletController(),
]);

app.listen();
