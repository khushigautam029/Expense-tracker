import API from "../utils/api";

export const getProfile = async () => {
    const response = await API.get("/auth/profile");
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await API.put("/auth/update-profile", data);
    return response.data;
};

export const changePassword = async (data) => {
    const response = await API.put(
        "/auth/change-password",
        data
    );

    return response.data;
};