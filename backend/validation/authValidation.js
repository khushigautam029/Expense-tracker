import Joi from "joi";
import { MESSAGES } from "../utils/setConflicts.js";

export const registerSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.empty": MESSAGES.NAME_REQUIRED,
            "string.min": MESSAGES.NAME_MIN_LENGTH,
            "string.max": MESSAGES.NAME_MAX_LENGTH,
            "any.required": MESSAGES.NAME_REQUIRED,
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": MESSAGES.INVALID_EMAIL,
            "string.empty": MESSAGES.EMAIL_REQUIRED,
            "any.required": MESSAGES.EMAIL_REQUIRED
    }),

    password: Joi.string()
        .min(6)
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        )
        .required()
        .messages({
            "string.pattern.base":
                MESSAGES.PASSWORD_PATTERN
        }),

    confirmPassword: Joi.any()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Passwords do not match"
        }),

    gender: Joi.string().valid("Male", "Female", "Other").optional(),
});


export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .required()
});