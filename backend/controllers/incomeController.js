import { Op } from "sequelize";
import { Income, Source } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import createNotification from "../utils/createNotifications.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";
import { transactionHandler } from "../utils/transactionHandler.js";
import { incomeSchema } from "../validation/incomeValidation.js";

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

export const addIncome = asyncHandler(async (req, res) => {
    const { error, value } = incomeSchema.validate(req.body);
    if (error) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.details[0].message
        );
    }

    const { title, amount, sourceId, date } = value;
    const userId = req.user.id;
    const source = await Source.findByPk(sourceId);

    if (!source) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.SELECTED_SOURCE_DOES_NOT_EXIST
        );
    }

    let income;
    await transactionHandler(async (transaction) => {
        income = await Income.create(
            {
                title,
                amount,
                sourceId,
                date,
                userId,
            },
            { transaction }
        );
        await createNotification(
            {
                userId,
                title: "Income Added",
                message: `You added an income of ₹${amount}.`,
                type: "income",
            },
            { transaction }
        );
    });

    return sendSuccess(
        res,
        STATUS_CODES.CREATED,
        MESSAGES.INCOME_ADDED,
        { income }
    );
});

export const getAllIncome = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const {
        page = 1,
        limit = 5,
        search = "",
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
        "sourceId",
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

    const { count, rows: incomes } = await Income.findAndCountAll({
        where,
        include: {
            model: Source,
            as: "source",
            attributes: ["id", "name"],
        },
        order: [[safeSortBy, safeOrder]],
        limit: pageLimit,
        offset,
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.INCOME_FETCHED_SUCCESSFULLY,
        {
            totalIncome: count,
            totalPages: Math.ceil(count / pageLimit),
            currentPage,
            incomes,
        }
    );
});

export const getIncomeById = asyncHandler(async (req, res) => {
    const income = await Income.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
        include: {
            model: Source,
            as: "source",
            attributes: ["id", "name"],
        },
    });

    if (!income) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.INCOME_NOT_FOUND
        );
    }

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.INCOME_FETCHED_SUCCESSFULLY,
        { income }
    );
});

export const updateIncome = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const incomeId = req.params.id;
    const payload = {
        ...req.body,
        amount:
            req.body.amount !== "" && req.body.amount !== undefined
                ? Number(req.body.amount)
                : req.body.amount,
        sourceId:
            req.body.sourceId !== "" && req.body.sourceId !== undefined
                ? Number(req.body.sourceId)
                : req.body.sourceId,
    };

    // Validate request body
    const { error , value} = incomeSchema.validate(payload);
    if (error) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.details[0].message
        );
    }

    const { title, amount, sourceId, date} = value;
    // Find income belonging to logged-in user
    const income = await Income.findOne({
        where: {
            id: incomeId,
            userId,
        },
    });
    if (!income) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.INCOME_NOT_FOUND
        );
    }

    // Verify source exists
    const source = await Source.findByPk(sourceId);
    if (!source) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.SOURCE_NOT_FOUND
        );
    }

    await transactionHandler(async (transaction) => {
        await income.update(
            {
                title,
                amount,
                sourceId,
                date,
            },
            { transaction }
        );
        await createNotification(
            {
                userId,
                title: "Income Updated",
                message: `Your income "${title}" was updated successfully.`,
                type: "info",
            },
            { transaction }
        );
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.INCOME_UPDATED,
        { income }
    );
});

export const deleteIncome = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const incomeId = req.params.id;

    const income = await Income.findOne({
        where: {
            id: incomeId,
            userId,
        },
    });

    if (!income) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.INCOME_NOT_FOUND
        );
    }

    const incomeTitle = income.title;
    await transactionHandler(async (transaction) => {
        await income.destroy({ transaction });
        await createNotification(
            {
                userId,
                title: "Income Deleted",
                message: `Your income "${incomeTitle}" was deleted successfully.`,
                type: "warning",
            },
            { transaction }
        );
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.INCOME_DELETED
    );
});