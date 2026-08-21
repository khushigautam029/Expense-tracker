import ChatMessage from "./ChatMessage.js";
import Expense from "./Expense.js";
import Income from "./Income.js";
import Notification from "./Notification.js";
import Source from "./Source.js";
import User from "./User.js";

// One User -> Many Income
User.hasMany(Income, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

Income.belongsTo(User, {
    foreignKey: "userId",
});

// One User -> Many Expense
User.hasMany(Expense, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

Expense.belongsTo(User, {
    foreignKey: "userId",
});

Income.belongsTo(Source, {
    foreignKey: "sourceId",
    as: "source",
});

Source.hasMany(Income, {
    foreignKey: "sourceId",
    as: "incomes",
});


// One User -> Many Notifications
User.hasMany(Notification, {
    foreignKey: "userId",
    onDelete: "CASCADE",
});

Notification.belongsTo(User, {
    foreignKey: "userId",
});

User.hasMany(ChatMessage,{
    foreignKey:"userId",
    onDelete:"CASCADE",
});

ChatMessage.belongsTo(User,{
    foreignKey:"userId",
});

export { ChatMessage, Expense, Income, Notification, Source, User };

