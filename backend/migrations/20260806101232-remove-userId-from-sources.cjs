"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn("sources", "userId");
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn("sources", "userId", {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        });
    },
};