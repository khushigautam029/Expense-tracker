import {
    Bell,
    CalendarDays,
    Check,
    Edit3,
    KeyRound,
    Lock,
    Mail,
    Save,
    ShieldCheck,
    User,
    X,
} from "lucide-react";
import { useState } from "react";

const Profile = () => {
    // Local state setup
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const [activeTab, setActiveTab] = useState("overview");
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        name: storedUser?.name || "Khushi Gautam",
        email: storedUser?.email || "khushi@gmail.com",
        bio: storedUser?.bio || "Managing personal expenses and investments.",
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [settings, setSettings] = useState({
        emailNotifications: true,
        twoFactor: false,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        const updatedUser = { ...storedUser, ...form };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setForm({
            name: storedUser?.name || "Khushi Gautam",
            email: storedUser?.email || "khushi@gmail.com",
            bio: storedUser?.bio || "Managing personal expenses and investments.",
        });
        setIsEditing(false);
    };

    return (
        <div className="w-full space-y-6 pb-12">
            {/* Header & Navigation Block */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm mt-15">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Account Settings
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage your personal profile details and security options.
                        </p>
                    </div>

                    {/* Action Controls */}
                    <div>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                <Edit3 size={15} />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                                >
                                    <X size={15} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:hover:bg-blue-700"
                                >
                                    <Save size={15} />
                                    Save
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="-mb-6 mt-6 flex border-t border-slate-100 dark:border-slate-700 pt-2">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`border-b-2 py-2.5 px-4 text-sm font-medium transition ${
                            activeTab === "overview"
                                ? "border-slate-900 dark:border-blue-400 text-slate-900 dark:text-white"
                                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                        }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("security")}
                        className={`border-b-2 py-2.5 px-4 text-sm font-medium transition ${
                            activeTab === "security"
                                ? "border-slate-900 dark:border-blue-400 text-slate-900 dark:text-white"
                                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                        }`}
                    >
                        Security & Password
                    </button>
                </div>
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {activeTab === "overview" && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Information */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                Personal Information
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                View and manage your profile details.
                            </p>

                            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                                {/* Name */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User
                                            size={16}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition ${
                                                isEditing
                                                    ? "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-white focus:border-slate-900 dark:focus:border-blue-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-blue-500"
                                                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail
                                            size={16}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition ${
                                                isEditing
                                                    ? "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-white focus:border-slate-900 dark:focus:border-blue-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-blue-500"
                                                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                                            }`}
                                        />
                                    </div>
                                </div>

                                {/* Member Since */}
                                <div className="md:col-span-2">
                                    <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Member Since
                                    </label>
                                    <div className="relative">
                                        <CalendarDays
                                            size={16}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                        <input
                                            type="text"
                                            value="July 2026"
                                            disabled
                                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-2 pl-9 pr-3 text-sm text-slate-500 dark:text-slate-400 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side Panels */}
                    <div className="space-y-6">
                        {/* Account Status */}
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                Account Status
                            </h2>
                            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={20} className="text-emerald-600" />
                                    <div>
                                        <p className="text-xs font-semibold text-slate-800 dark:text-white">
                                            Account Verified
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Standard Access
                                        </p>
                                    </div>
                                </div>
                                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
                                    Active
                                </span>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                Preferences
                            </h2>
                            <div className="mt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <Bell size={16} className="text-slate-400" />
                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                            Email Notifications
                                        </span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setSettings({
                                                ...settings,
                                                emailNotifications:
                                                    !settings.emailNotifications,
                                            })
                                        }
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                            settings.emailNotifications
                                                ? "bg-slate-900 dark:bg-blue-600"
                                                : "bg-slate-200 dark:bg-slate-700"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                                settings.emailNotifications
                                                    ? "translate-x-4.5"
                                                    : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <KeyRound size={16} className="text-slate-400" />
                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                            Two-Factor Auth
                                        </span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setSettings({
                                                ...settings,
                                                twoFactor: !settings.twoFactor,
                                            })
                                        }
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                            settings.twoFactor
                                                ? "bg-slate-900 dark:bg-blue-600"
                                                : "bg-slate-200 dark:bg-slate-700"
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                                settings.twoFactor
                                                    ? "translate-x-4.5"
                                                    : "translate-x-1"
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: SECURITY */}
            {activeTab === "security" && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                            <Lock size={18} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                Password & Security
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Update your account password regularly to remain secure.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Current Password
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-white outline-none transition focus:border-slate-900 dark:focus:border-blue-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-white outline-none transition focus:border-slate-900 dark:focus:border-blue-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-700 dark:text-white outline-none transition focus:border-slate-900 dark:focus:border-blue-500 focus:ring-1 focus:ring-slate-900 dark:focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button className="flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:hover:bg-blue-700">
                            <Check size={16} />
                            Update Password
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
