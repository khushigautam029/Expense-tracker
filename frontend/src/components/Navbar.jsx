import { Bell, LogOut, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/authService";

const Navbar = ({ collapsed }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: ""
    });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await getProfile();
            if (response.success) {
                setUser(response.user);
                // Update localStorage also
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.user)
                );
            }
        } catch (error) {
            console.error("Profile Error:", error);
            // Fallback to localStorage
            const localUser = JSON.parse(
                localStorage.getItem("user")
            );
            if (localUser) {
                setUser(localUser);
            }
        }
    };

    const goToProfile = () => {
        navigate("/profile");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <header
            className={`fixed top-0 right-0 z-30 h-[72px] border-b border-slate-200 bg-white transition-all duration-300 ${
                collapsed ? "left-[76px]" : "left-[240px]"
            }`}
        >
            <div className="flex h-full items-center justify-between px-6">
                {/* Search */}
                <div className="flex w-[320px] items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
                    <Search
                        size={18}
                        className="text-slate-400"
                    />
                    <input
                        type="search"
                        placeholder="Search transactions..."
                        autoComplete="off"
                        spellCheck={false}
                        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                    />
                </div>
                {/* Right */}
                <div className="flex items-center gap-5">
                    {/* Notification */}
                    <button className="relative text-slate-500 transition hover:text-slate-800">
                        <Bell size={20} />
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-400"></span>
                    </button>
                    {/* User */}
                    <button
                        onClick={goToProfile}
                        className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-slate-100"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                            {user.name ? (
                                user.name.charAt(0).toUpperCase()
                            ) : (
                                <User size={18} />
                            )}
                        </div>
                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-semibold text-slate-800">
                                {user.name || "Guest"}
                            </p>
                            <p className="text-xs text-slate-500">
                                {user.email || "guest@example.com"}
                            </p>
                        </div>
                    </button>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={17} />
                        <span className="hidden sm:inline">
                            Logout
                        </span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;