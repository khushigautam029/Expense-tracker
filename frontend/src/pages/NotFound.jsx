import { ArrowLeft, Home, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 px-6">

            <div className="flex min-h-screen items-center justify-center">

                <div className="w-full max-w-lg text-center">

                    {/* Icon */}
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <SearchX size={38} strokeWidth={1.8} />
                    </div>


                    {/* 404 */}
                    <h1 className="mt-6 text-7xl font-bold tracking-tight text-slate-800">
                        404
                    </h1>


                    {/* Heading */}
                    <h2 className="mt-4 text-2xl font-semibold text-slate-800">
                        Page Not Found
                    </h2>


                    {/* Description */}
                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                        Sorry, the page you're looking for doesn't exist or
                        may have been moved to another location.
                    </p>


                    {/* Buttons */}
                    <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                            <ArrowLeft size={17} />
                            Go Back
                        </button>


                        <button
                            onClick={() => navigate("/dashboard")}
                            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <Home size={17} />
                            Go to Dashboard
                        </button>

                    </div>


                    {/* Footer */}
                    <p className="mt-10 text-xs text-slate-400">
                        Expense Tracker
                    </p>

                </div>

            </div>

        </div>
    );
};

export default NotFound;