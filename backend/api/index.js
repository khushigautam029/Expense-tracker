import app from "../app.js";
import sequelize from "../config/database.js";
import "../models/index.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

let initialized = false;

const initializeDatabase = async () => {
    if (initialized) {
        return;
    }
    await sequelize.authenticate();
    await sequelize.sync();
    initialized = true;
};

export default async function handler(req, res) {
    try {
        await initializeDatabase();
        return app(req, res);
    } catch (error) {
        console.error("❌ Database Connection Error:", error);
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: MESSAGES.DATABASE_CONNECTION_FAILED,
        });
    }
}