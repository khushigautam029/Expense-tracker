import {
    Bell,
    Check,
    ChevronDown,
    LogOut,
    Moon,
    Search,
    Trash2,
    User,
    X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getProfile } from "../services/authService";
import {
    deleteAllNotifications,
    deleteNotification,
    getNotifications,
    getUnreadCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../services/notificationService";

const Navbar = ({ collapsed = false }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const dropdownRef = useRef(null);
    const notificationRef = useRef(null);
    const [user, setUser] = useState({
        name: "",
        email: ""
    });

    // const {
    //     unreadCount,
    // } = useNotifications();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [notificationLoading, setNotificationLoading] = useState(false);

    useEffect(() => {
        fetchUser();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000);
        return () => clearInterval(interval);
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
            if (error.response?.status === 401) {
                return;
            }

            console.error("Profile Error:", error);
            const storedUser = localStorage.getItem("user");
            let localUser = null;

            try {
                localUser = storedUser ? JSON.parse(storedUser) : null;
            } catch {
                localStorage.removeItem("user");
            }

            if (localUser) {
                setUser(localUser);
            }
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await getUnreadCount();
            if (response.success) {
                setUnreadCount(response.unreadCount);
            }
        } catch (error) {
            if (error.response?.status === 401) return;

            console.error("Unread Notification Error:", error);
        }
    };

   
    const fetchNotifications = async () => {
        try {
            setNotificationLoading(true);
            const response = await getNotifications();
            if (response.success) {
                setNotifications(response.notifications);
            }
        } catch (error) {
            console.error("Notification Error:", error);
        }
        finally {
            setNotificationLoading(false);
        }
    };

    const handleNotificationClick = () => {
        setNotificationOpen(!notificationOpen);
        if (!notificationOpen) {
            fetchNotifications();
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            const response = await markNotificationAsRead(id);
            if (response.success) {
                setNotifications((prev) =>
                    prev.map((notification) =>
                        notification.id === id
                            ? { ...notification, isRead: true }
                            : notification
                    )
                );
                setUnreadCount((prev) => Math.max(prev - 1, 0));
            }
        } catch (error) {
            console.error("Mark Notification Error:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const response = await markAllNotificationsAsRead();

            if (response.success) {
                setNotifications((prev) =>
                    prev.map((notification) => ({
                        ...notification,
                        isRead: true,
                    }))
                );

                setUnreadCount(0);
            }

        } catch (error) {
            console.error("Mark All Notifications Error:", error);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            const notification = notifications.find(
                (item) => item.id === id
            );

            const response = await deleteNotification(id);

            if (response.success) {
                setNotifications((prev) =>
                    prev.filter((item) => item.id !== id)
                );

                if (notification && !notification.isRead) {
                    setUnreadCount((prev) => Math.max(prev - 1, 0));
                }
            }

        } catch (error) {
            console.error("Delete Notification Error:", error);
        }
    };

    const handleDeleteAllNotifications = async () => {
        try {
            const response = await deleteAllNotifications();

            if (response.success) {
                setNotifications([]);
                setUnreadCount(0);
            }

        } catch (error) {
            console.error("Delete All Notifications Error:", error);
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case "income":
                return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";

            case "expense":
                return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";

            case "warning":
                return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";

            case "success":
                return "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400";

            default:
                return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
        }
    };


    const formatNotificationTime = (date) => {
        const notificationDate = new Date(date);
        const now = new Date();

        const difference = Math.floor(
            (now - notificationDate) / 1000
        );

        if (difference < 60) {
            return "Just now";
        }

        if (difference < 3600) {
            return `${Math.floor(difference / 60)} min ago`;
        }

        if (difference < 86400) {
            return `${Math.floor(difference / 3600)} hr ago`;
        }

        if (difference < 604800) {
            return `${Math.floor(difference / 86400)} days ago`;
        }

        return notificationDate.toLocaleDateString("en-IN");
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
                        className=" w-full bg-transparent text-sm text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none" />
                </div>

                {/* Right Items */}
                <div className="flex items-center gap-5">
                    {/* Notification */}
                    <div className="relative" ref={notificationRef}>

                        <button
                            onClick={handleNotificationClick}
                            className="relative text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
                        >
                            <Bell size={20} />

                            {unreadCount > 0 && (
                                <span
                                    className="
                    absolute
                    -right-2
                    -top-2
                    min-w-[18px]
                    h-[18px]
                    px-1
                    rounded-full
                    bg-red-500
                    text-white
                    text-[10px]
                    font-bold
                    flex
                    items-center
                    justify-center
                "
                                >
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {notificationOpen && (
                            <div
                                className="
                absolute
                right-0
                mt-4
                w-[380px]
                rounded-xl
                border
                border-slate-200
                dark:border-slate-700
                bg-white
                dark:bg-slate-900
                shadow-xl
                z-50
                overflow-hidden
            "
                            >

                                {/* Header */}
                                <div
                                    className="
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3
                    border-b
                    border-slate-200
                    dark:border-slate-700
                "
                                >
                                    <div>
                                        <h3 className="font-semibold text-slate-800 dark:text-white">
                                            Notifications
                                        </h3>

                                        <p className="text-xs text-slate-400 mt-1">
                                            {unreadCount} unread notification
                                            {unreadCount !== 1 ? "s" : ""}
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleMarkAllAsRead}
                                        disabled={unreadCount === 0}
                                        className="
                        flex
                        items-center
                        gap-1
                        text-xs
                        text-blue-600
                        hover:text-blue-700
                        disabled:text-slate-300
                        disabled:cursor-not-allowed
                    "
                                    >
                                        <Check size={14} />
                                        Mark all read
                                    </button>
                                </div>

                                {/* Notifications */}
                                <div className="max-h-[400px] overflow-y-auto">

                                    {notificationLoading ? (

                                        <div className="py-10 text-center">
                                            <p className="text-sm text-slate-400">
                                                Loading notifications...
                                            </p>
                                        </div>

                                    ) : notifications.length === 0 ? (

                                        <div className="py-10 text-center">
                                            <Bell
                                                size={30}
                                                className="mx-auto text-slate-300 dark:text-slate-600"
                                            />

                                            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                                                No notifications
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                You're all caught up!
                                            </p>
                                        </div>

                                    ) : (

                                        notifications.map((notification) => (

                                            <div
                                                key={notification.id}
                                                className={`
                                group
                                flex
                                gap-3
                                px-4
                                py-3
                                border-b
                                border-slate-100
                                dark:border-slate-800
                                transition
                                hover:bg-slate-50
                                dark:hover:bg-slate-800/50

                                ${!notification.isRead
                                                        ? "bg-blue-50/50 dark:bg-blue-900/10"
                                                        : ""
                                                    }
                            `}
                                            >

                                                {/* Icon */}
                                                <div
                                                    className={`
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    ${getNotificationColor(notification.type)}
                                `}
                                                >
                                                    <Bell size={16} />
                                                </div>

                                                {/* Content */}
                                                <div
                                                    className="flex-1 cursor-pointer"
                                                    onClick={() => {
                                                        if (!notification.isRead) {
                                                            handleMarkAsRead(notification.id);
                                                        }
                                                    }}
                                                >

                                                    <div className="flex items-start justify-between gap-2">

                                                        <p
                                                            className={`
                                            text-sm
                                            ${!notification.isRead
                                                                    ? "font-semibold text-slate-800 dark:text-white"
                                                                    : "font-medium text-slate-600 dark:text-slate-300"
                                                                }
                                        `}
                                                        >
                                                            {notification.title}
                                                        </p>

                                                        {!notification.isRead && (
                                                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500"></span>
                                                        )}

                                                    </div>

                                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                        {notification.message}
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-slate-400">
                                                        {formatNotificationTime(notification.createdAt)}
                                                    </p>

                                                </div>

                                                {/* Delete */}
                                                <button
                                                    onClick={() =>
                                                        handleDeleteNotification(notification.id)
                                                    }
                                                    className="
                                    self-start
                                    opacity-0
                                    group-hover:opacity-100
                                    text-slate-400
                                    hover:text-red-500
                                    transition
                                "
                                                    title="Delete notification"
                                                >
                                                    <X size={15} />
                                                </button>

                                            </div>

                                        ))

                                    )}

                                </div>

                                {/* Footer */}
                                {notifications.length > 0 && (
                                    <div
                                        className="
                        flex
                        justify-end
                        px-4
                        py-2
                        border-t
                        border-slate-200
                        dark:border-slate-700
                    "
                                    >
                                        <button
                                            onClick={handleDeleteAllNotifications}
                                            className="
                            flex
                            items-center
                            gap-1
                            text-xs
                            text-red-500
                            hover:text-red-600
                        "
                                        >
                                            <Trash2 size={14} />
                                            Clear all
                                        </button>
                                    </div>
                                )}

                            </div>
                        )}

                    </div>

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
                                    <p className="text-sm font-semibold border-slate-100 dark:border-slate-700 dark:text-white ">
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
