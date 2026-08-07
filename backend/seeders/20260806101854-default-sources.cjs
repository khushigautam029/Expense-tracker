"use strict";

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert("sources", [
            {
                name: "Salary",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Freelancing",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Business",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Investment",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Bonus",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Interest",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Gift",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Rental Income",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Refund",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Other",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete("sources", null, {});
    },
};