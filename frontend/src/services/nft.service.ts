import axios from "axios";

import settings from "../config/settings";
import { makeUrl } from "../utils/ipfs";
import { authHeader, validateAuth } from "./auth.service";

export const mint = (formdata: any) => {
  const auth = authHeader();

  return axios
    .post(`${settings.BACKEND_URL}/nftmint`, formdata, {
      headers: { ...auth },
    })
    .then(validateAuth);
};

export const getNfts = () => {
  return axios.get(`${settings.BACKEND_URL}/nftmint`);
};

export const getMetadata = (cid: string) => {
  return axios.get(`${makeUrl(cid)}`);
};
