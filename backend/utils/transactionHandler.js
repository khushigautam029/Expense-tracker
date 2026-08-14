import sequelize from "../config/database.js";


export const transactionHandler = async (callback) => {
    const transaction = await sequelize.transaction();

    try {
        const result = await callback(transaction);

        await transaction.commit();

        return result;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};