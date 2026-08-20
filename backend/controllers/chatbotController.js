import { Expense, Income } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import gemini from "../utils/gemini.js";
import { STATUS_CODES } from "../utils/setConstants.js";

export const chatWithBot = asyncHandler(async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "Message is required",
        });
    }
    const userId = req.user.id;
    console.log("👤 Chatbot user:", userId);
    console.log("💬 User message:", message);

    // Get user's expenses
    const expenses = await Expense.findAll({
        where: {
            userId,
        },
        attributes: [
            "id",
            "title",
            "amount",
            "category",
            "date",
            "notes",
        ],
        order: [["date", "DESC"]],
    });

    // Get user's income
    const incomes = await Income.findAll({
        where: {
            userId,
        },
        attributes: [
            "id",
            "title",
            "amount",
            "sourceId",
            "date",
        ],
        order: [["date", "DESC"]],
    });

    // Convert Sequelize instances into plain objects
    const expenseData = expenses.map((expense) => ({
        title: expense.title,
        amount: Number(expense.amount),
        category: expense.category,
        date: expense.date,
        notes: expense.notes,
    }));

    const incomeData = incomes.map((income) => ({
        title: income.title,
        amount: Number(income.amount),
        date: income.date,
    }));

    const totalExpense = expenseData.reduce(
        (total, expense) => total + expense.amount,
        0
    );

    const totalIncome = incomeData.reduce(
        (total, income) => total + income.amount,
        0
    );

    const balance = totalIncome - totalExpense;
    
    const financialData = {
        totalIncome,
        totalExpense,
        balance,
        expenses: expenseData,
        incomes: incomeData,
    };

    const prompt = `
            You are a helpful AI financial assistant inside an expense tracker application.
            You are answering questions using the logged-in user's actual financial data.

            Important rules:
            1. Only use the financial data provided below.
            2. Do not invent transactions or amounts.
            3. If the requested information is not available, clearly say that it is not available.
            4. Give simple and practical financial advice.
            5. Use Indian Rupee (₹) when discussing amounts.
            6. When useful, calculate totals, differences, percentages, or spending patterns.
            7. Keep the response easy to understand.

            USER'S FINANCIAL DATA:
                Total Income: ₹${totalIncome.toFixed(2)}
                Total Expenses: ₹${totalExpense.toFixed(2)}
                Current Balance: ₹${balance.toFixed(2)}
            Expenses:
                ${JSON.stringify(expenseData, null, 2)}
            Income:
                ${JSON.stringify(incomeData, null, 2)}
            USER QUESTION:
                ${message}
            `;

    console.log("🤖 Sending financial data to Gemini...");
    const response = await gemini.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    });

    console.log("✅ Gemini response received");
    res.status(STATUS_CODES.OK).json({
        success: true,
        message: response.text,
    });
});