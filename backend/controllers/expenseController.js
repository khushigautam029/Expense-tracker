import { Op } from "sequelize";
import { Expense } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import createNotification from "../utils/createNotifications.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConflicts.js";
import { expenseSchema } from "../validation/expenseValidation.js";


const getMonthFilter = (month) => {
    if (!month) return {};
    const year = Number(month.slice(0, 4));
    const monthNumber = Number(month.slice(5, 7));
    const lastDay = new Date(year, monthNumber, 0).getDate();
    return { date: { [Op.between]: [`${month}-01`, `${month}-${String(lastDay).padStart(2, "0")}`] } };
};

export const addExpense = asyncHandler(async (req, res) => {
    req.body.category =
        req.body.category.charAt(0).toUpperCase() +
        req.body.category.slice(1).toLowerCase();

    const { error } = expenseSchema.validate(req.body);

    if (error) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: error.details[0].message,
        });
    }

    const { title, amount, category, date, notes } = req.body;

    const expense = await Expense.create({
        title,
        amount,
        category,
        date,
        notes,
        userId: req.user.id,
    });

    await createNotification({
        userId: req.user.id,
        title: "Expense Added",
        message: `You added an expense of ₹${amount} for ${category}.`,
        type: "expense",
    });

    res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.EXPENSE_ADDED,
    });
});

export const getAllExpenses = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const { month } = req.query;
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order || "DESC";

    const offset = (page - 1) * limit;

    const where = {
        userId: req.user.id,
        ...getMonthFilter(month),
    };

    if (search) {
        where.title = {
            [Op.like]: `%${search}%`,
        };
    }

    if (category) {
        where.category = category;
    }

    const { count, rows } = await Expense.findAndCountAll({
        where,
        order: [[sortBy, order]],
        limit,
        offset,
    });

    res.status(STATUS_CODES.OK).json({
        success: true,
        totalExpenses: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        expenses: rows,
    });
});

export const getExpenseById = asyncHandler(async (req, res) => {
    const expense = await Expense.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!expense) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: MESSAGES.EXPENSE_NOT_FOUND,
        });
    }

    res.status(STATUS_CODES.OK).json({
        success: true,
        expense,
    });
});

export const updateExpense = asyncHandler(async (req, res) => {
    const { error } = expenseSchema.validate(req.body);

    if (error) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: error.details[0].message,
        });
    }

    const expense = await Expense.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!expense) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: MESSAGES.EXPENSE_NOT_FOUND,
        });
    }

    await expense.update(req.body);

    await createNotification({
        userId: req.user.id,
        title: "Expense Updated",
        message: `Your expense "${expense.title}" was updated successfully.`,
        type: "info",
    });

    res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.EXPENSE_UPDATED,
        expense,
    });
});

export const deleteExpense = asyncHandler(async (req, res) => {
    const expense = await Expense.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!expense) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: MESSAGES.EXPENSE_NOT_FOUND,
        });
    }

    await expense.destroy();

    await createNotification({
        userId: req.user.id,
        title: "Expense Deleted",
        message: `Your expense "${expense.title}" was deleted successfully.`,
        type: "warning",
    });

    res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.EXPENSE_DELETED,
    });
});