"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Notifications", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },

            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            message: {
                type: Sequelize.TEXT,
                allowNull: false,
            },

            type: {
                type: Sequelize.ENUM(
                    "income",
                    "expense",
                    "warning",
                    "info",
                    "success"
                ),
                allowNull: false,
                defaultValue: "info",
            },

            isRead: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },

            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("Notifications");
    },
};