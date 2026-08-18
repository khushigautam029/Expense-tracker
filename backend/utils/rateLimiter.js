import rateLimit from "express-rate-limit";
import { MESSAGES } from "./setConstants.js";
//General API limiter
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        message: MESSAGES.TOO_MANY_REQUEST
    },
    standardHeaders: true,
    legacyHeaders: false,
});


//login limiter
const loginLimiter = rateLimit({
    windowMs:  5* 60 * 1000, // 5 minute
    max: 20,              // only 10 requests per 5 minute
    message: {
        success: false,
        message: MESSAGES.TOO_MANY_LOGIN_ATTEMPT
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default loginLimiter;

// OTP limiter
export const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,

    message: {
        success: false,
        message: MESSAGES.TOO_MANY_OTP_REQUESTS,
    },

    standardHeaders: true,
    legacyHeaders: false,
});