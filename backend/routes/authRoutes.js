import express from "express";
import {
    deleteUserById,
    getAllUsers,
    getProfile,
    login,
    register,
    resendOTP,
    verifyOTP,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile",authMiddleware, getProfile);
router.get("/users", authMiddleware, getAllUsers);
router.delete("/:id", authMiddleware, deleteUserById);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
export default router;