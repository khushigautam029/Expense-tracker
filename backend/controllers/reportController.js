import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { Op } from "sequelize";
import { Expense, Income } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";

const getDateFilter = (month) => {
    if (!month) return {};

    const startDate = `${month}-01`;
    const year = Number(month.slice(0, 4));
    const monthNumber = Number(month.slice(5, 7));
    const lastDay = new Date(year, monthNumber, 0).getDate();
    const endDate = `${month}-${String(lastDay).padStart(2, "0")}`;

    return { date: { [Op.between]: [startDate, endDate] } };
};

export const getReport = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { month } = req.query;

    const where = { userId, ...getDateFilter(month) };

    const incomes = await Income.findAll({
        where,
    });

    const expenses = await Expense.findAll({
        where,
    });

    const totalIncome = incomes.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    const totalExpense = expenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
    );

    res.json({
        success: true,
        income: totalIncome,
        expense: totalExpense,
        savings: totalIncome - totalExpense,
        incomes,
        expenses,
    });
});

export const downloadPDF = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { month } = req.query;
    const incomes = await Income.findAll({
        where: { userId, ...getDateFilter(month) }
    });

    const expenses = await Expense.findAll({
        where: { userId, ...getDateFilter(month) }
    });

    const doc = new PDFDocument();

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        "attachment; filename=Expense_Report.pdf"
    );

    doc.pipe(res);

    doc.fontSize(22).text("Expense Tracker Report", {
        align: "center"
    });

    doc.moveDown();

    doc.fontSize(18).text("Income");

    doc.moveDown();

    incomes.forEach((income) => {
        doc.fontSize(12).text(
            `${income.date} | ${income.title} | ₹${income.amount}`
        );
    });

    doc.moveDown();

    doc.fontSize(18).text("Expenses");

    doc.moveDown();

    expenses.forEach((expense) => {
        doc.fontSize(12).text(
            `${expense.date} | ${expense.title} | ${expense.category} | ₹${expense.amount}`
        );
    });

    doc.end();
});

export const downloadExcel = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { month } = req.query;

    const incomes = await Income.findAll({
        where: { userId, ...getDateFilter(month) }
    });

    const expenses = await Expense.findAll({
        where: { userId, ...getDateFilter(month) }
    });

    const workbook = new ExcelJS.Workbook();

    // Income Sheet
    const incomeSheet = workbook.addWorksheet("Income");

    incomeSheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Title", key: "title", width: 25 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Source", key: "source", width: 20 },
        { header: "Date", key: "date", width: 18 },
        { header: "Notes", key: "notes", width: 30 }
    ];

    incomes.forEach((income) => {
        incomeSheet.addRow({
            id: income.id,
            title: income.title,
            amount: income.amount,
            source: income.source,
            date: income.date,
            notes: income.notes
        });
    });

    // Expense Sheet
    const expenseSheet = workbook.addWorksheet("Expenses");

    expenseSheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Title", key: "title", width: 25 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Category", key: "category", width: 20 },
        { header: "Date", key: "date", width: 18 },
        { header: "Notes", key: "notes", width: 30 }
    ];

    expenses.forEach((expense) => {
        expenseSheet.addRow({
            id: expense.id,
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            notes: expense.notes
        });
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        "attachment; filename=Expense_Report.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();
});