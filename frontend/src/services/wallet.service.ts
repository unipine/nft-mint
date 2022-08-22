import axios from "axios";

import settings from "../config/settings";
import { authHeader, validateAuth } from "./auth.service";

export const generateWallet = () => {
  const auth = authHeader();

  return axios
    .post(
      `${settings.BACKEND_URL}/nftmint`,
      {},
      {
        headers: { ...auth },
      }
    )
    .then(validateAuth);
};
