import API from "../utils/api";

export const resendOTP = async (email) => {
    const response = await API.post("/auth/resend-otp", {
        email,
    });

    return response.data;
};