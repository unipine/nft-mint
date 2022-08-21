import { cleanEnv, num, port, str } from "envalid";

function validateEnv() {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    MONGO_HOST: str(),
    MONGO_USER: str(),
    MONGO_PASS: str(),
    MONGO_DB: str(),
    JWT_SECRET: str(),
    PORT: port(),
    EXPIRES: num(),
  });
}

export default validateEnv;
