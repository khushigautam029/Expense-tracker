import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Source = sequelize.define(
    "Source",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        tableName: "sources",
    }
);

export default Source;