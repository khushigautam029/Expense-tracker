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

        sourceId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
);

export default Income;