import {
    ArrowDownToLine,
    CalendarDays,
    Edit,
    Plus,
    Search,
    Trash2,
    Wallet,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
    addIncome,
    deleteIncome,
    getAllIncome,
    updateIncome,
} from "../services/incomeService.js";

import {
    confirmDelete,
    errorToast,
    successAlert,
    warningAlert,
} from "../utils/swal";

import { getSources } from "../services/sourceService.js";

const Income = () => {
    const monthInputRef = useRef(null);

    // Get current year and month for boundary checks
    const today = new Date().toISOString().slice(0, 10);
    const currentMonth = new Date().toISOString().slice(0, 7);

    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [incomeList, setIncomeList] = useState([]);
    const [sources, setSources] = useState([]);
    const [editingIncome, setEditingIncome] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    // No month is selected initially, so the user can see every income record.
    const [selectedMonth, setSelectedMonth] = useState("");

    const [newIncome, setNewIncome] = useState({
        title: "",
        sourceId: "",
        amount: "",
        date: "",
    });

    // Track input validation errors
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchIncome(selectedMonth);
        fetchSources();
    }, [selectedMonth]);

    const fetchIncome = async (month = selectedMonth) => {
        setLoading(true);
        try {
            const data = await getAllIncome(month);
            setIncomeList(data.incomes || data);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const fetchSources = async () => {
        try {
            const data = await getSources();
            // console.log("Sources:", data);
            setSources(data);
        } catch (err) {
            console.log(err);
        }
    };

    // When no month is selected, retain all records. Otherwise show only that month.
    const monthlyIncomeList = incomeList.filter((income) => {
        if (!selectedMonth) return true;
        if (!income.date) return false;
        const incomeMonth = income.date.slice(0, 7);
        return incomeMonth === selectedMonth;
    });

    // Filter by search query within the current view.
    const filteredIncome = monthlyIncomeList.filter(
        (income) =>
            income.title?.toLowerCase().includes(search.toLowerCase()) ||
            income.source?.name?.toLowerCase().includes(search.toLowerCase()) ||
            String(income.sourceId || "").toLowerCase().includes(search.toLowerCase())
    );

    // Sum overall total (or total of fetched records)
    const totalIncome = incomeList.reduce(
        (total, income) => total + Number(income.amount),
        0
    );

    // Total income for the selected month (or all records when no month is selected)
    const thisMonthIncome = monthlyIncomeList.reduce(
        (total, income) => total + Number(income.amount),
        0
    );

    // Validation helper
    const validateField = (name, value) => {
        let errorMsg = "";

        if (name === "title") {
            if (!value) {
                errorMsg = "Title is required";
            } else if (value.startsWith(" ") || value.endsWith(" ")) {
                errorMsg = "Title cannot start or end with a space";
            } else if (/\s{2,}/.test(value)) {
                errorMsg = "Title cannot contain multiple consecutive spaces";
            } else if (/^\d+$/.test(value.trim())) {
                errorMsg = "Title must contain letters, not just numbers";
            }
        }

        if (name === "sourceId") {
            if (!value) {
                errorMsg = "Please select a source";
            }
        }

        if (name === "amount") {
            if (value === "" || value === null || value === undefined) {
                errorMsg = "Amount is required";
            } else if (isNaN(value) || Number(value) < 0) {
                errorMsg = "Please enter a valid amount (0 or greater)";
            }
        }

        if (name === "date") {
            if (!value) {
                errorMsg = "Date is required";
            } else if (value > today) {
                errorMsg = "Date cannot be in the future";
            } else if (value < "1950-01-01") {
                errorMsg = "Date cannot be earlier than 1950";
            }
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: errorMsg,
        }));

        return errorMsg === "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewIncome({
            ...newIncome,
            [name]: value,
        });

        // Validate in real-time as user types
        validateField(name, value);
    };

    const validateAll = () => {
        const titleValid = validateField("title", newIncome.title);
        const sourceValid = validateField("sourceId", newIncome.sourceId);
        const amountValid = validateField("amount", newIncome.amount);
        const dateValid = validateField("date", newIncome.date);

        return titleValid && sourceValid && amountValid && dateValid;
    };

    const resetForm = () => {
        setNewIncome({
            title: "",
            sourceId: "",
            amount: "",
            date: "",
        });
        setErrors({});
    };

    const handleAddIncome = async () => {
        if (!validateAll()) {
            warningAlert(
                "Validation Error",
                "Please fix the highlighted errors before saving."
            );
            return;
        }

        try {
            await addIncome(newIncome);
            await successAlert(
                "Success",
                "Income added successfully."
            );
            fetchIncome();

            resetForm();
            setOpenModal(false);
        } catch (err) {
            console.log(err);

            errorToast(
                err.response?.data?.message || "Unable to add income."
            );
        }
    };

    const handleEdit = (income) => {
        setIsEditMode(true);
        setEditingIncome(income);
        setNewIncome({
            title: income.title,
            sourceId: income.sourceId,
            amount: income.amount,
            date: income.date ? income.date.slice(0, 10) : "",
        });
        setErrors({});
        setOpenModal(true);
    };

    const handleDelete = async (id) => {
        const result = await confirmDelete();

        if (!result.isConfirmed) return;
        try {
            await deleteIncome(id);
            await successAlert(
                "Deleted",
                "Income deleted successfully."
            );
            fetchIncome();
        } catch (error) {
            console.log(error);
            errorToast(
                "Delete Failed",
                "Unable to delete income."
            );
        }
    };

    const handleUpdateIncome = async () => {
        if (!validateAll()) {
            warningAlert(
                "Validation Error",
                "Please fix the highlighted errors before updating."
            );
            return;
        }

        try {
            await updateIncome(
                editingIncome.id,
                newIncome
            );
            await successAlert(
                "Updated",
                "Income updated successfully."
            );
            fetchIncome();
            setOpenModal(false);
            setEditingIncome(null);
            setIsEditMode(false);
            resetForm();
        } catch (error) {
            console.log(error);
            errorToast(
                "Update Failed",
                "Unable to update income."
            );
        }
    };

    if (loading) {
        return (
            <div className="mt-20 flex justify-center">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    Loading Income...
                </h2>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                    <h1 className="mt-15 text-2xl font-bold text-slate-800 dark:text-white">
                        Income
                    </h1>

                    <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                        Manage and track all your income
                    </p>
                </div>

                <button
                    onClick={() => {
                        setIsEditMode(false);
                        setEditingIncome(null);
                        resetForm();
                        setOpenModal(true);
                    }}
                    className="flex items-center justify-center mt-15 gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Add Income
                </button>

            </div>


            {/* Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-5 dark:bg-slate-800">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-400 dark:text-slate-500">
                                Total Income
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
                                ₹{totalIncome.toLocaleString("en-IN")}
                            </h2>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                            <Wallet size={20} />
                        </div>

                    </div>

                </div>


                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-5 dark:bg-slate-800">

                    <p className="text-sm text-slate-400 dark:text-slate-500">
                        {selectedMonth ? "Selected Month" : "All Time"}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
                        ₹{thisMonthIncome.toLocaleString("en-IN")}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {selectedMonth ? `Income for ${selectedMonth}` : "Income across all months"}
                    </p>

                </div>


                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-5 dark:bg-slate-800">

                    <p className="text-sm text-slate-400 dark:text-slate-500">
                        Income Records
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">
                        {monthlyIncomeList.length}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                        {selectedMonth ? "Transactions in selected month" : "All income transactions"}
                    </p>

                </div>

            </div>


            {/* Table Card */}
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">

                {/* Filters */}
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 dark:border-slate-700 p-5 md:flex-row md:items-center">

                    <div>
                        <h2 className="font-semibold text-slate-800 dark:text-white">
                            Income Transactions
                        </h2>

                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                            View and manage your income records
                        </p>
                    </div>


                    <div className="flex flex-col gap-3 sm:flex-row">

                        <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2">

                            <Search
                                size={17}
                                className="text-slate-400 dark:text-slate-500"
                            />

                            <input
                                type="text"
                                placeholder="Search income..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full bg-transparent text-sm outline-none text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 sm:w-52"
                            />

                        </div>

                        <div className="relative flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
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
                                min="1950-01"
                                max={currentMonth}
                                value={selectedMonth}
                                onKeyDown={(e) => e.preventDefault()}
                                onChange={(e) => {
                                    const month = e.target.value;
                                    if (!month || (month >= "1950-01" && month <= currentMonth)) {
                                        setSelectedMonth(month);
                                    }
                                }}
                                className="ml-2 bg-transparent outline-none text-slate-700 dark:text-white dark:[color-scheme:dark] dark:[&::-webkit-calendar-picker-indicator]:invert"
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


                {/* Table */}
                <div className="overflow-x-auto">

                    <table className="w-full min-w-[700px]">

                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900">

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    Income
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    Source
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    Date
                                </th>

                                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    Amount
                                </th>

                                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                                    Action
                                </th>

                            </tr>
                        </thead>


                        <tbody>

                            {filteredIncome.map((income) => (

                                <tr
                                    key={income.id}
                                    className="border-b border-slate-100 dark:border-slate-700 transition hover:bg-slate-50/50 dark:hover:bg-slate-800"
                                >

                                    <td className="px-5 py-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                                                <ArrowDownToLine size={17} />
                                            </div>

                                            <div>

                                                <p className="text-sm font-medium text-slate-700 dark:text-white">
                                                    {income.title}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                                    Income
                                                </p>

                                            </div>

                                        </div>

                                    </td>


                                    <td className="px-5 py-4">

                                        <span className="rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                                            {income.source?.name}
                                        </span>

                                    </td>


                                    <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        {new Date(income.date).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>


                                    <td className="px-5 py-4 text-right">

                                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                            +₹{Number(income.amount).toLocaleString("en-IN")}
                                        </span>

                                    </td>


                                    <td className="px-5 py-4">

                                        <div className="flex justify-center gap-2">

                                            <button
                                                onClick={() => handleEdit(income)}
                                                className="rounded-lg p-2 text-slate-400 dark:text-slate-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
                                            >
                                                <Edit size={16} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(income.id)}
                                                className="rounded-lg p-2 text-slate-400 dark:text-slate-500 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {/* Empty State */}
                {filteredIncome.length === 0 && (

                    <div className="px-5 py-12 text-center">

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {selectedMonth
                                ? "No income records found for this month."
                                : "No income records found."}
                        </p>

                    </div>

                )}

            </div>
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 ">

                    <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-800 p-6 shadow-xl ">

                        <h2 className="mb-5 text-xl font-semibold text-slate-800 dark:text-white">
                            {isEditMode ? "Edit Income" : "Add Income"}
                        </h2>

                        <div className="space-y-4">

                            <div>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Income Title"
                                    value={newIncome.title}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border p-3 outline-none transition ${errors.title ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        }`}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                                )}
                            </div>

                            <div>
                                <select
                                    name="sourceId"
                                    value={newIncome.sourceId}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border p-3 outline-none transition ${errors.sourceId ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                                        }`}
                                >
                                    <option value="">Select Source</option>
                                    {sources.map((source) => (
                                        <option key={source.id} value={source.id}>
                                            {source.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.sourceId && (
                                    <p className="mt-1 text-xs text-red-500">{errors.sourceId}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Amount"
                                    min="0"
                                    value={newIncome.amount}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border p-3 outline-none transition ${errors.amount ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        }`}
                                />
                                {errors.amount && (
                                    <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
                                )}
                            </div>

                            <div>
                                <input
                                    type="date"
                                    name="date"
                                    min="1950-01-01"
                                    max={today}
                                    value={newIncome.date}
                                    onKeyDown={(e) => e.preventDefault()}
                                    onChange={handleChange}
                                    className={`w-full rounded-lg border p-3 outline-none transition ${errors.date ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        }`}
                                />
                                {errors.date && (
                                    <p className="mt-1 text-xs text-red-500">{errors.date}</p>
                                )}
                            </div>

                        </div>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                onClick={() => {
                                    setOpenModal(false);
                                    setIsEditMode(false);
                                    setEditingIncome(null);
                                    resetForm();
                                }}
                                className="rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={isEditMode ? handleUpdateIncome : handleAddIncome}
                                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                            >
                                {isEditMode ? "Update Income" : "Save Income"}
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </div>
    );
};

export default Income;