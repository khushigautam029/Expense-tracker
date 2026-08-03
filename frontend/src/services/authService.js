import API from "../utils/api";

export const getProfile = async() =>{
    const response = await API.get("/auth/profile");
    return response.data;
}