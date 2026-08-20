import { Op, col, fn, literal } from "sequelize";
import { Expense, Income } from "../models/index.js";

const getDateFilter = (month) => {
    if (!month) {
        return {};
    }

    const [year, monthNumber] = month.split("-");

    const lastDay = new Date(
        Number(year),
        Number(monthNumber),
        0
    ).getDate();

    return {
        date: {
            [Op.between]: [
                `${year}-${monthNumber}-01`,
                `${year}-${monthNumber}-${String(lastDay).padStart(2, "0")}`,
            ],
        },
    };
};

export const getFinancialSummary = async (
    userId,
    month = null
) => {
    const dateFilter = getDateFilter(month);

    const expenseWhere = {
        userId,
        ...dateFilter,
    };

    const incomeWhere = {
        userId,
        ...dateFilter,
    };

    const totalExpense = await Expense.sum(
        "amount",
        {
            where: expenseWhere,
        }
    );

    const totalIncome = await Income.sum(
        "amount",
        {
            where: incomeWhere,
        }
    );

    const categoryResults = await Expense.findAll({
        where: expenseWhere,
        attributes: [
            "category",
            [fn("SUM", col("amount")), "total"],
        ],
        group: ["category"],
        order: [[literal("total"), "DESC"]],
        raw: true,
    });

    const categorySpending = categoryResults.reduce(
        (result, item) => {
            result[item.category] = Number(item.total);
            return result;
        },
        {}
    );

    const biggestExpense = await Expense.findOne({
        where: expenseWhere,
        attributes: [
            "title",
            "amount",
            "category",
            "date",
        ],
        order: [["amount", "DESC"]],
        raw: true,
    });

    const income = Number(totalIncome || 0);
    const expense = Number(totalExpense || 0);

    return {
        totalIncome: income,
        totalExpense: expense,
        balance: income - expense,
        categorySpending,
        biggestExpense: biggestExpense
            ? {
                title: biggestExpense.title,
                amount: Number(
                    biggestExpense.amount
                ),
                category: biggestExpense.category,
                date: biggestExpense.date,
            }
            : null,
    };
};