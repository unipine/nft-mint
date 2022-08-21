import "dotenv/config";
import "module-alias/register";

import App from "./app";
import AuthController from "./controllers/auth.controller";
import WalletController from "./controllers/wallet.controller";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([
  new AuthController(),
  new WalletController(),
]);

app.listen();
