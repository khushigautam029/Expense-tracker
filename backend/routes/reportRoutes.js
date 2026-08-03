import express from "express";
import {
    downloadExcel,
    downloadPDF,
    getReport,
} from "../controllers/reportController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get report data
router.get("/", authMiddleware, getReport);

router.get("/pdf", authMiddleware, downloadPDF);

router.get("/excel", authMiddleware, downloadExcel);

export default router;

