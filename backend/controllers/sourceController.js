import { Source } from "../models/index.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConflicts.js";

export const getSources = async (req, res) => {
    try {

        const sources = await Source.findAll({
            order: [["name", "ASC"]],
        });

        res.status(STATUS_CODES.OK).json({
            success: true,
            sources,
        });

    } catch (error) {

        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });

    }
};

export const addSource = async (req, res) => {
    console.log("1. addSource controller reached");

    try {
        console.log("2. User ID:", req.user.id);
        console.log("3. Request body:", req.body);
        const { name } = req.body;
        console.log("4. Searching source...");
        const existing = await Source.findOne({
            where: {
                name,
                userId: req.user.id,
            },
        });

        console.log("5. Search completed");

        if (existing) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.SOURCE_ALREADY_EXIST,
            });
        }

        console.log("6. Creating source...");

        const source = await Source.create({
            name,
            userId: req.user.id,
        });

        console.log("7. Source created successfully");

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.SOURCE_ADDED_SUCCESSFULLY,
            source,
        });

    } catch (error) {
        console.error("SOURCE ERROR:", error);

        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};