import API from "../utils/api";

export const getSources = async () => {
    const response = await API.get("/sources");
    return response.data.sources;
};