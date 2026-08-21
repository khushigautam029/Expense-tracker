import express from "express";
import { chatWithBot, getChatHistory } from "../controllers/chatbotController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/message", authMiddleware, chatWithBot);
router.get("/history",authMiddleware,getChatHistory);

export default router;