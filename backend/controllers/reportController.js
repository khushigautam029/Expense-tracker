import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { Op } from "sequelize";
import { Expense, Income } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { MESSAGES } from "../utils/setConstants.js";
const getDateFilter = (month) => {
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

export const getReport = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { month } = req.query;

    const where = { userId, ...getDateFilter(month) };
    const [totalIncome, totalExpense, incomes, expenses] =
        await Promise.all([
            Income.sum("amount", { where }),
            Expense.sum("amount", { where }),
            Income.findAll({ where }),
            Expense.findAll({ where }),
        ]);

    const income = Number(totalIncome || 0);
    const expense = Number(totalExpense || 0);

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.REPORT_FETCHED_SUCCESSFULLY,
        {
            income,
            expense,
            savings: income - expense,
            incomes,
            expenses,
        }
    );
});

export const downloadPDF = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { month } = req.query;
    const where = {
        userId,
        ...getDateFilter(month),
    };
    const [incomes, expenses] = await Promise.all([
        Income.findAll({ where }),
        Expense.findAll({ where }),
    ]);

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
    if (incomes.length === 0) {
        doc.fontSize(12).text("No income records found.");
    } else {
        incomes.forEach((income) => {
            doc
                .fontSize(12)
                .text(
                    `${income.date} | ${income.title} | ₹${income.amount}`
                );
        });
    }

    doc.moveDown();
    doc.fontSize(18).text("Expenses");
    doc.moveDown();
    if (expenses.length === 0) {
        doc.fontSize(12).text("No expense records found.");
    } else {
        expenses.forEach((expense) => {
            doc
                .fontSize(12)
                .text(
                    `${expense.date} | ${expense.title} | ${expense.category} | ₹${expense.amount}`
                );
        });
    }
    doc.end();
});

export const downloadExcel = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { month } = req.query;
    const where = {
        userId,
        ...getDateFilter(month),
    };
    const [incomes, expenses] = await Promise.all([
        Income.findAll({
            where,
            include: {
                model: Source,
                as: "source",
                attributes: ["id", "name"],
            },
        }),
        Expense.findAll({
            where,
        }),
    ]);

    const workbook = new ExcelJS.Workbook();
    const incomeSheet = workbook.addWorksheet("Income");
    incomeSheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Title", key: "title", width: 25 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Source", key: "source", width: 20 },
        { header: "Date", key: "date", width: 18 },
        { header: "Notes", key: "notes", width: 30 },
    ];

    incomes.forEach((income) => {
        incomeSheet.addRow({
            id: income.id,
            title: income.title,
            amount: income.amount,
            source: income.source?.name || "",
            date: income.date,
            notes: income.notes || "",
        });
    });

    const expenseSheet = workbook.addWorksheet("Expenses");
    expenseSheet.columns = [
        { header: "ID", key: "id", width: 10 },
        { header: "Title", key: "title", width: 25 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Category", key: "category", width: 20 },
        { header: "Date", key: "date", width: 18 },
        { header: "Notes", key: "notes", width: 30 },
    ];

    expenses.forEach((expense) => {
        expenseSheet.addRow({
            id: expense.id,
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            notes: expense.notes || "",
        });
    });

    incomeSheet.getRow(1).font = { bold: true };
    expenseSheet.getRow(1).font = { bold: true };
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