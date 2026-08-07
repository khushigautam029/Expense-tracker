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
import {
    downloadExcel as downloadExcelFromApi,
    downloadPDF as downloadPDFFromApi,
    getReport,
} from "../services/reportService";

const Reports = () => {
    const monthInputRef = useRef(null);
    const [reportMonth, setReportMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );

    const [reportData, setReportData] = useState({
        income: 0,
        expense: 0,
        savings: 0,
    });


    const generateReport = async () => {
        try {
            const data = await getReport(reportMonth);

            setReportData({
                income: data.income,
                expense: data.expense,
                savings: data.savings,
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        generateReport();
    }, [reportMonth]);

    const downloadPDF = () => {

        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Expense Tracker Report", 14, 18);

        doc.setFontSize(12);
        doc.text(`Report Month : ${reportMonth}`, 14, 30);

        autoTable(doc, {
            startY: 40,
            head: [["Type", "Amount"]],
            body: [
                ["Income", `₹${reportData.income}`],
                ["Expense", `₹${reportData.expense}`],
                ["Savings", `₹${reportData.savings}`],
            ],
        });

        doc.save("Expense_Report.pdf");
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet([
            {
                Income: reportData.income,
                Expense: reportData.expense,
                Savings: reportData.savings,
            },
        ]);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Report"
        );

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        saveAs(
            new Blob([excelBuffer]),
            "Expense_Report.xlsx"
        );
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>

                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mt-15">
                    Reports
                </h1>

                <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                    Analyze your financial activity and download reports
                </p>
            </div>

            {/* Date Filter */}
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 md:flex-row md:items-center">
                <div>

                    <h2 className="font-semibold text-slate-800 dark:text-white">
                        Report Period
                    </h2>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Select the period for your report
                    </p>

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

                    {/* <button
                        onClick={generateReport}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        Generate Report
                    </button> */}

                </div>

            </div>


            {/* Report Summary */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-400 dark:text-slate-500">
                                Total Income
                            </p>

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

                            <p className="text-sm text-slate-400">
                                Total Expenses
                            </p>

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

                            <p className="text-sm text-slate-400">
                                Net Savings
                            </p>

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


            {/* Reports */}
            <div>

                <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">
                    Download Reports
                </h2>


                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    {/* PDF */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">

                        <div className="flex items-start justify-between">

                            <div className="flex items-center gap-4">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                                    <FileText size={24} />
                                </div>

                                <div>

                                    <h3 className="font-semibold text-slate-800 dark:text-white">
                                        PDF Report
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                        Complete financial summary
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="mt-5 border-t border-slate-100 dark:border-slate-700 pt-5">

                            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Download a complete PDF report containing
                                your income, expenses, balance and category
                                summary.
                            </p>


                            <button
                                onClick={() => downloadPDFFromApi(reportMonth)}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <Download size={17} />
                                Download PDF
                            </button>

                        </div>

                    </div>


                    {/* Excel */}
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6">

                        <div className="flex items-start justify-between">

                            <div className="flex items-center gap-4">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                    <FileSpreadsheet size={24} />
                                </div>

                                <div>

                                    <h3 className="font-semibold text-slate-800 dark:text-white">
                                        Excel Report
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Detailed transaction data
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="mt-5 border-t border-slate-100 dark:border-slate-700 pt-5">

                            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Export your income and expense transactions
                                into an Excel spreadsheet for further analysis.
                            </p>


                            <button
                                onClick={() => downloadExcelFromApi(reportMonth)}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
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
