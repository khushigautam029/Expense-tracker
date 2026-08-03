import Joi from "joi";

export const incomeSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    amount: Joi.number().positive().required(),
    source: Joi.string().min(2).max(50).required(),
    date: Joi.date().required(),
    notes: Joi.string().allow("").optional(),
});