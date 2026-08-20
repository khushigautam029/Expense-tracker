import express from "express";
import { chatWithBot } from "../controllers/chatbotController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/message", authMiddleware, chatWithBot);

export default router;