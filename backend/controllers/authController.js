import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import { sendOTPEmail } from "../utils/mailService.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConflicts.js";
import { loginSchema, registerSchema } from "../validation/authValidation.js";

export const register = asyncHandler(async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: error.details[0].message
        });
    }
    const { name, email, password, confirmPassword } = req.body;
    const existingUser = await User.findOne({
        where: { email }
    });

    if (existingUser?.isVerified) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: MESSAGES.USER_ALREADY_EXISTS
        });
    }

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const otpExpiry = new Date(
        Date.now() + 10 * 60 * 1000
    );

    if (existingUser) {
        await existingUser.update({ otp, otpExpiry });
        try {
            sendOTPEmail(existingUser.email, otp);
        } catch (error) {
            console.log("Email Error:", error.message);

            return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: MESSAGES.UNABLE_TO_SEND_OTP
            });
        }

        return res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.NEW_OTP_SENT,
            email: existingUser.email,
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,

        isVerified: false,
    });

    try {
        sendOTPEmail(email, otp);
    } catch (error) {
        console.log("Email Error:", error.message);
        await user.destroy();
        return res.status(500).json({
            success: false,
            message: MESSAGES.UNABLE_TO_SEND_OTP
        });
    }

    res.status(STATUS_CODES.CREATED).json({
        success: true,
        message:
            "Registration successful. Please verify your email using the OTP.",
        email: user.email,
    });

});

export const login = asyncHandler(async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: error.details[0].message
        });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: MESSAGES.INVALID_CREDENTIALS
        });
    }

    if (!user.isVerified) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            success: false,
            message: MESSAGES.VERIFY_EMAIL_FIRST
        });
    }

    const match = await bcrypt.compare(
        password,
        user.password
    );

    if (!match) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: MESSAGES.INVALID_CREDENTIALS
        });
    }

    res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.LOGIN_SUCCESSFUL,
        token: generateToken(user.id),
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

export const getProfile = asyncHandler(async (req, res) => {
    res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.PROFILE_FETCHED,
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        }
    });
});

export const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: MESSAGES.USER_NOT_FOUND
        });
    }

    await user.destroy();

    res.status(STATUS_CODES.OK).json({
        success: true,
        message: MESSAGES.USER_DELETED
    });
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll({
        attributes: {
            exclude: ["password", "otp", "otpExpiry"]
        }
    });

    res.status(STATUS_CODES.OK).json({
        success: true,
        users
    });
});

export const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: MESSAGES.USER_NOT_FOUND
        });
    }

    if (user.isVerified) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: MESSAGES.EMAIL_ALREADY_VERIFIED
        });
    }

    if (user.otp !== otp) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: MESSAGES.INVALID_OTP
        });
    }

    if (new Date() > new Date(user.otpExpiry)) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: MESSAGES.OTP_EXPIRED
        });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = generateToken(user.id);

    res.status(STATUS_CODES.CREATED).json({
        success: true,
        message: MESSAGES.EMAIL_VERIFIED_SUCCESSFULLY,
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});

export const resendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: MESSAGES.USER_NOT_FOUND
        });
    }

    if (user.isVerified) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "Email is already verified."
        });
    }

    const otp = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    const otpExpiry = new Date(
        Date.now() + 10 * 60 * 1000
    );

    await user.update({
        otp,
        otpExpiry,
    });

    await sendOTPEmail(email, otp);

    res.status(STATUS_CODES.OK).json({
        success: true,
        message: "A new OTP has been sent to your email.",
        email,
    });
});


export const updateProfile = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "Name is required."
        });
    }
    const user = await User.findByPk(req.user.id);
    if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: MESSAGES.USER_NOT_FOUND
        });
    }
    await user.update({
        name: name.trim()
    });
    return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Profile updated successfully.",
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
});


export const changePassword = asyncHandler(async (req, res) => {
    const {
        currentPassword,
        newPassword,
        confirmPassword
    } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "All password fields are required."
        });
    }
    if (newPassword !== confirmPassword) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "New password and confirm password do not match."
        });
    }
    if (newPassword.length < 8) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "New password must be at least 8 characters."
        });
    }
    const user = await User.findByPk(req.user.id);
    if (!user) {
        return res.status(STATUS_CODES.NOT_FOUND).json({
            success: false,
            message: MESSAGES.USER_NOT_FOUND
        });
    }
    const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
    );
    if (!isPasswordCorrect) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
            success: false,
            message: "Current password is incorrect."
        });
    }
    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );
    await user.update({
        password: hashedPassword
    });
    return res.status(STATUS_CODES.OK).json({
        success: true,
        message: "Password updated successfully."
    });
});