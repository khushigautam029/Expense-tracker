import {
    CalendarDays,
    Clapperboard,
    Edit,
    GraduationCap,
    HeartPulse,
    Home,
    Plane,
    Plus,
    Receipt,
    Search,
    ShoppingBag,
    Trash2,
    TrendingUp,
    Utensils,
} from "lucide-react";

import { useEffect, useState } from "react";
import {
    addExpense,
    deleteExpense,
    getExpenses,
    updateExpense,
} from "../services/expenseService";

const Expenses = () => {

    const [search, setSearch] = useState("");
    const [expenseList, setExpenseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const currentMonth = new Date().toISOString().slice(0, 7);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);


    useEffect(() => {
        fetchExpenses(selectedMonth);
    }, [selectedMonth]);

    const fetchExpenses = async (month = selectedMonth) => {
        setLoading(true);
        try {
            const data = await getExpenses(month);
            setExpenseList(data.expenses || data);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const [newExpense, setNewExpense] = useState({
        title: "",
        category: "",
        amount: "",
        date: "",
        notes: "",
    });

    const filteredExpenses = expenseList.filter(
        (expense) =>
            expense.title.toLowerCase().includes(search.toLowerCase()) ||
            expense.category.toLowerCase().includes(search.toLowerCase())
    );

    const totalExpenses = expenseList.reduce(
        (total, expense) => total + Number(expense.amount),
        0
    );


    const thisMonthExpense = totalExpenses;

    const handleChange = (e) => {
        setNewExpense({
            ...newExpense,
            [e.target.name]: e.target.value,
        });
    };

    const getIcon = (category) => {
        switch (category) {
            case "Food":
                return Utensils;

            case "Travel":
                return Plane;

            case "Shopping":
                return ShoppingBag;

            case "Bills":
                return Receipt;

            case "Health":
                return HeartPulse;

            case "Education":
                return GraduationCap;

            case "Entertainment":
                return Clapperboard;

            case "Investment":
                return TrendingUp;

            default:
                return Home;
        }
    };

    const handleAddExpense = async () => {
        if (
            !newExpense.title ||
            !newExpense.category ||
            !newExpense.amount ||
            !newExpense.date
        ) {
            alert("Please fill all fields");
            return;
        }

        try {
            await addExpense(newExpense);
            fetchExpenses();
            setOpenModal(false);
            setNewExpense({
                title: "",
                category: "",
                amount: "",
                date: "",
                notes: "",
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleEdit = (expense) => {
        setIsEditMode(true);
        setEditingExpense(expense);

        setNewExpense({
            title: expense.title,
            category: expense.category,
            amount: expense.amount,
            date: expense.date,
            notes: expense.notes,
        });

        setOpenModal(true);
    };

    const handleUpdateExpense = async () => {
        try {
            await updateExpense(editingExpense.id, newExpense);
            fetchExpenses();
            setOpenModal(false);
            setEditingExpense(null);
            setIsEditMode(false);
            setNewExpense({
                title: "",
                category: "",
                amount: "",
                date: "",
                notes: "",
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this expense?")) return;

        try {
            await deleteExpense(id);
            fetchExpenses();
        } catch (err) {
            console.log(err);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center mt-20">
                <h2 className="text-lg font-semibold text-slate-800">
                    Loading Expenses...
                </h2>
            </div>
        )
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                    <h1 className="text-2xl font-bold text-slate-800 mt-15">
                        Expenses
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
                        Track and manage your daily expenses
                    </p>
                </div>

                <button
                    onClick={() => {
                        setIsEditMode(false);
                        setEditingExpense(null);

                        setNewExpense({
                            title: "",
                            category: "",
                            amount: "",
                            date: "",
                            notes: "",
                        });

                        setOpenModal(true);
                    }}
                    className="mt-15 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Expense
                </button>

            </div>


            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-xl border border-slate-200 bg-white p-5">

                    <p className="text-sm text-slate-400">
                        Total Expenses
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-800">
                        ₹{totalExpenses.toLocaleString("en-IN")}
                    </h2>

                </div>


                <div className="rounded-xl border border-slate-200 bg-white p-5">

                    <p className="text-sm text-slate-400">
                        Selected Month
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-800">
                        ₹{thisMonthExpense.toLocaleString("en-IN")}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        Expenses for the selected month
                    </p>

                </div>


                <div className="rounded-xl border border-slate-200 bg-white p-5">

                    <p className="text-sm text-slate-400">
                        Expense Records
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-800">
                        {expenseList.length}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        Total transactions
                    </p>

                </div>

            </div>


            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center">

                    <div>

                        <h2 className="font-semibold text-slate-800">
                            Expense Transactions
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            View and manage your expenses
                        </p>

                    </div>


                    <div className="flex flex-col gap-3 sm:flex-row">

                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">

                            <Search
                                size={17}
                                className="text-slate-400"
                            />

                            <input
                                type="text"
                                placeholder="Search expenses..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 sm:w-52"
                            />

                        </div>


                        <div className="relative">

                            <CalendarDays
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="rounded-lg border border-slate-200 py-2 pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                            />

                        </div>

                    </div>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full min-w-[700px]">

                        <thead>

                            <tr className="border-b border-slate-100 bg-slate-50/70">

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Expense
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Category
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Date
                                </th>

                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Amount
                                </th>

                                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredExpenses.map((expense) => {

                                const Icon = getIcon(expense.category);
                                return (

                                    <tr
                                        key={expense.id}
                                        className="border-b border-slate-100 transition hover:bg-slate-50/50"
                                    >

                                        <td className="px-5 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500">

                                                    <Icon size={17} />

                                                </div>

                                                <div>

                                                    <p className="text-sm font-medium text-slate-700">
                                                        {expense.title}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        {expense.notes}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        <td className="px-5 py-4">

                                            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                                                {expense.category}
                                            </span>

                                        </td>


                                        <td className="px-5 py-4 text-sm text-slate-500">
                                            {new Date(expense.date).toLocaleDateString("en-IN", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>


                                        <td className="px-5 py-4 text-right">

                                            <span className="text-sm font-semibold text-red-500">
                                                -₹{Number(expense.amount).toLocaleString("en-IN")}
                                            </span>

                                        </td>


                                        <td className="px-5 py-4">

                                            <div className="flex justify-center gap-2">

                                                <button
                                                    onClick={() => handleEdit(expense)}
                                                    className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Edit size={16} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(expense.id)}
                                                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                );
                            })}

                        </tbody>

                    </table>

                </div>


                {filteredExpenses.length === 0 && (

                    <div className="px-5 py-12 text-center">

                        <p className="text-sm text-slate-500">
                            No expenses found.
                        </p>

                    </div>

                )}

            </div>
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

                        <h2 className="mb-5 text-xl font-semibold">
                            {isEditMode ? "Edit Expense" : "Add Expense"}
                        </h2>

                        <div className="space-y-4">

                            <input
                                type="text"
                                name="title"
                                placeholder="Expense Title"
                                value={newExpense.title}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                            />

                            <input
                                type="text"
                                name="category"
                                placeholder="Category"
                                value={newExpense.category}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                            />

                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={newExpense.amount}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                            />

                            <input
                                type="date"
                                name="date"
                                value={newExpense.date}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                            />

                            <textarea
                                name="notes"
                                placeholder="Notes"
                                value={newExpense.notes}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setOpenModal(false);
                                    setEditingExpense(null);
                                    setIsEditMode(false);

                                    setNewExpense({
                                        title: "",
                                        category: "",
                                        amount: "",
                                        date: "",
                                        notes: "",
                                    });
                                }}
                                className="rounded-lg border px-4 py-2"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    isEditMode
                                        ? handleUpdateExpense
                                        : handleAddExpense
                                }
                                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                            >
                                {isEditMode ? "Update Expense" : "Save Expense"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
