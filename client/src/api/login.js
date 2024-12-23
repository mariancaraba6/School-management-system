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
