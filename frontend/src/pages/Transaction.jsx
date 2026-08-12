import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../services/dashboardService";
import { errorToast } from "../utils/swal";

const Transactions = () => {
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const selectedMonth = new Date().toISOString().slice(0, 7);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);

            const dashboard = await getDashboard(selectedMonth);

            const incomeTransactions = (dashboard.recentIncome || []).map(
                (item) => ({
                    ...item,
                    type: "income",
                })
            );

            const expenseTransactions = (dashboard.recentExpense || []).map(
                (item) => ({
                    ...item,
                    type: "expense",
                })
            );

            const allTransactions = [
                ...incomeTransactions,
                ...expenseTransactions,
            ].sort(
                (a, b) =>
                    new Date(b.createdAt || b.date) -
                    new Date(a.createdAt || a.date)
            );

            setTransactions(allTransactions);
        } catch (error) {
            console.error("Transactions Error:", error);

            errorToast(
                "Transactions Error",
                "Unable to load transactions."
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                transaction.title?.toLowerCase().includes(searchText) ||
                transaction.category?.toLowerCase().includes(searchText) ||
                transaction.source?.toLowerCase().includes(searchText);

            const matchesType =
                typeFilter === "all" ||
                transaction.type === typeFilter;

            return matchesSearch && matchesType;
        });
    }, [transactions, search, typeFilter]);

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="mt-15 flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                        All Transactions
                    </h1>

                    <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                        View and manage all your income and expenses
                    </p>
                </div>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                    Back to Dashboard
                </button>

            </div>

            {/* Filters */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                    {/* Search */}
                    <div className="flex w-full items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 md:w-[350px]">

                        <Search
                            size={17}
                            className="text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-transparent text-sm text-slate-700 dark:text-white outline-none"
                        />

                    </div>

                    {/* Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm text-slate-700 dark:text-white outline-none"
                    >
                        <option value="all">All Transactions</option>
                        <option value="income">Income</option>
                        <option value="expense">Expenses</option>
                    </select>

                </div>

            </div>

            {/* Transactions */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">

                <div className="border-b border-slate-100 dark:border-slate-700 px-5 py-4">

                    <h2 className="font-semibold text-slate-800 dark:text-white">
                        Transactions
                    </h2>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        {filteredTransactions.length} transaction(s) found
                    </p>

                </div>

                {loading ? (

                    <div className="p-10 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Loading transactions...
                        </p>
                    </div>

                ) : filteredTransactions.length === 0 ? (

                    <div className="p-10 text-center">

                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            No transactions found
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            Try changing your search or filter.
                        </p>

                    </div>

                ) : (

                    <div className="divide-y divide-slate-100 dark:divide-slate-700">

                        {filteredTransactions.map((transaction, index) => (

                            <div
                                key={`${transaction.type}-${transaction.id || index}`}
                                className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30"
                            >

                                {/* Left */}
                                <div className="flex items-center gap-3">

                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                            transaction.type === "income"
                                                ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                                : "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                                        }`}
                                    >
                                        {transaction.type === "income" ? (
                                            <ArrowUpRight size={18} />
                                        ) : (
                                            <ArrowDownRight size={18} />
                                        )}
                                    </div>

                                    <div>

                                        <p className="text-sm font-medium text-slate-700 dark:text-white">
                                            {transaction.title}
                                        </p>

                                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">

                                            <span>
                                                {transaction.type === "income"
                                                    ? transaction.source
                                                    : transaction.category}
                                            </span>

                                            <span>•</span>

                                            <CalendarDays size={12} />

                                            <span>
                                                {new Date(
                                                    transaction.date ||
                                                    transaction.createdAt
                                                ).toLocaleDateString("en-IN")}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                {/* Amount */}
                                <p
                                    className={`text-sm font-semibold ${
                                        transaction.type === "income"
                                            ? "text-green-600"
                                            : "text-red-500"
                                    }`}
                                >
                                    {transaction.type === "income"
                                        ? "+"
                                        : "-"}
                                    ₹
                                    {Number(
                                        transaction.amount
                                    ).toLocaleString("en-IN")}
                                </p>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default Transactions;