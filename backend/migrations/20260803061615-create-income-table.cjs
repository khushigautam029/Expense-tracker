"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {

        await queryInterface.createTable("New_Incomes", {

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

            source: {
                type: Sequelize.STRING,
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

        await queryInterface.dropTable("New_Incomes");

    },
};