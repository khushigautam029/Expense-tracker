"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.createTable("New_Expenses", {

            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            amount: {
                type: Sequelize.DECIMAL(10,2),
                allowNull: false,
            },

            category: {
                type: Sequelize.ENUM(
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
                type: Sequelize.DATEONLY,
                allowNull: false,
            },

            notes: {
                type: Sequelize.TEXT,
            },

            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
                onDelete: "CASCADE",
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },

        });

    },

    async down(queryInterface) {

        await queryInterface.dropTable("New_Expenses");

    },
};