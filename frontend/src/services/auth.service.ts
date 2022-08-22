import axios from "axios";

import settings from "../config/settings";

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

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
};
