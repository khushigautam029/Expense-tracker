import Expense from "./Expense.js";
import Income from "./Income.js";
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

export { Expense, Income, User };
