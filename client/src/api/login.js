import { getToken, URL } from "./utils";

export const loginRequest = (email, password) => {
  return fetch(URL + "login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
};

export const verifyAccountRequest = () => {
  return fetch(URL + "verify-account", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const enableTwoFactorAuthRequest = () => {
  return fetch(URL + "setup-otp", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const verifyOTPRequest = (otp) => {
  return fetch(URL + "verify-otp", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otp }),
  });
};
