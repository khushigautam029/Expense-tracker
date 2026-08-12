import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    BarChart3,
    CalendarDays,
    Download,
    FileSpreadsheet,
    FileText,
    TrendingDown,
    TrendingUp
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { getReport } from "../services/reportService";

const Reports = () => {
    const monthInputRef = useRef(null);
    const [reportMonth, setReportMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );

    const [reportData, setReportData] = useState({
        income: 0,
        expense: 0,
        savings: 0,
        transactions: [],
    });

    const generateReport = async () => {
        try {
            const data = await getReport(reportMonth);

            // 1. Try to extract transactions directly from getReport response
            let transactionsList =
                data?.transactions ||
                data?.data?.transactions ||
                data?.details ||
                data?.history ||
                (Array.isArray(data) ? data : []);

            // 2. If transactions array is combined from separate arrays (e.g., data.incomes and data.expenses)
            if (transactionsList.length === 0 && (data?.incomes || data?.expenses)) {
                const incomes = (data.incomes || []).map(item => ({ ...item, type: "INCOME" }));
                const expenses = (data.expenses || []).map(item => ({ ...item, type: "EXPENSE" }));
                transactionsList = [...incomes, ...expenses];
            }

            // 3. Fallback: If report endpoint doesn't return transactions, attempt to fetch from local storage or secondary call
            if (transactionsList.length === 0) {
                // If you store transactions in localStorage as a quick fallback:
                const localData = JSON.parse(localStorage.getItem("transactions") || "[]");
                if (localData.length > 0) {
                    transactionsList = localData.filter(tx => {
                        const txMonth = (tx.date || tx.createdAt || "").slice(0, 7);
                        return txMonth === reportMonth || !txMonth;
                    });
                }
            }

            setReportData({
                income: Number(data?.income ?? data?.totalIncome ?? 0),
                expense: Number(data?.expense ?? data?.totalExpense ?? 0),
                savings: Number(data?.savings ?? data?.netSavings ?? (data?.income - data?.expense) ?? 0),
                transactions: transactionsList,
            });
        } catch (error) {
            console.error("Error generating report:", error);
        }
    };

    useEffect(() => {
        generateReport();
    }, [reportMonth]);

    const normalizeTransaction = (tx) => {
        // Map numerical source IDs or names to display labels
        const incomeSourceMap = {
            1: "Salary",
            2: "Freelancing",
            3: "Business",
            4: "Investment",
            5: "Bonus",
            6: "Interest",
            7: "Gift",
            8: "Rental Income",
            9: "Refund",
            10: "Other"
        };

        // 1. Date handling
        const rawDate = tx.date || tx.createdAt || tx.transactionDate || tx.created_at;
        const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString("en-IN") : "-";

        // 2. Title / Description
        const title = tx.title || tx.description || tx.name || tx.memo || "N/A";

        // 3. Type (INCOME or EXPENSE)
        let type = tx.type || tx.transactionType;
        if (!type) {
            type = tx.isIncome ? "INCOME" : "EXPENSE";
        }
        const normalizedType = String(type || "EXPENSE").toUpperCase();

        // 4. Category / Source Resolution
        let resolvedCategory = "";

        // Check potential category fields
        const rawCategory = tx.category || tx.source || tx.incomeSource || tx.categoryName || tx.sourceId;

        if (typeof rawCategory === "object" && rawCategory !== null) {
            resolvedCategory = rawCategory.name || rawCategory.title || rawCategory.label || "";
        } else if (rawCategory !== undefined && rawCategory !== null) {
            const key = String(rawCategory).trim();
            if (incomeSourceMap[key]) {
                resolvedCategory = incomeSourceMap[key];
            } else {
                resolvedCategory = String(rawCategory);
            }
        }

        // SMART FALLBACK FOR INCOMES: Match description keywords against your 1-10 sources
        if ((!resolvedCategory || resolvedCategory === "N/A") && normalizedType === "INCOME") {
            const descLower = title.toLowerCase();

            if (descLower.includes("gift")) resolvedCategory = "Gift";
            else if (descLower.includes("rent")) resolvedCategory = "Rental Income";
            else if (descLower.includes("project") || descLower.includes("freelance")) resolvedCategory = "Freelancing";
            else if (descLower.includes("job") || descLower.includes("salary") || descLower.includes("paycheck")) resolvedCategory = "Salary";
            else if (descLower.includes("bonus")) resolvedCategory = "Bonus";
            else if (descLower.includes("business") || descLower.includes("plot") || descLower.includes("sale")) resolvedCategory = "Business";
            else if (descLower.includes("interest")) resolvedCategory = "Interest";
            else if (descLower.includes("invest") || descLower.includes("stock") || descLower.includes("dividend")) resolvedCategory = "Investment";
            else if (descLower.includes("refund")) resolvedCategory = "Refund";
            else resolvedCategory = "Other Income";
        }

        // Default for expense if still empty
        if (!resolvedCategory) {
            resolvedCategory = "General";
        }

        // 5. Amount
        const amount = Number(tx.amount || 0);

        return {
            formattedDate,
            title,
            category: resolvedCategory,
            type: normalizedType,
            amount
        };
    };

    const downloadPDF = () => {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        const formattedIncome = reportData.income.toLocaleString("en-IN", { minimumFractionDigits: 2 });
        const formattedExpense = reportData.expense.toLocaleString("en-IN", { minimumFractionDigits: 2 });
        const formattedSavings = reportData.savings.toLocaleString("en-IN", { minimumFractionDigits: 2 });

        // Header
        doc.setFillColor(30, 41, 59);
        doc.rect(0, 0, 210, 36, "F");
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, 210, 3, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Expense Tracker Report", 14, 18);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(203, 213, 225);
        doc.text("Monthly Financial Summary & Detailed Log", 14, 25);

        const generatedDate = new Date().toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
        doc.setFontSize(9);
        doc.text(`Period: ${reportMonth}`, 196, 18, { align: "right" });
        doc.text(`Generated: ${generatedDate}`, 196, 25, { align: "right" });

        // Summary Cards
        const cardY = 42;
        const cardWidth = 58;
        const cardHeight = 24;

        doc.setFillColor(240, 253, 244);
        doc.setDrawColor(187, 247, 208);
        doc.roundedRect(14, cardY, cardWidth, cardHeight, 2, 2, "FD");
        doc.setFontSize(8);
        doc.setTextColor(22, 101, 52);
        doc.setFont("helvetica", "bold");
        doc.text("TOTAL INCOME", 18, cardY + 7);
        doc.setFontSize(11);
        doc.text(`INR ${formattedIncome}`, 18, cardY + 17);

        doc.setFillColor(254, 242, 242);
        doc.setDrawColor(254, 202, 202);
        doc.roundedRect(76, cardY, cardWidth, cardHeight, 2, 2, "FD");
        doc.setFontSize(8);
        doc.setTextColor(153, 27, 27);
        doc.setFont("helvetica", "bold");
        doc.text("TOTAL EXPENSES", 80, cardY + 7);
        doc.setFontSize(11);
        doc.text(`INR ${formattedExpense}`, 80, cardY + 17);

        doc.setFillColor(239, 246, 255);
        doc.setDrawColor(191, 219, 254);
        doc.roundedRect(138, cardY, cardWidth, cardHeight, 2, 2, "FD");
        doc.setFontSize(8);
        doc.setTextColor(30, 64, 175);
        doc.setFont("helvetica", "bold");
        doc.text("NET SAVINGS", 142, cardY + 7);
        doc.setFontSize(11);
        doc.text(`INR ${formattedSavings}`, 142, cardY + 17);

        // Summary Table
        autoTable(doc, {
            startY: 72,
            head: [["Financial Summary", "Amount"]],
            body: [
                ["Total Income", `INR ${formattedIncome}`],
                ["Total Expenses", `INR ${formattedExpense}`],
                ["Net Savings", `INR ${formattedSavings}`],
            ],
            theme: "grid",
            headStyles: {
                fillColor: [30, 41, 59],
                textColor: [255, 255, 255],
                fontSize: 9.5,
                fontStyle: "bold",
                cellPadding: 3.5,
            },
            bodyStyles: {
                fontSize: 9,
                cellPadding: 4,
                textColor: [51, 65, 85],
            },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            columnStyles: {
                0: { cellWidth: 120 },
                1: { cellWidth: 62, halign: "right", fontStyle: "bold" },
            },
        });

        // Transactions Table
        const lastTableY = doc.lastAutoTable.finalY || 100;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(30, 41, 59);
        doc.text("Detailed Transactions Breakdown", 14, lastTableY + 10);

        const transactionRows = reportData.transactions.map((tx) => {
            const normalized = normalizeTransaction(tx);
            return [
                normalized.formattedDate,
                normalized.title,
                normalized.category,
                normalized.type,
                `INR ${normalized.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
            ];
        });

        autoTable(doc, {
            startY: lastTableY + 14,
            head: [["Date", "Description", "Category", "Type", "Amount"]],
            body: transactionRows.length > 0 ? transactionRows : [["-", "No transactions recorded for this period", "-", "-", "-"]],
            theme: "striped",
            headStyles: {
                fillColor: [51, 65, 85],
                textColor: [255, 255, 255],
                fontSize: 9,
                fontStyle: "bold",
                cellPadding: 3.5,
            },
            bodyStyles: {
                fontSize: 8.5,
                cellPadding: 3.5,
                textColor: [51, 65, 85],
            },
            columnStyles: {
                0: { cellWidth: 28 },
                1: { cellWidth: 62 },
                2: { cellWidth: 35 },
                3: { cellWidth: 25, halign: "center" },
                4: { cellWidth: 32, halign: "right", fontStyle: "bold" },
            },
            didParseCell: (data) => {
                if (data.section === "body" && data.column.index === 3) {
                    const typeText = String(data.cell.raw).toUpperCase();
                    if (typeText === "INCOME") {
                        data.cell.styles.textColor = [22, 101, 52];
                        data.cell.styles.fontStyle = "bold";
                    } else if (typeText === "EXPENSE") {
                        data.cell.styles.textColor = [185, 28, 28];
                        data.cell.styles.fontStyle = "bold";
                    }
                }
            },
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(148, 163, 184);

            doc.setDrawColor(226, 232, 240);
            doc.line(14, 282, 196, 282);

            doc.text("Expense Tracker App - Detailed Financial Report", 14, 287);
            doc.text(`Page ${i} of ${pageCount}`, 196, 287, { align: "right" });
        }

        doc.save(`Expense_Report_${reportMonth}.pdf`);
    };

    const downloadExcel = () => {
        const excelData = reportData.transactions.map((tx) => {
            const normalized = normalizeTransaction(tx);
            return {
                Date: normalized.formattedDate,
                Description: normalized.title,
                Category: normalized.category,
                Type: normalized.type,
                Amount: normalized.amount,
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(
            excelData.length > 0 ? excelData : [
                {
                    Income: reportData.income,
                    Expense: reportData.expense,
                    Savings: reportData.savings,
                }
            ]
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([excelBuffer]), `Expense_Report_${reportMonth}.xlsx`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="mt-15 text-2xl font-bold text-slate-800 dark:text-white">
                    Reports
                </h1>
                <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                    Analyze your financial activity and download reports
                </p>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 md:flex-row md:items-center">
                <div>
                    <h2 className="font-semibold text-slate-800 dark:text-white">Report Period</h2>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Select the period for your report</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative">
                        <button
                            type="button"
                            aria-label="Choose report month"
                            onClick={() => {
                                if (monthInputRef.current?.showPicker) {
                                    monthInputRef.current.showPicker();
                                } else {
                                    monthInputRef.current?.focus();
                                }
                            }}
                            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-slate-500 dark:text-slate-400"
                        >
                            <CalendarDays size={16} />
                        </button>
                        <input
                            ref={monthInputRef}
                            type="month"
                            value={reportMonth}
                            onChange={(e) => setReportMonth(e.target.value)}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-10 pr-4 text-slate-700 dark:text-white dark:[color-scheme:dark] dark:[&::-webkit-calendar-picker-indicator]:invert"
                        />
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400 dark:text-slate-500">Total Income</p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
                                ₹{reportData.income.toLocaleString("en-IN")}
                            </h2>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Total Expenses</p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
                                ₹{reportData.expense.toLocaleString("en-IN")}
                            </h2>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                            <TrendingDown size={20} />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Net Savings</p>
                            <h2 className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
                                ₹{reportData.savings.toLocaleString("en-IN")}
                            </h2>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <BarChart3 size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Downloads */}
            <div>
                <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">Download Reports</h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-white">PDF Report</h3>
                                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Complete summary & transaction list</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 border-t border-slate-100 dark:border-slate-700 pt-5">
                            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Download a complete PDF report containing total income, expenses, savings, and an itemized log of all transactions.
                            </p>
                            <button
                                onClick={downloadPDF}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                <Download size={17} />
                                Download PDF
                            </button>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                    <FileSpreadsheet size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 dark:text-white">Excel Report</h3>
                                    <p className="mt-1 text-xs text-slate-400">Detailed transaction data spreadsheet</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 border-t border-slate-100 dark:border-slate-700 pt-5">
                            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Export your income and expense transactions into an Excel spreadsheet for detailed custom analysis.
                            </p>
                            <button
                                onClick={downloadExcel}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                <Download size={17} />
                                Download Excel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;