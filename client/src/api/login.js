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
  return fetch(URL + "setup-create-authenticator", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const verifySetupOTPRequest = (otp) => {
  return fetch(URL + "setup-verify-otp", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otp }),
  });
};

export const verifyLoginOTPRequest = (otp, temp_token) => {
  console.log("Temp token: ", temp_token);
  console.log("OTP: ", otp);
  return fetch(URL + "login-verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otp, temp_token }),
  });
};
