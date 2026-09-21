import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    // console.log("TOKEN:", token);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => {
        const url = response.config.url || "";
        const method = response.config.method?.toLowerCase();

        // Income and expense changes create a notification on the server.
        // Let the shared header refresh its badge immediately, rather than
        // waiting for the notification menu to be opened.
        if (
            method !== "get" &&
            (url.startsWith("/income") || url.startsWith("/expenses"))
        ) {
            window.dispatchEvent(new Event("notifications:changed"));
        }

        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    }
);

export default API;
