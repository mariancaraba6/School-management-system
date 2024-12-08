const URL = "http://127.0.0.1:5000/api/";

export const getToken = () => {
    return sessionStorage.getItem("token");
};

export const getAuthorizationField = () => ({
    Authorization: "Bearer " + getToken(),
});

export { URL };
