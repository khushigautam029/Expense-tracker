import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    addExpense,
    deleteExpense,
    getAllExpenses,
    getExpenseById,
    updateExpense,
} from "../controllers/expenseController.js";

const router = express.Router();
router.post("/", authMiddleware, addExpense);
router.get("/", authMiddleware, getAllExpenses);
router.get("/:id", authMiddleware, getExpenseById);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);
export default router;