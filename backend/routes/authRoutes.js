import express from "express";
import {
    changePassword,
    deleteUserById,
    // getAllUsers,
    getProfile,
    login,
    register,
    resendOTP,
    updateProfile,
    verifyOTP
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import loginLimiter, { otpLimiter } from "../utils/rateLimiter.js";

const router = express.Router();
router.post("/register", register);
router.post("/login",loginLimiter, login);
router.get("/profile",authMiddleware, getProfile);
// router.get("/users", authMiddleware, getAllUsers);
router.delete("/:id", authMiddleware, deleteUserById);
router.post("/verify-otp", otpLimiter, verifyOTP);
router.post("/resend-otp", otpLimiter, resendOTP);
router.put("/update-profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;