"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("sources", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            // userId: {
            //     type: Sequelize.INTEGER,
            //     allowNull: false,
            //     references: {
            //         model: "users",
            //         key: "id",
            //     },
            //     onUpdate: "CASCADE",
            //     onDelete: "CASCADE",
            // },

            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },

            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },

            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal(
                    "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
                ),
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("sources");
    },
};