import { Source } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

export const getSources = asyncHandler(async (req, res) => {
    const sources = await Source.findAll({
        order: [["name", "ASC"]],
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.SOURCES_FETCHED,
        { sources }
    );
});

export const addSource = asyncHandler(async (req, res) => {
    const { error, value } = sourceSchema.validate(req.body);
    if (error) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.details[0].message
        );
    }

    const { name } = value;
    const existingSource = await Source.findOne({
        where: {
            name: {
                [Op.like]: name,
            },
        },
    });
    if (existingSource) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            MESSAGES.SOURCE_ALREADY_EXIST
        );
    }

    const source = await Source.create({
        name,
    });
    return sendSuccess(
        res,
        STATUS_CODES.CREATED,
        MESSAGES.SOURCE_ADDED_SUCCESSFULLY,
        { source }
    );
});