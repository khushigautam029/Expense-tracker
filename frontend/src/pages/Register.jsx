import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
    Wallet,
} from "lucide-react";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import {
    closeAlert,
    errorAlert,
    loadingAlert,
    successAlert,
} from "../utils/swal";

import {
    validateConfirmPassword,
    validateEmail,
    validateName,
    validatePassword,
} from "../utils/validation";

const Register = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] =
        useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // ===============================
    // Handle Input Change
    // ===============================

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Disallow leading space or consecutive multiple spaces in name
        if (name === "name") {
            if (value.startsWith(" ")) return; // Prevent leading space
            if (value.includes("  ")) return;  // Prevent consecutive spaces
            if (value.length > 30) return;     // Name max 30 chars
        }

        const updatedForm = {
            ...form,
            [name]: value,
        };

        setForm(updatedForm);

        let error = "";

        switch (name) {

            case "name":
                error = validateName(value);
                break;

            case "email":
                error = validateEmail(value);
                break;

            case "password":

                error = validatePassword(value);

                setErrors((prev) => ({
                    ...prev,
                    confirmPassword:
                        updatedForm.confirmPassword
                            ? validateConfirmPassword(
                                value,
                                updatedForm.confirmPassword
                            )
                            : "",
                }));

                break;

            case "confirmPassword":

                error = validateConfirmPassword(
                    updatedForm.password,
                    value
                );

                break;

            default:
                break;
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));

    };

    // ===============================
    // Submit
    // ===============================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Cleaned payload with trimmed strings
        const trimmedForm = {
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            confirmPassword: form.confirmPassword,
        };

        const validationErrors = {
            name: validateName(form.name),
            email: validateEmail(form.email),
            password: validatePassword(form.password),
            confirmPassword: validateConfirmPassword(
                form.password,
                form.confirmPassword
            ),
        };

        setErrors(validationErrors);

        const hasError = Object.values(validationErrors).some(
            (error) => error !== ""
        );

        if (hasError) return;

        setLoading(true);

        try {
            loadingAlert();

            const response = await API.post(
                "/auth/register",
                trimmedForm,
                { timeout: 250000 }
            );

            closeAlert();

            await successAlert(
                "Registration Successful",
                response.data.message
            );

            // Route state is lost on a page refresh, so keep the pending email
            // until the verification succeeds.
            const email = response.data.email;

            sessionStorage.setItem(
                "verificationEmail",
                email
            );

            navigate("/verify-otp", {
                state: {
                    email,
                },
            });

        } catch (error) {

            if (error.response) {

                await errorAlert(
                    "Registration Failed",
                    error.response.data.message
                );

            } else if (error.code === "ECONNABORTED") {
                await errorAlert(
                    "Email Is Taking Too Long",
                    "The OTP email service did not respond in time. Please try again."
                );
            } else {
                await errorAlert(
                    "Registration Failed",
                    "Something went wrong. Please try again."
                );
            }
        }

        finally {
            closeAlert();
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen min-h-svh w-full items-center justify-center bg-slate-100 p-4 sm:p-6 overflow-hidden">

            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md transition-all">

                {/* Logo */}

                <div className="mb-4 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 shadow-inner">

                        <Wallet
                            size={28}
                            className="text-blue-600"
                        />

                    </div>

                    <h1 className="mt-3 text-2xl font-bold text-slate-800">
                        Create Account
                    </h1>

                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                        Sign up to start tracking your expenses
                    </p>

                </div>

                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-3.5"
                >

                    {/* Name */}

                    <div>

                        {/* Label & Character Counter ABOVE the input box */}

                        <div className="mb-1 flex items-center justify-between">

                            <label className="text-xs sm:text-sm font-medium text-slate-700">
                                Full Name
                            </label>

                            <span
                                className={`text-[11px] ${form.name.length === 30
                                    ? "text-red-500 font-medium"
                                    : "text-slate-400"
                                    }`}
                            >
                                {form.name.length}/30
                            </span>

                        </div>

                        {/* Input Box */}

                        <div className="relative">

                            <User
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={form.name}
                                onChange={handleChange}
                                className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-xs sm:text-sm outline-none transition-all
                                ${errors.name
                                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    }`}
                            />

                        </div>

                        {/* Validation Error Message BELOW the input box */}

                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.name}
                            </p>
                        )}

                    </div>

                    {/* Email */}

                    <div>

                        <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">
                            Email Address
                        </label>

                        <div className="relative">

                            <Mail
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-xs sm:text-sm outline-none transition-all
                                ${errors.email
                                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    }`}
                            />

                        </div>

                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.email}
                            </p>
                        )}

                    </div>

                    {/* Password */}

                    <div>

                        <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">
                            Password
                        </label>

                        <div className="relative">

                            <Lock
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create Password"
                                autoComplete="new-password"
                                value={form.password}
                                onChange={handleChange}
                                className={`w-full rounded-lg border py-2.5 pl-10 pr-10 text-xs sm:text-sm outline-none transition-all
                                ${errors.password
                                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    }`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                        </div>

                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.password}
                            </p>
                        )}

                    </div>

                    {/* Confirm Password */}

                    <div>

                        <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">
                            Confirm Password
                        </label>

                        <div className="relative">

                            <Lock
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className={`w-full rounded-lg border py-2.5 pl-10 pr-10 text-xs sm:text-sm outline-none transition-all
                                ${errors.confirmPassword
                                        ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                        : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    }`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                        </div>

                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.confirmPassword}
                            </p>
                        )}

                    </div>

                    {/* Terms */}

                    <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer pt-0.5">

                        <input
                            type="checkbox"
                            required
                            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />

                        <span>
                            I agree to the{" "}
                            <span className="font-semibold text-blue-600 hover:underline">
                                Terms & Conditions
                            </span>{" "}
                            and{" "}
                            <span className="font-semibold text-blue-600 hover:underline">
                                Privacy Policy
                            </span>
                        </span>

                    </label>

                    {/* Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                {/* Divider */}

                <div className="my-4 flex items-center">

                    <div className="h-px flex-1 bg-slate-200"></div>

                    <span className="mx-3 text-xs font-medium text-slate-400">
                        OR
                    </span>

                    <div className="h-px flex-1 bg-slate-200"></div>

                </div>

                {/* Login */}

                <p className="text-center text-xs sm:text-sm text-slate-600">

                    Already have an account?

                    <Link
                        to="/login"
                        className="ml-1.5 font-semibold text-blue-600 hover:underline"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

};

export default Register;
