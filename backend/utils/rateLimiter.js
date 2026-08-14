import rateLimit from "express-rate-limit";

//General API limiter
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        message: "Too many requests. Please try again later.",
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
        message: "Too many login attempts. Please try again after 15 minute."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default loginLimiter;

// OTP limiter
export const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,

    message: {
        success: false,
        message: "Too many OTP requests. Please try again later.",
    },

    standardHeaders: true,
    legacyHeaders: false,
});