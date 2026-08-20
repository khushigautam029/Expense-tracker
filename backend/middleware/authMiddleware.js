import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendError } from "../utils/responseHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return sendError(
            res,
            STATUS_CODES.UNAUTHORIZED,
            MESSAGES.ACCESS_DENIED
        );
    }

    let decoded;
    try {
        decoded = jwt.verify(
            authHeader.replace(/^Bearer\s+/i, ""),
            process.env.JWT_SECRET
        );
    } catch {
        return sendError(
            res,
            STATUS_CODES.UNAUTHORIZED,
            MESSAGES.YOUR_SESSION_IS_INVALID_OR_EXPIRED
        );
    }

    const user = await User.findByPk(decoded.id, {
        attributes: {
            exclude: [
                "password",
                "otp",
                "otpExpiry"
            ]
        }
    });

    if (!user) {
        return sendError(
            res,
            STATUS_CODES.UNAUTHORIZED,
            MESSAGES.USER_NOT_FOUND
        );
    }
    req.user = user;
    next();
});

export default authMiddleware;