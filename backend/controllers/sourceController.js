import { Source } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConflicts.js";

export const getSources = asyncHandler(async (req, res) => {
    const sources = await Source.findAll({
        order: [["name", "ASC"]],
    });

    res.status(STATUS_CODES.OK).json({
        success: true,
        sources,
    });
});

export const addSource = asyncHandler(async (req, res) => {
    const { name } = req.body;
    console.log("4. Searching source...");
    const existing = await Source.findOne({
        where: {
            name,
        },
    });


    if (existing) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: MESSAGES.SOURCE_ALREADY_EXIST,
        });
    }


    const source = await Source.create({
        name,
        userId: req.user.id,
    });


    return res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.SOURCE_ADDED_SUCCESSFULLY,
        source,
    });
});