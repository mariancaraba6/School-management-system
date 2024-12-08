import { getToken, URL } from "./utils";

export const getDetailsRequest = async () => {
    return fetch(URL + "student/details", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};

export const getGradesRequest = async () => {
    return fetch(URL + "student/grades", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    });
};
