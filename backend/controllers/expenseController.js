import { Op } from "sequelize";
import { Expense } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import createNotification from "../utils/createNotifications.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";
import { transactionHandler } from "../utils/transactionHandler.js";
import { expenseSchema } from "../validation/expenseValidation.js";

const getMonthFilter = (month) => {
    if (!month) return {};
    const year = Number(month.slice(0, 4));
    const monthNumber = Number(month.slice(5, 7));
    const lastDay = new Date(year, monthNumber, 0).getDate();
    return {
        date: {
            [Op.between]: [
                `${month}-01`,
                `${month}-${String(lastDay).padStart(2, "0")}`,
            ],
        },
    };
};

export const addExpense = asyncHandler(async (req, res) => {
    const { error, value } = expenseSchema.validate(req.body);
    if (error) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.message
        );
    }

    const { title, amount, category, date, notes } = value;
    const userId = req.user.id;

    await transactionHandler(async (transaction) => {
        await Expense.create(
            {
                title,
                amount,
                category,
                date,
                notes,
                userId,
            },
            { transaction }
        );
        await createNotification(
            {
                userId,
                title: "Expense Added",
                message: `You added an expense of ₹${amount} for ${category}.`,
                type: "expense",
            },
            { transaction }
        );
    });
    return sendSuccess(
        res,
        STATUS_CODES.CREATED,
        MESSAGES.EXPENSE_ADDED
    );
});

export const getAllExpenses = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const {
        page = 1,
        limit = 5,
        search = "",
        category = "",
        month,
        sortBy = "createdAt",
        order = "DESC",
    } = req.query;

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.max(Number(limit) || 5, 1);
    const offset = (currentPage - 1) * pageLimit;

    const allowedSortFields = [
        "id",
        "title",
        "amount",
        "category",
        "date",
        "createdAt",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    const safeOrder = order.toUpperCase() === "ASC"
        ? "ASC"
        : "DESC";

    const where = {
        userId,
        ...getMonthFilter(month),
    };
    if (search.trim()) {
        where.title = {
            [Op.like]: `%${search.trim()}%`,
        };
    }

    if (category.trim()) {
        where.category = category.trim();
    }

    const { count, rows: expenses } = await Expense.findAndCountAll({
        where,
        order: [[safeSortBy, safeOrder]],
        limit: pageLimit,
        offset,
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.EXPENSE_FETCHED,
        {
            totalExpenses: count,
            totalPages: Math.ceil(count / pageLimit),
            currentPage,
            expenses,
        }
    );
});

export const getExpenseById = asyncHandler(async (req, res) => {
    const expense = await Expense.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!expense) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.EXPENSE_NOT_FOUND
        );
    }

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.EXPENSE_FETCHED,
        { expense }
    );
});

export const updateExpense = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { error, value } = expenseSchema.validate(req.body);
    if (error) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.details[0].message
        );
    }

    const expense = await Expense.findOne({
        where: {
            id: req.params.id,
            userId,
        },
    });

    if (!expense) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.EXPENSE_NOT_FOUND
        );
    }

    await transactionHandler(async (transaction) => {
        await expense.update(value, { transaction });
        await createNotification(
            {
                userId: req.user.id,
                title: "Expense Updated",
                message: `Your expense "${expense.title}" was updated successfully.`,
                type: "info",
            },
            { transaction }
        );
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.EXPENSE_UPDATED,
        { expense }
    );
});

export const deleteExpense = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const expense = await Expense.findOne({
        where: {
            id: req.params.id,
            userId,
        },
    });

    if (!expense) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.EXPENSE_NOT_FOUND
        );
    }

    const expenseTitle = expense.title;
    await transactionHandler(async (transaction) => {
        await expense.destroy({ transaction });
        await createNotification(
            {
                userId,
                title: "Expense Deleted",
                message: `Your expense "${expenseTitle}" was deleted successfully.`,
                type: "warning",
            },
            { transaction }
        );
    });
    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.EXPENSE_DELETED
    );
});