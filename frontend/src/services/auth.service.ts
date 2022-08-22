import axios, { AxiosResponse } from "axios";

import eventBus from "../common/EventBus";
import settings from "../config/settings";
import { IUserWithToken } from "../types/user";

export const register = (email: string, password: string) => {
  return axios.post(`${settings.BACKEND_URL}/auth/register`, {
    email,
    password,
  });
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

export const refreshToken = () => {
  const user: IUserWithToken = getCurrentUser();
  const auth = authHeader();

  if (!user) return undefined;

  return axios
    .post(
      `${settings.BACKEND_URL}/auth/refreshToken`,
      {
        token: user.token,
      },
      { headers: { ...auth } }
    )
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    })
    .catch((error) => {
      eventBus.dispatch("logout");

      return false;
    });
};

export const validateAuth = (response: AxiosResponse) => {
  response.status === 401 && eventBus.dispatch("logout");
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
};

export const authHeader = () => {
  const userStr = localStorage.getItem("user");
  let user = null;
  if (userStr) user = JSON.parse(userStr);

  if (user && user.token) {
    return { Authorization: "Bearer " + user.token };
  } else {
    return { Authorization: "" };
  }
};
