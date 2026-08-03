import { Eye, EyeOff, Lock, Mail, Wallet } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { validateEmail, validatePassword } from "../utils/validation";

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        if (name === "email") {
            setErrors((prev) => ({
                ...prev,
                email: validateEmail(value),
            }));
        }
        if (name === "password") {
            setErrors((prev) => ({
                ...prev,
                password: validatePassword(value),
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {
            email: validateEmail(form.email),
            password: validatePassword(form.password),
        };
        setErrors(validationErrors);
        const hasError = Object.values(validationErrors).some(
            (error) => error !== ""
        );
        if (hasError) return;
        setLoading(true);
        try {
            const response = await API.post(
                "/auth/login",
                form
            );
            localStorage.setItem(
                "token",
                response.data.token
            );
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );
            alert(response.data.message);
            navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message;
                if (message === "Invalid Credentials") {
                    setErrors({
                        email: "Invalid Credentials",
                        password: "Invalid Credentials",
                    });
                } else {
                    alert(message);
                }
            } else {
                alert("Server Error");
            }
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
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
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Login to your Expense Tracker account
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

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
                                autoComplete="email"
                                value={form.email}
                                onChange={handleChange}
                                className={`w-full rounded-lg border py-3 pl-10 pr-3 text-sm outline-none transition 
                                ${errors.email
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-300 focus:border-blue-500"
                                    }`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>
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
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={form.password}
                                onChange={handleChange}
                                className={`w-full rounded-lg border py-3 pl-10 pr-12 text-sm outline-none transition
                                ${errors.password
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-slate-300 focus:border-blue-500"
                                    }`}
                            />

                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            >

                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}

                            </button>

                        </div>

                    </div>


                    {/* Remember */}

                    <div className="flex items-center justify-between">

                        <label className="flex items-center gap-2 text-sm text-slate-600">

                            <input
                                type="checkbox"
                                className="rounded"
                            />

                            Remember Me

                        </label>

                        <button
                            type="button"
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            Forgot Password?
                        </button>

                    </div>


                    {/* Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                    >
                        {loading ? "Logging In..." : "Login"}
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

                {/* Register */}
                <p className="text-center text-sm text-slate-600">
                    Don't have an account?
                    <Link
                        to="/register"
                        className="ml-2 font-semibold text-blue-600 hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;