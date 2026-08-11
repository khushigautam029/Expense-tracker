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

        // Don't stop the main operation if notification creation fails
        return null;
    }
};

export default createNotification;