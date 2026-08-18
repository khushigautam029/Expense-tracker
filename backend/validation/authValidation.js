import Joi from "joi";
import { MESSAGES } from "../utils/setConstants.js";

const passwordSchema = Joi.string()
    .min(6)
    .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .required()
    .messages({
        "string.empty": MESSAGES.PASSWORD_REQUIRED,
        "any.required": MESSAGES.PASSWORD_REQUIRED,
        "string.min": MESSAGES.PASSWORD_MIN_LENGTH,
        "string.pattern.base": MESSAGES.PASSWORD_PATTERN
    });

export const registerSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.empty": MESSAGES.NAME_REQUIRED,
            "string.min": MESSAGES.NAME_MIN_LENGTH,
            "string.max": MESSAGES.NAME_MAX_LENGTH,
            "any.required": MESSAGES.NAME_REQUIRED
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": MESSAGES.INVALID_EMAIL,
            "string.empty": MESSAGES.EMAIL_REQUIRED,
            "any.required": MESSAGES.EMAIL_REQUIRED
        }),

    password: passwordSchema,

    confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": MESSAGES.PASSWORD_DOES_NOT_MATCH,
            "any.required":MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        }),

    gender: Joi.string()
        .valid("Male", "Female", "Other")
        .optional()
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required()
});

export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .required()
        .messages({
            "string.empty": MESSAGES.CURRENT_PASSWORD_IS_REQUIRED,
            "any.required": MESSAGES.CURRENT_PASSWORD_IS_REQUIRED
        }),

    newPassword: passwordSchema,

    confirmPassword: Joi.any()
        .valid(Joi.ref("newPassword"))
        .required()
        .messages({
            "any.only": MESSAGES.PASSWORD_DOES_NOT_MATCH,
            "any.required": MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        })
});


export const verifyOTPSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": MESSAGES.INVALID_EMAIL,
            "string.empty": MESSAGES.EMAIL_REQUIRED,
            "any.required": MESSAGES.EMAIL_REQUIRED,
        }),

    otp: Joi.string()
        .pattern(/^\d{6}$/)
        .required()
        .messages({
            "string.pattern.base": "OTP must be exactly 6 digits.",
            "string.empty": "OTP is required.",
            "any.required": "OTP is required.",
        }),
});

export const resendOTPSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": MESSAGES.INVALID_EMAIL,
            "string.empty": MESSAGES.EMAIL_REQUIRED,
            "any.required": MESSAGES.EMAIL_REQUIRED,
        }),
});