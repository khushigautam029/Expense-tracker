import { Op } from "sequelize";
import { Expense } from "../models/index.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConflicts.js";
import { expenseSchema } from "../validation/expenseValidation.js";

const getMonthFilter = (month) => {
    if (!month) return {};
    const year = Number(month.slice(0, 4));
    const monthNumber = Number(month.slice(5, 7));
    const lastDay = new Date(year, monthNumber, 0).getDate();
    return { date: { [Op.between]: [`${month}-01`, `${month}-${String(lastDay).padStart(2, "0")}`] } };
};

export const addExpense = async (req, res) => {
    try {

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

        res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: MESSAGES.EXPENSE_ADDED,
        });

    } catch (error) {

        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });

    }
};


export const getAllExpenses = async (req, res) => {
    try {

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

    } catch (error) {

        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });

    }
};

export const getExpenseById = async (req, res) => {
    try {

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

    } catch (error) {

        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });

    }
};


export const updateExpense = async (req, res) => {
    try {

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

        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.EXPENSE_UPDATED,
            expense,
        });

    } catch (error) {

        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });

    }
};


export const deleteExpense = async (req, res) => {
    try {

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

        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.EXPENSE_DELETED,
        });

    } catch (error) {

        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });

    }
};

