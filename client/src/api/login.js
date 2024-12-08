import { URL } from "./utils";

export const loginRequest = (username, password) => {
    return fetch(URL + "login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    });
};
