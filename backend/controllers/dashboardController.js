import { col, fn, Op } from "sequelize";
import { Expense, Income } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/responseHandler.js";
import { STATUS_CODES } from "../utils/setConstants.js";

const getMonthFilter = (month) => {
    if (!month) return {};
    const [year, monthNumber] = month.split("-").map(Number);
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

export const getDashboard = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { month } = req.query;

    const where = {
        userId,
        ...getMonthFilter(month),
    };

    const [
        totalIncome,
        totalExpense,
        incomeCount,
        expenseCount,
        recentIncome,
        recentExpense,
        expenseByCategory,
        monthlyIncome,
        monthlyExpense,
    ] = await Promise.all([
        Income.sum("amount", { where }),
        Expense.sum("amount", { where }),
        Income.count({ where }),
        Expense.count({ where }),
        Income.findAll({
            where,
            limit: 5,
            order: [["createdAt", "DESC"]],
        }),
        Expense.findAll({
            where,
            limit: 5,
            order: [["createdAt", "DESC"]],
        }),
        Expense.findAll({
            where,
            attributes: [
                "category",
                [fn("SUM", col("amount")), "total"],
            ],
            group: ["category"],
        }),
        Income.findAll({
            where,
            attributes: [
                [fn("MONTHNAME", col("date")), "month"],
                [fn("SUM", col("amount")), "total"],
            ],
            group: [
                fn("MONTH", col("date")),
                fn("MONTHNAME", col("date")),
            ],
            order: [
                [fn("MONTH", col("date")), "ASC"],
            ],
        }),

        Expense.findAll({
            where,
            attributes: [
                [fn("MONTHNAME", col("date")), "month"],
                [fn("SUM", col("amount")), "total"],
            ],
            group: [
                fn("MONTH", col("date")),
                fn("MONTHNAME", col("date")),
            ],
            order: [
                [fn("MONTH", col("date")), "ASC"],
            ],
        }),
    ]);
    const income = Number(totalIncome || 0);
    const expense = Number(totalExpense || 0);
    const balance = income - expense;
    const isOverspending = expense > income;

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        null,
        {
            summary: {
                totalIncome: income,
                totalExpense: expense,
                balance,
                incomeCount,
                expenseCount,

                financialWarning: {
                    show: isOverspending,
                    message: isOverspending
                        ? "Your spending is higher than your income this month."
                        : null,
                    difference: isOverspending
                        ? expense - income
                        : 0,
                },
            },

            recentIncome,
            recentExpense,
            expenseByCategory,
            monthlyIncome,
            monthlyExpense,
        }
    );
});