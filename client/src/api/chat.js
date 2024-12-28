import { getToken, URL } from "./utils";

export const getChatMessagesRequest = async () => {
  return fetch(URL + "chat/messages", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const sendMessageRequest = async (receiver_id, message) => {
  return fetch(URL + "chat/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ receiver_id, message }),
  });
};
