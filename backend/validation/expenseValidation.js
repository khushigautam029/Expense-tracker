import Joi from "joi";

export const expenseSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    amount: Joi.number().positive().required(),
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
        .required(),
    date: Joi.date().required(),
    notes: Joi.string().allow("").optional(),
});