import { Notification } from "../models/index.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConflicts.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: {
                userId: req.user.id,
            },
            order: [["createdAt", "DESC"]],
        });

        return res.status(STATUS_CODES.OK).json({
            success: true,
            notifications,
        });

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};


export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.count({
            where: {
                userId: req.user.id,
                isRead: false,
            },
        });

        return res.status(STATUS_CODES.OK).json({
            success: true,
            unreadCount: count,
        });

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};


export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });
        if (!notification) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: MESSAGES.NOTIFICATION_NOT_FOUND
            });
        }
        await notification.update({
            isRead: true,
        });
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.NOTIFICATION_MARKED_AS_READ,
            notification,
        });
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};


export const markAllAsRead = async (req, res) => {
    try {
        await Notification.update(
            {
                isRead: true,
            },
            {
                where: {
                    userId: req.user.id,
                    isRead: false,
                },
            }
        );
        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.ALL_NOTIFICATION_MARKED_AS_READ,
        });
    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};


export const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });

        if (!notification) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                success: false,
                message: MESSAGES.NOTIFICATION_NOT_FOUND,
            });
        }

        await notification.destroy();

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.NOTIFICATION_DELETED_SUCCESSFULLY,
        });

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteAllNotifications = async (req, res) => {
    try {
        await Notification.destroy({
            where: {
                userId: req.user.id,
            },
        });

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.ALL_NOTIFICATION_DELETED_SUCCESSFULLY
        });

    } catch (error) {
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
};