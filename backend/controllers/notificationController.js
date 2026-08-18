import { Notification } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

export const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.findAll({
        where: { userId: req.user.id },
        order: [["createdAt", "DESC"]],
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        null,
        { notifications }
    );
});

export const getUnreadCount = asyncHandler(async (req, res) => {
    const unreadCount = await Notification.count({
        where: {
            userId: req.user.id,
            isRead: false,
        },
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        null,
        { unreadCount }
    );
});

export const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id,
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
    await Notification.update(
        { isRead: true },
        {
            where: {
                userId: req.user.id,
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
    const notification = await Notification.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id,
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
    await Notification.destroy({
        where: { userId: req.user.id },
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.ALL_NOTIFICATION_DELETED_SUCCESSFULLY
    );
});