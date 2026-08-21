import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ChatMessage = sequelize.define(
    "ChatMessage",{
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false,
        },
        role:{
            type:DataTypes.TEXT,
            allowNull:false,
        },
        content:{
            type: DataTypes.TEXT,
            allowNull:false,
        },
    },{
        timestamps:true,
        indexes:[
            {
                fields:["userId"],
            },
        ],
    }
);

export default ChatMessage;