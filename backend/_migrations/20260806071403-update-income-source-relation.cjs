"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {

        // Remove old source column
        await queryInterface.removeColumn(
            "incomes",
            "source"
        );

        // Add new sourceId column
        await queryInterface.addColumn(
            "incomes",
            "sourceId",
            {
                type: Sequelize.INTEGER,
                allowNull: true,

                references: {
                    model: "sources",
                    key: "id",
                },

                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            }
        );

    },

    async down(queryInterface, Sequelize) {

        // Remove sourceId
        await queryInterface.removeColumn(
            "incomes",
            "sourceId"
        );

        // Restore source column
        await queryInterface.addColumn(
            "incomes",
            "source",
            {
                type: Sequelize.STRING,
                allowNull: false,
            }
        );

    },
};