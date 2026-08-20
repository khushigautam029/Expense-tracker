import { User } from "../models/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    generateOTP,
    generateOTPExpiry
} from "../utils/generateOTP.js";
import generateToken from "../utils/generateToken.js";
import { sendOTPEmail } from "../utils/mailService.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { sendError, sendSuccess } from "../utils/responseHandler.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";
import { transactionHandler } from "../utils/transactionHandler.js";
import { changePasswordSchema, loginSchema, registerSchema, resendOTPSchema, verifyOTPSchema } from "../validation/authValidation.js";

export const register = asyncHandler(async (req, res) => {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.details[0].message
        );
    }
    const { name, email, password } = value;
    let existingUser = await User.findOne({
        where: { email },
    });

    if (existingUser?.isVerified) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            MESSAGES.USER_ALREADY_EXISTS
        );
    }
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    let registeredUser;
    if (existingUser) {
        registeredUser = await User.update({ otp, otpExpiry, });
    } else {
        const hashedPassword = await hashPassword(password);
        registeredUser = await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry,
            isVerified: false,
        });
    }

    sendOTPEmail(email, otp).catch((error) => {
        console.error("OTP Email Error:", error);
    });

    return sendSuccess(
        res,
        STATUS_CODES.CREATED,
        MESSAGES.REGISTRATION_SUCCESSFUL_VERIFY_EMAIL,
        { email: registeredUser.email }
    );
});

export const login = asyncHandler(async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.details[0].message
        );
    }
    const { email, password } = value;
    const user = await User.findOne({
        where: { email },
    });
    if (!user) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            MESSAGES.INVALID_CREDENTIALS
        );
    }
    if (!user.isVerified) {
        return sendError(
            res,
            STATUS_CODES.UNAUTHORIZED,
            MESSAGES.VERIFY_EMAIL_FIRST
        );
    }
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            MESSAGES.INVALID_CREDENTIALS
        );
    }
    const token = generateToken(user.id);
    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.LOGIN_SUCCESSFUL,
        {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    );
});


export const getProfile = asyncHandler(async (req, res) => {
    const { id, name, email } = req.user;
    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.PROFILE_FETCHED,
        { user: { id, name, email } }
    );
});

export const deleteUserById = asyncHandler(async (req, res) => {
    const userId = Number(req.params.id);

    if (userId !== req.user.id) {
        return sendError(
            res,
            STATUS_CODES.FORBIDDEN,
            MESSAGES.ACCESS_DENIED
        );
    }

    const user = await User.findByPk(userId);

    if (!user) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.USER_NOT_FOUND
        );
    }

    await transactionHandler(async (transaction) => {
        await user.destroy({ transaction });
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.USER_DELETED
    );
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.findAll({
        attributes: ["id", "name", "email", "isVerified"]
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.USERS_FETCHED,
        { users }
    );
});

export const verifyOTP = asyncHandler(async (req, res) => {
    const { error, value } = verifyOTPSchema.validate(req.body);

    if (error) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.details[0].message
        );
    }

    const { email, otp } = value;

    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.USER_NOT_FOUND
        );
    }

    if (user.isVerified) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            MESSAGES.EMAIL_ALREADY_VERIFIED
        );
    }

    if (user.otp !== otp) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            MESSAGES.INVALID_OTP
        );
    }

    const isOTPExpired =
        !user.otpExpiry || new Date() > new Date(user.otpExpiry);

    if (isOTPExpired) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            MESSAGES.OTP_EXPIRED
        );
    }

    await user.update({
        isVerified: true,
        otp: null,
        otpExpiry: null
    });

    const token = generateToken(user.id);

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.EMAIL_VERIFIED_SUCCESSFULLY,
        {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    );
});

export const resendOTP = asyncHandler(async (req, res) => {
    const { error, value } = resendOTPSchema.validate(req.body);

    if (error) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.details[0].message
        );
    }

    const { email } = value;

    const user = await User.findOne({
        where: { email }
    });

    if (!user) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.USER_NOT_FOUND
        );
    }

    if (user.isVerified) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            MESSAGES.EMAIL_ALREADY_VERIFIED
        );
    }

    const otp = generateOTP();
    const otpExpiry = generateOTPExpiry();

    await user.update({
        otp,
        otpExpiry
    });

    sendOTPEmail(email, otp).catch((error) => {
        console.error("OTP Email Error:", error);
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        MESSAGES.NEW_OTP_SENT,
        { email }
    );
});

export const updateProfile = asyncHandler(async (req, res) => {
    const name = req.body.name?.trim();
    if (!name) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            "Name is required."
        );
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.USER_NOT_FOUND
        );
    }
    await user.update({ name });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        "Profile updated successfully.",
        {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        }
    );
});

export const changePassword = asyncHandler(async (req, res) => {
    const { error, value } = changePasswordSchema.validate(req.body);

    if (error) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            error.details[0].message
        );
    }

    const { currentPassword, newPassword } = value;

    const user = await User.findByPk(req.user.id);

    if (!user) {
        return sendError(
            res,
            STATUS_CODES.NOT_FOUND,
            MESSAGES.USER_NOT_FOUND
        );
    }

    const isPasswordCorrect = await comparePassword(
        currentPassword,
        user.password
    );

    if (!isPasswordCorrect) {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            "Current password is incorrect."
        );
    }

    const hashedPassword = await hashPassword(newPassword);

    await user.update({
        password: hashedPassword,
    });

    return sendSuccess(
        res,
        STATUS_CODES.OK,
        "Password updated successfully."
    );
});