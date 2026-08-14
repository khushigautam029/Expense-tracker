import { createContext, useContext, useEffect, useState } from "react";

import {
    deleteAllNotifications as deleteAllNotificationsAPI,
    deleteNotification as deleteNotificationAPI,
    getNotifications,
    getUnreadCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../services/notificationService";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Fetch all notifications
    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const response = await getNotifications();

            if (response.success) {
                setNotifications(response.notifications || []);
            }

        } catch (error) {
            if (error.response?.status === 401) return;

            console.error(
                "Failed to fetch notifications:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // Fetch unread count
    const fetchUnreadCount = async () => {
        try {

            const response = await getUnreadCount();

            if (response.success) {
                setUnreadCount(response.unreadCount || 0);
            }

        } catch (error) {
            if (error.response?.status === 401) return;

            console.error(
                "Failed to fetch unread count:",
                error
            );
        }
    };

    // Mark one notification as read
    const markAsRead = async (id) => {
        try {

            const response = await markNotificationAsRead(id);

            if (response.success) {

                setNotifications((prev) =>
                    prev.map((notification) =>
                        notification.id === id
                            ? {
                                ...notification,
                                isRead: true
                            }
                            : notification
                    )
                );

                setUnreadCount((prev) =>
                    Math.max(prev - 1, 0)
                );
            }

            return response;

        } catch (error) {

            console.error(
                "Failed to mark notification as read:",
                error
            );

            throw error;
        }
    };

    // Mark all notifications as read
    const markAllAsRead = async () => {
        try {

            const response =
                await markAllNotificationsAsRead();

            if (response.success) {

                setNotifications((prev) =>
                    prev.map((notification) => ({
                        ...notification,
                        isRead: true
                    }))
                );

                setUnreadCount(0);
            }

            return response;

        } catch (error) {

            console.error(
                "Failed to mark all notifications as read:",
                error
            );

            throw error;
        }
    };

    // Delete one notification
    const removeNotification = async (id) => {
        try {

            const response =
                await deleteNotificationAPI(id);

            if (response.success) {

                setNotifications((prev) =>
                    prev.filter(
                        (notification) =>
                            notification.id !== id
                    )
                );

                // If deleted notification was unread
                const deletedNotification =
                    notifications.find(
                        (notification) =>
                            notification.id === id
                    );

                if (
                    deletedNotification &&
                    !deletedNotification.isRead
                ) {
                    setUnreadCount((prev) =>
                        Math.max(prev - 1, 0)
                    );
                }
            }

            return response;

        } catch (error) {

            console.error(
                "Failed to delete notification:",
                error
            );

            throw error;
        }
    };

    // Delete all notifications
    const removeAllNotifications = async () => {
        try {

            const response =
                await deleteAllNotificationsAPI();

            if (response.success) {
                setNotifications([]);
                setUnreadCount(0);
            }

            return response;

        } catch (error) {

            console.error(
                "Failed to delete all notifications:",
                error
            );

            throw error;
        }
    };

    // Initial fetch
    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) return;

        fetchNotifications();
        fetchUnreadCount();

    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                loading,

                fetchNotifications,
                fetchUnreadCount,

                markAsRead,
                markAllAsRead,

                removeNotification,
                removeAllNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {

    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error(
            "useNotifications must be used inside NotificationProvider"
        );
    }

    return context;
};
