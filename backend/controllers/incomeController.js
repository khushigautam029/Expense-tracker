import { Op } from "sequelize";
import { Income } from "../models/index.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConflicts.js";
import { incomeSchema } from "../validation/incomeValidation.js";

const getMonthFilter = (month) => {
    if (!month) return {};
    const year = Number(month.slice(0, 4));
    const monthNumber = Number(month.slice(5, 7));
    const lastDay = new Date(year, monthNumber, 0).getDate();
    return { date: { [Op.between]: [`${month}-01`, `${month}-${String(lastDay).padStart(2, "0")}`] } };
};

export const addIncome = async (req, res) => {
    try {
        const { error } = incomeSchema.validate(req.body);

        if (error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: error.details[0].message,
            });
        }

        const { title, amount, source, date, notes } = req.body;

        const income = await Income.create({
            title,
            amount,
            source,
            date,
            notes,
            userId: req.user.id,
        });

        res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: MESSAGES.INCOME_ADDED,
            income,
        });
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};


export const getAllIncome = async (req, res) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const search = req.query.search || "";
        const { month } = req.query;
        const sortBy = req.query.sortBy || "createdAt";
        const order = req.query.order || "DESC";

        const offset = (page - 1) * limit;

        const { count, rows } = await Income.findAndCountAll({
            where: {
                userId: req.user.id,
                ...getMonthFilter(month),
                title: {
                    [Op.like]: `%${search}%`
                }
            },

            order: [[sortBy, order]],
            limit,
            offset
        });

        res.status(STATUS_CODES.OK).json({
            success: true,
            totalIncome: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            incomes: rows
        });

    } catch (error) {

        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });

    }
};

export const getIncomeById = async (req, res) => {
    try {
        const income = await Income.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!income) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: MESSAGES.INCOME_NOT_FOUND
            });
        }

        res.status(STATUS_CODES.OK).json({
            success: true,
            income
        });

    } catch (error) {

        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });

    }

};

export const updateIncome = async (req, res) => {
    try {
        const { error } = incomeSchema.validate(req.body);

        if (error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: error.details[0].message
            });
        }

        const income = await Income.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!income) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: MESSAGES.INCOME_NOT_FOUND
            });
        }

        await income.update(req.body);

        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.INCOME_UPDATED,
            income
        });

    } catch (error) {

        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });

    }

};


export const deleteIncome = async (req, res) => {

    try {

        const income = await Income.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!income) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: "Income not found"
            });
        }

        await income.destroy();

        res.status(STATUS_CODES.OK).json({
            success: true,
            message: "Income Deleted Successfully"
        });

    } catch (error) {

        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};
