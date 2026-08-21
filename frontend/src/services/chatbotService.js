import API from "../utils/api";

export const getChatHistory = async () => {
    const response = await API.get("/chatbot/history");
    return response.data;
};

export const sendChatMessage = async (message) => {
    const response = await API.post("/chatbot/message",{
        message,
    });
    return response.data;
};