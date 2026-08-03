import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Income = sequelize.define(
    "Income",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        source: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        timestamps: true,
    }
);

export default Income;