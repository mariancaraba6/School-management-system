import { getToken, URL } from "./utils";

export const getDetailsRequest = async () => {
  return fetch(URL + "professor/details", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};
