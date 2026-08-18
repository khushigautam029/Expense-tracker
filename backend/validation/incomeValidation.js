import Joi from "joi";
import { MESSAGES } from "../utils/setConstants.js";

export const incomeSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": MESSAGES.INCOME_TITLE_REQUIRED,
            "string.min": MESSAGES.INCOME_TITLE_MUST_BE_AT_LEAST_3_CHAR,
            "string.max": MESSAGES.INCOME_TITLE_CANNOT_EXCEED_100_CHARACTER,
            "any.required": MESSAGES.INCOME_TITLE_REQUIRED,
        }),

    amount: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": MESSAGES.AMOUNT_MUST_BE_A_VALID_NUMBER,
            "number.min": MESSAGES.AMOUNT_CANNOT_BE_NEGATIVE,
            "any.required": MESSAGES.AMOUNT_IS_REQUIRED,
        }),

    sourceId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": MESSAGES.SOURCE_MUST_BE_VALID,
            "number.integer": MESSAGES.SOURCE_MUST_BE_VALID,
            "number.positive": MESSAGES.SOURCE_MUST_BE_VALID,
            "any.required": MESSAGES.SOURCE_REQUIRED,
        }),

    date: Joi.date()
        .required()
        .messages({
            "date.base": MESSAGES.INVALID_DATE,
            "any.required": MESSAGES.INCOME_DATE_IS_REQUIRED,
        }),

    notes: Joi.string()
        .allow("")
        .optional(),
});