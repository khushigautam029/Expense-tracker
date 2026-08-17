import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    CreditCard,
    Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { errorToast } from "../utils/swal";
const COLORS = [
    "#6366F1",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#EC4899",
];

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { useEffect, useRef, useState } from "react";
import { getDashboard } from "../services/dashboardService";

const SummaryCard = ({
    title,
    amount,
    description,
    icon,
    iconClass,
}) => {

    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-700  bg-white dark:bg-slate-900 p-5">

            <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {title}
                </p>

                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
                >
                    {icon}
                </div>

            </div>

            <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">
                {amount}
            </h2>

            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                {description}
            </p>

        </div>
    );
};

const Dashboard = () => {

    const monthInputRef = useRef(null);
    const navigate = useNavigate();
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );

    const [dashboard, setDashboard] = useState({
        summary: {
            totalIncome: 0,
            totalExpense: 0,
            balance: 0,
            incomeCount: 0,
            expenseCount: 0,
        },
        recentIncome: [],
        recentExpense: [],
        expenseByCategory: [],
        monthlyIncome: [],
        monthlyExpense: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard(selectedMonth);
    }, [selectedMonth]);

    const fetchDashboard = async (month) => {
        setLoading(true);
        try {
            const data = await getDashboard(month);
            setDashboard(data);
        } catch (error) {
            if (error.response?.status === 401) return;

            console.error(error);

            errorToast(
                "Dashboard Error",
                "Unable to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="mt-20 flex justify-center">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Loading Dashboard...
                </h2>
            </div>
        );
    }

    if (!dashboard) {
        return (
            <div className="mt-20 text-center  text-slate-800 dark:text-white ">
                Failed to load dashboard.
            </div>
        );
    }

    const monthlyChartData =
        dashboard.monthlyIncome?.map((income) => {

            const expense = dashboard.monthlyExpense.find(
                (item) => item.month === income.month
            );

            return {
                month: income.month,
                income: Number(income.total),
                expense: expense ? Number(expense.total) : 0,
            };

        }) || [];

    const categoryData = dashboard.expenseByCategory || [];

    const recentTransactions = [
        ...(dashboard?.recentIncome || []).map((item) => ({
            ...item,
            type: "income",
        })),
        ...(dashboard?.recentExpense || []).map((item) => ({
            ...item,
            type: "expense",
        })),
    ]
        .sort(
            (a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 5);

    return (
        <div className="space-y-6">

            {/* Heading */}
            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-slate-800  dark:text-white mt-15">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                        Here's your financial overview
                    </p>
                </div>

                <div className="relative flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 shadow-sm mt-15 transition-colors duration-300">
                    <button
                        type="button"
                        aria-label="Choose month"
                        onClick={() => {
                            if (monthInputRef.current?.showPicker) {
                                monthInputRef.current.showPicker();
                            } else {
                                monthInputRef.current?.focus();
                            }
                        }}
                        className="cursor-pointer"
                    >
                        <CalendarDays size={16} />
                    </button>
                    <input
                        ref={monthInputRef}
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="
                        ml-2
                        bg-transparent
                        outline-none
                        text-slate-700
                        dark:text-white
                        dark:[color-scheme:dark]
                        [&::-webkit-calendar-picker-indicator]:opacity-0
                        [&::-webkit-calendar-picker-indicator]:absolute
                        [&::-webkit-calendar-picker-indicator]:pointer-events-none"
                        />
                </div>

            </div>


            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard
                    title="Total Income"
                    amount={`₹${dashboard.summary.totalIncome.toLocaleString("en-IN")}`}
                    description="+12.5% compared to last month"
                    icon={<ArrowUpRight size={18} />}
                    iconClass="bg-green-50 text-green-600"
                />
                <SummaryCard
                    title="Total Expenses"
                    amount={`₹${dashboard.summary.totalExpense.toLocaleString("en-IN")}`}
                    description="+4.8% compared to last month"
                    icon={<ArrowDownRight size={18} />}
                    iconClass="bg-red-50 text-red-500"
                />
                <SummaryCard
                    title="Total Balance"
                    amount={`₹${dashboard.summary.balance.toLocaleString("en-IN")}`}
                    description="+8.2% compared to last month"
                    icon={<Wallet size={18} />}
                    iconClass="bg-blue-50 text-blue-600"
                />
                <SummaryCard
                    title="Transactions"
                    amount={
                        dashboard.summary.incomeCount +
                        dashboard.summary.expenseCount
                    }
                    description={`${dashboard.summary.expenseCount} expenses · ${dashboard.summary.incomeCount} income`}
                    icon={<CreditCard size={18} />}
                    iconClass="bg-purple-50 text-purple-600"
                />
            </div>

            {/* Charts */}
            <div className="w-full px-6 py-4">
                <div className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 transition-colors duration-300">

                    <div className="mb-5">
                        <h2 className="font-semibold text-slate-800 dark:text-white">
                            Income & Expenses
                        </h2>

                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                            Monthly financial overview
                        </p>
                    </div>

                    <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyChartData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#eef1f5"
                                />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="income"
                                    fill="#6366f1"
                                    radius={[5, 5, 0, 0]}
                                />
                                <Bar
                                    dataKey="expense"
                                    fill="#f59e0b"
                                    radius={[5, 5, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
            {/* Recent Transactions */}

            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-colors duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 px-5 py-4">
                    <div>
                        <h2 className="font-semibold text-slate-800 dark:text-white">
                            Recent Transactions
                        </h2>
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                            Your latest income and expenses
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/transactions")}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                        View All
                    </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {recentTransactions.map((transaction, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div className="flex items-center gap-3">

                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full
                    ${transaction.type === "income"
                                            ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                            : "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                                        }`}
                                >

                                    {transaction.type === "income"
                                        ? <ArrowUpRight size={18} />
                                        : <ArrowDownRight size={18} />
                                    }

                                </div>

                                <div>

                                    <p className="text-sm font-medium text-slate-700 dark:text-white">
                                        {transaction.title}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                        {transaction.type === "income"
                                            ? transaction.source
                                            : transaction.category}
                                        {" • "}
                                        {new Date(transaction.date).toLocaleDateString("en-IN")}
                                    </p>

                                </div>

                            </div>

                            <p
                                className={`text-sm font-semibold ${transaction.type === "income"
                                    ? "text-green-600"
                                    : "text-red-500"
                                    }`}
                            >
                                {transaction.type === "income" ? "+" : "-"}₹
                                {Number(transaction.amount).toLocaleString("en-IN")}
                            </p>

                        </div>


                    ))}
                </div>

            </div>

        </div>
    );
};

export default Dashboard;
