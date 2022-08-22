import axios from "axios";

import settings from "../config/settings";
import { authHeader, validateAuth } from "./auth.service";

export const generateWallet = () => {
  const auth = authHeader();

  return axios
    .post(
      `${settings.BACKEND_URL}/wallet`,
      {},
      {
        headers: { ...auth },
      }
    )
    .then(validateAuth);
};

export const getWallet = () => {
  const auth = authHeader();

  return axios.get(`${settings.BACKEND_URL}/wallet`, { headers: { ...auth } });
};
