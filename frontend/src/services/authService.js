import API from "../utils/api";

export const getProfile = async() =>{
    const response = await API.get("/auth/profile");
    return response.data;
}

export const verifyOTP = async (data) => {
    const response = await API.post(
        "/auth/verify-otp",
        data
    );

    return response.data;
};