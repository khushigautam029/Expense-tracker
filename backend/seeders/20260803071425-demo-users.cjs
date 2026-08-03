"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        name: "Elvish Gautam",
        email: "elvish@gmail.com",
        password: "$2a$10$abcdefghijklmnopqrstuv123456789012345678901234567890",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        password: "$2a$10$abcdefghijklmnopqrstuv123456789012345678901234567890",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};