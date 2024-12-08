const URL = "http://127.0.0.1:5000/api/";

export const getToken = () => {
    return sessionStorage.getItem("token");
};

export const setToken = (token) => {
    sessionStorage.setItem("token", token);
};

export { URL };
