import {
    ArrowDownToLine,
    CalendarDays,
    Edit,
    Plus,
    Search,
    Trash2,
    Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    addIncome,
    deleteIncome,
    getAllIncome,
    updateIncome
} from "../services/incomeService.js";


const Income = () => {

    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [incomeList, setIncomeList] = useState([]);
    const [editingIncome, setEditingIncome] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );


    const [newIncome, setNewIncome] = useState({
        title: "",
        source: "",
        amount: "",
        date: "",
    });

    useEffect(() => {
        fetchIncome(selectedMonth);
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

    const filteredIncome = incomeList.filter(
        (income) =>
            income.title.toLowerCase().includes(search.toLowerCase()) ||
            income.source.toLowerCase().includes(search.toLowerCase())
    );

    const totalIncome = incomeList.reduce(
        (total, income) => total + Number(income.amount),
        0
    );

    const thisMonthIncome = totalIncome;

    const handleChange = (e) => {
        setNewIncome({
            ...newIncome,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddIncome = async () => {
        if (
            !newIncome.title ||
            !newIncome.source ||
            !newIncome.amount ||
            !newIncome.date
        ) {
            alert("Please fill all fields");
            return;
        }
        try {
            await addIncome(newIncome);
            fetchIncome();
            setNewIncome({
                title: "",
                source: "",
                amount: "",
                date: "",
            });
            setOpenModal(false);
        } catch (error) {
            console.log(error);
            alert("Unable to add Income.")
        }
    };


    const handleEdit = (income) => {
        setIsEditMode(true);
        setEditingIncome(income);
        setNewIncome({
            title: income.title,
            source: income.source,
            amount: income.amount,
            date: income.date,
        });
        setOpenModal(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this income?"
        );
        if (!confirmDelete) return;
        try {
            await deleteIncome(id);
            fetchIncome();
        } catch (error) {
            console.log(error);
            alert("Unable to delete Income.");
        }
    };

    const handleUpdateIncome = async () => {
        try {
            await updateIncome(
                editingIncome.id,
                newIncome
            );
            fetchIncome();
            setOpenModal(false);
            setEditingIncome(null);
            setIsEditMode(false);
            setNewIncome({
                title: "",
                source: "",
                amount: "",
                date: "",
            });
        } catch (error) {
            console.log(error);
            alert("Unable to update Income.")
        }
    };

    if (loading) {
        return (
            <div className="mt-20 flex justify-center">
                <h2 className="text-lg font-semibold text-slate-800">
                    Loading Income...
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
                        Income
                    </h1>

                    <p className="mt-1 text-sm text-slate-400">
                        Manage and track all your income
                    </p>
                </div>

                <button
                    onClick={() => {
                        setIsEditMode(false);
                        setEditingIncome(null);
                        setNewIncome({
                            title: "",
                            source: "",
                            amount: "",
                            date: "",
                        });
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

                <div className="rounded-xl border border-slate-200 bg-white p-5">

                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-slate-400">
                                Total Income
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-slate-800">
                                ₹{totalIncome.toLocaleString("en-IN")}
                            </h2>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
                            <Wallet size={20} />
                        </div>

                    </div>

                </div>


                <div className="rounded-xl border border-slate-200 bg-white p-5">

                    <p className="text-sm text-slate-400">
                        Selected Month
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-800">
                        ₹{thisMonthIncome.toLocaleString("en-IN")}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        Income for the selected month
                    </p>

                </div>


                <div className="rounded-xl border border-slate-200 bg-white p-5">

                    <p className="text-sm text-slate-400">
                        Income Records
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-slate-800">
                        {incomeList.length}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        Total transactions
                    </p>

                </div>

            </div>


            {/* Table Card */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                {/* Filters */}
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center">

                    <div>
                        <h2 className="font-semibold text-slate-800">
                            Income Transactions
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            View and manage your income records
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
                                placeholder="Search income..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 sm:w-52"
                            />

                        </div>

                        <label className="relative flex items-center rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600">
                            <CalendarDays size={16} />
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="ml-2 bg-transparent outline-none"
                            />
                        </label>

                    </div>

                </div>


                {/* Table */}
                <div className="overflow-x-auto">

                    <table className="w-full min-w-[700px]">

                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/70">

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Income
                                </th>

                                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Source
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

                            {filteredIncome.map((income) => (

                                <tr
                                    key={income.id}
                                    className="border-b border-slate-100 transition hover:bg-slate-50/50"
                                >

                                    <td className="px-5 py-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
                                                <ArrowDownToLine size={17} />
                                            </div>

                                            <div>

                                                <p className="text-sm font-medium text-slate-700">
                                                    {income.title}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Income
                                                </p>

                                            </div>

                                        </div>

                                    </td>


                                    <td className="px-5 py-4">

                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                            {income.source}
                                        </span>

                                    </td>


                                    <td className="px-5 py-4 text-sm text-slate-500">
                                        {new Date(income.date).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>


                                    <td className="px-5 py-4 text-right">

                                        <span className="text-sm font-semibold text-green-600">
                                            +₹{Number(income.amount).toLocaleString("en-IN")}
                                        </span>

                                    </td>


                                    <td className="px-5 py-4">

                                        <div className="flex justify-center gap-2">

                                            <button
                                                onClick={() => handleEdit(income)}
                                                className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <Edit size={16} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(income.id)}
                                                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
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

                        <p className="text-sm text-slate-500">
                            No income records found.
                        </p>

                    </div>

                )}

            </div>
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

                        <h2 className="mb-5 text-xl font-semibold">
                            {isEditMode ? "Edit Income" : "Add Income"}
                        </h2>

                        <div className="space-y-4">

                            <input
                                type="text"
                                name="title"
                                placeholder="Income Title"
                                value={newIncome.title}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                            />

                            <input
                                type="text"
                                name="source"
                                placeholder="Source"
                                value={newIncome.source}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                            />

                            <input
                                type="number"
                                name="amount"
                                placeholder="Amount"
                                value={newIncome.amount}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                            />

                            <input
                                type="date"
                                name="date"
                                value={newIncome.date}
                                onChange={handleChange}
                                className="w-full rounded-lg border p-3"
                            />

                        </div>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                onClick={() => {
                                    setOpenModal(false);
                                    setIsEditMode(false);
                                    setEditingIncome(null);
                                    setNewIncome({
                                        title: "",
                                        source: "",
                                        amount: "",
                                        date: "",
                                    });
                                }}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
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
