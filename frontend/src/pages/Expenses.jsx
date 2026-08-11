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

import {
    confirmDelete,
    errorToast,
    successAlert,
    warningAlert,
} from "../utils/swal";

import { useEffect, useRef, useState } from "react";
import {
    addExpense,
    deleteExpense,
    getExpenses,
    updateExpense,
} from "../services/expenseService";

const Expenses = () => {

    const monthInputRef = useRef(null);
    const [search, setSearch] = useState("");
    const [expenseList, setExpenseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const today = new Date().toISOString().slice(0, 10);
    const currentMonth = new Date().toISOString().slice(0, 7);
    // Start with every record visible. A month is applied only after the user chooses one.
    const [selectedMonth, setSelectedMonth] = useState("");

    const initialExpenseState = {
        title: "",
        category: "",
        amount: "",
        date: "",
        notes: "",
    };

    const [newExpense, setNewExpense] = useState(initialExpenseState);
    const [errors, setErrors] = useState({});

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

    const resetModalForm = () => {
        setNewExpense(initialExpenseState);
        setErrors({});
    };

    // Helper functions for character, numeric, and spacing validation
    const isPurelyNumeric = (val) => /^\d+$/.test(val.trim());
    const containsLetters = (val) => /[a-zA-Z]/.test(val);
    
    // Checks for leading spaces, trailing spaces, or multiple consecutive middle spaces
    const validateSpacing = (val) => {
        if (!val) return null;
        if (/^\s/.test(val)) return "Leading spaces are not allowed.";
        if (/\s$/.test(val)) return "Trailing spaces are not allowed.";
        if (/\s{2,}/.test(val)) return "Multiple consecutive spaces are not allowed.";
        return null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validate text fields: title, category, notes
        if (["title", "category", "notes"].includes(name)) {
            const spaceError = validateSpacing(value);
            if (spaceError) {
                setErrors((prev) => ({ ...prev, [name]: spaceError }));
            } else if (value !== "" && isPurelyNumeric(value)) {
                setErrors((prev) => ({
                    ...prev,
                    [name]: "This field must contain text/letters, not just numbers.",
                }));
            } else {
                setErrors((prev) => ({ ...prev, [name]: null }));
            }
        }

        // Validate Amount field (Allows 0 and positive numbers)
        if (name === "amount") {
            if (value !== "" && (isNaN(value) || Number(value) < 0)) {
                setErrors((prev) => ({
                    ...prev,
                    amount: "Amount must be zero or a positive number.",
                }));
            } else {
                setErrors((prev) => ({ ...prev, amount: null }));
            }
        }

        if (name === "date") {
            const dateError =
                value && value < "1950-01-01"
                    ? "Date cannot be earlier than 1950."
                    : value && value > today
                        ? "Date cannot be in the future."
                        : null;
            setErrors((prev) => ({ ...prev, date: dateError }));
        }

        setNewExpense((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Title validation
        if (!newExpense.title) {
            newErrors.title = "Expense title is required.";
        } else {
            const spaceErr = validateSpacing(newExpense.title);
            if (spaceErr) {
                newErrors.title = spaceErr;
            } else if (!containsLetters(newExpense.title)) {
                newErrors.title = "Title must contain text/letters.";
            }
        }

        // Category validation
        if (!newExpense.category) {
            newErrors.category = "Category is required.";
        } else {
            const spaceErr = validateSpacing(newExpense.category);
            if (spaceErr) {
                newErrors.category = spaceErr;
            } else if (!containsLetters(newExpense.category)) {
                newErrors.category = "Category must contain text/letters.";
            }
        }

        // Amount validation (Allows 0 or greater)
        if (newExpense.amount === "" || newExpense.amount === null || newExpense.amount === undefined) {
            newErrors.amount = "Amount is required.";
        } else if (isNaN(newExpense.amount) || Number(newExpense.amount) < 0) {
            newErrors.amount = "Amount must be zero or a positive number.";
        }

        // Date validation
        if (!newExpense.date) {
            newErrors.date = "Date is required.";
        } else if (newExpense.date < "1950-01-01") {
            newErrors.date = "Date cannot be earlier than 1950.";
        } else if (newExpense.date > today) {
            newErrors.date = "Date cannot be in the future.";
        }

        // Notes validation (Optional field, but checked if provided)
        if (newExpense.notes) {
            const spaceErr = validateSpacing(newExpense.notes);
            if (spaceErr) {
                newErrors.notes = spaceErr;
            } else if (!containsLetters(newExpense.notes)) {
                newErrors.notes = "Notes must contain text/letters.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
        if (!validateForm()) {
            warningAlert(
                "Validation Error",
                "Please fix the highlighted errors before submitting."
            );
            return;
        }

        try {
            await addExpense(newExpense);

            await successAlert(
                "Success",
                "Expense added successfully."
            );

            fetchExpenses();
            setOpenModal(false);
            resetModalForm();
        } catch (err) {
            console.log(err);
            errorToast("Failed", "Unable to add expense.");
        }
    };

    const handleEdit = (expense) => {
        setIsEditMode(true);
        setEditingExpense(expense);
        setErrors({});

        setNewExpense({
            title: expense.title || "",
            category: expense.category || "",
            amount: expense.amount !== undefined && expense.amount !== null ? expense.amount : "",
            date: expense.date ? expense.date.slice(0, 10) : "",
            notes: expense.notes || "",
        });

        setOpenModal(true);
    };

    const handleUpdateExpense = async () => {
        if (!validateForm()) {
            warningAlert(
                "Validation Error",
                "Please fix the highlighted errors before submitting."
            );
            return;
        }

        try {
            await updateExpense(editingExpense.id, newExpense);

            await successAlert(
                "Updated",
                "Expense updated successfully."
            );

            fetchExpenses();
            setOpenModal(false);
            setEditingExpense(null);
            setIsEditMode(false);
            resetModalForm();
        } catch (err) {
            console.log(err);
            errorToast("Update Failed", "Unable to update expense.");
        }
    };

    const handleDelete = async (id) => {
        const result = await confirmDelete();

        if (!result.isConfirmed) return;
        try {
            await deleteExpense(id);

            await successAlert(
                "Deleted",
                "Expense deleted successfully."
            );

            fetchExpenses();
        } catch (err) {
            console.log(err);
            errorToast("Delete Failed", "Unable to delete expense.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center mt-20">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Loading Expenses...
                </h2>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white mt-15">
                        Expenses
                    </h1>
                    <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                        Track and manage your daily expenses
                    </p>
                </div>

                <button
                    onClick={() => {
                        setIsEditMode(false);
                        setEditingExpense(null);
                        resetModalForm();
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
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                    <p className="text-sm text-slate-400 dark:text-slate-500">Total Expenses</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
                        ₹{totalExpenses.toLocaleString("en-IN")}
                    </h2>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                        {selectedMonth ? "Selected Month" : "All Time"}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
                        ₹{thisMonthExpense.toLocaleString("en-IN")}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {selectedMonth ? `Expenses for ${selectedMonth}` : "Expenses across all months"}
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                    <p className="text-sm text-slate-400 dark:text-slate-500">Expense Records</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
                        {expenseList.length}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        Total transactions
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 dark:border-slate-700 p-5 md:flex-row md:items-center">
                    <div>
                        <h2 className="font-semibold text-slate-800 dark:text-white">
                            Expense Transactions
                        </h2>
                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                            View and manage your expenses
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2">
                            <Search size={17} className="text-slate-400 dark:text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search expenses..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-transparent text-sm text-slate-700 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 sm:w-52"
                            />
                        </div>

                        <div className="relative">
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
                                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 cursor-pointer text-slate-500 dark:text-slate-400"
                            >
                                <CalendarDays size={16} />
                            </button>
                            <input
                                ref={monthInputRef}
                                type="month"
                                min="1950-01"
                                max={currentMonth}
                                value={selectedMonth}
                                onChange={(e) => {
                                    const month = e.target.value;
                                    if (!month || (month >= "1950-01" && month <= currentMonth)) {
                                        setSelectedMonth(month);
                                    }
                                }}
                                onKeyDown={(e) => e.preventDefault()}
                                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2 pl-10 pr-3 text-sm text-slate-700 dark:text-white outline-none focus:border-blue-500 dark:[color-scheme:dark] dark:[&::-webkit-calendar-picker-indicator]:invert"
                            />
                            {selectedMonth && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedMonth("")}
                                    className="ml-2 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                >
                                    All
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900">
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
                                        className="border-b border-slate-100 dark:border-slate-700 transition hover:bg-slate-50/50 dark:hover:bg-slate-800"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400">
                                                    <Icon size={17} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700 dark:text-white">
                                                        {expense.title}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                        {expense.notes}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-orange-50 dark:bg-orange-900/30 px-3 py-1 text-xs font-medium text-orange-600 dark:text-orange-400">
                                                {expense.category}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
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
                                                    className="rounded-lg p-2 text-slate-400 dark:text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(expense.id)}
                                                    className="rounded-lg p-2 text-slate-400 dark:text-slate-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
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
                        <p className="text-sm text-slate-500 dark:text-slate-400">No expenses found.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-800 p-6 shadow-xl">
                        <h2 className="mb-5 text-xl font-semibold text-slate-800 dark:text-white">
                            {isEditMode ? "Edit Expense" : "Add Expense"}
                        </h2>

                        <div className="space-y-4">
                            {/* Title Field */}
                            <div>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Expense Title"
                                    value={newExpense.title}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border p-3 outline-none transition ${
                                        errors.title
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-white focus:border-blue-500"
                                    }`}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                                )}
                            </div>

                            {/* Category Field */}
                            <div>
                                <input
                                    type="text"
                                    name="category"
                                    placeholder="Category"
                                    value={newExpense.category}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border p-3 outline-none transition ${
                                        errors.category
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-white focus:border-blue-500"
                                    }`}
                                />
                                {errors.category && (
                                    <p className="mt-1 text-xs text-red-500">{errors.category}</p>
                                )}
                            </div>

                            {/* Amount Field */}
                            <div>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Amount"
                                    min="0"
                                    value={newExpense.amount}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border p-3 outline-none transition ${
                                        errors.amount
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-white focus:border-blue-500"
                                    }`}
                                />
                                {errors.amount && (
                                    <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
                                )}
                            </div>

                            {/* Date Field */}
                            <div>
                                <input
                                    type="date"
                                    name="date"
                                    min="1950-01-01"
                                    max={today}
                                    value={newExpense.date}
                                    onChange={handleChange}
                                    onKeyDown={(e) => e.preventDefault()}
                                    className={`w-full rounded-lg border p-3 outline-none transition ${
                                        errors.date
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-white focus:border-blue-500"
                                    }`}
                                />
                                {errors.date && (
                                    <p className="mt-1 text-xs text-red-500">{errors.date}</p>
                                )}
                            </div>

                            {/* Notes Field */}
                            <div>
                                <textarea
                                    name="notes"
                                    placeholder="Notes"
                                    value={newExpense.notes}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border p-3 outline-none transition ${
                                        errors.notes
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-white focus:border-blue-500"
                                    }`}
                                />
                                {errors.notes && (
                                    <p className="mt-1 text-xs text-red-500">{errors.notes}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setOpenModal(false);
                                    setEditingExpense(null);
                                    setIsEditMode(false);
                                    resetModalForm();
                                }}
                                className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    isEditMode ? handleUpdateExpense : handleAddExpense
                                }
                                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition"
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
