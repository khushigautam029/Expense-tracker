"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "otp", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "otpExpiry", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "isVerified", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "otp");
    await queryInterface.removeColumn("users", "otpExpiry");
    await queryInterface.removeColumn("users", "isVerified");
  },
};