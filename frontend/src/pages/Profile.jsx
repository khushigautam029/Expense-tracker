import {
    CalendarDays,
    Edit,
    Lock,
    Mail,
    Save,
    ShieldCheck,
    User,
    X,
} from "lucide-react";
import { useState } from "react";

const Profile = () => {
    // Temporary user data
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name: storedUser?.name || "Khushi Gautam",
        email: storedUser?.email || "khushi@gmail.com",
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        const updatedUser = {
            ...storedUser,
            name: form.name,
            email: form.email,
        };
        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );
        setIsEditing(false);
    };

    const handleCancel = () => {
        setForm({
            name: storedUser?.name || "Khushi Gautam",
            email: storedUser?.email || "khushi@gmail.com",
        });
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 mt-15">
                        My Profile
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Manage your account information and security
                    </p>
                </div>

                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className=" mt-15 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        <Edit size={17} />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2 mt-15">
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                        >
                            <X size={17} />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <Save size={17} />
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Profile Card */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-3xl font-bold text-blue-600">
                            {form.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-slate-800">
                            {form.name}
                        </h2>
                        <p className="mt-1 text-sm text-slate-400">
                            Expense Tracker User
                        </p>
                    </div>

                    {/* Account Status */}
                    <div className="mt-6 border-t border-slate-100 pt-5">

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                                    <ShieldCheck size={18} />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-slate-700">
                                        Account Status
                                    </p>

                                    <p className="text-xs text-slate-400">
                                        Your account is active
                                    </p>
                                </div>

                            </div>

                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                                Active
                            </span>

                        </div>

                    </div>

                </div>


                {/* Personal Information */}
                <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">

                    <div className="mb-6">

                        <h2 className="font-semibold text-slate-800">
                            Personal Information
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Your basic account information
                        </p>

                    </div>


                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* Name */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-600">
                                Full Name
                            </label>

                            <div className="relative">

                                <User
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition ${
                                        isEditing
                                            ? "border-slate-300 bg-white focus:border-blue-500"
                                            : "border-slate-200 bg-slate-50 text-slate-500"
                                    }`}
                                />

                            </div>

                        </div>


                        {/* Email */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-600">
                                Email Address
                            </label>

                            <div className="relative">

                                <Mail
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition ${
                                        isEditing
                                            ? "border-slate-300 bg-white focus:border-blue-500"
                                            : "border-slate-200 bg-slate-50 text-slate-500"
                                    }`}
                                />

                            </div>

                        </div>


                        {/* Account Created */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-600">
                                Account Created
                            </label>

                            <div className="relative">

                                <CalendarDays
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value="29 July 2026"
                                    disabled
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-500 outline-none"
                                />

                            </div>

                        </div>


                        {/* Account Type */}
                        <div>

                            <label className="mb-2 block text-sm font-medium text-slate-600">
                                Account Type
                            </label>

                            <div className="relative">

                                <ShieldCheck
                                    size={17}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value="Personal"
                                    disabled
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-500 outline-none"
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* Security Section */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">

                <div className="mb-6 flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                        <Lock size={19} />
                    </div>

                    <div>

                        <h2 className="font-semibold text-slate-800">
                            Security
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Update your password
                        </p>

                    </div>

                </div>


                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                    {/* Current Password */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-600">
                            Current Password
                        </label>

                        <input
                            type="password"
                            name="currentPassword"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter current password"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                        />

                    </div>


                    {/* New Password */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-600">
                            New Password
                        </label>

                        <input
                            type="password"
                            name="newPassword"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter new password"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                        />

                    </div>


                    {/* Confirm Password */}
                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-600">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Confirm new password"
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500"
                        />

                    </div>

                </div>


                <div className="mt-5 flex justify-end">

                    <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">

                        <Lock size={16} />

                        Update Password

                    </button>

                </div>

            </div>


            {/* Account Information */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">

                <h2 className="font-semibold text-slate-800">
                    Account Information
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div className="rounded-lg bg-slate-50 p-4">

                        <p className="text-xs text-slate-400">
                            User ID
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                            #{storedUser?.id || "001"}
                        </p>

                    </div>


                    <div className="rounded-lg bg-slate-50 p-4">

                        <p className="text-xs text-slate-400">
                            Currency
                        </p>

                        <p className="mt-1 font-medium text-slate-700">
                            Indian Rupee (₹)
                        </p>

                    </div>


                    <div className="rounded-lg bg-slate-50 p-4">

                        <p className="text-xs text-slate-400">
                            Status
                        </p>

                        <p className="mt-1 font-medium text-green-600">
                            Active
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Profile;