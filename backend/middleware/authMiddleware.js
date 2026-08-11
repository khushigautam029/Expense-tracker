import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConflicts.js";

const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            success: false,
            message: MESSAGES.ACCESS_DENIED
        });
    }

    const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        process.env.JWT_SECRET
    );

    const user = await User.findByPk(decoded.id);
    if (!user) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            success: false,
            message: MESSAGES.USER_NOT_FOUND
        });
    }

    req.user = user;
    next();
});

export default authMiddleware;