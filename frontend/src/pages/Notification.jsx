import {
    Bell,
    CheckCheck,
    Trash2,
} from "lucide-react";

import { useNotifications } from "../context/NotificationContext";

const Notifications = () => {

    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        removeNotification,
        removeAllNotifications,
    } = useNotifications();

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between mt-15">

                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                        Notifications
                    </h1>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Stay updated with your income and expenses.
                    </p>
                </div>

                <div className="flex items-center gap-3">

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
                        >
                            <CheckCheck size={17} />
                            Mark all as read
                        </button>
                    )}

                    {notifications.length > 0 && (
                        <button
                            onClick={removeAllNotifications}
                            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                        >
                            <Trash2 size={17} />
                            Delete all
                        </button>
                    )}

                </div>

            </div>

            {/* Notification List */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">

                {loading ? (

                    <div className="p-10 text-center text-sm text-slate-500">
                        Loading notifications...
                    </div>

                ) : notifications.length === 0 ? (

                    <div className="flex flex-col items-center justify-center p-12 text-center">

                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                            <Bell
                                size={24}
                                className="text-slate-400"
                            />
                        </div>

                        <h2 className="text-base font-semibold text-slate-700 dark:text-white">
                            No notifications
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            You're all caught up!
                        </p>

                    </div>

                ) : (

                    <div className="divide-y divide-slate-100 dark:divide-slate-700">

                        {notifications.map((notification) => (

                            <div
                                key={notification.id}
                                className={`flex items-start justify-between gap-4 p-5 transition ${
                                    notification.isRead
                                        ? "bg-white dark:bg-slate-800"
                                        : "bg-blue-50/50 dark:bg-blue-900/10"
                                }`}
                            >

                                <div className="flex gap-4">

                                    {/* Icon */}
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                            notification.type === "income"
                                                ? "bg-green-100 text-green-600"
                                                : notification.type === "expense"
                                                ? "bg-red-100 text-red-600"
                                                : notification.type === "warning"
                                                ? "bg-yellow-100 text-yellow-600"
                                                : "bg-blue-100 text-blue-600"
                                        }`}
                                    >
                                        <Bell size={18} />
                                    </div>

                                    {/* Content */}
                                    <div>

                                        <div className="flex items-center gap-2">

                                            <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                                                {notification.title}
                                            </h3>

                                            {!notification.isRead && (
                                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                            )}

                                        </div>

                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            {notification.message}
                                        </p>

                                        <p className="mt-2 text-xs text-slate-400">
                                            {new Date(
                                                notification.createdAt
                                            ).toLocaleString("en-IN")}
                                        </p>

                                    </div>

                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">

                                    {!notification.isRead && (

                                        <button
                                            onClick={() =>
                                                markAsRead(
                                                    notification.id
                                                )
                                            }
                                            className="rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                                        >
                                            Mark read
                                        </button>

                                    )}

                                    <button
                                        onClick={() =>
                                            removeNotification(
                                                notification.id
                                            )
                                        }
                                        className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                                    >
                                        <Trash2 size={16} />
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default Notifications;