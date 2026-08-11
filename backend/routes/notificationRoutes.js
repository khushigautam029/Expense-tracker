import express from "express";

import {
    deleteAllNotifications,
    deleteNotification,
    getNotifications,
    getUnreadCount,
    markAllAsRead,
    markAsRead,
} from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
// Get all notifications
router.get("/", authMiddleware, getNotifications);
// Get unread notification count
router.get("/unread-count", authMiddleware, getUnreadCount);
// Mark all as read
router.put("/read-all", authMiddleware, markAllAsRead);
// Mark one notification as read
router.put("/:id/read", authMiddleware, markAsRead);
// Delete all notifications
router.delete("/", authMiddleware, deleteAllNotifications);
// Delete one notification
router.delete("/:id", authMiddleware, deleteNotification);

export default router;