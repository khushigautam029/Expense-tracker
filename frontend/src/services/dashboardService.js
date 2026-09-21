import API from "../utils/api";

export const getDashboard = async (month) => {
    const response = await API.get("/dashboard", {
        params: month ? { month } : {},
    });
    return response.data;
}
