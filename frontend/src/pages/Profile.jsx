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

import { useEffect, useState } from "react";

import {
    changePassword,
    getProfile,
    updateProfile,
} from "../services/profileService";

import {
    errorAlert,
    successToast,
} from "../utils/swal";

const Profile = () => {

    // Stored user

    const storedUser =
        JSON.parse(localStorage.getItem("user")) || {};

    // States

    const [activeTab, setActiveTab] = useState("overview");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [form, setForm] = useState({
        name: storedUser?.name || "",
        email: storedUser?.email || "",
        bio:
            storedUser?.bio ||
            "Managing personal expenses and investments.",
        createdAt: storedUser?.createdAt || "",
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

    // Fetch profile when page loads

    useEffect(() => {
        fetchProfile();
    }, []);

    // Fetch Profile

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await getProfile();
            console.log("Profile Response:", response);
            if (response.success && response.user) {
                const user = response.user;
                setForm({
                    name: user.name || "",
                    email: user.email || "",
                    bio:
                        user.bio ||
                        "Managing personal expenses and investments.",
                    createdAt: user.createdAt || "",
                });
                // Keep localStorage updated
                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
            }
        } catch (error) {
            console.error(
                "Profile fetch error:",
                error
            );

            // If API fails, use localStorage data
            const localUser =
                JSON.parse(
                    localStorage.getItem("user")
                ) || {};

            setForm({
                name: localUser.name || "",
                email: localUser.email || "",
                bio:
                    localUser.bio ||
                    "Managing personal expenses and investments.",
                createdAt:
                    localUser.createdAt || "",
            });
        } finally {
            setLoading(false);
        }
    };

    // Profile input change

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;
        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };
    
    // Password input change

    const handlePasswordChange = (e) => {
        const {
            name,
            value,
        } = e.target;
        setPasswordForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // Update Profile

    const handleSave = async () => {
        if (!form.name.trim()) {
            errorAlert(
                "Invalid Name",
                "Name cannot be empty."
            );
            return;
        }
        try {
            setSavingProfile(true);
            const response = await updateProfile({
                name: form.name.trim(),
            });
            console.log(
                "Update Profile Response:",
                response
            );
            if (response.success) {
                const updatedUser =
                    response.user;
                setForm((previous) => ({
                    ...previous,
                    name:
                        updatedUser.name ||
                        previous.name,
                    email:
                        updatedUser.email ||
                        previous.email,
                    createdAt:
                        updatedUser.createdAt ||
                        previous.createdAt,

                    bio:
                        updatedUser.bio ||
                        previous.bio,
                }));
                // Update localStorage
                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                );
                setIsEditing(false);
                successToast(
                    "Profile updated successfully"
                );
            }
        } catch (error) {
            console.error(
                "Update profile error:",
                error
            );
            errorAlert(
                "Update Failed",
                error.response?.data?.message ||
                "Unable to update profile."
            );
        } finally {
            setSavingProfile(false);
        }
    };

    // Change Password

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        const {
            currentPassword,
            newPassword,
            confirmPassword,
        } = passwordForm;

        // Empty validation
        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {
            errorAlert(
                "Missing Fields",
                "Please fill all password fields."
            );
            return;
        }
        // Password length
        if (newPassword.length < 6) {
            errorAlert(
                "Invalid Password",
                "New password must be at least 6 characters long."
            );
            return;
        }
        // Confirm password
        if (newPassword !== confirmPassword) {
            errorAlert(
                "Password Mismatch",
                "New password and confirm password must match."
            );
            return;
        }
        try {
            setChangingPassword(true);
            const response =
                await changePassword({
                    currentPassword,
                    newPassword,
                    confirmPassword,
                });
            console.log(
                "Change Password Response:",
                response
            );
            if (response.success) {
                successToast(
                    "Password updated successfully"
                );
                // Clear password fields
                setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            }
        } catch (error) {
            console.error(
                "Password update error:",
                error
            );
            errorAlert(
                "Password Update Failed",
                error.response?.data?.message ||
                "Unable to update password."
            );
        } finally {
            setChangingPassword(false);
        }
    };

    // Cancel Profile Editing

    const handleCancel = () => {
        const localUser =
            JSON.parse(
                localStorage.getItem("user")
            ) || {};
        setForm({
            name: localUser.name || "",
            email: localUser.email || "",
            bio:
                localUser.bio ||
                "Managing personal expenses and investments.",
            createdAt:
                localUser.createdAt || "",
        });
        setIsEditing(false);
    };
    // Loading screen
    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }
    // UI
    return (
        <div className="w-full space-y-6 pb-12">
            {/* Header */}
            <div className="mt-15 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                            Account Settings
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Manage your personal profile details and security options.
                        </p>
                    </div>
                    {/* Action Buttons */}
                    <div>
                        {!isEditing ? (
                            <button
                                onClick={() =>
                                    setIsEditing(true)
                                }
                                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                                <Edit3 size={15} />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCancel}
                                    disabled={savingProfile}
                                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    <X size={15} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={savingProfile}
                                    className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                                >
                                    <Save size={15} />
                                    {savingProfile
                                        ? "Saving..."
                                        : "Save"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                {/* Tabs */}
                <div className="-mb-6 mt-6 flex border-t border-slate-100 pt-2 dark:border-slate-700">
                    <button
                        onClick={() =>
                            setActiveTab("overview")
                        }
                        className={`border-b-2 px-4 py-2.5 text-sm font-medium transition ${activeTab === "overview"
                                ? "border-slate-900 text-slate-900 dark:border-blue-400 dark:text-white"
                                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() =>
                            setActiveTab("security")
                        }
                        className={`border-b-2 px-4 py-2.5 text-sm font-medium transition ${activeTab === "security"
                                ? "border-slate-900 text-slate-900 dark:border-blue-400 dark:text-white"
                                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                            }`}
                    >
                        Security & Password
                    </button>
                </div>
            </div>

            {/* OVERVIEW */}
            {activeTab === "overview" && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Information */}
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
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
                                            className={`w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition ${isEditing
                                                    ? "border-slate-300 bg-white text-slate-700 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                                    : "border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
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
                                            disabled
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
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
                                            value={
                                                form.createdAt
                                                    ? new Date(
                                                        form.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )
                                                    : "Not available"
                                            }
                                            disabled
                                            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-500 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Side Panels */}
                    <div className="space-y-6">
                        {/* Account Status */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                Account Status
                            </h2>
                            <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck
                                        size={20}
                                        className="text-emerald-600"
                                    />
                                    <div>
                                        <p className="text-xs font-semibold text-slate-800 dark:text-white">
                                            Account Verified
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            Standard Access
                                        </p>
                                    </div>
                                </div>
                                <span className="rounded-md border border-emerald-200/60 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                    Active
                                </span>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                                Preferences
                            </h2>
                            <div className="mt-4 space-y-4">
                                {/* Email Notifications */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <Bell
                                            size={16}
                                            className="text-slate-400"
                                        />
                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                            Email Notifications
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSettings(
                                                (previous) => ({
                                                    ...previous,
                                                    emailNotifications:
                                                        !previous.emailNotifications,
                                                })
                                            )
                                        }
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${settings.emailNotifications
                                                ? "bg-slate-900 dark:bg-blue-600"
                                                : "bg-slate-200 dark:bg-slate-700"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${settings.emailNotifications
                                                    ? "translate-x-4"
                                                    : "translate-x-1"
                                                }`}
                                        />
                                    </button>
                                </div>
                                {/* Two Factor */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <KeyRound
                                            size={16}
                                            className="text-slate-400"
                                        />
                                        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                            Two-Factor Auth
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSettings(
                                                (previous) => ({
                                                    ...previous,
                                                    twoFactor:
                                                        !previous.twoFactor,
                                                })
                                            )
                                        }
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${settings.twoFactor
                                                ? "bg-slate-900 dark:bg-blue-600"
                                                : "bg-slate-200 dark:bg-slate-700"
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${settings.twoFactor
                                                    ? "translate-x-4"
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

            {/* SECURITY */}
            {activeTab === "security" && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
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
                    {/* IMPORTANT:
                        Using form removes browser warning:
                        Password field is not contained in a form
                    */}
                    <form onSubmit={handlePasswordUpdate}>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            {/* Current Password */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={
                                        passwordForm.currentPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                />
                            </div>
                            {/* New Password */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={
                                        passwordForm.newPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                />
                            </div>
                            {/* Confirm Password */}
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={
                                        passwordForm.confirmPassword
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-1 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        {/* Update Password Button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={changingPassword}
                                className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                <Check size={16} />
                                {changingPassword
                                    ? "Updating..."
                                    : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Profile;