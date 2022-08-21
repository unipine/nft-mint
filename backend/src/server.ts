import "dotenv/config";
import "module-alias/register";

import App from "./app";
import AuthController from "./controllers/auth.controller";
import validateEnv from "./utils/validateEnv";

validateEnv();

const app = new App([new AuthController()]);

app.listen();
