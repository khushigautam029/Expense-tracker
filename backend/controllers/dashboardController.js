import { col, fn, Op } from "sequelize";
import { Expense, Income } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { STATUS_CODES } from "../utils/setConflicts.js";

const getMonthFilter = (month) => {
    if (!month) return {};
    const year = Number(month.slice(0, 4));
    const monthNumber = Number(month.slice(5, 7));
    const lastDay = new Date(year, monthNumber, 0).getDate();
    return { date: { [Op.between]: [`${month}-01`, `${month}-${String(lastDay).padStart(2, "0")}`] } };
};

export const getDashboard = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { month } = req.query;
    const where = { userId, ...getMonthFilter(month) };

    // Total Income
    const totalIncome = await Income.sum("amount", {
        where
    });

    // Total Expense
    const totalExpense = await Expense.sum("amount", {
        where
    });

    // Count
    const incomeCount = await Income.count({
        where
    });

    const expenseCount = await Expense.count({
        where
    });

    // Recent Income
    const recentIncome = await Income.findAll({
        where,
        limit: 5,
        order: [["createdAt", "DESC"]]
    });

    // Recent Expense
    const recentExpense = await Expense.findAll({
        where,
        limit: 5,
        order: [["createdAt", "DESC"]]
    });

    // Expense By Category
    const expenseByCategory = await Expense.findAll({
        where,
        attributes: [
            "category",
            [fn("SUM", col("amount")), "total"]
        ],
        group: ["category"]
    });

    // Monthly Income
    const monthlyIncome = await Income.findAll({
        where,
        attributes: [
            [fn("MONTHNAME", col("date")), "month"],
            [fn("SUM", col("amount")), "total"]
        ],
        group: [
            fn("MONTH", col("date")),
            fn("MONTHNAME", col("date"))
        ],
        order: [[fn("MONTH", col("date")), "ASC"]]
    });

    // Monthly Expense
    const monthlyExpense = await Expense.findAll({
        where,
        attributes: [
            [fn("MONTHNAME", col("date")), "month"],
            [fn("SUM", col("amount")), "total"]
        ],
        group: [
            fn("MONTH", col("date")),
            fn("MONTHNAME", col("date"))
        ],
        order: [[fn("MONTH", col("date")), "ASC"]]
    });

    // Final Response
    res.status(STATUS_CODES.OK).json({
        success: true,
        summary: {
            totalIncome: Number(totalIncome || 0),
            totalExpense: Number(totalExpense || 0),
            balance: Number(totalIncome || 0) - Number(totalExpense || 0),
            incomeCount,
            expenseCount
        },
        recentIncome,
        recentExpense,
        expenseByCategory,
        monthlyIncome,
        monthlyExpense
    });
});