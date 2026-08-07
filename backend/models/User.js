import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        otpExpiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },

        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        timestamps: true,
    }
);

export default User;