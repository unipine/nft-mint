import axios from "axios";

import settings from "../config/settings";
import { authHeader, validateAuth } from "./auth.service";

export const mint = (formdata: any) => {
  const auth = authHeader();

  return axios
    .post(`${settings.BACKEND_URL}/nftmint`, formdata, {
      headers: { ...auth },
    })
    .then(validateAuth);
};

export const login = (email: string, password: string) => {
  return axios
    .post(`${settings.BACKEND_URL}/auth/loginWithEmail`, {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};
