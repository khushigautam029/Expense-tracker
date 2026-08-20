import { Notification } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

export const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const notifications = await Notification.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.NOTIFICATION_FETCHED,
        { notifications }
    );
});

export const getUnreadCount = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const unreadCount = await Notification.count({
        where: {
            userId,
            isRead: false,
        },
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.UNREAD_NOTIFICATIONS_COUNT_FETCHED,
        { unreadCount }
    );
});

export const markAsRead = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const notificationId = req.params.id;
    const notification = await Notification.findOne({
        where: {
            id: notificationId,
            userId,
        },
    });

    if (!notification) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.NOTIFICATION_NOT_FOUND
        );
    }

    await notification.update({ isRead: true });
    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.NOTIFICATION_MARKED_AS_READ,
        { notification }
    );
});

export const markAllAsRead = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    await Notification.update(
        { isRead: true },
        {
            where: {
                userId,
                isRead: false,
            },
        }
    );

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.ALL_NOTIFICATION_MARKED_AS_READ
    );
});

export const deleteNotification = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const notificationId = req.params.id;
    const notification = await Notification.findOne({
        where: {
            id: notificationId,
            userId,
        },
    });

    if (!notification) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.NOTIFICATION_NOT_FOUND
        );
    }
    await notification.destroy();
    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.NOTIFICATION_DELETED_SUCCESSFULLY
    );
});

export const deleteAllNotifications = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    await Notification.destroy({
        where: { userId},
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.ALL_NOTIFICATION_DELETED_SUCCESSFULLY
    );
});