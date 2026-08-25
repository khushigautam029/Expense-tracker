import express from "express";

import authRoutes from "./authRoutes.js";
import chatbotRoutes from "./chatbotRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import expenseRoutes from "./expenseRoutes.js";
import incomeRoutes from "./incomeRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import reportRoutes from "./reportRoutes.js";
import sourceRoutes from "./sourceRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/income", incomeRoutes);
router.use("/expenses", expenseRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reports", reportRoutes);
router.use("/sources", sourceRoutes);
router.use("/notifications", notificationRoutes);
router.use("/chatbot", chatbotRoutes);

export default router;