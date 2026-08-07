import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import sourceRoutes from "./routes/sourceRoutes.js";
import errorHandler from "./utils/errorHandler.js";
import { MESSAGES } from "./utils/setConflicts.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/sources", sourceRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: MESSAGES.EXPENSE_TACKER_API_RUNNING,
    });
});

// IMPORTANT: Error handler should be after routes
app.use(errorHandler);

export default app;