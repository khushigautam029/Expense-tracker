import express from "express";
import {
    addIncome,
    deleteIncome,
    getAllIncome,
    getIncomeById,
    updateIncome
} from "../controllers/incomeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addIncome);

router.get("/", authMiddleware, getAllIncome);

router.get("/:id", authMiddleware, getIncomeById);

router.put("/:id", authMiddleware, updateIncome);

router.delete("/:id", authMiddleware, deleteIncome);

export default router;