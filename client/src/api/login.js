import { URL } from "./utils";

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
