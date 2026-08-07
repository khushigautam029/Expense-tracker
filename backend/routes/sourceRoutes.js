import express from "express";
import {
    addSource,
    getSources,
} from "../controllers/sourceController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", authMiddleware, getSources);
router.post("/", authMiddleware, addSource);
export default router;