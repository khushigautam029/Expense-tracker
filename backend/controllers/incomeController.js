import { Op } from "sequelize";
import { Income, Source } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import createNotification from "../utils/createNotifications.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConflicts.js";
import { incomeSchema } from "../validation/incomeValidation.js";


const getMonthFilter = (month) => {
    if (!month) return {};
    const year = Number(month.slice(0, 4));
    const monthNumber = Number(month.slice(5, 7));
    const lastDay = new Date(year, monthNumber, 0).getDate();
    return {
        date: {
            [Op.between]: [`${month}-01`, `${month}-${String(lastDay).padStart(2, "0")}`]
        }
    };
};

export const addIncome = asyncHandler(async (req, res) => {
    // Cast string inputs from frontend form to numbers
    const payload = {
        ...req.body,
        amount: req.body.amount !== "" && req.body.amount !== undefined ? Number(req.body.amount) : req.body.amount,
        sourceId: req.body.sourceId !== "" && req.body.sourceId !== undefined ? Number(req.body.sourceId) : req.body.sourceId,
    };

    // Validate payload against updated Joi schema
    const { error } = incomeSchema.validate(payload);

    if (error) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: error.details[0].message,
        });
    }

    const { title, amount, sourceId, date, notes } = payload;

    // Verify source exists in `sources` table
    const source = await Source.findByPk(sourceId);

    if (!source) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: "Selected source does not exist.",
        });
    }

    const income = await Income.create({
        title,
        amount,
        sourceId,
        date,
        notes,
        userId: req.user.id,
    });

    await createNotification({
        userId: req.user.id,
        title: "Income Added",
        message: `You added an income of ₹${amount}.`,
        type: "income",
    });

    return res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.INCOME_ADDED,
        income,
    });
});

export const getAllIncome = asyncHandler(async (req, res) => {
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
        include: [
            {
                model: Source,
                as: "source",
                attributes: ["id", "name"],
            },
        ],
        order: [[sortBy, order]],
        limit,
        offset
    });

    return res.status(STATUS_CODES.OK).json({
        success: true,
        totalIncome: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        incomes: rows
    });
});

export const getIncomeById = asyncHandler(async (req, res) => {
    const income = await Income.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id
        },
        include: [
            {
                model: Source,
                as: "source",
                attributes: ["id", "name"],
            },
        ],
    });

    if (!income) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: MESSAGES.INCOME_NOT_FOUND
        });
    }

    return res.status(STATUS_CODES.OK).json({
        success: true,
        income
    });
});

export const updateIncome = asyncHandler(async (req, res) => {
    const payload = {
        ...req.body,
        amount: req.body.amount !== "" && req.body.amount !== undefined ? Number(req.body.amount) : req.body.amount,
        sourceId: req.body.sourceId !== "" && req.body.sourceId !== undefined ? Number(req.body.sourceId) : req.body.sourceId,
    };

    const { error } = incomeSchema.validate(payload);

    if (error) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: error.details[0].message
        });
    }

    const income = await Income.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!income) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: MESSAGES.INCOME_NOT_FOUND
        });
    }

    const source = await Source.findByPk(payload.sourceId);

    if (!source) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: MESSAGES.SOURCE_NOT_FOUND,
        });
    }

    await income.update({
        title: payload.title,
        amount: payload.amount,
        sourceId: payload.sourceId,
        date: payload.date,
        notes: payload.notes,
    });

    await createNotification({
        userId: req.user.id,
        title: "Income Updated",
        message: `Your income "${income.title}" was updated successfully.`,
        type: "info",
    });

    return res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.INCOME_UPDATED,
        income
    });
});

export const deleteIncome = asyncHandler(async (req, res) => {

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

    await income.destroy();

    await createNotification({
        userId: req.user.id,
        title: "Income Deleted",
        message: `Your income "${income.title}" was deleted successfully.`,
        type: "warning",
    });

    return res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.INCOME_DELETED
    });
});