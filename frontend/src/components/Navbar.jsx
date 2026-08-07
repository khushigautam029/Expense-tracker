import { Bell, ChevronDown, LogOut, Moon, Search, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getProfile } from "../services/authService";

const Navbar = ({ collapsed = false }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const dropdownRef = useRef(null);

    const [user, setUser] = useState({
        name: "",
        email: ""
    });

    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchUser = async () => {
        try {
            const response = await getProfile();
            if (response.success) {
                setUser(response.user);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.user)
                );
            }
        } catch (error) {
            console.error("Profile Error:", error);
            const localUser = JSON.parse(
                localStorage.getItem("user")
            );
            if (localUser) {
                setUser(localUser);
            }
        }
    };

    const goToProfile = () => {
        setDropdownOpen(false);
        navigate("/profile");
    };

    const handleLogout = () => {
        setDropdownOpen(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };



    return (
        <header
            className={`fixed top-0 right-0 z-30 h-[72px]
            border-b
            border-slate-200
            dark:border-slate-700
            bg-white
            dark:bg-slate-900
            transition-all
            duration-300

    ${collapsed ? "left-[76px]" : "left-[240px]"}`}
        >
            <div className="flex h-full items-center justify-between px-6">
                {/* Search */}
                <div
                    className="flex w-[320px] items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-2.5 transition-colors duration-300"
                >    <Search
                        size={18}
                        className="text-slate-400 dark:text-slate-500" />
                    <input
                        type="search"
                        placeholder="Search transactions..."
                        autoComplete="off"
                        spellCheck={false}
                        className=" w-full bg-transparent text-sm text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"/>
                </div>

                {/* Right Items */}
                <div className="flex items-center gap-5">
                    {/* Notification */}
                    <button className=" relative text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition">
                        <Bell size={20} />
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-400"></span>
                    </button>

                    {/* User Profile Dropdown Container */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 rounded-lg p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                                {user.name ? (
                                    user.name.charAt(0).toUpperCase()
                                ) : (
                                    <User size={18} />
                                )}
                            </div>
                            <div className="hidden text-left sm:block">
                                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                    {user.name || "Guest"}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {user.email || "guest@example.com"}
                                </p>
                            </div>
                            <ChevronDown
                                size={16}
                                className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className=" absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-lg transition-all z-50">
                                {/* Header / User Info */}
                                <div className="border-b border-slate-100 px-3 py-2.5">
                                    <p className="text-sm font-semibold border-slate-100 dark:border-slate-700">
                                        {user.name || "Guest User"}
                                    </p>
                                    <p className="text-xs text-slate-800 dark:text-white truncate">
                                        {user.email || "guest@example.com"}
                                    </p>
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    {/* View Profile */}
                                    <button
                                        onClick={goToProfile}
                                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                                    >
                                        <User size={17} className="text-slate-500 dark:text-slate-400" />
                                        <span>Profile Details</span>
                                    </button>

                                    {/* Dark Mode Toggle */}
                                    <div className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
                                        <div className="flex items-center gap-3">
                                            <Moon size={17} className="text-slate-500 dark:text-slate-400" />
                                            <span>Dark Mode</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={toggleTheme}
                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${theme === "dark" ? "bg-blue-600" : "bg-slate-200"
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${theme === "dark" ? "translate-x-4.5" : "translate-x-1"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                >
                                    <LogOut size={17} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;