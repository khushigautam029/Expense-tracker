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

        // Name max 30 chars
        if (name === "name" && value.length > 30) {
            return;
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

        const validationErrors = {

            name: validateName(form.name),

            email: validateEmail(form.email),

            password: validatePassword(form.password),

            confirmPassword:
                validateConfirmPassword(
                    form.password,
                    form.confirmPassword
                ),

        };

        setErrors(validationErrors);

        const hasError =
            Object.values(validationErrors).some(
                (error) => error !== ""
            );

        if (hasError) {
            return;
        }

        setLoading(true);

        try {

            const response = await API.post(
                "/auth/register",
                form
            );

            alert(response.data.message);

            setForm({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            navigate("/login");

        } catch (error) {

            if (error.response) {

                alert(
                    error.response.data.message
                );

            } else {

                alert("Registration Failed");

            }

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">

            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

                {/* Logo */}

                <div className="mb-8 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">

                        <Wallet
                            size={30}
                            className="text-blue-600"
                        />

                    </div>

                    <h1 className="mt-4 text-3xl font-bold text-slate-800">
                        Create Account
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Sign up to start tracking your expenses
                    </p>

                </div>

                {/* Form */}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Name */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-600">
                            Full Name
                        </label>

                        <div className="relative">

                            <User
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={form.name}
                                onChange={handleChange}
                                className={`w-full rounded-lg border py-3 pl-10 pr-3 text-sm outline-none transition
                                ${errors.name
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-300 focus:border-blue-500"
                                    }`}
                            />

                        </div>

                        <div className="mt-1 flex justify-between">

                            {errors.name ? (
                                <p className="text-sm text-red-500">
                                    {errors.name}
                                </p>
                            ) : (
                                <span />
                            )}

                            <span
                                className={`text-xs ${form.name.length === 30
                                        ? "text-red-500"
                                        : "text-slate-400"
                                    }`}
                            >
                                {form.name.length}/30
                            </span>

                        </div>

                    </div>

                    {/* Email */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-600">
                            Email Address
                        </label>

                        <div className="relative">

                            <Mail
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                className={`w-full rounded-lg border py-3 pl-10 pr-3 text-sm outline-none transition
                                ${errors.email
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-300 focus:border-blue-500"
                                    }`}
                            />

                        </div>

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.email}
                            </p>
                        )}

                    </div>

                    {/* Password */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-600">
                            Password
                        </label>

                        <div className="relative">

                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create Password"
                                autoComplete="new-password"
                                value={form.password}
                                onChange={handleChange}
                                className={`w-full rounded-lg border py-3 pl-10 pr-12 text-sm outline-none transition
                                ${errors.password
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-300 focus:border-blue-500"
                                    }`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                        </div>

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password}
                            </p>
                        )}

                    </div>

                    {/* Confirm Password */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-600">
                            Confirm Password
                        </label>

                        <div className="relative">

                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                                className={`w-full rounded-lg border py-3 pl-10 pr-12 text-sm outline-none transition
                                ${errors.confirmPassword
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-300 focus:border-blue-500"
                                    }`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                        </div>

                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.confirmPassword}
                            </p>
                        )}

                    </div>

                    {/* Terms */}

                    <label className="flex items-start gap-2 text-sm text-slate-600">

                        <input
                            type="checkbox"
                            required
                            className="mt-1"
                        />

                        <span>
                            I agree to the{" "}
                            <span className="font-semibold text-blue-600">
                                Terms & Conditions
                            </span>{" "}
                            and{" "}
                            <span className="font-semibold text-blue-600">
                                Privacy Policy
                            </span>
                        </span>

                    </label>

                    {/* Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                {/* Divider */}

                <div className="my-6 flex items-center">

                    <div className="h-px flex-1 bg-slate-200"></div>

                    <span className="mx-4 text-xs text-slate-400">
                        OR
                    </span>

                    <div className="h-px flex-1 bg-slate-200"></div>

                </div>

                {/* Login */}

                <p className="text-center text-sm text-slate-600">

                    Already have an account?

                    <Link
                        to="/login"
                        className="ml-2 font-semibold text-blue-600 hover:underline"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

};

export default Register;