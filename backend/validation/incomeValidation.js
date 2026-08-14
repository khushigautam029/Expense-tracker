import Joi from "joi";

export const incomeSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    amount: Joi.number().min(0).required(),
    sourceId: Joi.number().integer().positive().required().messages({
        "number.base": "Please select a valid source",
        "any.required": "Source is required",
    }), date: Joi.date().required(),
    notes: Joi.string().allow("").optional(),
});