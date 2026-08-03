import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Expense = sequelize.define(
    "Expense",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        category: {
            type: DataTypes.ENUM(
                "Food",
                "Travel",
                "Shopping",
                "Bills",
                "Health",
                "Education",
                "Entertainment",
                "Investment",
                "Others"
            ),
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

export default Expense;