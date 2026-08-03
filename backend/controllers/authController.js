import bcrypt from "bcryptjs";
import { User } from "../models/index.js";
import generateToken from "../utils/generateToken.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConflicts.js";
import { loginSchema, registerSchema } from "../validation/authValidation.js";

export const register = async (req, res) => {
    // console.log(req.body);
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: error.details[0].message
            });
        }

        const { name, email, password , confirmPassword} = req.body;

        const existingUser = await User.findOne({
            where: { email }
        });

        if (existingUser) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.USER_ALREADY_EXISTS
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(STATUS_CODES.CREATED).json({
            success: true,
            message: MESSAGES.USER_REGISTERED,
            token: generateToken(user.id),
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {

        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message
        });

    }
};


export const login = async (req, res) => {
    try {
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

    } catch (err) {

        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: err.message
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        res.status(STATUS_CODES.OK).json({
            success: true,
            message: MESSAGES.PROFILE_FETCHED,
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email
            }
        });
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
};