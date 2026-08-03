import API from "../utils/api";

export const getDashboard = async (month) => {
    const response = await API.get("/dashboard", { params: { month } });
    return response.data;
}
