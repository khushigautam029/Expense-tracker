import Joi from "joi";
import { MESSAGES } from "../utils/setConflicts.js";

export const expenseSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": MESSAGES.EXPENSE_TITLE_REQUIRED,
            "string.min": MESSAGES.EXPENSE_TITLE_MUST_BE_AT_LEAST_3_CHAR,
            "string.max": MESSAGES.EXPENSE_TITLE_CANNOT_EXCEED_100_CHARACTER,
            "any.required": MESSAGES.EXPENSE_TITLE_REQUIRED,
        }),

    amount: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": MESSAGES.AMOUNT_MUST_BE_A_VALID_NUMBER,
            "number.min": MESSAGES.AMOUNT_CANNOT_BE_NEGATIVE,
            "any.required": MESSAGES.AMOUNT_IS_REQUIRED,
        }),

    category: Joi.string()
        .valid(
            "Food",
            "Travel",
            "Shopping",
            "Bills",
            "Health",
            "Education",
            "Entertainment",
            "Investment",
            "Others"
        )
        .required()
        .messages({
            "any.only": "Category must be one of [Food, Travel, Shopping, Bills, Health, Education, Entertainment, Investment, Others",
            "string.empty": MESSAGES.CATEGORY_REQUIRED,
            "any.required": MESSAGES.CATEGORY_REQUIRED,
        }),

    date: Joi.date()
        .required()
        .messages({
            "date.base": MESSAGES.INVALID_DATE,
            "any.required": MESSAGES.EXPENSE_DATE_IS_REQUIRED,
        }),

    notes: Joi.string()
        .allow("")
        .optional(),
});