import { Notification } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConflicts.js";

export const getNotifications = asyncHandler(async (req, res) => {
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
});

export const getUnreadCount = asyncHandler(async (req, res) => {
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
});

export const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!notification) {
        const error = new Error(MESSAGES.NOTIFICATION_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    await notification.update({
        isRead: true,
    });

    return res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.NOTIFICATION_MARKED_AS_READ,
        notification,
    });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
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
});

export const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id,
        },
    });

    if (!notification) {
        const error = new Error(MESSAGES.NOTIFICATION_NOT_FOUND);
        error.statusCode = STATUS_CODES.NOT_FOUND;
        throw error;
    }

    await notification.destroy();

    return res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.NOTIFICATION_DELETED_SUCCESSFULLY,
    });
});

export const deleteAllNotifications = asyncHandler(async (req, res) => {
    await Notification.destroy({
        where: {
            userId: req.user.id,
        },
    });

    return res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.ALL_NOTIFICATION_DELETED_SUCCESSFULLY,
    });
});