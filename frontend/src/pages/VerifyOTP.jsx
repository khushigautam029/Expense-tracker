import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { errorToast } from "../utils/swal";

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || sessionStorage.getItem("verificationEmail") || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResendOTP = async () => {
        try {
            await resendOTP(email);

            successAlert(
                "OTP Sent",
                "A new OTP has been sent to your email."
            );

        } catch (error) {
            errorToast(
                "Failed",
                error.response?.data?.message || "Unable to resend OTP."
            );
        }
    };

    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        }

        setCanResend(true);
    }, [timer]);

    const handleVerify = async (e) => {
        e.preventDefault();

        if (!email) {
            alert("Please register again so we know where to verify the OTP.");
            navigate("/register", { replace: true });
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            alert("Please enter the 6-digit OTP from your email.");
            return;
        }

        try {
            setLoading(true);

            const response = await API.post("/auth/verify-otp", {
                email,
                otp,
            });

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );
            sessionStorage.removeItem("verificationEmail");

            alert(response.data.message);

            navigate("/dashboard");
        } catch (error) {
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("Server Error");
            }
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

                <div className="mb-8 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <ShieldCheck
                            size={30}
                            className="text-blue-600"
                        />
                    </div>

                    <h1 className="mt-4 text-3xl font-bold text-slate-800">
                        Verify OTP
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Enter the OTP sent to
                    </p>

                    <p className="font-semibold text-blue-600">
                        {email}
                    </p>

                </div>

                <form
                    onSubmit={handleVerify}
                    className="space-y-5"
                >

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-600">
                            OTP
                        </label>

                        <input
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                            maxLength={6}
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-center text-lg tracking-[8px] outline-none focus:border-blue-500"
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {loading
                            ? "Verifying..."
                            : "Verify OTP"}
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Didn't receive the OTP?
                </p>

                <button
                    onClick={handleResendOTP}
                    disabled={!canResend}
                    className={`mt-4 w-full rounded-lg py-2 font-medium transition
                    ${canResend
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "cursor-not-allowed bg-slate-300 text-slate-600"
                        }`}
                >
                    {canResend
                        ? "🔄 Resend OTP"
                        : `⏳ Resend in ${timer}s`}
                </button>

            </div>

        </div>
    );
};

export default VerifyOTP;
