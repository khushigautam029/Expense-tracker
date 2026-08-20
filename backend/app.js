import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRoutes from "./routes/authRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import sourceRoutes from "./routes/sourceRoutes.js";
import errorHandler from "./utils/errorHandler.js";
import { generalLimiter } from "./utils/rateLimiter.js";
import { MESSAGES } from "./utils/setConstants.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(generalLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/sources", sourceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: MESSAGES.EXPENSE_TACKER_API_RUNNING,
    });
});

app.use(errorHandler);

export default app;