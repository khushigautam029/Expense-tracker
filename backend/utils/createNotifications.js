import { Notification } from "../models/index.js";

const createNotification = async ({
    userId,
    title,
    message,
    type = "info",
}) => {
    try {
        return await Notification.create({
            userId,
            title,
            message,
            type,
        });
    } catch (error) {
        console.error("Notification creation error:", error.message);
        return null;
    }
};

export default createNotification;